#!/usr/bin/env python3
"""
Junta falas gravadas separadas (Lauro e outro personagem) num único áudio,
na ordem do roteiro, e grava quem fala em cada trecho (para mexer a boca certa).

Nome dos arquivos: número da fala + inicial do personagem, ex.:
  01_L.mp3  02_P.mp3  03_L.mp3 ...   (L = Lauro, P = Piá)
O número define a ordem. A letra define quem fala.

Uso (dentro de remotion/):
  python3 tools/montar_dialogo.py --id v05 --pasta /caminho/falas [--pausa 0.30]
Saída:
  out/tmp_<id>/dialogo.mp3      -> passe este arquivo em preparar_audio.py --voz
  src/data/<id>/falas.json      -> [{"quem":"L","s":0.0,"e":3.2}, ...]
"""
import argparse, glob, json, os, re, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def dur(p):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True)
    return float(out.stdout.strip())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--id', required=True)
    ap.add_argument('--pasta', required=True)
    ap.add_argument('--pausa', type=float, default=0.30, help='silêncio entre falas (s)')
    ap.add_argument('--metodo', default='natural', choices=['natural', 'rubberband'], help='natural = acelera como fita e devolve a duração (soa menos robótico)')
    ap.add_argument('--agudo', default='', help='deixa a voz de um personagem mais aguda, ex.: P=4 (semitons). Útil quando o Piá foi gerado na voz do Lauro')
    ap.add_argument('--compactar', type=float, default=0, help='encurta pausas internas maiores que isso (s), deixando 0.22 s. Ex.: 0.35')
    ap.add_argument('--igualar', default='', help='falas.json antigo: força cada fala a ter a mesma duração de antes (mantém a sincronia de um vídeo já montado)')
    a = ap.parse_args()
    alvo = {f['n']: f['e'] - f['s'] for f in json.load(open(a.igualar))} if a.igualar else {}

    arqs = []
    for p in glob.glob(os.path.join(a.pasta, '*')):
        m = re.match(r'^(\d+)[_\- ]*([A-Za-z])', os.path.basename(p))
        if m and p.lower().endswith(('.mp3', '.wav', '.m4a')):
            arqs.append((int(m.group(1)), m.group(2).upper(), p))
    arqs.sort()
    if not arqs:
        raise SystemExit('Nenhum arquivo no formato 01_L.mp3 / 02_P.mp3 encontrado.')
    nums = [n for n, _, _ in arqs]
    faltando = sorted(set(range(1, max(nums) + 1)) - set(nums))
    if faltando:
        print('Aviso: faltam as falas', faltando)

    tmp = os.path.join(ROOT, 'out', 'tmp_' + a.id)
    os.makedirs(tmp, exist_ok=True)
    os.makedirs(os.path.join(ROOT, 'src', 'data', a.id), exist_ok=True)

    # normaliza cada fala (as duas vozes ficam no mesmo volume) e corta silêncio das pontas
    partes, falas, t = [], [], 0.0
    sil = os.path.join(tmp, 'sil.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=mono', '-t', str(a.pausa), sil], check=True)
    agudo = dict((k.upper(), float(v)) for k, v in (x.split('=') for x in a.agudo.split(',') if x))
    for i, (n, quem, p) in enumerate(arqs):
        o = os.path.join(tmp, f'f{n:03d}.wav')
        tom = ''
        if quem in agudo:
            r = 2 ** (agudo[quem] / 12)
            tom = (f'aresample=48000,asetrate={48000 * r:.0f},aresample=48000,atempo={1 / r:.5f},' if a.metodo == 'natural'
                   else f'rubberband=pitch={r:.4f}:formant=shifted:pitchq=quality,')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', p, '-af',
                        'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
                        + (f'silenceremove=stop_periods=-1:stop_duration={a.compactar}:stop_threshold=-38dB:stop_silence=0.22,' if a.compactar else '') + tom + 'loudnorm=I=-16:TP=-2,aresample=48000',
                        '-ac', '1', '-ar', '48000', o], check=True)
        d = dur(o)
        if n in alvo and abs(d - alvo[n]) > 0.01:
            o2 = o.replace('.wav', '_ig.wav')
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', o, '-af', f'atempo={d / alvo[n]:.5f},apad,atrim=0:{alvo[n]:.3f}', '-ar', '48000', o2], check=True)
            o, d = o2, dur(o2)
        falas.append({'n': n, 'quem': quem, 's': round(t, 2), 'e': round(t + d, 2)})
        partes.append(o)
        t += d
        if i < len(arqs) - 1:
            partes.append(sil)
            t += a.pausa

    lista = os.path.join(tmp, 'lista.txt')
    open(lista, 'w').write(''.join(f"file '{p}'\n" for p in partes))
    saida = os.path.join(tmp, 'dialogo.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-b:a', '256k', saida], check=True)
    json.dump(falas, open(os.path.join(ROOT, 'src', 'data', a.id, 'falas.json'), 'w'), ensure_ascii=False)
    print(f'{len(falas)} falas, {t:.1f}s -> {saida}')
    for f in falas:
        if os.environ.get('QUIET'): break
        print(f"{f['n']:02d} {f['quem']} {f['s']:6.2f}–{f['e']:6.2f}")


if __name__ == '__main__':
    main()
