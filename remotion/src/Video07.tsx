import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import './fonts';
import { FPS, MUST, kf, clamp, pop, makeVoice, Word } from './lib';
import { Lauro, LauroDefs, Expr, ArmPose } from './chars/Lauro';
import { Pia, PiaDefs, PiaExpr, PiaArms } from './chars/Pia';
import { CuscoSit, CuscoRun, CuscoDefs } from './chars/Others';
import { SerraWorld, StagePlaca, StageClareira, StageMata, StageViagem, MetricAltitude, MetricPop, MetricTermo, StageClubes, StageUva, UVA } from './scenes/Caxias';
import { ConfettiC } from './scenes/Inter';
import { Cam, Shot } from './camera';
import { HUD, BigText, Captions, SeloCusco } from './ui/Overlays';
import rms07 from './data/v07/rms.json';
import words07 from './data/v07/words.json';
import falas07 from './data/v07/falas.json';

/* #007 (curto, vertical) — Caxias do Sul já se chamou Campo dos Bugres?, com o Piá */
export const DURATION_07 = 92.6;
const rms = makeVoice(rms07 as number[]);
const FALAS = falas07 as { n: number; quem: string; s: number; e: number }[];
const quem = (t: number) => FALAS.find((f) => t >= f.s - 0.05 && t <= f.e + 0.05)?.quem;
const talkL = (t: number) => (quem(t) === 'L' ? rms(t) : 0);
const talkP = (t: number) => (quem(t) === 'P' ? rms(t) : 0);
const WORDS = words07 as Word[];
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';
const jump = (t: number, at: number, dur: number, h: number) => (t > at && t < at + dur ? Math.sin((Math.PI * (t - at)) / dur) * h : 0);
const pick = <T,>(t: number, list: [number, T][], def: T): T => {
  let v = def;
  for (const [a, x] of list) if (t >= a) v = x;
  return v;
};
/* trecho sóbrio (indígenas e bugreiros): sem humor, sem Cusco, sem pulos, música baixa */
const SOB_A = 14.3, SOB_B = 24.4;
const sober = (t: number) => t > SOB_A && t < SOB_B;
/* selo do Cusco, no meio do vídeo */
const SELO = 54.05;

const GROUND = 1868;
const LS = 0.38, PS = 0.38;
const lauroX = (t: number) => kf(t, [[0, -170], [2.3, 270], [24.5, 270], [26.5, 380], [40.0, 380], [41.2, 290], [77.8, 290], [79.6, 360]]);
const lauroWalk = (t: number) => clamp(Math.abs(lauroX(t + 0.05) - lauroX(t - 0.05)) / 12);
const piaX = (t: number) => kf(t, [[0, 1300], [3.2, 1300], [3.95, 840], [77.8, 840], [79.6, 770]]);
const piaWalk = (t: number) => clamp(Math.abs(piaX(t + 0.05) - piaX(t - 0.05)) / 12);

/* ---------- câmera ---------- */
const CARD = (at: number, z = 1.12, ease?: number): Shot => ({ at, x: 540, y: 830, z: 1 + (z - 1) * 0.45, ease });
const WIDE = (at: number, ease?: number): Shot => ({ at, x: 540, y: 960, z: 1, ease });
const LAU = (at: number, x: number, ease?: number, z = 1.3): Shot => ({ at, x: x + 40, y: 1460, z, ease });
const PIA = (at: number, ease?: number, z = 1.38): Shot => ({ at, x: 800, y: 1580, z, ease });
const SHOTS: Shot[] = [
  { at: 0, x: -60, y: 1360, z: 1.35 },
  { at: 2.3, x: 300, y: 1360, z: 1.35, ease: 2.3 },
  PIA(4.4, 0.45),
  CARD(7.6, 1.1, 0.8),
  CARD(13.0, 1.16, 1.2),
  CARD(16.0, 1.06, 2.5), // sóbrio: aproximação lenta
  PIA(23.0, 0.9, 1.3),
  WIDE(25.4, 0.8),
  CARD(28.0, 1.1, 0.8),
  { at: 36.5, x: 600, y: 760, z: 1.12, ease: 3.0 }, // sobe com a família
  PIA(40.6, 0.35),
  CARD(43.0, 1.12, 0.7),
  { at: 49.5, x: 540, y: 800, z: 1.14, ease: 1.2 },
  WIDE(53.2, 0.7), // abre para o selo do Cusco
  PIA(55.1, 0.4),
  CARD(57.6, 1.1, 0.7),
  { at: 62.0, x: 520, y: 860, z: 1.12, ease: 2.0 },
  PIA(65.0, 0.35),
  CARD(68.3, 1.1, 0.7),
  CARD(72.2, 1.16, 0.6),
  WIDE(77.0, 0.8),
  PIA(78.5, 0.35),
  CARD(81.0, 1.1, 0.7),
  { at: 85.4, x: 540, y: 900, z: 1.06, ease: 1.0 },
  { at: 87.6, x: 540, y: 1470, z: 1.17, ease: 1.4 },
];
const PUNCHES = [1.7, 43.0, 48.7, 52.9, SELO, 58.4, 72.2, 83.9];

/* ---------- cards ---------- */
type Card = { a: number; b: number; draw: (t: number) => React.ReactNode };
const NOMES: [number, string, string?][] = [[0, 'CAXIAS DO SUL'], [1.7, 'CAMPO DOS BUGRES', 'ATÉ 1877']];
const CARDS: Card[] = [
  { a: 0, b: 7.4, draw: (t) => <StagePlaca t={t} names={NOMES} /> },
  { a: 7.4, b: 14.4, draw: (t) => <StageClareira t={t} a={7.4} /> },
  { a: 14.4, b: 24.4, draw: (t) => <StageMata t={t} a={14.4} /> },
  { a: 24.4, b: 32.8, draw: (t) => <StageViagem t={t} prog={kf(t, [[25.6, 0], [31.0, 1]])} /> },
  { a: 32.8, b: 40.2, draw: (t) => <MetricAltitude t={t} a={32.8} /> },
  { a: 40.2, b: 53.3, draw: (t) => <StagePlaca t={t} names={[[0, 'CAMPO DOS BUGRES', 'ATÉ 1877'], [43.0, 'COLÔNIA CAXIAS', '1877'], [48.7, 'MUNICÍPIO', '20/06/1890'], [52.9, 'CAXIAS DO SUL', '1944']]} /> },
  { a: 56.6, b: 64.5, draw: (t) => <MetricPop t={t} a={57.6} /> },
  { a: 67.2, b: 70.4, draw: (t) => <StageClubes t={t} a={67.6} /> },
  { a: 70.4, b: 78.0, draw: (t) => <StageUva t={t} a={70.5} /> },
  { a: 80.4, b: 86.4, draw: (t) => <MetricTermo t={t} a={80.4} downT={81.9} /> },
];
const CUTS = CARDS.map((c) => c.a).filter((a) => a > 0);

const LEXPR: [number, Expr][] = [[0, 'delight'], [1.4, 'talk'], [3.6, 'laugh'], [5.5, 'smile'], [7.4, 'talk'], [SOB_A, 'sad'], [SOB_B, 'smile'], [25.4, 'talk'], [40.0, 'smile'], [42.2, 'talk'], [53.0, 'delight'], [54.5, 'laugh'], [56.6, 'talk'], [64.5, 'squint'], [67.2, 'laugh'], [68.5, 'talk'], [77.8, 'smile'], [80.2, 'delight'], [81.5, 'talk'], [86.4, 'smile'], [86.9, 'talk'], [89.4, 'wink'], [90.2, 'smile']];
const LARM: [number, ArmPose][] = [[0, 'wave'], [2.6, 'down'], [7.5, 'pointSide'], [SOB_A, 'down'], [25.4, 'pointSide'], [32.9, 'pointUp'], [40.0, 'down'], [42.6, 'pointSide'], [52.9, 'thumbsUp'], [54.6, 'down'], [57.8, 'pointUp'], [60.0, 'pointSide'], [64.5, 'down'], [67.3, 'wag'], [70.4, 'pointSide'], [77.8, 'hold'], [80.3, 'pointSide'], [86.4, 'pointDown']];
const PEXPR: [number, PiaExpr][] = [[0, 'smile'], [3.8, 'laugh'], [7.2, 'smile'], [SOB_A, 'pout'], [SOB_B, 'smile'], [40.2, 'talk'], [42.0, 'smile'], [54.0, 'shock'], [54.7, 'talk'], [56.4, 'shock'], [58.5, 'smile'], [64.6, 'smug'], [67.4, 'pout'], [70.6, 'smile'], [78.0, 'talk'], [80.4, 'shock'], [83.0, 'smile'], [86.4, 'laugh'], [88.0, 'smile']];
const PARMS: [number, PiaArms][] = [[0, 'down'], [3.8, 'shrug'], [7.2, 'down'], [40.2, 'present'], [42.0, 'down'], [54.7, 'count'], [56.4, 'down'], [64.6, 'hips'], [67.4, 'cross'], [70.6, 'down'], [78.0, 'cross'], [86.4, 'cheer'], [88.2, 'down']];

const Chip: React.FC<{ t: number; a: number; b: number; text: string; kind?: 'bad' | 'good' | 'warn' | 'info'; y?: number }> = ({ t, a, b, text, kind = 'info', y = 300 }) => {
  if (t < a || t > b) return null;
  const bg = { bad: '#C62828', good: '#2E7D32', warn: MUST, info: 'rgba(20,16,12,.9)' }[kind];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: clamp((b - t) / 0.15) }}>
      <div style={{ transform: `scale(${pop(t, a)})`, background: bg, color: kind === 'warn' ? '#1E1B18' : '#fff', borderRadius: 40, padding: '14px 30px', fontFamily: FONT, fontWeight: 900, fontSize: text.length > 26 ? 36 : 44, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(0,0,0,.35)', border: '4px solid rgba(255,255,255,.85)' }}>{text}</div>
    </div>
  );
};

const SFX: [string, number, number][] = [
  ['plim', 0.0, 0.3], ['whoosh', 1.6, 0.25], ['pop', 1.75, 0.3], ['patinhas', 3.2, 0.2], ['boing', 3.9, 0.2],
  ...CUTS.filter((c) => !sober(c) && Math.abs(c - SOB_B) > 0.01).map((c) => ['whoosh', c - 0.12, 0.18] as [string, number, number]),
  ['agua', 8.0, 0.18], ['vento', 14.6, 0.12],
  ['whoosh', 25.7, 0.2], ['ding', 31.0, 0.25], ['tictac', 33.2, 0.12], ['ding', 36.0, 0.3],
  ['pop', 43.0, 0.3], ['pop', 48.7, 0.3], ['pop', 52.9, 0.3],
  ['patinhas', 52.6, 0.35], ['latido', SELO - 0.05, 0.4], ['carimbo', SELO, 0.5], ['whoosh', SELO + 1.5, 0.25], ['patinhas', SELO + 1.6, 0.3],
  ['tictac', 57.9, 0.12], ['ding', 59.6, 0.3], ['boing', 64.8, 0.2], ['pop', 67.7, 0.25], ['pop', 68.1, 0.25], ['plim', 72.2, 0.3], ['ding', 74.8, 0.25],
  ['chocalho', 78.2, 0.18], ['vento', 81.9, 0.15], ['tictac', 82.0, 0.12], ['ding', 83.9, 0.3], ['sino', 85.6, 0.15],
  ['aplauso', 86.6, 0.2], ['latido', 89.2, 0.3],
];

export const Video07: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const card = CARDS.find((c) => t >= c.a && t < c.b);
  const lastCut = CUTS.filter((c) => c <= t).pop() ?? -1;
  const flash = lastCut > 0 && !sober(lastCut) && lastCut !== SOB_B && t - lastCut < 0.08 ? 1 - (t - lastCut) / 0.08 : 0;
  const lx = lauroX(t), px = piaX(t);
  const lHop = sober(t) ? 0 : jump(t, 0.05, 0.4, 70) + jump(t, 53.0, 0.4, 90) + jump(t, 80.25, 0.4, 90);
  const pHop = sober(t) ? 0 : jump(t, 3.85, 0.4, 100) + jump(t, SELO, 0.35, 110) + jump(t, 86.5, 0.4, 100);
  /* Cusco: corre até o centro, para, late (selo) e sai correndo pelo outro lado */
  const cuscoSeloRun = (t > 52.4 && t < 53.9) || (t > SELO + 1.55 && t < SELO + 3.2);
  const cuscoSeloStop = t >= 53.9 && t <= SELO + 1.55;
  const cuscoX = t < 54 ? kf(t, [[52.4, -250], [53.9, 540]]) : t > SELO + 1.55 ? kf(t, [[SELO + 1.55, 540], [SELO + 3.2, 1350]]) : 540;
  const cuscoTremble = t > 82.5 && t < 86.4;
  const cuscoShow = !sober(t) && (t < 7.4 || cuscoSeloRun || cuscoSeloStop || (t > 33 && t < 40.2) || cuscoTremble || t > 86.4);
  const cuscoSitX = t > 82 && t < 86.4 ? 640 : t > 86.4 ? 600 : t < 7.4 ? 600 : 700;
  const dark = sober(t) ? clamp(Math.min(t - SOB_A, SOB_B - t) / 0.8) * 0.45 : 0;
  const cold = t > 80.4 && t < 86.6 ? clamp(Math.min(t - 81.9, 86.6 - t) / 0.8) : 0;
  const snow = t > 85.3 && t < 87.5 ? clamp(Math.min(t - 85.3, 87.5 - t) / 0.4) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
        <LauroDefs />
        <PiaDefs />
        <CuscoDefs />
        <Cam t={t} shots={SHOTS} punches={PUNCHES} breath={sober(t) ? 0.5 : 1}>
          <SerraWorld t={t} cold={cold} snow={snow} />
          <rect x={-600} y={-600} width={2280} height={3120} fill={`rgba(10,14,24,${dark})`} />
          {card && <g transform="translate(540,780) scale(0.82)">{card.draw(t)}</g>}
          {t > 86.6 && t < 89.8 && <ConfettiC t={t} start={86.6} colors={[UVA, '#5C8A34', MUST, '#fff']} />}
          {cuscoShow && (
            <g transform={`translate(${cuscoSeloRun || cuscoSeloStop ? cuscoX : cuscoSitX},${GROUND - 10})`}>
              {cuscoSeloRun ? (
                <g transform="scale(0.5)"><CuscoRun t={t} bread={false} /></g>
              ) : (
                <g transform={`scale(0.5) translate(${cuscoTremble ? Math.sin(t * 60) * 3 : 0},0)`}>
                  <CuscoSit t={t} chew={false} tiltHead={cuscoSeloStop ? -18 : t < 7.4 ? Math.sin(t * 2) * 16 : Math.sin(t * 3) * 10} />
                </g>
              )}
            </g>
          )}
          <g transform={`translate(${lx},${GROUND}) scale(${LS})`}>
            <Lauro t={t} talk={talkL(t)} expr={pick(t, LEXPR, 'talk')} arm={pick(t, LARM, 'down')} armWobble={sober(t) ? 0 : Math.sin(t * 5) * 5} walk={lauroWalk(t)} hop={lHop / LS}
              cuiaRaise={t > 86.5 && t < 89.5 ? kf(t, [[86.5, 0], [86.9, 1]]) : 0} />
          </g>
          <g transform={`translate(${px},${GROUND}) scale(${-PS},${PS})`}>
            <Pia t={t} talk={talkP(t)} expr={pick(t, PEXPR, 'smile')} arms={pick(t, PARMS, 'down')} walk={piaWalk(t)} hop={pHop / PS} gaze={quem(t) === 'L' ? 1 : 0.4}
              tilt={sober(t) ? 10 : quem(t) === 'P' ? Math.sin(t * 3) * 5 : 0} lean={t > 78 && t < 80.4 ? Math.sin(t * 40) * 1.5 : 0} />
          </g>
        </Cam>
      </svg>
      <HUD num="#007" cat="🍇 HISTÓRIA · SERRA" />
      <BigText t={t} start={0} end={1.6} lines={['BAH, TU', 'SABIA?']} y={380} size={110} />
      <Chip t={t} a={9.2} b={14.2} text="💧 CLAREIRA COM FONTES DE ÁGUA" />
      <Chip t={t} a={26.0} b={32.6} text="🇮🇹 IMIGRANTES DO VÊNETO" kind="warn" />
      <Chip t={t} a={46.2} b={48.6} text="🎖️ HOMENAGEM AO DUQUE DE CAXIAS" />
      <Chip t={t} a={65.0} b={67.1} text="💙 GREMISTA PROVOCADOR" kind="warn" />
      <Chip t={t} a={85.4} b={86.4} text="❄️ ÀS VEZES ATÉ NEVA" />
      <Chip t={t} a={87.0} b={92.6} text="COMENTA 👇 NONO OU NONA DA SERRA?" kind="warn" />
      <SeloCusco t={t} at={SELO} num="#007" tema="CAXIAS DO SUL" cy={860} />
      <Captions t={t} hidden={t < 0.05 || (t > SELO && t < SELO + 1.9)} words={WORDS} y={1545} />
      {flash > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash * 0.8})` }} />}
      {t > 92.0 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - 92.0) / 0.5)})` }} />}
      <Audio src={staticFile('audio/v07_voz.mp3')} />
      <Audio src={staticFile('audio/v07_musica.mp3')} volume={(f) => {
        const tt = f / FPS;
        return kf(tt, [[SOB_A - 0.8, 1], [SOB_A, 0.25], [SOB_B, 0.25], [SOB_B + 0.8, 1]]);
      }} />
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={Math.round(5 * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
