import React from 'react';
import { easeOut } from '../lib';

/* ======================= CUSCO (semi-realistic) ======================= */
const CAR = '#C68642';

export const CuscoDefs = () => (
  <defs>
    <linearGradient id="cFur" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#D69A55" />
      <stop offset="0.55" stopColor="#C68642" />
      <stop offset="1" stopColor="#A86D33" />
    </linearGradient>
    <radialGradient id="cHead" cx="40%" cy="35%" r="70%">
      <stop offset="0" stopColor="#DCA35F" />
      <stop offset="1" stopColor="#B8783A" />
    </radialGradient>
    <linearGradient id="cMust" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#E9B53A" />
      <stop offset="1" stopColor="#B9860F" />
    </linearGradient>
  </defs>
);

const Heart: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <path transform={`translate(${x},${y}) scale(${s}) rotate(14)`} d="M0,10 C-25,-15 -50,10 0,45 C50,10 25,-15 0,10 Z" fill="#F4EFE6" />
);

const Leg: React.FC<{ x: number; y: number; hip: number; knee: number; front?: boolean; far?: boolean }> = ({ x, y, hip, knee, front, far }) => (
  <g transform={`translate(${x},${y}) rotate(${hip})`} opacity={far ? 0.85 : 1}>
    <rect x={-20} y={-10} width={40} height={front ? 70 : 80} rx={20} fill={far ? '#A86D33' : 'url(#cFur)'} />
    <g transform={`translate(0,${front ? 58 : 66}) rotate(${knee})`}>
      <rect x={-12} y={0} width={24} height={front ? 72 : 66} rx={12} fill={far ? '#A86D33' : CAR} />
      <ellipse cx={6} cy={front ? 72 : 66} rx={18} ry={10} fill={far ? '#8A5A2B' : '#B8783A'} />
    </g>
  </g>
);

/** Cusco side view, facing right, running (local origin ≈ body center) */
export const CuscoRun: React.FC<{ t: number; bread?: boolean }> = ({ t, bread = true }) => {
  const p = t * 16;
  const s1 = Math.sin(p) * 34, s2 = Math.sin(p + Math.PI) * 34;
  const bob = -Math.abs(Math.sin(p)) * 12;
  return (
    <g transform={`translate(0,${bob})`}>
      <Leg x={-110} y={10} hip={s2} knee={Math.max(0, -s2) * 0.8} far />
      <Leg x={95} y={10} hip={s1} knee={Math.max(0, s1) * -0.6} front far />
      <path d="M-160,-20 C-215,-40 -232,-110 -196,-140 C-176,-156 -160,-140 -172,-118" stroke="#B8783A" strokeWidth={22} fill="none" strokeLinecap="round" transform={`rotate(${Math.sin(t * 26) * 10} -160 -20)`} />
      <path d="M-175,-10 C-180,-70 -125,-95 -40,-92 C40,-90 110,-104 152,-84 C188,-64 194,-10 166,26 C132,56 82,42 40,36 C-20,30 -82,42 -132,36 C-164,30 -172,16 -175,-10 Z" fill="url(#cFur)" />
      <path d="M-120,-80 C-60,-95 40,-92 120,-96" stroke="rgba(255,230,190,.35)" strokeWidth={8} fill="none" strokeLinecap="round" />
      <Leg x={-120} y={14} hip={s1} knee={Math.max(0, -s1) * 0.8} />
      <Leg x={110} y={14} hip={s2} knee={Math.max(0, s2) * -0.6} front />
      <Heart x={150} y={-6} s={0.75} />
      <path d="M118,-78 C140,-40 170,-24 196,-40 L168,30 Z" fill="url(#cMust)" />
      {/* head */}
      <g transform={`translate(196,-112) rotate(${Math.sin(p) * 3})`}>
        <path d="M-34,-40 L-24,-128 L12,-52 Z" fill="#B8783A" />
        <path d="M-30,-48 L-22,-110 L2,-56 Z" fill="#8A5A2B" opacity={0.5} />
        <ellipse cx={0} cy={0} rx={62} ry={56} fill="url(#cHead)" />
        <path d="M30,-10 C70,-16 112,-4 118,14 C120,30 96,40 60,40 C40,40 30,30 26,20 Z" fill="#C98A4A" />
        <path d="M78,-6 C100,-6 116,4 118,14 C112,26 96,30 80,28 Z" fill="#8A5A2B" />
        <ellipse cx={116} cy={8} rx={11} ry={9} fill="#151515" />
        <circle cx={119} cy={5} r={3} fill="rgba(255,255,255,.4)" />
        <path d="M26,24 C50,34 80,36 104,28" stroke="#5a3a1e" strokeWidth={3} fill="none" />
        <ellipse cx={20} cy={-18} rx={11} ry={9} fill="#3a220f" />
        <circle cx={23} cy={-21} r={3.5} fill="#fff" />
        <path d="M8,-28 q12,-8 24,0" stroke="#7a4e22" strokeWidth={3} fill="none" />
        <path d="M18,-46 C46,-60 70,-50 72,-16 C58,-26 40,-34 22,-34 Z" fill="#A86D33" transform={`rotate(${Math.sin(p) * 8} 18 -46)`} />
        {bread && (
          <g transform="translate(92,44) rotate(-6)">
            <ellipse cx={0} cy={0} rx={48} ry={24} fill="#C98A3A" />
            <ellipse cx={-5} cy={-6} rx={34} ry={12} fill="#E2A957" />
            <path d="M-16,-8 l10,10 M2,-12 l10,10" stroke="#8A5420" strokeWidth={3} />
          </g>
        )}
      </g>
    </g>
  );
};

/** Cusco sitting, front view (origin ≈ paws on the ground) */
export const CuscoSit: React.FC<{ t: number; chew?: boolean; tiltHead?: number }> = ({ t, chew = true, tiltHead = 0 }) => {
  const jaw = chew ? Math.abs(Math.sin(t * 9)) * 7 : 0;
  const wag = Math.sin(t * 14) * 22;
  return (
    <g>
      <ellipse cx={0} cy={6} rx={170} ry={26} fill="rgba(0,0,0,.2)" />
      <path d="M80,-40 C150,-60 170,-130 140,-160" stroke="#B8783A" strokeWidth={22} fill="none" strokeLinecap="round" transform={`rotate(${wag} 80 -40)`} />
      <ellipse cx={-80} cy={-50} rx={70} ry={58} fill="#B07338" />
      <ellipse cx={80} cy={-50} rx={70} ry={58} fill="#B07338" />
      <path d="M-100,-20 C-120,-140 -90,-250 0,-262 C90,-250 120,-140 100,-20 Z" fill="url(#cFur)" />
      <rect x={-58} y={-150} width={40} height={150} rx={20} fill={CAR} />
      <rect x={18} y={-150} width={40} height={150} rx={20} fill={CAR} />
      <ellipse cx={-36} cy={-4} rx={30} ry={13} fill="#B8783A" />
      <ellipse cx={40} cy={-4} rx={30} ry={13} fill="#B8783A" />
      <path d="M-46,-8 v-10 M-36,-6 v-12 M30,-8 v-10 M42,-6 v-12" stroke="#8A5A2B" strokeWidth={3} />
      <Heart x={0} y={-200} s={1.05} />
      <path d="M-78,-262 C-30,-230 30,-230 78,-262 L0,-150 Z" fill="url(#cMust)" />
      <g transform={`rotate(${tiltHead} 0 -320)`}>
        <path d="M-74,-370 L-66,-470 L-24,-386 Z" fill="#B8783A" />
        <path d="M-66,-378 L-62,-446 L-36,-388 Z" fill="#8A5A2B" opacity={0.45} />
        <ellipse cx={0} cy={-330} rx={92} ry={84} fill="url(#cHead)" />
        <path d="M44,-388 C92,-410 124,-380 118,-318 C96,-340 74,-356 50,-362 Z" fill="#A86D33" />
        <ellipse cx={0} cy={-282} rx={50} ry={38} fill="#C98A4A" />
        <path d="M-30,-300 C-20,-262 20,-262 30,-300" fill="#8A5A2B" opacity={0.5} />
        <ellipse cx={0} cy={-300} rx={18} ry={13} fill="#151515" />
        <circle cx={-5} cy={-304} r={4} fill="rgba(255,255,255,.4)" />
        <path d="M0,-288 v14 M-16,-270 q16,10 32,0" stroke="#5a3a1e" strokeWidth={3} fill="none" />
        {[-34, 34].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={-346} rx={13} ry={11} fill="#3a220f" />
            <circle cx={x + 4} cy={-350} r={4} fill="#fff" />
            <path d={`M${x - 14},-360 q14,-9 28,0`} stroke="#7a4e22" strokeWidth={3} fill="none" />
          </g>
        ))}
        {chew && (
          <g transform={`translate(4,${-252 + jaw})`}>
            <ellipse cx={0} cy={0} rx={44} ry={20} fill="#C98A3A" />
            <ellipse cx={-5} cy={-6} rx={30} ry={10} fill="#E2A957" />
          </g>
        )}
      </g>
    </g>
  );
};

/* ======================= ATENDENTE (São Paulo) ======================= */
export const ClerkDefs = () => (
  <defs>
    <radialGradient id="kSkin" cx="40%" cy="35%" r="75%">
      <stop offset="0" stopColor="#F6D2B4" />
      <stop offset="0.65" stopColor="#E9B893" />
      <stop offset="1" stopColor="#D49C76" />
    </radialGradient>
    <linearGradient id="kHair" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#5B3A24" />
      <stop offset="1" stopColor="#2E1C10" />
    </linearGradient>
    <linearGradient id="kBlouse" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#7FA3C7" />
      <stop offset="0.5" stopColor="#A6C4E0" />
      <stop offset="1" stopColor="#7899BC" />
    </linearGradient>
    <linearGradient id="kApron" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#E4E4E4" />
      <stop offset="0.5" stopColor="#FFFFFF" />
      <stop offset="1" stopColor="#E0E0E0" />
    </linearGradient>
  </defs>
);

/** female bakery clerk, local coordinates: feet at (0,0) */
export const Clerk: React.FC<{ t: number; talk: number; lt: number }> = ({ t, talk, lt }) => {
  const m = Math.max(0, Math.min(1, talk));
  const tilt = 3 + 9 * easeOut(lt / 1.2) + (t > 6.6 && t < 6.9 ? Math.sin(t * 90) * 1.5 : 0);
  const blink = lt > 1.6 && lt < 1.75;
  const wide = t > 6.6 ? 1.3 : 1;
  const o = blink ? 0.08 : wide;
  const raise = 14 * easeOut(lt / 0.8);
  const ponyt = Math.sin(t * 3) * 4;
  const eye = (x: number) => {
    const y = -1540, h = 13 * o;
    return (
      <g key={x}>
        <path d={`M${x - 22},${y} C${x - 10},${y - h} ${x + 10},${y - h} ${x + 22},${y} C${x + 10},${y + h * 0.7} ${x - 10},${y + h * 0.7} ${x - 22},${y} Z`} fill="#FBF7F2" />
        <ellipse cx={x} cy={y - 1} rx={9} ry={Math.min(9, 11 * o)} fill="#4A3020" />
        <ellipse cx={x} cy={y - 1} rx={4.4} ry={Math.min(4.4, 5.5 * o)} fill="#120a05" />
        {o > 0.4 && <circle cx={x + 3} cy={y - 4} r={2.5} fill="#fff" />}
        <path d={`M${x - 24},${y + 1} C${x - 10},${y - h - 3} ${x + 10},${y - h - 3} ${x + 25},${y - 2}`} stroke="#1a0f08" strokeWidth={4.5} fill="none" strokeLinecap="round" />
        <path d={`M${x + 20},${y - 6} l9,-6 M${x + 15},${y - 10} l6,-8`} stroke="#1a0f08" strokeWidth={2.5} strokeLinecap="round" />
      </g>
    );
  };
  return (
    <g>
      {/* ponytail (behind) */}
      <path d={`M60,-1600 C140,-1560 150,-1440 ${120 + ponyt},-1330 C110,-1300 80,-1310 90,-1350 C110,-1440 100,-1520 40,-1570 Z`} fill="url(#kHair)" />
      {/* body */}
      <path d="M-180,-1300 C-200,-1180 -185,-1000 -170,-880 L170,-880 C185,-1000 200,-1180 180,-1300 C120,-1335 -120,-1335 -180,-1300 Z" fill="url(#kBlouse)" />
      <path d="M-110,-1240 L-120,-880 L120,-880 L110,-1240 Z" fill="url(#kApron)" />
      <path d="M-110,-1240 L-60,-1320 M110,-1240 L60,-1320" stroke="#EDEDED" strokeWidth={10} />
      <rect x={30} y={-1190} width={60} height={26} rx={5} fill="#2F6B3A" />
      <rect x={-80} y={-1080} width={160} height={70} rx={8} fill="none" stroke="#e2e2e2" strokeWidth={3} />
      {/* arms */}
      <g transform="translate(-175,-1290) rotate(8)">
        <rect x={-30} y={-6} width={60} height={250} rx={30} fill="url(#kBlouse)" />
        <g transform="translate(0,236) rotate(-20)">
          <rect x={-22} y={0} width={44} height={210} rx={22} fill="#E9B893" />
          <ellipse cx={0} cy={214} rx={22} ry={26} fill="url(#kSkin)" />
        </g>
      </g>
      <g transform="translate(175,-1290) rotate(-12)">
        <rect x={-30} y={-6} width={60} height={250} rx={30} fill="url(#kBlouse)" />
        <g transform="translate(0,236) rotate(110)">
          <rect x={-22} y={0} width={44} height={200} rx={22} fill="#E9B893" />
          <g transform="translate(0,215) rotate(-98)">
            <rect x={-58} y={-60} width={116} height={150} rx={8} fill="#B98A55" />
            <rect x={-58} y={-60} width={116} height={22} rx={6} fill="#A27645" />
            <path d="M-50,-30 l10,8 l-10,8" stroke="#8a6a40" strokeWidth={3} fill="none" />
          </g>
          <ellipse cx={0} cy={210} rx={22} ry={26} fill="url(#kSkin)" />
        </g>
      </g>
      {/* neck */}
      <path d="M-36,-1420 L-38,-1318 C-20,-1300 20,-1300 38,-1318 L36,-1420 Z" fill="#DDA986" />
      {/* head */}
      <g transform={`rotate(${tilt} 0 -1450)`}>
        <path d="M-96,-1600 C-120,-1500 -112,-1400 -88,-1330 L-60,-1340 C-80,-1420 -84,-1500 -70,-1580 Z" fill="url(#kHair)" />
        <path d="M96,-1600 C114,-1520 110,-1440 96,-1380 L72,-1400 C84,-1460 84,-1520 70,-1580 Z" fill="url(#kHair)" />
        <ellipse cx={-90} cy={-1515} rx={14} ry={28} fill="#DDA986" />
        <ellipse cx={90} cy={-1515} rx={14} ry={28} fill="#DDA986" />
        <circle cx={-92} cy={-1484} r={6} fill="#D9A021" />
        <circle cx={92} cy={-1484} r={6} fill="#D9A021" />
        <path d="M-88,-1590 C-96,-1520 -88,-1460 -66,-1424 C-46,-1396 -22,-1388 0,-1388 C22,-1388 46,-1396 66,-1424 C88,-1460 96,-1520 88,-1590 C80,-1650 -80,-1650 -88,-1590 Z" fill="url(#kSkin)" />
        <ellipse cx={-52} cy={-1488} rx={22} ry={12} fill="rgba(230,110,110,.22)" />
        <ellipse cx={52} cy={-1488} rx={22} ry={12} fill="rgba(230,110,110,.22)" />
        {eye(-38)}{eye(38)}
        <path d="M-64,-1572 C-50,-1584 -26,-1586 -12,-1578" stroke="#4A3020" strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d={`M12,${-1580 - raise} C26,${-1592 - raise} 50,${-1592 - raise} 64,${-1582 - raise * 0.6}`} stroke="#4A3020" strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d="M-4,-1550 C-8,-1526 -12,-1508 -14,-1498 C-8,-1492 6,-1492 12,-1498" stroke="rgba(150,90,60,.45)" strokeWidth={3.5} fill="none" />
        <ellipse cx={4} cy={-1508} rx={5} ry={3} fill="rgba(255,255,255,.35)" />
        {/* mouth (slightly off-center = confused) */}
        <ellipse cx={8} cy={-1458 + 6 * m} rx={14 + 8 * m} ry={3 + 15 * m} fill="#5A1A22" />
        <path d={`M${-10},${-1462} Q8,${-1470} 26,${-1462}`} stroke="#C2505E" strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d={`M${-8},${-1452 + 12 * m} Q8,${-1444 + 14 * m} 24,${-1452 + 12 * m}`} stroke="#C2505E" strokeWidth={7} fill="none" strokeLinecap="round" />
        {/* bangs + cap */}
        <path d="M-92,-1590 C-80,-1650 80,-1660 94,-1590 C60,-1610 20,-1576 -10,-1600 C-40,-1584 -70,-1596 -92,-1590 Z" fill="url(#kHair)" />
        <path d="M-98,-1612 L-84,-1700 L84,-1700 L98,-1612 Z" fill="#FFFFFF" />
        <rect x={-100} y={-1626} width={200} height={26} rx={8} fill="#EDEDED" />
        <path d="M-60,-1690 v60 M0,-1694 v62 M60,-1690 v60" stroke="#e5e5e5" strokeWidth={3} />
      </g>
    </g>
  );
};
