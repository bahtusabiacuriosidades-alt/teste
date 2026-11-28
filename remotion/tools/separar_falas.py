#!/usr/bin/env python3
"""
Corta um áudio único do ElevenLabs em falas numeradas (01_L.wav, 02_P.wav…),
usando os tempos por palavra (words.json do preparar_audio.py).

Serve para quando o usuário gera TODAS as falas de um personagem num arquivo só
(ou os dois personagens em sequência no mesmo arquivo). Depois, rode
montar_dialogo.py para intercalar na ordem do roteiro.

Spec (JSON): lista NA ORDEM EM QUE AS FALAS APARECEM NO ÁUDIO:
  [{"n": 1, "quem": "L", "inicio": "bah tu sabia"}, {"n": 3, "quem": "L", "inicio": "1909 os"}, ...]
"inicio" = primeiras palavras da fala como o Whisper transcreveu (aceita pequenas diferenças).

Uso:
  python3 tools/separar_falas.py --voz audio.mp3 --words src/data/v05/words.json --spec spec.json --saida pasta/
"""
import argparse, difflib, json, os, re, subprocess, unicodedata


def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]', '', s)


def parecido(a, b):
    return a == b or (len(a) > 2 and difflib.SequenceMatcher(None, a, b).ratio() >= 0.7)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--voz', required=True)
    ap.add_argument('--words', required=True)
    ap.add_argument('--spec', required=True)
    ap.add_argument('--saida', required=True)
    a = ap.parse_args()
    words = [w for w in json.load(open(a.words)) if norm(w['w'])]
    toks = [norm(w['w']) for w in words]
    spec = json.load(open(a.spec))
    os.makedirs(a.saida, exist_ok=True)

    idx, pos = [], 0
    for item in spec:
        pat = [norm(x) for x in item['inicio'].split() if norm(x)]
        achou = None
        for i in range(pos, len(toks) - len(pat) + 1):
            if all(parecido(toks[i + k], pat[k]) for k in range(len(pat))):
                achou = i
                break
        if achou is None:
            raise SystemExit(f"Não achei o início da fala {item['n']}: '{item['inicio']}' (a partir de {words[pos]['s']:.1f}s)")
        idx.append(achou)
        pos = achou + len(pat)

    total = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', a.voz], capture_output=True, text=True).stdout)
    for k, item in enumerate(spec):
        i = idx[k]
        ini = words[i]['s'] if i == 0 else (words[i - 1]['e'] + words[i]['s']) / 2
        if k + 1 < len(spec):
            j = idx[k + 1]
            fim = (words[j - 1]['e'] + words[j]['s']) / 2
        else:
            fim = total
        ini = max(0, ini - 0.04)
        out = os.path.join(a.saida, f"{item['n']:02d}_{item['quem']}.wav")
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a.voz, '-ss', f'{ini:.3f}', '-to', f'{fim:.3f}', '-ar', '48000', out], check=True)
        texto = ' '.join(w['w'] for w in words[i:(idx[k + 1] if k + 1 < len(spec) else len(words))])
        print(f"{item['n']:02d} {item['quem']} {ini:7.2f}–{fim:7.2f} | {texto[:90]}")


if __name__ == '__main__':
    main()
