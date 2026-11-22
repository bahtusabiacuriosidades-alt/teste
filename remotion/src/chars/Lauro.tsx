import React from 'react';
import { MUST } from '../lib';

export type Expr = 'talk' | 'shock' | 'laugh' | 'smile' | 'squint' | 'stern' | 'angry' | 'wink' | 'delight';
export type ArmPose = 'down' | 'wave' | 'hold' | 'pointUp' | 'thumbsUp' | 'wag' | 'pointSide' | 'pointDown';
export type HeldObj = 'none' | 'brigadeiro' | 'bergamota' | 'roll';

const SKIN = '#D9A070';
const SKIN_D = '#C98F62';
const SHIRT = '#F2EEE6';
const VEST = '#4A2E1F';

const POSES: Record<ArmPose, [number, number]> = {
  down: [8, 0],
  wave: [-150, 0],
  hold: [-20, 160],
  pointUp: [-158, 0],
  thumbsUp: [-30, 160],
  wag: [-15, 178],
  pointSide: [-92, 0],
  pointDown: [-28, -18],
};
const FINGER: Record<ArmPose, 'none' | 'point' | 'thumb'> = {
  down: 'none', wave: 'none', hold: 'none', pointUp: 'point', thumbsUp: 'thumb',
  wag: 'point', pointSide: 'point', pointDown: 'point',
};

export const Obj: React.FC<{ kind: HeldObj }> = ({ kind }) => {
  if (kind === 'brigadeiro')
    return (
      <g>
        <path d="M-46,10 L-34,52 L34,52 L46,10 Z" fill="#B23A2E" />
        <circle cx={0} cy={0} r={42} fill="#3B2314" />
        {[[-20, -18], [12, -26], [22, 4], [-8, 14], [-26, 6], [4, -6], [30, -12]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={10} height={4} rx={2} fill="#2a170c" transform={`rotate(${i * 40} ${x} ${y})`} />
        ))}
      </g>
    );
  if (kind === 'bergamota')
    return (
      <g>
        <circle cx={0} cy={0} r={58} fill="#F28C28" />
        <circle cx={-18} cy={-18} r={16} fill="rgba(255,255,255,.25)" />
        <path d="M0,-56 q20,-30 46,-22 q-14,24 -46,22" fill="#4E8B3A" />
      </g>
    );
  if (kind === 'roll')
    return (
      <g>
        <ellipse cx={0} cy={0} rx={70} ry={42} fill="#C98A3A" />
        <ellipse cx={-6} cy={-10} rx={50} ry={22} fill="#E2A957" />
        <path d="M-30,-14 l18,20 M0,-20 l18,20 M26,-16 l14,16" stroke="#8A5420" strokeWidth={6} strokeLinecap="round" />
      </g>
    );
  return null;
};

export const Lauro: React.FC<{
  t: number;
  talk: number;
  expr?: Expr;
  arm?: ArmPose;
  armWobble?: number;
  obj?: HeldObj;
  objLift?: number;
  cuiaRaise?: number;
  full?: boolean;
  tilt?: number;
  browBoost?: number;
}> = ({ t, talk, expr = 'talk', arm = 'down', armWobble = 0, obj = 'none', objLift = 0, cuiaRaise = 0, full = false, tilt = 0, browBoost = 0 }) => {
  const [a1, a2base] = POSES[arm];
  const a2 = a2base + armWobble;
  const o = Math.max(0, Math.min(1, talk));
  const blink = t % 3.7 > 3.58 ? 0.1 : 1;
  const wide = expr === 'shock' ? 1.18 : 1;

  // ---------- eyes ----------
  const eye = (ex: number, closed: boolean, squint = false) =>
    closed ? (
      <path d={`M${ex - 40},905 A40,40 0 0 1 ${ex + 40},905`} stroke="#2B1A0E" strokeWidth={12} strokeLinecap="round" fill="none" />
    ) : (
      <g>
        <ellipse cx={ex} cy={890} rx={46 * wide} ry={56 * wide * blink * (squint ? 0.42 : 1)} fill="#fff" />
        <ellipse cx={ex + 4} cy={895} rx={26 * wide} ry={28 * wide * blink * (squint ? 0.5 : 1)} fill="#5A3A1E" />
        <ellipse cx={ex + 4} cy={895} rx={12 * wide} ry={13 * wide * blink * (squint ? 0.5 : 1)} fill="#1a0f08" />
        {blink > 0.5 && !squint && <circle cx={ex + 14} cy={884} r={7} fill="#fff" />}
      </g>
    );
  const closedBoth = expr === 'laugh' || expr === 'delight';
  const eyes = (
    <g>
      {eye(460, closedBoth, expr === 'squint')}
      {eye(620, closedBoth || expr === 'wink', false)}
    </g>
  );

  // ---------- brows ----------
  let by = 0, rotL = -7, rotR = 7, byR = 0;
  if (expr === 'shock') by = -40;
  if (expr === 'laugh' || expr === 'delight' || expr === 'smile') by = -22;
  if (expr === 'squint') { by = 10; byR = -36; rotL = 10; rotR = -4; }
  if (expr === 'stern') { by = 4; rotL = 14; rotR = -14; byR = -18; }
  if (expr === 'angry') { by = 14; rotL = 18; rotR = -18; }
  if (expr === 'wink') { by = -14; byR = 12; }
  by += browBoost;

  // ---------- mouth ----------
  let mouth: React.ReactNode;
  if (expr === 'laugh' || expr === 'smile' || expr === 'delight' || expr === 'wink') {
    const d = (expr === 'smile' || expr === 'wink' ? 26 : 40) + 70 * o;
    mouth = (
      <g>
        <path d={`M468,1050 Q540,${1050 + d} 612,1050 Z`} fill="#5A1A1A" />
        <path d={`M478,1052 Q540,${1052 + Math.min(d, 24)} 602,1052 Z`} fill="#fff" />
      </g>
    );
  } else if (expr === 'stern' || expr === 'squint') {
    mouth = <path d={`M495,${1062 - 6 * o} Q545,${1050 + 30 * o} 595,${1048 - 4 * o}`} stroke="#5A1A1A" strokeWidth={14 + 16 * o} strokeLinecap="round" fill="none" />;
  } else {
    const sh = expr === 'shock' ? 18 : 0;
    mouth = (
      <g>
        <ellipse cx={540} cy={1062} rx={26 + 22 * o + sh} ry={8 + 54 * o + sh * 0.8} fill="#5A1A1A" />
        <ellipse cx={540} cy={1074 + 30 * o} rx={18 + 10 * o} ry={4 + 14 * o} fill="#C25A5A" />
      </g>
    );
  }

  // ---------- left arm (viewer right) ----------
  const fing = FINGER[arm];
  const leftArm = (
    <g transform={`translate(840,1290) rotate(${a1})`}>
      <rect x={-40} y={-20} width={80} height={250} rx={40} fill={SHIRT} />
      <rect x={-43} y={200} width={86} height={36} rx={14} fill="#E3DDD2" />
      <g transform={`translate(0,225) rotate(${a2})`}>
        <rect x={-36} y={0} width={72} height={180} rx={34} fill={SKIN_D} />
        <ellipse cx={0} cy={205} rx={50} ry={54} fill={SKIN} />
        {fing === 'point' && <rect x={-13} y={230} width={26} height={80} rx={13} fill={SKIN} />}
        {fing === 'thumb' && <rect x={-18} y={225} width={36} height={70} rx={18} fill={SKIN} />}
        {obj !== 'none' && (
          <g transform={`translate(0,${250 + objLift}) rotate(${-(a1 + a2)})`}>
            <Obj kind={obj} />
          </g>
        )}
      </g>
    </g>
  );

  // ---------- right arm + cuia (viewer left) ----------
  const cx = 360, cy = 1440;
  const steam = [0, 1, 2].map((k) => {
    const ph = (t * 0.9 + k * 0.33) % 1;
    const sx = cx - 30 + k * 30, sy = cy - 110 - ph * 160;
    return <path key={k} d={`M${sx},${sy} C${sx + 25},${sy - 30} ${sx - 25},${sy - 60} ${sx},${sy - 90}`} stroke="#fff" strokeOpacity={0.55 * (1 - ph)} strokeWidth={7} fill="none" strokeLinecap="round" />;
  });
  const rightArm = (
    <g transform={`rotate(${-40 * cuiaRaise} 230 1290)`}>
      <rect x={175} y={1260} width={110} height={250} rx={50} fill={SHIRT} />
      <rect x={185} y={1440} width={95} height={40} rx={14} fill="#E3DDD2" />
      <g transform="translate(250,1470) rotate(-31.5)">
        <rect x={-42} y={-10} width={84} height={190} rx={40} fill={SKIN_D} />
      </g>
      <line x1={cx + 10} y1={cy - 60} x2={cx + 70} y2={cy - 250} stroke="#C9CCD1" strokeWidth={12} strokeLinecap="round" />
      <ellipse cx={cx + 72} cy={cy - 256} rx={10} ry={8} fill="#C8A74A" />
      <ellipse cx={cx} cy={cy} rx={92} ry={110} fill="#5C3A21" />
      <ellipse cx={cx - 30} cy={cy - 20} rx={22} ry={50} fill="rgba(255,255,255,.12)" />
      <ellipse cx={cx} cy={cy - 92} rx={78} ry={22} fill="#C9CCD1" />
      <ellipse cx={cx} cy={cy - 92} rx={64} ry={14} fill="#6E8B3D" />
      {[-60, -40, -20, 0, 20, 40, 60].map((i) => (
        <line key={i} x1={cx + i} y1={cy - 100} x2={cx + i * 0.9} y2={cy - 80} stroke="#9EA3AA" strokeWidth={4} />
      ))}
      <ellipse cx={cx + 70} cy={cy + 20} rx={58} ry={52} fill={SKIN} />
      {steam}
    </g>
  );

  return (
    <g>
      {/* lower body (full shots) */}
      {full && (
        <g>
          <path d="M215,1830 Q110,2220 255,2520 L470,2560 L540,2120 L610,2560 L825,2520 Q970,2220 865,1830 Z" fill="#5B5F63" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <path d={`M${190 + i * 6},${1990 + i * 70} l24,-14 l-16,34`} stroke="#474B4F" strokeWidth={6} fill="none" />
              <path d={`M${890 - i * 6},${1990 + i * 70} l-24,-14 l16,34`} stroke="#474B4F" strokeWidth={6} fill="none" />
            </g>
          ))}
          <rect x={250} y={2490} width={210} height={250} rx={30} fill="#1A1714" />
          <rect x={620} y={2490} width={210} height={250} rx={30} fill="#1A1714" />
          <ellipse cx={330} cy={2740} rx={130} ry={34} fill="#1A1714" />
          <ellipse cx={750} cy={2740} rx={130} ry={34} fill="#1A1714" />
        </g>
      )}
      {/* torso */}
      <path d="M150,1950 L230,1270 Q540,1150 850,1270 L930,1950 Z" fill={SHIRT} />
      <path d="M150,1950 L230,1270 Q360,1215 445,1230 L470,1950 Z" fill={VEST} />
      <path d="M930,1950 L850,1270 Q720,1215 635,1230 L610,1950 Z" fill={VEST} />
      {full && (
        <g>
          <rect x={180} y={1750} width={720} height={95} rx={10} fill="#2A2420" />
          <rect x={250} y={1768} width={90} height={60} rx={8} fill="#3A322C" />
          <rect x={740} y={1768} width={90} height={60} rx={8} fill="#3A322C" />
          <circle cx={540} cy={1798} r={42} fill="#C9CCD1" />
          <circle cx={540} cy={1798} r={26} fill="#AEB2B8" />
        </g>
      )}
      <rect x={470} y={1080} width={140} height={150} rx={40} fill={SKIN_D} />
      {/* lenço */}
      <path d="M400,1180 Q540,1250 680,1180 L640,1235 Q540,1290 440,1235 Z" fill={MUST} />
      <path d="M520,1250 L470,1390 L535,1340 Z" fill="#C48D17" />
      <path d="M560,1250 L615,1385 L548,1338 Z" fill="#C48D17" />
      <ellipse cx={540} cy={1255} rx={38} ry={32} fill="#E5B03A" />
      {leftArm}
      {rightArm}
      {/* head */}
      <g transform={`rotate(${tilt} 540 900)`}>
        <ellipse cx={330} cy={930} rx={40} ry={60} fill={SKIN_D} />
        <ellipse cx={750} cy={930} rx={40} ry={60} fill={SKIN_D} />
        <ellipse cx={540} cy={900} rx={215} ry={240} fill={SKIN} />
        <ellipse cx={540} cy={1010} rx={200} ry={130} fill="url(#stubble)" />
        <ellipse cx={430} cy={990} rx={40} ry={24} fill="rgba(230,110,90,.35)" />
        <ellipse cx={650} cy={990} rx={40} ry={24} fill="rgba(230,110,90,.35)" />
        {eyes}
        <rect x={393} y={799 + by} width={124} height={32} rx={16} fill="#3B2414" transform={`rotate(${rotL} 455 ${815 + by})`} />
        <rect x={563} y={799 + by + byR} width={124} height={32} rx={16} fill="#3B2414" transform={`rotate(${rotR} 625 ${815 + by + byR})`} />
        <ellipse cx={540} cy={960} rx={40} ry={46} fill="#C98458" />
        {mouth}
        <path d="M540,1010 C470,985 400,1000 385,1060 C420,1045 470,1045 540,1035 C610,1045 660,1045 695,1060 C680,1000 610,985 540,1010 Z" fill="#5A3A22" />
        <path d="M345,720 Q330,1000 540,1140 Q750,1000 735,720" stroke="#6B4226" strokeWidth={7} fill="none" />
        <rect x={375} y={560} width={330} height={170} rx={40} fill="#1E1B18" />
        <rect x={375} y={690} width={330} height={30} fill="#3a332c" />
        <ellipse cx={540} cy={725} rx={330} ry={58} fill="#1E1B18" />
        <ellipse cx={540} cy={712} rx={300} ry={30} fill="#2A2622" />
      </g>
    </g>
  );
};

export const LauroDefs = () => (
  <defs>
    <linearGradient id="stubble" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="rgba(90,60,40,0)" />
      <stop offset="1" stopColor="rgba(90,60,40,.28)" />
    </linearGradient>
  </defs>
);
