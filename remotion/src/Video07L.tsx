import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import './fonts';
import { FPS, MUST, kf, clamp, pop, makeVoice, Word } from './lib';
import { Lauro, LauroDefs, Expr, ArmPose } from './chars/Lauro';
import { Pia, PiaDefs, PiaExpr, PiaArms } from './chars/Pia';
import { CuscoSit, CuscoRun, CuscoDefs } from './chars/Others';
import {
  SerraWorld, StagePlaca, StageClareira, StageMata, StageViagem, MetricAltitude, MetricKm, MetricPop, MetricTermo, StageClubes, StageUva,
  StagePerola, StageTalian, StageTitleSerra, StageNomesFinal, UVA,
} from './scenes/Caxias';
import { ConfettiC } from './scenes/Inter';
import { Cam, Shot } from './camera';
import { Captions, SeloCusco } from './ui/Overlays';
import rmsL from './data/v07L/rms.json';
import wordsL from './data/v07L/words.json';
import falasL from './data/v07L/falas.json';

/* #007 (YouTube, horizontal 1920x1080, ~4:57) — Caxias do Sul já se chamou Campo dos Bugres?, com o Piá */
export const DURATION_07L = 297.6;
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
/* indígenas e bugreiros: SÓBRIO (sem humor, sem Cusco, sem pulos, sem punch, música baixa) */
const SOB_A = 47.9, SOB_B = 74.2;
const sober = (t: number) => t > SOB_A && t < SOB_B;
const SELO = 154.15;

type Chapter = { a: number; n: string; title: string; year: string };
const CHAPTERS: Chapter[] = [
  { a: 0, n: 'INTRO', title: 'CAXIAS JÁ SE CHAMOU CAMPO DOS BUGRES?', year: '🍇' },
  { a: 24.9, n: 'CAP. 1', title: 'QUEM VIVIA ALI ANTES', year: 'ANTES DE 1875' },
  { a: 74.2, n: 'CAP. 2', title: '1875: A VIAGEM DOS IMIGRANTES', year: '1875' },
  { a: 123.0, n: 'CAP. 3', title: 'OS MUITOS NOMES DE CAXIAS', year: '1877–1944' },
  { a: 158.2, n: 'CAP. 4', title: 'A PÉROLA DAS COLÔNIAS', year: '💎' },
  { a: 199.4, n: 'CAP. 5', title: 'O TALIAN, A LÍNGUA DOS NONOS', year: '🗣️' },
  { a: 228.6, n: 'CAP. 6', title: 'A FESTA DA UVA', year: '1931' },
  { a: 250.7, n: 'CAP. 7', title: 'O FRIO DA SERRA', year: '❄️' },
  { a: 269.5, n: 'FINAL', title: 'UMA CIDADE DE MUITA GENTE', year: '🍇' },
];

type Seg = { a: number; b: number; draw: (t: number) => React.ReactNode };
const TT = (kicker: string, title: string, at: number, dark = false) => (t: number) => <StageTitleSerra t={t} at={at} kicker={kicker} title={title} dark={dark} />;
const CAP = (i: number, at: number) => TT(CHAPTERS[i].n === 'FINAL' ? 'FINAL' : `CAPÍTULO ${i}`, CHAPTERS[i].title, at);
const SEGS: Seg[] = [
  { a: 0, b: 8.0, draw: (t) => <StagePlaca t={t} names={[[0, 'CAXIAS DO SUL'], [1.6, 'CAMPO DOS BUGRES', 'ATÉ 1877']]} /> },
  { a: 8.0, b: 24.9, draw: TT('NESTE VÍDEO', 'DA CLAREIRA À PÉROLA DAS COLÔNIAS', 8.1) },
  { a: 24.9, b: 26.3, draw: CAP(1, 25.0) },
  { a: 26.3, b: 42.4, draw: (t) => <StageClareira t={t} a={26.3} /> },
  { a: 42.4, b: 47.9, draw: (t) => <StagePlaca t={t} names={[[0, 'CAMPO DOS BUGRES', 'ATÉ 1877']]} /> },
  { a: 47.9, b: 67.2, draw: (t) => <StageMata t={t} a={47.9} label="UMA PÁGINA QUE FICOU DE FORA" /> },
  { a: 67.2, b: 74.2, draw: TT('É JUSTO LEMBRAR', 'QUEM ESTAVA LÁ ANTES', 67.3, true) },
  { a: 74.2, b: 75.6, draw: CAP(2, 74.3) },
  { a: 75.6, b: 99.6, draw: (t) => <StageViagem t={t} prog={kf(t, [[88.7, 0], [96.0, 1]])} /> },
  { a: 99.6, b: 108.8, draw: (t) => <MetricKm t={t} a={100.0} /> },
  { a: 108.8, b: 123.0, draw: (t) => <MetricAltitude t={t} a={111.4} /> },
  { a: 123.0, b: 124.4, draw: CAP(3, 123.1) },
  {
    a: 124.4, b: 154.0, draw: (t) => (
      <StagePlaca t={t} names={[[0, 'CAMPO DOS BUGRES', 'ATÉ 1877'], [128.3, 'COLÔNIA CAXIAS', '1877'], [136.3, 'SANTA TERESA DE CAXIAS', '1884'], [139.5, 'MUNICÍPIO', '20/06/1890'], [143.4, 'CIDADE', '1910 · CHEGA O TREM 🚂'], [149.7, 'CAXIAS DO SUL', '1944']]} />
    ),
  },
  { a: 158.2, b: 159.6, draw: CAP(4, 158.3) },
  { a: 159.6, b: 174.6, draw: (t) => <StagePerola t={t} a={159.6} factoryT={168.6} /> },
  { a: 174.6, b: 186.7, draw: (t) => <MetricPop t={t} a={176.3} /> },
  { a: 189.6, b: 199.4, draw: (t) => <StageClubes t={t} a={190.4} /> },
  { a: 199.4, b: 200.8, draw: CAP(5, 199.5) },
  { a: 200.8, b: 219.0, draw: (t) => <StageTalian t={t} a={201.0} lawT={210.4} iphanT={211.6} /> },
  { a: 219.0, b: 228.6, draw: TT('COMENTA 👇', 'UMA PALAVRA EM TALIAN', 223.4) },
  { a: 228.6, b: 230.0, draw: CAP(6, 228.7) },
  { a: 230.0, b: 250.7, draw: (t) => <StageUva t={t} a={230.0} pisaT={247.6} /> },
  { a: 250.7, b: 252.1, draw: CAP(7, 250.8) },
  { a: 252.1, b: 269.5, draw: (t) => <MetricTermo t={t} a={252.1} downT={255.1} upT={265.2} /> },
  { a: 269.5, b: 270.9, draw: CAP(8, 269.6) },
  { a: 270.9, b: 280.1, draw: (t) => <StageNomesFinal t={t} a={270.7} /> },
  { a: 280.1, b: 285.6, draw: TT('COMENTA 👇', 'TEM NONO OU NONA DA SERRA?', 280.2) },
  { a: 285.6, b: 300, draw: TT('SE INSCREVE 🔔', 'BAH, TU SABIA?', 285.7) },
];
const CUTS = SEGS.map((s) => s.a).filter((a) => a > 0);

const GROUND = 1050;
const LS = 0.46, PS = 0.46;
const CX = 1300, CY = 470;
const lauroX = (t: number) => kf(t, [[0, -220], [2.4, 300], [74.2, 300], [76.0, 400], [123.0, 400], [124.8, 300], [269.5, 300], [271.2, 380]]);
const lauroWalk = (t: number) => clamp(Math.abs(lauroX(t + 0.05) - lauroX(t - 0.05)) / 12);
const piaX = (t: number) => kf(t, [[0, 1250], [3.4, 1250], [4.2, 650], [269.5, 650], [271.2, 700]]);
const piaWalk = (t: number) => clamp(Math.abs(piaX(t + 0.05) - piaX(t - 0.05)) / 12);

const WIDE = (at: number, ease = 1.2): Shot => ({ at, x: 960, y: 540, z: 1, ease });
const HALF = (at: number, ease = 1.0): Shot => ({ at, x: 1080, y: 520, z: 1.05, ease });
const CARD = (at: number, ease = 1.0, z = 1.1, dx = 0, dy = 0): Shot => ({ at, x: CX - 250 + dx, y: CY + 20 + dy, z: Math.min(z, 1.12), ease });
const LAU = (at: number, ease = 0.6): Shot => ({ at, x: 480, y: 520, z: 1.3, ease });
const PIA = (at: number, ease = 0.35): Shot => ({ at, x: 640, y: 690, z: 1.45, ease });
const TWO = (at: number, ease = 0.6): Shot => ({ at, x: 470, y: 640, z: 1.15, ease });
const SHOTS: Shot[] = [
  { at: 0, x: 0, y: 520, z: 1.32 }, { at: 2.4, x: 420, y: 520, z: 1.32, ease: 2.4 },
  PIA(4.6, 0.5), HALF(8.6, 1.0), LAU(22.6, 0.6),
  CARD(26.0, 1.0), CARD(35.0, 3.0, 1.12, 0, 60), HALF(42.0, 0.8), PIA(46.4, 0.4),
  CARD(49.0, 2.5, 1.06), CARD(60.0, 8.0, 1.1), PIA(67.6, 0.9), TWO(70.0, 1.2),
  CARD(75.0, 1.0), HALF(82.0, 1.0), CARD(89.0, 1.2, 1.1, 0, 60), CARD(99.8, 0.8), PIA(106.5, 0.35),
  CARD(109.6, 0.8), CARD(113.0, 3.0, 1.12, 60, -60), PIA(123.4, 0.35),
  CARD(125.4, 0.9), HALF(133.0, 1.0), CARD(138.8, 0.8), CARD(146.0, 2.0, 1.12, 0, -30), WIDE(153.2, 0.7),
  PIA(155.8, 0.4), CARD(159.0, 1.0), HALF(166.0, 1.2), CARD(175.8, 0.8), CARD(181.8, 2.5, 1.12, -60, 0),
  PIA(187.0, 0.35), CARD(190.2, 0.8), PIA(197.9, 0.3), CARD(200.6, 1.0), HALF(206.0, 1.2), CARD(210.2, 0.8),
  PIA(217.2, 0.3), LAU(219.6, 0.6), HALF(223.2, 1.0), CARD(230.0, 1.0), HALF(238.0, 1.2), CARD(246.8, 0.8),
  PIA(251.0, 0.3), CARD(253.8, 0.8), CARD(264.6, 1.0, 1.12, 40, -40),
  HALF(269.8, 0.8), CARD(272.0, 1.0), TWO(277.0, 1.0), HALF(280.6, 1.0), { at: 287.0, x: 900, y: 560, z: 1.04, ease: 3.0 }, PIA(291.9, 0.3), TWO(294.6, 0.8),
];
const PUNCHES = [1.6, 128.3, 139.5, 149.7, SELO, 168.6, 210.4, 211.6, 247.6, 257.4];

const LEXPR: [number, Expr][] = [[0, 'delight'], [1.5, 'talk'], [3.9, 'smile'], [4.2, 'laugh'], [7.7, 'laugh'], [8.6, 'talk'], [24.4, 'smile'], [25.0, 'talk'], [45.8, 'smile'], [SOB_A, 'sad'], [SOB_B, 'talk'], [105.9, 'smile'], [106.2, 'shock'], [108.8, 'laugh'], [110.5, 'talk'], [122.8, 'smile'], [124.9, 'laugh'], [126.0, 'talk'], [153.9, 'delight'], [155.0, 'laugh'], [158.3, 'talk'], [174.7, 'delight'], [176.0, 'talk'], [186.5, 'squint'], [189.6, 'laugh'], [191.0, 'talk'], [197.5, 'smile'], [199.4, 'talk'], [216.7, 'smile'], [219.1, 'laugh'], [221.0, 'talk'], [228.4, 'smile'], [228.6, 'talk'], [250.5, 'smile'], [253.5, 'delight'], [254.6, 'talk'], [269.3, 'smile'], [269.6, 'talk'], [286.0, 'delight'], [287.0, 'talk'], [291.0, 'wink'], [291.8, 'smile']];
const LARM: [number, ArmPose][] = [[0, 'wave'], [2.6, 'down'], [8.6, 'hold'], [24.9, 'pointSide'], [45.8, 'down'], [SOB_B, 'pointSide'], [99.7, 'pointUp'], [105.0, 'down'], [109.0, 'thumbsUp'], [110.5, 'pointSide'], [122.8, 'down'], [125.0, 'wag'], [127.6, 'pointSide'], [149.6, 'pointUp'], [153.9, 'thumbsUp'], [158.3, 'pointUp'], [161.0, 'pointSide'], [182.6, 'pointUp'], [186.5, 'down'], [190.0, 'wag'], [192.6, 'pointSide'], [197.5, 'down'], [199.4, 'pointUp'], [201.0, 'pointSide'], [216.7, 'down'], [219.3, 'wag'], [223.4, 'pointDown'], [228.4, 'pointSide'], [250.5, 'down'], [253.6, 'thumbsUp'], [255.0, 'pointSide'], [269.4, 'hold'], [280.2, 'pointDown'], [285.6, 'thumbsUp'], [290.5, 'wave']];
const PEXPR: [number, PiaExpr][] = [[0, 'smile'], [4.2, 'laugh'], [6.0, 'talk'], [7.8, 'smile'], [45.0, 'shock'], [46.1, 'talk'], [47.7, 'smile'], [SOB_A, 'pout'], [SOB_B, 'smile'], [74.3, 'talk'], [76.4, 'smile'], [106.2, 'shock'], [108.6, 'smile'], [123.0, 'talk'], [124.6, 'smile'], [SELO, 'shock'], [155.0, 'laugh'], [158.0, 'smile'], [180.9, 'shock'], [182.5, 'smile'], [186.7, 'smug'], [189.4, 'smile'], [190.8, 'pout'], [193.5, 'smile'], [197.8, 'smug'], [199.2, 'smile'], [216.9, 'laugh'], [218.9, 'smile'], [250.7, 'talk'], [253.3, 'smile'], [257.4, 'shock'], [259.5, 'smile'], [291.7, 'laugh'], [294.2, 'smile']];
const PARMS: [number, PiaArms][] = [[0, 'down'], [4.2, 'shrug'], [7.8, 'down'], [46.1, 'shrug'], [47.7, 'down'], [74.3, 'count'], [76.4, 'down'], [106.2, 'shrug'], [108.6, 'down'], [123.0, 'present'], [124.6, 'down'], [154.4, 'count'], [158.0, 'down'], [186.7, 'hips'], [189.4, 'down'], [190.8, 'cross'], [193.5, 'down'], [197.8, 'present'], [199.2, 'down'], [216.9, 'cheer'], [218.9, 'down'], [250.7, 'cross'], [259.5, 'down'], [291.7, 'cheer'], [294.2, 'down']];

const CHIPS: [number, number, string, 'info' | 'warn' | 'bad' | 'good'][] = [
  [27.5, 34.0, '💧 CLAREIRA COM FONTES DE ÁGUA', 'info'],
  [34.4, 42.2, '🐴 POUSO DOS TROPEIROS DOS CAMPOS DE CIMA DA SERRA', 'warn'],
  [82.6, 88.5, '🇮🇹 CAMPONESES DO NORTE DA ITÁLIA, PRINCIPALMENTE DO VÊNETO', 'warn'],
  [90.8, 98.9, '🚢 OCEANO → 🛶 RIOS → 🥾 PICADAS NO MATO', 'info'],
  [115.0, 122.6, '🪓 DERRUBAR, CONSTRUIR E PLANTAR', 'info'],
  [133.3, 135.5, '🎖️ HOMENAGEM AO DUQUE DE CAXIAS', 'info'],
  [164.8, 168.0, '⛰️ "MILAGRE DAS MONTANHAS"', 'warn'],
  [168.4, 174.4, '🏭 DAS OFICINAS AOS POLOS INDUSTRIAIS', 'info'],
  [192.4, 197.4, '⚽ SÓ CORES E NOME · SEM ESCUDO', 'info'],
  [235.0, 240.8, '🚂 CONTA-SE: IDEIA DE JOAQUIM PEDRO LISBOA', 'info'],
  [244.5, 247.4, '🎉 DESFILE DE CARROS ALEGÓRICOS', 'warn'],
  [260.7, 263.4, '❄️ GEADA, NEBLINA E ÀS VEZES NEVE', 'info'],
];

const SFX: [string, number, number][] = [
  ['plim', 0.0, 0.3], ['whoosh', 1.5, 0.2], ['pop', 1.65, 0.3], ['patinhas', 3.4, 0.2], ['boing', 4.2, 0.2],
  ...CUTS.filter((c) => !sober(c) && c !== SOB_A && c !== SOB_B).map((c) => ['whoosh', c - 0.12, 0.14] as [string, number, number]),
  ...CHAPTERS.slice(1).filter((c) => c.a !== SOB_A).map((c) => ['ding', c.a, 0.22] as [string, number, number]),
  ['agua', 28.6, 0.15], ['patinhas', 35.4, 0.15], ['vento', 48.2, 0.1],
  ['whoosh', 88.8, 0.2], ['ding', 96.0, 0.25], ['caminhao', 100.3, 0.15], ['tictac', 101.0, 0.12], ['ding', 103.0, 0.25], ['boing', 106.6, 0.2],
  ['tictac', 112.0, 0.12], ['ding', 114.2, 0.25],
  ['pop', 128.3, 0.3], ['pop', 136.3, 0.3], ['pop', 139.5, 0.3], ['pop', 143.4, 0.3], ['apito', 144.8, 0.2], ['pop', 149.7, 0.3],
  ['patinhas', SELO - 1.5, 0.35], ['latido', SELO - 0.05, 0.4], ['carimbo', SELO, 0.5], ['whoosh', SELO + 1.5, 0.25], ['patinhas', SELO + 1.6, 0.3],
  ['plim', 160.6, 0.3], ['ding', 168.6, 0.25], ['tictac', 176.6, 0.12], ['ding', 179.1, 0.3], ['boing', 187.0, 0.2], ['pop', 190.6, 0.25], ['pop', 191.0, 0.25],
  ['pop', 201.0, 0.2], ['pop', 201.4, 0.2], ['pop', 201.8, 0.2], ['carimbo', 210.4, 0.4], ['carimbo', 211.6, 0.4], ['aplauso', 218.0, 0.15],
  ['plim', 230.2, 0.3], ['ding', 233.2, 0.25], ['aplauso', 245.0, 0.15], ['agua', 247.6, 0.25],
  ['chocalho', 251.0, 0.18], ['vento', 255.2, 0.15], ['tictac', 255.3, 0.12], ['ding', 257.4, 0.3], ['sino', 263.0, 0.15], ['plim', 267.9, 0.25],
  ['pop', 270.7, 0.25], ['pop', 271.8, 0.25], ['pop', 272.9, 0.25], ['aplauso', 286.0, 0.2], ['latido', 291.2, 0.3], ['latido', 294.4, 0.25],
];

const Chip: React.FC<{ t: number; a: number; b: number; text: string; kind: 'info' | 'warn' | 'bad' | 'good' }> = ({ t, a, b, text, kind }) => {
  if (t < a || t > b) return null;
  const bg = { bad: '#C62828', good: '#2E7D32', warn: MUST, info: 'rgba(20,16,12,.92)' }[kind];
  return (
    <div style={{ position: 'absolute', left: 760, width: 1100, top: 28, display: 'flex', justifyContent: 'center', opacity: clamp((b - t) / 0.2) }}>
      <div style={{ transform: `scale(${pop(t, a)})`, background: bg, color: kind === 'warn' ? '#1E1B18' : '#fff', borderRadius: 30, padding: '10px 26px', fontFamily: FONT, fontWeight: 900, fontSize: text.length > 40 ? 26 : text.length > 34 ? 28 : 34, whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(0,0,0,.4)', border: '3px solid rgba(255,255,255,.85)' }}>{text}</div>
    </div>
  );
};

export const Video07L: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const seg = SEGS.find((s) => t >= s.a && t < s.b);
  const ch = [...CHAPTERS].reverse().find((c) => t >= c.a) ?? CHAPTERS[0];
  const lastCut = CUTS.filter((c) => c <= t).pop() ?? -1;
  const flash = lastCut > 0 && !sober(lastCut) && lastCut !== SOB_A && lastCut !== SOB_B && t - lastCut < 0.08 ? 1 - (t - lastCut) / 0.08 : 0;
  const lx = lauroX(t), px = piaX(t);
  const lHop = sober(t) ? 0 : jumps(t, [0.05, 109.0, 153.9, 253.6, 286.0], 0.42, 100);
  const pHop = sober(t) ? 0 : jumps(t, [4.2, 106.3, SELO, 216.9, 291.7], 0.4, 100);
  /* Cusco: corre até o centro, para, late (selo) e sai pelo outro lado */
  const seloRun = (t > SELO - 1.6 && t < SELO - 0.15) || (t > SELO + 1.55 && t < SELO + 3.6);
  const seloStop = t >= SELO - 0.15 && t <= SELO + 1.55;
  const cuscoX = t < SELO ? kf(t, [[SELO - 1.6, -250], [SELO - 0.15, 960]]) : t > SELO + 1.55 ? kf(t, [[SELO + 1.55, 960], [SELO + 3.6, 2150]]) : 960;
  const tremble = t > 256 && t < 264;
  const cuscoShow = !sober(t) && (t < 24.9 || seloRun || seloStop || (t > 108.8 && t < 123) || (t > 189.6 && t < 199.4) || tremble || t > 280);
  const cuscoSitX = 480;
  const dark = sober(t) ? clamp(Math.min(t - SOB_A, SOB_B - t) / 1.0) * 0.45 : 0;
  const cold = t > 253 && t < 265.4 ? clamp(Math.min(t - 255.1, 265.4 - t) / 1.0) : 0;
  const snow = t > 262.6 && t < 265.2 ? clamp(Math.min(t - 262.6, 265.2 - t) / 0.4) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute' }}>
        <LauroDefs />
        <PiaDefs />
        <CuscoDefs />
        <Cam t={t} w={W} h={H} shots={SHOTS} punches={PUNCHES} breath={sober(t) ? 0.4 : 0.8}>
          <SerraWorld t={t} w={W} h={H} cold={cold} snow={snow} />
          <rect x={-800} y={-800} width={W + 1600} height={H + 1600} fill={`rgba(10,14,24,${dark})`} />
          {seg && <g transform={`translate(${CX},${CY}) scale(0.8)`}>{seg.draw(t)}</g>}
          {t > 286.0 && t < 289.5 && <ConfettiC t={t} start={286.0} cx={CX} cy={CY - 100} colors={[UVA, '#5C8A34', MUST, '#fff']} />}
          {cuscoShow && (
            <g transform={`translate(${seloRun || seloStop ? cuscoX : cuscoSitX},${GROUND - 8})`}>
              {seloRun ? <g transform="scale(0.55)"><CuscoRun t={t} bread={false} /></g>
                : <g transform={`scale(0.55) translate(${tremble ? Math.sin(t * 60) * 3 : 0},0)`}><CuscoSit t={t} chew={false} tiltHead={seloStop ? -18 : Math.sin(t * 2.2) * 16} /></g>}
            </g>
          )}
          <g transform={`translate(${lx},${GROUND}) scale(${LS})`}>
            <Lauro t={t} talk={talkL(t)} expr={pick(t, LEXPR, 'talk')} arm={pick(t, LARM, 'down')} armWobble={sober(t) ? 0 : Math.sin(t * 5) * 5} walk={lauroWalk(t)} hop={lHop / LS}
              cuiaRaise={(t > 23.0 && t < 24.9) || (t > 278.0 && t < 280.2) ? 1 : 0} />
          </g>
          <g transform={`translate(${px},${GROUND}) scale(${-PS},${PS})`}>
            <Pia t={t} talk={talkP(t)} expr={pick(t, PEXPR, 'smile')} arms={pick(t, PARMS, 'down')} walk={piaWalk(t)} hop={pHop / PS} gaze={quem(t) === 'L' ? 1 : 0.4}
              tilt={sober(t) ? 10 : quem(t) === 'P' ? Math.sin(t * 3) * 5 : 0} lean={t > 250.7 && t < 253.2 ? Math.sin(t * 40) * 1.5 : 0} />
          </g>
        </Cam>
      </svg>

      <div style={{ position: 'absolute', left: 36, top: 28, fontFamily: FONT }}>
        <div style={{ display: 'inline-block', background: 'rgba(20,16,12,.85)', borderRadius: 12, padding: '7px 16px', fontWeight: 900, fontSize: 26, color: '#fff' }}>
          <span style={{ color: MUST }}>BAH, TU SABIA?</span> · #007
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 14, transform: `scale(${pop(t, ch.a, 0.3) || 1})`, transformOrigin: 'left' }}>
          <span style={{ background: sober(t) ? '#3A4250' : UVA, color: '#fff', fontWeight: 900, fontSize: 24, padding: '4px 12px', borderRadius: 8 }}>{ch.n}</span>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 30, WebkitTextStroke: '6px rgba(20,16,12,.85)', paintOrder: 'stroke fill' }}>{ch.title}</span>
        </div>
        <div style={{ color: MUST, fontWeight: 900, fontSize: 56, WebkitTextStroke: '8px rgba(20,16,12,.85)', paintOrder: 'stroke fill' }}>{ch.year}</div>
      </div>

      {CHIPS.map(([a, b, text, kind], i) => <Chip key={i} t={t} a={a} b={b} text={text} kind={kind} />)}
      <SeloCusco t={t} at={SELO} num="#007" tema="CAXIAS DO SUL" size={430} cx={960} cy={470} />
      <Captions t={t} hidden={t < 0.05 || (t > SELO && t < SELO + 1.9)} words={WORDS} y={948} size={60} left={760} right={60} />

      {flash > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash * 0.7})` }} />}
      {t > 297.0 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - 297.0) / 0.55)})` }} />}

      <Audio src={staticFile('audio/v07L_voz.mp3')} />
      <Audio src={staticFile('audio/v07L_musica.mp3')} volume={(f) => kf(f / FPS, [[SOB_A - 1, 1], [SOB_A, 0.25], [SOB_B, 0.25], [SOB_B + 1, 1]])} />
      {SFX.filter(([, , v]) => v > 0).map(([name, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={Math.round(5 * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
