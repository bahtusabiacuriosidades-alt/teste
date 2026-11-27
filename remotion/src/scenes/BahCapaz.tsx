import React from 'react';
import { MUST, clamp, kf, pop } from '../lib';
import { StageFrame } from './Gremio';
import { Xis } from './Backgrounds';
import { CuiaIcon } from './Mate';

/* #008 Um "bah", mil significados — cards (1000×1000, centro 0,0). A palavra nunca muda: só a entonação e a tradução. */
const F = 'Montserrat, "Noto Color Emoji", sans-serif';
const INK = '#1E1B18';
export const COR = { good: '#2E7D32', warn: MUST, bad: '#C62828', eca: '#6E7F1F', info: '#3A4A5C', ask: '#5B5F66' };

/* ---------- curvas de entonação (x de -320 a 320) ---------- */
export type Curve = 'up' | 'down' | 'flat' | 'upq' | 'triple' | 'eca' | 'short';
const CURVES: Record<Curve, { d: string; end: [number, number] }> = {
  up: { d: 'M-320,190 C-120,190 120,170 320,70', end: [320, 70] },
  down: { d: 'M-320,80 C-120,90 120,150 320,200', end: [320, 200] },
  flat: { d: 'M-200,140 L200,140', end: [200, 140] },
  short: { d: 'M-120,150 L120,150', end: [120, 150] },
  upq: { d: 'M-320,170 L80,170 C200,170 260,150 320,60', end: [320, 60] },
  triple: { d: 'M-320,170 q53,-90 107,0 q53,-90 107,0 q53,-90 107,0 q53,-90 107,0 q53,-90 107,0 q53,-90 107,0', end: [322, 170] },
  eca: { d: 'M-320,100 C-200,110 -100,200 40,200 L320,200', end: [320, 200] },
};

const Seta: React.FC<{ t: number; curve: Curve; s: number; e: number; y?: number }> = ({ t, curve, s, e, y = 0 }) => {
  const c = CURVES[curve];
  const p = clamp((t - s) / Math.max(0.2, e - s));
  if (t < s) return null;
  return (
    <g transform={`translate(0,${y})`}>
      <path d={c.d} stroke="rgba(0,0,0,.35)" strokeWidth={26} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform="translate(4,6)" />
      <path d={c.d} stroke={MUST} strokeWidth={20} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      {p >= 1 && <circle cx={c.end[0]} cy={c.end[1]} r={20 * pop(t, e, 0.25)} fill="#fff" stroke={MUST} strokeWidth={8} />}
    </g>
  );
};

/* ---------- card de tradução que vira (rotação no eixo X) ---------- */
export type Flip = [number, string, string];
const Traducao: React.FC<{ t: number; flips: Flip[]; y?: number }> = ({ t, flips, y = 360 }) => {
  let idx = -1;
  flips.forEach((f, i) => { if (t >= f[0]) idx = i; });
  const at = idx >= 0 ? flips[idx][0] : 0;
  const k = idx >= 0 ? clamp((t - at) / 0.32) : 1;
  const shown = idx < 0 ? null : k < 0.5 && idx > 0 ? flips[idx - 1] : k < 0.5 ? null : flips[idx];
  const text = shown ? shown[1] : '= ?';
  const bg = shown ? shown[2] : COR.ask;
  const dark = bg === MUST;
  const fs = Math.min(76, 1500 / Math.max(10, text.length));
  return (
    <g transform={`translate(0,${y}) scale(1,${Math.max(0.03, k < 0.5 ? 1 - k * 2 : (k - 0.5) * 2)})`}>
      <rect x={-430} y={-78} width={860} height={156} rx={40} fill="rgba(0,0,0,.35)" transform="translate(6,10)" />
      <rect x={-430} y={-78} width={860} height={156} rx={40} fill={bg} stroke="#fff" strokeWidth={8} />
      <text x={0} y={fs * 0.36} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={fs} fill={dark ? INK : '#fff'}>{text}</text>
    </g>
  );
};

/* ---------- mini cenas (no alto do card, centro 0,-250) ---------- */
export type Cena = 'xis' | 'termica' | 'cuia' | 'lavado' | 'riso' | 'pergunta' | 'livro' | 'chuva' | 'chapeu' | 'relogio' | 'xnao' | 'triste' | 'none';
const MiniCena: React.FC<{ t: number; a: number; cena: Cena }> = ({ t, a, cena }) => {
  const s = pop(t, a, 0.35);
  const u = t - a;
  switch (cena) {
    case 'xis': // virada: o xis cresce até "do tamanho de um prato"
      return <g transform={`translate(0,${-250 + kf(u, [[0, -260], [0.35, 0]])}) scale(${0.2 + 0.24 * clamp(u / 0.8)})`}><Xis /></g>;
    case 'termica': {
      const tilt = kf(u, [[0, 0], [0.4, 70]]);
      const drop = (u - 0.5) % 1.2;
      return (
        <g transform={`translate(-40,-250) scale(${s})`}>
          <g transform={`rotate(${tilt} 0 0)`}>
            <rect x={-55} y={-140} width={110} height={260} rx={30} fill="#3C6E9E" stroke="#fff" strokeWidth={6} />
            <rect x={-40} y={-175} width={80} height={44} rx={12} fill="#2A4E72" />
            <rect x={36} y={-160} width={40} height={18} rx={6} fill="#2A4E72" />
            <rect x={-55} y={-40} width={110} height={18} fill="rgba(255,255,255,.25)" />
          </g>
          {u > 0.5 && drop < 0.8 && <ellipse cx={190} cy={-80 + drop * 220} rx={10} ry={14} fill="#9AD0F5" opacity={1 - drop} />}
          <text x={200} y={110} fontFamily={F} fontWeight={900} fontSize={60} fill="#fff" opacity={clamp(u - 0.6)}>…</text>
        </g>
      );
    }
    case 'cuia': {
      const rot = kf(u, [[0, 0], [0.25, 95]]);
      return (
        <g transform={`translate(0,-230) scale(${0.5 * s})`}>
          <g transform={`rotate(${rot} 0 200)`}><CuiaIcon /></g>
          {u > 0.25 && [0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={240 + i * 40} cy={200 - Math.sin(i) * 30 - clamp((u - 0.25) * 4) * 40} r={16 - i * 2} fill="#6E8B3D" opacity={1 - clamp(u - 0.8)} />
          ))}
        </g>
      );
    }
    case 'lavado':
      return (
        <g transform={`translate(0,-230) scale(${0.5 * s})`}>
          <CuiaIcon />
          {[0, 1, 2].map((k) => {
            const ph = (u * 0.9 + k * 0.33) % 1;
            return <path key={k} d={`M${-60 + k * 60},${-140 - ph * 220} c30,-40 -30,-80 0,-120`} stroke="#9BB52A" strokeOpacity={0.9 * (1 - ph)} strokeWidth={14} fill="none" strokeLinecap="round" />;
          })}
        </g>
      );
    case 'riso':
      return (
        <g transform="translate(0,-250)">
          {[-260, 0, 260].map((x, i) => (
            <text key={i} x={x} y={40 - Math.abs(Math.sin((u - i * 0.15) * 9)) * 50 * clamp(u * 3 - i * 0.4)} textAnchor="middle" fontFamily={F} fontSize={150 * pop(t, a + i * 0.18, 0.3)}>😂</text>
          ))}
        </g>
      );
    case 'pergunta':
      return <text x={0} y={-160} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={260 * s} fill="#fff" stroke={INK} strokeWidth={10} paintOrder="stroke" transform={`rotate(${Math.sin(u * 6) * 8} 0 -250)`}>?</text>;
    case 'livro':
      return (
        <g transform={`translate(0,-260) scale(${s})`}>
          <path d="M-220,-110 Q-110,-150 0,-110 L0,110 Q-110,70 -220,110 Z" fill="#F4EBDD" stroke="#8A6A3A" strokeWidth={8} />
          <path d="M220,-110 Q110,-150 0,-110 L0,110 Q110,70 220,110 Z" fill="#FBF6EC" stroke="#8A6A3A" strokeWidth={8} />
          {[-60, -20, 20, 60].map((y) => <line key={y} x1={-190} y1={y} x2={-30} y2={y - 8} stroke="#B9A27A" strokeWidth={6} />)}
          <text x={110} y={-30} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={44} fill={INK}>ca·paz</text>
          <text x={110} y={30} textAnchor="middle" fontFamily={F} fontWeight={600} fontSize={26} fill="#5A4A30">que consegue</text>
          <text x={110} y={62} textAnchor="middle" fontFamily={F} fontWeight={600} fontSize={26} fill="#5A4A30">fazer as coisas</text>
        </g>
      );
    case 'chuva':
      return (
        <g transform={`translate(0,-280) scale(${s})`}>
          {u > 0.3 && Array.from({ length: 14 }).map((_, i) => {
            const ph = (u * 1.6 + i * 0.37) % 1;
            return <line key={i} x1={-200 + i * 30} y1={40 + ph * 160} x2={-210 + i * 30} y2={70 + ph * 160} stroke="#9AD0F5" strokeWidth={8} strokeLinecap="round" opacity={1 - ph} />;
          })}
          <g fill="#C9D3DD" stroke="#fff" strokeWidth={6}>
            <circle cx={-120} cy={0} r={80} /><circle cx={0} cy={-40} r={110} /><circle cx={130} cy={0} r={85} />
            <rect x={-200} y={0} width={420} height={80} rx={40} />
          </g>
        </g>
      );
    case 'chapeu':
      return (
        <g transform={`translate(0,-240) scale(${s})`}>
          <ellipse cx={0} cy={60} rx={230} ry={46} fill="#1E1B18" />
          <path d="M-120,60 C-130,-30 -110,-110 -80,-120 L80,-120 C110,-110 130,-30 120,60 Z" fill="#2A2522" />
          <rect x={-122} y={20} width={244} height={26} fill={MUST} />
          <text x={250} y={-60} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={140} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke">?!</text>
        </g>
      );
    case 'relogio': {
      const ang = kf(u, [[0, 280], [1.4, 360]]);
      return (
        <g transform={`translate(0,-250) scale(${s})`}>
          <circle cx={0} cy={0} r={170} fill="#FBF6EC" stroke="#3A4A5C" strokeWidth={16} />
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-5} y={-155} width={10} height={26} fill="#3A4A5C" transform={`rotate(${i * 30})`} />)}
          <rect x={-8} y={-100} width={16} height={100} rx={8} fill={INK} />
          <rect x={-6} y={-140} width={12} height={140} rx={6} fill="#C62828" transform={`rotate(${ang})`} />
          <circle r={14} fill={INK} />
          <text x={250} y={-90} textAnchor="middle" fontFamily={F} fontSize={110}>🌙</text>
        </g>
      );
    }
    case 'xnao':
      return (
        <g transform={`translate(0,-250) scale(${s}) rotate(${(1 - s) * 40})`}>
          <circle r={170} fill={COR.bad} stroke="#fff" strokeWidth={12} />
          <path d="M-80,-80 L80,80 M80,-80 L-80,80" stroke="#fff" strokeWidth={40} strokeLinecap="round" />
        </g>
      );
    case 'triste':
      return <text x={0} y={-180} textAnchor="middle" fontFamily={F} fontSize={230 * s} transform={`translate(0,${clamp(u) * 20})`}>😞</text>;
    default:
      return null;
  }
};

/* ---------- card principal: palavra gigante + seta + tradução ---------- */
export const StageBah: React.FC<{
  t: number; a: number; word: string; sub?: string; flips: Flip[]; cena?: Cena; cenaAt?: number;
  curve?: Curve; vs?: number; ve?: number; stretch?: [number, number]; fill?: string;
}> = ({ t, a, word, sub, flips, cena = 'none', cenaAt, curve, vs = 0, ve = 0, stretch, fill = '#2B2320' }) => {
  const s = pop(t, a, 0.3);
  const sx = stretch ? kf(t, [[stretch[0], 0.62], [stretch[1], 1.0]]) : 1;
  /* quebra em duas linhas quando a palavra é comprida */
  let lines = [word];
  if (word.length > 9 && word.includes(' ')) {
    const sp = [...word].map((c, i) => (c === ' ' ? i : -1)).filter((i) => i > 0);
    const mid = sp.reduce((b, i) => (Math.abs(i - word.length / 2) < Math.abs(b - word.length / 2) ? i : b), sp[0]);
    lines = [word.slice(0, mid), word.slice(mid + 1)];
  }
  const longest = Math.max(...lines.map((l) => l.length));
  const fs = Math.min(220, 1180 / Math.max(3, longest)) * (lines.length > 1 ? 0.95 : 1);
  const y0 = (sub ? -40 : -10) - (lines.length - 1) * fs * 0.45;
  return (
    <StageFrame fill={fill}>
      {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={-600 + i * 190} y={-700} width={70} height={1500} fill="rgba(255,255,255,.035)" transform="rotate(20)" />)}
      <g transform={lines.length > 1 ? 'translate(0,-120) scale(0.72)' : 'translate(0,-40) scale(0.85)'}><MiniCena t={t} a={cenaAt ?? a} cena={cena} /></g>
      <g transform={`translate(0,${y0}) scale(${s * sx},${s})`}>
        {lines.map((l, i) => (
          <text key={i} x={0} y={fs * 0.35 + i * fs * 0.9} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={fs} fill="#fff" stroke={INK} strokeWidth={14} paintOrder="stroke">{l}</text>
        ))}
      </g>
      {sub && <text x={0} y={120} textAnchor="middle" fontFamily={F} fontWeight={800} fontSize={40} fill={MUST}>{sub}</text>}
      {curve && <Seta t={t} curve={curve} s={vs} e={ve} y={lines.length > 1 ? 85 : 60} />}
      <Traducao t={t} flips={flips} />
    </StageFrame>
  );
};

/* ---------- abertura: "o bah e o capaz" ---------- */
export const StageDuo: React.FC<{ t: number; a: number; bahT: number; capazT: number; setaT: number }> = ({ t, a, bahT, capazT, setaT }) => (
  <StageFrame fill="#2B2320">
    {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={-600 + i * 190} y={-700} width={70} height={1500} fill="rgba(255,255,255,.035)" transform="rotate(20)" />)}
    <text x={0} y={-330} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={48} fill={MUST} opacity={clamp((t - a) * 3)}>DUAS PALAVRAS…</text>
    {t > bahT && <g transform={`translate(-210,-110) rotate(-6) scale(${pop(t, bahT, 0.3)})`}><text textAnchor="middle" y={60} fontFamily={F} fontWeight={900} fontSize={190} fill="#fff" stroke={INK} strokeWidth={14} paintOrder="stroke">BAH</text></g>}
    {t > capazT && <g transform={`translate(190,60) rotate(5) scale(${pop(t, capazT, 0.3)})`}><text textAnchor="middle" y={60} fontFamily={F} fontWeight={900} fontSize={170} fill={MUST} stroke={INK} strokeWidth={14} paintOrder="stroke">CAPAZ</text></g>}
    {t > setaT && (
      <g>
        <Seta t={t} curve="triple" s={setaT} e={setaT + 1.1} y={170} />
        <text x={0} y={470} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={44} fill="#fff" opacity={clamp((t - setaT - 0.6) * 3)}>…MIL JEITOS DE FALAR</text>
      </g>
    )}
  </StageFrame>
);
