import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import './fonts';
import { FPS, MUST, kf, clamp, pop, makeVoice, Word } from './lib';
import { Lauro, LauroDefs, Expr, ArmPose } from './chars/Lauro';
import { Guria, GuriaDefs, GuriaExpr, GuriaArms } from './chars/Guria';
import { CuscoSit, CuscoRun, CuscoDefs } from './chars/Others';
import { GuaibaWorld, ConfettiC } from './scenes/Inter';
import { StageTitleSerra } from './scenes/Caxias';
import { StageBah, StageDuo, COR } from './scenes/BahCapaz';
import { Cam, Shot } from './camera';
import { HUD, BigText, Captions, SeloCusco } from './ui/Overlays';
import rms08 from './data/v08/rms.json';
import words08 from './data/v08/words.json';
import falas08 from './data/v08/falas.json';

/* #008 (curto, vertical) — Um "bah", mil significados (e o "capaz" também), com a Guria */
export const DURATION_08 = 76.3;
const rms = makeVoice(rms08 as number[]);
const FALAS = falas08 as { n: number; quem: string; s: number; e: number }[];
const F = (n: number) => FALAS.find((f) => f.n === n)!;
const quem = (t: number) => FALAS.find((f) => t >= f.s - 0.05 && t <= f.e + 0.05)?.quem;
const talkL = (t: number) => (quem(t) === 'L' ? rms(t) : 0);
const talkG = (t: number) => (quem(t) === 'G' ? rms(t) : 0);
const WORDS = words08 as Word[];
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';
const jump = (t: number, at: number, dur: number, h: number) => (t > at && t < at + dur ? Math.sin((Math.PI * (t - at)) / dur) * h : 0);
const pick = <T,>(t: number, list: [number, T][], def: T): T => {
  let v = def;
  for (const [a, x] of list) if (t >= a) v = x;
  return v;
};

/* tempos das falas (do falas.json) */
const B1 = F(4), B2 = F(5), B3 = F(6), B4 = F(7), B5 = F(8), GB = F(9), L10 = F(10), G11 = F(11), L12 = F(12), G13 = F(13), CZ = F(14), G15 = F(15), G16 = F(16), BC = F(17), GBF = F(18), FIM = F(19);
/* selo do Cusco, no meio do vídeo (pausa entre as falas 10 e 11) */
const SELO = L10.e + 0.55;

const GROUND = 1868;
const LS = 0.38, GS = 0.4;
const lauroX = (t: number) => kf(t, [[0, -170], [2.3, 270], [8.4, 270], [9.6, 330], [33.0, 330], [34.0, 270], [63.6, 270], [64.8, 340]]);
const lauroWalk = (t: number) => clamp(Math.abs(lauroX(t + 0.05) - lauroX(t - 0.05)) / 12);
const guriaX = (t: number) => kf(t, [[0, 1300], [4.4, 1300], [5.3, 840], [25.0, 840], [25.5, 790], [56.0, 790], [56.6, 830], [63.6, 830], [64.8, 790]]);
const guriaWalk = (t: number) => clamp(Math.abs(guriaX(t + 0.05) - guriaX(t - 0.05)) / 12);

/* ---------- câmera ---------- */
const CARD = (at: number, z = 1.12, ease?: number): Shot => ({ at, x: 540, y: 830, z: 1 + (z - 1) * 0.45, ease });
const WIDE = (at: number, ease?: number): Shot => ({ at, x: 540, y: 960, z: 1, ease });
const GUR = (at: number, ease?: number, z = 1.36): Shot => ({ at, x: 760, y: 1560, z, ease });
const SHOTS: Shot[] = [
  { at: 0, x: -60, y: 1360, z: 1.35 },
  CARD(1.5, 1.08, 0.6),
  GUR(5.5, 0.45),
  CARD(8.4, 1.1, 0.7),
  CARD(12.8, 1.16, 1.4),
  CARD(B1.s - 0.1, 1.18, 0.25),
  CARD(B2.s - 0.1, 1.08, 0.5),
  CARD(B3.s - 0.1, 1.2, 0.2),
  CARD(B4.s - 0.1, 1.1, 0.5),
  CARD(B5.s - 0.1, 1.16, 0.3),
  GUR(GB.s - 0.1, 0.4),
  CARD(L10.s + 0.6, 1.12, 0.6),
  WIDE(L10.e - 0.4, 0.6), // abre para o selo do Cusco
  GUR(G11.s - 0.2, 0.45),
  CARD(37.1, 1.1, 0.5),
  CARD(44.2, 1.15, 0.7),
  { at: G13.s - 0.2, x: 680, y: 1520, z: 1.3, ease: 0.5 }, // Guria e o Cusco
  CARD(CZ.s - 0.1, 1.2, 0.2),
  GUR(G15.s, 0.45),
  CARD(G16.s + 0.6, 1.1, 0.7),
  CARD(BC.s - 0.1, 1.2, 0.2),
  CARD(GBF.s - 0.1, 1.14, 0.3),
  WIDE(FIM.s + 0.2, 0.8),
  CARD(66.8, 1.1, 0.7),
  { at: 71.0, x: 540, y: 1470, z: 1.15, ease: 0.6 },
  WIDE(73.2, 0.8),
];
const PUNCHES = [1.7, B1.s, B3.s, B5.s, SELO, CZ.s, BC.s, 66.9];

/* ---------- cards ---------- */
type Card = { a: number; b: number; draw: (t: number) => React.ReactNode };
const TEASER: [number, string, string][] = [[1.9, '= QUE INCRÍVEL 🤩', COR.good], [2.5, '= QUE PENA 😞', COR.warn], [3.1, '= PARA COM ISSO 😤', COR.bad], [3.7, '= ECA 🤢', COR.eca], [4.3, '= QUE BELEZA 😂', COR.good], [4.9, '= ???', COR.ask]];
const CARDS: Card[] = [
  { a: 0, b: 8.4, draw: (t) => <StageBah t={t} a={1.5} word="BAH" flips={TEASER} cena="pergunta" cenaAt={5.6} /> },
  { a: 8.4, b: B1.s - 0.25, draw: (t) => <StageDuo t={t} a={8.4} bahT={10.35} capazT={11.25} setaT={13.2} /> },
  { a: B1.s - 0.25, b: B2.s - 0.25, draw: (t) => <StageBah t={t} a={B1.s - 0.2} word="BAAAAH!" cena="xis" curve="up" vs={B1.s} ve={B1.e} stretch={[B1.s, B1.e]} flips={[[B1.e - 0.2, '= QUE INCRÍVEL 🤩', COR.good]]} /> },
  { a: B2.s - 0.25, b: B3.s - 0.25, draw: (t) => <StageBah t={t} a={B2.s - 0.2} word="BAH…" cena="termica" curve="down" vs={B2.s} ve={B2.e} flips={[[B2.e - 0.1, '= QUE PENA 😞', COR.warn]]} /> },
  { a: B3.s - 0.25, b: B4.s - 0.25, draw: (t) => <StageBah t={t} a={B3.s - 0.2} word="BAH!" cena="cuia" curve="short" vs={B3.s} ve={B3.e} flips={[[B3.e - 0.15, '= PARA COM ISSO 😤', COR.bad]]} /> },
  { a: B4.s - 0.25, b: B5.s - 0.25, draw: (t) => <StageBah t={t} a={B4.s - 0.2} word="BAH." cena="lavado" curve="eca" vs={B4.s} ve={B4.e} flips={[[B4.e - 0.1, '= ECA 🤢', COR.eca]]} /> },
  { a: B5.s - 0.25, b: GB.s - 0.3, draw: (t) => <StageBah t={t} a={B5.s - 0.2} word="BAH, BAH, BAH!" cena="riso" curve="triple" vs={B5.s} ve={B5.e} flips={[[B5.e - 0.2, '= QUE BELEZA 😂', COR.good]]} /> },
  { a: GB.e - 0.9, b: L10.e - 0.4, draw: (t) => <StageBah t={t} a={GB.e - 0.85} word="BAH?" cena="pergunta" curve="upq" vs={GB.e - 0.6} ve={GB.e} flips={[[29.0, '= SÉRIO? 🤨', COR.info]]} /> },
  { a: G11.s + 0.1, b: 44.2, draw: (t) => <StageBah t={t} a={G11.s + 0.1} word="CAPAZ" sub="NA ESCOLA" cena="livro" cenaAt={36.3} flips={[[37.4, '= QUE CONSEGUE 📚', COR.info], [41.9, '= NO RS, DEPENDE! 🤠', COR.warn]]} /> },
  { a: 44.2, b: G13.s - 0.2, draw: (t) => <StageBah t={t} a={44.2} word="CAPAZ QUE CHOVA" cena="chuva" cenaAt={44.6} flips={[[46.4, '= É BEM POSSÍVEL 🌧️', COR.info]]} /> },
  { a: CZ.s - 0.25, b: G15.e, draw: (t) => <StageBah t={t} a={CZ.s - 0.2} word="CAPAZ?!" cena="chapeu" curve="upq" vs={CZ.s} ve={CZ.e} flips={[[CZ.e - 0.1, '= COMO ASSIM?! 😳', COR.warn]]} /> },
  { a: G16.s + 0.5, b: BC.s - 0.25, draw: (t) => <StageBah t={t} a={G16.s + 0.5} word="23:59" sub="SÓ MAIS UM POUQUINHO…" cena="relogio" cenaAt={G16.s + 0.7} flips={[]} fill="#24303E" /> },
  { a: BC.s - 0.25, b: GBF.s - 0.2, draw: (t) => <StageBah t={t} a={BC.s - 0.2} word="BEM CAPAZ!" cena="xnao" curve="short" vs={BC.s} ve={BC.e} flips={[[BC.e - 0.2, '= NEM PENSAR ❌', COR.bad]]} /> },
  { a: GBF.s - 0.2, b: FIM.s + 0.2, draw: (t) => <StageBah t={t} a={GBF.s - 0.15} word="BAH…" cena="triste" curve="down" vs={GBF.s} ve={GBF.e} flips={[[GBF.e - 0.05, '= QUE PENA 😞', COR.warn]]} /> },
  { a: 66.8, b: 77, draw: (t) => <StageTitleSerra t={t} at={66.9} kicker="COMENTA 👇 A TUA CIDADE" title="A MAIS CURTIDA É O PRÓXIMO VÍDEO" /> },
];
const CUTS = CARDS.map((c) => c.a).filter((a) => a > 0);

const LEXPR: [number, Expr][] = [[0, 'delight'], [1.4, 'talk'], [5.2, 'smile'], [8.4, 'talk'], [12.2, 'wink'], [13.0, 'talk'],
  [B1.s - 0.1, 'delight'], [B2.s - 0.1, 'sad'], [B3.s - 0.1, 'angry'], [B4.s - 0.1, 'squint'], [B5.s - 0.1, 'laugh'], [GB.s - 0.2, 'smile'], [L10.s, 'laugh'], [29.8, 'talk'],
  [SELO - 0.3, 'delight'], [SELO + 1.5, 'smile'], [L12.s, 'talk'], [G13.s, 'smile'], [CZ.s - 0.1, 'shock'], [G15.s + 0.3, 'squint'], [G15.s + 1.2, 'laugh'], [G16.s, 'smile'],
  [BC.s - 0.1, 'stern'], [GBF.s + 0.2, 'smile'], [FIM.s, 'laugh'], [65.4, 'talk'], [72.6, 'wink'], [73.4, 'smile']];
const LARM: [number, ArmPose][] = [[0, 'wave'], [2.6, 'down'], [8.6, 'pointUp'], [10.2, 'pointSide'], [14.9, 'down'],
  [B1.s - 0.1, 'pointSide'], [B2.s - 0.1, 'down'], [B3.s - 0.1, 'wag'], [B4.s - 0.1, 'down'], [B5.s - 0.1, 'hold'], [GB.s, 'down'], [30.8, 'thumbsUp'], [32.6, 'down'],
  [L12.s + 0.2, 'pointSide'], [44.4, 'pointUp'], [48.0, 'down'], [G15.s + 0.4, 'pointUp'], [G16.s, 'down'], [BC.s - 0.1, 'wag'], [BC.e + 0.4, 'down'],
  [FIM.s, 'thumbsUp'], [65.4, 'pointSide'], [70.5, 'pointUp'], [72.4, 'down']];
const GEXPR: [number, GuriaExpr][] = [[0, 'smile'], [5.5, 'talk'], [8.1, 'smile'], [B1.s, 'shock'], [B2.s, 'sad'], [B3.s, 'shock'], [B4.s, 'pout'], [B5.s, 'laugh'],
  [GB.s, 'talk'], [GB.e, 'smile'], [30.0, 'laugh'], [32.6, 'smile'], [SELO, 'shock'], [SELO + 1.0, 'laugh'], [G11.s, 'talk'], [G11.e, 'smile'],
  [G13.s, 'smug'], [G13.e, 'smile'], [CZ.s, 'smug'], [G15.s, 'laugh'], [G16.s, 'smug'], [BC.s, 'shock'], [GBF.s, 'pout'], [FIM.s + 1, 'smile'], [64.8, 'laugh'], [66.0, 'smile']];
const GARMS: [number, GuriaArms][] = [[0, 'down'], [5.5, 'cross'], [8.1, 'down'], [B5.s, 'cheer'], [B5.e + 0.2, 'down'], [GB.s, 'hips'], [GB.e + 0.4, 'down'],
  [G11.s, 'count'], [G11.e, 'down'], [G13.s, 'present'], [G13.e, 'down'], [G15.s, 'shrug'], [G15.e, 'down'], [G16.s, 'present'], [BC.s, 'down'], [GBF.s, 'cross'],
  [FIM.s + 1.0, 'down'], [66.9, 'cheer'], [68.6, 'skirt'], [70.5, 'down'], [73.3, 'cheer']];

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
  ['plim', 0.0, 0.3], ['whoosh', 1.4, 0.2], ...TEASER.map(([a]) => ['pop', a, 0.18] as [string, number, number]),
  ['patinhas', 4.4, 0.18], ['boing', 5.5, 0.18],
  ...CUTS.filter((c) => c > 8 && c < 66).map((c) => ['whoosh', c - 0.1, 0.14] as [string, number, number]),
  ['pop', 10.35, 0.3], ['pop', 11.25, 0.3], ['riser', 13.0, 0.15],
  ['plim', B1.e - 0.2, 0.3], ['toin', B2.e - 0.1, 0.25], ['erro', B3.s, 0.22], ['boing', B4.e - 0.1, 0.22], ['aplauso', B5.s, 0.15], ['ding', B5.e - 0.2, 0.22],
  ['boing', GB.s + 0.2, 0.18], ['ding', 29.0, 0.25],
  ['patinhas', SELO - 1.4, 0.3], ['latido', SELO - 0.05, 0.4], ['carimbo', SELO, 0.5], ['whoosh', SELO + 1.5, 0.22], ['patinhas', SELO + 1.6, 0.25],
  ['pop', 37.4, 0.22], ['pop', 41.9, 0.22], ['chuva', 44.6, 0.1], ['ding', 46.4, 0.22],
  ['latido', G13.e - 0.6, 0.2], ['scratch', CZ.s, 0.3], ['ding', CZ.e - 0.1, 0.2], ['boing', G15.s, 0.2],
  ['tictac', G16.s + 0.7, 0.12], ['buzina', BC.s, 0.22], ['toin', GBF.s, 0.25],
  ['aplauso', FIM.s, 0.15], ['ding', 66.9, 0.28], ['plim', 69.0, 0.25], ['aplauso', 72.6, 0.2], ['latido', 72.9, 0.3],
];

export const Video08: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const card = CARDS.find((c) => t >= c.a && t < c.b);
  const lastCut = CUTS.filter((c) => c <= t).pop() ?? -1;
  const flash = lastCut > 0 && t - lastCut < 0.08 ? 1 - (t - lastCut) / 0.08 : 0;
  const lx = lauroX(t), gx = guriaX(t);
  const lHop = jump(t, 0.05, 0.4, 70) + jump(t, B1.s, 0.4, 90) + jump(t, B5.s, 0.35, 60) + jump(t, CZ.s, 0.35, 80) + jump(t, 72.6, 0.4, 90);
  const gHop = jump(t, GB.s, 0.35, 90) + jump(t, SELO, 0.35, 110) + jump(t, G15.s, 0.35, 90) + jump(t, 66.9, 0.4, 100) + jump(t, 73.3, 0.4, 100);
  /* Cusco: assiste aos bahs inclinando a cabeça, atravessa no selo, fica do lado da Guria na pegadinha do chapéu e no final */
  const cuscoSeloRun = (t > SELO - 1.5 && t < SELO - 0.1) || (t > SELO + 1.55 && t < SELO + 3.2);
  const cuscoSeloStop = t >= SELO - 0.1 && t <= SELO + 1.55;
  const cuscoX = t < SELO ? kf(t, [[SELO - 1.5, -250], [SELO - 0.1, 540]]) : t > SELO + 1.55 ? kf(t, [[SELO + 1.55, 540], [SELO + 3.2, 1350]]) : 540;
  const cuscoSitShow = (t < 8.4) || (t > B1.s - 0.3 && t < GB.s) || (t > G13.s - 0.3 && t < G16.s) || t > FIM.s;
  const cuscoShow = cuscoSeloRun || cuscoSeloStop || cuscoSitShow;
  const cuscoSitX = t > G13.s - 0.4 && t < G16.s ? 610 : 600;
  const tilt = (t > B1.s - 0.3 && t < GB.s) ? [B1, B2, B3, B4, B5].reduce((v, b, i) => (t > b.s ? (i % 2 ? 18 : -18) : v), 0) : Math.sin(t * 2.4) * 12;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
        <LauroDefs />
        <GuriaDefs />
        <CuscoDefs />
        <Cam t={t} shots={SHOTS} punches={PUNCHES}>
          <GuaibaWorld t={t} flags="rs" />
          {card && <g transform="translate(540,780) scale(0.82)">{card.draw(t)}</g>}
          {t > 66.9 && t < 70.0 && <ConfettiC t={t} start={66.9} colors={['#2E7D32', '#C62828', MUST, '#fff']} />}
          {cuscoShow && (
            <g transform={`translate(${cuscoSeloRun || cuscoSeloStop ? cuscoX : cuscoSitX},${GROUND - 10})`}>
              {cuscoSeloRun ? (
                <g transform="scale(0.5)"><CuscoRun t={t} bread={false} /></g>
              ) : (
                <g transform="scale(0.5)"><CuscoSit t={t} chew={false} tiltHead={cuscoSeloStop ? -18 : tilt} paw={t > B3.s && t < B4.s ? 1 : 0} /></g>
              )}
            </g>
          )}
          <g transform={`translate(${lx},${GROUND}) scale(${LS})`}>
            <Lauro t={t} talk={talkL(t)} expr={pick(t, LEXPR, 'talk')} arm={pick(t, LARM, 'down')} armWobble={Math.sin(t * 5) * 5} walk={lauroWalk(t)} hop={lHop / LS}
              lean={t > B2.s && t < B2.e + 0.5 ? -4 : t > B4.s && t < B4.e + 0.4 ? 5 : 0}
              cuiaRaise={t > 72.6 && t < 76.2 ? kf(t, [[72.6, 0], [73.0, 1]]) : 0} />
          </g>
          <g transform={`translate(${gx},${GROUND}) scale(${-GS},${GS})`}>
            <Guria t={t} talk={talkG(t)} expr={pick(t, GEXPR, 'smile')} arms={pick(t, GARMS, 'down')} walk={guriaWalk(t)} hop={gHop / GS} gaze={quem(t) === 'L' ? 1 : 0.4}
              tilt={quem(t) === 'G' ? Math.sin(t * 3) * 5 : t > GBF.s && t < FIM.s ? 8 : 0} />
          </g>
        </Cam>
      </svg>
      <HUD num="#008" cat="🗣️ JEITO GAÚCHO" />
      <BigText t={t} start={0} end={1.4} lines={['BAH, TU', 'SABIA?']} y={380} size={110} />
      <Chip t={t} a={2.0} b={5.0} text="🗣️ A MESMA PALAVRA, OUTRO SENTIDO" />
      <Chip t={t} a={13.3} b={14.9} text="🎵 ENTONAÇÃO = O JEITO DE FALAR" kind="warn" />
      <Chip t={t} a={40.0} b={41.8} text="🇧🇷 NO RESTO DO BRASIL: QUE CONSEGUE" />
      <Chip t={t} a={G13.s + 0.6} b={CZ.s - 0.3} text="🎩 O CUSCO COMEU O CHAPÉU?" kind="warn" />
      <Chip t={t} a={G15.s + 0.2} b={G15.e + 0.2} text="😜 ERA PEGADINHA!" kind="good" />
      <Chip t={t} a={68.8} b={72.4} text="🗣️ E QUAL BAH TU MAIS USA?" kind="warn" />
      <Chip t={t} a={72.4} b={76.3} text="🏆 A CIDADE MAIS CURTIDA VENCE" kind="warn" />
      <SeloCusco t={t} at={SELO} num="#008" tema="BAH E CAPAZ" cy={860} />
      <Captions t={t} hidden={t < 0.05 || (t > SELO && t < SELO + 1.9)} words={WORDS} y={1545} />
      {flash > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash * 0.8})` }} />}
      {t > 75.8 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - 75.8) / 0.5)})` }} />}
      <Audio src={staticFile('audio/v08_voz.mp3')} />
      <Audio src={staticFile('audio/v08_musica.mp3')} volume={(f) => {
        const tt = f / FPS;
        return kf(tt, [[B1.s - 0.6, 1], [B1.s - 0.2, 0.55], [GB.e, 0.55], [GB.e + 0.6, 1]]);
      }} />
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={Math.round(5 * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
