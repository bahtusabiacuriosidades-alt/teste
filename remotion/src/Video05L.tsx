import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import './fonts';
import { FPS, MUST, kf, clamp, pop, makeVoice, Word } from './lib';
import { Lauro, LauroDefs, Expr, ArmPose } from './chars/Lauro';
import { Pia, PiaDefs, PiaExpr, PiaArms } from './chars/Pia';
import { CuscoSit, CuscoRun, CuscoDefs } from './chars/Others';
import { StageCalendar, StageWorld, Scoreboard, StageTitle, StageTrophies } from './scenes/Gremio';
import {
  GuaibaWorld, StageGate, StageTrain, StageRoller, StageBeiraRio, StageStars, StageEucaliptos, StageSaci, StageGoal, StageDrop,
  ConfettiC, ScarfProp, RED, RED_D,
} from './scenes/Inter';
import { Cam, Shot } from './camera';
import { Captions } from './ui/Overlays';
import rmsL from './data/v05L/rms.json';
import wordsL from './data/v05L/words.json';
import falasL from './data/v05L/falas.json';

/* #005 (YouTube, horizontal 1920x1080, ~5:40) — A história do Inter, com o Piá */
export const DURATION_05L = 340.2;
const W = 1920, H = 1080;
const rms = makeVoice(rmsL as number[]);
const FALAS = falasL as { n: number; quem: string; s: number; e: number }[];
const quem = (t: number) => FALAS.find((f) => t >= f.s - 0.05 && t <= f.e + 0.05)?.quem;
const talkL = (t: number) => (quem(t) === 'L' ? rms(t) : 0);
const talkP = (t: number) => (quem(t) === 'P' ? rms(t) : 0);
const WORDS = wordsL as Word[];
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';
const jump = (t: number, at: number, dur: number, h: number) => (t > at && t < at + dur ? Math.sin((Math.PI * (t - at)) / dur) * h : 0);
const jumps = (t: number, ats: number[], dur: number, h: number) => ats.reduce((a, x) => a + jump(t, x, dur, h), 0);
const pick = <T,>(t: number, list: [number, T][], def: T): T => {
  let v = def;
  for (const [a, x] of list) if (t >= a) v = x;
  return v;
};

/* ---------- capítulos ---------- */
type Chapter = { a: number; n: string; title: string; year: string };
const CHAPTERS: Chapter[] = [
  { a: 0, n: 'INTRO', title: 'TRÊS IRMÃOS SEM TIME', year: '1909' },
  { a: 24.0, n: 'CAP. 1', title: '1909: NASCE O INTERNACIONAL', year: '1909' },
  { a: 54.2, n: 'CAP. 2', title: 'UM NOME QUE É UM CONVITE', year: '1909' },
  { a: 75.1, n: 'CAP. 3', title: 'O PRIMEIRO GRE-NAL', year: '1909' },
  { a: 95.2, n: 'CAP. 4', title: 'EUCALIPTOS E ROLO COMPRESSOR', year: '1931–45' },
  { a: 133.4, n: 'CAP. 5', title: 'O SACI E O CLUBE DO POVO', year: 'ANOS 40' },
  { a: 154.0, n: 'CAP. 6', title: 'BEIRA-RIO', year: '1969' },
  { a: 188.3, n: 'CAP. 7', title: 'ANOS 70', year: '1975–79' },
  { a: 222.2, n: 'CAP. 8', title: 'COPA DO BRASIL', year: '1992' },
  { a: 229.6, n: 'CAP. 9', title: '2006: A AMÉRICA E O MUNDO', year: '2006' },
  { a: 267.6, n: 'CAP. 10', title: 'SUL-AMERICANA, RECOPA E O BI', year: '2007–11' },
  { a: 284.6, n: 'CAP. 11', title: 'A QUEDA E A VOLTA', year: '2016–17' },
  { a: 307.0, n: 'FINAL', title: 'CLUBE DO POVO', year: '❤️' },
];

/* ---------- cards (ilustrações à direita) ---------- */
type Seg = { a: number; b: number; draw: (t: number) => React.ReactNode };
const TT = (kicker: string, title: string, at: number) => (t: number) => <StageTitle t={t} at={at} kicker={kicker} title={title} bg={RED} stripes={['#F4F4F4', RED_D]} />;
const CAP = (i: number, at: number) => TT(CHAPTERS[i].n === 'FINAL' ? 'FINAL' : `CAPÍTULO ${i}`, CHAPTERS[i].title, at);
const SEGS: Seg[] = [
  { a: 0, b: 9.5, draw: (t) => <StageGate t={t} /> },
  { a: 9.5, b: 24.0, draw: TT('DOS IRMÃOS POPPE AO TOPO DO MUNDO', 'A HISTÓRIA DO INTER', 9.6) },
  { a: 24.0, b: 25.4, draw: CAP(1, 24.1) },
  { a: 25.4, b: 34.0, draw: (t) => <StageTrain t={t} prog={kf(t, [[26.0, 0], [29.6, 1]])} /> },
  { a: 34.0, b: 43.1, draw: (t) => <StageGate t={t} /> },
  { a: 43.1, b: 54.2, draw: (t) => <StageCalendar t={t} stampT={52.0} day="04" month="ABRIL" year="1909" stamp="FUNDADO" stampC={RED} /> },
  { a: 54.2, b: 55.6, draw: CAP(2, 54.3) },
  { a: 55.6, b: 66.8, draw: (t) => <StageGate t={t} open={kf(t, [[57.3, 0], [58.2, 1]])} crowd={clamp((t - 58.5) / 3.6)} /> },
  { a: 66.8, b: 75.1, draw: TT('A ORIGEM DO NOME', 'AS VERSÕES VARIAM', 66.9) },
  { a: 75.1, b: 76.5, draw: CAP(3, 75.2) },
  { a: 76.5, b: 84.0, draw: (t) => <StageCalendar t={t} stampT={80.2} day="18" month="JULHO" year="1909" stamp="1º GRE-NAL" stampC={RED} /> },
  { a: 84.0, b: 95.2, draw: (t) => <Scoreboard t={t} at={84.1} home="GRÊMIO" away="INTER" hs={10} as={0} label="O PRIMEIRO GRE-NAL · 1909" sepia awayC={RED} /> },
  { a: 95.2, b: 96.6, draw: CAP(4, 95.3) },
  { a: 96.6, b: 106.0, draw: (t) => <StageEucaliptos t={t} at={97.0} /> },
  { a: 106.0, b: 121.0, draw: (t) => <StageRoller t={t} at={110.6} flatT={112.2} cupsT={115.7} /> },
  { a: 121.0, b: 133.4, draw: TT('NO INTER DE 1939 A 1949', 'TESOURINHA', 121.6) },
  { a: 133.4, b: 134.8, draw: CAP(5, 133.5) },
  { a: 134.8, b: 144.0, draw: (t) => <StageGate t={t} open={kf(t, [[137.2, 0], [138.0, 1]])} crowd={clamp((t - 138.3) / 3.8)} /> },
  { a: 144.0, b: 154.0, draw: (t) => <StageSaci t={t} at={145.2} /> },
  { a: 154.0, b: 155.4, draw: CAP(6, 154.1) },
  { a: 155.4, b: 185.0, draw: (t) => <StageBeiraRio t={t} fill={clamp((t - 159.5) / 5)} build={clamp((t - 172.9) / 10)} labelT={183.6} /> },
  { a: 185.0, b: 188.3, draw: (t) => <Scoreboard t={t} at={185.1} home="INTER" away="BENFICA" hs={2} as={1} label="INAUGURAÇÃO · 06/04/1969" homeC={RED} awayC="#7A1F1F" /> },
  { a: 188.3, b: 189.7, draw: CAP(7, 188.4) },
  { a: 189.7, b: 199.0, draw: TT('FINAL DO BRASILEIRO DE 1975', 'INTER × CRUZEIRO', 189.8) },
  { a: 199.0, b: 203.9, draw: (t) => <Scoreboard t={t} at={199.2} home="INTER" away="CRUZEIRO" hs={1} as={0} label="⚽ FIGUEROA, DE CABEÇA" homeC={RED} awayC="#1F4FA0" /> },
  { a: 203.9, b: 222.2, draw: (t) => <StageStars t={t} at={[204.0, 204.6, 208.0]} invT={210.6} /> },
  { a: 222.2, b: 223.6, draw: CAP(8, 222.3) },
  { a: 223.6, b: 229.6, draw: (t) => <StageTrophies t={t} items={[[223.8, '1992', 'COPA DO BRASIL']]} /> },
  { a: 229.6, b: 231.0, draw: CAP(9, 229.7) },
  { a: 231.0, b: 240.0, draw: TT('FINAL DA LIBERTADORES 2006', 'INTER × SÃO PAULO', 231.1) },
  { a: 240.0, b: 242.1, draw: (t) => <Scoreboard t={t} at={240.1} home="SÃO PAULO" away="INTER" hs={1} as={2} label="IDA · MORUMBI" homeC="#2A2A2A" awayC={RED} /> },
  { a: 242.1, b: 244.2, draw: (t) => <Scoreboard t={t} at={242.2} home="INTER" away="SÃO PAULO" hs={2} as={2} label="VOLTA · BEIRA-RIO" homeC={RED} awayC="#2A2A2A" /> },
  { a: 244.2, b: 247.9, draw: (t) => <StageTrophies t={t} items={[[244.3, '2006', 'LIBERTADORES']]} /> },
  { a: 247.9, b: 255.5, draw: (t) => <StageWorld t={t} prog={kf(t, [[248.3, 0], [250.3, 1]])} dotC={RED} /> },
  { a: 255.5, b: 264.2, draw: (t) => <StageGoal t={t} stealT={259.3} passT={260.6} goalT={263.2} /> },
  { a: 264.2, b: 267.6, draw: (t) => <Scoreboard t={t} at={264.3} home="INTER" away="BARCELONA" hs={1} as={0} label="CAMPEÃO DO MUNDO · 2006" homeC={RED} awayC="#1D3D8F" /> },
  { a: 267.6, b: 269.0, draw: CAP(10, 267.7) },
  { a: 269.0, b: 284.6, draw: (t) => <StageTrophies t={t} items={[[269.4, '2008', 'SUL-AMERICANA'], [274.2, '2007', 'RECOPA'], [275.5, '2011', 'RECOPA'], [278.4, '2010', 'LIBERTADORES']]} /> },
  { a: 284.6, b: 286.0, draw: CAP(11, 284.7) },
  { a: 286.0, b: 307.0, draw: (t) => <StageDrop t={t} downT={291.6} upT={304.3} /> },
  { a: 307.0, b: 308.4, draw: CAP(12, 307.1) },
  { a: 308.4, b: 321.7, draw: TT('DOS IRMÃOS POPPE AO TOPO DO MUNDO', 'CLUBE DO POVO', 308.5) },
  { a: 321.7, b: 329.9, draw: TT('COMENTA 👇', 'QUAL MOMENTO TU VIVEU?', 321.8) },
  { a: 329.9, b: 341, draw: TT('SE INSCREVE 🔔', 'BAH, TU SABIA?', 330.0) },
];
const CUTS = SEGS.map((s) => s.a).filter((a) => a > 0);

/* ---------- posições no mundo ---------- */
const GROUND = 1050;
const LS = 0.46, PS = 0.46;
const CX = 1300, CY = 470; // centro do card
const lauroX = (t: number) => kf(t, [[0, -220], [2.4, 300], [56.6, 300], [59.4, 420], [75.0, 420], [76.6, 300], [133.4, 300], [136.0, 400], [153.6, 400], [155.4, 300], [188.3, 300], [190.2, 380], [229.4, 380], [231.2, 300], [307.0, 300], [309.0, 360]]);
const lauroWalk = (t: number) => clamp(Math.abs(lauroX(t + 0.05) - lauroX(t - 0.05)) / 12);
const piaX = (t: number) => kf(t, [[0, 1250], [4.3, 1250], [5.2, 650], [307.0, 650], [309.0, 700]]);
const piaWalk = (t: number) => clamp(Math.abs(piaX(t + 0.05) - piaX(t - 0.05)) / 12);

/* ---------- câmera (mais calma que no curto) ---------- */
const WIDE = (at: number, ease = 1.2): Shot => ({ at, x: 960, y: 540, z: 1, ease });
const HALF = (at: number, ease = 1.0): Shot => ({ at, x: 1080, y: 520, z: 1.05, ease });
const CARD = (at: number, ease = 1.0, z = 1.1, dx = 0, dy = 0): Shot => ({ at, x: CX - 100 + dx, y: CY + 20 + dy, z: Math.min(z, 1.12), ease });
const LAU = (at: number, ease = 0.6): Shot => ({ at, x: 480, y: 520, z: 1.3, ease });
const PIA = (at: number, ease = 0.35): Shot => ({ at, x: 640, y: 700, z: 1.45, ease });
const TWO = (at: number, ease = 0.6): Shot => ({ at, x: 470, y: 640, z: 1.15, ease });
const SHOTS: Shot[] = [
  { at: 0, x: 0, y: 520, z: 1.32 },
  { at: 2.4, x: 420, y: 520, z: 1.32, ease: 2.4 },
  HALF(4.2, 1.5), PIA(5.5, 0.5), LAU(9.9, 0.7), HALF(13.4, 1.4),
  CARD(25.2, 1.0, 1.16, 80, -60), CARD(29.8, 3.4, 1.16, -100, 60), HALF(34.8, 0.8),
  PIA(41.6, 0.4), LAU(43.6, 0.4), CARD(49.0, 1.2), PIA(54.6, 0.35), HALF(57.2, 0.8), CARD(67.8, 1.0),
  HALF(76.0, 0.8), CARD(78.6, 1.4), PIA(84.0, 0.3), CARD(85.3, 0.35, 1.22), LAU(89.6, 0.6),
  HALF(96.0, 0.8), CARD(98.6, 1.4), HALF(106.6, 0.6), PIA(108.3, 0.35),
  { at: 111.0, x: CX - 160, y: CY, z: 1.18, r: -1.4, ease: 0.35 }, { at: 113.0, x: CX + 140, y: CY, z: 1.18, r: 0, ease: 1.8 }, HALF(116.4, 1.0),
  CARD(122.4, 1.2), PIA(130.0, 0.3), TWO(131.6, 0.5), HALF(134.2, 0.7), WIDE(139.4, 1.6), CARD(145.0, 1.0), PIA(151.1, 0.3),
  HALF(154.6, 0.6), CARD(160.4, 1.5, 1.15, 0, 140), PIA(162.6, 0.3), CARD(165.6, 0.6, 1.15, 0, 140), CARD(182.2, 9.0, 1.15, 0, -90),
  CARD(185.4, 0.4), HALF(189.0, 0.7), CARD(193.8, 1.0), WIDE(202.6, 0.9), CARD(205.0, 1.0), PIA(212.8, 0.3), TWO(215.4, 0.5), PIA(220.2, 0.3),
  HALF(223.0, 0.7), CARD(226.0, 1.0), HALF(230.4, 0.7), LAU(234.6, 1.0), CARD(240.3, 0.4), PIA(246.8, 0.3),
  CARD(248.4, 0.5, 1.16, -120, 60), CARD(251.0, 2.4, 1.16, 110, -60), PIA(254.1, 0.3), CARD(255.9, 0.4), WIDE(266.0, 1.0),
  HALF(268.2, 0.7), CARD(271.0, 1.5), PIA(283.0, 0.3), HALF(285.2, 0.7), CARD(288.4, 1.5), PIA(292.9, 0.3), TWO(295.5, 0.6), CARD(303.6, 1.0),
  WIDE(307.8, 1.0), HALF(312.0, 3.0), TWO(320.2, 0.6), HALF(323.0, 1.2), { at: 331.0, x: 640, y: 640, z: 1.12, ease: 3.0 },
];
const PUNCHES = [52.0, 80.2, 84.9, 112.2, 183.6, 185.9, 199.2, 204.0, 204.6, 208.0, 211.5, 240.2, 242.3, 244.3, 263.2, 264.3, 291.6, 304.3, 318.4];

/* ---------- atuação ---------- */
const LEXPR: [number, Expr][] = [[0, 'delight'], [1.4, 'talk'], [9.7, 'laugh'], [11.0, 'talk'], [41.2, 'smile'], [43.1, 'talk'], [54.2, 'smile'], [56.4, 'talk'], [83.7, 'squint'], [86.2, 'sad'], [89.3, 'wink'], [90.5, 'talk'], [107.9, 'smile'], [110.7, 'laugh'], [111.7, 'talk'], [129.7, 'smile'], [131.1, 'wink'], [132.5, 'talk'], [150.8, 'smile'], [154.0, 'talk'], [162.3, 'smile'], [164.9, 'talk'], [199.2, 'delight'], [200.5, 'talk'], [211.4, 'delight'], [212.5, 'smile'], [214.9, 'talk'], [219.9, 'wink'], [222.2, 'talk'], [244.2, 'delight'], [245.5, 'smile'], [247.9, 'talk'], [253.9, 'squint'], [255.5, 'talk'], [263.1, 'delight'], [267.6, 'talk'], [282.7, 'smile'], [284.6, 'sad'], [292.6, 'smile'], [295.1, 'talk'], [304.3, 'delight'], [305.5, 'talk'], [307.0, 'smile'], [308.5, 'talk'], [319.8, 'laugh'], [321.7, 'talk'], [329.9, 'wink'], [331.0, 'talk'], [336.0, 'delight']];
const LARM: [number, ArmPose][] = [[0, 'wave'], [2.6, 'down'], [24.5, 'pointSide'], [31.0, 'down'], [36.0, 'pointSide'], [41.0, 'down'], [48.7, 'pointSide'], [54.0, 'down'], [58.3, 'pointSide'], [66.0, 'down'], [67.5, 'hold'], [75.0, 'down'], [77.0, 'pointSide'], [83.0, 'down'], [89.3, 'wag'], [92.0, 'down'], [95.2, 'pointSide'], [104.0, 'down'], [110.7, 'thumbsUp'], [112.5, 'pointSide'], [121.0, 'down'], [121.5, 'pointUp'], [125.0, 'down'], [137.6, 'pointSide'], [143.0, 'down'], [145.2, 'pointSide'], [150.0, 'down'], [156.0, 'pointSide'], [164.0, 'down'], [166.4, 'pointSide'], [183.6, 'thumbsUp'], [185.0, 'pointSide'], [188.0, 'down'], [193.0, 'pointSide'], [199.2, 'thumbsUp'], [201.0, 'pointSide'], [212.5, 'down'], [216.5, 'pointUp'], [219.9, 'down'], [222.2, 'pointSide'], [229.0, 'down'], [231.5, 'pointUp'], [235.0, 'hold'], [240.0, 'pointSide'], [244.2, 'thumbsUp'], [246.0, 'down'], [248.0, 'pointSide'], [255.0, 'down'], [258.5, 'pointSide'], [263.1, 'thumbsUp'], [267.6, 'down'], [269.3, 'pointSide'], [282.7, 'down'], [296.5, 'wag'], [299.0, 'down'], [302.5, 'pointSide'], [304.3, 'thumbsUp'], [307.0, 'down'], [308.5, 'wave'], [313.0, 'hold'], [319.0, 'down'], [322.0, 'pointDown'], [330.0, 'thumbsUp'], [335.0, 'wave']];
const PEXPR: [number, PiaExpr][] = [[0, 'smile'], [4.9, 'talk'], [8.4, 'smile'], [41.2, 'talk'], [42.7, 'smile'], [54.2, 'talk'], [56.0, 'smile'], [83.7, 'smug'], [84.9, 'laugh'], [86.0, 'smug'], [89.0, 'pout'], [95.0, 'smile'], [107.9, 'talk'], [110.4, 'laugh'], [111.5, 'smile'], [129.7, 'shock'], [130.8, 'smile'], [150.8, 'laugh'], [153.7, 'smile'], [162.3, 'shock'], [164.6, 'smile'], [199.2, 'pout'], [201.0, 'smile'], [212.5, 'shock'], [214.7, 'smile'], [219.9, 'pout'], [222.0, 'smile'], [246.5, 'talk'], [247.6, 'smile'], [253.9, 'shock'], [255.2, 'smile'], [263.1, 'pout'], [267.0, 'smile'], [282.7, 'pout'], [284.3, 'smile'], [292.6, 'smug'], [294.8, 'smile'], [319.8, 'smug'], [321.4, 'smile'], [336.6, 'laugh']];
const PARMS: [number, PiaArms][] = [[0, 'down'], [4.9, 'hips'], [8.4, 'down'], [54.2, 'shrug'], [56.0, 'down'], [83.7, 'hips'], [86.0, 'cross'], [95.0, 'down'], [107.9, 'shrug'], [110.5, 'down'], [150.8, 'hips'], [154.0, 'down'], [162.3, 'shrug'], [164.6, 'down'], [199.2, 'cross'], [201.0, 'down'], [212.5, 'count'], [214.7, 'down'], [219.9, 'cross'], [222.0, 'down'], [263.1, 'cross'], [267.0, 'down'], [282.7, 'count'], [284.3, 'down'], [292.6, 'hips'], [294.8, 'down'], [319.8, 'shrug'], [321.4, 'down'], [336.6, 'cheer']];

/* ---------- etiquetas (em cima do card) ---------- */
const CHIPS: [number, number, string, 'info' | 'warn' | 'bad' | 'good'][] = [
  [25.0, 29.4, '📍 SÃO PAULO → PORTO ALEGRE · 1908', 'warn'],
  [29.5, 34.0, '👨‍👦‍👦 HENRIQUE, JOSÉ E LUIZ POPPE', 'info'],
  [38.5, 43.0, '⚽ FUTEBOL: CLUBES DE DESCENDENTES DE ALEMÃES', 'bad'],
  [52.0, 54.1, '🎂 04/04/1909 · SPORT CLUB INTERNACIONAL', 'warn'],
  [59.5, 66.7, '🌎 ABERTO A TODOS', 'good'],
  [69.6, 75.0, '❓ A MAIS CONTADA: UM CLUBE INTERNACIONAL DE SP', 'info'],
  [89.3, 95.1, '😅 CALMA, COLORADO: A RESPOSTA VEM AÍ', 'bad'],
  [100.2, 106.0, '📍 BAIRRO MENINO DEUS', 'info'],
  [115.7, 121.0, '🏆 CAMPEÃO GAÚCHO 6 VEZES SEGUIDAS', 'warn'],
  [126.3, 133.3, '➡️ DEPOIS, TAMBÉM FEZ HISTÓRIA NO GRÊMIO', 'info'],
  [135.8, 144.0, '❤️ CLUBE DO POVO', 'warn'],
  [157.1, 164.8, '🏞️ ÁREA NA BEIRA DO GUAÍBA, AINDA POR ATERRAR', 'info'],
  [167.7, 172.8, '🏗️ OBRA: 1959 → 1969', 'info'],
  [172.9, 183.5, '🧱 A TORCIDA LEVOU TIJOLO, CIMENTO E FERRO', 'warn'],
  [195.8, 199.0, '🇨🇱 ELÍAS FIGUEROA', 'info'],
  [208.6, 212.4, '⭐ FALCÃO', 'warn'],
  [226.9, 229.5, '🆚 FINAL CONTRA O FLUMINENSE', 'info'],
  [235.0, 240.0, '💪 CAPITÃO: FERNANDÃO', 'info'],
  [250.1, 255.4, '🇯🇵 JAPÃO · FINAL CONTRA O BARCELONA', 'warn'],
  [281.3, 284.5, '🆚 FINAL DE 2010 CONTRA O CHIVAS', 'info'],
  [291.6, 295.0, '⬇️ PRIMEIRA QUEDA DA HISTÓRIA', 'bad'],
  [302.5, 306.9, '⬆️ ACESSO EM 2017', 'good'],
  [310.6, 319.6, 'IRMÃOS SEM TIME → CAMPEÃO DO MUNDO', 'warn'],
];

const SFX: [string, number, number][] = [
  ['plim', 0.0, 0.3], ['pop', 4.9, 0.25], ['boing', 5.0, 0.2],
  ...CUTS.map((c) => ['whoosh', c - 0.12, 0.14] as [string, number, number]),
  ...CHAPTERS.slice(1).map((c) => ['ding', c.a, 0.22] as [string, number, number]),
  ['apito', 26.0, 0.15], ['chocalho', 34.1, 0.25], ['carimbo', 52.0, 0.4], ['chocalho', 57.3, 0.3], ['aplauso', 58.5, 0.15],
  ['carimbo', 80.2, 0.35], ['boing', 84.9, 0.3], ['erro', 85.3, 0.25], ['scratch', 86.2, 0.25], ['latido', 86.6, 0.3],
  ['pop', 97.8, 0.25], ['patinhas', 106.2, 0.3], ['caminhao', 110.6, 0.3], ['boom', 112.2, 0.4],
  ...[0, 1, 2, 3, 4, 5].map((i) => ['pop', 115.7 + i * 0.16, 0.25] as [string, number, number]),
  ['latido', 130.2, 0.25], ['chocalho', 137.2, 0.25], ['vento', 144.2, 0.15], ['boing', 145.3, 0.25], ['toin', 151.0, 0.2],
  ['caminhao', 160.0, 0.18], ...Array.from({ length: 12 }).map((_, i) => ['pop', 173.0 + i * 0.8, 0.12] as [string, number, number]),
  ['patinhas', 173.5, 0.3], ['aplauso', 183.6, 0.3], ['apito', 185.8, 0.2], ['aplauso', 186.0, 0.3],
  ['boom', 199.2, 0.35], ['aplauso', 199.4, 0.3], ['ding', 204.0, 0.3], ['ding', 204.6, 0.3], ['ding', 208.0, 0.3], ['carimbo', 211.5, 0.4], ['toin', 212.6, 0.25],
  ['pop', 226.9, 0.25], ['boom', 240.2, 0.3], ['boom', 242.3, 0.3], ['aplauso', 244.3, 0.35], ['whoosh', 248.3, 0.25], ['riser', 255.6, 0.15],
  ['boom', 263.2, 0.4], ['aplauso', 263.3, 0.45], ['latido', 264.0, 0.3],
  ['pop', 271.4, 0.25], ['pop', 274.2, 0.25], ['pop', 275.5, 0.25], ['pop', 278.4, 0.25],
  ['erro', 291.6, 0.25], ['acerto', 304.3, 0.3], ['aplauso', 318.4, 0.35], ['latido', 320.0, 0.3], ['ding', 330.0, 0.25], ['latido', 336.6, 0.3],
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

export const Video05L: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const seg = SEGS.find((s) => t >= s.a && t < s.b) ?? SEGS[SEGS.length - 1];
  const ch = [...CHAPTERS].reverse().find((c) => t >= c.a) ?? CHAPTERS[0];
  const lastCut = CUTS.filter((c) => c <= t).pop() ?? -1;
  const flash = lastCut > 0 && t - lastCut < 0.08 ? 1 - (t - lastCut) / 0.08 : 0;
  const lx = lauroX(t), px = piaX(t);
  const lHop = jumps(t, [0.05, 199.2, 244.2, 263.2, 264.4, 304.4, 318.5], 0.42, 100);
  const pHop = jumps(t, [4.95, 84.95, 151.1, 336.7], 0.4, 90);
  // Cusco: 1 em cada 3 cenas
  const runA = t > 106.0 && t < 109.6, runB = t > 173.2 && t < 177.4;
  const cuscoRun = runA || runB;
  const cuscoX = runA ? kf(t, [[106.0, -250], [109.6, 2150]]) : runB ? kf(t, [[173.2, -250], [177.4, 2150]]) : 480;
  const cuscoShow = t < 24 || (t > 84 && t < 95.2) || cuscoRun || (t > 129.6 && t < 133.4) || (t > 150.6 && t < 154) || (t > 262.8 && t < 268) || t > 307;
  const cHop = jumps(t, [263.3, 264.5, 318.6], 0.4, 120);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
        <LauroDefs />
        <PiaDefs />
        <CuscoDefs />
        <Cam t={t} w={W} h={H} shots={SHOTS} punches={PUNCHES} breath={0.8}>
          <GuaibaWorld t={t} w={W} h={H} />
          <g transform={`translate(${CX},${CY}) scale(0.8)`}>{seg.draw(t)}</g>
          {[263.3, 304.5, 318.5].map((s) => (t > s && t < s + 3 ? <ConfettiC key={s} t={t} start={s} cx={CX} cy={CY - 100} /> : null))}
          {cuscoShow && (
            <g transform={`translate(${cuscoX},${GROUND - 8 - cHop})`}>
              {cuscoRun ? (
                <g transform="scale(0.55)">
                  <CuscoRun t={t} bread={false} />
                  {runB && <rect x={150} y={-250} width={70} height={36} fill="#B85A3A" stroke="#6A2A1A" strokeWidth={5} transform="rotate(-8 185 -232)" />}
                </g>
              ) : (
                <g transform="scale(0.55)"><CuscoSit t={t} chew={false} tiltHead={Math.sin(t * 2.2) * 16} paw={t > 86.2 && t < 89.3 ? 1 : 0} /></g>
              )}
            </g>
          )}
          {t > 321.5 && (
            <g>
              <g transform={`translate(400,${GROUND - 150}) rotate(-12) scale(${0.6 * pop(t, 321.7)})`}><ScarfProp kind="inter" /></g>
              <g transform={`translate(565,${GROUND - 150}) rotate(12) scale(${0.6 * pop(t, 321.9)})`}><ScarfProp kind="gremio" /></g>
            </g>
          )}
          <g transform={`translate(${lx},${GROUND}) scale(${LS})`}>
            <Lauro t={t} talk={talkL(t)} expr={pick(t, LEXPR, 'talk')} arm={pick(t, LARM, 'down')} armWobble={Math.sin(t * 5) * 5} scarf="inter" walk={lauroWalk(t)} hop={lHop / LS}
              cuiaRaise={t > 22.0 && t < 24.0 ? 1 : t > 318.4 && t < 320.5 ? 1 : 0} />
          </g>
          <g transform={`translate(${px},${GROUND}) scale(${-PS},${PS})`}>
            <Pia t={t} talk={talkP(t)} expr={pick(t, PEXPR, 'smile')} arms={pick(t, PARMS, 'down')} walk={piaWalk(t)} hop={pHop / PS} gaze={quem(t) === 'L' ? 1 : 0.4} tilt={quem(t) === 'P' ? Math.sin(t * 3) * 5 : 0} />
          </g>
        </Cam>
      </svg>

      {/* cabeçalho: selo + capítulo + ano */}
      <div style={{ position: 'absolute', left: 36, top: 28, fontFamily: FONT }}>
        <div style={{ display: 'inline-block', background: 'rgba(20,16,12,.85)', borderRadius: 12, padding: '7px 16px', fontWeight: 900, fontSize: 26, color: '#fff' }}>
          <span style={{ color: MUST }}>BAH, TU SABIA?</span> · #005
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 14, transform: `scale(${pop(t, ch.a, 0.3) || 1})`, transformOrigin: 'left' }}>
          <span style={{ background: RED, color: '#fff', fontWeight: 900, fontSize: 24, padding: '4px 12px', borderRadius: 8 }}>{ch.n}</span>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 30, WebkitTextStroke: '6px rgba(20,16,12,.85)', paintOrder: 'stroke fill' }}>{ch.title}</span>
        </div>
        <div style={{ color: MUST, fontWeight: 900, fontSize: 56, WebkitTextStroke: '8px rgba(20,16,12,.85)', paintOrder: 'stroke fill' }}>{ch.year}</div>
      </div>

      {CHIPS.map(([a, b, text, kind], i) => <Chip key={i} t={t} a={a} b={b} text={text} kind={kind} />)}
      <Captions t={t} hidden={t < 0.05} words={WORDS} y={948} size={60} left={760} right={60} />

      {flash > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash * 0.7})` }} />}
      {t > 339.6 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - 339.6) / 0.55)})` }} />}

      <Audio src={staticFile('audio/v05L_voz.mp3')} />
      <Audio src={staticFile('audio/v05L_musica.mp3')} />
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={Math.round(5 * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
