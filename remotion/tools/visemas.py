"""
Gera as formas de boca (visemas) do português a partir do words.json (Whisper)
e do rms.json (volume por quadro), sem programa externo.

Uso:
    python3 tools/visemas.py --words src/data/v07/words.json --rms src/data/v07/rms.json \
        --trechos 0:3.52,87.72:91.65 --gap 0.45 --saida out/visemas_teste.json

Saída: lista por quadro (30 fps) com os pesos dos shape keys do Lauro 3D:
    abrir, largo, redondo, apertar, fv, sorriso, labio_cima, labio_baixo

Regras (português do Brasil, fala-se quase como se escreve):
  a/á/â          -> D (boca bem aberta)
  e/é/ê          -> C (meio aberta, larga)       e final átono -> I ("i")
  i/í/y          -> I (larga, quase fechada)
  o/ó/ô          -> E (aberta e redonda)          o final átono -> F ("u")
  u/ú/w          -> F (bico)
  m/b/p          -> A (lábios fechados e apertados)
  f/v            -> G (lábio de baixo nos dentes)
  l, lh, nh      -> H ;  l no fim da sílaba -> F (o "l" vira "u")
  demais consoantes (s, t, d, n, r, c, g, j, x, z, ç, ch, qu…) -> B
  h sozinho e m/n nasais (depois de vogal, antes de consoante ou no fim) -> não mexem a boca
"""
import argparse, json, math, unicodedata

FPS = 30
VIS = {
    'X': {},
    'A': {'apertar': 1.0},
    'B': {'abrir': 0.15, 'largo': 0.35, 'labio_cima': 0.3},
    'C': {'abrir': 0.45, 'largo': 0.45, 'labio_cima': 0.35},
    'D': {'abrir': 0.95, 'labio_cima': 0.25},
    'E': {'abrir': 0.55, 'redondo': 0.6},
    'F': {'abrir': 0.18, 'redondo': 1.0},
    'G': {'fv': 1.0, 'abrir': 0.1},
    'H': {'abrir': 0.45, 'labio_cima': 0.2},
    'I': {'abrir': 0.2, 'largo': 0.9, 'labio_cima': 0.4},
}
KEYS = ['abrir', 'largo', 'redondo', 'apertar', 'fv', 'sorriso', 'labio_cima', 'labio_baixo']
VOWELS = set('aeiou')


def base(c):
    return unicodedata.normalize('NFD', c)[0]


def word_visemes(word):
    w = ''.join(ch for ch in word.lower() if ch.isalpha() or ch.isdigit())
    if not w:
        return []
    if any(ch.isdigit() for ch in w):  # números: fala ritmada genérica
        return ['C', 'B', 'D', 'B', 'E', 'B'][:max(2, len(w) + 2)]
    out = []
    i = 0
    n = len(w)
    while i < n:
        c, b = w[i], base(w[i])
        nxt = base(w[i + 1]) if i + 1 < n else ''
        last = i == n - 1
        if b + nxt in ('ch', 'nh', 'lh', 'qu', 'gu', 'rr', 'ss', 'sc'):
            out.append('H' if b + nxt in ('lh', 'nh') else 'B')
            i += 2
            if b + nxt in ('qu', 'gu') and i < n and base(w[i]) in 'ei':
                pass  # o u é mudo
            continue
        if b == 'h':
            i += 1; continue
        if b in 'mn' and out and i > 0 and base(w[i - 1]) in VOWELS and (last or base(w[i + 1]) not in VOWELS):
            i += 1; continue  # nasal: não fecha a boca
        if b in 'aeiouy' or c in 'ãõ':
            if b == 'a':
                v = 'D' if c != 'ã' else 'C'
            elif b == 'e':
                v = 'I' if (last and c == 'e' and n > 2) else 'C'
            elif b in 'iy':
                v = 'I'
            elif b == 'o':
                v = 'F' if (last and c == 'o' and n > 2) or (c == 'o' and nxt == 's' and i == n - 2 and n > 3) else 'E'
            else:
                v = 'F'
            out.append(v)
        elif b in 'mbp':
            out.append('A')
        elif b in 'fv':
            out.append('G')
        elif b == 'l':
            out.append('F' if (last or nxt not in VOWELS) else 'H')
        elif b == 'w':
            out.append('F')
        else:
            out.append('B')
        i += 1
    # junta repetidos
    res = []
    for v in out:
        if not res or res[-1] != v:
            res.append(v)
    return res


def build(words, rms, trechos, gap):
    """trechos: [(ini, fim)] no áudio original; devolve (quadros, palavras no novo tempo, duração)"""
    timeline = []  # (t0, t1, viseme)
    new_words = []
    offset = 0.0
    for a, b in trechos:
        for w in words:
            if w['s'] >= a - 0.01 and w['e'] <= b + 0.05:
                s, e = w['s'] - a + offset, w['e'] - a + offset
                vs = word_visemes(w['w'])
                if not vs or e - s < 0.03:
                    continue
                wts = [1.6 if v in 'CDEFI' else (0.8 if v == 'A' else 1.0) for v in vs]
                tot = sum(wts)
                t = s
                for v, k in zip(vs, wts):
                    d = (e - s) * k / tot
                    timeline.append((t, t + d, v))
                    t += d
                new_words.append({'w': w['w'], 's': round(s, 3), 'e': round(e, 3)})
        offset += (b - a) + gap
    dur = offset - gap
    # amostra a 240 Hz e suaviza (coarticulação ~30 ms)
    HZ = 240
    nS = int(dur * HZ) + 1
    raw = [[0.0] * len(KEYS) for _ in range(nS)]
    j = 0
    for i in range(nS):
        t = i / HZ
        while j < len(timeline) and timeline[j][1] <= t:
            j += 1
        if j < len(timeline) and timeline[j][0] <= t < timeline[j][1]:
            for k, val in VIS[timeline[j][2]].items():
                raw[i][KEYS.index(k)] = val
    sig = 0.03 * HZ
    rad = int(sig * 3)
    ker = [math.exp(-0.5 * (x / sig) ** 2) for x in range(-rad, rad + 1)]
    ks = sum(ker)
    nF = int(dur * FPS) + 1
    frames = []
    # tempo original de cada quadro (para o rms)
    def orig_time(t):
        acc = 0.0
        for a, b in trechos:
            if t <= acc + (b - a):
                return a + (t - acc)
            acc += (b - a) + gap
        return None
    for f in range(nF):
        c = int(f / FPS * HZ)
        vals = [0.0] * len(KEYS)
        for o, kw in zip(range(-rad, rad + 1), ker):
            ii = min(max(c + o, 0), nS - 1)
            for k in range(len(KEYS)):
                vals[k] += raw[ii][k] * kw / ks
        ot = orig_time(f / FPS)
        loud = rms[int(ot * FPS)] if ot is not None and int(ot * FPS) < len(rms) else 0.0
        vals[KEYS.index('abrir')] *= 0.55 + 0.6 * loud
        frames.append({k: round(v, 3) for k, v in zip(KEYS, vals) if v > 0.005})
    return frames, new_words, dur


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--words', required=True)
    ap.add_argument('--rms', required=True)
    ap.add_argument('--trechos', default=None, help='ini:fim,ini:fim (segundos do áudio original)')
    ap.add_argument('--gap', type=float, default=0.4)
    ap.add_argument('--saida', required=True)
    a = ap.parse_args()
    words = json.load(open(a.words))
    rms = json.load(open(a.rms))
    tr = [tuple(map(float, p.split(':'))) for p in a.trechos.split(',')] if a.trechos else [(0, words[-1]['e'] + 0.3)]
    frames, nw, dur = build(words, rms, tr, a.gap)
    json.dump({'fps': FPS, 'duracao': dur, 'keys': KEYS, 'quadros': frames, 'palavras': nw}, open(a.saida, 'w'), ensure_ascii=False)
    print('quadros', len(frames), 'duração', round(dur, 2), 's')
    for w in nw[:6]:
        print(' ', w['w'], word_visemes(w['w']))
