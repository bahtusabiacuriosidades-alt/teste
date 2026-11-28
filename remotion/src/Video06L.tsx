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
import { Captions } from './ui/Overlays';
import rmsL from './data/v06L/rms.json';
import wordsL from './data/v06L/words.json';
import falasL from './data/v06L/falas.json';

/* #006 (YouTube, horizontal 1920x1080, ~5:15) — O RS já foi um país? A Revolução Farroupilha, com a Guria */
export const DURATION_06L = 314.6;
const W = 1920, H = 1080;
const rms = makeVoice(rmsL as number[]);
const FALAS = falasL as { n: number; quem: string; s: number; e: number }[];
const quem = (t: number) => FALAS.find((f) => t >= f.s - 0.05 && t <= f.e + 0.05)?.quem;
const talkL = (t: number) => (quem(t) === 'L' ? rms(t) : 0);
const talkG = (t: number) => (quem(t) === 'G' ? rms(t) : 0);
const WORDS = wordsL as Word[];
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';
const jump = (t: number, at: number, dur: number, h: number) => (t > at && t < at + dur ? Math.sin((Math.PI * (t - at)) / dur) * h : 0);
const jumps = (t: number, ats: number[], dur: number, h: number) => ats.reduce((a, x) => a + jump(t, x, dur, h), 0);
const pick = <T,>(t: number, list: [number, T][], def: T): T => {
  let v = def;
  for (const [a, x] of list) if (t >= a) v = x;
  return v;
};
/* capítulo dos Lanceiros Negros e Porongos: SÓBRIO (sem humor, sem Cusco, sem pulos, sem punch, música baixa) */
const SOB_A = 184.9, SOB_B = 237.9;
const sober = (t: number) => t > SOB_A && t < SOB_B;

type Chapter = { a: number; n: string; title: string; year: string };
const CHAPTERS: Chapter[] = [
  { a: 0, n: 'INTRO', title: 'O RIO GRANDE JÁ FOI UM PAÍS?', year: '1835–45' },
  { a: 22.0, n: 'CAP. 1', title: 'O RIO GRANDE DE 1835', year: '1835' },
  { a: 56.5, n: 'CAP. 2', title: '20 DE SETEMBRO: COMEÇA A REVOLUÇÃO', year: '1835' },
  { a: 86.4, n: 'CAP. 3', title: 'A REPÚBLICA RIO-GRANDENSE', year: '1836' },
  { a: 134.8, n: 'CAP. 4', title: 'GARIBALDI E OS BARCOS POR TERRA', year: '1839' },
  { a: 184.9, n: 'CAP. 5', title: 'OS LANCEIROS NEGROS E PORONGOS', year: '1844' },
  { a: 237.9, n: 'CAP. 6', title: 'A PAZ DE PONCHE VERDE', year: '1845' },
  { a: 266.9, n: 'CAP. 7', title: 'POR QUE O 20 DE SETEMBRO?', year: 'HOJE' },
  { a: 290.2, n: 'FINAL', title: 'LEMBRAR INTEIRA', year: '🟩🟥🟨' },
];

type Seg = { a: number; b: number; draw: (t: number) => React.ReactNode };
const TT = (kicker: string, title: string, at: number, dark = false) => (t: number) => (
  <StageTitle t={t} at={at} kicker={kicker} title={title} bg={dark ? '#20262E' : VERDE} stripes={dark ? ['#2A3240', '#141A24'] : [VERMELHO, AMARELO]} />
);
const CAP = (i: number, at: number) => TT(CHAPTERS[i].n === 'FINAL' ? 'FINAL' : `CAPÍTULO ${i}`, CHAPTERS[i].title, at, i === 5);
const SEGS: Seg[] = [
  { a: 0, b: 6.0, draw: (t) => <StageCountry t={t} splitT={1.5} /> },
  { a: 6.0, b: 22.0, draw: TT('A GUERRA QUE DUROU DEZ ANOS', 'O RS JÁ FOI UM PAÍS?', 6.1) },
  { a: 22.0, b: 23.4, draw: CAP(1, 22.1) },
  { a: 23.4, b: 30.5, draw: TT('1835', 'BRASIL IMPÉRIO', 23.5) },
  { a: 30.5, b: 45.4, draw: (t) => <StageCharque t={t} stampT={38.0} /> },
  { a: 45.4, b: 56.5, draw: TT('A PROVÍNCIA TINHA', 'POUCA VOZ', 45.5) },
  { a: 56.5, b: 58.0, draw: CAP(2, 56.6) },
  { a: 58.0, b: 68.3, draw: (t) => <StageCalendar t={t} stampT={61.4} day="20" month="SETEMBRO" year="1835" stamp="INÍCIO" stampC={VERMELHO} /> },
  { a: 68.3, b: 75.4, draw: TT('1835 · 1845', 'REVOLUÇÃO FARROUPILHA', 68.4) },
  { a: 75.4, b: 86.4, draw: (t) => <StageFarrapos t={t} morphT={84.6} /> },
  { a: 86.4, b: 87.8, draw: CAP(3, 86.5) },
  { a: 87.8, b: 102.4, draw: (t) => <StageRepublic t={t} flagT={98.3} pinT={999} /> },
  { a: 102.4, b: 113.0, draw: TT('BATALHA DO FANFA · 1836', 'O PRESIDENTE PRESO', 102.5) },
  { a: 113.0, b: 121.7, draw: TT('1837', 'A FUGA DA BAHIA', 113.1) },
  { a: 121.7, b: 134.8, draw: (t) => <StageRepublic t={t} flagT={121.8} pinT={122.0} /> },
  { a: 134.8, b: 136.2, draw: CAP(4, 134.9) },
  { a: 136.2, b: 151.6, draw: (t) => <StageLaguna t={t} prog={kf(t, [[139.5, 0], [141.2, 1]])} julianaT={999} /> },
  { a: 151.6, b: 163.0, draw: (t) => <StageBoatsLand t={t} a={151.6} b={163.0} /> },
  { a: 163.0, b: 178.7, draw: (t) => <StageLaguna t={t} prog={kf(t, [[164.2, 0], [166.4, 1]])} julianaT={168.5} /> },
  { a: 178.7, b: 184.9, draw: (t) => <StageTenYears t={t} a={181.3} /> },
  { a: 184.9, b: 186.3, draw: CAP(5, 185.0) },
  { a: 186.3, b: 201.2, draw: TT('A HISTÓRIA QUE FICOU DE FORA', 'LANCEIROS NEGROS', 186.4, true) },
  { a: 201.2, b: 223.1, draw: (t) => <StagePorongos t={t} a={201.3} /> },
  { a: 223.1, b: 237.9, draw: (t) => <StageBook t={t} openT={230.6} /> },
  { a: 237.9, b: 239.3, draw: CAP(6, 238.0) },
  { a: 239.3, b: 251.9, draw: (t) => <StagePeace t={t} at={249.4} /> },
  { a: 251.9, b: 266.9, draw: TT('1845', 'SEM VENCEDOR CLARO', 252.0) },
  { a: 266.9, b: 268.3, draw: CAP(7, 267.0) },
  { a: 268.3, b: 279.1, draw: (t) => <StageParade t={t} /> },
  { a: 279.1, b: 290.2, draw: (t) => <StageBigFlag t={t} at={279.6} /> },
  { a: 290.2, b: 291.6, draw: CAP(8, 290.3) },
  { a: 291.6, b: 299.2, draw: TT('A HISTÓRIA BONITA', 'E A DIFÍCIL', 291.7) },
  { a: 299.2, b: 305.0, draw: TT('COMENTA 👇', 'TU JÁ DESFILOU NUM 20 DE SETEMBRO?', 299.3) },
  { a: 305.0, b: 320, draw: TT('SE INSCREVE 🔔', 'BAH, TU SABIA?', 305.1) },
];
const CUTS = SEGS.map((s) => s.a).filter((a) => a > 0);

const GROUND = 1050;
const LS = 0.46, GS = 0.48;
const CX = 1300, CY = 470;
const lauroX = (t: number) => kf(t, [[0, -220], [2.4, 300], [86.4, 300], [88.5, 400], [134.8, 400], [136.5, 300], [266.9, 300], [269.0, 380], [290.2, 380], [292.0, 320]]);
const lauroWalk = (t: number) => clamp(Math.abs(lauroX(t + 0.05) - lauroX(t - 0.05)) / 12);
const guriaX = (t: number) => kf(t, [[0, 1250], [2.6, 1250], [3.4, 650], [290.2, 650], [292.0, 700]]);
const guriaWalk = (t: number) => clamp(Math.abs(guriaX(t + 0.05) - guriaX(t - 0.05)) / 12);

const WIDE = (at: number, ease = 1.2): Shot => ({ at, x: 960, y: 540, z: 1, ease });
const HALF = (at: number, ease = 1.0): Shot => ({ at, x: 1080, y: 520, z: 1.05, ease });
const CARD = (at: number, ease = 1.0, z = 1.1, dx = 0, dy = 0): Shot => ({ at, x: CX - 100 + dx, y: CY + 20 + dy, z: Math.min(z, 1.12), ease });
const LAU = (at: number, ease = 0.6): Shot => ({ at, x: 480, y: 520, z: 1.3, ease });
const GUR = (at: number, ease = 0.35): Shot => ({ at, x: 640, y: 690, z: 1.45, ease });
const TWO = (at: number, ease = 0.6): Shot => ({ at, x: 470, y: 640, z: 1.15, ease });
const SHOTS: Shot[] = [
  { at: 0, x: 0, y: 520, z: 1.32 }, { at: 2.4, x: 420, y: 520, z: 1.32, ease: 2.4 },
  GUR(3.6, 0.5), HALF(7.0, 1.0), LAU(19.6, 0.6),
  CARD(24.2, 1.0), CARD(37.2, 0.8, 1.12, 0, 60), GUR(42.4), HALF(46.2, 0.8), CARD(50.4, 1.2),
  CARD(59.0, 1.0), WIDE(66.2, 1.0), GUR(73.2), CARD(76.4, 1.0),
  HALF(87.2, 0.8), CARD(94.0, 1.0, 1.1, 0, 120), CARD(99.0, 3.0, 1.1, 0, -60), GUR(100.8),
  HALF(103.2, 0.6), CARD(110.0, 1.2), GUR(119.2), CARD(122.4, 0.8), GUR(132.2),
  HALF(135.4, 0.7), CARD(140.0, 1.2), CARD(150.4, 3.0, 1.1, 100, -40), GUR(153.9),
  { at: 156.0, x: CX - 260, y: CY + 20, z: 1.12, r: -1.2, ease: 0.35 }, { at: 162.6, x: CX + 140, y: CY + 20, z: 1.12, r: 0, ease: 5.5 },
  CARD(164.6, 0.8), HALF(179.5, 0.8),
  CARD(187.0, 2.0, 1.06), CARD(199.0, 10.0, 1.1), CARD(203.0, 3.0, 1.06), CARD(219.0, 14.0, 1.12, 0, -40), GUR(220.8, 0.9), CARD(224.6, 1.5), GUR(236.9),
  HALF(238.6, 0.7), CARD(246.0, 1.2), GUR(251.2, 0.3), TWO(252.6, 0.6), GUR(263.3),
  HALF(267.6, 0.7), WIDE(271.0, 1.2), CARD(279.9, 0.8), GUR(287.1),
  TWO(290.8, 0.6), HALF(294.0, 1.0), CARD(300.0, 1.0), { at: 306.0, x: 900, y: 560, z: 1.04, ease: 3.0 }, GUR(311.0, 0.3),
];
const PUNCHES = [38.0, 61.4, 84.6, 98.3, 122.0, 152.5, 168.5, 249.4, 279.6];

const LEXPR: [number, Expr][] = [[0, 'delight'], [1.5, 'talk'], [3.1, 'smile'], [6.1, 'laugh'], [7.0, 'talk'], [41.9, 'smile'], [45.4, 'talk'], [72.8, 'smile'], [74.9, 'talk'], [84.6, 'delight'], [85.8, 'talk'], [98.3, 'delight'], [99.5, 'talk'], [100.5, 'smile'], [102.4, 'talk'], [106.4, 'squint'], [107.5, 'talk'], [115.8, 'delight'], [117.0, 'talk'], [118.8, 'smile'], [121.7, 'talk'], [131.9, 'smile'], [134.8, 'laugh'], [135.6, 'talk'], [153.6, 'smile'], [155.6, 'delight'], [157.0, 'talk'], [SOB_A, 'sad'], [SOB_B, 'talk'], [249.4, 'smile'], [250.5, 'talk'], [251.0, 'smile'], [251.9, 'talk'], [263.0, 'smile'], [266.9, 'talk'], [279.6, 'delight'], [281.0, 'talk'], [286.8, 'smile'], [290.2, 'talk'], [299.2, 'smile'], [300.0, 'talk'], [309.7, 'delight']];
const LARM: [number, ArmPose][] = [[0, 'wave'], [2.6, 'down'], [23.5, 'pointSide'], [30.5, 'hold'], [38.0, 'pointSide'], [42.0, 'down'], [46.0, 'pointSide'], [56.0, 'down'], [58.5, 'pointSide'], [68.0, 'pointUp'], [70.0, 'down'], [76.0, 'pointSide'], [86.0, 'down'], [90.0, 'pointUp'], [98.3, 'thumbsUp'], [99.5, 'down'], [102.4, 'hold'], [110.0, 'pointSide'], [119.0, 'down'], [122.0, 'pointSide'], [131.5, 'down'], [136.0, 'pointSide'], [153.5, 'down'], [155.6, 'thumbsUp'], [157.0, 'pointSide'], [178.0, 'down'], [SOB_B, 'hold'], [246.0, 'pointSide'], [251.0, 'down'], [252.0, 'wag'], [256.0, 'down'], [267.0, 'pointUp'], [270.0, 'hold'], [279.6, 'pointSide'], [286.0, 'down'], [294.0, 'hold'], [299.2, 'pointDown'], [305.0, 'thumbsUp'], [309.7, 'wave']];
const GEXPR: [number, GuriaExpr][] = [[0, 'smile'], [3.1, 'shock'], [5.2, 'smile'], [42.0, 'talk'], [45.0, 'smile'], [72.9, 'talk'], [74.5, 'smile'], [100.5, 'talk'], [102.0, 'smile'], [106.4, 'shock'], [108.0, 'smile'], [119.0, 'shock'], [121.0, 'smile'], [132.0, 'smug'], [134.0, 'smile'], [153.6, 'shock'], [155.6, 'laugh'], [157.0, 'smile'], [SOB_A, 'sad'], [SOB_B, 'smile'], [251.0, 'talk'], [252.0, 'smile'], [263.0, 'talk'], [266.5, 'smile'], [311.0, 'laugh']];
const GARMS: [number, GuriaArms][] = [[0, 'down'], [3.1, 'present'], [5.2, 'down'], [42.0, 'shrug'], [45.0, 'down'], [72.9, 'shrug'], [74.5, 'down'], [100.5, 'present'], [102.0, 'down'], [119.0, 'present'], [121.0, 'down'], [132.0, 'present'], [134.0, 'down'], [153.6, 'cheer'], [155.6, 'down'], [251.0, 'shrug'], [252.0, 'down'], [263.0, 'present'], [266.5, 'skirt'], [287.0, 'down'], [311.0, 'cheer']];

const CHIPS: [number, number, string, 'info' | 'warn' | 'bad' | 'good'][] = [
  [23.5, 30.4, '🏛️ BRASIL IMPÉRIO · GOVERNO NO RIO DE JANEIRO', 'info'],
  [31.6, 37.9, '🥩 CHARQUE = CARNE SALGADA E SECA', 'info'],
  [38.0, 41.8, '🇺🇾🇦🇷 CONCORRÊNCIA: URUGUAI E ARGENTINA', 'bad'],
  [50.3, 56.4, '📜 DECISÕES VINDAS DA CORTE', 'bad'],
  [63.5, 68.2, '⚔️ BENTO GONÇALVES ENTRA EM PORTO ALEGRE', 'warn'],
  [79.8, 84.5, '❓ UMA DAS VERSÕES', 'info'],
  [95.2, 99.3, '⚔️ BATALHA DO SEIVAL', 'info'],
  [110.1, 113.0, '⛓️ CAPTURADO NA BATALHA DO FANFA', 'bad'],
  [115.8, 121.6, '🏃 FUGIU EM 1837', 'good'],
  [124.6, 131.8, '📍 PIRATINI → CAÇAPAVA → ALEGRETE', 'warn'],
  [142.8, 151.5, '🚫 O IMPÉRIO CONTROLAVA A LAGOA DOS PATOS', 'bad'],
  [158.0, 163.0, '⛵ SEIVAL E FARROUPILHA', 'warn'],
  [172.1, 178.6, '🦸‍♀️ ANITA GARIBALDI', 'warn'],
  [230.3, 237.8, 'LIVRO DOS HERÓIS E HEROÍNAS DA PÁTRIA', 'info'],
  [244.5, 251.0, '🤝 NEGOCIADOR: FUTURO DUQUE DE CAXIAS', 'info'],
  [254.1, 262.9, '📜 ANISTIA AOS REVOLTOSOS', 'good'],
  [273.7, 279.0, '🐎 SEMANA FARROUPILHA', 'warn'],
  [284.5, 290.1, '🏳️ OFICIALIZADA DEPOIS COMO SÍMBOLO DO ESTADO', 'info'],
];

const SFX: [string, number, number][] = [
  ['plim', 0.0, 0.3], ['whoosh', 1.5, 0.2], ['pop', 3.2, 0.25], ['boing', 3.3, 0.2],
  ...CUTS.filter((c) => !sober(c) && c !== SOB_A && c !== SOB_B).map((c) => ['whoosh', c - 0.12, 0.14] as [string, number, number]),
  ...CHAPTERS.slice(1).filter((c) => c.a !== SOB_A).map((c) => ['ding', c.a, 0.22] as [string, number, number]),
  ['carimbo', 38.0, 0.4], ['latido', 43.0, 0.25], ['carimbo', 61.4, 0.4], ['pop', 84.6, 0.3], ['aplauso', 98.3, 0.2],
  ['erro', 110.1, 0.2], ['acerto', 115.8, 0.25], ['ding', 122.0, 0.25], ['carimbo', 132.6, 0.3], ['latido', 133.2, 0.25],
  ['whoosh', 139.5, 0.2], ['caminhao', 151.6, 0.2], ['boom', 152.5, 0.25], ['boing', 153.7, 0.25], ['patinhas', 158.2, 0.3], ['latido', 159.0, 0.25],
  ['ding', 168.5, 0.3], ['tictac', 181.3, 0.12],
  ['vento', 201.3, 0.1], ['sino', 230.6, 0.1],
  ['acerto', 249.4, 0.25], ['aplauso', 271.0, 0.2], ['ding', 279.6, 0.3], ['aplauso', 279.8, 0.25], ['latido', 300.5, 0.25], ['latido', 311.2, 0.3],
];

const Chip: React.FC<{ t: number; a: number; b: number; text: string; kind: 'info' | 'warn' | 'bad' | 'good' }> = ({ t, a, b, text, kind }) => {
  if (t < a || t > b) return null;
  const bg = { bad: '#C62828', good: '#2E7D32', warn: MUST, info: 'rgba(20,16,12,.92)' }[kind];
  return (
    <div style={{ position: 'absolute', left: 760, width: 1100, top: 28, display: 'flex', justifyContent: 'center', opacity: clamp((b - t) / 0.2) }}>
      <div style={{ transform: `scale(${pop(t, a)})`, background: bg, color: kind === 'warn' ? '#1E1B18' : '#fff', borderRadius: 30, padding: '10px 26px', fontFamily: FONT, fontWeight: 900, fontSize: text.length > 34 ? 28 : 34, whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(0,0,0,.4)', border: '3px solid rgba(255,255,255,.85)' }}>{text}</div>
    </div>
  );
};

export const Video06L: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const seg = SEGS.find((s) => t >= s.a && t < s.b) ?? SEGS[SEGS.length - 1];
  const ch = [...CHAPTERS].reverse().find((c) => t >= c.a) ?? CHAPTERS[0];
  const lastCut = CUTS.filter((c) => c <= t).pop() ?? -1;
  const flash = lastCut > 0 && !sober(lastCut) && lastCut !== SOB_A && lastCut !== SOB_B && t - lastCut < 0.08 ? 1 - (t - lastCut) / 0.08 : 0;
  const lx = lauroX(t), gx = guriaX(t);
  const lHop = sober(t) ? 0 : jumps(t, [0.05, 98.4, 155.7, 279.7, 309.8], 0.42, 100);
  const gHop = sober(t) ? 0 : jumps(t, [3.3, 153.7, 311.1], 0.4, 90);
  const cuscoRun = t > 158.0 && t < 162.0;
  const cuscoX = cuscoRun ? kf(t, [[158.0, -250], [162.0, 2150]]) : 480;
  const cuscoShow = !sober(t) && (t < 22 || (t > 42 && t < 45.4) || (t > 130 && t < 134.8) || cuscoRun || (t > 268.3 && t < 279.1) || t > 299);
  const dark = sober(t) ? clamp(Math.min(t - SOB_A, SOB_B - t) / 1.0) * 0.45 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
        <LauroDefs />
        <GuriaDefs />
        <CuscoDefs />
        <Cam t={t} w={W} h={H} shots={SHOTS} punches={PUNCHES} breath={sober(t) ? 0.4 : 0.8}>
          <GuaibaWorld t={t} w={W} h={H} flags="rs" />
          <rect x={-800} y={-800} width={W + 1600} height={H + 1600} fill={`rgba(10,14,24,${dark})`} />
          <g transform={`translate(${CX},${CY}) scale(0.8)`}>{seg.draw(t)}</g>
          {t > 279.7 && t < 283 && <ConfettiC t={t} start={279.7} cx={CX} cy={CY - 100} colors={[VERDE, VERMELHO, AMARELO, '#fff']} />}
          {cuscoShow && (
            <g transform={`translate(${cuscoX},${GROUND - 8})`}>
              {cuscoRun ? <g transform="scale(0.55)"><CuscoRun t={t} bread={false} /></g>
                : <g transform="scale(0.55)"><CuscoSit t={t} chew={t > 42 && t < 45.4} tiltHead={Math.sin(t * 2.2) * 16} /></g>}
            </g>
          )}
          <g transform={`translate(${lx},${GROUND}) scale(${LS})`}>
            <Lauro t={t} talk={talkL(t)} expr={pick(t, LEXPR, 'talk')} arm={pick(t, LARM, 'down')} armWobble={sober(t) ? 0 : Math.sin(t * 5) * 5} walk={lauroWalk(t)} hop={lHop / LS}
              cuiaRaise={(t > 20.2 && t < 22.0) || (t > 276.0 && t < 279.0) ? 1 : 0} />
          </g>
          <g transform={`translate(${gx},${GROUND}) scale(${-GS},${GS})`}>
            <Guria t={t} talk={talkG(t)} expr={pick(t, GEXPR, 'smile')} arms={pick(t, GARMS, 'down')} walk={guriaWalk(t)} hop={gHop / GS} gaze={quem(t) === 'L' ? 1 : 0.4} tilt={quem(t) === 'G' ? Math.sin(t * 3) * 5 : 0} />
          </g>
        </Cam>
      </svg>

      <div style={{ position: 'absolute', left: 36, top: 28, fontFamily: FONT }}>
        <div style={{ display: 'inline-block', background: 'rgba(20,16,12,.85)', borderRadius: 12, padding: '7px 16px', fontWeight: 900, fontSize: 26, color: '#fff' }}>
          <span style={{ color: MUST }}>BAH, TU SABIA?</span> · #006
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 14, transform: `scale(${pop(t, ch.a, 0.3) || 1})`, transformOrigin: 'left' }}>
          <span style={{ background: sober(t) ? '#3A4250' : VERDE, color: '#fff', fontWeight: 900, fontSize: 24, padding: '4px 12px', borderRadius: 8 }}>{ch.n}</span>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 30, WebkitTextStroke: '6px rgba(20,16,12,.85)', paintOrder: 'stroke fill' }}>{ch.title}</span>
        </div>
        <div style={{ color: MUST, fontWeight: 900, fontSize: 56, WebkitTextStroke: '8px rgba(20,16,12,.85)', paintOrder: 'stroke fill' }}>{ch.year}</div>
      </div>

      {CHIPS.map(([a, b, text, kind], i) => <Chip key={i} t={t} a={a} b={b} text={text} kind={kind} />)}
      <Captions t={t} hidden={t < 0.05} words={WORDS} y={948} size={60} left={760} right={60} />

      {flash > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash * 0.7})` }} />}
      {t > 314.0 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - 314.0) / 0.55)})` }} />}

      <Audio src={staticFile('audio/v06L_voz.mp3')} />
      <Audio src={staticFile('audio/v06L_musica.mp3')} volume={(f) => kf(f / FPS, [[SOB_A - 1, 1], [SOB_A, 0.25], [SOB_B, 0.25], [SOB_B + 1, 1]])} />
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={Math.round(5 * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
