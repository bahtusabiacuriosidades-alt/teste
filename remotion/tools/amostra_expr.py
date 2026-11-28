"""
Amostra de expressões faciais e gestos (3D, Tripo): linha do tempo + áudio.

Uso (dentro de remotion/):  python3 tools/amostra_expr.py out/amostra_expr
Saída: timeline.json (falas, legendas, bocas por quadro, direção de cena por personagem, piscadas) e audio.wav

Falas reaproveitadas do #007 (Lauro e Piá); a Guria só reage.
Direção: cada item = (personagem, início, fim, ação do corpo, expressão do rosto), em segundos relativos à fala.
"""
import json, os, subprocess, sys, random
sys.path.insert(0, 'tools')
from visemas import build

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
FPS = 30
PAD0, GAP, PAD1 = 0.4, 0.38, 1.6
SEG = [  # (quem, início, fim) no áudio v07
    ('lauro', 0.00, 3.52),    # Bah, tu sabia que Caxias do Sul já se chamou Campo dos Bugres?
    ('pia', 3.79, 7.14),      # Campo dos o quê? Ainda bem que trocaram!
    ('pia', 78.02, 80.10),    # E é verdade que lá é frio de bater o queixo?
    ('lauro', 80.15, 81.60),  # Bah, se é!
    ('pia', 64.50, 66.92),    # E lá todo mundo torce pro Grêmio, né?
    ('lauro', 67.85, 69.95),  # Lá tem o Juventude e o Caxias, piá!
]
# expressões do rosto (pesos das formas)
ROSTO = {
    'surpresa': {'sobr_sobe_d': 1, 'sobr_sobe_e': 1, 'arregalar': 1},
    'curioso': {'sobr_sobe_d': 0.7, 'sobr_sobe_e': 0.25},
    'confuso': {'sobr_sobe_e': 1, 'sobr_franze': 0.35, 'olhos_apertar': 0.35},
    'rindo': {'sorriso': 0.6, 'olhos_apertar': 1, 'sobr_sobe_d': 0.3, 'sobr_sobe_e': 0.3},
    'alegre': {'sorriso': 0.45, 'olhos_apertar': 0.4},
    'frio': {'sobr_triste': 1, 'olhos_apertar': 0.6, 'apertar': 0.3},
    'maroto': {'sobr_sobe_d': 1, 'sorriso': 0.45, 'piscar_e': 0.3, 'piscar_d': 0.3},
    'bravo': {'sobr_franze': 1, 'apertar': 0.25},
    'emburrado': {'sobr_franze': 0.6, 'sobr_triste': 0.3, 'labio_baixo': 0.3},
    'piscadela': {'piscar_d': 0.9, 'sorriso': 0.55, 'sobr_sobe_e': 0.6},
}
# direção de cena: (segmento, quem, início, fim, ação, rosto); tempos relativos ao início do segmento (fim None = até o fim da fala)
DIR = [
    (0, 'lauro', 0.0, 1.2, 'bah', 'surpresa'), (0, 'lauro', 1.2, None, 'apontar', 'curioso'),
    (0, 'guria', 0.3, None, 'ouvir', 'alegre'), (0, 'pia', 0.6, None, 'ouvir', 'curioso'),
    (1, 'pia', 0.0, 1.7, 'ombros', 'confuso'), (1, 'pia', 1.75, 3.75, 'rir', 'rindo'),
    (1, 'guria', 1.9, 3.8, 'rir', 'rindo'), (1, 'lauro', 1.9, 3.7, 'ouvir', 'alegre'),
    (2, 'pia', 0.0, None, None, 'curioso'), (2, 'guria', 0.3, None, 'ouvir', 'curioso'),
    (3, 'lauro', 0.0, 1.9, 'tremer', 'frio'), (3, 'pia', 0.35, 1.9, 'tremer', 'frio'), (3, 'guria', 0.4, 1.9, 'tremer', 'frio'),
    (4, 'pia', 0.0, 2.8, 'cintura', 'maroto'), (4, 'guria', 0.6, 2.8, 'cintura', 'emburrado'), (4, 'lauro', 0.9, 2.7, 'ouvir', 'bravo'),
    (5, 'lauro', 0.0, 2.1, 'sermao', 'bravo'), (5, 'lauro', 2.15, 3.6, 'parado', 'piscadela'),
    (5, 'pia', 1.4, 3.6, 'ombros', 'alegre'), (5, 'guria', 1.2, 3.6, 'rir', 'rindo'),
]
words, rms = json.load(open('src/data/v07/words.json')), json.load(open('src/data/v07/rms.json'))
t = PAD0
falas, palavras = [], []
tracks = {'lauro': {}, 'guria': {}, 'pia': {}}
for quem, a, b in SEG:
    frames, nw, dur = build(words, rms, [(a, b)], 0.0)
    f0 = round(t * FPS)
    for i, fr in enumerate(frames):
        tracks[quem][f0 + i] = fr
    for w in nw:
        palavras.append({'w': w['w'], 's': round(w['s'] + t, 3), 'e': round(w['e'] + t, 3), 'quem': quem})
    falas.append({'quem': quem, 's': round(t, 3), 'e': round(t + (b - a), 3), 'a': a, 'b': b})
    t += (b - a) + GAP
total = t - GAP + PAD1
nF = int(total * FPS)
direcao = {q: [] for q in ('lauro', 'guria', 'pia')}
for seg, q, s0, s1, acao, rosto in DIR:
    base = falas[seg]['s']
    direcao[q].append({'s': round(base + s0, 3), 'e': round(base + (s1 if s1 is not None else falas[seg]['e'] - base), 3),
                       'acao': acao, 'rosto': ROSTO[rosto], 'nome': rosto})
# piscadas naturais (a cada 2,5 a 4,5 s), fora dos momentos de piscadela
random.seed(7)
piscadas = {}
for q in direcao:
    ts, x = [], random.uniform(0.6, 2.0)
    while x < total - 0.3:
        ts.append(round(x, 2)); x += random.uniform(2.5, 4.5)
    piscadas[q] = ts
latido = falas[5]['e'] + 0.35
boca = {q: [tracks[q].get(f, {}) for f in range(nF)] for q in tracks}
json.dump({'fps': FPS, 'duracao': total, 'quadros': nF, 'falas': falas, 'palavras': palavras, 'direcao': direcao,
           'piscadas': piscadas, 'latido': latido, 'boca': boca}, open(f'{OUT}/timeline.json', 'w'), ensure_ascii=False)

# áudio: falas + efeitos + música baixa
inputs, filt = [], []
for i, fl in enumerate(falas):
    inputs += ['-ss', str(fl['a']), '-t', str(fl['b'] - fl['a']), '-i', 'public/audio/v07_voz.mp3']
    ms = int(fl['s'] * 1000)
    filt.append(f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,afade=t=in:d=0.02,afade=t=out:st={fl["b"] - fl["a"] - 0.05:.3f}:d=0.05,adelay={ms}|{ms}[v{i}]')
SFX = [('latido', latido, 0.9), ('boing', falas[0]['s'] + 0.05, 0.4), ('toin', falas[1]['s'] + 0.1, 0.45),
       ('vento', falas[3]['s'] - 0.2, 0.5), ('plim', falas[5]['e'] + 0.2, 0.4)]
n = len(falas)
for j, (nm, at, vol) in enumerate(SFX):
    inputs += ['-i', f'public/sfx/{nm}.wav']
    filt.append(f'[{n + j}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume={vol},adelay={int(at * 1000)}|{int(at * 1000)}[s{j}]')
k = n + len(SFX)
inputs += ['-t', str(total), '-i', 'public/audio/v07_musica.mp3']
filt.append(f'[{k}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=0.55,afade=t=out:st={total - 1.2:.2f}:d=1.2[mus]')
mix = ''.join(f'[v{i}]' for i in range(n)) + ''.join(f'[s{j}]' for j in range(len(SFX))) + '[mus]'
filt.append(f'{mix}amix=inputs={k + 1}:normalize=0,atrim=0:{total:.3f}[out]')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *inputs, '-filter_complex', ';'.join(filt), '-map', '[out]', f'{OUT}/audio.wav'], check=True)
print('duração', round(total, 2), 's | quadros', nF, '| falas', [(f['quem'], f['s'], f['e']) for f in falas], '| latido', round(latido, 2))
