import React from 'react';
import { MUST, clamp, easeOut, easeInOut, kf, lerp, pop } from '../lib';
import { StageFrame } from './Gremio';

/* #007 Caxias do Sul — cenário da Serra, cards (1000×1000, centro 0,0) e métricas. Sem fotos de terceiros. */
const F = 'Montserrat';
export const UVA = '#5B2A6E';
export const GRENA = '#7A1F2B';
export const JUVE = '#1E7B3A';
const INK = '#1E1B18';

/* ---------- araucária (silhueta semi-realista) ---------- */
export const Araucaria: React.FC<{ x: number; y: number; s?: number; c?: string; t?: number }> = ({ x, y, s = 1, c = '#2F4A3A', t = 0 }) => {
  const sw = Math.sin(t * 0.8 + x) * 1.5;
  return (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${sw * 0.3})`}>
      <path d="M-6,0 L-4,-260 L4,-260 L6,0 Z" fill={c} />
      {[-250, -225, -200].map((yy, i) => {
        const r = 70 + i * 30;
        return (
          <g key={i}>
            <path d={`M0,${yy} Q${-r * 0.6},${yy + 10} ${-r},${yy - 30}`} stroke={c} strokeWidth={6} fill="none" />
            <path d={`M0,${yy} Q${r * 0.6},${yy + 10} ${r},${yy - 30}`} stroke={c} strokeWidth={6} fill="none" />
            <ellipse cx={-r} cy={yy - 34} rx={26} ry={10} fill={c} />
            <ellipse cx={r} cy={yy - 34} rx={26} ry={10} fill={c} />
          </g>
        );
      })}
      <ellipse cx={0} cy={-268} rx={60} ry={14} fill={c} />
    </g>
  );
};

/* ---------- casa de colono (pedra embaixo, madeira em cima, lambrequim) ---------- */
export const CasaColono: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-120} y={-90} width={240} height={90} fill="#9A9184" />
    {Array.from({ length: 12 }).map((_, i) => (
      <rect key={i} x={-120 + (i % 6) * 40 + (Math.floor(i / 6) % 2) * 20} y={-90 + Math.floor(i / 6) * 45} width={38} height={43} fill="none" stroke="#7A7266" strokeWidth={3} />
    ))}
    <rect x={-120} y={-200} width={240} height={110} fill="#B07A4A" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-120 + i * 20} y={-200} width={2} height={110} fill="#8A5A34" />)}
    <path d="M-150,-196 L0,-290 L150,-196 Z" fill="#7A3A2A" />
    {/* lambrequim (beiral recortado) */}
    {Array.from({ length: 15 }).map((_, i) => <path key={i} d={`M${-150 + i * 20},-196 l10,14 l10,-14 Z`} fill="#F4EBDD" />)}
    <rect x={-80} y={-170} width={40} height={50} fill="#F4E3A0" stroke="#5A3A20" strokeWidth={4} />
    <rect x={40} y={-170} width={40} height={50} fill="#F4E3A0" stroke="#5A3A20" strokeWidth={4} />
    <rect x={-22} y={-70} width={44} height={70} fill="#5A3A20" />
  </g>
);

/* ---------- parreiral em perspectiva ---------- */
const Parreiral: React.FC<{ w: number; y0: number; y1: number; t: number; vx: number }> = ({ w, y0, y1, t, vx }) => (
  <g>
    {Array.from({ length: 9 }).map((_, i) => {
      const xb = -300 + i * ((w + 600) / 8);
      return (
        <g key={i}>
          <path d={`M${vx},${y0} L${xb},${y1}`} stroke="#3E5A22" strokeWidth={4 + i * 0} opacity={0.6} />
          {Array.from({ length: 7 }).map((_, k) => {
            const p = (k + 1) / 7;
            const pp = p * p;
            const x = lerp(vx, xb, pp), y = lerp(y0, y1, pp);
            const r = 6 + pp * 34;
            return (
              <g key={k}>
                <rect x={x - 1.5 - pp * 2} y={y - r * 1.6} width={3 + pp * 4} height={r * 1.6} fill="#5A4030" />
                <ellipse cx={x} cy={y - r * 1.5} rx={r * 1.5} ry={r * 0.8} fill={k % 2 ? '#4E7A2E' : '#5C8A34'} transform={`rotate(${Math.sin(t * 1.2 + i + k) * 3} ${x} ${y - r * 1.5})`} />
                {pp > 0.3 && <circle cx={x + r * 0.4} cy={y - r * 1.0} r={r * 0.28} fill={UVA} />}
              </g>
            );
          })}
        </g>
      );
    })}
  </g>
);

/* ---------- mundo da Serra: coxilhas, araucárias, neblina, parreiral, estrada de chão ---------- */
export const SerraWorld: React.FC<{ t: number; w?: number; h?: number; snow?: number; cold?: number }> = ({ t, w = 1080, h = 1920, snow = 0, cold = 0 }) => {
  const horizon = h * 0.64, base = h * 0.8;
  const ridge = (y: number, amp: number, ph: number, f: number) => {
    let d = `M-700,${h + 700} L-700,${y}`;
    for (let x = -700; x <= w + 700; x += 40) d += ` L${x},${y - amp * (0.55 + 0.45 * Math.sin(x / f + ph)) - amp * 0.25 * Math.sin(x / (f * 0.37) + ph * 2)}`;
    return d + ` L${w + 700},${h + 700} Z`;
  };
  return (
    <g>
      <defs>
        <linearGradient id="swSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={cold ? '#7D93AE' : '#5E86B8'} />
          <stop offset="0.6" stopColor={cold ? '#C9D2DC' : '#B8CCE0'} />
          <stop offset="1" stopColor={cold ? '#E4E6E8' : '#F2DDB4'} />
        </linearGradient>
        <linearGradient id="swGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6E8F3E" />
          <stop offset="1" stopColor="#4A6A2A" />
        </linearGradient>
        <radialGradient id="swSun">
          <stop offset="0" stopColor="#FFF6D8" />
          <stop offset="1" stopColor="#FFE3A0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={-700} y={-700} width={w + 1400} height={h + 1400} fill="url(#swSky)" />
      <circle cx={w * 0.78} cy={horizon - h * 0.16} r={h * 0.12} fill="url(#swSun)" opacity={cold ? 0.4 : 0.9} />
      {[0, 1, 2].map((i) => {
        const x = ((i * 520 + t * 10) % (w + 1000)) - 500;
        return <ellipse key={i} cx={x} cy={h * (0.1 + 0.08 * i)} rx={240} ry={26} fill="#fff" opacity={0.35} />;
      })}
      <path d={ridge(horizon - h * 0.02, h * 0.12, 0.4, 260)} fill="#8FA3B8" />
      <rect x={-700} y={horizon - h * 0.09 + Math.sin(t * 0.3) * 6} width={w + 1400} height={h * 0.05} fill="#fff" opacity={0.28} />
      <path d={ridge(horizon + h * 0.03, h * 0.1, 2.1, 210)} fill="#6F8A7E" />
      {/* cidade ao longe (escala pequena: perspectiva) */}
      <g fill="#5E726A" opacity={0.9}>
        {Array.from({ length: 16 }).map((_, i) => {
          const bw = 14 + ((i * 7) % 12), bh = 18 + ((i * 13) % 34);
          return <rect key={i} x={w * 0.52 + i * 18} y={horizon + h * 0.0 - bh + Math.sin(i) * 3} width={bw} height={bh} />;
        })}
        <path d={`M${w * 0.52 + 150},${horizon - 40} l8,-36 l8,36 Z`} />
      </g>
      {[0.08, 0.2, 0.33, 0.9, 1.0].map((k, i) => <Araucaria key={i} x={w * k} y={horizon + h * 0.04} s={0.32 + (i % 2) * 0.08} c="#3E5A4A" t={t} />)}
      <rect x={-700} y={horizon + h * 0.01 + Math.sin(t * 0.25 + 1) * 8} width={w + 1400} height={h * 0.035} fill="#fff" opacity={0.25} />
      <path d={ridge(horizon + h * 0.08, h * 0.06, 4.0, 330)} fill="url(#swGround)" />
      <Parreiral w={w} y0={horizon + h * 0.065} y1={base + h * 0.06} t={t} vx={w * 0.62} />
      <CasaColono x={w * 0.17} y={horizon + h * 0.105} s={w > 1500 ? 0.55 : 0.42} />
      {[-0.06, 1.05].map((k, i) => <Araucaria key={i} x={w * k} y={base + h * 0.05} s={1.0} c="#2A4232" t={t} />)}
      {/* estrada de chão */}
      <path d={`M-700,${h * 0.93} Q${w / 2},${h * 0.9} ${w + 700},${h * 0.93} L${w + 700},${h + 700} L-700,${h + 700} Z`} fill="#A88F6A" />
      <path d={`M-700,${h * 0.93} Q${w / 2},${h * 0.9} ${w + 700},${h * 0.93}`} stroke="#7E6A4C" strokeWidth={6} fill="none" />
      {Array.from({ length: 14 }).map((_, i) => <ellipse key={i} cx={(i * 173) % (w + 200) - 100} cy={h * 0.95 + (i % 3) * 18} rx={10} ry={4} fill="#8A7454" />)}
      {cold > 0 && <rect x={-700} y={-700} width={w + 1400} height={h + 1400} fill="#DDEBF5" opacity={0.22 * cold} />}
      {snow > 0 && Array.from({ length: 70 }).map((_, i) => {
        const sx = ((i * 97.3) % (w + 200)) - 100 + Math.sin(t * 1.3 + i) * 20;
        const sy = ((i * 211.7 + t * (60 + (i % 5) * 18)) % (h + 100)) - 50;
        return <circle key={i} cx={sx} cy={sy} r={3 + (i % 4) * 1.5} fill="#fff" opacity={0.9 * snow} />;
      })}
    </g>
  );
};

/* ---------- 1 · placa de estrada que gira e troca de nome ---------- */
export const StagePlaca: React.FC<{ t: number; names: [number, string, string?][]; old?: boolean }> = ({ t, names }) => {
  let idx = 0;
  names.forEach((n, i) => { if (t >= n[0]) idx = i; });
  const at = names[idx][0];
  const flip = idx > 0 ? clamp((t - at) / 0.35) : 1;
  const sy = idx > 0 ? Math.abs(Math.cos(Math.PI * (1 - flip) * 0.5)) : 1;
  const cur = names[idx];
  const show = idx > 0 && flip < 0.5 ? names[idx - 1] : cur;
  const wood = show[1].includes('BUGRES');
  return (
    <StageFrame fill="#BFD3E2">
      <path d="M-500,180 Q0,120 500,190 L500,500 L-500,500 Z" fill="#7A9A4A" />
      <path d="M-120,500 Q-20,300 0,160 Q20,300 120,500 Z" fill="#A88F6A" />
      <Araucaria x={-360} y={190} s={0.7} c="#2F4A3A" t={t} />
      <Araucaria x={380} y={200} s={0.55} c="#3E5A4A" t={t} />
      <rect x={-14} y={-60} width={28} height={330} fill="#5A4030" />
      <g transform={`translate(0,-110) scale(1,${Math.max(0.04, sy)})`}>
        <rect x={-400} y={-120} width={800} height={240} rx={wood ? 10 : 24} fill={wood ? '#9A6A3A' : '#1F6B3A'} stroke={wood ? '#5A3A20' : '#fff'} strokeWidth={12} />
        {wood && [-60, 0, 60].map((y) => <rect key={y} x={-390} y={y - 2} width={780} height={4} fill="#7A4E26" opacity={0.6} />)}
        <text x={0} y={show[2] ? 10 : 30} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={Math.min(96, 1000 / show[1].length)} fill={wood ? '#2A1A0A' : '#fff'}>{show[1]}</text>
        {show[2] && <text x={0} y={85} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={52} fill={wood ? '#3A2410' : MUST}>{show[2]}</text>}
      </g>
    </StageFrame>
  );
};

/* ---------- 2 · a clareira com fontes de água e os tropeiros ---------- */
export const StageClareira: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const lt = t - a;
  return (
    <StageFrame fill="#C9DCE6">
      <path d="M-500,-60 Q-200,-140 100,-80 T500,-90 L500,500 L-500,500 Z" fill="#6E8F3E" />
      {[-430, -320, -230, 260, 360, 450].map((x, i) => <Araucaria key={i} x={x} y={-60 + (i % 2) * 30} s={0.55 + (i % 3) * 0.1} c="#2F4A3A" t={t} />)}
      <ellipse cx={0} cy={170} rx={360} ry={150} fill="#8DB04E" />
      {/* olho d'água */}
      <ellipse cx={-60} cy={190} rx={130} ry={40} fill="#5FA8D0" stroke="#3E7A9A" strokeWidth={5} />
      {[0, 1, 2].map((k) => {
        const ph = (lt * 0.6 + k / 3) % 1;
        return <ellipse key={k} cx={-60} cy={190} rx={20 + ph * 110} ry={6 + ph * 34} fill="none" stroke="#E8F6FF" strokeWidth={3} opacity={1 - ph} />;
      })}
      {/* trilha dos tropeiros */}
      <path d="M-500,330 Q-100,260 120,300 T500,240" stroke="#B49A6A" strokeWidth={34} fill="none" />
      {[0, 1, 2].map((k) => {
        const x = -560 + ((lt * 70 + k * 150) % 1150);
        const y = 330 - ((x + 500) / 1000) * 70;
        return (
          <g key={k} transform={`translate(${x},${y - 30})`}>
            <ellipse cx={0} cy={-34} rx={46} ry={22} fill="#5A4030" />
            <rect x={-6} y={-70} width={34} height={26} rx={6} fill="#B07A4A" />
            <path d="M38,-44 l26,-30 l10,8 l-18,30 Z" fill="#5A4030" />
            {[-30, -12, 14, 32].map((lx, j) => <rect key={j} x={lx} y={-16} width={7} height={34 + Math.sin(lt * 8 + j * 1.6 + k) * 6} fill="#3E2A1A" />)}
          </g>
        );
      })}
      <g transform={`translate(0,-330) scale(${pop(t, a + 0.3)})`}>
        <rect x={-360} y={-55} width={720} height={110} rx={55} fill="rgba(20,16,12,.9)" />
        <text x={0} y={20} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={50} fill="#fff">💧 POUSO DE TROPEIROS</text>
      </g>
    </StageFrame>
  );
};

/* ---------- 3 · trecho sóbrio: a mata ao entardecer, figuras sem rosto se afastando ---------- */
export const StageMata: React.FC<{ t: number; a: number; label?: string }> = ({ t, a, label = 'UMA HISTÓRIA QUE NÃO SE ESQUECE' }) => {
  const lt = t - a;
  return (
    <StageFrame fill="#2A3040">
      <rect x={-500} y={-500} width={1000} height={1000} fill="#2A3040" />
      <circle cx={260} cy={-250} r={90} fill="#C9C0A8" opacity={0.35} />
      <path d="M-500,120 Q0,60 500,130 L500,500 L-500,500 Z" fill="#1E2430" />
      {[-440, -330, -210, -90, 60, 190, 320, 440].map((x, i) => <Araucaria key={i} x={x} y={130 + (i % 3) * 20} s={0.7 + (i % 2) * 0.2} c="#151A24" t={t * 0.3} />)}
      {[0, 1, 2, 3].map((k) => {
        const x = -40 + k * 60 + lt * 12;
        const o = clamp(1 - lt / 9) * 0.85;
        return (
          <g key={k} transform={`translate(${x},${250 - k * 6}) scale(${0.9 - k * 0.08})`} opacity={o}>
            <circle cx={0} cy={-130} r={20} fill="#0E1118" />
            <path d="M-24,-108 Q0,-118 24,-108 L30,-20 L-30,-20 Z" fill="#0E1118" />
            <rect x={-18} y={-22} width={12} height={60} fill="#0E1118" />
            <rect x={6} y={-22} width={12} height={60} fill="#0E1118" />
          </g>
        );
      })}
      <text x={0} y={-360} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={44} fill="#C9C0A8" opacity={clamp(lt / 1.2)}>{label}</text>
    </StageFrame>
  );
};

/* ---------- 4 · a viagem: Vêneto → oceano → serra ---------- */
export const StageViagem: React.FC<{ t: number; prog: number; showRiver?: boolean }> = ({ t, prog }) => {
  const A = { x: 300, y: -260 }, B = { x: -300, y: 230 }, C = { x: 300, y: 200 };
  const k = clamp(prog);
  const p = { x: (1 - k) ** 2 * A.x + 2 * (1 - k) * k * C.x + k * k * B.x, y: (1 - k) ** 2 * A.y + 2 * (1 - k) * k * C.y + k * k * B.y };
  return (
    <StageFrame fill="#7FB7DA">
      {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M-500,${-380 + i * 110} q60,${-14 + Math.sin(t * 2 + i) * 6} 120,0 t120,0 t120,0 t120,0 t120,0 t120,0 t120,0 t120,0 t120,0`} stroke="#A9D3EC" strokeWidth={4} fill="none" opacity={0.6} />)}
      {/* Europa (estilizada, não é mapa exato) */}
      <path d="M140,-500 L500,-500 L500,-120 Q430,-150 400,-200 Q360,-170 330,-230 Q300,-200 260,-260 Q220,-300 190,-360 Q150,-420 140,-500 Z" fill="#D8C9A0" stroke="#9A8A64" strokeWidth={6} />
      {/* América do Sul (estilizada) */}
      <path d="M-500,-60 Q-380,-80 -300,-20 Q-200,60 -170,160 Q-160,260 -240,360 Q-300,430 -330,500 L-500,500 Z" fill="#B9D38A" stroke="#7FA357" strokeWidth={6} />
      <path d={`M${A.x},${A.y} Q${C.x},${C.y} ${B.x},${B.y}`} fill="none" stroke="#fff" strokeWidth={8} strokeDasharray="18 16" opacity={0.85} />
      {[[A, '📍 VÊNETO', 0], [B, '📍 SERRA GAÚCHA', 1]].map(([q, lbl, i]: any) => (
        <g key={i}>
          <circle cx={q.x} cy={q.y} r={18} fill="#C62828" stroke="#fff" strokeWidth={6} />
          <text x={q.x + (i ? 40 : -10)} y={q.y + (i ? 80 : -40)} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={44} fill={INK}>{lbl}</text>
        </g>
      ))}
      <g transform={`translate(${p.x},${p.y + Math.sin(t * 3) * 6}) rotate(${Math.sin(t * 2) * 4})`}>
        <path d="M-70,0 L70,0 L50,34 L-50,34 Z" fill="#5A3A20" />
        <rect x={-6} y={-90} width={10} height={90} fill="#3E2A1A" />
        <path d="M4,-86 Q60,-50 4,-12 Z" fill="#F4EBDD" />
        <path d="M-60,4 L60,4" stroke="#8A5A34" strokeWidth={6} />
      </g>
      <g transform="translate(-210,-380)">
        <rect x={-110} y={-46} width={220} height={92} rx={46} fill={MUST} />
        <text x={0} y={18} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={54} fill={INK}>1875</text>
      </g>
    </StageFrame>
  );
};

/* ---------- família de imigrantes (silhueta simples com mala) ---------- */
const Familia: React.FC<{ t: number; walk: number }> = ({ t, walk }) => (
  <g>
    {[0, 1, 2].map((k) => {
      const s = k === 2 ? 0.65 : 1;
      const bob = -Math.abs(Math.sin(t * 7 + k)) * 6 * walk;
      return (
        <g key={k} transform={`translate(${-k * 70},${bob}) scale(${s})`}>
          <circle cx={0} cy={-150} r={20} fill="#C9946A" />
          <path d={k === 1 ? 'M-26,-128 L26,-128 L40,-10 L-40,-10 Z' : 'M-24,-128 L24,-128 L22,-50 L-22,-50 Z'} fill={k === 1 ? '#7A3A2A' : '#4A4A5A'} />
          {k !== 1 && <><rect x={-20} y={-52} width={14} height={52} fill="#3A3A44" /><rect x={6} y={-52} width={14} height={52} fill="#3A3A44" /></>}
          <path d={k === 1 ? 'M-22,-176 Q0,-196 22,-176 L22,-160 L-22,-160 Z' : 'M-24,-166 L24,-166 L18,-178 L-18,-178 Z'} fill={k === 1 ? '#E9D6B0' : '#3A2A1A'} />
          {k === 0 && <rect x={24} y={-90} width={46} height={36} rx={6} fill="#8A5A34" stroke="#4A2A10" strokeWidth={4} />}
          {k === 1 && <ellipse cx={-44} cy={-110} rx={26} ry={30} fill="#B07A4A" />}
        </g>
      );
    })}
  </g>
);

/* ---------- MÉTRICA: régua de altitude (família subindo a serra) ---------- */
export const MetricAltitude: React.FC<{ t: number; a: number; val?: number }> = ({ t, a, val = 800 }) => {
  const k = easeInOut(clamp((t - a - 0.3) / 2.6));
  const fx = lerp(-380, 120, k), fy = lerp(320, -140, k);
  const n = Math.round(k * val);
  return (
    <StageFrame fill="#B8CCE0">
      <path d="M-500,420 L-500,360 Q-150,330 120,-120 Q200,-240 260,-260 L500,-260 L500,500 L-500,500 Z" fill="#6E8F3E" />
      <path d="M-500,380 Q-150,350 120,-100 Q200,-220 260,-240" stroke="#B49A6A" strokeWidth={18} fill="none" strokeDasharray="30 14" />
      {[-300, -120, 360, 440].map((x, i) => <Araucaria key={i} x={x} y={i < 2 ? 340 - i * 140 : -250} s={0.45} c="#2F4A3A" t={t} />)}
      <g transform={`translate(${fx},${fy})`}><Familia t={t} walk={k > 0 && k < 1 ? 1 : 0} /></g>
      {/* régua */}
      <g transform="translate(400,0)">
        <rect x={-34} y={-380} width={68} height={760} rx={14} fill="rgba(20,16,12,.85)" />
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-34} y={360 - i * 90} width={i % 2 ? 22 : 40} height={5} fill="#fff" />)}
        <rect x={-14} y={lerp(360, -360, k)} width={28} height={lerp(0, 720, k)} rx={8} fill={MUST} />
      </g>
      <g transform="translate(-170,-330)">
        <rect x={-260} y={-90} width={520} height={180} rx={30} fill="rgba(20,16,12,.9)" stroke={MUST} strokeWidth={6} />
        <text x={0} y={20} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill={MUST}>≈ {n} m</text>
        <text x={0} y={70} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={30} fill="#fff">ACIMA DO NÍVEL DO MAR</text>
      </g>
      <text x={-470} y={470} fontFamily={F} fontWeight={700} fontSize={22} fill="rgba(20,16,12,.75)">valor aproximado</text>
    </StageFrame>
  );
};

/* ---------- MÉTRICA: marcador de km na estrada (Porto Alegre → Caxias) ---------- */
export const MetricKm: React.FC<{ t: number; a: number; val?: number }> = ({ t, a, val = 130 }) => {
  const k = easeInOut(clamp((t - a - 0.3) / 2.8));
  const path = 'M-360,330 C-200,300 -260,150 -80,120 C120,90 40,-60 180,-120 C300,-170 260,-280 340,-320';
  return (
    <StageFrame fill="#C9DCA8">
      <path d={path} stroke="#7E6A4C" strokeWidth={60} fill="none" strokeLinecap="round" />
      <path d={path} stroke="#F4EBDD" strokeWidth={6} fill="none" strokeDasharray="22 22" />
      <path d={path} stroke={MUST} strokeWidth={22} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} opacity={0.9} />
      {[[-360, 330, 'PORTO ALEGRE', 1], [340, -320, 'CAXIAS DO SUL', 0]].map(([x, y, l, i]: any) => (
        <g key={l}>
          <circle cx={x} cy={y} r={24} fill="#C62828" stroke="#fff" strokeWidth={7} />
          <text x={x + (i ? 80 : -60)} y={y + (i ? 80 : -50)} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={40} fill={INK}>{l}</text>
        </g>
      ))}
      <g transform="translate(-180,-300)">
        <rect x={-190} y={-110} width={380} height={220} rx={24} fill="#1F6B3A" stroke="#fff" strokeWidth={8} />
        <text x={0} y={30} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill="#fff">≈ {Math.round(k * val)}</text>
        <text x={0} y={85} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={40} fill={MUST}>KM DE ESTRADA</text>
      </g>
      <text x={460} y={470} textAnchor="end" fontFamily={F} fontWeight={700} fontSize={22} fill="rgba(20,16,12,.75)">aproximado · varia conforme a rota</text>
    </StageFrame>
  );
};

/* ---------- MÉTRICA: barras de população (IBGE, Censo 2022) ---------- */
export const MetricPop: React.FC<{ t: number; a: number; canoas?: boolean }> = ({ t, a, canoas = true }) => {
  const rows: [string, number, string][] = [['PORTO ALEGRE', 1332570, '#5A6A7A'], ['CAXIAS DO SUL', 463338, MUST], ...(canoas ? [['CANOAS', 347657, '#5A6A7A'] as [string, number, string]] : [])];
  const max = 1332570;
  const fmt = (n: number) => n.toLocaleString('pt-BR');
  return (
    <StageFrame fill="#F4EBDD">
      <text x={0} y={-370} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={54} fill={INK}>👥 MORADORES</text>
      {rows.map(([name, v, c], i) => {
        const k = easeOut(clamp((t - a - 0.3 - i * 0.35) / 1.6));
        const y = -250 + i * 220;
        const bw = (v / max) * 540 * k;
        const hl = name === 'CAXIAS DO SUL';
        return (
          <g key={name}>
            <text x={-420} y={y} fontFamily={F} fontWeight={900} fontSize={40} fill={hl ? '#8A5A10' : '#3A3A3A'}>{hl ? '2º · ' : i === 0 ? '1º · ' : '3º · '}{name}</text>
            <rect x={-420} y={y + 20} width={Math.max(4, bw)} height={100} rx={16} fill={c} stroke={hl ? INK : 'none'} strokeWidth={hl ? 6 : 0} />
            <text x={-420 + Math.max(4, bw) + 18} y={y + 88} fontFamily={F} fontWeight={900} fontSize={hl ? 58 : 46} fill={INK}>{fmt(Math.round(v * k))}</text>
          </g>
        );
      })}
      <text x={0} y={470} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={26} fill="rgba(20,16,12,.7)">Fonte: IBGE, Censo 2022</text>
    </StageFrame>
  );
};

/* ---------- MÉTRICA: termômetro (julho × janeiro) ---------- */
export const MetricTermo: React.FC<{ t: number; a: number; downT: number; upT?: number }> = ({ t, a, downT, upT }) => {
  const down = easeInOut(clamp((t - downT) / 1.6));
  const up = upT ? easeInOut(clamp((t - upT) / 1.6)) : 0;
  const temp = up > 0 ? lerp(8, 27, up) : lerp(20, 8, down);
  const frac = (temp + 5) / 40;
  const hot = up > 0.5;
  return (
    <StageFrame fill={hot ? '#F6E2B8' : '#DCE9F2'}>
      {!hot && Array.from({ length: 40 }).map((_, i) => {
        const sx = ((i * 97) % 1000) - 500, sy = ((i * 173 + t * 70) % 1000) - 500;
        return <circle key={i} cx={sx} cy={sy} r={4 + (i % 3) * 2} fill="#fff" opacity={0.85 * down} />;
      })}
      {hot && <circle cx={300} cy={-300} r={110} fill="#FFD27A" opacity={up} />}
      <g transform="translate(-180,0)">
        <rect x={-50} y={-380} width={100} height={640} rx={50} fill="#fff" stroke={INK} strokeWidth={10} />
        <circle cx={0} cy={300} r={95} fill={temp < 12 ? '#3A8FD0' : '#D84A3A'} stroke={INK} strokeWidth={10} />
        <rect x={-26} y={240 - frac * 600} width={52} height={frac * 600 + 60} rx={26} fill={temp < 12 ? '#3A8FD0' : '#D84A3A'} />
        {[0, 10, 20, 30].map((v) => {
          const y = 240 - ((v + 5) / 40) * 600 + 60;
          return (
            <g key={v}>
              <rect x={56} y={y - 3} width={40} height={6} fill={INK} />
              <text x={110} y={y + 14} fontFamily={F} fontWeight={900} fontSize={38} fill={INK}>{v}°</text>
            </g>
          );
        })}
      </g>
      <g transform="translate(240,-120)">
        <rect x={-230} y={-120} width={460} height={240} rx={30} fill="rgba(20,16,12,.9)" stroke={hot ? '#D84A3A' : '#3A8FD0'} strokeWidth={7} />
        <text x={0} y={10} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={120} fill="#fff">≈ {Math.round(temp)}°C</text>
        <text x={0} y={80} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={29} fill={hot ? MUST : '#9FD0F0'}>{hot ? '☀️ MÁX. MÉDIA · JANEIRO' : '❄️ MÍN. MÉDIA · JULHO'}</text>
      </g>
      <text x={0} y={470} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={24} fill="rgba(20,16,12,.7)">Médias de 30 anos (Climatempo) · valores aproximados</text>
    </StageFrame>
  );
};

/* ---------- clubes: só cores e nome, sem escudo ---------- */
export const StageClubes: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <StageFrame fill="#EDE6DA">
    {[['JUVENTUDE', JUVE, '#fff', -1], ['CAXIAS', GRENA, '#fff', 1]].map(([n, c1, c2, s]: any, i) => (
      <g key={n} transform={`translate(${s * 220},${-20}) rotate(${s * 6 + Math.sin(t * 3 + i) * 2}) scale(${pop(t, a + 0.2 + i * 0.4)})`}>
        <rect x={-190} y={-280} width={380} height={520} rx={18} fill={c1} />
        {[0, 1, 2].map((k) => <rect key={k} x={-190} y={-200 + k * 160} width={380} height={50} fill={c2} opacity={0.9} />)}
        <rect x={-210} y={-300} width={420} height={30} rx={15} fill="#5A4030" />
        <text x={0} y={310} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={62} fill={INK}>{n}</text>
      </g>
    ))}
    <text x={0} y={-400} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={46} fill={INK}>⚽ OS TIMES DE CAXIAS</text>
  </StageFrame>
);

/* ---------- cacho de uva + Festa da Uva ---------- */
export const Cacho: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M0,-150 Q10,-190 40,-210" stroke="#5A4030" strokeWidth={14} fill="none" />
    <path d="M10,-160 Q90,-220 130,-150 Q70,-140 10,-160 Z" fill="#5C8A34" />
    {[[0, -110], [-50, -90], [50, -90], [-80, -40], [-25, -45], [30, -45], [80, -40], [-55, 10], [0, 5], [55, 10], [-25, 55], [25, 55], [0, 100]].map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r={36} fill={UVA} />
        <circle cx={x - 10} cy={y - 12} r={9} fill="#fff" opacity={0.35} />
      </g>
    ))}
  </g>
);
export const StageUva: React.FC<{ t: number; a: number; pisaT?: number }> = ({ t, a, pisaT }) => {
  const lt = t - a;
  const pisa = pisaT !== undefined && t > pisaT;
  return (
    <StageFrame fill="#F2DDB4">
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-500 + i * 100} y={-500} width={50} height={1000} fill="#EBCF9E" opacity={0.6} />)}
      <g transform={`translate(${pisa ? -230 : 0},${-60}) rotate(${Math.sin(t * 2) * 4}) scale(${pop(t, a + 0.1, 0.35) * (pisa ? 0.8 : 1.35)})`}><Cacho /></g>
      {pisa && (
        <g transform="translate(200,120)">
          <path d="M-200,40 L200,40 L170,200 L-170,200 Z" fill="#8A5A34" stroke="#4A2A10" strokeWidth={8} />
          {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={-150 + (i % 6) * 60} cy={60 + Math.floor(i / 6) * 30} r={22} fill={UVA} />)}
          <g transform={`translate(0,${-60 + Math.abs(Math.sin((t - pisaT!) * 5)) * 70})`}>
            <rect x={-40} y={-200} width={70} height={170} rx={20} fill="#C9946A" />
            <ellipse cx={0} cy={-30} rx={70} ry={30} fill="#C9946A" />
          </g>
        </g>
      )}
      <g transform={`translate(0,360) scale(${pop(t, a + 0.5)})`}>
        <rect x={-400} y={-70} width={800} height={140} rx={70} fill={UVA} stroke="#fff" strokeWidth={8} />
        <text x={0} y={22} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={56} fill="#fff">🍇 FESTA DA UVA · 1931</text>
      </g>
    </StageFrame>
  );
};

/* ---------- Pérola das Colônias (longo) ---------- */
export const StagePerola: React.FC<{ t: number; a: number; factoryT: number }> = ({ t, a, factoryT }) => {
  const f = easeOut(clamp((t - factoryT) / 1.2));
  return (
    <StageFrame fill="#24324A">
      {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={((i * 137) % 1000) - 500} cy={((i * 211) % 600) - 500} r={2 + (i % 3)} fill="#fff" opacity={0.4 + 0.3 * Math.sin(t * 2 + i)} />)}
      <path d="M-500,250 Q-200,150 0,200 T500,180 L500,500 L-500,500 Z" fill="#3E5A4A" />
      {/* oficina → fábrica */}
      <g transform="translate(-220,250)">
        <rect x={-120} y={-120} width={240} height={120} fill="#8A6A4A" />
        <path d="M-130,-120 L0,-190 L130,-120 Z" fill="#6A3A2A" />
        <g opacity={f}>
          <rect x={-170} y={-200} width={340} height={200} fill="#6A6A72" />
          {[-120, -40, 40, 120].map((x) => <rect key={x} x={x - 22} y={-170} width={44} height={50} fill="#F4D27A" />)}
          <rect x={110} y={-340} width={46} height={150} fill="#5A5A62" />
          {[0, 1, 2].map((k) => {
            const ph = (t * 0.5 + k / 3) % 1;
            return <circle key={k} cx={133 + ph * 60} cy={-350 - ph * 120} r={20 + ph * 30} fill="#C9CCD2" opacity={0.7 * (1 - ph)} />;
          })}
        </g>
      </g>
      <g transform={`translate(180,-110) scale(${pop(t, a + 0.2, 0.4)})`}>
        <circle r={150} fill="#F4F0E8" />
        <circle r={150} fill="none" stroke="#fff" strokeWidth={10} opacity={0.6 + 0.4 * Math.sin(t * 4)} />
        <circle cx={-50} cy={-50} r={40} fill="#fff" />
        {[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={-4} y={-230} width={8} height={50} fill="#FFF3C4" transform={`rotate(${k * 60 + t * 20})`} opacity={0.7} />)}
      </g>
      <g transform={`translate(0,-390) scale(${pop(t, a + 0.6)})`}>
        <rect x={-360} y={-55} width={720} height={110} rx={55} fill={MUST} />
        <text x={0} y={20} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={56} fill={INK}>PÉROLA DAS COLÔNIAS</text>
      </g>
    </StageFrame>
  );
};

/* ---------- talian: balões com reticências (sem palavras inventadas) ---------- */
export const StageTalian: React.FC<{ t: number; a: number; lawT: number; iphanT: number }> = ({ t, a, lawT, iphanT }) => (
  <StageFrame fill="#F4EBDD">
    {[[-240, -200, 0.0], [200, -260, 0.4], [-60, 0, 0.8]].map(([x, y, d], i) => (
      <g key={i} transform={`translate(${x},${y}) scale(${pop(t, a + d)})`}>
        <path d="M-170,-90 L170,-90 Q200,-90 200,-60 L200,50 Q200,80 170,80 L-40,80 L-90,140 L-80,80 L-170,80 Q-200,80 -200,50 L-200,-60 Q-200,-90 -170,-90 Z" fill="#fff" stroke={INK} strokeWidth={8} />
        {[-60, 0, 60].map((cx, k) => <circle key={k} cx={cx} cy={-5 + Math.sin(t * 6 + k) * 6} r={16} fill={INK} />)}
      </g>
    ))}
    <text x={0} y={190} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill={UVA}>TALIAN</text>
    {t > lawT && (
      <g transform={`translate(-210,350) rotate(-8) scale(${(2 - easeOut((t - lawT) / 0.2)) * 0.7})`} opacity={easeOut((t - lawT) / 0.2)}>
        <rect x={-210} y={-60} width={420} height={120} rx={16} fill="none" stroke="#2E7D32" strokeWidth={12} />
        <text x={0} y={18} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={44} fill="#2E7D32">PATRIMÔNIO RS</text>
      </g>
    )}
    {t > iphanT && (
      <g transform={`translate(220,360) rotate(6) scale(${(2 - easeOut((t - iphanT) / 0.2)) * 0.7})`} opacity={easeOut((t - iphanT) / 0.2)}>
        <rect x={-210} y={-60} width={420} height={120} rx={16} fill="none" stroke="#C62828" strokeWidth={12} />
        <text x={0} y={18} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={44} fill="#C62828">IPHAN · 2014</text>
      </g>
    )}
  </StageFrame>
);

/* ---------- título genérico (sem cores de clube) ---------- */
export const StageTitleSerra: React.FC<{ t: number; at: number; kicker: string; title: string; dark?: boolean }> = ({ t, at, kicker, title, dark }) => {
  const s = pop(t, at, 0.35);
  const words = title.split(' ');
  const lines: string[] = [];
  words.forEach((w) => {
    const l = lines[lines.length - 1];
    if (l && (l + ' ' + w).length <= 14) lines[lines.length - 1] = l + ' ' + w; else lines.push(w);
  });
  return (
    <StageFrame fill={dark ? '#20262E' : '#3E5A4A'}>
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-600 + i * 170} y={-600} width={60} height={1400} fill={dark ? '#2A3240' : UVA} opacity={0.35} transform="rotate(20)" />)}
      <g transform={`scale(${s})`}>
        <text x={0} y={-40 - (lines.length - 1) * 30 - 120} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={46} fill={dark ? '#C9C0A8' : MUST}>{kicker}</text>
        {lines.map((l, i) => (
          <text key={i} x={0} y={-40 + i * 120 - (lines.length - 1) * 30} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={l.length > 11 ? 96 : 116} fill="#fff" stroke={INK} strokeWidth={10} paintOrder="stroke">{l}</text>
        ))}
      </g>
    </StageFrame>
  );
};

/* ---------- linha do tempo dos nomes (usada no longo como fecho) ---------- */
export const StageNomesFinal: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <StageFrame fill="#F4EBDD">
    {['CAMPO DOS BUGRES', 'COLÔNIA CAXIAS', 'PÉROLA DAS COLÔNIAS'].map((n, i) => (
      <g key={n} transform={`translate(0,${-240 + i * 240}) scale(${pop(t, a + i * 1.1)})`}>
        <rect x={-400} y={-80} width={800} height={160} rx={30} fill={i === 2 ? MUST : '#1F6B3A'} />
        <text x={0} y={22} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={66} fill={i === 2 ? INK : '#fff'}>{n}</text>
      </g>
    ))}
  </StageFrame>
);

export { kf };
