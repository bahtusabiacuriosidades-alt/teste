#!/usr/bin/env python3
"""
Prepara o áudio de um vídeo novo do "Bah, tu sabia?" para o Remotion.

O que faz:
  1. Normaliza a locução do ElevenLabs (estéreo, -14.5 LUFS) -> public/audio/<id>_voz.mp3
  2. Transcreve com tempo por palavra (faster-whisper)          -> src/data/<id>/words.json
  3. Mede o volume da voz por quadro (move a boca)              -> src/data/<id>/rms.json
  4. Monta a trilha de fundo alinhada                           -> public/audio/<id>_musica.mp3
     - o "breque" (parada) da música cai em --breque segundos (opcional)
     - o acorde final da música começa em --acorde segundos
  5. Imprime a transcrição com tempos (para montar as cenas)

Uso (dentro da pasta remotion/):
  pip install faster-whisper librosa
  python3 tools/preparar_audio.py --id v05 --voz /caminho/ElevenLabs.mp3 --acorde 78.0 --breque 46.6

Depois de rodar: confira words.json e corrija palavras que a transcrição errou
(ex.: "Bá" -> "Bah", "piques" -> "Pix"), usando --corrigir ou editando o JSON.
"""
import argparse, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRILHA = os.path.join(os.path.dirname(ROOT), 'audio', 'trilha_gaucha_original.mp3')
FPS = 30
# Pontos úteis da trilha gaúcha (segundos): breques em 20.0 e 116.0; acorde final 154.82–157.8
BREQUE_TRILHA = 116.0
ACORDE = (154.82, 157.8)
CORRECOES_PADRAO = {'Bá,': 'Bah,', 'Bá!': 'Bah!', 'Bá': 'Bah', 'piques': 'Pix', 'cusco': 'Cusco', 'cusco,': 'Cusco,',
                    'sevar': 'cevar', 'aproxega': 'aprochega', 'aproxega,': 'aprochega,'}


def sh(cmd):
    subprocess.run(cmd, check=True)


def duracao(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True)
    return float(out.stdout.strip())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--id', required=True, help='ex.: v05 (pasta de dados e prefixo dos áudios)')
    ap.add_argument('--voz', required=True, help='MP3 do ElevenLabs')
    ap.add_argument('--acorde', type=float, required=True, help='segundo do vídeo em que entra o acorde final')
    ap.add_argument('--breque', type=float, default=None, help='segundo do vídeo em que a música para (opcional)')
    ap.add_argument('--musica-lufs', type=float, default=-31.0, help='volume da trilha (-31 normal, -35 para tom sério)')
    ap.add_argument('--corrigir', default='{}', help='JSON com correções extras de palavras, ex.: \'{"greno":"Grêmio"}\'')
    a = ap.parse_args()

    tmp = os.path.join(ROOT, 'out', 'tmp_' + a.id)
    os.makedirs(tmp, exist_ok=True)
    os.makedirs(os.path.join(ROOT, 'src', 'data', a.id), exist_ok=True)
    voz_wav = os.path.join(tmp, 'voz.wav')

    # 1) voz normalizada
    sh(['ffmpeg', '-v', 'error', '-y', '-i', a.voz, '-af', 'highpass=f=70,pan=stereo|c0=c0|c1=c0,loudnorm=I=-14.5:TP=-2:LRA=11,aresample=48000', '-ar', '48000', voz_wav])
    sh(['ffmpeg', '-v', 'error', '-y', '-i', voz_wav, '-b:a', '256k', os.path.join(ROOT, 'public', 'audio', f'{a.id}_voz.mp3')])

    # 2) transcrição com tempo por palavra
    import numpy as np, wave, librosa
    from faster_whisper import WhisperModel
    mono = os.path.join(tmp, 'mono16k.wav')
    sh(['ffmpeg', '-v', 'error', '-y', '-i', a.voz, '-ac', '1', '-ar', '16000', mono])
    w = wave.open(mono)
    audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    model = WhisperModel('small', device='cpu', compute_type='int8')
    segs, _ = model.transcribe(audio, language='pt', word_timestamps=True)
    palavras = [(x.word.strip(), x.start, x.end) for s in segs for x in s.words]
    fix = dict(CORRECOES_PADRAO, **json.loads(a.corrigir))
    words = [{'w': re.sub(r'[.,:]+$', '', fix.get(t, t)), 's': round(s, 2), 'e': round(e, 2)} for t, s, e in palavras]
    json.dump(words, open(os.path.join(ROOT, 'src', 'data', a.id, 'words.json'), 'w'), ensure_ascii=False)

    # 3) volume por quadro (boca)
    y, sr = librosa.load(voz_wav, sr=24000, mono=True)
    hop = sr // FPS
    rms = librosa.feature.rms(y=y, frame_length=hop * 2, hop_length=hop)[0]
    r = np.clip((20 * np.log10(rms + 1e-9) + 42) / 24, 0, 1)
    json.dump([round(float(v), 3) for v in r], open(os.path.join(ROOT, 'src', 'data', a.id, 'rms.json'), 'w'))

    # 4) trilha alinhada
    start = (BREQUE_TRILHA - a.breque) if a.breque is not None else 0.2
    start = max(0.2, start)
    corpo = a.acorde  # segundos de música antes do acorde
    if start + corpo > ACORDE[0] - 0.5:
        print('Aviso: o vídeo é mais longo que a trilha a partir desse ponto; use --breque menor ou sem breque.', file=sys.stderr)
    sh(['ffmpeg', '-v', 'error', '-y', '-i', TRILHA, '-filter_complex',
        f'[0:a]atrim={start}:{start + corpo + 0.06},asetpts=PTS-STARTPTS,afade=t=in:d=0.4[a];'
        f'[0:a]atrim={ACORDE[0]}:{ACORDE[1]},asetpts=PTS-STARTPTS[b];'
        f'[a][b]acrossfade=d=0.06,loudnorm=I={a.musica_lufs}:TP=-9:LRA=11,aresample=48000',
        '-ar', '48000', '-b:a', '256k', os.path.join(ROOT, 'public', 'audio', f'{a.id}_musica.mp3')])

    # 5) resumo
    print(f'Voz: {duracao(a.voz):.2f}s | palavras: {len(words)} | quadros: {len(r)}')
    print(f'Duração sugerida da composição: {a.acorde + 3.0:.1f}s')
    print(' '.join(f"{x['w']}@{x['s']:.1f}" for x in words))


if __name__ == '__main__':
    main()
