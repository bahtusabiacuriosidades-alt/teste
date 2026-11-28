"""
Monta a linha do tempo e o áudio da amostra 3D (Lauro, Guria, Piá e Cusco) a partir de falas já gravadas.

Uso (dentro de remotion/):  python3 tools/amostra3d.py out/amostra3d
Saída: timeline.json (falas, palavras, formas de boca por personagem e por quadro) e audio.wav
"""
import json, os, subprocess, sys
sys.path.insert(0, 'tools')
from visemas import build, KEYS

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
FPS = 30
PAD0, GAP, PAD1 = 0.35, 0.32, 1.2
SEG = [  # (quem, áudio, início, fim)
    ('lauro', 'v06', 0.00, 2.70),
    ('guria', 'v06', 2.83, 4.95),
    ('lauro', 'v06', 5.22, 6.55),
    ('pia', 'v07', 22.18, 24.30),
    ('lauro', 'v07', 87.72, 89.42),
]
data = {v: (json.load(open(f'src/data/{v}/words.json')), json.load(open(f'src/data/{v}/rms.json'))) for v in ('v06', 'v07')}
t = PAD0
falas, palavras = [], []
tracks = {'lauro': {}, 'guria': {}, 'pia': {}}
for quem, v, a, b in SEG:
    words, rms = data[v]
    frames, nw, dur = build(words, rms, [(a, b)], 0.0)
    f0 = round(t * FPS)
    for i, fr in enumerate(frames):
        tracks[quem][f0 + i] = fr
    for w in nw:
        palavras.append({'w': w['w'], 's': round(w['s'] + t, 3), 'e': round(w['e'] + t, 3), 'quem': quem})
    falas.append({'quem': quem, 's': round(t, 3), 'e': round(t + (b - a), 3), 'src': v, 'a': a, 'b': b})
    t += (b - a) + GAP
total = t - GAP + PAD1
latido = falas[3]['e'] + 0.12  # o Cusco late depois do Piá
nF = int(total * FPS)
boca = {q: [tracks[q].get(f, {}) for f in range(nF)] for q in tracks}
json.dump({'fps': FPS, 'duracao': total, 'quadros': nF, 'falas': falas, 'palavras': palavras, 'latido': latido, 'boca': boca},
          open(f'{OUT}/timeline.json', 'w'), ensure_ascii=False)

# áudio: falas nos tempos certos + latido + música baixa
inputs, filt = [], []
for i, fl in enumerate(falas):
    inputs += ['-ss', str(fl['a']), '-t', str(fl['b'] - fl['a']), '-i', f'public/audio/{fl["src"]}_voz.mp3']
    ms = int(fl['s'] * 1000)
    filt.append(f'[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,afade=t=in:d=0.02,afade=t=out:st={fl["b"] - fl["a"] - 0.05:.3f}:d=0.05,adelay={ms}|{ms}[v{i}]')
n = len(falas)
inputs += ['-i', 'public/sfx/latido.wav']
filt.append(f'[{n}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=0.9,adelay={int(latido * 1000)}|{int(latido * 1000)}[lat]')
inputs += ['-i', 'public/sfx/boing.wav']
filt.append(f'[{n + 1}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=0.4,adelay=380|380[boi]')
inputs += ['-t', str(total), '-i', 'public/audio/v06_musica.mp3']
filt.append(f'[{n + 2}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=0.55,afade=t=out:st={total - 1.0:.2f}:d=1.0[mus]')
mix = ''.join(f'[v{i}]' for i in range(n)) + '[lat][boi][mus]'
filt.append(f'{mix}amix=inputs={n + 3}:normalize=0,atrim=0:{total:.3f}[out]')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *inputs, '-filter_complex', ';'.join(filt), '-map', '[out]', f'{OUT}/audio.wav'], check=True)
print('duração', round(total, 2), 's | quadros', nF, '| falas', [(f['quem'], f['s'], f['e']) for f in falas], '| latido', round(latido, 2))
