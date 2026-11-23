import React from 'react';
import { MUST, clamp } from '../lib';

/* ------------------------------------------------------------------ */
/* Galpão (rustic farm shed)                                           */
/* ------------------------------------------------------------------ */
export const GalpaoBG: React.FC<{ door?: number; friends?: number }> = ({ door = 0, friends = 0 }) => (
  <g>
    <defs>
      <linearGradient id="gWood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8A5A34" />
        <stop offset="1" stopColor="#5E3B20" />
      </linearGradient>
      <radialGradient id="gLight" cx="50%" cy="30%" r="70%">
        <stop offset="0" stopColor="rgba(255,210,140,.35)" />
        <stop offset="1" stopColor="rgba(255,210,140,0)" />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#gWood)" />
    {Array.from({ length: 12 }).map((_, i) => (
      <g key={i}>
        <rect x={i * 92} y={0} width={88} height={1600} fill={i % 2 ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.03)'} />
        <line x1={i * 92} y1={0} x2={i * 92} y2={1600} stroke="rgba(30,15,5,.45)" strokeWidth={4} />
        <circle cx={i * 92 + 44} cy={240 + (i % 3) * 330} r={5} fill="rgba(30,15,5,.4)" />
      </g>
    ))}
    {/* roof beam */}
    <rect x={0} y={110} width={1080} height={56} fill="#4A2E18" />
    {/* window with pampa */}
    <rect x={620} y={330} width={330} height={300} rx={8} fill="#3A2412" />
    <rect x={636} y={346} width={298} height={268} fill="#9FD3EE" />
    <rect x={636} y={520} width={298} height={94} fill="#7DB34E" />
    <circle cx={880} cy={400} r={30} fill="#FFE59A" />
    <rect x={780} y={346} width={8} height={268} fill="#3A2412" />
    <rect x={636} y={476} width={298} height={8} fill="#3A2412" />
    {/* door (left) with friends silhouettes */}
    <rect x={60} y={560} width={300} height={1000} fill="#2E1C0E" />
    <rect x={76} y={576} width={268} height={984} fill={`rgba(255,220,160,${0.25 + 0.55 * door})`} />
    {friends > 0 && [0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${130 + i * 85},${1560 - 40 * (1 - clamp(friends * 3 - i))}) scale(${0.9})`} opacity={clamp(friends * 3 - i)}>
        <ellipse cx={0} cy={-560} rx={40} ry={46} fill="#2A1A10" />
        <ellipse cx={0} cy={-598} rx={70} ry={12} fill="#2A1A10" />
        <rect x={-30} y={-650} width={60} height={50} rx={14} fill="#2A1A10" />
        <path d="M-60,-505 Q0,-530 60,-505 L72,-200 L-72,-200 Z" fill="#2A1A10" />
        <rect x={-55} y={-210} width={45} height={210} fill="#2A1A10" />
        <rect x={10} y={-210} width={45} height={210} fill="#2A1A10" />
      </g>
    ))}
    {/* hanging lamp */}
    <line x1={540} y1={166} x2={540} y2={300} stroke="#2a1a0e" strokeWidth={4} />
    <path d="M490,300 L590,300 L570,250 L510,250 Z" fill="#2F6B3A" />
    <ellipse cx={540} cy={304} rx={26} ry={10} fill="#FFE8A8" />
    <rect width={1080} height={1920} fill="url(#gLight)" />
    {/* floor */}
    <rect x={0} y={1600} width={1080} height={320} fill="#4A2E18" />
  </g>
);

/* Fogão a lenha (wood stove) — origin at bottom-center */
export const Fogao: React.FC<{ t: number; fire?: number }> = ({ t, fire = 1 }) => (
  <g>
    <rect x={-170} y={-420} width={340} height={420} rx={14} fill="#26221F" />
    <rect x={-185} y={-440} width={370} height={34} rx={8} fill="#3A3430" />
    <rect x={-120} y={-300} width={140} height={110} rx={10} fill="#161311" />
    <rect x={-112} y={-292} width={124} height={94} rx={8} fill={`rgba(255,${120 + 60 * Math.sin(t * 9)},40,${0.55 * fire + 0.15})`} />
    {[0, 1, 2].map((k) => (
      <path key={k} d={`M${-90 + k * 35},-205 q10,${-30 - 10 * Math.sin(t * 8 + k)} 20,0`} fill={`rgba(255,200,60,${0.8 * fire})`} />
    ))}
    <rect x={50} y={-300} width={80} height={110} rx={8} fill="#161311" />
    <circle cx={90} cy={-130} r={14} fill="#8E939A" />
    <rect x={120} y={-700} width={44} height={270} fill="#2E2925" />
  </g>
);

/* Chaleira (kettle) — origin at bottom-center */
export const Chaleira: React.FC<{ t: number; steam?: number; shake?: number }> = ({ t, steam = 0, shake = 0 }) => (
  <g transform={`rotate(${Math.sin(t * 40) * 2 * shake})`}>
    <defs>
      <linearGradient id="kettle" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7A808A" />
        <stop offset="0.4" stopColor="#E9ECEF" />
        <stop offset="1" stopColor="#6B7078" />
      </linearGradient>
    </defs>
    <path d="M-110,0 C-130,-60 -110,-150 -60,-170 L60,-170 C110,-150 130,-60 110,0 Z" fill="url(#kettle)" />
    <path d="M100,-90 C150,-110 170,-150 190,-180 L205,-170 C185,-130 160,-80 108,-55 Z" fill="url(#kettle)" />
    <ellipse cx={0} cy={-172} rx={62} ry={14} fill="#9AA0A8" />
    <circle cx={0} cy={-190} r={12} fill="#2A2420" />
    <path d="M-80,-170 C-80,-260 80,-260 80,-170" stroke="#2A2420" strokeWidth={14} fill="none" />
    {steam > 0 && [0, 1, 2, 3].map((k) => {
      const ph = (t * 1.2 + k * 0.25) % 1;
      const sx = 200 + ph * 60, sy = -190 - ph * 220;
      return <circle key={k} cx={sx + Math.sin(t * 5 + k) * 10} cy={sy} r={18 + ph * 40} fill="#fff" opacity={steam * 0.5 * (1 - ph)} />;
    })}
  </g>
);

/* Pacote de erva-mate — origin center */
export const ErvaPack: React.FC = () => (
  <g>
    <path d="M-90,-150 L90,-150 L100,150 L-100,150 Z" fill="#2F6B3A" />
    <path d="M-90,-150 L-70,-185 L70,-185 L90,-150 Z" fill="#245530" />
    <rect x={-80} y={-60} width={160} height={110} rx={10} fill="#F4EFE6" />
    <text x={0} y={-12} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill="#2F6B3A">ERVA</text>
    <text x={0} y={28} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={26} fill="#2F6B3A">MATE</text>
    <path d="M-40,90 q40,-40 80,0" stroke={MUST} strokeWidth={8} fill="none" />
  </g>
);

/* Simple cuia (front view) — origin center */
export const CuiaIcon: React.FC<{ steam?: number; t?: number }> = ({ steam = 0, t = 0 }) => (
  <g>
    <line x1={20} y1={-110} x2={90} y2={-330} stroke="url(#lSilver)" strokeWidth={14} strokeLinecap="round" />
    <ellipse cx={92} cy={-338} rx={10} ry={8} fill="#C8A74A" />
    <path d="M-120,-90 C-160,60 -110,230 0,240 C110,230 160,60 120,-90 Z" fill="url(#lCuia)" />
    <path d="M-80,-30 C-96,70 -66,170 -20,200" stroke="rgba(255,255,255,.14)" strokeWidth={18} fill="none" />
    <ellipse cx={0} cy={-92} rx={128} ry={32} fill="url(#lSilver)" />
    {[-100, -60, -20, 20, 60, 100].map((x) => <circle key={x} cx={x} cy={-70} r={4} fill="#9EA3AA" />)}
    <ellipse cx={0} cy={-96} rx={104} ry={20} fill="#6E8B3D" />
    {steam > 0 && [0, 1, 2].map((k) => {
      const ph = (t * 0.8 + k * 0.33) % 1;
      return <path key={k} d={`M${-40 + k * 40},${-120 - ph * 200} c30,-40 -30,-80 0,-120`} stroke="#fff" strokeOpacity={steam * 0.5 * (1 - ph)} strokeWidth={10} fill="none" strokeLinecap="round" />;
    })}
  </g>
);

/* ------------------------------------------------------------------ */
/* Cuia em corte (cutaway) — origin center, ≈ 700px tall               */
/* ------------------------------------------------------------------ */
const INNER = 'M-200,-260 C-262,-90 -252,180 -120,300 C-60,342 60,342 120,300 C252,180 262,-90 200,-260 Z';
const OUTER = 'M-235,-275 C-305,-90 -292,205 -138,332 C-70,382 70,382 138,332 C292,205 305,-90 235,-275 Z';

export const CuiaCut: React.FC<{
  t: number;
  fill?: number; // 0..1 of the cavity
  slope?: number; // 0..1 morrinho
  water?: number; // 0..1 warm water in the foot
  burnt?: number; // 0..1
  bomba?: number; // 0..1 insertion
  dust?: number; // 0..1
  pour?: number; // 0..1 stream from the top-right
  pourColor?: string;
  guide?: number; // 0..1 opacity of the 2/3 guide line
}> = ({ t, fill = 0, slope = 0, water = 0, burnt = 0, bomba = 0, dust = 0, pour = 0, pourColor = 'rgba(140,200,235,.85)', guide = 0 }) => {
  const level = 330 - fill * 590;
  const yL = level - 170 * slope, yR = level + 150 * slope;
  const surf = (x: number) => yL + ((yR - yL) * (x + 300)) / 600;
  const yW = yR - 95 * water;
  const x1 = slope > 0.01 ? -300 + ((yW - yL) / (yR - yL)) * 600 : -300;
  const bombaTip = -700 + 960 * bomba;
  return (
    <g>
      <defs>
        <clipPath id="cuiaInner"><path d={INNER} /></clipPath>
        <pattern id="ervaTex" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#6E8B3D" />
          <circle cx="4" cy="5" r="2.2" fill="#88A651" />
          <circle cx="12" cy="11" r="2" fill="#56702E" />
          <rect x="8" y="2" width="5" height="2" fill="#9BB56A" transform="rotate(30 10 3)" />
        </pattern>
      </defs>
      <ellipse cx={0} cy={390} rx={300} ry={36} fill="rgba(0,0,0,.25)" />
      <path d={OUTER} fill="url(#lCuia)" />
      <path d="M-170,-150 C-210,0 -190,180 -110,280" stroke="rgba(255,255,255,.12)" strokeWidth={22} fill="none" />
      <path d={INNER} fill="#2A1A0E" />
      <g clipPath="url(#cuiaInner)">
        {fill > 0 && <polygon points={`-300,${yL} 300,${yR} 300,420 -300,420`} fill="url(#ervaTex)" />}
        {fill > 0 && burnt > 0 && (
          <polygon points={`-300,${yL} 300,${yR} 300,${yR + 70} -300,${yL + 70}`} fill={`rgba(60,35,10,${0.85 * burnt})`} />
        )}
        {water > 0 && <polygon points={`${x1},${yW} 300,${yW} 300,${yR} ${x1},${surf(x1)}`} fill="rgba(120,190,165,.8)" />}
        {water > 0 && <line x1={x1} y1={yW} x2={300} y2={yW} stroke="rgba(255,255,255,.6)" strokeWidth={5} />}
      </g>
      {/* 2/3 guide */}
      {guide > 0 && (
        <g opacity={guide}>
          <line x1={-260} y1={330 - 0.67 * 590} x2={260} y2={330 - 0.67 * 590} stroke="#fff" strokeWidth={6} strokeDasharray="20 14" />
          <rect x={268} y={330 - 0.67 * 590 - 34} width={110} height={64} rx={14} fill={MUST} />
          <text x={323} y={330 - 0.67 * 590 + 12} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={40} fill="#1E1B18">2/3</text>
        </g>
      )}
      {/* rim (opening) */}
      <ellipse cx={0} cy={-268} rx={242} ry={44} fill="url(#lSilver)" />
      <ellipse cx={0} cy={-268} rx={206} ry={30} fill="#3A2414" />
      {[-200, -150, -100, -50, 0, 50, 100, 150, 200].map((x) => <circle key={x} cx={x} cy={-238} r={5} fill="#9EA3AA" />)}
      {/* bomba */}
      {bomba > 0 && (
        <g>
          <line x1={150} y1={-720} x2={150 - 40 * bomba} y2={bombaTip} stroke="url(#lSilver)" strokeWidth={16} strokeLinecap="round" />
          <ellipse cx={150 - 40 * bomba} cy={bombaTip} rx={34} ry={18} fill="#C9CCD1" />
          <ellipse cx={150} cy={-728} rx={12} ry={9} fill="#C8A74A" />
        </g>
      )}
      {/* pour stream */}
      {pour > 0 && (
        <g opacity={pour}>
          <path d={`M330,-760 C300,-600 200,-420 ${x1 > -300 ? 150 : 120},${water > 0 ? yW : surf(150)}`} stroke={pourColor} strokeWidth={26} fill="none" strokeLinecap="round" />
          {[0, 1, 2, 3].map((k) => <circle key={k} cx={140 + Math.sin(t * 20 + k) * 30} cy={(water > 0 ? yW : surf(140)) - 10 - ((t * 300 + k * 40) % 60)} r={8} fill={pourColor} />)}
        </g>
      )}
      {/* dust */}
      {dust > 0 && Array.from({ length: 22 }).map((_, i) => {
        const ph = (t * 0.6 + i * 0.045) % 1;
        const x = -180 + ((i * 53) % 360) + Math.sin(t * 3 + i) * 30;
        const y = -280 - ph * 420;
        return <circle key={i} cx={x} cy={y} r={10 + (i % 4) * 5} fill="#9BB56A" opacity={dust * 0.6 * (1 - ph)} />;
      })}
    </g>
  );
};

/* Thermometer — origin at the bulb center */
export const Thermo: React.FC<{ temp: number; good?: boolean }> = ({ temp, good }) => {
  const h = 700, y0 = -60, tempY = (v: number) => y0 - (v / 100) * h;
  const col = temp > 85 ? '#E53935' : good ? '#34C759' : '#F28C28';
  return (
    <g>
      <rect x={-46} y={tempY(100) - 40} width={92} height={h + 80} rx={46} fill="#F4F6F8" stroke="#8E939A" strokeWidth={6} />
      <rect x={-20} y={tempY(80)} width={40} height={tempY(70) - tempY(80)} fill="rgba(52,199,89,.35)" />
      <rect x={-16} y={tempY(temp)} width={32} height={y0 - tempY(temp) + 20} rx={16} fill={col} />
      <circle cx={0} cy={0} r={70} fill={col} stroke="#8E939A" strokeWidth={6} />
      {[0, 20, 40, 60, 80, 100].map((v) => (
        <g key={v}>
          <line x1={46} y1={tempY(v)} x2={76} y2={tempY(v)} stroke="#F4F6F8" strokeWidth={5} />
          <text x={88} y={tempY(v) + 12} fontFamily="Montserrat" fontWeight={900} fontSize={34} fill="#fff" stroke="#1a1a1a" strokeWidth={6} paintOrder="stroke">{v}°</text>
        </g>
      ))}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Map of Rio Grande do Sul (stylized) — local box 0..700              */
/* ------------------------------------------------------------------ */
const RS = 'M60,170 L150,110 L260,90 L380,70 L470,95 L560,130 L640,190 L600,300 L540,420 L470,520 L400,610 L335,700 L290,640 L230,600 L170,560 L120,500 L60,420 L30,330 L20,250 Z';

export const MapScene: React.FC<{ t: number; guaranis: number; reducoes: number; ruins: number; pin: number; zoom: number }> = ({ t, guaranis, reducoes, ruins, pin, zoom }) => (
  <g>
    <rect width={1080} height={1920} fill="#EFE2C4" />
    {Array.from({ length: 22 }).map((_, i) => <line key={i} x1={0} y1={i * 90} x2={1080} y2={i * 90} stroke="rgba(120,90,40,.08)" strokeWidth={3} />)}
    {Array.from({ length: 13 }).map((_, i) => <line key={i} x1={i * 90} y1={0} x2={i * 90} y2={1920} stroke="rgba(120,90,40,.08)" strokeWidth={3} />)}
    <g transform={`translate(540,1000) scale(${zoom}) translate(-540,-1000)`}>
      <g transform="translate(220,640)">
        {/* neighbours (west) */}
        <path d="M-200,0 L60,170 L20,250 L30,330 L60,420 L-200,520 Z" fill="#E3D3AE" />
        <text x={-150} y={300} fontFamily="Montserrat" fontWeight={800} fontSize={30} fill="rgba(90,70,30,.55)">ARGENTINA</text>
        {/* guarani region */}
        {guaranis > 0 && <ellipse cx={90} cy={190} rx={250 * guaranis} ry={170 * guaranis} fill="rgba(47,107,58,.28)" stroke="#2F6B3A" strokeWidth={6} strokeDasharray="14 10" />}
        {/* RS */}
        <path d={RS} fill="#8FB86A" stroke="#2F6B3A" strokeWidth={8} strokeLinejoin="round" />
        <ellipse cx={520} cy={420} rx={36} ry={140} fill="#9FD3EE" transform="rotate(-38 520 420)" />
        <text x={330} y={360} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={64} fill="rgba(30,60,30,.35)">RS</text>
        {/* reduções (crosses) */}
        {[[40, 150], [110, 200], [-30, 230], [150, 150], [60, 260], [-60, 170]].map(([x, y], i) => {
          const a = clamp(reducoes * 6 - i);
          return a > 0 ? (
            <g key={i} transform={`translate(${x},${y}) scale(${a})`}>
              <rect x={-5} y={-30} width={10} height={44} fill="#5A3A1E" />
              <rect x={-17} y={-20} width={34} height={9} fill="#5A3A1E" />
            </g>
          ) : null;
        })}
        {/* ruins of São Miguel */}
        {ruins > 0 && (
          <g transform={`translate(150,215) scale(${0.55 * ruins})`}>
            <path d="M-150,0 L-150,-170 L-110,-210 L110,-210 L150,-170 L150,0 Z" fill="#B97A4E" stroke="#6B3E1E" strokeWidth={6} />
            {[-90, -30, 30, 90].map((x) => <path key={x} d={`M${x - 22},0 L${x - 22},-90 A22,22 0 0 1 ${x + 22},-90 L${x + 22},0 Z`} fill="#5A3A1E" />)}
            <path d="M-60,-210 L0,-270 L60,-210 Z" fill="#B97A4E" stroke="#6B3E1E" strokeWidth={6} />
            <rect x={160} y={-300} width={70} height={300} fill="#B97A4E" stroke="#6B3E1E" strokeWidth={6} />
            <path d="M160,-300 L195,-350 L230,-300 Z" fill="#B97A4E" stroke="#6B3E1E" strokeWidth={6} />
            <rect x={182} y={-260} width={26} height={40} rx={13} fill="#5A3A1E" />
          </g>
        )}
        {/* pin */}
        {pin > 0 && (
          <g transform={`translate(150,180) scale(${pin}) translate(0,${-Math.abs(Math.sin(t * 4)) * 10})`}>
            <path d="M0,0 C-40,-50 -40,-110 0,-110 C40,-110 40,-50 0,0 Z" fill="#B23A2E" />
            <circle cx={0} cy={-75} r={14} fill="#fff" />
          </g>
        )}
        <circle cx={480} cy={330} r={10} fill="#1E1B18" />
        <text x={496} y={318} fontFamily="Montserrat" fontWeight={800} fontSize={26} fill="#1E1B18">Porto Alegre</text>
      </g>
    </g>
  </g>
);

/* Confetti burst */
export const Confetti: React.FC<{ t: number; start: number }> = ({ t, start }) => {
  const dt = t - start;
  if (dt < 0 || dt > 3) return null;
  return (
    <g>
      {Array.from({ length: 60 }).map((_, i) => {
        const ang = (i / 60) * Math.PI * 2 + i;
        const v = 500 + (i % 7) * 120;
        const x = 540 + Math.cos(ang) * v * dt;
        const y = 900 + Math.sin(ang) * v * dt * 0.6 + 900 * dt * dt;
        const c = ['#D9A021', '#2F6B3A', '#B23A2E', '#3B82C4', '#fff'][i % 5];
        return <rect key={i} x={x} y={y} width={18} height={30} rx={4} fill={c} transform={`rotate(${dt * 500 + i * 40} ${x} ${y})`} opacity={1 - dt / 3} />;
      })}
    </g>
  );
};
