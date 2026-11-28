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

// marcas presas às palavras (calculadas em tools/v09_3d.py)
const M = cena.marcas;
const C = cena.cusco;
// quadros 2D (por cima do 3D, na parte de cima da tela; a câmera 3D sobe nesses momentos)
const QUADROS: { a: number; b: number; draw: (t: number) => React.ReactNode }[] = [
  { a: M.mapa, b: M.mapa + 3.6, draw: (t) => <StageMapaAlegrete t={t} a={M.mapa} /> },
  { a: M.chuva, b: M.chuva + 4.0, draw: (t) => <MetricChuva t={t} a={M.chuva} /> },
  { a: M.estagio, b: F[9].e, draw: (t) => <StageArenizacao t={t} a={M.estagio} /> },
  { a: M.campos, b: M.flip + 1.6, draw: (t) => <MetricCampos t={t} a={M.campos} flipT={M.flip} /> },
  { a: M.tempo, b: F[14].e + 0.2, draw: (t) => <MetricLinhaTempo t={t} a={M.tempo} /> },
];

const passos = (a: number, b: number, n: number): [string, number, number][] =>
  Array.from({ length: n }).map((_, i) => ['passo', a + ((b - a) * i) / n, 0.22] as [string, number, number]);
const SFX: [string, number, number][] = [
  ['plim', 0.0, 0.3], ['vento', 0.2, 0.25], ...passos(0.3, 2.5, 4), ...passos(1.0, 3.2, 4),
  ['boing', F[1].s + 0.05, 0.25],
  ['whoosh', M.mapa - 0.15, 0.25], ['pop', M.mapa + 0.6, 0.3], ['ding', M.sj, 0.25],
  ['toin', F[3].s + 0.1, 0.3], ['erro', M.nao, 0.3],
  ['whoosh', M.chuva - 0.15, 0.25], ['chuva', M.chuva, 0.25], ['ding', M.chuva + 2.5, 0.3],
  ['pop', M.dirce, 0.25], ['plim', M.areniz, 0.3],
  ['whoosh', M.estagio - 0.15, 0.25], ['chuva', M.estagio, 0.2], ['vento', M.vento, 0.35],
  // "E aí, Cusco? Tu aprova?" → o Cusco chega trotando, late e carimba
  ['patinhas', C.trechos[0][0], 0.35], ['latido', SELO - 0.15, 0.7], ['carimbo', SELO, 0.55], ['patinhas', C.trechos[1][0], 0.25],
  ['whoosh', M.campos - 0.15, 0.25], ['tictac', M.campos + 0.3, 0.18], ['riser', M.flip - 0.9, 0.2], ['acerto', M.flip, 0.35],
  ['whoosh', M.tempo - 0.15, 0.25], ['ding', M.tempo + 0.6, 0.22], ['ding', M.tempo + 1.6, 0.22], ['ding', M.tempo + 2.4, 0.22],
  ['boing', F[15].s + 0.1, 0.25], ['latido', C.latidos[1], 0.5], ['aplauso', F[15].e, 0.18], ['pop', F[16].s + 0.1, 0.3],
];

export const Video09: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const quadro = QUADROS.find((q) => t >= q.a && t <= q.b);
  // vento: no começo, no "vento espalha" e no final
  const vento = Math.max(kf(t, [[0, 0.6], [3, 0.25], [6, 0]]), kf(t, [[M.vento, 0], [M.vento + 0.8, 1], [F[9].e, 1], [F[9].e + 0.8, 0]]), kf(t, [[F[15].s, 0], [F[15].s + 0.6, 0.5], [F[15].e, 0]]));
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
      <Chip t={t} a={M.sj} b={F[2].e} text="📍 DESERTO DE SÃO JOÃO · ALEGRETE" />
      <Chip t={t} a={F[3].s} b={F[3].e + 0.2} text="🐪 ???" kind="warn" />
      <Chip t={t} a={M.nao} b={F[4].e + 0.3} text="❌ NÃO É DESERTO!" kind="bad" y={420} />
      <Chip t={t} a={M.dirce} b={M.areniz - 0.2} text="🎓 DIRCE SUERTEGARAY · GEÓGRAFA DA UFRGS" />
      <Chip t={t} a={M.areniz} b={F[8].e + 0.2} text="🔎 ARENIZAÇÃO" kind="warn" y={420} />
      <Chip t={t} a={F[10].s + 0.2} b={SELO - 0.1} text="🐕 TU APROVA, CUSCO?" kind="warn" />
      <Chip t={t} a={M.cuidar} b={M.mas} text="🌱 CUIDAR DO CAMPO NATIVO" kind="good" />
      <Chip t={t} a={F[15].s} b={F[15].e} text="🏜️ UM DESERTO QUE NÃO É DESERTO" kind="warn" />
      {t >= F[16].s + 0.1 && (
        <div style={{ position: 'absolute', left: 60, right: 60, top: 330, textAlign: 'center', transform: `scale(${pop(t, F[16].s + 0.1, 0.25)}) rotate(-2deg)` }}>
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
