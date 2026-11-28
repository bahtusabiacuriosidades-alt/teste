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
falas = json.load(open('src/data/v09/falas.json'))
words = json.load(open('src/data/v09/words.json'))
rms = json.load(open('src/data/v09/rms.json'))
Q = {'L': 'lauro', 'P': 'pia'}
F = {f['n']: f for f in falas}
DUR = round(F[len(falas)]['e'] + 2.4, 2)


def ws(palavra, depois=0.0):
    """início da primeira palavra (sem pontuação) depois de um tempo"""
    for w in words:
        if w['s'] >= depois - 0.05 and w['w'].strip('?!.,…').lower() == palavra.lower():
            return w['s']
    raise SystemExit('palavra não achada: ' + palavra)


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
    (7, 'lauro', 2.0, None, None, 'curioso'), (7, 'pia', 4.0, None, 'ouvir', 'surpresa'),
    (8, 'lauro', 0.0, None, None, 'alegre'), (8, 'pia', 5.2, None, 'ouvir', 'curioso'),
    (9, 'pia', 0.0, None, 'ombros', 'confuso'), (9, 'lauro', 0.3, None, 'ouvir', 'alegre'),
    (10, 'lauro', 0.0, 1.4, 'apontar', 'alegre'), (10, 'pia', 2.3, 3.5, 'ouvir', 'surpresa'),
    # "E aí, Cusco? Tu aprova?": o Lauro se vira para o Cusco, que entra trotando, late e carimba
    (11, 'lauro', 0.0, 3.4, 'apontar', 'maroto'), (11, 'pia', 0.3, 3.4, 'ouvir', 'alegre'),
    (12, 'pia', 0.0, None, 'cintura', 'curioso'),
    (13, 'lauro', 0.0, None, None, 'curioso'), (13, 'pia', 5.4, None, 'bah', 'surpresa'),
    (14, 'pia', 0.0, None, 'apontar', 'curioso'),
    (15, 'lauro', 0.0, 5.8, None, 'serio'), (15, 'lauro', 6.2, None, None, 'alegre'), (15, 'pia', 1.0, None, 'ouvir', 'curioso'),
    (16, 'pia', 0.0, None, 'rir', 'rindo'), (16, 'lauro', 0.4, None, 'rir', 'rindo'),
    (17, 'lauro', 0.0, 4.4, 'apontar', 'alegre'), (17, 'lauro', 4.5, 8.4, 'parado', 'piscadela'), (17, 'pia', 0.5, 8.4, 'ouvir', 'alegre'),
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

SELO = round(F[11]['e'] + 0.85, 2)
M = {  # marcas presas às palavras (o Video09 usa para quadros, chips e sons)
    'mapa': ws('sudoeste', F[3]['s']) - 0.3,
    'sj': ws('Deserto', ws('lugares', F[3]['s'])),
    'nao': ws('Não', F[5]['s']),
    'chuva': ws('chuva', F[7]['s']) - 0.1,
    'dirce': ws('geógrafa', F[8]['s']),
    'areniz': ws('Arenização', F[8]['s']),
    'estagio': F[10]['e'] - 5.8,
    'vento': ws('vento', F[10]['s']) - 0.6,
    'campos': ws('levantamento', F[13]['s']),
    'flip': ws('mais', ws('municípios', F[13]['s'])) - 0.15,
    'cuidar': F[15]['s'],
    'mas': ws('Mas', F[15]['s']),
    'tempo': ws('relato', F[15]['s']) - 0.9,
}
M['campos'] = max(M['campos'], M['flip'] - 2.8)
M = {k: round(v, 2) for k, v in M.items()}
cena = {
    'fps': FPS, 'duracao': DUR, 'quadros': nF, 'selo': SELO, 'marcas': M,
    'falas': [{'quem': Q[f['quem']], 's': f['s'], 'e': f['e']} for f in falas],
    'direcao': direcao, 'piscadas': piscadas, 'boca': boca,
    'lauro': {'pos': [-0.24, 0, 0], 's': 1.0, 'yaw': 0.12, 'head': 0.9, 'path': [0.0, 2.6, -1.25], 'cyc': 0.62},
    'pia': {'pos': [0.4, 0, 0.2], 's': 0.76, 'yaw': -0.35, 'head': 0.66, 'path': [0.9, 3.3, 1.55], 'cyc': 0.42},
    # Cusco: entra trotando quando o Lauro chama, para na frente, late (selo) e depois vai sentar ao lado do Piá
    'cusco': {'s': 0.33, 'z': 0.62, 'chamado': [F[11]['s'], SELO + 1.5],
              'trechos': [[round(F[11]['s'] + 0.3, 2), round(SELO - 0.25, 2), 1.7, 0.1], [round(SELO + 1.6, 2), round(SELO + 2.9, 2), 0.1, 0.78]],
              'latidos': [round(SELO - 0.15, 2), round(F[16]['s'] + 0.3, 2)], 'fim': [0.78, 0.55]},
    'quadros_2d': [[M['mapa'], M['mapa'] + 3.6], [M['chuva'], M['chuva'] + 4.0], [M['estagio'], F[10]['e']],
                   [M['campos'], M['flip'] + 1.6], [M['tempo'], F[15]['e'] + 0.2]],
}
json.dump(cena, open('src/data/v09/cena3d.json', 'w'), ensure_ascii=False)
print('duração', DUR, '| quadros', nF, '| falas', len(falas), '| selo', SELO)
print(M)
