import React from 'react';
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import './fonts';
import { FPS, MUST, kf, clamp, pop, Word } from './lib';
import { HUD, BigText, Captions, SeloCusco } from './ui/Overlays';
import { AreiaVento, StageMapaAlegrete, MetricChuva, StageArenizacao, MetricCampos, MetricLinhaTempo } from './scenes/Deserto';
import words09 from './data/v09/words.json';
import cena from './data/v09/cena3d.json';

/* #009 (curto, vertical) — "O RS tem um deserto?" (areais do Pampa), com o Piá. Personagens em 3D (Tripo),
   renderizados em Three.js para public/video/v09_3d.mp4; aqui vão por cima os quadros 2D, legendas, selo e áudio. */
export const DURATION_09 = cena.duracao;
const WORDS = words09 as Word[];
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';
const SELO = cena.selo;
const F = cena.falas;

const Chip: React.FC<{ t: number; a: number; b: number; text: string; kind?: 'bad' | 'good' | 'warn' | 'info'; y?: number }> = ({ t, a, b, text, kind = 'info', y = 330 }) => {
  if (t < a || t > b) return null;
  const bg = { bad: '#C62828', good: '#2E7D32', warn: MUST, info: 'rgba(20,16,12,.9)' }[kind];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: clamp((b - t) / 0.15) }}>
      <div style={{ transform: `scale(${pop(t, a)}) rotate(${kind === 'bad' ? -4 : 0}deg)`, background: bg, color: kind === 'warn' ? '#1E1B18' : '#fff', borderRadius: 40, padding: '14px 30px', fontFamily: FONT, fontWeight: 900, fontSize: text.length > 26 ? 36 : 46, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(0,0,0,.35)', border: '4px solid rgba(255,255,255,.85)' }}>{text}</div>
    </div>
  );
};

// quadros 2D (por cima do 3D, na parte de cima da tela; a câmera 3D sobe nesses momentos)
const QUADROS: { a: number; b: number; draw: (t: number) => React.ReactNode }[] = [
  { a: 9.0, b: 12.6, draw: (t) => <StageMapaAlegrete t={t} a={9.0} /> },
  { a: 27.6, b: 31.6, draw: (t) => <MetricChuva t={t} a={27.6} /> },
  { a: 46.8, b: 52.6, draw: (t) => <StageArenizacao t={t} a={46.8} /> },
  { a: 57.0, b: 61.6, draw: (t) => <MetricCampos t={t} a={57.0} flipT={60.4} /> },
  { a: 73.6, b: 77.2, draw: (t) => <MetricLinhaTempo t={t} a={73.6} /> },
];

const SFX: [string, number, number][] = [
  ['plim', 0.0, 0.3], ['vento', 0.2, 0.25], ['passo', 0.4, 0.25], ['passo', 1.0, 0.25], ['passo', 1.6, 0.25], ['passo', 2.2, 0.25],
  ['boing', F[1].s + 0.05, 0.25],
  ['whoosh', 8.85, 0.25], ['pop', 9.6, 0.3], ['ding', 14.0, 0.25],
  ['toin', F[3].s + 0.1, 0.3], ['erro', 22.6, 0.3],
  ['whoosh', 27.45, 0.25], ['chuva', 27.6, 0.25], ['ding', 30.1, 0.3],
  ['pop', 33.2, 0.25], ['plim', 38.6, 0.3],
  ['patinhas', 42.5, 0.35], ['latido', SELO - 0.15, 0.6], ['carimbo', SELO, 0.55], ['patinhas', 45.3, 0.3],
  ['whoosh', 46.65, 0.25], ['chuva', 46.8, 0.2], ['vento', 50.6, 0.35],
  ['whoosh', 56.85, 0.25], ['tictac', 57.3, 0.18], ['riser', 59.6, 0.2], ['acerto', 60.5, 0.35],
  ['whoosh', 73.45, 0.25], ['ding', 74.2, 0.22], ['ding', 75.3, 0.22], ['ding', 76.3, 0.22],
  ['boing', F[14].s + 0.1, 0.25], ['latido', F[14].s + 0.3, 0.5], ['aplauso', 80.2, 0.18], ['pop', 83.4, 0.3],
];

export const Video09: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const quadro = QUADROS.find((q) => t >= q.a && t <= q.b);
  // vento: no começo, no "vento espalha" e no final
  const vento = Math.max(kf(t, [[0, 0.6], [3, 0.25], [6, 0]]), kf(t, [[49.6, 0], [50.4, 1], [52.6, 1], [53.4, 0]]), kf(t, [[77.4, 0], [78, 0.5], [80, 0]]));
  const qIn = quadro ? clamp((t - quadro.a) / 0.35) * clamp((quadro.b - t) / 0.25) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <OffthreadVideo src={staticFile('video/v09_3d.mp4')} muted />
      <AreiaVento t={t} forca={vento} />
      {quadro && (
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
          <g transform={`translate(540,${720 + (1 - qIn) * 60}) scale(${0.66 * (0.9 + 0.1 * qIn)})`} opacity={qIn}>{quadro.draw(t)}</g>
        </svg>
      )}
      <HUD num="#009" cat="🏜️ NATUREZA · PAMPA" />
      <BigText t={t} start={0} end={2.4} lines={['BAH, TU', 'SABIA…?']} y={300} size={120} />
      <Chip t={t} a={14.0} b={17.2} text="📍 DESERTO DE SÃO JOÃO · ALEGRETE" />
      <Chip t={t} a={17.6} b={18.8} text="🐪 ???" kind="warn" />
      <Chip t={t} a={22.6} b={24.6} text="❌ NÃO É DESERTO!" kind="bad" y={420} />
      <Chip t={t} a={33.2} b={38.4} text="🎓 DIRCE SUERTEGARAY · GEÓGRAFA DA UFRGS" />
      <Chip t={t} a={38.6} b={42.0} text="🔎 ARENIZAÇÃO" kind="warn" y={420} />
      <Chip t={t} a={65.9} b={72.9} text="🌱 CUIDAR DO CAMPO NATIVO" kind="good" />
      <Chip t={t} a={77.5} b={80.2} text="🏜️ UM DESERTO QUE NÃO É DESERTO" kind="warn" />
      {t >= 80.6 && (
        <div style={{ position: 'absolute', left: 60, right: 60, top: 330, textAlign: 'center', transform: `scale(${pop(t, 80.6, 0.25)}) rotate(-2deg)` }}>
          <div style={{ display: 'inline-block', background: 'rgba(20,16,12,.88)', borderRadius: 34, padding: '26px 40px', border: `6px solid ${MUST}`, fontFamily: FONT, fontWeight: 900, color: '#fff', lineHeight: 1.15 }}>
            <div style={{ fontSize: 76 }}>COMENTA 👇</div>
            <div style={{ fontSize: 64, color: MUST }}>A TUA CIDADE</div>
            <div style={{ fontSize: 34, marginTop: 10, opacity: 0.9 }}>A MAIS CURTIDA É O PRÓXIMO VÍDEO</div>
          </div>
        </div>
      )}
      <SeloCusco t={t} at={SELO} num="#009" tema="AREAIS DO PAMPA" cy={820} />
      <Captions t={t} hidden={t < 0.05 || (t > SELO && t < SELO + 1.9)} words={WORDS} y={1545} />
      {t > DURATION_09 - 0.5 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - (DURATION_09 - 0.5)) / 0.5)})` }} />}
      <Audio src={staticFile('audio/v09_voz.mp3')} />
      <Audio src={staticFile('audio/v09_musica.mp3')} />
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={Math.round(5 * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
