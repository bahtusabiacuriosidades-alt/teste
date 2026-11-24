import React from 'react';

/**
 * Lauro — semi-realistic gaúcho, full body.
 * Local coordinates: feet at (0,0), y grows downward, hat top ≈ y -1765.
 * The cuia is ALWAYS in his right hand (viewer's left).
 */
export type Expr = 'talk' | 'shock' | 'laugh' | 'smile' | 'squint' | 'stern' | 'angry' | 'wink' | 'delight' | 'sad';
export type ArmPose = 'down' | 'wave' | 'hold' | 'pointUp' | 'thumbsUp' | 'wag' | 'pointSide' | 'pointDown';
export type HeldObj = 'none' | 'brigadeiro' | 'bergamota' | 'roll';

const POSES: Record<ArmPose, [number, number]> = {
  down: [-8, 6],
  wave: [-150, 0],
  hold: [-18, 150],
  pointUp: [-160, 0],
  thumbsUp: [-25, 150],
  wag: [-10, 170],
  pointSide: [-88, 0],
  pointDown: [-30, -15],
};
const HAND: Record<ArmPose, 'open'> = {
  down: 'open', wave: 'open', hold: 'open', pointUp: 'open', thumbsUp: 'open',
  wag: 'open', pointSide: 'open', pointDown: 'open',
};

export const LauroDefs = () => (
  <defs>
    <radialGradient id="lSkin" cx="40%" cy="35%" r="75%">
      <stop offset="0" stopColor="#E6B48C" />
      <stop offset="0.6" stopColor="#D29A70" />
      <stop offset="1" stopColor="#B57D57" />
    </radialGradient>
    <linearGradient id="lSkinArm" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#B57D57" />
      <stop offset="0.45" stopColor="#D9A57B" />
      <stop offset="1" stopColor="#B57D57" />
    </linearGradient>
    <linearGradient id="lShirt" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#D9D3C7" />
      <stop offset="0.5" stopColor="#F6F2EA" />
      <stop offset="1" stopColor="#D2CBBE" />
    </linearGradient>
    <linearGradient id="lSleeve" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#D6CFC2" />
      <stop offset="0.5" stopColor="#F6F2EA" />
      <stop offset="1" stopColor="#CFC8BB" />
    </linearGradient>
    <linearGradient id="lVest" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#5A3826" />
      <stop offset="1" stopColor="#3A2318" />
    </linearGradient>
    <linearGradient id="lBom" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#4A4E52" />
      <stop offset="0.3" stopColor="#6A6F74" />
      <stop offset="0.5" stopColor="#575B60" />
      <stop offset="0.7" stopColor="#6A6F74" />
      <stop offset="1" stopColor="#45494D" />
    </linearGradient>
    <linearGradient id="lHat" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#141210" />
      <stop offset="0.45" stopColor="#34302B" />
      <stop offset="1" stopColor="#141210" />
    </linearGradient>
    <linearGradient id="lMust" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#E9B53A" />
      <stop offset="1" stopColor="#B9860F" />
    </linearGradient>
    <radialGradient id="lCuia" cx="35%" cy="35%" r="75%">
      <stop offset="0" stopColor="#8A5A34" />
      <stop offset="0.6" stopColor="#5C3A21" />
      <stop offset="1" stopColor="#3A2414" />
    </radialGradient>
    <linearGradient id="lSilver" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#8E939A" />
      <stop offset="0.4" stopColor="#F1F3F5" />
      <stop offset="1" stopColor="#8E939A" />
    </linearGradient>
    <linearGradient id="lBoot" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#0E0C0A" />
      <stop offset="0.5" stopColor="#2C2622" />
      <stop offset="1" stopColor="#0E0C0A" />
    </linearGradient>
    <pattern id="scarfH" width="40" height="72" patternUnits="userSpaceOnUse">
      <rect width="40" height="24" fill="#0D80BF" />
      <rect y="24" width="40" height="24" fill="#151515" />
      <rect y="48" width="40" height="24" fill="#F4F4F4" />
    </pattern>
    <pattern id="lStub" width="7" height="7" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.1" fill="rgba(50,30,20,.45)" />
      <circle cx="5.5" cy="5" r="0.9" fill="rgba(50,30,20,.35)" />
    </pattern>
  </defs>
);

export const Obj: React.FC<{ kind: HeldObj }> = ({ kind }) => {
  if (kind === 'brigadeiro')
    return (
      <g>
        <path d="M-26,6 L-19,34 L19,34 L26,6 Z" fill="#B23A2E" />
        <circle cx={0} cy={-6} r={25} fill="#3B2314" />
        <circle cx={-8} cy={-14} r={7} fill="rgba(255,255,255,.18)" />
        {[[-12, -12], [6, -20], [14, 0], [-4, 6], [-16, 2], [10, -8]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={6} height={2.5} rx={1} fill="#1d0f07" transform={`rotate(${i * 50} ${x} ${y})`} />
        ))}
      </g>
    );
  if (kind === 'bergamota')
    return (
      <g>
        <circle cx={0} cy={0} r={36} fill="#E9801E" />
        <circle cx={-10} cy={-12} r={12} fill="rgba(255,255,255,.25)" />
        <circle cx={6} cy={8} r={30} fill="none" stroke="rgba(150,70,10,.25)" strokeWidth={3} />
        <path d="M0,-34 q14,-20 30,-14 q-8,16 -30,14" fill="#4E8B3A" />
      </g>
    );
  if (kind === 'roll')
    return (
      <g>
        <ellipse cx={0} cy={0} rx={44} ry={26} fill="#C98A3A" />
        <ellipse cx={-4} cy={-6} rx={32} ry={14} fill="#E2A957" />
        <path d="M-18,-9 l11,12 M0,-12 l11,12" stroke="#8A5420" strokeWidth={4} strokeLinecap="round" />
      </g>
    );
  return null;
};

/** semi-realistic five-finger hand. Axis points along +y (toward the fingertips). */
const FINGERS: [number, number, number][] = [[-18, 44, -13], [-6, 54, -4], [6, 51, 4], [18, 40, 13]];
const Hand: React.FC<{ kind: 'open' }> = () => (
  <g transform="translate(0,-4) scale(1.45)">
    {FINGERS.map(([x, len, rot], i) => (
      <g key={i} transform={`rotate(${rot} ${x} 40)`}>
        <rect x={x - 6.5} y={34} width={13} height={len} rx={6.5} fill="#D29A70" stroke="rgba(120,70,40,.35)" strokeWidth={1.2} />
        <ellipse cx={x} cy={36 + len - 5} rx={3.6} ry={3} fill="rgba(255,230,210,.55)" />
        <path d={`M${x - 4},${52 + len * 0.25} h8`} stroke="rgba(120,70,40,.35)" strokeWidth={1.6} />
      </g>
    ))}
    <g transform="translate(-23,12) rotate(52)">
      <rect x={-7.5} y={0} width={15} height={42} rx={7.5} fill="#C98F62" stroke="rgba(120,70,40,.35)" strokeWidth={1.2} />
      <ellipse cx={0} cy={37} rx={4} ry={3.2} fill="rgba(255,230,210,.5)" />
    </g>
    <rect x={-25} y={-4} width={50} height={48} rx={18} fill="url(#lSkin)" />
    <path d="M-18,38 C-8,42 8,42 20,38" stroke="rgba(120,70,40,.3)" strokeWidth={2} fill="none" />
  </g>
);

const Eye: React.FC<{ x: number; o: number; closed?: boolean; gaze?: number }> = ({ x, o, closed, gaze = 0 }) => {
  const y = -1548;
  if (closed)
    return (
      <g>
        <path d={`M${x - 22},${y + 2} Q${x},${y - 11} ${x + 22},${y + 2}`} stroke="#3a2416" strokeWidth={4.5} fill="none" strokeLinecap="round" />
        <path d={`M${x + (x < 0 ? -26 : 26)},${y + 4} l${x < 0 ? -9 : 9},4 M${x + (x < 0 ? -25 : 25)},${y + 9} l${x < 0 ? -8 : 8},7`} stroke="rgba(120,70,40,.45)" strokeWidth={2.5} />
      </g>
    );
  const h = 13 * o;
  return (
    <g>
      <ellipse cx={x} cy={y - 14} rx={30} ry={12} fill="rgba(120,70,40,.16)" />
      <path d={`M${x - 24},${y} C${x - 12},${y - h} ${x + 12},${y - h} ${x + 24},${y} C${x + 12},${y + h * 0.75} ${x - 12},${y + h * 0.75} ${x - 24},${y} Z`} fill="#F4EFE7" />
      <ellipse cx={x + gaze} cy={y - 1} rx={9.5} ry={Math.min(9.5, 12 * o)} fill="#5A3A1E" />
      <ellipse cx={x + gaze} cy={y - 1} rx={4.6} ry={Math.min(4.6, 6 * o)} fill="#120a05" />
      {o > 0.4 && <circle cx={x + gaze + 3} cy={y - 4} r={2.6} fill="#fff" />}
      <path d={`M${x - 25},${y + 1} C${x - 12},${y - h - 2} ${x + 12},${y - h - 2} ${x + 25},${y + 1}`} stroke="#2a180c" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d={`M${x - 20},${y + h * 0.7} C${x - 8},${y + h * 0.95} ${x + 8},${y + h * 0.95} ${x + 20},${y + h * 0.7}`} stroke="rgba(120,70,40,.35)" strokeWidth={2} fill="none" />
    </g>
  );
};

const Brow: React.FC<{ side: 1 | -1; dy: number; rot: number }> = ({ side, dy, rot }) => (
  <g transform={`scale(${side},1) translate(0,${dy}) rotate(${rot} 45 -1582)`}>
    <path d="M75,-1570 C62,-1588 32,-1594 14,-1586 L16,-1577 C32,-1583 58,-1580 73,-1563 Z" fill="#3B2414" />
    <path d="M70,-1572 C58,-1584 36,-1588 22,-1584" stroke="#5a3a22" strokeWidth={1.5} fill="none" />
  </g>
);

export const Lauro: React.FC<{
  t: number;
  talk: number;
  expr?: Expr;
  arm?: ArmPose;
  armWobble?: number;
  obj?: HeldObj;
  objLift?: number;
  cuiaRaise?: number;
  tilt?: number;
  browBoost?: number;
  shadow?: boolean;
  /** 0..1 — walking cycle on/off */
  walk?: number;
  /** body lean in degrees (pivot at the feet) */
  lean?: number;
  /** vertical jump in local units */
  hop?: number;
  /** tricolor fan scarf (episode-specific accessory) */
  scarf?: boolean;
}> = ({ t, talk, expr = 'talk', arm = 'down', armWobble = 0, obj = 'none', objLift = 0, cuiaRaise = 0, tilt = 0, browBoost = 0, shadow = true, walk = 0, lean = 0, hop = 0, scarf = false }) => {
  const m = Math.max(0, Math.min(1, talk));
  const blink = t % 3.9 > 3.78;
  const breathe = Math.sin(t * 2.2) * 3;
  // ----- body motion -----
  const stepPh = t * 7;
  const bob = -Math.abs(Math.sin(stepPh)) * 22 * walk;
  const sway = Math.sin(t * 1.4) * 1.3 + Math.sin(stepPh) * 2.2 * walk + lean;
  const talkNow = Math.max(0, Math.min(1, talk));
  const nod = Math.sin(t * 3.1) * 1.6 + talkNow * Math.sin(t * 9) * 2.4;
  const armSwing = Math.sin(stepPh) * 16 * walk + Math.sin(t * 2) * 3;
  const footL = -Math.max(0, Math.sin(stepPh)) * 40 * walk;
  const footR = -Math.max(0, -Math.sin(stepPh)) * 40 * walk;

  // ----- face parameters -----
  let o = 1, browL = 0, browR = 0, rotL = 0, rotR = 0;
  let closedL = false, closedR = false;
  switch (expr) {
    case 'shock': o = 1.4; browL = browR = -16; break;
    case 'laugh': case 'delight': closedL = closedR = true; browL = browR = -8; break;
    case 'smile': o = 0.9; browL = browR = -5; break;
    case 'squint': o = 0.42; browL = 4; browR = -14; rotL = -8; rotR = 6; break;
    case 'stern': o = 0.8; browL = 2; browR = -8; rotL = -12; rotR = 4; break;
    case 'angry': o = 1.05; browL = browR = 5; rotL = rotR = -16; break;
    case 'wink': closedR = true; browL = -6; browR = 3; break;
    case 'sad': o = 0.85; browL = browR = -6; rotL = rotR = 13; break;
  }
  browL += browBoost; browR += browBoost;
  if (blink && !closedL) o = 0.08;

  // ----- mouth -----
  const my = -1458;
  let mouth: React.ReactNode;
  if (expr === 'laugh' || expr === 'delight' || expr === 'smile' || expr === 'wink') {
    const d = (expr === 'smile' || expr === 'wink' ? 8 : 16) + 22 * m;
    mouth = (
      <g>
        <path d={`M-30,${my - 4} Q0,${my + d} 30,${my - 4} Q0,${my + 2} -30,${my - 4} Z`} fill="#3A1010" />
        <path d={`M-24,${my - 2} Q0,${my + Math.min(d, 9)} 24,${my - 2} Q0,${my + 1} -24,${my - 2} Z`} fill="#F4F0E8" />
        <path d={`M-22,${my + d * 0.8} Q0,${my + d + 6} 22,${my + d * 0.8}`} stroke="#A8584A" strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    );
  } else if (expr === 'stern' || expr === 'squint') {
    mouth = (
      <g>
        <ellipse cx={4} cy={my} rx={16 + 6 * m} ry={2 + 10 * m} fill="#3A1010" />
        <path d={`M-18,${my + 6 + 8 * m} Q6,${my + 12 + 10 * m} 24,${my + 3 + 8 * m}`} stroke="#A8584A" strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    );
  } else {
    const sh = expr === 'shock' ? 8 : expr === 'angry' ? 4 : 0;
    const ry = 2.5 + 17 * m + sh;
    mouth = (
      <g>
        <ellipse cx={0} cy={my + ry * 0.4} rx={18 + 8 * m + sh * 0.6} ry={ry} fill="#3A1010" />
        {m > 0.2 && <rect x={-13} y={my - 1} width={26} height={4 + 2 * m} rx={2} fill="#F4F0E8" />}
        {m > 0.35 && <ellipse cx={0} cy={my + ry * 1.1} rx={10} ry={4 * m} fill="#B65A55" />}
        <path d={`M-17,${my + ry * 1.45 + 2} Q0,${my + ry * 1.45 + 8} 17,${my + ry * 1.45 + 2}`} stroke="#A8584A" strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    );
  }

  // ----- left arm (viewer right) -----
  const [a1, a2b] = POSES[arm];
  const a2 = a2b + armWobble + (arm === 'down' ? armSwing * 0.5 : 0);
  const leftArm = (
    <g transform={`translate(205,${-1292 + breathe}) rotate(${a1 + (arm === 'down' ? armSwing : 0)})`}>
      <rect x={-36} y={-10} width={72} height={280} rx={36} fill="url(#lSleeve)" />
      <path d="M-20,60 q10,40 0,90 M18,90 q-8,30 2,70" stroke="rgba(150,140,125,.5)" strokeWidth={3} fill="none" />
      <rect x={-38} y={240} width={76} height={34} rx={12} fill="#E5DFD3" />
      <path d="M-34,256 h68" stroke="rgba(150,140,125,.6)" strokeWidth={2} />
      <g transform={`translate(0,262) rotate(${a2})`}>
        <rect x={-27} y={0} width={54} height={230} rx={27} fill="url(#lSkinArm)" />
        <path d="M-10,40 q4,60 -2,120" stroke="rgba(140,90,60,.25)" strokeWidth={3} fill="none" />
        <g transform="translate(0,222)">
          <Hand kind={HAND[arm]} />
          {obj !== 'none' && (
            <g transform={`translate(0,${60 + objLift}) rotate(${-(a1 + a2)})`}>
              <Obj kind={obj} />
            </g>
          )}
        </g>
      </g>
    </g>
  );

  // ----- right arm + cuia (viewer left) -----
  const r1 = 12 - 38 * cuiaRaise;
  const r2 = -120 - 25 * cuiaRaise;
  const steam = [0, 1, 2].map((k) => {
    const ph = (t * 0.8 + k * 0.33) % 1;
    const sx = -16 + k * 16, sy = -40 - ph * 120;
    return <path key={k} d={`M${sx},${sy} c14,-18 -14,-36 0,-56`} stroke="#fff" strokeOpacity={0.5 * (1 - ph)} strokeWidth={5} fill="none" strokeLinecap="round" />;
  });
  const rightArm = (
    <g transform={`translate(-205,${-1292 + breathe}) rotate(${r1 - armSwing * 0.4})`}>
      <rect x={-36} y={-10} width={72} height={280} rx={36} fill="url(#lSleeve)" />
      <path d="M-18,70 q10,40 0,90" stroke="rgba(150,140,125,.5)" strokeWidth={3} fill="none" />
      <rect x={-38} y={240} width={76} height={34} rx={12} fill="#E5DFD3" />
      <g transform={`translate(0,262) rotate(${r2})`}>
        <rect x={-27} y={0} width={54} height={230} rx={27} fill="url(#lSkinArm)" />
        {/* cuia held upright at the hand */}
        <g transform={`translate(0,236) rotate(${-(r1 + r2)})`}>
          <line x1={8} y1={-40} x2={44} y2={-176} stroke="url(#lSilver)" strokeWidth={7} strokeLinecap="round" />
          <ellipse cx={45} cy={-180} rx={5} ry={4} fill="#C8A74A" />
          <path d="M-46,-30 C-62,30 -42,98 0,102 C42,98 62,30 46,-30 Z" fill="url(#lCuia)" />
          <path d="M-30,0 C-36,40 -24,78 -6,90" stroke="rgba(255,255,255,.14)" strokeWidth={8} fill="none" />
          <ellipse cx={0} cy={-30} rx={50} ry={13} fill="url(#lSilver)" />
          <path d="M-44,-26 C-20,-18 20,-18 44,-26" stroke="#8E939A" strokeWidth={2} fill="none" />
          {[-36, -24, -12, 0, 12, 24, 36].map((x) => <circle key={x} cx={x} cy={-21} r={1.8} fill="#9EA3AA" />)}
          <ellipse cx={0} cy={-32} rx={40} ry={8} fill="#6E8B3D" />
          <ellipse cx={-10} cy={-33} rx={12} ry={3} fill="#9BB56A" />
          {steam}
          <ellipse cx={-34} cy={22} rx={26} ry={30} fill="url(#lSkin)" />
          <path d="M-52,10 h30 M-54,22 h30 M-52,34 h28" stroke="rgba(120,70,40,.35)" strokeWidth={2.5} />
        </g>
      </g>
    </g>
  );

  return (
    <g>
      {shadow && <ellipse cx={0} cy={0} rx={280 - hop * 0.15} ry={42 - hop * 0.02} fill="rgba(0,0,0,.22)" />}
      <g transform={`translate(0,${-hop + bob}) rotate(${sway} 0 0)`}>
      {/* bombacha */}
      <path d="M-192,-905 C-262,-700 -272,-420 -202,-262 C-172,-202 -122,-186 -96,-182 L-30,-182 C-20,-400 -10,-600 0,-640 C10,-600 20,-400 30,-182 L96,-182 C122,-186 172,-202 202,-262 C272,-420 262,-700 192,-905 Z" fill="url(#lBom)" />
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`scale(${sd},1)`}>
          <path d="M-238,-660 l18,10 l-18,10 l18,10 l-18,10 l18,10 l-18,10 l18,10" stroke="#3A3E42" strokeWidth={3} fill="none" />
          <path d="M-150,-520 C-170,-430 -160,-330 -130,-260 M-90,-700 C-110,-600 -100,-480 -80,-400" stroke="rgba(30,32,35,.35)" strokeWidth={4} fill="none" />
          <path d="M-150,-215 l10,-24 M-120,-200 l8,-26 M-90,-194 l4,-26" stroke="#3A3E42" strokeWidth={3} />
        </g>
      ))}
      {/* boots */}
      <path transform={`translate(0,${footL})`} d="M-152,-200 L-38,-200 L-34,-40 C-34,-12 -58,0 -88,0 L-190,0 C-206,0 -210,-22 -190,-36 L-152,-62 Z" fill="url(#lBoot)" />
      <path transform={`translate(0,${footR})`} d="M38,-200 L152,-200 L152,-62 L190,-36 C210,-22 206,0 190,0 L88,0 C58,0 34,-12 34,-40 Z" fill="url(#lBoot)" />
      <path d="M-148,-190 h106 M42,-190 h106" stroke="#3a332c" strokeWidth={6} />
      {/* torso */}
      <g transform={`translate(0,${breathe})`}>
        <path d="M-215,-1310 C-238,-1200 -218,-1000 -202,-890 L202,-890 C218,-1000 238,-1200 215,-1310 C140,-1350 -140,-1350 -215,-1310 Z" fill="url(#lShirt)" />
        <path d="M0,-1300 L0,-900" stroke="rgba(150,140,125,.6)" strokeWidth={3} />
        {[-1250, -1170, -1090, -1010].map((y) => <circle key={y} cx={6} cy={y} r={4} fill="#CFC8BB" />)}
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`scale(${sd},1)`}>
            <path d="M-215,-1310 C-238,-1200 -218,-1000 -206,-880 L-56,-880 C-58,-990 -62,-1080 -64,-1150 L-98,-1322 C-140,-1336 -180,-1332 -215,-1310 Z" fill="url(#lVest)" />
            <path d="M-198,-1290 C-216,-1190 -200,-1010 -192,-896 M-72,-896 C-74,-1000 -76,-1080 -80,-1150 L-108,-1306" stroke="rgba(210,170,120,.35)" strokeWidth={2.5} strokeDasharray="7 6" fill="none" />
            <path d="M-170,-1060 h70" stroke="rgba(0,0,0,.35)" strokeWidth={3} />
          </g>
        ))}
        {/* guaiaca */}
        <rect x={-212} y={-940} width={424} height={74} rx={10} fill="#2A2420" />
        <rect x={-180} y={-930} width={70} height={52} rx={7} fill="#3A322C" stroke="#4a4038" strokeWidth={2} />
        <rect x={110} y={-930} width={70} height={52} rx={7} fill="#3A322C" stroke="#4a4038" strokeWidth={2} />
        <circle cx={0} cy={-903} r={33} fill="url(#lSilver)" />
        <circle cx={0} cy={-903} r={21} fill="none" stroke="#8E939A" strokeWidth={3} />
        {/* neck */}
        <path d="M-48,-1425 L-52,-1318 C-30,-1298 30,-1298 52,-1318 L48,-1425 Z" fill="#BE8660" />
        {/* lenço */}
        <path d="M-98,-1348 C-40,-1306 40,-1306 98,-1348 L84,-1308 C30,-1278 -30,-1278 -84,-1308 Z" fill="url(#lMust)" />
        <path d="M-10,-1292 L-50,-1200 L-2,-1232 Z" fill="#B9860F" />
        <path d="M10,-1292 L48,-1206 L4,-1236 Z" fill="#A87A0E" />
        <ellipse cx={0} cy={-1298} rx={26} ry={22} fill="#E2AC2E" />
        <path d="M-12,-1306 q12,8 24,0" stroke="#B9860F" strokeWidth={3} fill="none" />
        {scarf && (
          <g>
            <path d="M-112,-1356 C-40,-1304 40,-1304 112,-1356 L104,-1296 C40,-1256 -40,-1256 -104,-1296 Z" fill="url(#scarfH)" stroke="rgba(0,0,0,.25)" strokeWidth={2} />
            <g transform="rotate(-7 -60 -1300)">
              <rect x={-96} y={-1300} width={74} height={360} rx={8} fill="url(#scarfH)" stroke="rgba(0,0,0,.25)" strokeWidth={2} />
              {Array.from({ length: 7 }).map((_, i) => <line key={i} x1={-92 + i * 11} y1={-940} x2={-92 + i * 11} y2={-912} stroke="#F4F4F4" strokeWidth={4} />)}
            </g>
            <g transform="rotate(5 40 -1300)">
              <rect x={14} y={-1296} width={70} height={250} rx={8} fill="url(#scarfH)" stroke="rgba(0,0,0,.25)" strokeWidth={2} />
              {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={18 + i * 12} y1={-1046} x2={18 + i * 12} y2={-1020} stroke="#F4F4F4" strokeWidth={4} />)}
            </g>
          </g>
        )}
      </g>
      {leftArm}
      {/* head */}
      <g transform={`translate(0,${breathe}) rotate(${tilt + nod} 0 -1420)`}>
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`scale(${sd},1)`}>
            <ellipse cx={-103} cy={-1525} rx={18} ry={34} fill="#C98F62" />
            <path d="M-108,-1545 C-118,-1530 -112,-1510 -104,-1502" stroke="rgba(120,70,40,.45)" strokeWidth={3} fill="none" />
          </g>
        ))}
        <path d="M-100,-1600 C-108,-1530 -102,-1470 -80,-1435 C-60,-1405 -30,-1392 0,-1390 C30,-1392 60,-1405 80,-1435 C102,-1470 108,-1530 100,-1600 C95,-1665 -95,-1665 -100,-1600 Z" fill="url(#lSkin)" />
        <path d="M-98,-1500 C-100,-1465 -80,-1435 -60,-1412 C-30,-1392 30,-1392 60,-1412 C80,-1435 100,-1465 98,-1500 C60,-1474 -60,-1474 -98,-1500 Z" fill="rgba(70,45,30,.16)" />
        <path d="M-98,-1500 C-100,-1465 -80,-1435 -60,-1412 C-30,-1392 30,-1392 60,-1412 C80,-1435 100,-1465 98,-1500 C60,-1474 -60,-1474 -98,-1500 Z" fill="url(#lStub)" />
        {[-1, 1].map((sd) => (
          <path key={sd} transform={`scale(${sd},1)`} d="M-101,-1612 C-104,-1585 -102,-1560 -96,-1540 L-90,-1540 C-92,-1565 -92,-1590 -88,-1612 Z" fill="#3B2414" />
        ))}
        <ellipse cx={0} cy={-1622} rx={102} ry={22} fill="rgba(0,0,0,.18)" />
        <ellipse cx={-60} cy={-1492} rx={22} ry={12} fill="rgba(200,90,70,.15)" />
        <ellipse cx={60} cy={-1492} rx={22} ry={12} fill="rgba(200,90,70,.15)" />
        <path d="M-30,-1500 C-44,-1482 -50,-1462 -48,-1440 M30,-1500 C44,-1482 50,-1462 48,-1440" stroke="rgba(120,70,40,.3)" strokeWidth={3} fill="none" />
        <Eye x={-42} o={o} closed={closedL} gaze={1} />
        <Eye x={42} o={o} closed={closedR} gaze={1} />
        <Brow side={-1} dy={browL} rot={rotL} />
        <Brow side={1} dy={browR} rot={rotR} />
        {/* nose */}
        <path d="M-8,-1562 C-12,-1532 -18,-1508 -20,-1496" stroke="rgba(120,70,40,.32)" strokeWidth={4} fill="none" />
        <ellipse cx={0} cy={-1500} rx={18} ry={14} fill="#C98A5E" />
        <path d="M-22,-1497 C-24,-1488 -16,-1484 -10,-1488 M22,-1497 C24,-1488 16,-1484 10,-1488" stroke="rgba(110,60,35,.5)" strokeWidth={3} fill="none" />
        <ellipse cx={-8} cy={-1491} rx={5} ry={3} fill="#6A3A22" />
        <ellipse cx={8} cy={-1491} rx={5} ry={3} fill="#6A3A22" />
        <ellipse cx={3} cy={-1508} rx={6} ry={4} fill="rgba(255,255,255,.3)" />
        {mouth}
        {/* mustache */}
        <path d="M0,-1484 C-20,-1494 -56,-1492 -73,-1469 C-80,-1458 -82,-1446 -77,-1436 C-63,-1452 -40,-1463 0,-1467 C40,-1463 63,-1452 77,-1436 C82,-1446 80,-1458 73,-1469 C56,-1492 20,-1494 0,-1484 Z" fill="#4A2F1C" />
        {[-58, -44, -30, -16, 16, 30, 44, 58].map((x) => (
          <path key={x} d={`M${x},-1484 l${x < 0 ? -6 : 6},14`} stroke="#6A4A32" strokeWidth={2} />
        ))}
        {/* barbicacho */}
        <path d="M-142,-1642 C-126,-1520 -92,-1420 0,-1394 C92,-1420 126,-1520 142,-1642" stroke="#6B4226" strokeWidth={5} fill="none" />
        {/* hat */}
        <path d="M-122,-1650 C-127,-1702 -117,-1756 -92,-1766 L92,-1766 C117,-1756 127,-1702 122,-1650 Z" fill="url(#lHat)" />
        <path d="M-60,-1762 Q0,-1745 60,-1762" stroke="rgba(255,255,255,.12)" strokeWidth={4} fill="none" />
        <rect x={-123} y={-1684} width={246} height={26} fill="#3a332c" />
        <ellipse cx={0} cy={-1646} rx={238} ry={36} fill="#1A1714" />
        <ellipse cx={0} cy={-1653} rx={226} ry={24} fill="#2C2824" />
      </g>
      {rightArm}
      </g>
    </g>
  );
};
