import React from 'react';

/**
 * Guria — sobrinha do Lauro, ~10 anos, curiosa e esperta. Sempre vestida de PRENDA:
 * vestido longo rosa-claro com babados de renda branca, saia armada, manga com punho de babado,
 * faixa na cintura, tranças castanhas com fita e flor no cabelo, sapatilha.
 * Coordenadas locais: pés em (0,0), y para baixo, topo da cabeça ≈ y -1080. Mãos com 5 dedos.
 * Mesma API do Pia (talk, expr, arms, walk, hop, tilt, gaze) para trocar um pelo outro fácil.
 */
export type GuriaExpr = 'talk' | 'smile' | 'laugh' | 'shock' | 'smug' | 'pout' | 'sad';
export type GuriaArms = 'down' | 'cross' | 'shrug' | 'count' | 'present' | 'hips' | 'cheer' | 'skirt';

const DRESS = '#EFB4C2';
const DRESS_D = '#C98395';
const LACE = '#FFF8F4';
const HAIR = '#5A3420';

export const GuriaDefs = () => (
  <defs>
    <radialGradient id="gSkin" cx="42%" cy="35%" r="75%">
      <stop offset="0" stopColor="#F2C7A3" />
      <stop offset="0.6" stopColor="#E0AC84" />
      <stop offset="1" stopColor="#C38C66" />
    </radialGradient>
    <linearGradient id="gSkinArm" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#C38C66" />
      <stop offset="0.45" stopColor="#E7B791" />
      <stop offset="1" stopColor="#C38C66" />
    </linearGradient>
    <linearGradient id="gDress" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={DRESS_D} />
      <stop offset="0.35" stopColor={DRESS} />
      <stop offset="0.6" stopColor="#F6CBD5" />
      <stop offset="1" stopColor={DRESS_D} />
    </linearGradient>
    <linearGradient id="gSleeve" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={DRESS_D} />
      <stop offset="0.5" stopColor="#F4C2CE" />
      <stop offset="1" stopColor={DRESS_D} />
    </linearGradient>
    <linearGradient id="gHair" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#7A4A2C" />
      <stop offset="1" stopColor="#3E2414" />
    </linearGradient>
  </defs>
);

const FINGERS: [number, number, number][] = [
  [-14, 27, -6], [-4.5, 31, -2], [5, 30, 2], [14, 24, 7],
];
/** mão aberta com 5 dedos (4 + polegar) */
const Hand: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <g transform={`scale(${flip ? -1 : 1},1)`}>
    {FINGERS.map(([x, len, rot], i) => (
      <g key={i} transform={`rotate(${rot} ${x} 20)`}>
        <rect x={x - 4.2} y={18} width={8.4} height={len} rx={4.2} fill="#E0AC84" stroke="rgba(120,70,40,.35)" strokeWidth={1} />
        <ellipse cx={x} cy={18 + len - 4} rx={2.4} ry={2} fill="rgba(255,235,215,.55)" />
      </g>
    ))}
    <g transform="translate(-16,6) rotate(50)">
      <rect x={-5} y={0} width={10} height={25} rx={5} fill="#D7A27A" stroke="rgba(120,70,40,.35)" strokeWidth={1} />
    </g>
    <rect x={-17} y={-6} width={34} height={31} rx={12} fill="url(#gSkin)" />
  </g>
);

const POSE: Record<GuriaArms, { r: [number, number]; l: [number, number] }> = {
  down: { r: [12, -8], l: [-12, 8] },
  cross: { r: [-16, -112], l: [16, 112] },
  shrug: { r: [28, 78], l: [-28, -78] },
  count: { r: [12, -8], l: [-28, -122] },
  present: { r: [12, -8], l: [-58, -42] },
  hips: { r: [38, -78], l: [-38, 78] },
  cheer: { r: [150, 10], l: [-150, -10] },
  /** segurando a saia, como na dança */
  skirt: { r: [34, -10], l: [-34, 10] },
};

/** babado (ruffle) ondulado entre x0 e x1 na altura y */
const ruffle = (x0: number, x1: number, y: number, h: number, n: number, sway: number) => {
  const w = (x1 - x0) / n;
  let d = `M${x0},${y - h}`;
  for (let i = 0; i < n; i++) d += ` L${x0 + (i + 1) * w},${y - h}`;
  d += ` L${x1},${y}`;
  for (let i = n; i > 0; i--) d += ` Q${x0 + (i - 0.5) * w + sway},${y + h * 0.55} ${x0 + (i - 1) * w},${y}`;
  return d + ' Z';
};

export const Guria: React.FC<{
  t: number;
  talk: number;
  expr?: GuriaExpr;
  arms?: GuriaArms;
  walk?: number;
  hop?: number;
  lean?: number;
  tilt?: number;
  gaze?: number;
  shadow?: boolean;
}> = ({ t, talk, expr = 'talk', arms = 'down', walk = 0, hop = 0, lean = 0, tilt = 0, gaze = -0.4, shadow = true }) => {
  const m = Math.max(0, Math.min(1, talk));
  const ph = t * 8;
  const bob = -Math.abs(Math.sin(ph)) * 16 * walk;
  const sway = Math.sin(t * 1.6) * 1.3 + Math.sin(ph) * 2 * walk + lean;
  const breathe = Math.sin(t * 2.5) * 2.2;
  const fidget = Math.sin(t * 2.1) * 3.5;
  const skirtSway = Math.sin(t * 2.4) * 6 + Math.sin(ph) * 12 * walk + (hop > 5 ? 10 : 0);
  const blink = t % 3.6 > 3.48;
  const P = POSE[arms];

  let o = 1, bL = 0, bR = 0, rL = 0, rR = 0, closed = false;
  switch (expr) {
    case 'shock': o = 1.45; bL = bR = -14; break;
    case 'laugh': closed = true; bL = bR = -8; break;
    case 'smile': o = 0.92; bL = bR = -4; break;
    case 'smug': o = 0.75; bL = -14; bR = 4; rL = -6; rR = 10; break;
    case 'pout': o = 0.9; bL = bR = -2; rL = rR = 12; break;
    case 'sad': o = 0.85; bL = bR = -4; rL = rR = 14; break;
  }
  if (blink && !closed) o = 0.08;
  const hy = -880;
  const eyeY = hy - 8;
  const my = hy + 74;
  let mouth: React.ReactNode;
  if (expr === 'laugh' || expr === 'smile') {
    const d = (expr === 'smile' ? 6 : 13) + 16 * m;
    mouth = (
      <g>
        <path d={`M-22,${my - 3} Q0,${my + d} 22,${my - 3} Q0,${my + 2} -22,${my - 3} Z`} fill="#4A1414" />
        <path d={`M-17,${my - 1} Q0,${my + Math.min(d, 6)} 17,${my - 1} Q0,${my + 1} -17,${my - 1} Z`} fill="#F7F3EC" />
      </g>
    );
  } else if (expr === 'smug') {
    mouth = <path d={`M-18,${my + 2} Q4,${my + 8 + 9 * m} 24,${my - 7}`} stroke="#B0505A" strokeWidth={5} fill={m > 0.15 ? '#4A1414' : 'none'} strokeLinecap="round" />;
  } else if (expr === 'sad') {
    mouth = <path d={`M-16,${my + 6} Q0,${my - 4 - 6 * m} 16,${my + 6}`} stroke="#B0505A" strokeWidth={5} fill="none" strokeLinecap="round" />;
  } else {
    const sh = expr === 'shock' ? 8 : 0;
    const ry = 2.5 + 13 * m + sh;
    mouth = (
      <g>
        <ellipse cx={0} cy={my + ry * 0.4} rx={13 + 6 * m + sh * 0.5} ry={ry} fill="#4A1414" />
        {m > 0.25 && <rect x={-9} y={my - 1} width={18} height={4} rx={2} fill="#F7F3EC" />}
        {m > 0.4 && <ellipse cx={0} cy={my + ry * 1.1} rx={7} ry={3.2 * m} fill="#D06A6A" />}
        <path d={`M-14,${my - 4} Q0,${my - 9} 14,${my - 4}`} stroke="#C77080" strokeWidth={3} fill="none" opacity={0.6} />
      </g>
    );
  }
  const gx = gaze * 6;
  const eye = (x: number, rot: number, brow: number) => (
    <g>
      {closed ? (
        <path d={`M${x - 17},${eyeY + 2} Q${x},${eyeY - 10} ${x + 17},${eyeY + 2}`} stroke="#3a2416" strokeWidth={4} fill="none" strokeLinecap="round" />
      ) : (
        <g>
          <ellipse cx={x} cy={eyeY} rx={18} ry={15 * o} fill="#FBF8F3" />
          <circle cx={x + gx} cy={eyeY + 1} r={Math.min(10.5, 11.5 * o)} fill="#5A3A1E" />
          <circle cx={x + gx} cy={eyeY + 1} r={Math.min(5, 5.5 * o)} fill="#120A05" />
          <circle cx={x + gx + 3.5} cy={eyeY - 3} r={3} fill="#fff" />
          <path d={`M${x - 20},${eyeY - 3} Q${x},${eyeY - 19 * o} ${x + 20},${eyeY - 3}`} stroke="#2A1A10" strokeWidth={4} fill="none" strokeLinecap="round" />
          {/* cílios */}
          <path d={`M${x + (x < 0 ? -18 : 18)},${eyeY - 6} l${x < 0 ? -8 : 8},-6 M${x + (x < 0 ? -13 : 13)},${eyeY - 11} l${x < 0 ? -5 : 5},-7`} stroke="#2A1A10" strokeWidth={3} strokeLinecap="round" />
        </g>
      )}
      <rect x={x - 20} y={eyeY - 40 + brow} width={40} height={7} rx={3.5} fill="#4A2A18" transform={`rotate(${rot} ${x} ${eyeY - 36 + brow})`} />
    </g>
  );

  const arm = (side: 1 | -1, [s, e]: [number, number]) => {
    const swing = arms === 'down' ? Math.sin(ph) * 14 * walk * side : 0;
    const wob = arms === 'shrug' || arms === 'count' ? Math.sin(t * 6) * 4 : 0;
    return (
      <g transform={`translate(${side * 112},${-770 + breathe}) rotate(${s + swing})`}>
        {/* manga longa do vestido */}
        <rect x={-26} y={-14} width={52} height={200} rx={24} fill="url(#gSleeve)" />
        <g transform={`translate(0,186) rotate(${e + wob})`}>
          <rect x={-22} y={-10} width={44} height={128} rx={20} fill="url(#gSleeve)" />
          <path d={ruffle(-30, 30, 128, 22, 4, 0)} fill={LACE} stroke="rgba(180,150,150,.5)" strokeWidth={2} />
          <rect x={-15} y={132} width={30} height={22} rx={8} fill="url(#gSkinArm)" />
          <g transform="translate(0,150)"><Hand flip={side < 0} /></g>
        </g>
      </g>
    );
  };

  // saia em sino (armada), da cintura (-560) até o chão (-30)
  const hemY = -34, waistY = -565;
  const hemW = 270, waistW = 100;
  const sk = skirtSway;

  return (
    <g transform={`translate(0,${-hop}) rotate(${sway})`}>
      {shadow && <ellipse cx={0} cy={hop + 6} rx={240 - Math.min(hop, 120) * 0.5} ry={26} fill="rgba(0,0,0,.28)" />}
      <g transform={`translate(0,${bob})`}>
        {/* sapatilhas aparecendo sob a saia */}
        {[-56, 56].map((x, i) => (
          <g key={i} transform={`translate(${x},${-Math.max(0, (i ? -1 : 1) * Math.sin(ph)) * 22 * walk})`}>
            <ellipse cx={i ? 14 : -14} cy={-14} rx={44} ry={20} fill="#2A1A14" />
            <ellipse cx={i ? 4 : -4} cy={-22} rx={20} ry={7} fill="rgba(255,255,255,.2)" />
          </g>
        ))}
        {/* saia */}
        <path d={`M${-waistW},${waistY} C${-waistW - 60},${waistY + 200} ${-hemW - 10 + sk},${hemY - 160} ${-hemW + sk},${hemY} L${hemW + sk},${hemY} C${hemW + 10 + sk},${hemY - 160} ${waistW + 60},${waistY + 200} ${waistW},${waistY} Z`} fill="url(#gDress)" />
        {/* pregas da saia */}
        {[-150, -75, 0, 75, 150].map((x, i) => (
          <path key={i} d={`M${x * 0.45},${waistY + 20} Q${x * 0.8 + sk * 0.4},${hemY - 200} ${x + sk * 0.8},${hemY - 10}`} stroke="rgba(150,80,100,.28)" strokeWidth={4} fill="none" />
        ))}
        {/* três babados de renda */}
        <path d={ruffle(-hemW + sk - 8, hemW + sk + 8, hemY + 6, 46, 9, sk * 0.3)} fill={LACE} stroke="rgba(180,150,150,.55)" strokeWidth={2} />
        <path d={ruffle(-hemW * 0.86 + sk * 0.9, hemW * 0.86 + sk * 0.9, hemY - 90, 36, 8, sk * 0.3)} fill={DRESS} stroke="rgba(150,80,100,.35)" strokeWidth={2} opacity={0.95} />
        <path d={ruffle(-hemW * 0.86 + sk * 0.9, hemW * 0.86 + sk * 0.9, hemY - 90, 12, 8, 0)} fill={LACE} opacity={0.9} />
        <path d={ruffle(-hemW * 0.7 + sk * 0.7, hemW * 0.7 + sk * 0.7, hemY - 190, 30, 7, sk * 0.2)} fill={DRESS} stroke="rgba(150,80,100,.3)" strokeWidth={2} opacity={0.95} />
        <path d={ruffle(-hemW * 0.7 + sk * 0.7, hemW * 0.7 + sk * 0.7, hemY - 190, 10, 7, 0)} fill={LACE} opacity={0.9} />
        {/* corpete */}
        <g transform={`translate(0,${breathe})`}>
          <path d="M-112,-790 C-122,-700 -112,-620 -100,-560 L100,-560 C112,-620 122,-700 112,-790 C70,-812 -70,-812 -112,-790 Z" fill="url(#gDress)" />
          {/* botõezinhos */}
          {[-740, -700, -660, -620].map((y) => <circle key={y} cx={0} cy={y} r={6} fill={LACE} stroke="rgba(150,80,100,.5)" strokeWidth={1.5} />)}
          {/* gola de renda */}
          <path d="M-70,-806 Q-40,-760 0,-772 Q40,-760 70,-806 Q36,-790 0,-796 Q-36,-790 -70,-806 Z" fill={LACE} stroke="rgba(180,150,150,.6)" strokeWidth={2} />
          {/* faixa na cintura com laço */}
          <rect x={-104} y={-582} width={208} height={30} rx={8} fill="#B8475E" />
          <path d="M70,-568 l38,-22 l-6,28 Z M70,-568 l38,22 l-6,-28 Z" fill="#B8475E" />
          <path d="M84,-560 l14,70 M92,-560 l26,62" stroke="#B8475E" strokeWidth={8} strokeLinecap="round" />
        </g>
        {arm(-1, P.r)}
        {arm(1, P.l)}
        {/* pescoço */}
        <rect x={-26} y={-822} width={52} height={50} rx={18} fill="#CC966F" />
        <g transform={`rotate(${tilt + fidget * 0.4} 0 ${hy + 120})`}>
          {/* tranças caindo na frente dos ombros */}
          {[-1, 1].map((sd) => (
            <g key={sd} transform={`rotate(${sd * (4 + Math.sin(t * 2 + sd) * 3)} ${sd * 96} ${hy + 40})`}>
              {Array.from({ length: 7 }).map((_, k) => (
                <ellipse key={k} cx={sd * (98 + k * 2)} cy={hy + 70 + k * 44} rx={30 - k * 1.5} ry={28} fill="url(#gHair)" stroke="rgba(30,15,5,.35)" strokeWidth={2} />
              ))}
              <path d={`M${sd * 112 - 24},${hy + 386} l24,14 l24,-14 l-8,30 l-16,-10 l-16,10 Z`} fill="#B8475E" />
              <path d={`M${sd * 112},${hy + 400} q${sd * 10},30 ${sd * 2},56`} stroke={HAIR} strokeWidth={14} strokeLinecap="round" fill="none" />
            </g>
          ))}
          {/* cabelo de trás */}
          <ellipse cx={0} cy={hy - 14} rx={128} ry={140} fill="url(#gHair)" />
          {/* orelhas + brinquinho */}
          <ellipse cx={-114} cy={hy + 6} rx={20} ry={30} fill="#D7A27A" />
          <ellipse cx={114} cy={hy + 6} rx={20} ry={30} fill="#D7A27A" />
          <circle cx={-116} cy={hy + 36} r={6} fill="#F4E6A8" />
          <circle cx={116} cy={hy + 36} r={6} fill="#F4E6A8" />
          <ellipse cx={0} cy={hy} rx={112} ry={126} fill="url(#gSkin)" />
          {/* franja com risca no meio */}
          <path d={`M-114,${hy - 10} C-120,${hy - 120} -40,${hy - 150} 0,${hy - 118} C40,${hy - 150} 120,${hy - 120} 114,${hy - 10} C100,${hy - 70} 50,${hy - 96} 0,${hy - 96} C-50,${hy - 96} -100,${hy - 70} -114,${hy - 10} Z`} fill="url(#gHair)" />
          <path d={`M0,${hy - 118} L0,${hy - 96}`} stroke="rgba(255,220,200,.6)" strokeWidth={3} />
          {/* flor no cabelo */}
          <g transform={`translate(78,${hy - 104})`}>
            {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-18} rx={13} ry={20} fill="#E8506E" transform={`rotate(${a})`} />)}
            <circle r={11} fill="#F6C945" />
            <path d="M-10,22 q-26,6 -36,-6 M6,24 q20,10 32,0" stroke="#4E7A3A" strokeWidth={7} fill="none" strokeLinecap="round" />
          </g>
          {/* bochechas */}
          <ellipse cx={-66} cy={hy + 44} rx={24} ry={14} fill="rgba(235,120,130,.32)" />
          <ellipse cx={66} cy={hy + 44} rx={24} ry={14} fill="rgba(235,120,130,.32)" />
          {eye(-44, rL, bL)}
          {eye(44, rR, bR)}
          <path d={`M-3,${hy + 18} Q-13,${hy + 42} -1,${hy + 48} Q9,${hy + 50} 12,${hy + 43}`} stroke="rgba(160,95,65,.6)" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          {mouth}
        </g>
      </g>
    </g>
  );
};
