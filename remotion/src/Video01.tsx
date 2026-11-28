import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import './fonts';
import { FPS, MUST, kf, easeOut, clamp, lauroTalk, clerkTalk, pop } from './lib';
import { Lauro, LauroDefs } from './chars/Lauro';
import { CuscoRun, CuscoSit, Clerk, CuscoDefs, ClerkDefs } from './chars/Others';
import {
  BakeryBG, CounterFG, SPBakeryBG, BasketClose, PartyBG, PartyTableFG, BackyardBG,
  StreetBG, TrafficLight, Car, Xis, Plate, LancheriaBG, StorefrontBG,
} from './scenes/Backgrounds';
import { HUD, TPill, Tag, BigText, Phrase, Stamp, Captions } from './ui/Overlays';


export const DURATION_S = 89.17;

const Place: React.FC<{ x: number; y: number; s: number; children: React.ReactNode }> = ({ x, y, s, children }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>{children}</g>
);
const Cam: React.FC<{ z?: number; cx?: number; cy?: number; dx?: number; dy?: number; children: React.ReactNode }> = ({ z = 1, cx = 540, cy = 1000, dx = 0, dy = 0, children }) => (
  <g transform={`translate(${dx},${dy}) translate(${cx},${cy}) scale(${z}) translate(${-cx},${-cy})`}>{children}</g>
);
const shake = (t: number, a: number, b: number, amp: number) =>
  t > a && t < b ? { dx: Math.sin(t * 140) * amp * (1 - (t - a) / (b - a)), dy: Math.cos(t * 120) * amp * 0.6 * (1 - (t - a) / (b - a)) } : { dx: 0, dy: 0 };

type Scene = { a: number; b: number; draw: (t: number, lt: number) => React.ReactNode };

// Lauro is placed by his feet: <Place x y s> → (x,y) = feet position, s = scale.
// Standard "behind the counter" shot: feet (540,1880) at 0.66 → face center ≈ y 870.
const FACE_Y = 1880 - 1530 * 0.66;

const suspense = (t: number, lt: number) => (
  <>
    <Cam z={kf(lt, [[0, 2.3], [3.8, 2.75]])} cy={FACE_Y}>
      <BakeryBG />
      <Place x={540} y={1880} s={0.66}>
        <Lauro t={t} talk={lauroTalk(t)} expr="squint" />
      </Place>
      <CounterFG />
    </Cam>
    <rect width={1080} height={1920} fill="url(#vig)" />
  </>
);

/** jump arc: 0 → h → 0 between `at` and `at+dur` */
const jump = (t: number, at: number, dur: number, h: number) => (t > at && t < at + dur ? Math.sin((Math.PI * (t - at)) / dur) * h : 0);
/** 1 while the keyframed position is changing (drives the walk cycle) */
const walking = (t: number, keys: [number, number][]) => (Math.abs(kf(t + 0.04, keys) - kf(t - 0.04, keys)) > 0.6 ? 1 : 0);

// xis growth: small on the plate, grows on "do tamanho de um prato" (≈ 43.3–44.3 s)
const xisScale = (t: number) => {
  const base = kf(t, [[43.3, 0.34], [44.3, 1.0]]);
  const wob = t > 44.3 && t < 44.8 ? Math.sin(((t - 44.3) / 0.5) * Math.PI * 2) * 0.05 * (1 - (t - 44.3) / 0.5) : 0;
  return base + wob;
};
const PLATE_Y = 1615;

const SCENES: Scene[] = [
  // 1 — hook: jumps in surprise and steps toward the camera
  { a: 0, b: 3.9, draw: (t, lt) => {
    const s = shake(t, 0, 0.3, 12);
    const sc = kf(lt, [[0.4, 0.64], [2.0, 0.69]]);
    return (
      <Cam z={kf(lt, [[0, 1.0], [3.9, 1.1]])} cy={FACE_Y} {...s}>
        <BakeryBG />
        <Place x={540} y={1880} s={sc}>
          <Lauro t={t} talk={lauroTalk(t)} expr="shock" hop={jump(lt, 0.02, 0.4, 130)} walk={lt > 0.4 && lt < 2.0 ? 0.6 : 0} browBoost={-6 * (1 - easeOut(lt / 0.3))} />
        </Place>
        <CounterFG />
      </Cam>
    );
  } },
  // 2 — São Paulo clerk (female)
  { a: 3.9, b: 8.6, draw: (t, lt) => {
    const s = shake(t, 6.6, 6.9, 18);
    const punch = t > 7.7 ? 0.12 * (1 - easeOut((t - 7.7) / 0.25)) + 0.06 : 0;
    return (
      <Cam z={1.0 + 0.05 * (lt / 4.7) + punch} cy={880} {...s}>
        <SPBakeryBG />
        <Place x={kf(lt, [[0, 600], [1.2, 540]])} y={1900 - jump(t, 6.6, 0.3, 40)} s={0.68}>
          <Clerk t={t} lt={lt} talk={clerkTalk(t)} />
        </Place>
        <rect x={-20} y={1290} width={1120} height={700} fill="#9AA4AA" />
        <rect x={-20} y={1290} width={1120} height={40} fill="#C4CCD0" />
        <rect x={60} y={1360} width={960} height={220} rx={10} fill="rgba(210,235,250,.35)" />
        {[0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx={150 + i * 156} cy={1500} rx={60} ry={34} fill="#C98A3A" />)}
        {[[6.6, 800, 740], [7.7, 270, 680]].map(([tq, x, y]) =>
          t > tq ? (
            <g key={tq} transform={`translate(${x},${y}) scale(${pop(t, tq)}) rotate(${Math.sin(t * 6) * 9})`}>
              <text textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={150} fill="#fff" stroke="#1a1a1a" strokeWidth={14} paintOrder="stroke">?</text>
            </g>
          ) : null,
        )}
      </Cam>
    );
  } },
  // 3a — laughs (bouncing), then walks a few steps while talking
  { a: 8.6, b: 13.4, draw: (t, lt) => {
    const X: [number, number][] = [[1.8, 540], [3.2, 680]];
    return (
      <Cam z={1.04} cy={FACE_Y}>
        <BakeryBG />
        <Place x={kf(lt, X)} y={1880} s={0.66}>
          <Lauro t={t} talk={lauroTalk(t)} expr={lt < 1.6 ? 'laugh' : 'talk'} hop={lt < 1.6 ? Math.abs(Math.sin(t * 12)) * 24 : 0} lean={lt < 1.6 ? -3 : 0} walk={walking(lt, X)} tilt={lt < 1.6 ? -4 : 0} />
        </Place>
        <CounterFG />
      </Cam>
    );
  } },
  // 3b — "te aprochega": walks back to the center and closer to the camera
  { a: 13.4, b: 16.2, draw: (t, lt) => {
    const X: [number, number][] = [[0, 680], [1.2, 540]];
    return (
      <Cam z={1.06} cy={FACE_Y + 150}>
        <BakeryBG />
        <Place x={kf(lt, X)} y={1880} s={kf(lt, [[0, 0.66], [1.2, 0.71]])}>
          <Lauro t={t} talk={lauroTalk(t)} expr="smile" arm="wave" armWobble={Math.sin(t * 10) * 28} walk={walking(lt, X)} lean={-2} />
        </Place>
        <CounterFG />
      </Cam>
    );
  } },
  // 4 — cacetinho (insert)
  { a: 16.2, b: 21.9, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1.0], [5.7, 1.1]])}>
      <BasketClose t={t} lift={kf(lt, [[0.2, 0], [1.4, 1]])} />
    </Cam>
  ) },
  // 5 — negrinho: walks in from the left and shows the brigadeiro
  { a: 21.9, b: 26.8, draw: (t, lt) => {
    const X: [number, number][] = [[0, 150], [1.3, 540]];
    return (
      <Cam z={kf(lt, [[0, 1], [4.9, 1.06]])} cy={900}>
        <PartyBG />
        <Place x={kf(lt, X)} y={1880} s={0.64}>
          <Lauro t={t} talk={lauroTalk(t)} expr={lt < 1.6 ? 'delight' : 'smile'} arm="hold" obj="brigadeiro" walk={walking(lt, X)} hop={jump(lt, 1.4, 0.35, 50)} objLift={kf(lt, [[1.3, 30], [1.8, 0]])} />
        </Place>
        <PartyTableFG />
      </Cam>
    );
  } },
  // 6 — bergamota: walks from the tree, stops, tosses it (33.7)
  { a: 26.8, b: 34.7, draw: (t, lt) => {
    const toss = t > 33.7 && t < 34.35 ? -Math.sin((Math.PI * (t - 33.7)) / 0.65) * 320 : 0;
    const X: [number, number][] = [[0, 780], [2.0, 420], [4.4, 420], [5.0, 360]];
    return (
      <Cam z={t < 31.9 ? 1 : 1.12} cy={1100}>
        <BackyardBG />
        <Place x={kf(lt, X)} y={1770} s={0.52}>
          <Lauro t={t} talk={lauroTalk(t)} expr={t < 31.9 ? 'talk' : 'smile'} arm="hold" obj="bergamota" objLift={toss} walk={walking(lt, X)} hop={jump(t, 33.68, 0.3, 40)} browBoost={-4} />
        </Place>
      </Cam>
    );
  } },
  // 7 — sinaleira: walks along the sidewalk to the traffic light and points
  { a: 34.7, b: 38.4, draw: (t, lt) => {
    const X: [number, number][] = [[0, 250], [1.6, 600]];
    return (
      <Cam z={kf(lt, [[0, 1.1], [3.7, 1.16]])} cx={600} cy={1420}>
        <StreetBG />
        <g transform="translate(330,1400) scale(1.25)"><Car color="#3B82C4" /></g>
        <g transform="translate(860,1880)"><TrafficLight light={t < 37.6 ? 'red' : 'green'} /></g>
        <Place x={kf(lt, X)} y={1880} s={0.3}>
          <Lauro t={t} talk={lauroTalk(t)} expr="talk" arm={lt < 1.6 ? 'down' : 'pointUp'} walk={walking(lt, X)} />
        </Place>
      </Cam>
    );
  } },
  // 8a — xis: small on the plate, grows on "do tamanho de um prato"
  { a: 38.4, b: 44.9, draw: (t, lt) => {
    const xs = xisScale(t);
    const grown = t > 43.3;
    return (
      <Cam z={kf(t, [[38.4, 1.15], [43.2, 1.15], [44.4, 1.0]])} cy={800}>
        <LancheriaBG />
        <Place x={540} y={1850} s={0.6}>
          <Lauro t={t} talk={lauroTalk(t)} expr={grown ? 'shock' : 'talk'} lean={grown ? kf(t, [[43.3, 0], [43.6, 5]]) : -2} hop={jump(t, 43.35, 0.4, 150)} arm={grown ? 'down' : 'pointDown'} />
        </Place>
        <rect x={-20} y={1530} width={1120} height={420} fill="#C2463A" />
        <rect x={-20} y={1530} width={1120} height={36} fill="#E35B4D" />
        <g transform={`translate(540,${PLATE_Y})`}><Plate /></g>
        <g transform={`translate(540,${PLATE_Y - 118 * xs}) scale(${xs})`}><Xis plate={false} /></g>
        {t > 43.3 && t < 44.6 && [0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2, r = 380 + (t - 43.3) * 260;
          return <line key={i} x1={540 + Math.cos(a) * (r - 60)} y1={1480 + Math.sin(a) * (r - 60) * 0.6} x2={540 + Math.cos(a) * r} y2={1480 + Math.sin(a) * r * 0.6} stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={1 - (t - 43.3) / 1.3} />;
        })}
      </Cam>
    );
  } },
  // 8b — xis close-up
  { a: 44.9, b: 49.4, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1], [4.5, 1.08]])}>
      <LancheriaBG />
      <g transform="translate(540,1180)"><g transform="scale(2.3)"><Plate /></g></g>
      <g transform="translate(540,1080) scale(2.3)"><Xis plate={false} /></g>
    </Cam>
  ) },
  // 9 — tri: jumps on every "tri"
  { a: 49.4, b: 54.6, draw: (t) => {
    const h = [51.6, 52.26, 53.14, 53.96].reduce((acc, at) => acc + jump(t, at - 0.05, 0.32, 70), 0);
    return (
      <Cam z={1.03} cy={1000}>
        <LancheriaBG />
        <Place x={540} y={1880} s={0.62}>
          <Lauro t={t} talk={lauroTalk(t)} expr="delight" arm="thumbsUp" armWobble={Math.sin(t * 8) * 6} hop={h} lean={Math.sin(t * 4) * 2} />
        </Place>
        <rect x={-20} y={1530} width={1120} height={420} fill="#C2463A" />
        <rect x={-20} y={1530} width={1120} height={36} fill="#E35B4D" />
        <g transform={`translate(540,${PLATE_Y + 80})`}><g transform="scale(0.75)"><Plate /></g></g>
        <g transform={`translate(540,${PLATE_Y + 80 - 118 * 0.7}) scale(0.7)`}><Xis plate={false} /></g>
      </Cam>
    );
  } },
  // 10 — capaz: shakes "no", side-steps
  { a: 54.6, b: 62.6, draw: (t, lt) => {
    const X: [number, number][] = [[1.6, 540], [2.6, 430], [4.6, 430], [5.6, 560]];
    return (
      <Cam z={t < 59 ? 1.0 : 1.1} cy={FACE_Y + 120}>
        <BakeryBG />
        <Place x={kf(lt, X)} y={1880} s={0.66}>
          <Lauro t={t} talk={lauroTalk(t)} expr="stern" arm="wag" armWobble={Math.sin(t * 13) * 16} tilt={Math.sin(t * 13) * 3} walk={walking(lt, X)} lean={Math.sin(t * 6.5) * 2} />
        </Place>
        <CounterFG />
      </Cam>
    );
  } },
  // 11 — suspense
  { a: 62.6, b: 66.4, draw: (t, lt) => suspense(t, lt) },
  // 12 — PECHADA freeze (music break)
  { a: 66.4, b: 68.3, draw: () => <g filter="url(#desat)">{suspense(66.39, 66.39 - 62.6)}</g> },
  // 13 — pechada: cars crash, Lauro jumps back startled, then laughs
  { a: 68.3, b: 74.5, draw: (t, lt) => {
    const bx = kf(t, [[68.3, 60], [68.5, 372], [68.75, 340]]);
    const hit = t > 68.5;
    const s = shake(t, 68.5, 68.9, 16);
    const X: [number, number][] = [[0.25, 200], [0.6, 130], [3.0, 130], [4.4, 230]];
    return (
      <Cam z={1.08} cx={540} cy={1500} {...s}>
        <StreetBG />
        <g transform="translate(960,1880)"><TrafficLight light="red" /></g>
        <g transform={`translate(860,${1450 + (hit && t < 68.9 ? Math.sin(t * 90) * 6 : 0)}) scale(1.45)`}><Car color="#B23A2E" dent={hit} /></g>
        <g transform={`translate(${bx},1460) scale(1.45)`}><Car color="#2F8F9D" /></g>
        {t > 68.5 && t < 69.1 && (
          <g transform={`translate(615,1390) scale(${pop(t, 68.5, 0.15)})`}>
            <path d="M0,-90 L22,-28 L88,-28 L35,10 L55,75 L0,35 L-55,75 L-35,10 L-88,-28 L-22,-28 Z" fill="#FFD43B" stroke="#1a1a1a" strokeWidth={8} />
          </g>
        )}
        <Place x={kf(lt, X)} y={1890} s={0.3}>
          <Lauro t={t} talk={lauroTalk(t)} expr={lt < 2.5 ? 'shock' : 'laugh'} arm="pointSide" armWobble={Math.sin(t * 6) * 4} hop={jump(t, 68.5, 0.4, 160) + (lt > 2.5 && lt < 3.0 ? Math.abs(Math.sin(t * 12)) * 30 : 0)} lean={lt < 2.5 ? kf(t, [[68.5, 0], [68.7, -6]]) : 0} walk={walking(lt, X) * 0.8} />
        </Place>
      </Cam>
    );
  } },
  // 14 — Cusco steals the cacetinho, Lauro chases
  { a: 74.5, b: 77.5, draw: (t, lt) => {
    const X: [number, number][] = [[0.6, 300], [2.8, 640]];
    return (
      <Cam z={1.0} cy={1000}>
        <BakeryBG />
        <Place x={kf(lt, X)} y={1880} s={0.62}>
          <Lauro t={t} talk={lauroTalk(t)} expr="angry" arm="pointSide" armWobble={Math.sin(t * 9) * 8} walk={walking(lt, X)} lean={walking(lt, X) * 4} />
        </Place>
        <CounterFG />
        <g transform={`translate(${kf(lt, [[0, 380], [0.8, 540], [2.95, 1180]])},1395) scale(0.95)`}>
          <CuscoRun t={t} />
        </g>
      </Cam>
    );
  } },
  // 15 — closing phrase: walks out of the bakery, raises the cuia
  { a: 77.5, b: 81.0, draw: (t, lt) => {
    const X: [number, number][] = [[0, 820], [1.3, 420]];
    return (
      <Cam z={kf(lt, [[0, 1.0], [3.5, 1.05]])} cy={1300}>
        <StorefrontBG />
        <Place x={kf(lt, X)} y={1810} s={0.55}>
          <Lauro t={t} talk={lauroTalk(t)} expr="smile" cuiaRaise={kf(lt, [[1.3, 0], [1.9, 1]])} walk={walking(lt, X)} />
        </Place>
        <g transform="translate(820,1820) scale(0.8)"><CuscoSit t={t} /></g>
      </Cam>
    );
  } },
  // 16 — CTA
  { a: 81.0, b: 89.2, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1.0], [6, 1.1]])} cy={1300}>
      <StorefrontBG />
      <Place x={kf(lt, [[0, 420], [1.2, 470]])} y={1810} s={kf(lt, [[0, 0.55], [1.2, 0.58]])}>
        <Lauro t={t} talk={lauroTalk(t)} expr={t > 85.9 ? 'wink' : 'smile'} arm="pointDown" armWobble={Math.sin(t * 7) * 8} walk={lt < 1.2 ? 0.7 : 0} hop={jump(t, 85.9, 0.3, 40)} />
      </Place>
      <g transform="translate(820,1820) scale(0.8)"><CuscoSit t={t} chew={false} tiltHead={Math.sin(t * 2) * 12} /></g>
    </Cam>
  ) },
];

const CUTS = SCENES.map((s) => s.a).filter((a) => a > 0);

const SFX: [string, number, number][] = [
  ['plim', 0.0, 0.35],
  ...CUTS.filter((c) => c !== 66.4 && c !== 44.9).map((c) => ['whoosh', c - 0.12, 0.26] as [string, number, number]),
  ...[14.0, 16.3, 22.0, 27.0, 34.9, 38.7, 59.2, 68.4, 82.1, 87.0].map((c) => ['ding', c, 0.22] as [string, number, number]),
  ['scratch', 6.33, 0.35],
  ['pop', 6.6, 0.3], ['pop', 7.7, 0.3],
  ['pop', 45.2, 0.3], ['pop', 45.9, 0.3], ['pop', 46.6, 0.3],
  ['pop', 51.6, 0.28], ['pop', 52.26, 0.28], ['pop', 53.14, 0.28], ['pop', 53.96, 0.28],
  ['boing', 33.7, 0.35],
  ['boing', 43.32, 0.45], ['whoosh', 43.4, 0.3], ['pop', 44.28, 0.35],
  ['toin', 68.5, 0.5], ['buzina', 68.75, 0.3],
  ['latido', 74.6, 0.55], ['patinhas', 74.95, 0.35],
  ['carimbo', 76.9, 0.45],
];

export const Video01: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sc = SCENES.find((s) => t >= s.a && t < s.b) ?? SCENES[SCENES.length - 1];
  const lt = t - sc.a;
  const lastCut = CUTS.filter((c) => c <= t).pop() ?? -1;
  const flash = lastCut > 0 && lastCut !== 66.4 && t - lastCut < 0.1 ? 1 - (t - lastCut) / 0.1 : 0;
  const hideCaps = (t > 66.4 && t < 68.3) || (t > 77.5 && t < 81.0) || t < 0.05;
  const tris = [51.6, 52.26, 53.14, 53.96];

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
        <LauroDefs />
        <CuscoDefs />
        <ClerkDefs />
        <defs>
          <filter id="desat"><feColorMatrix type="saturate" values="0.12" /></filter>
          <radialGradient id="vig" cx="50%" cy="48%" r="65%">
            <stop offset="0.55" stopColor="rgba(0,0,0,0)" />
            <stop offset="1" stopColor="rgba(0,0,0,.55)" />
          </radialGradient>
        </defs>
        {sc.draw(t, lt)}
      </svg>

      {/* overlays */}
      <HUD />
      <BigText t={t} start={0} end={1.5} lines={['BAH, TU', 'SABIA?']} y={330} size={120} />
      {t >= 3.9 && t < 8.6 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center' }}>
          <div style={{ transform: `scale(${pop(t, 3.9)})`, background: '#fff', color: '#B23A2E', borderRadius: 40, padding: '14px 32px', fontFamily: 'Montserrat, "Noto Color Emoji"', fontWeight: 900, fontSize: 44, boxShadow: '0 8px 20px rgba(0,0,0,.25)' }}>📍 SÃO PAULO</div>
        </div>
      )}
      <TPill t={t} start={14.0} end={16.2} k="TE APROCHEGA" v="CHEGA MAIS 👋" />
      <TPill t={t} start={16.3} end={21.9} k="CACETINHO" v="PÃO FRANCÊS 🥖" />
      <TPill t={t} start={22.0} end={26.8} k="NEGRINHO" v="BRIGADEIRO 🍫" />
      <TPill t={t} start={27.0} end={34.7} k="BERGAMOTA" v="TANGERINA / MEXERICA / PONCÃ 🍊" />
      <TPill t={t} start={34.9} end={38.4} k="SINALEIRA" v="SEMÁFORO 🚦" />
      <TPill t={t} start={38.7} end={44.9} k="XIS" v="SANDUÍCHE (GIGANTE) 🍔" />
      <Tag t={t} start={45.2} end={49.4} text="OVO" x={110} y={820} />
      <Tag t={t} start={45.9} end={49.4} text="MILHO" x={650} y={760} />
      <Tag t={t} start={46.6} end={49.4} text="ERVILHA" x={330} y={1200} />
      <TPill t={t} start={51.5} end={54.6} k="TRI" v="MUITO 👍" />
      {tris.map((tr) => <BigText key={tr} t={t} start={tr} end={tr + 0.55} lines={['TRI!']} y={980} size={150} rot={-6} />)}
      <TPill t={t} start={59.2} end={62.6} k="CAPAZ!" v="IMAGINA! / DE JEITO NENHUM 🙅" />
      <BigText t={t} start={66.4} end={68.3} lines={['PECHADA?']} y={760} size={170} shake={9} />
      <TPill t={t} start={68.4} end={74.5} k="PECHADA" v="BATIDA DE CARRO 🚗" />
      <Stamp t={t} start={76.9} end={77.5} text="🐕 O CUSCO APROVOU" x={330} y={640} />
      <Phrase t={t} start={77.5} end={81.0} y={430} lines={[{ text: 'Aqui a gente não fala errado, tchê.', at: 77.64 }, { text: 'A gente fala gaúcho.', at: 79.62 }]} />
      <TPill t={t} start={82.1} end={89.2} k="COMO CHAMA" v="NA TUA CIDADE? 👇" sep=" " />
      {t >= 87.0 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center' }}>
          <div style={{ transform: `scale(${pop(t, 87.0)})`, background: MUST, color: '#1E1B18', borderRadius: 40, padding: '16px 36px', fontFamily: 'Montserrat, "Noto Color Emoji"', fontWeight: 900, fontSize: 50, boxShadow: '0 8px 20px rgba(0,0,0,.3)' }}>SEGUE PRA MAIS BAH! 🧉</div>
        </div>
      )}
      <Captions t={t} hidden={hideCaps} y={(t >= 34.7 && t < 38.4) || (t >= 68.3 && t < 74.5) ? 960 : 1405} />

      {flash > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash})` }} />}
      {t > 88.7 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - 88.7) / 0.45)})` }} />}

      {/* audio */}
      <Audio src={staticFile('audio/video01_voz_normalizada.mp3')} />
      <Audio src={staticFile('audio/video01_musica_alinhada.mp3')} />
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={45} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
