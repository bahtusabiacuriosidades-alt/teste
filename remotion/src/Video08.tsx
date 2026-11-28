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
export const DURATION_08 = 88.6;
const rms = makeVoice(rms08 as number[]);
const FALAS = falas08 as { n: number; quem: string; s: number; e: number }[];
const F = (n: number) => FALAS.find((f) => f.n === n)!;
const quem = (t: number) => FALAS.find((f) => t >= f.s - 0.05 && t <= f.e + 0.05)?.quem;
const talkL = (t: number) => (quem(t) === 'L' ? rms(t) : 0);
const talkG = (t: number) => (quem(t) === 'G' ? rms(t) : 0);
const WORDS = words08 as Word[];
/* tempo de uma palavra (primeira ocorrência depois de `after`) */
const norm = (x: string) => x.toLowerCase().replace(/[?!.,…"]/g, '');
const W = (word: string, after = 0) => WORDS.find((x) => x.s >= after && norm(x.w) === norm(word))!.s;
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';
const jump = (t: number, at: number, dur: number, h: number) => (t > at && t < at + dur ? Math.sin((Math.PI * (t - at)) / dur) * h : 0);
const pick = <T,>(t: number, list: [number, T][], def: T): T => {
  let v = def;
  for (const [a, x] of list) if (t >= a) v = x;
  return v;
};

/* tempos das falas (do falas.json) */
const B1 = F(4), B2 = F(6), B3 = F(8), B4 = F(10), B5 = F(12), GB = F(14), L10 = F(15), G11 = F(16), L12 = F(17), G13 = F(18), CZ = F(19), G15 = F(20), G16 = F(21), BC = F(22), GBF = F(23), FIM = F(24);
/* explicações do Lauro depois de cada bah: o card vira no "quer dizer…" */
const EX = [F(5), F(7), F(9), F(11), F(13)];
const QD = EX.map((e) => W('dizer', e.s) + 0.35);
/* marcos tirados das palavras */
const T_BAH = W('bah', 8), T_CAPAZ = W('capaz', 8), T_ENT = W('entonação', 8);
const T_SERIO = W('sério', GB.e), T_RAPIDO = W('rápido', GB.e);
const T_ESCOLA = W('escola', G11.s), T_CONSEGUE = W('consegue', G11.s), T_RESTO = W('no', L12.s - 1), T_DEPENDE = W('depende', L12.s);
const T_SE = W('se', L12.s), T_PORQUE = W('porque', L12.s);
const T_AGORA = W('agora', FIM.s), T_COMENTA = W('comenta', FIM.s), T_QUAL = W('qual', FIM.s), T_A = W('a', W('usa', FIM.s));
/* selo do Cusco, no meio do vídeo (pausa entre as falas 10 e 11) */
const SELO = L10.e + 0.55;

const GROUND = 1868;
const LS = 0.38, GS = 0.4;
const lauroX = (t: number) => kf(t, [[0, -170], [2.3, 270], [7.4, 270], [8.6, 330], [L10.e + 0.3, 330], [L10.e + 1.3, 270], [FIM.s - 0.4, 270], [FIM.s + 0.8, 340]]);
const lauroWalk = (t: number) => clamp(Math.abs(lauroX(t + 0.05) - lauroX(t - 0.05)) / 12);
const guriaX = (t: number) => kf(t, [[0, 1300], [3.9, 1300], [4.8, 840], [GB.s - 0.5, 840], [GB.s, 790], [G16.s - 0.5, 790], [G16.s + 0.1, 830], [FIM.s - 0.4, 830], [FIM.s + 0.8, 790]]);
const guriaWalk = (t: number) => clamp(Math.abs(guriaX(t + 0.05) - guriaX(t - 0.05)) / 12);

/* ---------- câmera ---------- */
const CARD = (at: number, z = 1.12, ease?: number): Shot => ({ at, x: 540, y: 830, z: 1 + (z - 1) * 0.45, ease });
const WIDE = (at: number, ease?: number): Shot => ({ at, x: 540, y: 960, z: 1, ease });
const GUR = (at: number, ease?: number, z = 1.36): Shot => ({ at, x: 760, y: 1560, z, ease });
const SHOTS: Shot[] = [
  { at: 0, x: -60, y: 1360, z: 1.35 },
  CARD(1.5, 1.08, 0.6),
  GUR(5.0, 0.45),
  CARD(7.4, 1.1, 0.7),
  CARD(T_ENT - 0.4, 1.16, 1.2),
  CARD(B1.s - 0.1, 1.18, 0.25), CARD(QD[0] - 0.2, 1.17, 0.35),
  CARD(B2.s - 0.1, 1.08, 0.5), CARD(QD[1] - 0.2, 1.17, 0.35),
  CARD(B3.s - 0.1, 1.2, 0.2), CARD(QD[2] - 0.2, 1.17, 0.35),
  CARD(B4.s - 0.1, 1.1, 0.5), CARD(QD[3] - 0.2, 1.17, 0.35),
  CARD(B5.s - 0.1, 1.16, 0.3), CARD(QD[4] - 0.2, 1.17, 0.35),
  GUR(GB.s - 0.1, 0.4),
  CARD(L10.s + 0.6, 1.12, 0.6),
  WIDE(L10.e - 0.4, 0.6), // abre para o selo do Cusco
  GUR(G11.s - 0.2, 0.45),
  CARD(T_CONSEGUE - 0.3, 1.1, 0.5),
  CARD(T_SE, 1.15, 0.7),
  { at: G13.s - 0.2, x: 680, y: 1520, z: 1.3, ease: 0.5 }, // Guria e o Cusco
  CARD(CZ.s - 0.1, 1.2, 0.2),
  GUR(G15.s, 0.45),
  CARD(G16.s + 0.6, 1.1, 0.7),
  CARD(BC.s - 0.1, 1.2, 0.2),
  CARD(GBF.s - 0.1, 1.14, 0.3),
  WIDE(FIM.s + 0.2, 0.8),
  CARD(T_COMENTA - 0.1, 1.1, 0.7),
  { at: T_A, x: 540, y: 1470, z: 1.15, ease: 0.6 },
  WIDE(FIM.e + 0.1, 0.8),
];
const PUNCHES = [1.5, B1.s, B3.s, B5.s, SELO, CZ.s, BC.s, T_COMENTA];

/* ---------- cards ---------- */
type Card = { a: number; b: number; draw: (t: number) => React.ReactNode };
const TEASER: [number, string, string][] = [[1.7, '= QUE INCRÍVEL 🤩', COR.good], [2.2, '= QUE PENA 😞', COR.warn], [2.7, '= PARA COM ISSO 😤', COR.bad], [3.2, '= ECA 🤢', COR.eca], [3.7, '= QUE BELEZA 😂', COR.good], [4.2, '= ???', COR.ask]];
const CARDS: Card[] = [
  { a: 0, b: 7.4, draw: (t) => <StageBah t={t} a={1.3} word="BAH" flips={TEASER} cena="pergunta" cenaAt={5.0} /> },
  { a: 7.4, b: B1.s - 0.25, draw: (t) => <StageDuo t={t} a={7.4} bahT={T_BAH} capazT={T_CAPAZ} setaT={T_ENT} /> },
  { a: B1.s - 0.25, b: B2.s - 0.25, draw: (t) => <StageBah t={t} a={B1.s - 0.2} word="BAAAAH!" cena="xis" curve="up" vs={B1.s} ve={B1.e} stretch={[B1.s, B1.e]} flips={[[QD[0], '= QUE INCRÍVEL 🤩', COR.good]]} /> },
  { a: B2.s - 0.25, b: B3.s - 0.25, draw: (t) => <StageBah t={t} a={B2.s - 0.2} word="BAH…" cena="termica" curve="down" vs={B2.s} ve={B2.e} flips={[[QD[1], '= QUE PENA 😞', COR.warn]]} /> },
  { a: B3.s - 0.25, b: B4.s - 0.25, draw: (t) => <StageBah t={t} a={B3.s - 0.2} word="BAH!" cena="cuia" curve="short" vs={B3.s} ve={B3.e} flips={[[QD[2], '= PARA COM ISSO 😤', COR.bad]]} /> },
  { a: B4.s - 0.25, b: B5.s - 0.25, draw: (t) => <StageBah t={t} a={B4.s - 0.2} word="BAH." cena="lavado" curve="eca" vs={B4.s} ve={B4.e} flips={[[QD[3], '= ECA 🤢', COR.eca]]} /> },
  { a: B5.s - 0.25, b: GB.s - 0.3, draw: (t) => <StageBah t={t} a={B5.s - 0.2} word="BAH, BAH, BAH!" cena="riso" curve="triple" vs={B5.s} ve={B5.e} flips={[[QD[4], '= QUE BELEZA 😂', COR.good]]} /> },
  { a: GB.e - 0.9, b: L10.e - 0.4, draw: (t) => <StageBah t={t} a={GB.e - 0.85} word="BAH?" cena="pergunta" curve="upq" vs={GB.e - 0.6} ve={GB.e} flips={[[T_SERIO, '= SÉRIO? 🤨', COR.info]]} /> },
  { a: G11.s + 0.1, b: T_SE, draw: (t) => <StageBah t={t} a={G11.s + 0.1} word="CAPAZ" sub="NA ESCOLA" cena="livro" cenaAt={T_ESCOLA} flips={[[T_CONSEGUE, '= QUE CONSEGUE 📚', COR.info], [T_DEPENDE, '= NO RS, DEPENDE! 🤠', COR.warn]]} /> },
  { a: T_SE, b: G13.s - 0.2, draw: (t) => <StageBah t={t} a={T_SE} word="CAPAZ QUE CHOVA" cena="chuva" cenaAt={T_SE + 0.3} flips={[[T_PORQUE, '= É BEM POSSÍVEL 🌧️', COR.info]]} /> },
  { a: CZ.s - 0.25, b: G15.e, draw: (t) => <StageBah t={t} a={CZ.s - 0.2} word="CAPAZ?!" cena="chapeu" curve="upq" vs={CZ.s} ve={CZ.e} flips={[[CZ.e - 0.1, '= COMO ASSIM?! 😳', COR.warn]]} /> },
  { a: G16.s + 0.5, b: BC.s - 0.25, draw: (t) => <StageBah t={t} a={G16.s + 0.5} word="23:59" sub="SÓ MAIS UM POUQUINHO…" cena="relogio" cenaAt={G16.s + 0.7} flips={[]} fill="#24303E" /> },
  { a: BC.s - 0.25, b: GBF.s - 0.2, draw: (t) => <StageBah t={t} a={BC.s - 0.2} word="BEM CAPAZ!" cena="xnao" curve="short" vs={BC.s} ve={BC.e} flips={[[BC.e - 0.2, '= NEM PENSAR ❌', COR.bad]]} /> },
  { a: GBF.s - 0.2, b: FIM.s + 0.2, draw: (t) => <StageBah t={t} a={GBF.s - 0.15} word="BAH…" cena="triste" curve="down" vs={GBF.s} ve={GBF.e} flips={[[GBF.e - 0.05, '= QUE PENA 😞', COR.warn]]} /> },
  { a: T_COMENTA - 0.1, b: 99, draw: (t) => <StageTitleSerra t={t} at={T_COMENTA} kicker="COMENTA 👇 A TUA CIDADE" title="A MAIS CURTIDA É O PRÓXIMO VÍDEO" /> },
];
const CUTS = CARDS.map((c) => c.a).filter((a) => a > 0);

const LEXPR: [number, Expr][] = [[0, 'delight'], [1.4, 'talk'], [4.7, 'smile'], [7.4, 'talk'], [T_CAPAZ + 0.4, 'wink'], [T_CAPAZ + 1.0, 'talk'],
  [B1.s - 0.1, 'delight'], [B2.s - 0.1, 'sad'], [B3.s - 0.1, 'angry'], [B4.s - 0.1, 'squint'], [B5.s - 0.1, 'laugh'], [GB.s - 0.2, 'smile'], [L10.s, 'laugh'], [T_SERIO + 0.5, 'talk'],
  [SELO - 0.3, 'delight'], [SELO + 1.5, 'smile'], [L12.s, 'talk'], [G13.s, 'smile'], [CZ.s - 0.1, 'shock'], [G15.s + 0.3, 'squint'], [G15.s + 1.2, 'laugh'], [G16.s, 'smile'],
  [BC.s - 0.1, 'stern'], [GBF.s + 0.2, 'smile'], [FIM.s, 'laugh'], [T_AGORA, 'talk'], [FIM.e - 0.6, 'wink'], [FIM.e + 0.2, 'smile']];
const LARM: [number, ArmPose][] = [[0, 'wave'], [2.6, 'down'], [7.6, 'pointUp'], [T_BAH, 'pointSide'], [B1.s - 0.4, 'down'],
  [B1.s - 0.1, 'pointSide'], [EX[0].s, 'pointUp'], [B2.s - 0.1, 'down'], [EX[1].s + 0.6, 'pointSide'], [B3.s - 0.1, 'wag'], [EX[2].s + 1.2, 'pointUp'], [B4.s - 0.1, 'down'], [EX[3].s + 0.6, 'pointSide'], [B5.s - 0.1, 'hold'], [EX[4].s + 0.6, 'pointUp'], [GB.s, 'down'], [T_RAPIDO, 'thumbsUp'], [L10.e, 'down'],
  [L12.s + 0.2, 'pointSide'], [T_SE + 0.2, 'pointUp'], [L12.e, 'down'], [G15.s + 0.4, 'pointUp'], [G16.s, 'down'], [BC.s - 0.1, 'wag'], [BC.e + 0.4, 'down'],
  [FIM.s, 'thumbsUp'], [T_AGORA, 'pointSide'], [T_QUAL, 'pointUp'], [FIM.e - 0.6, 'down']];
const GEXPR: [number, GuriaExpr][] = [[0, 'smile'], [5.0, 'talk'], [7.2, 'smile'], [B1.s, 'shock'], [B2.s, 'sad'], [B3.s, 'shock'], [B4.s, 'pout'], [B5.s, 'laugh'],
  [GB.s, 'talk'], [GB.e, 'smile'], [T_SERIO, 'laugh'], [L10.e, 'smile'], [SELO, 'shock'], [SELO + 1.0, 'laugh'], [G11.s, 'talk'], [G11.e, 'smile'],
  [G13.s, 'smug'], [G13.e, 'smile'], [CZ.s, 'smug'], [G15.s, 'laugh'], [G16.s, 'smug'], [BC.s, 'shock'], [GBF.s, 'pout'], [FIM.s + 1, 'smile'], [FIM.s + 1.6, 'laugh'], [FIM.s + 2.8, 'smile']];
const GARMS: [number, GuriaArms][] = [[0, 'down'], [5.0, 'cross'], [7.2, 'down'], [B5.s, 'cheer'], [B5.e + 0.2, 'down'], [GB.s, 'hips'], [GB.e + 0.4, 'down'],
  [G11.s, 'count'], [G11.e, 'down'], [G13.s, 'present'], [G13.e, 'down'], [G15.s, 'shrug'], [G15.e, 'down'], [G16.s, 'present'], [BC.s, 'down'], [GBF.s, 'cross'],
  [FIM.s + 1.0, 'down'], [T_COMENTA, 'cheer'], [T_COMENTA + 1.7, 'skirt'], [T_A, 'down'], [FIM.e - 0.4, 'cheer']];

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
  ['pop', T_BAH, 0.3], ['pop', T_CAPAZ, 0.3], ['riser', T_ENT - 0.2, 0.15],
  ['plim', B1.e - 0.2, 0.3], ['ding', QD[0], 0.22], ['toin', B2.e - 0.1, 0.25], ['ding', QD[1], 0.2], ['erro', B3.s, 0.22], ['ding', QD[2], 0.2], ['boing', B4.e - 0.1, 0.22], ['ding', QD[3], 0.2], ['aplauso', B5.s, 0.15], ['ding', QD[4], 0.22],
  ['boing', GB.s + 0.2, 0.18], ['ding', T_SERIO, 0.25],
  ['patinhas', SELO - 1.4, 0.3], ['latido', SELO - 0.05, 0.4], ['carimbo', SELO, 0.5], ['whoosh', SELO + 1.5, 0.22], ['patinhas', SELO + 1.6, 0.25],
  ['pop', T_CONSEGUE, 0.22], ['pop', T_DEPENDE, 0.22], ['chuva', T_SE + 0.3, 0.1], ['ding', T_PORQUE, 0.22],
  ['latido', G13.e - 0.6, 0.2], ['scratch', CZ.s, 0.3], ['ding', CZ.e - 0.1, 0.2], ['boing', G15.s, 0.2],
  ['tictac', G16.s + 0.7, 0.12], ['buzina', BC.s, 0.22], ['toin', GBF.s, 0.25],
  ['aplauso', FIM.s, 0.15], ['ding', T_COMENTA, 0.28], ['plim', T_QUAL, 0.25], ['aplauso', FIM.e - 0.6, 0.2], ['latido', FIM.e - 0.3, 0.3],
];

export const Video08: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const card = CARDS.find((c) => t >= c.a && t < c.b);
  const lastCut = CUTS.filter((c) => c <= t).pop() ?? -1;
  const flash = lastCut > 0 && t - lastCut < 0.08 ? 1 - (t - lastCut) / 0.08 : 0;
  const lx = lauroX(t), gx = guriaX(t);
  const lHop = jump(t, 0.05, 0.4, 70) + jump(t, B1.s, 0.4, 90) + jump(t, B5.s, 0.35, 60) + jump(t, CZ.s, 0.35, 80) + jump(t, FIM.e - 0.6, 0.4, 90);
  const gHop = jump(t, GB.s, 0.35, 90) + jump(t, SELO, 0.35, 110) + jump(t, G15.s, 0.35, 90) + jump(t, T_COMENTA, 0.4, 100) + jump(t, FIM.e - 0.4, 0.4, 100);
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
          {t > T_COMENTA && t < T_COMENTA + 3.1 && <ConfettiC t={t} start={T_COMENTA} colors={['#2E7D32', '#C62828', MUST, '#fff']} />}
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
              cuiaRaise={t > FIM.e - 0.6 && t < DURATION_08 - 0.2 ? kf(t, [[FIM.e - 0.6, 0], [FIM.e - 0.2, 1]]) : 0} />
          </g>
          <g transform={`translate(${gx},${GROUND}) scale(${-GS},${GS})`}>
            <Guria t={t} talk={talkG(t)} expr={pick(t, GEXPR, 'smile')} arms={pick(t, GARMS, 'down')} walk={guriaWalk(t)} hop={gHop / GS} gaze={quem(t) === 'L' ? 1 : 0.4}
              tilt={quem(t) === 'G' ? Math.sin(t * 3) * 5 : t > GBF.s && t < FIM.s ? 8 : 0} />
          </g>
        </Cam>
      </svg>
      <HUD num="#008" cat="🗣️ JEITO GAÚCHO" />
      <BigText t={t} start={0} end={1.4} lines={['BAH, TU', 'SABIA?']} y={380} size={110} />
      <Chip t={t} a={1.8} b={4.6} text="🗣️ A MESMA PALAVRA, OUTRO SENTIDO" />
      <Chip t={t} a={T_ENT} b={B1.s - 0.2} text="🎵 ENTONAÇÃO = O JEITO DE FALAR" kind="warn" />
      <Chip t={t} a={T_RESTO} b={T_DEPENDE - 0.1} text="🇧🇷 NO RESTO DO BRASIL: QUE CONSEGUE" />
      <Chip t={t} a={G13.s + 0.6} b={CZ.s - 0.3} text="🎩 O CUSCO COMEU O CHAPÉU?" kind="warn" />
      <Chip t={t} a={G15.s + 0.2} b={G15.e + 0.2} text="😜 ERA PEGADINHA!" kind="good" />
      <Chip t={t} a={T_QUAL - 0.2} b={T_A} text="🗣️ E QUAL BAH TU MAIS USA?" kind="warn" />
      <Chip t={t} a={T_A} b={DURATION_08} text="🏆 A CIDADE MAIS CURTIDA VENCE" kind="warn" />
      <SeloCusco t={t} at={SELO} num="#008" tema="BAH E CAPAZ" cy={860} />
      <Captions t={t} hidden={t < 0.05 || (t > SELO && t < SELO + 1.9)} words={WORDS} y={1545} />
      {flash > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash * 0.8})` }} />}
      {t > DURATION_08 - 0.5 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - DURATION_08 + 0.5) / 0.5)})` }} />}
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
