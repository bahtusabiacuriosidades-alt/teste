import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import './fonts';
import { FPS, MUST, kf, clamp, pop, makeVoice, Word } from './lib';
import { Lauro, LauroDefs } from './chars/Lauro';
import { CuscoSit, CuscoDefs } from './chars/Others';
import { Confetti } from './scenes/Mate';
import {
  BLUE, BLACK, OldBall, StageFrame, StageMatch, StageCandido, StageCalendar, StageJersey, StageWorld, Scoreboard,
  StagePitch7, StageStadium, StageHino, StageStarFlag, StageTrophies, StageTitle,
} from './scenes/Gremio';
import { Captions } from './ui/Overlays';
import rmsL from './data/v04L/rms.json';
import wordsL from './data/v04L/words.json';

/* #004 (YouTube, horizontal 1920x1080, ~5 min) — A história do Grêmio */
export const DURATION_04L = 307.5;
const talk = makeVoice(rmsL as number[]);
const WORDSL = wordsL as Word[];
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';
const W = 1920, H = 1080;

const jump = (t: number, at: number, dur: number, h: number) => (t > at && t < at + dur ? Math.sin((Math.PI * (t - at)) / dur) * h : 0);

/* ---------- chapters ---------- */
type Chapter = { a: number; n: string; title: string; year: string };
const CHAPTERS: Chapter[] = [
  { a: 0, n: 'INTRO', title: 'A BOLA QUE FUROU', year: '1903' },
  { a: 19.8, n: 'CAP. 1', title: '1903: NASCE O GRÊMIO', year: '1903' },
  { a: 59.1, n: 'CAP. 2', title: 'AS CORES', year: '1903' },
  { a: 85.4, n: 'CAP. 3', title: 'O PRIMEIRO GRE-NAL', year: '1909' },
  { a: 108.8, n: 'CAP. 4', title: 'OS ESTÁDIOS', year: '1904–2012' },
  { a: 125.7, n: 'CAP. 5', title: 'O HINO', year: '1953' },
  { a: 145.8, n: 'CAP. 6', title: 'EVERALDO E TESOURINHA', year: '1952–1970' },
  { a: 179.3, n: 'CAP. 7', title: '1983: A AMÉRICA E O MUNDO', year: '1983' },
  { a: 209.2, n: 'CAP. 8', title: 'ANOS 90', year: '1994–1996' },
  { a: 235.9, n: 'CAP. 9', title: 'A QUEDA E OS AFLITOS', year: '2005' },
  { a: 267.4, n: 'CAP. 10', title: 'RENATO DE NOVO', year: '2017' },
  { a: 280.0, n: 'FINAL', title: 'IMORTAL TRICOLOR', year: '∞' },
];

/* ---------- stage timeline (right panel) ---------- */
type Seg = { a: number; b: number; draw: (t: number, lt: number) => React.ReactNode };
const T = (kicker: string, title: string, at: number) => (t: number) => <StageTitle t={t} at={at} kicker={kicker} title={title} />;
const SEGS: Seg[] = [
  { a: 0, b: 9.5, draw: (t) => (
    <StageFrame fill="#1E2A36"><g transform="translate(0,60) scale(1.6)"><OldBall t={t} deflate={clamp((t - 3.0) / 0.6)} burst={clamp((t - 3.0) / 0.8)} /></g></StageFrame>
  ) },
  { a: 9.5, b: 19.8, draw: T('DA BOLA FURADA AO IMORTAL', 'A HISTÓRIA DO GRÊMIO', 9.6) },
  { a: 19.8, b: 22.4, draw: T('CAPÍTULO 1', '1903: NASCE O GRÊMIO', 19.9) },
  { a: 22.4, b: 33.6, draw: (t) => <StageMatch t={t} burstT={32.8} /> },
  { a: 33.6, b: 42.7, draw: (t, lt) => <StageCandido t={t} lt={lt} /> },
  { a: 42.7, b: 51.6, draw: (t) => <StageCalendar t={t} stampT={49.3} /> },
  { a: 51.6, b: 59.1, draw: (t) => <StageTrophies t={t} items={[[55.3, '1904', '1º TROFÉU']]} /> },
  { a: 59.1, b: 60.6, draw: T('CAPÍTULO 2', 'AS CORES', 59.2) },
  { a: 60.6, b: 72.0, draw: (t) => <StageJersey t={t} morph={0} /> },
  { a: 72.0, b: 85.4, draw: (t) => <StageJersey t={t} morph={kf(t, [[72.1, 0], [73.6, 1]])} labels={false} /> },
  { a: 85.4, b: 87.0, draw: T('CAPÍTULO 3', 'O PRIMEIRO GRE-NAL', 85.5) },
  { a: 87.0, b: 98.5, draw: (t) => <StageCalendar t={t} stampT={93.0} day="18" month="JULHO" year="1909" stamp="1º GRE-NAL" /> },
  { a: 98.5, b: 108.8, draw: (t) => <Scoreboard t={t} at={99.6} home="GRÊMIO" away="INTERNACIONAL" hs={10} as={0} label="MAIOR GOLEADA DO CLÁSSICO" sepia awayC="#C62828" /> },
  { a: 108.8, b: 109.8, draw: T('CAPÍTULO 4', 'OS ESTÁDIOS', 108.9) },
  { a: 109.8, b: 113.8, draw: (t) => <StageStadium t={t} kind="baixada" /> },
  { a: 113.8, b: 121.1, draw: (t) => <StageStadium t={t} kind="olimpico" /> },
  { a: 121.1, b: 125.7, draw: (t) => <StageStadium t={t} kind="arena" /> },
  { a: 125.7, b: 126.6, draw: T('CAPÍTULO 5', 'O HINO', 125.8) },
  { a: 126.6, b: 145.8, draw: (t, lt) => <StageHino t={t} lt={lt} strikeT={139.6} /> },
  { a: 145.8, b: 147.3, draw: T('CAPÍTULO 6', 'EVERALDO E TESOURINHA', 145.9) },
  { a: 147.3, b: 162.4, draw: (t) => <StageStarFlag t={t} starT={148.9} /> },
  { a: 162.4, b: 179.3, draw: T('1952', 'TESOURINHA', 164.4) },
  { a: 179.3, b: 181.0, draw: T('CAPÍTULO 7', '1983: A AMÉRICA E O MUNDO', 179.4) },
  { a: 181.0, b: 193.6, draw: (t) => <StageTrophies t={t} items={[[183.4, '1981', 'BRASILEIRO'], [188.1, '1983', 'LIBERTADORES']]} /> },
  { a: 193.6, b: 201.0, draw: (t) => <StageWorld t={t} prog={kf(t, [[194.3, 0], [196.6, 1]])} germany={pop(t, 197.8)} /> },
  { a: 201.0, b: 209.2, draw: (t) => <Scoreboard t={t} at={201.5} home="GRÊMIO" away="HAMBURGO" hs={2} as={1} label="⚽⚽ RENATO · CAMPEÃO DO MUNDO" awayC="#2A2A2A" /> },
  { a: 209.2, b: 210.4, draw: T('CAPÍTULO 8', 'ANOS 90', 209.3) },
  { a: 210.4, b: 223.5, draw: (t) => <StageTrophies t={t} items={[[215.6, '1994', 'COPA DO BRASIL'], [217.5, '1995', 'LIBERTADORES'], [220.3, '1996', 'BRASILEIRO']]} /> },
  { a: 223.5, b: 235.9, draw: (t) => <StageTrophies t={t} items={[[228.1, '1989', 'COPA DO BRASIL'], [229.8, '1994', 'COPA DO BRASIL'], [231.6, '1997', 'COPA DO BRASIL'], [233.4, '2001', 'COPA DO BRASIL'], [234.4, '2016', 'COPA DO BRASIL']]} /> },
  { a: 235.9, b: 237.9, draw: T('CAPÍTULO 9', 'A QUEDA E OS AFLITOS', 236.0) },
  { a: 237.9, b: 246.5, draw: T('2004', 'SÉRIE B', 240.6) },
  { a: 246.5, b: 267.4, draw: (t) => <StagePitch7 t={t} saveT={257.9} goalT={262.3} /> },
  { a: 267.4, b: 268.8, draw: T('CAPÍTULO 10', 'RENATO DE NOVO', 267.5) },
  { a: 268.8, b: 280.0, draw: (t) => <StageTrophies t={t} items={[[273.6, '2016', 'COPA DO BRASIL'], [276.0, '2017', 'LIBERTADORES']]} /> },
  { a: 280.0, b: 291.6, draw: T('POR QUE "IMORTAL"?', 'IMORTAL TRICOLOR', 280.1) },
  { a: 291.6, b: 299.3, draw: T('COMENTA 👇', 'QUAL MOMENTO TU VIVEU?', 291.7) },
  { a: 299.3, b: 308, draw: T('SE INSCREVE 🔔', 'BAH, TU SABIA?', 299.4) },
];
const CUTS = SEGS.map((s) => s.a).filter((a) => a > 0);

/* ---------- Lauro acting cues ---------- */
const lauroExpr = (t: number) => {
  if (t > 3.0 && t < 4.2) return 'shock';
  if (t > 32.8 && t < 33.8) return 'shock';
  if (t > 99.6 && t < 108.8) return 'laugh';
  if (t > 201.5 && t < 209.2) return 'delight';
  if (t > 238.0 && t < 246.5) return 'sad';
  if (t > 262.3 && t < 267.4) return 'delight';
  if (t > 280) return t > 299.3 ? 'wink' : 'smile';
  return 'talk';
};
const POINT_WINDOWS: [number, number][] = [[22.5, 26], [44, 48], [61, 66], [99.6, 102], [114, 118], [148.8, 152], [188.1, 191], [197.8, 200], [215.6, 219], [228.1, 233], [257.9, 261], [273.6, 277], [291.7, 295]];
const lauroArm = (t: number) => (POINT_WINDOWS.some(([a, b]) => t > a && t < b) ? 'pointSide' : t > 280 ? 'wave' : 'down');

/* ---------- overlay chips (right panel, top) ---------- */
const CHIPS: [number, number, string, 'info' | 'warn' | 'bad' | 'good'][] = [
  [24.9, 33.6, '📍 PORTO ALEGRE · SETEMBRO DE 1903', 'warn'],
  [35.5, 42.7, '⚽ CÂNDIDO DIAS DA SILVA', 'info'],
  [53.2, 59.0, '👔 1º PRESIDENTE: CARLOS LUIZ BOHRER', 'info'],
  [67.0, 72.0, '😱 HAVANA = MARROM CLARO', 'bad'],
  [74.3, 80.5, '📅 AS DATAS VARIAM CONFORME A FONTE', 'info'],
  [80.5, 85.3, '🇩🇪 HAMBURGO? (UMA DAS VERSÕES)', 'warn'],
  [93.0, 98.5, '📍 BAIXADA · MOINHOS DE VENTO', 'info'],
  [105.1, 108.7, '😅 CALMA, COLORADO: TEU VÍDEO VEM AÍ', 'bad'],
  [130.6, 139.5, '🎵 LUPICÍNIO RODRIGUES · 1953', 'warn'],
  [139.6, 145.7, '🚌 GREVE DO TRANSPORTE → "ATÉ A PÉ"', 'info'],
  [151.5, 162.3, '⭐ EVERALDO · CAMPEÃO DO MUNDO 1970', 'warn'],
  [168.3, 179.2, 'UM MARCO CONTRA A BARREIRA RACIAL', 'info'],
  [189.8, 193.5, '🧠 TÉCNICO: VALDIR ESPINOSA', 'info'],
  [195.2, 201.0, '🇯🇵 FINAL NO JAPÃO', 'warn'],
  [213.1, 223.4, '🧠 TÉCNICO: FELIPÃO', 'info'],
  [226.1, 235.8, '🏆 PENTACAMPEÃO DA COPA DO BRASIL', 'warn'],
  [249.2, 253.6, '📍 RECIFE · 26/11/2005', 'info'],
  [253.7, 257.8, '🟥 EXPULSÕES: SÓ 7 EM CAMPO', 'bad'],
  [257.9, 260.0, '🧤 GALATTO DEFENDE O PÊNALTI', 'good'],
  [260.0, 264.1, '⚽ ANDERSON, 17 ANOS', 'warn'],
  [264.2, 267.3, '🏆 CAMPEÃO DA SÉRIE B', 'good'],
  [271.3, 279.9, '🧠 RENATO, AGORA TÉCNICO', 'info'],
  [284.4, 291.5, 'BOLA FURADA → CAMPEÃO DO MUNDO', 'warn'],
];

const SFX: [string, number, number][] = [
  ['plim', 0.0, 0.3], ['scratch', 3.0, 0.3],
  ...CUTS.map((c) => ['whoosh', c - 0.12, 0.16] as [string, number, number]),
  ...CHAPTERS.slice(1).map((c) => ['ding', c.a, 0.22] as [string, number, number]),
  ['erro', 32.8, 0.22], ['carimbo', 49.3, 0.4], ['pop', 55.3, 0.25], ['boing', 72.2, 0.25],
  ['carimbo', 93.0, 0.35], ['aplauso', 99.8, 0.3], ['latido', 105.3, 0.3],
  ['pop', 148.9, 0.3], ['pop', 183.4, 0.25], ['pop', 188.1, 0.25], ['aplauso', 201.7, 0.35], ['aplauso', 207.3, 0.3],
  ['pop', 215.6, 0.22], ['pop', 217.5, 0.22], ['pop', 220.3, 0.22],
  ['pop', 228.1, 0.2], ['pop', 229.8, 0.2], ['pop', 231.6, 0.2], ['pop', 233.4, 0.2], ['pop', 234.4, 0.2],
  ['erro', 240.6, 0.2], ['acerto', 257.9, 0.3], ['aplauso', 262.3, 0.4], ['pop', 273.6, 0.25], ['pop', 276.0, 0.25], ['aplauso', 278.0, 0.3],
  ['ding', 299.4, 0.25],
];

/* ---------- layout pieces ---------- */
const Background: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={W} height={H} fill="#0B1824" />
    {Array.from({ length: 22 }).map((_, i) => (
      <rect key={i} x={-300 + i * 120 + ((t * 15) % 120)} y={-200} width={44} height={1500} fill={[BLUE, BLACK, '#F4F4F4'][i % 3]} opacity={0.12} transform={`rotate(14 ${W / 2} ${H / 2})`} />
    ))}
    <rect x={0} y={0} width={700} height={H} fill="rgba(13,128,191,.18)" />
  </g>
);

const Chip: React.FC<{ t: number; a: number; b: number; text: string; kind: 'info' | 'warn' | 'bad' | 'good' }> = ({ t, a, b, text, kind }) => {
  if (t < a || t > b) return null;
  const bg = { bad: '#C62828', good: '#2E7D32', warn: MUST, info: 'rgba(20,16,12,.92)' }[kind];
  return (
    <div style={{ position: 'absolute', left: 770, width: 940, top: 40, display: 'flex', justifyContent: 'center', opacity: clamp((b - t) / 0.2) }}>
      <div style={{ transform: `scale(${pop(t, a)})`, background: bg, color: kind === 'warn' ? '#1E1B18' : '#fff', borderRadius: 30, padding: '10px 26px', fontFamily: FONT, fontWeight: 900, fontSize: text.length > 30 ? 30 : 36, whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(0,0,0,.4)', border: '3px solid rgba(255,255,255,.85)' }}>{text}</div>
    </div>
  );
};

export const Video04L: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const seg = SEGS.find((s) => t >= s.a && t < s.b) ?? SEGS[SEGS.length - 1];
  const ch = [...CHAPTERS].reverse().find((c) => t >= c.a) ?? CHAPTERS[0];
  const lastCut = CUTS.filter((c) => c <= t).pop() ?? -1;
  const flash = lastCut > 0 && t - lastCut < 0.1 ? 1 - (t - lastCut) / 0.1 : 0;
  const showCusco = (t > 99.6 && t < 108.8) || t > 280;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
        <LauroDefs />
        <CuscoDefs />
        <Background t={t} />
        {/* narrator (left) */}
        <g transform="translate(360,1500) scale(0.62)">
          <Lauro t={t} talk={talk(t)} expr={lauroExpr(t) as React.ComponentProps<typeof Lauro>['expr']} arm={lauroArm(t)} armWobble={Math.sin(t * 6) * 5} scarf
            hop={jump(t, 3.0, 0.35, 80) + jump(t, 262.3, 0.4, 120) + jump(t, 207.3, 0.4, 100)} />
        </g>
        {showCusco && (
          <g transform={`translate(${kf(t, [[99.6, 820], [100.3, 610], [108, 610], [280, 610]])},1090) scale(0.55)`}>
            <CuscoSit t={t} chew={false} tiltHead={Math.sin(t * 3) * 18} />
          </g>
        )}
        {/* stage (right) */}
        <g transform={`translate(1240,${515}) scale(0.8)`}>{seg.draw(t, t - seg.a)}</g>
        {(t > 201.5 && t < 205) && <g transform="translate(700,0)"><Confetti t={t} start={201.6} /></g>}
        {(t > 262.3 && t < 266) && <g transform="translate(700,0)"><Confetti t={t} start={262.4} /></g>}
      </svg>

      {/* left header: brand + chapter + year */}
      <div style={{ position: 'absolute', left: 40, top: 36, fontFamily: FONT }}>
        <div style={{ display: 'inline-block', background: 'rgba(20,16,12,.85)', borderRadius: 12, padding: '8px 18px', fontWeight: 900, fontSize: 28, color: '#fff' }}>
          <span style={{ color: MUST }}>BAH, TU SABIA?</span> · #004
        </div>
        <div style={{ marginTop: 14, color: MUST, fontWeight: 900, fontSize: 30 }}>{ch.n}</div>
        <div style={{ color: '#fff', fontWeight: 900, fontSize: 40, maxWidth: 620, lineHeight: 1.1, transform: `scale(${pop(t, ch.a, 0.3) || 1})`, transformOrigin: 'left' }}>{ch.title}</div>
        <div style={{ marginTop: 10, color: '#fff', opacity: 0.9, fontWeight: 900, fontSize: 92, WebkitTextStroke: '10px #0B1824', paintOrder: 'stroke fill' }}>{ch.year}</div>
      </div>

      {CHIPS.map(([a, b, text, kind], i) => <Chip key={i} t={t} a={a} b={b} text={text} kind={kind} />)}
      <Captions t={t} hidden={t < 0.05} words={WORDSL} y={948} size={60} left={770} right={150} />

      {flash > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash * 0.8})` }} />}
      {t > 306.9 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - 306.9) / 0.55)})` }} />}

      <Audio src={staticFile('audio/video04L_voz.mp3')} />
      <Audio src={staticFile('audio/video04L_musica.mp3')} />
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={Math.round(5 * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
