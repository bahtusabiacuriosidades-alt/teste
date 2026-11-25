import React from 'react';

/**
 * Piá — sobrinho do Lauro, ~10 anos, gremista provocador.
 * Boné azul virado para trás, camiseta listrada azul/preta/branca SEM escudo, bermuda cáqui, tênis.
 * Coordenadas locais: pés em (0,0), y cresce para baixo, topo do boné ≈ y -1130.
 * Proporção de criança: cabeça grande em relação ao corpo; altura ≈ 64% do Lauro.
 * Mãos sempre com 5 dedos.
 */
export type PiaExpr = 'talk' | 'smile' | 'laugh' | 'shock' | 'smug' | 'pout';
export type PiaArms = 'down' | 'cross' | 'shrug' | 'count' | 'present' | 'hips' | 'cheer';

export const PiaDefs = () => (
  <defs>
    <radialGradient id="pSkin" cx="42%" cy="35%" r="75%">
      <stop offset="0" stopColor="#F0C29C" />
      <stop offset="0.6" stopColor="#DDA77E" />
      <stop offset="1" stopColor="#BF8762" />
    </radialGradient>
    <linearGradient id="pSkinArm" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#BF8762" />
      <stop offset="0.45" stopColor="#E4B28A" />
      <stop offset="1" stopColor="#BF8762" />
    </linearGradient>
    <pattern id="pStripes" width="60" height="60" patternUnits="userSpaceOnUse">
      <rect width="60" height="60" fill="#0D80BF" />
      <rect x="24" width="22" height="60" fill="#151515" />
      <rect x="46" width="5" height="60" fill="#F4F4F4" />
    </pattern>
    <linearGradient id="pShade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="rgba(0,0,0,.32)" />
      <stop offset="0.35" stopColor="rgba(0,0,0,0)" />
      <stop offset="0.7" stopColor="rgba(0,0,0,0)" />
      <stop offset="1" stopColor="rgba(0,0,0,.3)" />
    </linearGradient>
    <linearGradient id="pShorts" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#8E7A57" />
      <stop offset="0.5" stopColor="#B49C72" />
      <stop offset="1" stopColor="#857252" />
    </linearGradient>
    <radialGradient id="pCap" cx="40%" cy="30%" r="80%">
      <stop offset="0" stopColor="#2B9BDB" />
      <stop offset="1" stopColor="#0A5E8F" />
    </radialGradient>
  </defs>
);

const FINGERS: [number, number, number][] = [
  [-15, 30, -6], [-5, 34, -2], [5, 33, 2], [15, 27, 7],
];
/** mão aberta com 5 dedos (4 + polegar). flip espelha o polegar */
const Hand: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <g transform={`scale(${flip ? -1 : 1},1)`}>
    {FINGERS.map(([x, len, rot], i) => (
      <g key={i} transform={`rotate(${rot} ${x} 22)`}>
        <rect x={x - 4.6} y={20} width={9.2} height={len} rx={4.6} fill="#DDA77E" stroke="rgba(120,70,40,.35)" strokeWidth={1} />
        <ellipse cx={x} cy={20 + len - 4} rx={2.6} ry={2.2} fill="rgba(255,235,215,.55)" />
      </g>
    ))}
    <g transform="translate(-17,6) rotate(50)">
      <rect x={-5.5} y={0} width={11} height={28} rx={5.5} fill="#D49E76" stroke="rgba(120,70,40,.35)" strokeWidth={1} />
    </g>
    <rect x={-19} y={-6} width={38} height={34} rx={13} fill="url(#pSkin)" />
  </g>
);

// [ombro, cotovelo] em graus para cada pose (braço esquerdo da tela = direito do Piá)
const POSE: Record<PiaArms, { r: [number, number]; l: [number, number] }> = {
  down: { r: [10, -6], l: [-10, 6] },
  cross: { r: [-16, -112], l: [16, 112] },
  shrug: { r: [28, 78], l: [-28, -78] },
  count: { r: [10, -6], l: [-28, -122] },
  present: { r: [10, -6], l: [-58, -42] },
  hips: { r: [38, -78], l: [-38, 78] },
  cheer: { r: [150, 10], l: [-150, -10] },
};

export const Pia: React.FC<{
  t: number;
  talk: number;
  expr?: PiaExpr;
  arms?: PiaArms;
  /** 0..1 ciclo de caminhada */
  walk?: number;
  hop?: number;
  lean?: number;
  /** inclina a cabeça (graus) */
  tilt?: number;
  /** olhar para a esquerda (-1) / direita (1) */
  gaze?: number;
  shadow?: boolean;
}> = ({ t, talk, expr = 'talk', arms = 'down', walk = 0, hop = 0, lean = 0, tilt = 0, gaze = -0.4, shadow = true }) => {
  const m = Math.max(0, Math.min(1, talk));
  const ph = t * 8;
  const bob = -Math.abs(Math.sin(ph)) * 18 * walk;
  const sway = Math.sin(t * 1.7) * 1.4 + Math.sin(ph) * 2 * walk + lean;
  const breathe = Math.sin(t * 2.6) * 2.5;
  const fidget = Math.sin(t * 2.3) * 4; // criança não fica parada
  const blink = t % 3.3 > 3.18;
  const footL = -Math.max(0, Math.sin(ph)) * 34 * walk;
  const footR = -Math.max(0, -Math.sin(ph)) * 34 * walk;
  const swing = Math.sin(ph) * 18 * walk;
  const P = POSE[arms];

  // ----- rosto -----
  let o = 1, bL = 0, bR = 0, rL = 0, rR = 0, closed = false;
  switch (expr) {
    case 'shock': o = 1.45; bL = bR = -14; break;
    case 'laugh': closed = true; bL = bR = -8; break;
    case 'smile': o = 0.9; bL = bR = -4; break;
    case 'smug': o = 0.75; bL = -14; bR = 4; rL = -6; rR = 10; break;
    case 'pout': o = 0.9; bL = bR = -2; rL = rR = 12; break;
  }
  if (blink && !closed) o = 0.08;
  const hy = -905; // centro da cabeça
  const eyeY = hy - 10;
  const my = hy + 78;
  let mouth: React.ReactNode;
  if (expr === 'laugh' || expr === 'smile') {
    const d = (expr === 'smile' ? 6 : 14) + 18 * m;
    mouth = (
      <g>
        <path d={`M-24,${my - 3} Q0,${my + d} 24,${my - 3} Q0,${my + 2} -24,${my - 3} Z`} fill="#3A1010" />
        <path d={`M-19,${my - 1} Q0,${my + Math.min(d, 7)} 19,${my - 1} Q0,${my + 1} -19,${my - 1} Z`} fill="#F7F3EC" />
      </g>
    );
  } else if (expr === 'smug') {
    mouth = (
      <g>
        <path d={`M-20,${my + 2} Q4,${my + 8 + 10 * m} 26,${my - 8}`} stroke="#8A3A30" strokeWidth={5} fill={m > 0.15 ? '#3A1010' : 'none'} strokeLinecap="round" />
      </g>
    );
  } else {
    const sh = expr === 'shock' ? 8 : 0;
    const ry = 2.5 + 14 * m + sh;
    mouth = (
      <g>
        <ellipse cx={0} cy={my + ry * 0.4} rx={14 + 6 * m + sh * 0.5} ry={ry} fill="#3A1010" />
        {m > 0.25 && <rect x={-10} y={my - 1} width={20} height={4} rx={2} fill="#F7F3EC" />}
        {m > 0.4 && <ellipse cx={0} cy={my + ry * 1.1} rx={8} ry={3.5 * m} fill="#C2635C" />}
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
          <ellipse cx={x} cy={eyeY} rx={18} ry={14 * o} fill="#FBF8F3" />
          <circle cx={x + gx} cy={eyeY + 1} r={Math.min(10, 11 * o)} fill="#4A2E1A" />
          <circle cx={x + gx} cy={eyeY + 1} r={Math.min(5, 5.5 * o)} fill="#120A05" />
          <circle cx={x + gx + 3.5} cy={eyeY - 3} r={3} fill="#fff" />
          <path d={`M${x - 19},${eyeY - 4} Q${x},${eyeY - 17 * o} ${x + 19},${eyeY - 4}`} stroke="#6A4630" strokeWidth={2.5} fill="none" />
        </g>
      )}
      <rect x={x - 22} y={eyeY - 40 + brow} width={44} height={9} rx={4.5} fill="#5A3A22" transform={`rotate(${rot} ${x} ${eyeY - 36 + brow})`} />
    </g>
  );

  const arm = (side: 1 | -1, [s, e]: [number, number]) => {
    const extra = arms === 'down' ? (side > 0 ? swing : -swing) : 0;
    const wob = arms === 'shrug' || arms === 'count' ? Math.sin(t * 6) * 4 : 0;
    return (
      <g transform={`translate(${side * 126},${-790 + breathe}) rotate(${s + extra})`}>
        {/* manga curta */}
        <rect x={-30} y={-14} width={60} height={92} rx={28} fill="url(#pStripes)" />
        <rect x={-30} y={-14} width={60} height={92} rx={28} fill="url(#pShade)" />
        <rect x={-23} y={60} width={46} height={150} rx={23} fill="url(#pSkinArm)" />
        <g transform={`translate(0,200) rotate(${e + wob})`}>
          <rect x={-20} y={-8} width={40} height={150} rx={20} fill="url(#pSkinArm)" />
          <g transform="translate(0,146)"><Hand flip={side < 0} /></g>
        </g>
      </g>
    );
  };

  return (
    <g transform={`translate(0,${-hop}) rotate(${sway})`}>
      {shadow && <ellipse cx={0} cy={hop + 6} rx={170 - Math.min(hop, 120) * 0.4} ry={26} fill="rgba(0,0,0,.28)" />}
      <g transform={`translate(0,${bob})`}>
        {/* pernas + tênis */}
        {[[-52, footL], [52, footR]].map(([x, f], i) => (
          <g key={i} transform={`translate(${x},${f})`}>
            <rect x={-26} y={-360} width={52} height={330} rx={24} fill="url(#pSkinArm)" />
            <rect x={-30} y={-92} width={60} height={34} rx={10} fill="#F4F4F4" />
            <path d={`M-44,-40 Q-44,-70 -10,-70 L24,-70 Q52,-66 58,-30 L58,-6 L-44,-6 Z`} fill="#FAFAFA" stroke="#C8C8C8" strokeWidth={3} transform={i ? 'scale(-1,1)' : ''} />
            <rect x={-46} y={-14} width={106} height={14} rx={6} fill="#2B2B2B" transform={i ? 'scale(-1,1)' : ''} />
            <path d="M-20,-60 l24,0 M-16,-50 l24,0" stroke="#0D80BF" strokeWidth={5} transform={i ? 'scale(-1,1)' : ''} />
          </g>
        ))}
        {/* bermuda */}
        <path d="M-118,-520 L118,-520 L126,-330 L14,-330 L0,-400 L-14,-330 L-126,-330 Z" fill="url(#pShorts)" />
        <path d="M-80,-500 q-8,80 -4,150 M80,-500 q8,80 4,150" stroke="rgba(70,55,35,.35)" strokeWidth={3} fill="none" />
        <rect x={-120} y={-532} width={240} height={26} rx={8} fill="#6E5C40" />
        {/* braços atrás quando cruzados ficam por cima, senão desenhados antes do tronco */}
        {/* tronco (camiseta listrada, sem escudo) */}
        <g transform={`translate(0,${breathe})`}>
          <path d="M-128,-805 C-140,-700 -134,-600 -122,-505 L122,-505 C134,-600 140,-700 128,-805 C90,-830 -90,-830 -128,-805 Z" fill="url(#pStripes)" />
          <path d="M-128,-805 C-140,-700 -134,-600 -122,-505 L122,-505 C134,-600 140,-700 128,-805 C90,-830 -90,-830 -128,-805 Z" fill="url(#pShade)" />
          <path d="M-46,-822 Q0,-786 46,-822" stroke="#F4F4F4" strokeWidth={12} fill="none" strokeLinecap="round" />
          <path d="M-110,-560 Q0,-540 110,-560" stroke="rgba(0,0,0,.18)" strokeWidth={6} fill="none" />
        </g>
        {arm(-1, P.r)}
        {arm(1, P.l)}
        {/* pescoço + cabeça */}
        <rect x={-30} y={-840} width={60} height={60} rx={20} fill="#C99068" />
        <g transform={`rotate(${tilt + fidget * 0.4} 0 ${hy + 120})`}>
          {/* orelhas */}
          <ellipse cx={-118} cy={hy + 6} rx={22} ry={32} fill="#D49E76" />
          <ellipse cx={118} cy={hy + 6} rx={22} ry={32} fill="#D49E76" />
          <ellipse cx={0} cy={hy} rx={120} ry={132} fill="url(#pSkin)" />
          {/* cabelo aparecendo do boné */}
          <path d={`M-118,${hy - 30} Q-122,${hy - 90} -90,${hy - 108} L-70,${hy - 60} Q-100,${hy - 50} -112,${hy + 4} Z`} fill="#4A2E1A" />
          <path d={`M118,${hy - 30} Q122,${hy - 90} 90,${hy - 108} L70,${hy - 60} Q100,${hy - 50} 112,${hy + 4} Z`} fill="#4A2E1A" />
          {/* boné azul virado para trás: domo + aba aparecendo atrás, à direita */}
          <path d={`M66,${hy - 112} Q160,${hy - 150} 196,${hy - 104} Q150,${hy - 92} 90,${hy - 84} Z`} fill="#08507A" />
          <path d={`M-124,${hy - 52} C-120,${hy - 170} 120,${hy - 170} 124,${hy - 52} Q0,${hy - 84} -124,${hy - 52} Z`} fill="url(#pCap)" />
          <path d={`M-40,${hy - 58} Q0,${hy - 70} 40,${hy - 58} L34,${hy - 84} Q0,${hy - 92} -34,${hy - 84} Z`} fill="#F4EBDD" opacity={0.85} />
          <circle cx={0} cy={hy - 150} r={9} fill="#0A5E8F" />
          <path d={`M0,${hy - 148} L0,${hy - 66}`} stroke="rgba(0,0,0,.18)" strokeWidth={3} />
          {/* bochechas + sardas */}
          <ellipse cx={-70} cy={hy + 46} rx={24} ry={14} fill="rgba(230,120,110,.28)" />
          <ellipse cx={70} cy={hy + 46} rx={24} ry={14} fill="rgba(230,120,110,.28)" />
          {[[-80, 30], [-66, 38], [-90, 42], [72, 32], [86, 40], [62, 40]].map(([x, y], i) => <circle key={i} cx={x} cy={hy + y} r={2.6} fill="rgba(140,80,50,.45)" />)}
          {eye(-46, rL, bL)}
          {eye(46, rR, bR)}
          {/* nariz */}
          <path d={`M-4,${hy + 18} Q-16,${hy + 46} -2,${hy + 52} Q10,${hy + 54} 14,${hy + 46}`} stroke="rgba(150,90,60,.6)" strokeWidth={4} fill="none" strokeLinecap="round" />
          {mouth}
        </g>
      </g>
    </g>
  );
};
