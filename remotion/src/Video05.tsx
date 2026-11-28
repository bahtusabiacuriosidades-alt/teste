import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import './fonts';
import { FPS, MUST, kf, clamp, pop, makeVoice, Word } from './lib';
import { Lauro, LauroDefs, Expr, ArmPose } from './chars/Lauro';
import { Pia, PiaDefs, PiaExpr, PiaArms } from './chars/Pia';
import { CuscoSit, CuscoRun, CuscoDefs } from './chars/Others';
import { StageCalendar, StageWorld, Scoreboard } from './scenes/Gremio';
import { GuaibaWorld, StageGate, StageTrain, StageRoller, StageBeiraRio, StageStars, StageCups, ConfettiC, ScarfProp, RED } from './scenes/Inter';
import { Cam, Shot } from './camera';
import { HUD, BigText, Captions } from './ui/Overlays';
import rms05 from './data/v05/rms.json';
import words05 from './data/v05/words.json';
import falas05 from './data/v05/falas.json';

/* #005 (curto, vertical) — A história do Inter, com o Piá */
export const DURATION_05 = 87.0;
const rms = makeVoice(rms05 as number[]);
const FALAS = falas05 as { n: number; quem: string; s: number; e: number }[];
const quem = (t: number) => FALAS.find((f) => t >= f.s - 0.05 && t <= f.e + 0.05)?.quem;
const talkL = (t: number) => (quem(t) === 'L' ? rms(t) : 0);
const talkP = (t: number) => (quem(t) === 'P' ? rms(t) : 0);
const WORDS = words05 as Word[];
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';
const jump = (t: number, at: number, dur: number, h: number) => (t > at && t < at + dur ? Math.sin((Math.PI * (t - at)) / dur) * h : 0);
const pick = <T,>(t: number, list: [number, T][], def: T): T => {
  let v = def;
  for (const [a, x] of list) if (t >= a) v = x;
  return v;
};

/* ---------- posições no mundo ---------- */
const GROUND = 1868;
const LS = 0.38; // escala do Lauro
const PS = 0.38; // escala do Piá (ele já é menor em unidades locais)
const lauroKeys: [number, number][] = [[0, -170], [2.3, 270], [26.3, 270], [28.9, 420], [33.3, 420], [34.7, 300], [62.9, 300], [64.4, 360], [77.3, 360], [78.7, 320]];
const lauroX = (t: number) => kf(t, lauroKeys);
const lauroWalk = (t: number) => clamp(Math.abs(lauroX(t + 0.05) - lauroX(t - 0.05)) / 12);
const piaKeys: [number, number][] = [[0, 1300], [4.5, 1300], [5.25, 840], [77.3, 840], [78.7, 770]];
const piaX = (t: number) => kf(t, piaKeys);
const piaWalk = (t: number) => clamp(Math.abs(piaX(t + 0.05) - piaX(t - 0.05)) / 12);

/* ---------- câmera (planos) ---------- */
const CARD = (at: number, z = 1.12, ease?: number): Shot => ({ at, x: 540, y: 830, z: 1 + (z - 1) * 0.45, ease });
const WIDE = (at: number, ease?: number): Shot => ({ at, x: 540, y: 960, z: 1, ease });
const LAU = (at: number, x: number, ease?: number, z = 1.3): Shot => ({ at, x: x + 40, y: 1460, z, ease });
const PIA = (at: number, ease?: number, z = 1.38): Shot => ({ at, x: 800, y: 1580, z, ease });
const SHOTS: Shot[] = [
  { at: 0, x: -60, y: 1360, z: 1.35 },
  { at: 2.3, x: 300, y: 1360, z: 1.35, ease: 2.3 }, // acompanha o Lauro chegando
  WIDE(4.4, 1.7), // abre e mostra o portão
  PIA(5.6, 0.45), // pan rápido até o Piá
  CARD(7.7, 1.1, 0.8),
  { at: 12.6, x: 470, y: 860, z: 1.2, ease: 4.6 }, // segue o trem descendo o mapa
  { at: 13.6, x: 540, y: 900, z: 1.04, ease: 0.8 },
  CARD(19.4, 1.16, 1.2), // push-in no calendário
  WIDE(26.9, 0.9),
  { at: 29.0, x: 470, y: 1000, z: 1.08, ease: 2.0 }, // acompanha o Lauro entrando com a turma
  PIA(30.35, 0.3),
  CARD(32.1, 1.24, 0.35), // zoom de virada no 10 × 0
  LAU(34.0, 420, 0.55, 1.25),
  { at: 35.3, x: 320, y: 790, z: 1.16, r: -1.6, ease: 0.35 }, // whip-pan para o rolo
  { at: 39.3, x: 720, y: 790, z: 1.16, r: 0, ease: 2.4 }, // acompanha o rolo
  CARD(40.8, 1.08, 0.7),
  PIA(42.25, 0.28, 1.45),
  LAU(43.45, 300, 0.4),
  { at: 45.0, x: 540, y: 960, z: 1.16, ease: 1.2 },
  { at: 50.6, x: 540, y: 690, z: 1.16, ease: 4.2 }, // grua: sobe junto com o estádio
  WIDE(51.9, 0.8),
  CARD(53.2, 1.12, 0.9),
  { at: 60.5, x: 540, y: 900, z: 1.22, ease: 0.6 },
  PIA(62.35, 0.25),
  LAU(63.35, 300, 0.3),
  { at: 65.2, x: 420, y: 820, z: 1.15, ease: 1.2 },
  { at: 69.0, x: 690, y: 740, z: 1.15, ease: 2.4 }, // travelling Porto Alegre → Japão
  CARD(70.35, 1.12, 0.3),
  WIDE(75.7, 0.8),
  { at: 78.2, x: 570, y: 1500, z: 1.2, ease: 0.8 }, // two-shot Lauro + Piá
  { at: 82.0, x: 540, y: 1470, z: 1.17, ease: 2.0 },
];
const PUNCHES = [23.6, 31.9, 38.7, 54.5, 55.4, 56.3, 60.9, 70.3, 75.0];

/* ---------- cards (ilustração em cima) ---------- */
type Card = { a: number; b: number; draw: (t: number) => React.ReactNode };
const CARDS: Card[] = [
  { a: 0, b: 6.92, draw: (t) => <StageGate t={t} /> },
  { a: 6.92, b: 13.0, draw: (t) => <StageTrain t={t} prog={kf(t, [[8.2, 0], [12.4, 1]])} /> },
  { a: 13.0, b: 17.94, draw: (t) => <StageGate t={t} /> },
  { a: 17.94, b: 26.0, draw: (t) => <StageCalendar t={t} stampT={23.6} day="04" month="ABRIL" year="1909" stamp="FUNDADO" stampC={RED} /> },
  { a: 26.0, b: 30.04, draw: (t) => <StageGate t={t} open={kf(t, [[26.1, 0], [26.9, 1]])} crowd={clamp((t - 26.5) / 3.2)} /> },
  { a: 30.04, b: 34.6, draw: (t) => <Scoreboard t={t} at={31.6} home="GRÊMIO" away="INTER" hs={10} as={0} label="1º GRE-NAL · 1909" sepia awayC={RED} /> },
  { a: 34.6, b: 43.02, draw: (t) => <StageRoller t={t} at={37.1} flatT={38.7} cupsT={40.2} /> },
  { a: 43.02, b: 52.0, draw: (t) => <StageBeiraRio t={t} fill={clamp((t - 44.3) / 3.4)} build={clamp((t - 47.3) / 4.0)} labelT={46.4} /> },
  { a: 52.0, b: 63.8, draw: (t) => <StageStars t={t} at={[54.5, 55.4, 56.3]} invT={59.9} /> },
  { a: 63.8, b: 70.15, draw: (t) => <StageWorld t={t} prog={kf(t, [[66.6, 0], [68.9, 1]])} dotC={RED} /> },
  { a: 70.15, b: 72.3, draw: (t) => <Scoreboard t={t} at={70.2} home="INTER" away="BARCELONA" hs={1} as={0} label="⚽ ADRIANO GABIRU · 2006" homeC={RED} awayC="#1D3D8F" /> },
  { a: 72.3, b: 74.85, draw: (t) => <StageCups t={t} at={[72.3, 72.9]} /> },
];
const CUTS = CARDS.map((c) => c.a).filter((a) => a > 0);

/* ---------- estados dos personagens ---------- */
const LEXPR: [number, Expr][] = [[0, 'delight'], [1.4, 'talk'], [5.1, 'smile'], [6.9, 'talk'], [30.0, 'squint'], [33.4, 'sad'], [34.7, 'wink'], [36.2, 'talk'], [40.2, 'delight'], [41.6, 'smile'], [43.0, 'delight'], [44.2, 'talk'], [62.0, 'smile'], [62.9, 'talk'], [70.2, 'delight'], [71.4, 'talk'], [75.0, 'delight'], [77.3, 'smile'], [79.7, 'talk'], [82.2, 'wink'], [83.0, 'smile']];
const LARM: [number, ArmPose][] = [[0, 'wave'], [2.6, 'down'], [7.6, 'pointSide'], [13.0, 'hold'], [17.9, 'pointSide'], [26.3, 'down'], [33.4, 'down'], [34.7, 'wag'], [37.0, 'pointSide'], [40.2, 'thumbsUp'], [41.9, 'down'], [43.0, 'thumbsUp'], [44.5, 'pointSide'], [52.0, 'pointUp'], [57.0, 'hold'], [62.0, 'down'], [63.0, 'pointSide'], [70.2, 'thumbsUp'], [71.6, 'pointSide'], [74.9, 'wave'], [77.3, 'down'], [79.7, 'pointDown']];
const PEXPR: [number, PiaExpr][] = [[0, 'talk'], [6.7, 'smile'], [17.3, 'talk'], [17.7, 'smile'], [30.0, 'smug'], [31.7, 'laugh'], [33.2, 'smug'], [34.6, 'pout'], [41.9, 'shock'], [42.8, 'smile'], [59.9, 'shock'], [61.0, 'smile'], [62.0, 'shock'], [62.8, 'smile'], [70.2, 'pout'], [74.9, 'smile'], [77.4, 'smug'], [78.6, 'smile']];
const PARMS: [number, PiaArms][] = [[0, 'down'], [5.3, 'hips'], [6.8, 'down'], [17.3, 'shrug'], [17.8, 'down'], [30.0, 'hips'], [33.3, 'cross'], [41.9, 'down'], [43.0, 'hips'], [52.0, 'down'], [62.0, 'count'], [62.9, 'down'], [70.2, 'cross'], [74.9, 'down'], [77.4, 'shrug'], [79.6, 'down']];

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
  ['plim', 0.0, 0.3], ['patinhas', 0.3, 0.2], ['pop', 5.15, 0.3], ['boing', 5.25, 0.25],
  ...CUTS.map((c) => ['whoosh', c - 0.12, 0.18] as [string, number, number]),
  ['tictac', 8.2, 0.12], ['chocalho', 13.1, 0.25], ['toin', 17.35, 0.25],
  ['carimbo', 23.6, 0.45], ['chocalho', 26.1, 0.3], ['aplauso', 26.9, 0.18],
  ['boing', 31.7, 0.3], ['erro', 32.2, 0.3], ['latido', 32.7, 0.3], ['scratch', 33.4, 0.3],
  ['whoosh', 35.0, 0.3], ['caminhao', 37.0, 0.35], ['boom', 38.7, 0.45],
  ...[0, 1, 2, 3, 4, 5].map((i) => ['pop', 40.2 + i * 0.16, 0.28] as [string, number, number]),
  ['toin', 42.0, 0.3], ['boing', 43.3, 0.25], ['patinhas', 44.4, 0.35], ['caminhao', 44.6, 0.15],
  ...Array.from({ length: 10 }).map((_, i) => ['pop', 47.3 + i * 0.4, 0.14] as [string, number, number]),
  ['ding', 46.4, 0.25], ['aplauso', 51.4, 0.2],
  ['ding', 54.5, 0.3], ['ding', 55.4, 0.3], ['ding', 56.3, 0.3], ['carimbo', 60.8, 0.4],
  ['toin', 62.1, 0.3], ['whoosh', 66.6, 0.3], ['apito', 69.7, 0.25], ['boom', 70.2, 0.4], ['aplauso', 70.4, 0.35],
  ['ding', 72.3, 0.25], ['ding', 72.9, 0.25], ['aplauso', 75.0, 0.35], ['latido', 75.6, 0.3], ['pop', 77.5, 0.25], ['latido', 82.4, 0.3],
];

export const Video05: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const card = CARDS.find((c) => t >= c.a && t < c.b);
  const lastCut = CUTS.filter((c) => c <= t).pop() ?? -1;
  const flash = lastCut > 0 && t - lastCut < 0.08 ? 1 - (t - lastCut) / 0.08 : 0;
  const lx = lauroX(t), px = piaX(t);
  // pulos do Lauro, do Piá e do Cusco nos momentos de festa
  const lHop = jump(t, 0.05, 0.4, 70) + jump(t, 40.25, 0.4, 90) + jump(t, 43.1, 0.35, 60) + jump(t, 70.25, 0.4, 100) + jump(t, 75.05, 0.45, 120);
  const pHop = jump(t, 5.0, 0.45, 110) + jump(t, 31.75, 0.35, 70) + jump(t, 42.0, 0.3, 60);
  // Cusco: senta perto do portão, cobre os olhos no 10 × 0, corre com tijolo no Beira-Rio, pula no Clube do Povo, senta no final
  const cuscoRun = t > 44.3 && t < 47.6;
  const cuscoX = cuscoRun ? kf(t, [[44.3, -250], [47.6, 1350]]) : t < 34 ? 600 : 590;
  const cuscoShow = t < 7.0 || (t > 30.0 && t < 34.0) || cuscoRun || (t > 74.8);
  const cHop = jump(t, 75.1, 0.4, 130) + jump(t, 32.0, 0.3, 40);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
        <LauroDefs />
        <PiaDefs />
        <CuscoDefs />
        <Cam t={t} shots={SHOTS} punches={PUNCHES}>
          <GuaibaWorld t={t} />
          {card && (
            <g transform={`translate(540,780) scale(${0.82 * (t > 74.5 && t < 74.85 ? 1 - (t - 74.5) / 0.35 : 1)})`}>{card.draw(t)}</g>
          )}
          {t > 74.85 && t < 79.5 && <ConfettiC t={t} start={75.0} />}
          {/* Cusco (atrás dos dois) */}
          {cuscoShow && (
            <g transform={`translate(${cuscoX},${GROUND - 10 - cHop})`}>
              {cuscoRun ? (
                <g transform="scale(0.5)">
                  <CuscoRun t={t} bread={false} />
                  <rect x={150} y={-250} width={70} height={36} fill="#B85A3A" stroke="#6A2A1A" strokeWidth={5} transform="rotate(-8 185 -232)" />
                </g>
              ) : (
                <g transform="scale(0.5)"><CuscoSit t={t} chew={false} tiltHead={t < 7 ? Math.sin(t * 2) * 16 : t > 79.7 ? 14 : -8} paw={t > 32.2 && t < 34 ? 1 : 0} /></g>
              )}
            </g>
          )}
          {/* cachecóis no final, ao lado do Cusco */}
          {t > 79.5 && (
            <g>
              <g transform={`translate(${470},${GROUND - 140}) rotate(-12) scale(${0.55 * pop(t, 79.6)})`}><ScarfProp kind="inter" /></g>
              <g transform={`translate(${715},${GROUND - 140}) rotate(12) scale(${0.55 * pop(t, 79.8)})`}><ScarfProp kind="gremio" /></g>
            </g>
          )}
          {/* Lauro */}
          <g transform={`translate(${lx},${GROUND}) scale(${LS})`}>
            <Lauro t={t} talk={talkL(t)} expr={pick(t, LEXPR, 'talk')} arm={pick(t, LARM, 'down')} armWobble={Math.sin(t * 5) * 5} scarf="inter" walk={lauroWalk(t)} hop={lHop / LS} cuiaRaise={t > 56.8 && t < 58.8 ? 1 : t > 75 && t < 77 ? kf(t, [[75, 0], [75.4, 1]]) : 0} lean={t > 74.9 && t < 77 ? -4 : 0} />
          </g>
          {/* Piá */}
          <g transform={`translate(${px},${GROUND}) scale(${-PS},${PS})`}>
            <Pia t={t} talk={talkP(t)} expr={pick(t, PEXPR, 'smile')} arms={pick(t, PARMS, 'down')} walk={piaWalk(t)} hop={pHop / PS} gaze={quem(t) === 'L' ? 1 : 0.4} tilt={t > 17.3 && t < 18.4 ? 12 : 0} />
          </g>
        </Cam>
      </svg>
      <HUD num="#005" cat="🔴⚪ HISTÓRIA" />
      <BigText t={t} start={0} end={1.6} lines={['BAH, TU', 'SABIA?']} y={380} size={110} />
      <Chip t={t} a={7.6} b={13.0} text="📍 SÃO PAULO → PORTO ALEGRE" kind="warn" />
      <Chip t={t} a={13.4} b={17.9} text="⚽ CLUBES DE DESCENDENTES DE ALEMÃES" kind="bad" />
      <Chip t={t} a={22.6} b={26.0} text="🎂 04/04/1909 · SPORT CLUB INTERNACIONAL" kind="warn" />
      <Chip t={t} a={26.6} b={30.0} text="🌎 ABERTO A TODOS" kind="good" />
      <Chip t={t} a={38.9} b={43.0} text="🚜 ROLO COMPRESSOR · 1940–45" kind="warn" />
      <Chip t={t} a={64.1} b={70.1} text="🏆 MUNDIAL 2006 · JAPÃO" kind="warn" />
      <BigText t={t} start={75.0} end={77.4} lines={['CLUBE', 'DO POVO']} y={420} size={120} color="#fff" />
      <Chip t={t} a={79.8} b={87} text="COMENTA TEU MOMENTO 👇" kind="warn" />
      <Captions t={t} hidden={t < 0.05} words={WORDS} y={1545} />
      {flash > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash * 0.8})` }} />}
      {t > 86.4 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - 86.4) / 0.5)})` }} />}
      <Audio src={staticFile('audio/v05_voz.mp3')} />
      <Audio src={staticFile('audio/v05_musica.mp3')} />
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={Math.round(5 * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
