import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import './fonts';
import { FPS, MUST, kf, easeOut, clamp, pop, makeVoice, Word } from './lib';
import { Lauro, LauroDefs } from './chars/Lauro';
import { CuscoSit, CuscoDefs } from './chars/Others';
import { GalpaoBG, Fogao, Chaleira, ErvaPack, CuiaIcon, CuiaCut, Thermo, MapScene, Confetti } from './scenes/Mate';
import { HUD, BigText, Stamp, Captions } from './ui/Overlays';
import rms02 from './data/v02/rms.json';
import words02 from './data/v02/words.json';

export const DURATION_02 = 81.0;
const talk = makeVoice(rms02 as number[]);
const WORDS02 = words02 as Word[];
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';

/* ---------------- helpers ---------------- */
const Place: React.FC<{ x: number; y: number; s: number; children: React.ReactNode }> = ({ x, y, s, children }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>{children}</g>
);
const Cam: React.FC<{ z?: number; cx?: number; cy?: number; dx?: number; dy?: number; children: React.ReactNode }> = ({ z = 1, cx = 540, cy = 1000, dx = 0, dy = 0, children }) => (
  <g transform={`translate(${dx},${dy}) translate(${cx},${cy}) scale(${z}) translate(${-cx},${-cy})`}>{children}</g>
);
const jump = (t: number, at: number, dur: number, h: number) => (t > at && t < at + dur ? Math.sin((Math.PI * (t - at)) / dur) * h : 0);
const shake = (t: number, a: number, b: number, amp: number) =>
  t > a && t < b ? { dx: Math.sin(t * 140) * amp * (1 - (t - a) / (b - a)), dy: Math.cos(t * 120) * amp * 0.6 * (1 - (t - a) / (b - a)) } : { dx: 0, dy: 0 };
const drop = (t: number, at: number) => {
  // falls from above and bounces
  const x = (t - at) / 0.45;
  if (x <= 0) return { y: -1400, o: 0 };
  if (x >= 1) return { y: 0, o: 1 };
  const y = x < 0.7 ? -1400 * (1 - easeOut(x / 0.7)) : -Math.sin(((x - 0.7) / 0.3) * Math.PI) * 50;
  return { y, o: 1 };
};

const TableFG: React.FC = () => (
  <g>
    <rect x={-20} y={1560} width={1120} height={400} fill="#6B4423" />
    <rect x={-20} y={1560} width={1120} height={36} fill="#8A5A34" />
    {[1640, 1740, 1840].map((y) => <line key={y} x1={0} x2={1080} y1={y} y2={y} stroke="rgba(30,15,5,.35)" strokeWidth={4} />)}
  </g>
);
const Dim: React.FC<{ a?: number }> = ({ a = 0.55 }) => <rect width={1080} height={1920} fill={`rgba(20,12,6,${a})`} />;
const LauroAt: React.FC<{ t: number; x: number; y?: number; s?: number } & Partial<React.ComponentProps<typeof Lauro>>> = ({ t, x, y = 1880, s = 0.66, ...rest }) => (
  <Place x={x} y={y} s={s}><Lauro t={t} talk={talk(t)} {...rest} /></Place>
);

/* ---------------- scenes ---------------- */
type Scene = { a: number; b: number; draw: (t: number, lt: number) => React.ReactNode };

const cut = (t: number, p: Partial<React.ComponentProps<typeof CuiaCut>>, rot = 0, s = 1) => (
  <g transform={`translate(540,1020) rotate(${rot}) scale(${s})`}>
    <CuiaCut t={t} {...p} />
  </g>
);

const SCENES: Scene[] = [
  // 1 — hook: boiling kettle
  { a: 0, b: 5.9, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1.0], [5.9, 1.08]])} cy={1000} {...shake(t, 0, 0.3, 10)}>
      <GalpaoBG />
      <g transform="translate(830,1600)"><Fogao t={t} /></g>
      <g transform="translate(800,1160)"><Chaleira t={t} steam={1} shake={0.6} /></g>
      <LauroAt t={t} x={420} expr="shock" hop={jump(lt, 0.02, 0.4, 120)} lean={kf(lt, [[2, 0], [3, 4]])} arm={lt > 2 ? 'pointSide' : 'down'} />
      <TableFG />
    </Cam>
  ) },
  // 2 — items drop on the table
  { a: 5.9, b: 9.8, draw: (t) => {
    const c = drop(t, 7.1), e = drop(t, 7.75), k = drop(t, 8.9);
    return (
      <Cam z={1.0}>
        <GalpaoBG />
        <Dim a={0.35} />
        <rect x={-20} y={1300} width={1120} height={660} fill="#7A4E2A" />
        <rect x={-20} y={1300} width={1120} height={40} fill="#9A6A40" />
        {[1420, 1560, 1700, 1840].map((y) => <line key={y} x1={0} x2={1080} y1={y} y2={y} stroke="rgba(30,15,5,.3)" strokeWidth={4} />)}
        <g transform={`translate(250,${1260 + c.y})`} opacity={c.o}><g transform="scale(0.9)"><CuiaIcon /></g></g>
        <g transform={`translate(560,${1180 + e.y})`} opacity={e.o}><g transform="scale(1.15)"><ErvaPack /></g></g>
        <g transform={`translate(840,${1380 + k.y})`} opacity={k.o}><g transform="scale(1.25)"><Chaleira t={t} /></g></g>
      </Cam>
    );
  } },
  // 3 — friends arrive in 10 minutes
  { a: 9.8, b: 14.5, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1.0], [4.7, 1.05]])} cy={1100}>
      <GalpaoBG door={kf(t, [[9.9, 0], [10.5, 1]])} friends={kf(t, [[10.0, 0], [11.0, 1]])} />
      <g transform="translate(860,1600)"><Fogao t={t} /></g>
      <LauroAt t={t} x={600} expr={t < 11.6 ? 'shock' : 'squint'} tilt={-6} lean={t < 11.6 ? 0 : -3} />
      <TableFG />
    </Cam>
  ) },
  // 4 — PASSO 1: fill 2/3 with erva
  { a: 14.5, b: 17.4, draw: (t) => (
    <>
      <GalpaoBG /><Dim />
      {cut(t, { fill: kf(t, [[15.2, 0], [16.9, 0.67]]), guide: kf(t, [[15.9, 0], [16.3, 1]]) })}
      {t > 15.1 && t < 17.0 && Array.from({ length: 26 }).map((_, i) => {
        const ph = (t * 1.6 + i * 0.038) % 1;
        return <rect key={i} x={460 + ((i * 37) % 160)} y={300 + ph * 520} width={12} height={6} fill={i % 2 ? '#6E8B3D' : '#9BB56A'} transform={`rotate(${i * 30} ${460 + ((i * 37) % 160)} ${300 + ph * 520})`} />;
      })}
    </>
  ) },
  // 5 — the dust problem
  { a: 17.4, b: 20.0, draw: (t) => (
    <>
      <GalpaoBG /><Dim />
      {cut(t, { fill: 0.67, dust: kf(t, [[17.6, 0], [18.4, 1]]) })}
    </>
  ) },
  // 6 — cover, flip and shake
  { a: 20.0, b: 25.9, draw: (t) => {
    const rot = kf(t, [[21.7, 0], [22.3, 180], [23.8, 180], [24.5, 0]]) + (t > 22.3 && t < 23.8 ? Math.sin(t * 38) * 9 : 0);
    const hand = clamp((t - 21.1) / 0.3) * (t < 24.6 ? 1 : 0);
    const stuck = t > 23.0 && t < 24.6;
    return (
      <>
        <GalpaoBG /><Dim />
        <g transform={`translate(540,1020) rotate(${rot})`}>
          <CuiaCut t={t} fill={0.67} />
          {hand > 0 && (
            <g transform="translate(0,-300)" opacity={hand}>
              {[-150, -75, 0, 75].map((x, i) => <rect key={i} x={x - 30} y={-110 - (i === 1 || i === 2 ? 20 : 0)} width={60} height={120} rx={30} fill="#D29A70" />)}
              <rect x={150} y={-60} width={60} height={110} rx={30} fill="#C98F62" transform="rotate(-40 180 0)" />
              <ellipse cx={0} cy={10} rx={240} ry={56} fill="url(#lSkin)" />
              {stuck && Array.from({ length: 18 }).map((_, i) => <circle key={i} cx={-200 + i * 24} cy={-10 + (i % 3) * 14} r={6} fill="#88A651" />)}
            </g>
          )}
        </g>
        {t > 22.3 && t < 24.0 && Array.from({ length: 20 }).map((_, i) => {
          const ph = (t * 1.3 + i * 0.05) % 1;
          const x = 300 + ((i * 41) % 480);
          return <circle key={i} cx={x} cy={1340 + ph * 380} r={7 + (i % 3) * 3} fill="#9BB56A" opacity={0.7 * (1 - ph)} />;
        })}
      </>
    );
  } },
  // 7 — PASSO 2: tilt → morrinho
  { a: 25.9, b: 29.2, draw: (t) => (
    <>
      <GalpaoBG /><Dim />
      {cut(t, { fill: 0.67, slope: kf(t, [[26.6, 0], [28.6, 1]]) }, kf(t, [[26.2, 0], [27.4, -28], [28.8, -12]]))}
    </>
  ) },
  // 8 — the secret of the morrinho
  { a: 29.2, b: 33.2, draw: (t) => (
    <>
      <GalpaoBG /><Dim />
      <Cam z={kf(t, [[29.2, 1.0], [33.2, 1.12]])} cx={420} cy={900}>
        {cut(t, { fill: 0.67, slope: 1 }, -12)}
        {t > 29.9 && (
          <g transform={`translate(250,560) scale(${pop(t, 29.9)}) rotate(${Math.sin(t * 4) * 4})`}>
            <path d="M0,0 L60,140 L20,130 L30,230 L-30,230 L-20,130 L-60,140 Z" fill={MUST} stroke="#1E1B18" strokeWidth={8} transform="rotate(180 0 115)" />
          </g>
        )}
      </Cam>
    </>
  ) },
  // 9 — hot water burns the dry erva
  { a: 33.2, b: 37.5, draw: (t) => (
    <>
      <GalpaoBG /><Dim />
      <g transform={`translate(${shake(t, 36.7, 37.2, 18).dx},0)`}>
        {cut(t, { fill: 0.67, slope: 1, pour: kf(t, [[34.0, 0], [34.3, 1], [36.4, 1], [36.6, 0]]), pourColor: 'rgba(235,240,255,.9)', burnt: kf(t, [[35.6, 0], [36.8, 1]]) }, -12)}
        {t > 34.2 && t < 37.5 && [0, 1, 2, 3, 4].map((k) => {
          const ph = (t * 0.9 + k * 0.2) % 1;
          return <circle key={k} cx={560 + k * 40 + Math.sin(t * 4 + k) * 20} cy={700 - ph * 300} r={26 + ph * 40} fill="#fff" opacity={0.45 * (1 - ph)} />;
        })}
      </g>
      {t > 36.7 && t < 37.5 && <rect width={1080} height={1920} fill={`rgba(229,57,53,${0.35 * (1 - (t - 36.7) / 0.8)})`} />}
    </>
  ) },
  // 10 — PASSO 3: warm water first (rewind effect at the start)
  { a: 37.5, b: 42.0, draw: (t) => {
    const rew = t < 37.9;
    return (
      <>
        <g filter={rew ? 'url(#desat2)' : undefined}>
          <GalpaoBG /><Dim />
          {cut(t, { fill: 0.67, slope: 1, burnt: rew ? 1 - (t - 37.5) / 0.4 : 0, pour: kf(t, [[38.0, 0], [38.3, 1], [39.7, 1], [39.9, 0]]), water: kf(t, [[38.6, 0], [40.8, 1]]) }, -12)}
        </g>
        {rew && (
          <g>
            {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={0} y={i * 160 + ((t * 2000) % 160)} width={1080} height={6} fill="rgba(255,255,255,.25)" />)}
            <text x={540} y={1000} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={200} fill="#fff" opacity={0.85}>◀◀</text>
          </g>
        )}
      </>
    );
  } },
  // 11 — PASSO 4: the bomba
  { a: 42.0, b: 48.5, draw: (t) => (
    <>
      <GalpaoBG /><Dim />
      {cut(t, { fill: 0.67, slope: 1, water: 1, bomba: kf(t, [[43.2, 0], [45.4, 1]]) }, -12)}
      {t > 46.9 && (
        <g transform={`translate(800,560) scale(${pop(t, 46.9)})`}>
          <rect x={-60} y={-20} width={120} height={100} rx={18} fill={MUST} stroke="#1E1B18" strokeWidth={8} />
          <path d="M-36,-20 L-36,-60 A36,36 0 0 1 36,-60 L36,-20" stroke="#1E1B18" strokeWidth={14} fill="none" />
          <circle cx={0} cy={30} r={12} fill="#1E1B18" />
        </g>
      )}
    </>
  ) },
  // 12 — PASSO 5: water temperature
  { a: 48.5, b: 55.3, draw: (t, lt) => {
    const temp = kf(t, [[48.6, 25], [49.7, 98], [50.7, 98], [51.9, 62], [54.06, 72], [54.5, 76]]);
    return (
      <Cam z={kf(lt, [[0, 1.0], [6.8, 1.06]])} cy={1100}>
        <GalpaoBG />
        <g transform="translate(720,1600)"><Fogao t={t} /></g>
        <g transform="translate(690,1160)"><Chaleira t={t} steam={kf(t, [[48.6, 1], [50.7, 1], [51.5, 0.5]])} shake={t > 51.8 && t < 53.6 ? 1 : 0} /></g>
        <LauroAt t={t} x={280} s={0.6} expr={t < 51.8 ? 'stern' : 'smile'} arm="pointSide" armWobble={Math.sin(t * 5) * 5} />
        <TableFG />
        <g transform="translate(985,1260) scale(0.62)"><Thermo temp={temp} good={t > 53.9} /></g>
      </Cam>
    );
  } },
  // 13 — REVEAL (music break)
  { a: 55.3, b: 57.2, draw: (t, lt) => (
    <>
      <GalpaoBG /><Dim a={0.65} />
      <g transform={`translate(540,1050) rotate(${t * 20})`}>
        {Array.from({ length: 16 }).map((_, i) => <path key={i} d="M0,0 L-60,-1200 L60,-1200 Z" fill="rgba(217,160,33,.22)" transform={`rotate(${i * 22.5})`} />)}
      </g>
      <g transform={`translate(540,1150) scale(${1.4 * pop(t, 55.4, 0.3)}) rotate(${Math.sin(t * 3) * 6})`}><CuiaIcon steam={1} t={t} /></g>
    </>
  ) },
  // 14 — history map
  { a: 57.2, b: 71.4, draw: (t) => (
    <Cam z={kf(t, [[57.2, 1.08], [62, 1.18], [66.5, 1.18], [70.2, 1.9]])} cx={550} cy={1040} dx={kf(t, [[66.5, 0], [70.2, 332]])} dy={kf(t, [[66.5, 0], [70.2, 278]])}>
      <MapScene t={t}
        guaranis={kf(t, [[59.3, 0], [60.0, 1]])}
        reducoes={kf(t, [[63.2, 0], [64.6, 1]])}
        ruins={kf(t, [[67.3, 0], [67.9, 1]])}
        pin={pop(t, 69.6)}
        zoom={1} />
    </Cam>
  ) },
  // 15 — parabéns!
  { a: 71.4, b: 75.2, draw: (t, lt) => (
    <Cam z={1.0} cy={1100}>
      <GalpaoBG door={1} friends={1} />
      <LauroAt t={t} x={560} y={1800} s={0.56} expr="delight" cuiaRaise={kf(lt, [[0, 0], [0.4, 1]])} hop={jump(t, 71.45, 0.4, 120)} />
      <g transform={`translate(${kf(t, [[72.6, 1200], [73.2, 840]])},${1830 - jump(t, 73.2, 0.45, 160)}) scale(0.75)`}><CuscoSit t={t} chew={false} tiltHead={10} /></g>
      <Confetti t={t} start={71.45} />
    </Cam>
  ) },
  // 16 — CTA
  { a: 75.2, b: 81.1, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1.0], [5.8, 1.08]])} cy={1300}>
      <GalpaoBG door={1} friends={1} />
      <LauroAt t={t} x={540} y={1800} s={0.56} expr={t > 77.3 ? 'wink' : 'laugh'} arm="pointDown" armWobble={Math.sin(t * 7) * 8} hop={jump(t, 77.3, 0.3, 40)} />
      <g transform="translate(840,1830) scale(0.75)"><CuscoSit t={t} chew={false} tiltHead={Math.sin(t * 2) * 12} /></g>
    </Cam>
  ) },
];

const CUTS = SCENES.map((s) => s.a).filter((a) => a > 0);

/* ---------------- overlays ---------------- */
const Chip: React.FC<{ t: number; a: number; b: number; text: string; kind: 'bad' | 'good' | 'warn' | 'info'; y?: number }> = ({ t, a, b, text, kind, y = 430 }) => {
  if (t < a || t > b) return null;
  const bg = { bad: '#C62828', good: '#2E7D32', warn: MUST, info: 'rgba(20,16,12,.9)' }[kind];
  const fg = kind === 'warn' ? '#1E1B18' : '#fff';
  const fs = text.length > 28 ? 36 : 46;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: clamp((b - t) / 0.15) }}>
      <div style={{ transform: `scale(${pop(t, a)})`, background: bg, color: fg, borderRadius: 40, padding: '16px 30px', fontFamily: FONT, fontWeight: 900, fontSize: fs, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(0,0,0,.35)', border: '4px solid rgba(255,255,255,.85)' }}>{text}</div>
    </div>
  );
};

const STEPS: [number, number, number][] = [[14.6, 25.95, 1], [26.0, 37.5, 2], [37.5, 42.0, 3], [42.0, 48.55, 4], [48.6, 55.3, 5]];
const StepChip: React.FC<{ t: number }> = ({ t }) => {
  const s = STEPS.find(([a, b]) => t >= a && t < b);
  if (!s) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center' }}>
      <div style={{ transform: `scale(${pop(t, s[0])})`, background: 'rgba(20,16,12,.88)', borderRadius: 16, padding: '10px 24px', fontFamily: FONT, fontWeight: 900, fontSize: 36, color: '#fff', border: `3px solid ${MUST}` }}>
        🧉 CEVANDO O MATE · <span style={{ color: MUST }}>PASSO {s[2]}/5</span>
      </div>
    </div>
  );
};

const MATO: [number, number][] = [[11.6, 0], [22.9, 0], [23.2, 20], [29.9, 20], [30.2, 40], [36.6, 40], [36.85, 25], [40.9, 25], [41.3, 60], [46.1, 60], [46.4, 80], [54.5, 80], [54.9, 100]];
const Matometro: React.FC<{ t: number }> = ({ t }) => {
  if (t < 11.6 || (t > 57.2 && t < 71.4)) return null;
  const v = kf(t, MATO);
  const col = v >= 100 ? '#34C759' : t > 36.7 && t < 37.6 ? '#E53935' : MUST;
  const glow = v >= 100 ? `0 0 ${20 + Math.sin(t * 8) * 10}px rgba(52,199,89,.9)` : '0 8px 20px rgba(0,0,0,.3)';
  return (
    <div style={{ position: 'absolute', right: 40, top: 150, width: 330, transform: `scale(${pop(t, 11.6)})`, transformOrigin: 'top right', background: 'rgba(20,16,12,.85)', borderRadius: 18, padding: '12px 16px', fontFamily: FONT, boxShadow: glow }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 900, fontSize: 26 }}>
        <span>🧉 MATÔMETRO</span><span style={{ color: col }}>{Math.round(v)}%</span>
      </div>
      <div style={{ marginTop: 8, height: 22, background: 'rgba(255,255,255,.15)', borderRadius: 11, overflow: 'hidden' }}>
        <div style={{ width: `${v}%`, height: '100%', background: col, borderRadius: 11 }} />
      </div>
    </div>
  );
};

const SFX: [string, number, number][] = [
  ['plim', 0.0, 0.35], ['fervura', 0.1, 0.3], ['erro', 1.95, 0.3],
  ...CUTS.filter((c) => ![57.2, 55.3].includes(c)).map((c) => ['whoosh', c - 0.12, 0.22] as [string, number, number]),
  ['toin', 7.5, 0.35], ['toin', 8.15, 0.35], ['toin', 9.3, 0.35],
  ['tictac', 10.6, 0.4],
  ['chocalho', 15.2, 0.3],
  ['whoosh', 17.7, 0.25], ['erro', 18.1, 0.3],
  ['chocalho', 22.3, 0.5], ['acerto', 22.95, 0.3],
  ['whoosh', 26.4, 0.25], ['acerto', 30.0, 0.3],
  ['agua', 34.0, 0.4], ['erro', 36.74, 0.4], ['fervura', 34.2, 0.2],
  ['scratch', 37.45, 0.3], ['agua', 38.0, 0.4], ['acerto', 39.15, 0.3],
  ['whoosh', 43.2, 0.25], ['pop', 45.4, 0.3], ['carimbo', 46.9, 0.45],
  ['fervura', 48.7, 0.3], ['erro', 49.7, 0.35], ['apito', 51.85, 0.32], ['acerto', 54.45, 0.35],
  ['carimbo', 55.6, 0.45], ['ding', 55.65, 0.3],
  ['whoosh', 57.1, 0.3], ['pop', 59.5, 0.3], ['pop', 63.4, 0.3], ['pop', 63.8, 0.25], ['pop', 64.2, 0.25], ['ding', 67.4, 0.25], ['pop', 69.65, 0.35],
  ['pop', 71.45, 0.35], ['aplauso', 71.6, 0.4], ['latido', 73.1, 0.5], ['carimbo', 74.2, 0.45],
  ['ding', 75.35, 0.25],
];

export const Video02: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sc = SCENES.find((s) => t >= s.a && t < s.b) ?? SCENES[SCENES.length - 1];
  const lt = t - sc.a;
  const lastCut = CUTS.filter((c) => c <= t).pop() ?? -1;
  const flash = lastCut > 0 && ![55.3, 37.5].includes(lastCut) && t - lastCut < 0.1 ? 1 - (t - lastCut) / 0.1 : 0;
  const hideCaps = (t > 55.3 && t < 57.2) || t < 0.05;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
        <LauroDefs />
        <CuscoDefs />
        <defs>
          <filter id="desat2"><feColorMatrix type="saturate" values="0.1" /></filter>
        </defs>
        {sc.draw(t, lt)}
      </svg>

      <HUD num="#002" cat="🧉 CULTURA" />
      <Matometro t={t} />
      <StepChip t={t} />
      <BigText t={t} start={0} end={1.5} lines={['BAH, TU', 'SABIA?']} y={330} size={120} />
      <Chip t={t} a={1.95} b={5.9} text="❌ ÁGUA FERVENDO" kind="bad" />
      <Chip t={t} a={9.95} b={14.5} text={`⏱️ AMIGOS EM ${Math.max(0, 10 - Math.floor((t - 9.95) * 2))} MIN`} kind="warn" />
      <Chip t={t} a={18.1} b={20.0} text="❌ PÓ ENTOPE A BOMBA" kind="bad" />
      <Chip t={t} a={22.95} b={25.9} text="✅ SACODE COM A MÃO" kind="good" />
      <Chip t={t} a={30.0} b={33.2} text="✅ O MORRINHO" kind="good" />
      <Chip t={t} a={36.74} b={37.5} text="❌ ERVA QUEIMADA" kind="bad" />
      <Chip t={t} a={39.15} b={42.0} text="✅ ÁGUA MORNA PRIMEIRO" kind="good" />
      <Chip t={t} a={46.9} b={48.5} text="⚠️ NÃO MEXE NA BOMBA" kind="warn" />
      <Chip t={t} a={49.65} b={51.8} text="❌ NADA DE FERVURA" kind="bad" />
      <Chip t={t} a={54.45} b={55.3} text="✅ 70–80 °C" kind="good" />
      <BigText t={t} start={55.6} end={57.2} lines={['CEVAR', 'O MATE']} y={330} size={130} />
      <Chip t={t} a={59.5} b={63.3} text="🌿 GUARANIS" kind="info" y={330} />
      <Chip t={t} a={63.4} b={67.3} text="✝️ REDUÇÕES JESUÍTICAS" kind="info" y={330} />
      <Chip t={t} a={67.4} b={69.6} text="🏛️ AS RUÍNAS" kind="info" y={330} />
      <Chip t={t} a={69.65} b={71.4} text="📍 SÃO MIGUEL DAS MISSÕES · RS" kind="warn" y={330} />
      <BigText t={t} start={71.5} end={75.2} lines={['PARABÉNS,', 'TCHÊ! 🎉']} y={330} size={100} rot={-3} />
      <Stamp t={t} start={74.2} end={75.2} text="🐕 O CUSCO APROVOU" x={330} y={720} />
      <Chip t={t} a={75.35} b={81.1} text="MANDA PRO AMIGO QUE FERVE A ÁGUA 🔥" kind="warn" y={430} />
      <Captions t={t} hidden={hideCaps} words={WORDS02} />

      {flash > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash})` }} />}
      {t > 80.55 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - 80.55) / 0.45)})` }} />}

      <Audio src={staticFile('audio/video02_voz.mp3')} />
      <Audio src={staticFile('audio/video02_musica.mp3')} />
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={Math.round(5.5 * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
