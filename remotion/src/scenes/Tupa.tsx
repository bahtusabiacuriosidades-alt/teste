import React from 'react';
import { MUST, clamp, lerp } from '../lib';

/** Small-town landscape whose sky goes from storm (1) to clear sunset (0). roofs: 0 = destelhadas, 1 = consertadas */
export const TownBG: React.FC<{ t: number; storm: number; roofs: number; sunset?: number }> = ({ t, storm, roofs, sunset = 0 }) => {
  const houses: [number, number, string][] = [[90, 1.0, '#E9C46A'], [260, 0.85, '#F4A261'], [420, 1.1, '#A8DADC'], [610, 0.9, '#E76F51'], [790, 1.05, '#8AB17D'], [960, 0.9, '#F2E8CF']];
  return (
    <g>
      <defs>
        <linearGradient id="skyClear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sunset > 0 ? '#F49D5A' : '#8CC9EC'} />
          <stop offset="1" stopColor={sunset > 0 ? '#FFE2A8' : '#E3F2FA'} />
        </linearGradient>
        <linearGradient id="skyStorm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B4452" />
          <stop offset="1" stopColor="#7A8594" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#skyClear)" />
      <rect width={1080} height={1920} fill="url(#skyStorm)" opacity={storm} />
      {/* sun */}
      <circle cx={820} cy={lerp(700, 420, 1 - storm)} r={110} fill="#FFF1B8" opacity={clamp((0.45 - storm) * 2.2) * 0.9} />
      {/* clouds */}
      {[[180, 260, 1], [600, 200, 1.3], [940, 330, 1.1], [380, 420, 0.9]].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x + Math.sin(t * 0.3 + i) * 20},${y}) scale(${s})`} opacity={0.35 + 0.6 * storm}>
          <ellipse cx={0} cy={0} rx={160} ry={60} fill={storm > 0.5 ? '#4A5361' : '#fff'} />
          <ellipse cx={-80} cy={20} rx={110} ry={50} fill={storm > 0.5 ? '#525B69' : '#fff'} />
          <ellipse cx={90} cy={22} rx={120} ry={48} fill={storm > 0.5 ? '#454E5B' : '#fff'} />
        </g>
      ))}
      {/* hills */}
      <ellipse cx={250} cy={1260} rx={700} ry={220} fill="#6FAF4A" />
      <ellipse cx={900} cy={1290} rx={650} ry={200} fill="#5E9E3E" />
      <rect x={0} y={1250} width={1080} height={670} fill="#6FAF4A" />
      <rect x={0} y={1250} width={1080} height={670} fill="rgba(40,50,60,.35)" opacity={storm} />
      {/* houses */}
      {houses.map(([x, s, c], i) => {
        const r = clamp(roofs * 1.4 - i * 0.08);
        return (
          <g key={i} transform={`translate(${x},1300) scale(${s})`}>
            <rect x={-70} y={-120} width={140} height={120} fill={c} />
            <rect x={-20} y={-70} width={40} height={70} fill="#5A3A24" />
            <rect x={-56} y={-100} width={30} height={30} fill="#CFE8F5" />
            <rect x={26} y={-100} width={30} height={30} fill="#CFE8F5" />
            {/* missing roof: only bare rafters + broken wall top */}
            {r < 1 && (
              <g opacity={1 - r}>
                <path d="M-70,-120 L-50,-132 L-30,-121 L-8,-136 L14,-122 L36,-134 L52,-121 L70,-130 L70,-120 Z" fill={c} />
                <path d="M-76,-122 L-6,-178 M-40,-122 L4,-158 M76,-122 L30,-158" stroke="#5A3A24" strokeWidth={7} strokeLinecap="round" />
              </g>
            )}
            <path d="M-84,-118 L0,-190 L84,-118 Z" fill="#B23A2E" transform={`translate(0,${(1 - r) * -40}) scale(${r},${r})`} opacity={r} style={{ transformOrigin: '0px -150px' }} />
          </g>
        );
      })}
      {/* flying roof tiles */}
      {storm > 0.5 && roofs < 0.5 && Array.from({ length: 10 }).map((_, i) => {
        const ph = (t * 0.5 + i * 0.1) % 1;
        return <rect key={i} x={-40 + ph * 1200} y={1100 - ph * 600 + Math.sin(t * 6 + i) * 40} width={34} height={18} fill="#B23A2E" transform={`rotate(${t * 300 + i * 40} ${-40 + ph * 1200} ${1100 - ph * 600})`} opacity={storm} />;
      })}
      {/* rain + wind */}
      {storm > 0 && Array.from({ length: 70 }).map((_, i) => {
        const x = ((i * 157) % 1180) - 50, y = ((t * 1600 + i * 97) % 2000) - 80;
        return <line key={i} x1={x} y1={y} x2={x - 40} y2={y + 70} stroke="rgba(220,230,240,.55)" strokeWidth={4} opacity={storm} />;
      })}
    </g>
  );
};

/** Collection point building with boxes going in */
export const ColetaBG: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1080} height={1920} fill="#CFE6F2" />
    <rect x={0} y={1350} width={1080} height={570} fill="#C9C1B2" />
    <rect x={140} y={700} width={800} height={650} fill="#F3E3C3" />
    <path d="M110,700 L540,520 L970,700 Z" fill="#2F6B3A" />
    <rect x={240} y={760} width={600} height={110} rx={14} fill={MUST} />
    <text x={540} y={835} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={58} fill="#1E1B18">PONTO DE COLETA</text>
    <rect x={430} y={1010} width={220} height={340} fill="#6B3E1E" />
    <rect x={200} y={960} width={170} height={150} fill="#9FD3EE" />
    <rect x={710} y={960} width={170} height={150} fill="#9FD3EE" />
    {[0, 1, 2, 3].map((i) => {
      const ph = (t * 0.35 + i * 0.25) % 1;
      const x = 1080 - ph * 560, y = 1440 - Math.abs(Math.sin(ph * Math.PI * 6)) * 12;
      return (
        <g key={i} transform={`translate(${x},${y})`} opacity={ph > 0.92 ? (1 - ph) / 0.08 : 1}>
          <rect x={-55} y={-90} width={110} height={90} fill="#C8955A" stroke="#8A5A2B" strokeWidth={4} />
          <path d="M-55,-60 h110" stroke="#8A5A2B" strokeWidth={4} />
          <text x={0} y={-24} textAnchor="middle" fontSize={34} fontFamily="Noto Color Emoji">❤️</text>
        </g>
      );
    })}
  </g>
);

/** Road with a Defesa Civil truck */
export const RoadBG: React.FC<{ t: number; truckX: number }> = ({ t, truckX }) => (
  <g>
    <rect width={1080} height={1920} fill="#9CCBE6" />
    <ellipse cx={300} cy={1150} rx={700} ry={180} fill="#7DB34E" />
    <ellipse cx={900} cy={1170} rx={600} ry={160} fill="#6FAF4A" />
    <path d="M440,1100 L640,1100 L1080,1920 L0,1920 Z" fill="#55595E" />
    {Array.from({ length: 8 }).map((_, i) => {
      const k = ((i / 8 + t * 0.5) % 1);
      const y = 1100 + k * k * 820, w = 6 + k * 26, h = 20 + k * 90;
      return <rect key={i} x={540 - w / 2} y={y} width={w} height={h} fill="#F2E9D0" />;
    })}
    <g transform={`translate(${truckX},1560) scale(1.2)`}>
      <rect x={-200} y={-170} width={260} height={170} rx={12} fill="#F28C28" />
      <rect x={60} y={-130} width={130} height={130} rx={14} fill="#F28C28" />
      <rect x={80} y={-115} width={90} height={60} rx={8} fill="#CFE8F5" />
      <rect x={-190} y={-120} width={240} height={46} fill="#fff" />
      <text x={-70} y={-86} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill="#F28C28">DEFESA CIVIL</text>
      <rect x={-120} y={-200} width={70} height={30} rx={8} fill={Math.sin(t * 12) > 0 ? '#3B82C4' : '#E53935'} />
      <circle cx={-130} cy={10} r={40} fill="#222" /><circle cx={130} cy={10} r={40} fill="#222" />
      <circle cx={-130} cy={10} r={16} fill="#999" /><circle cx={130} cy={10} r={16} fill="#999" />
    </g>
  </g>
);

/** Big warning shield */
export const Shield: React.FC<{ s: number }> = ({ s }) => (
  <g transform={`scale(${s})`}>
    <path d="M0,-260 L220,-180 C220,40 140,190 0,270 C-140,190 -220,40 -220,-180 Z" fill="#C62828" stroke="#fff" strokeWidth={14} />
    <rect x={-22} y={-150} width={44} height={200} rx={22} fill="#fff" />
    <circle cx={0} cy={110} r={28} fill="#fff" />
  </g>
);

/** Phone mock showing a suspicious Pix request */
export const PhoneScam: React.FC<{ cross: number }> = ({ cross }) => (
  <g>
    <rect x={-170} y={-320} width={340} height={640} rx={40} fill="#1E1B18" />
    <rect x={-150} y={-290} width={300} height={580} rx={26} fill="#F4F6F8" />
    <circle cx={-100} cy={-230} r={30} fill="#9AA0A8" />
    <text x={-60} y={-235} fontFamily="Montserrat" fontWeight={800} fontSize={22} fill="#333">perfil_novo_123</text>
    <text x={-60} y={-208} fontFamily="Montserrat" fontWeight={600} fontSize={18} fill="#888">0 seguidores</text>
    <rect x={-130} y={-160} width={260} height={180} rx={16} fill="#FFE08A" />
    <text x={0} y={-105} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={28} fill="#333">DOE AQUI!!!</text>
    <text x={0} y={-60} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={22} fill="#333">PIX: ???????</text>
    <text x={0} y={-20} textAnchor="middle" fontSize={40} fontFamily="Noto Color Emoji">💸</text>
    {cross > 0 && (
      <g opacity={cross} transform={`scale(${0.6 + 0.4 * cross})`}>
        <line x1={-150} y1={-200} x2={150} y2={200} stroke="#E53935" strokeWidth={36} strokeLinecap="round" />
        <line x1={150} y1={-200} x2={-150} y2={200} stroke="#E53935" strokeWidth={36} strokeLinecap="round" />
      </g>
    )}
  </g>
);

/** Real photo shown full-width over a blurred copy of itself, with slow zoom and a credit line */
export const PhotoSlide: React.FC<{ src: string; lt: number; dur: number; credit: string; w: number; h: number }> = ({ src, lt, dur, credit, w, h }) => {
  const z = 1 + 0.12 * Math.min(1, lt / dur);
  const ih = (1080 / w) * h;
  return (
    <g>
      <defs><filter id="photoBlur"><feGaussianBlur stdDeviation="40" /></filter></defs>
      <image href={src} x={-600} y={0} width={2280} height={1920} preserveAspectRatio="xMidYMid slice" filter="url(#photoBlur)" />
      <rect width={1080} height={1920} fill="rgba(0,0,0,.45)" />
      <g transform={`translate(540,980) scale(${z}) translate(-540,${-ih / 2})`}>
        <image href={src} x={0} y={0} width={1080} height={ih} preserveAspectRatio="xMidYMid meet" />
      </g>
      <rect x={0} y={980 + (ih / 2) * z + 10} width={1080} height={56} fill="rgba(0,0,0,0)" />
      <text x={1040} y={980 + (ih / 2) * z + 48} textAnchor="end" fontFamily="Montserrat" fontWeight={700} fontSize={26} fill="rgba(255,255,255,.85)">{credit}</text>
    </g>
  );
};
