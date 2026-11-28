"""
#009 em 3D: linha do tempo da cena 3D (Lauro, Piá e Cusco do Tripo).

Uso (dentro de remotion/):  python3 tools/v09_3d.py
Lê  src/data/v09/{falas,words,rms}.json  e grava  src/data/v09/cena3d.json
(o mesmo arquivo serve para o render em Three.js e para o Video09.tsx saber os quadros e o selo).
"""
import json, random, sys
sys.path.insert(0, 'tools')
from visemas import build

FPS = 30
DUR = 89.3
falas = json.load(open('src/data/v09/falas.json'))
words = json.load(open('src/data/v09/words.json'))
rms = json.load(open('src/data/v09/rms.json'))
Q = {'L': 'lauro', 'P': 'pia'}
F = {f['n']: f for f in falas}

ROSTO = {
    'surpresa': {'sobr_sobe_d': 1, 'sobr_sobe_e': 1, 'arregalar': 1},
    'curioso': {'sobr_sobe_d': 0.7, 'sobr_sobe_e': 0.25},
    'confuso': {'sobr_sobe_e': 1, 'sobr_franze': 0.35, 'olhos_apertar': 0.35},
    'rindo': {'sorriso': 0.55, 'olhos_apertar': 1, 'sobr_sobe_d': 0.3, 'sobr_sobe_e': 0.3},
    'alegre': {'sorriso': 0.45, 'olhos_apertar': 0.35},
    'maroto': {'sobr_sobe_d': 1, 'sorriso': 0.45, 'piscar_e': 0.3, 'piscar_d': 0.3},
    'serio': {'sobr_franze': 0.45},
    'piscadela': {'piscar_d': 0.9, 'sorriso': 0.55, 'sobr_sobe_e': 0.6},
}
# (fala, quem, início relativo, fim relativo ou None, ação do corpo, rosto)
DIR = [
    (1, 'lauro', 0.0, 2.6, 'andar', 'surpresa'), (1, 'lauro', 2.6, None, 'bah', 'surpresa'),
    (2, 'pia', 0.0, None, 'bah', 'surpresa'), (2, 'lauro', 0.0, None, 'ouvir', 'alegre'),
    (3, 'lauro', 0.2, 4.0, 'apontar', 'curioso'), (3, 'pia', 0.5, None, 'ouvir', 'curioso'),
    (4, 'pia', 0.0, None, 'ombros', 'maroto'),
    (5, 'lauro', 0.0, 1.6, 'rir', 'rindo'), (5, 'lauro', 2.3, None, 'sermao', 'maroto'), (5, 'pia', 0.2, 1.6, 'rir', 'rindo'),
    (6, 'pia', 0.0, 1.2, 'ombros', 'confuso'),
    (7, 'lauro', 2.0, None, None, 'curioso'), (7, 'pia', 4.2, None, 'ouvir', 'surpresa'),
    (8, 'lauro', 0.0, None, None, 'alegre'), (8, 'pia', 5.5, None, 'ouvir', 'curioso'),
    (9, 'pia', 0.0, None, 'ombros', 'confuso'), (9, 'lauro', 0.3, None, 'ouvir', 'alegre'),
    (10, 'lauro', 0.0, 1.4, 'apontar', 'alegre'), (10, 'pia', 2.4, 3.6, 'ouvir', 'surpresa'),
    (11, 'pia', 0.0, None, 'cintura', 'curioso'),
    (12, 'lauro', 0.0, None, None, 'curioso'), (12, 'pia', 5.6, None, 'bah', 'surpresa'),
    (13, 'pia', 0.0, None, 'apontar', 'curioso'),
    (14, 'lauro', 0.0, 6.0, None, 'serio'), (14, 'lauro', 6.4, None, None, 'alegre'), (14, 'pia', 1.0, None, 'ouvir', 'curioso'),
    (15, 'pia', 0.0, None, 'rir', 'rindo'), (15, 'lauro', 0.4, None, 'rir', 'rindo'),
    (16, 'lauro', 0.0, 4.6, 'apontar', 'alegre'), (16, 'lauro', 4.7, 8.6, 'parado', 'piscadela'), (16, 'pia', 0.5, 8.6, 'ouvir', 'alegre'),
]
direcao = {'lauro': [], 'pia': []}
for n, q, a, b, acao, rosto in DIR:
    f = F[n]
    s = f['s'] + a
    e = f['s'] + b if b is not None else f['e']
    direcao[q].append({'s': round(s, 3), 'e': round(e, 3), 'acao': acao, 'rosto': ROSTO[rosto], 'nome': rosto})

nF = int(DUR * FPS)
boca = {'lauro': [{} for _ in range(nF)], 'pia': [{} for _ in range(nF)]}
for f in falas:
    frames, _, _ = build(words, rms, [(f['s'], f['e'])], 0.0)
    f0 = round(f['s'] * FPS)
    for i, fr in enumerate(frames):
        if 0 <= f0 + i < nF:
            boca[Q[f['quem']]][f0 + i] = fr

random.seed(9)
piscadas = {}
for q in ('lauro', 'pia'):
    ts, x = [], random.uniform(0.8, 2.0)
    while x < DUR - 0.3:
        ts.append(round(x, 2)); x += random.uniform(2.6, 4.6)
    piscadas[q] = ts

SELO = 44.6
cena = {
    'fps': FPS, 'duracao': DUR, 'quadros': nF, 'selo': SELO,
    'falas': [{'quem': Q[f['quem']], 's': f['s'], 'e': f['e']} for f in falas],
    'direcao': direcao, 'piscadas': piscadas, 'boca': boca,
    # caminhadas: [início, fim, x inicial] até a posição final
    'lauro': {'pos': [-0.24, 0, 0], 's': 1.0, 'yaw': 0.12, 'head': 0.9, 'path': [0.0, 2.6, -1.25], 'cyc': 0.62},
    'pia': {'pos': [0.4, 0, 0.2], 's': 0.76, 'yaw': -0.35, 'head': 0.66, 'path': [0.9, 3.3, 1.55], 'cyc': 0.42},
    # Cusco: atravessa no selo (late no meio) e depois senta ao lado do Piá; late de novo no "deserto que não é deserto"
    'cusco': {'s': 0.33, 'z': 0.62, 'trechos': [[42.4, 44.3, -1.4, 0.05], [45.3, 46.9, 0.05, 0.78]], 'latidos': [SELO - 0.15, F[15]['s'] + 0.3], 'fim': [0.78, 0.55]},
    # quadros 2D por cima (a câmera sobe para deixar os personagens embaixo)
    'quadros_2d': [[9.0, 12.6], [27.6, 31.6], [46.8, 52.6], [57.0, 61.6], [73.6, 77.2]],
}
json.dump(cena, open('src/data/v09/cena3d.json', 'w'), ensure_ascii=False)
print('quadros', nF, '| falas', len(falas), '| selo', SELO)
