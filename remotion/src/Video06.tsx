import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import './fonts';
import { FPS, MUST, kf, clamp, pop, makeVoice, Word } from './lib';
import { Lauro, LauroDefs, Expr, ArmPose } from './chars/Lauro';
import { Guria, GuriaDefs, GuriaExpr, GuriaArms } from './chars/Guria';
import { CuscoSit, CuscoRun, CuscoDefs } from './chars/Others';
import { StageCalendar, StageTitle } from './scenes/Gremio';
import { GuaibaWorld, ConfettiC } from './scenes/Inter';
import {
  StageCountry, StageCharque, StageFarrapos, StageRepublic, StageLaguna, StageBoatsLand, StageTenYears, StagePorongos, StageBook, StagePeace, StageParade, StageBigFlag,
  VERDE, VERMELHO, AMARELO,
} from './scenes/Farroupilha';
import { Cam, Shot } from './camera';
import { HUD, BigText, Captions } from './ui/Overlays';
import rms06 from './data/v06/rms.json';
import words06 from './data/v06/words.json';
import falas06 from './data/v06/falas.json';

/* #006 (curto, vertical) — O Rio Grande do Sul já foi um país? (Revolução Farroupilha), com a Guria */
export const DURATION_06 = 91.0;
const rms = makeVoice(rms06 as number[]);
const FALAS = falas06 as { n: number; quem: string; s: number; e: number }[];
const quem = (t: number) => FALAS.find((f) => t >= f.s - 0.05 && t <= f.e + 0.05)?.quem;
const talkL = (t: number) => (quem(t) === 'L' ? rms(t) : 0);
const talkG = (t: number) => (quem(t) === 'G' ? rms(t) : 0);
const WORDS = words06 as Word[];
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';
const jump = (t: number, at: number, dur: number, h: number) => (t > at && t < at + dur ? Math.sin((Math.PI * (t - at)) / dur) * h : 0);
const pick = <T,>(t: number, list: [number, T][], def: T): T => {
  let v = def;
  for (const [a, x] of list) if (t >= a) v = x;
  return v;
};
/* trecho sóbrio (Porongos): sem humor, sem Cusco, sem pulos, música baixa */
const SOB_A = 55.6, SOB_B = 71.4;
const sober = (t: number) => t > SOB_A && t < SOB_B;

const GROUND = 1868;
const LS = 0.38, GS = 0.4;
const lauroX = (t: number) => kf(t, [[0, -170], [2.3, 270], [28.0, 270], [30.5, 400], [39.0, 400], [40.5, 300], [76.5, 300], [78.5, 360]]);
const lauroWalk = (t: number) => clamp(Math.abs(lauroX(t + 0.05) - lauroX(t - 0.05)) / 12);
const guriaX = (t: number) => kf(t, [[0, 1300], [2.2, 1300], [2.95, 840], [76.5, 840], [78.5, 770]]);
const guriaWalk = (t: number) => clamp(Math.abs(guriaX(t + 0.05) - guriaX(t - 0.05)) / 12);

/* ---------- câmera ---------- */
const CARD = (at: number, z = 1.12, ease?: number): Shot => ({ at, x: 540, y: 830, z: 1 + (z - 1) * 0.45, ease });
const WIDE = (at: number, ease?: number): Shot => ({ at, x: 540, y: 960, z: 1, ease });
const LAU = (at: number, x: number, ease?: number, z = 1.3): Shot => ({ at, x: x + 40, y: 1460, z, ease });
const GUR = (at: number, ease?: number, z = 1.38): Shot => ({ at, x: 800, y: 1580, z, ease });
const SHOTS: Shot[] = [
  { at: 0, x: -60, y: 1360, z: 1.35 },
  { at: 2.3, x: 300, y: 1360, z: 1.35, ease: 2.3 },
  GUR(3.3, 0.45),
  CARD(6.0, 1.1, 0.8),
  CARD(11.4, 1.18, 0.5),
  WIDE(17.2, 0.9),
  GUR(18.8, 0.35),
  CARD(21.0, 1.1, 0.8),
  CARD(29.2, 1.1, 0.8),
  { at: 33.8, x: 520, y: 720, z: 1.1, ease: 3.0 }, // grua acompanhando a bandeira subir
  GUR(37.2, 0.35),
  CARD(40.0, 1.12, 0.7),
  { at: 46.0, x: 620, y: 720, z: 1.12, ease: 5.0 }, // segue o caminho até Laguna
  { at: 48.5, x: 320, y: 830, z: 1.1, r: -1.2, ease: 0.4 }, // whip para os barcos
  { at: 50.6, x: 700, y: 830, z: 1.1, r: 0, ease: 2.0 }, // acompanha os barcos
  GUR(51.0, 0.3),
  WIDE(52.8, 0.6),
  CARD(57.6, 1.06, 2.5), // sóbrio: aproximação lenta
  { at: 64.6, x: 540, y: 800, z: 1.1, ease: 5.0 },
  GUR(65.7, 0.9),
  CARD(67.6, 1.1, 1.0),
  CARD(72.4, 1.1, 0.8),
  WIDE(77.2, 0.8),
  LAU(80.6, 300, 0.6, 1.22),
  CARD(83.9, 1.08, 0.6),
  { at: 87.6, x: 540, y: 1470, z: 1.17, ease: 1.6 },
];
const PUNCHES = [7.9, 11.3, 26.8, 32.9, 36.0, 46.3, 49.6, 73.4, 83.5];

/* ---------- cards ---------- */
type Card = { a: number; b: number; draw: (t: number) => React.ReactNode };
const CARDS: Card[] = [
  { a: 0, b: 5.1, draw: (t) => <StageCountry t={t} splitT={1.7} /> },
  { a: 5.1, b: 9.4, draw: (t) => <StageCalendar t={t} stampT={7.9} day="20" month="SETEMBRO" year="1835" stamp="INÍCIO" stampC={VERMELHO} /> },
  { a: 9.4, b: 16.4, draw: (t) => <StageCharque t={t} stampT={11.3} /> },
  { a: 16.4, b: 20.2, draw: (t) => <StageTitle t={t} at={16.5} kicker="1835 · 1845" title="REVOLUÇÃO FARROUPILHA" bg={VERDE} stripes={[VERMELHO, AMARELO]} /> },
  { a: 20.2, b: 28.4, draw: (t) => <StageFarrapos t={t} morphT={26.8} /> },
  { a: 28.4, b: 39.3, draw: (t) => <StageRepublic t={t} flagT={32.9} pinT={36.0} /> },
  { a: 39.3, b: 48.0, draw: (t) => <StageLaguna t={t} prog={kf(t, [[40.9, 0], [43.2, 1]])} julianaT={46.3} /> },
  { a: 48.0, b: 53.5, draw: (t) => <StageBoatsLand t={t} a={48.2} b={53.5} /> },
  { a: 53.5, b: 56.3, draw: (t) => <StageTenYears t={t} a={53.6} /> },
  { a: 56.3, b: 66.3, draw: (t) => <StagePorongos t={t} a={56.4} /> },
  { a: 66.3, b: 71.4, draw: (t) => <StageBook t={t} openT={69.4} /> },
  { a: 71.4, b: 76.5, draw: (t) => <StagePeace t={t} at={73.4} /> },
  { a: 76.5, b: 83.3, draw: (t) => <StageParade t={t} /> },
  { a: 83.3, b: 86.1, draw: (t) => <StageBigFlag t={t} at={83.4} /> },
];
const CUTS = CARDS.map((c) => c.a).filter((a) => a > 0);

const LEXPR: [number, Expr][] = [[0, 'delight'], [1.4, 'talk'], [2.8, 'smile'], [5.1, 'talk'], [16.4, 'smile'], [17.0, 'talk'], [18.4, 'smile'], [20.2, 'laugh'], [21.0, 'talk'], [32.9, 'delight'], [34.0, 'talk'], [36.8, 'smile'], [39.3, 'laugh'], [40.3, 'talk'], [50.6, 'shock'], [52.2, 'delight'], [53.4, 'talk'], [SOB_A, 'sad'], [65.0, 'sad'], [SOB_B, 'talk'], [76.5, 'smile'], [79.8, 'smile'], [80.5, 'talk'], [86.1, 'smile'], [87.0, 'wink'], [88.0, 'smile']];
const LARM: [number, ArmPose][] = [[0, 'wave'], [2.6, 'down'], [7.5, 'pointSide'], [11.0, 'hold'], [16.4, 'pointUp'], [18.3, 'down'], [20.5, 'pointSide'], [28.4, 'pointUp'], [32.9, 'thumbsUp'], [34.2, 'pointSide'], [36.8, 'down'], [39.3, 'pointSide'], [50.5, 'down'], [52.2, 'thumbsUp'], [53.6, 'down'], [SOB_B, 'pointSide'], [76.5, 'down'], [79.8, 'hold'], [83.5, 'pointSide'], [86.1, 'pointDown']];
const GEXPR: [number, GuriaExpr][] = [[0, 'smile'], [2.83, 'shock'], [4.9, 'smile'], [18.4, 'talk'], [20.0, 'smile'], [36.84, 'smug'], [39.2, 'smile'], [50.67, 'shock'], [52.1, 'laugh'], [53.4, 'smile'], [SOB_A, 'sad'], [SOB_B, 'smile'], [76.57, 'talk'], [79.7, 'smile']];
const GARMS: [number, GuriaArms][] = [[0, 'down'], [2.83, 'present'], [4.9, 'down'], [18.4, 'shrug'], [20.0, 'down'], [36.84, 'present'], [39.2, 'down'], [50.67, 'cheer'], [52.1, 'down'], [76.57, 'present'], [79.7, 'skirt']];

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
  ['plim', 0.0, 0.3], ['patinhas', 0.3, 0.2], ['whoosh', 1.7, 0.25], ['pop', 2.85, 0.3], ['boing', 2.95, 0.2],
  ...CUTS.filter((c) => !sober(c) && Math.abs(c - SOB_B) > 0.01).map((c) => ['whoosh', c - 0.12, 0.18] as [string, number, number]),
  ['carimbo', 7.9, 0.4], ['carimbo', 11.3, 0.45], ['ding', 16.5, 0.3], ['toin', 18.5, 0.2],
  ['pop', 26.8, 0.3], ['aplauso', 32.9, 0.2], ['ding', 36.0, 0.3], ['carimbo', 37.6, 0.3], ['latido', 38.2, 0.3],
  ['whoosh', 40.9, 0.25], ['ding', 43.2, 0.25], ['ding', 46.3, 0.3], ['caminhao', 48.2, 0.2], ['boom', 49.6, 0.25],
  ['boing', 50.7, 0.3], ['patinhas', 50.8, 0.3], ['latido', 51.2, 0.3], ['tictac', 53.6, 0.12],
  ['vento', 56.4, 0.12], ['sino', 69.4, 0.12],
  ['acerto', 73.4, 0.25], ['aplauso', 77.0, 0.2], ['ding', 83.5, 0.3], ['aplauso', 83.6, 0.25], ['latido', 87.0, 0.3],
];

export const Video06: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const card = CARDS.find((c) => t >= c.a && t < c.b);
  const lastCut = CUTS.filter((c) => c <= t).pop() ?? -1;
  const flash = lastCut > 0 && !sober(lastCut) && lastCut !== SOB_B && t - lastCut < 0.08 ? 1 - (t - lastCut) / 0.08 : 0;
  const lx = lauroX(t), gx = guriaX(t);
  const lHop = sober(t) ? 0 : jump(t, 0.05, 0.4, 70) + jump(t, 32.95, 0.4, 80) + jump(t, 52.25, 0.4, 100) + jump(t, 83.6, 0.45, 100);
  const gHop = sober(t) ? 0 : jump(t, 2.85, 0.4, 100) + jump(t, 50.7, 0.35, 90) + jump(t, 83.7, 0.4, 90);
  const cuscoRun = t > 50.6 && t < 53.6;
  const cuscoX = cuscoRun ? kf(t, [[50.6, -250], [53.6, 1350]]) : 600;
  const cuscoShow = !sober(t) && (t < 5.1 || (t > 36.8 && t < 39.4) || cuscoRun || t > 76.5);
  const dark = sober(t) ? clamp(Math.min(t - SOB_A, SOB_B - t) / 0.8) * 0.45 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
        <LauroDefs />
        <GuriaDefs />
        <CuscoDefs />
        <Cam t={t} shots={SHOTS} punches={PUNCHES} breath={sober(t) ? 0.5 : 1}>
          <GuaibaWorld t={t} />
          <rect x={-600} y={-600} width={2280} height={3120} fill={`rgba(10,14,24,${dark})`} />
          {card && <g transform="translate(540,780) scale(0.82)">{card.draw(t)}</g>}
          {t > 83.5 && t < 86.6 && <ConfettiC t={t} start={83.6} colors={[VERDE, VERMELHO, AMARELO, '#fff']} />}
          {cuscoShow && (
            <g transform={`translate(${cuscoX},${GROUND - 10})`}>
              {cuscoRun ? (
                <g transform="scale(0.5)"><CuscoRun t={t} bread={false} /></g>
              ) : (
                <g transform="scale(0.5)"><CuscoSit t={t} chew={false} tiltHead={t < 5.1 ? Math.sin(t * 2) * 16 : t > 86 ? 14 : Math.sin(t * 3) * 10} /></g>
              )}
            </g>
          )}
          <g transform={`translate(${lx},${GROUND}) scale(${LS})`}>
            <Lauro t={t} talk={talkL(t)} expr={pick(t, LEXPR, 'talk')} arm={pick(t, LARM, 'down')} armWobble={sober(t) ? 0 : Math.sin(t * 5) * 5} walk={lauroWalk(t)} hop={lHop / LS}
              cuiaRaise={t > 80.0 && t < 82.6 ? kf(t, [[80.0, 0], [80.4, 1]]) : 0} />
          </g>
          <g transform={`translate(${gx},${GROUND}) scale(${-GS},${GS})`}>
            <Guria t={t} talk={talkG(t)} expr={pick(t, GEXPR, 'smile')} arms={pick(t, GARMS, 'down')} walk={guriaWalk(t)} hop={gHop / GS} gaze={quem(t) === 'L' ? 1 : 0.4} tilt={quem(t) === 'G' ? Math.sin(t * 3) * 5 : 0} />
          </g>
        </Cam>
      </svg>
      <HUD num="#006" cat="🟩🟥🟨 HISTÓRIA" />
      <BigText t={t} start={0} end={1.6} lines={['BAH, TU', 'SABIA?']} y={380} size={110} />
      <BigText t={t} start={52.2} end={53.5} lines={['POR', 'TERRA!']} y={400} size={120} />
      <Chip t={t} a={7.0} b={9.4} text="📅 20/09/1835" kind="warn" />
      <Chip t={t} a={12.4} b={16.4} text="🥩 CHARQUE = CARNE-SECA" />
      <Chip t={t} a={22.1} b={26.7} text="❓ UMA DAS VERSÕES" />
      <Chip t={t} a={31.0} b={35.9} text="⚔️ BATALHA DO SEIVAL · 1836" />
      <Chip t={t} a={36.9} b={39.2} text="🛂 PASSAPORTE?" kind="warn" />
      <Chip t={t} a={47.2} b={50.6} text="⛵ GARIBALDI" kind="warn" />
      <Chip t={t} a={73.6} b={76.4} text="🕊️ PAZ DE PONCHE VERDE" kind="good" />
      <Chip t={t} a={86.3} b={91} text="COMENTA 👇" kind="warn" />
      <Captions t={t} hidden={t < 0.05} words={WORDS} y={1545} />
      {flash > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash * 0.8})` }} />}
      {t > 90.4 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - 90.4) / 0.5)})` }} />}
      <Audio src={staticFile('audio/v06_voz.mp3')} />
      <Audio src={staticFile('audio/v06_musica.mp3')} volume={(f) => {
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
