import React from 'react';
import { MUST } from '../lib';

const Roll: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={48} ry={32} fill="#C98A3A" />
    <ellipse cx={-6} cy={-8} rx={34} ry={18} fill="#E2A957" />
    <path d="M-20,-12 l16,16 M0,-16 l16,18" stroke="#8A5420" strokeWidth={4} strokeLinecap="round" />
  </g>
);

export const BakeryBG: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="bk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F6DDA8" />
        <stop offset="1" stopColor="#E2AE6C" />
      </linearGradient>
      <radialGradient id="lamp">
        <stop offset="0" stopColor="rgba(255,230,150,.4)" />
        <stop offset="1" stopColor="rgba(255,230,150,0)" />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#bk)" />
    {Array.from({ length: 17 }).map((_, i) => (
      <line key={i} x1={0} x2={1080} y1={i * 90} y2={i * 90} stroke="rgba(160,100,40,.12)" strokeWidth={3} />
    ))}
    {[220, 860].map((x) => (
      <g key={x}>
        <line x1={x} x2={x} y1={0} y2={150} stroke="#3a2a1a" strokeWidth={4} />
        <ellipse cx={x} cy={165} rx={70} ry={30} fill="#2F6B3A" />
        <ellipse cx={x} cy={185} rx={30} ry={14} fill="rgba(255,240,180,.9)" />
        <ellipse cx={x} cy={380} rx={320} ry={260} fill="url(#lamp)" />
      </g>
    ))}
    {[420, 700].map((sy) => (
      <g key={sy}>
        <rect x={40} y={sy} width={1000} height={26} rx={6} fill="#7A4A24" />
        {Array.from({ length: 9 }).map((_, i) => <Roll key={i} x={95 + i * 110} y={sy - 34} />)}
      </g>
    ))}
    <rect width={1080} height={1920} fill="rgba(255,236,200,.28)" />
  </g>
);

export const CounterFG: React.FC = () => (
  <g>
    <rect x={-20} y={1560} width={1120} height={400} fill="#6B3E1E" />
    <rect x={-20} y={1560} width={1120} height={40} fill="#8B5A2B" />
    <rect x={0} y={1600} width={1080} height={200} fill="rgba(210,240,255,.28)" />
    {Array.from({ length: 7 }).map((_, i) => <Roll key={i} x={90 + i * 150} y={1745} s={1.25} />)}
    <path d="M120,1610 L40,1790 M170,1610 L90,1790" stroke="rgba(255,255,255,.55)" strokeWidth={6} />
  </g>
);

export const SPBakeryBG: React.FC = () => {
  const b: [number, number, number][] = [[150, 520, 110], [270, 440, 90], [370, 600, 130], [510, 380, 100], [620, 480, 120], [750, 410, 90], [850, 560, 90]];
  return (
    <g>
      <defs>
        <linearGradient id="sp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D5DEE3" /><stop offset="1" stopColor="#AEBCC4" /></linearGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9EC9E8" /><stop offset="1" stopColor="#DDEBF3" /></linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#sp)" />
      <rect x={120} y={300} width={840} height={700} rx={10} fill="#2E3A40" />
      <rect x={140} y={320} width={800} height={660} rx={6} fill="url(#sky)" />
      {b.map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y + 40} width={w} height={940 - y} fill="#7E8C96" />
          {Array.from({ length: Math.floor((900 - y) / 46) }).map((_, r) =>
            Array.from({ length: Math.floor((w - 30) / 32) }).map((__, c) => (
              <rect key={`${r}-${c}`} x={x + 14 + c * 32} y={y + 60 + r * 46} width={14} height={22} fill="#C9D6DE" />
            )),
          )}
        </g>
      ))}
      <rect x={535} y={320} width={10} height={660} fill="#2E3A40" />
      <rect x={140} y={640} width={800} height={10} fill="#2E3A40" />
      <rect x={600} y={170} width={380} height={84} rx={14} fill="#B23A2E" />
      <text x={790} y={230} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={50} fill="#fff">PADARIA</text>
      <rect width={1080} height={1920} fill="rgba(230,240,245,.25)" />
      <rect x={-20} y={1600} width={1120} height={360} fill="#9AA4AA" />
      <rect x={-20} y={1600} width={1120} height={36} fill="#C4CCD0" />
    </g>
  );
};

/** close-up basket of rolls */
export const BasketClose: React.FC<{ t: number; lift: number }> = ({ t, lift }) => (
  <g>
    <rect width={1080} height={1920} fill="#E9BC7C" />
    <ellipse cx={540} cy={420} rx={700} ry={300} fill="rgba(255,240,200,.5)" />
    <rect x={0} y={1350} width={1080} height={570} fill="#8B5A2B" />
    <ellipse cx={540} cy={1250} rx={520} ry={200} fill="#B07A3E" />
    {Array.from({ length: 12 }).map((_, i) => (
      <g key={i}><Roll x={150 + (i % 6) * 156} y={1120 + Math.floor(i / 6) * 90 + (i % 2) * 20} s={2.1} /></g>
    ))}
    <path d="M20,1250 Q540,1560 1060,1250 L1000,1520 Q540,1700 80,1520 Z" fill="#A0692F" />
    {Array.from({ length: 9 }).map((_, i) => (
      <path key={i} d={`M${100 + i * 110},1330 q30,120 0,240`} stroke="#7A4E22" strokeWidth={10} fill="none" />
    ))}
    {/* steam */}
    {[0, 1, 2, 3].map((k) => {
      const ph = (t * 0.7 + k * 0.25) % 1;
      const sx = 300 + k * 160, sy = 1050 - ph * 400;
      return <path key={k} d={`M${sx},${sy} c40,-60 -40,-120 0,-180`} stroke="#fff" strokeOpacity={0.6 * (1 - ph)} strokeWidth={16} fill="none" strokeLinecap="round" />;
    })}
    {/* hand lifting one roll */}
    <g transform={`translate(${760},${1060 - 360 * lift})`}>
      <rect x={60} y={-20} width={120} height={700} rx={55} fill="#C98F62" transform="rotate(-20)" />
      <rect x={110} y={420} width={150} height={260} rx={60} fill="#F2EEE6" transform="rotate(-20)" />
      <Roll x={0} y={0} s={2.3} />
      <ellipse cx={70} cy={-10} rx={70} ry={60} fill="#D9A070" />
    </g>
  </g>
);

export const PartyBG: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#FBE3EC" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={i * 95} y={0} width={46} height={1920} fill="rgba(255,255,255,.45)" />)}
    <path d="M0,330 Q540,470 1080,330" stroke="#888" strokeWidth={4} fill="none" />
    {Array.from({ length: 11 }).map((_, i) => {
      const x = 40 + i * 100, y = 330 + Math.sin((i / 10) * Math.PI) * 120;
      return <path key={i} d={`M${x - 34},${y - 6} L${x + 34},${y - 6} L${x},${y + 60} Z`} fill={['#2F6B3A', MUST, '#B23A2E', '#3B82C4'][i % 4]} />;
    })}
    {[[130, 620, '#B23A2E'], [940, 560, '#3B82C4'], [210, 820, MUST], [880, 820, '#2F6B3A']].map(([x, y, c], i) => (
      <g key={i}>
        <line x1={x as number} y1={(y as number) + 90} x2={(x as number) + 10} y2={(y as number) + 400} stroke="#777" strokeWidth={3} />
        <ellipse cx={x as number} cy={y as number} rx={80} ry={95} fill={c as string} />
        <ellipse cx={(x as number) - 25} cy={(y as number) - 35} rx={18} ry={28} fill="rgba(255,255,255,.4)" />
      </g>
    ))}
  </g>
);

export const PartyTableFG: React.FC = () => (
  <g>
    <rect x={-20} y={1560} width={1120} height={380} fill="#F5F5F5" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={i * 95} y={1560} width={46} height={380} fill="#E86A92" opacity={0.55} />)}
    {Array.from({ length: 8 }).map((_, i) => (
      <g key={i} transform={`translate(${90 + i * 128},1560)`}>
        <path d="M-38,0 L-28,36 L28,36 L38,0 Z" fill={i % 2 ? '#B23A2E' : MUST} />
        <circle cx={0} cy={-18} r={36} fill="#3B2314" />
        <circle cx={-10} cy={-28} r={6} fill="#5a3a24" />
      </g>
    ))}
  </g>
);

export const BackyardBG: React.FC = () => (
  <g>
    <defs><linearGradient id="ysky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7EC3EA" /><stop offset="1" stopColor="#D9F0FA" /></linearGradient></defs>
    <rect width={1080} height={1920} fill="url(#ysky)" />
    <ellipse cx={200} cy={260} rx={150} ry={60} fill="#fff" opacity={0.8} />
    <ellipse cx={860} cy={200} rx={180} ry={70} fill="#fff" opacity={0.7} />
    <rect x={0} y={1100} width={1080} height={820} fill="#6FAF4A" />
    {Array.from({ length: 12 }).map((_, i) => (
      <g key={i}><rect x={i * 95} y={980} width={26} height={180} fill="#A9744A" /></g>
    ))}
    <rect x={0} y={1010} width={1080} height={20} fill="#A9744A" />
    <rect x={0} y={1090} width={1080} height={20} fill="#A9744A" />
    <rect x={760} y={620} width={70} height={520} fill="#6B4226" />
    <circle cx={800} cy={540} r={260} fill="#3E7B36" />
    <circle cx={650} cy={620} r={170} fill="#4A8C3F" />
    <circle cx={950} cy={640} r={170} fill="#4A8C3F" />
    {[[700, 480], [820, 400], [900, 560], [640, 640], [760, 650], [980, 470], [880, 700], [700, 740]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={34} fill="#F28C28" />
    ))}
  </g>
);

export const StreetBG: React.FC<{ light: 'red' | 'green' }> = ({ light }) => (
  <g>
    <defs><linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8CC9EC" /><stop offset="1" stopColor="#E3F2FA" /></linearGradient></defs>
    <rect width={1080} height={1920} fill="url(#ssky)" />
    {[[0, 520, 260, '#E9C46A'], [250, 420, 230, '#F4A261'], [470, 560, 220, '#8AB17D'], [680, 460, 220, '#E76F51'], [890, 540, 220, '#A8DADC']].map(([x, y, w, c], i) => (
      <g key={i}>
        <rect x={x as number} y={y as number} width={w as number} height={1500 - (y as number)} fill={c as string} />
        <rect x={(x as number) - 8} y={(y as number) - 30} width={(w as number) + 16} height={36} fill="rgba(0,0,0,.18)" />
        {Array.from({ length: 5 }).map((_, r) =>
          [0, 1].map((cc) => (
            <rect key={`${r}${cc}`} x={(x as number) + 35 + cc * ((w as number) / 2)} y={(y as number) + 60 + r * 170} width={(w as number) / 2 - 70} height={110} rx={50} fill="#F8F4EC" stroke="rgba(0,0,0,.2)" strokeWidth={6} />
          )),
        )}
      </g>
    ))}
    <rect x={0} y={1500} width={1080} height={160} fill="#BDB5A6" />
    <rect x={0} y={1650} width={1080} height={270} fill="#55595E" />
    {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={i * 200 + 40} y={1780} width={110} height={16} fill="#E9E5DA" />)}
    {/* traffic light (right) */}
    <rect x={905} y={760} width={26} height={760} fill="#3A3F44" />
    <rect x={850} y={560} width={136} height={330} rx={24} fill="#2A2E32" />
    <circle cx={918} cy={630} r={42} fill={light === 'red' ? '#FF3B30' : '#5a1c18'} />
    <circle cx={918} cy={725} r={42} fill="#5a4a14" />
    <circle cx={918} cy={820} r={42} fill={light === 'green' ? '#34C759' : '#173d22'} />
    {light === 'red' && <circle cx={918} cy={630} r={80} fill="rgba(255,59,48,.25)" />}
    {light === 'green' && <circle cx={918} cy={820} r={80} fill="rgba(52,199,89,.25)" />}
  </g>
);

export const Car: React.FC<{ color: string; dent?: boolean; flip?: boolean }> = ({ color, dent, flip }) => (
  <g transform={flip ? 'scale(-1,1)' : undefined}>
    <rect x={-170} y={-60} width={340} height={110} rx={40} fill={color} />
    <path d="M-110,-60 L-70,-140 L80,-140 L120,-60 Z" fill={color} />
    <path d="M-92,-66 L-62,-124 L0,-124 L0,-66 Z M14,-66 L14,-124 L70,-124 L100,-66 Z" fill="#CFE8F5" />
    <circle cx={-100} cy={52} r={42} fill="#222" /><circle cx={-100} cy={52} r={18} fill="#999" />
    <circle cx={100} cy={52} r={42} fill="#222" /><circle cx={100} cy={52} r={18} fill="#999" />
    <rect x={150} y={-30} width={26} height={22} rx={6} fill="#FFE08A" />
    <rect x={-176} y={-30} width={22} height={22} rx={6} fill="#C0392B" />
    {dent && <path d="M-170,-20 l20,10 l-14,12 l18,8" stroke="#333" strokeWidth={6} fill="none" />}
  </g>
);

export const Xis: React.FC = () => (
  <g>
    <ellipse cx={0} cy={150} rx={430} ry={70} fill="#E6D3B3" />
    <ellipse cx={0} cy={110} rx={390} ry={60} fill="#D9A55A" />
    <path d="M-400,60 Q-300,10 -200,60 T0,60 T200,60 T400,60 L400,90 L-400,90 Z" fill="#5DAA3C" />
    <rect x={-380} y={30} width={760} height={34} rx={14} fill="#6B3A1E" />
    <path d="M-370,22 L370,22 L330,48 L-330,48 Z" fill="#F2C94C" />
    <rect x={-360} y={0} width={720} height={24} rx={12} fill="#E8A0A0" />
    <ellipse cx={-120} cy={-8} rx={130} ry={34} fill="#fff" /><ellipse cx={-120} cy={-12} rx={46} ry={22} fill="#F2B705" />
    {[-300, -240, 60, 120, 200, 280].map((x, i) => <ellipse key={i} cx={x} cy={-6 + (i % 2) * 8} rx={70} ry={20} fill="#D94A3A" />)}
    {Array.from({ length: 26 }).map((_, i) => (
      <circle key={i} cx={-330 + i * 26} cy={-24 + (i % 3) * 8} r={10} fill={i % 2 ? '#F7D046' : '#6CBF4A'} />
    ))}
    <path d="M-390,-30 Q0,-260 390,-30 Z" fill="#D9A55A" />
    <path d="M-330,-60 Q0,-230 330,-60" stroke="#E8BE7A" strokeWidth={20} fill="none" />
    {Array.from({ length: 12 }).map((_, i) => <ellipse key={i} cx={-220 + i * 40} cy={-150 + Math.abs(i - 6) * 12} rx={6} ry={3} fill="#F5E6C8" />)}
  </g>
);

export const LancheriaBG: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#F3E6C8" />
    {Array.from({ length: 12 }).map((_, r) =>
      Array.from({ length: 6 }).map((__, c) => (
        <rect key={`${r}-${c}`} x={c * 180 + (r % 2) * 90} y={900 + r * 80} width={176} height={76} fill={(r + c) % 2 ? '#E9D7B0' : '#F7EEDB'} />
      )),
    )}
    <rect x={120} y={570} width={840} height={230} rx={20} fill="#B23A2E" />
    <text x={540} y={665} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={70} fill="#fff">LANCHERIA</text>
    <text x={540} y={755} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={48} fill={MUST}>XIS • CACHORRO • À LA MINUTA</text>
    <rect x={-20} y={1500} width={1120} height={440} fill="#C2463A" />
    <rect x={-20} y={1500} width={1120} height={36} fill="#E35B4D" />
  </g>
);

export const StorefrontBG: React.FC = () => (
  <g>
    <defs><linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF9F5A" /><stop offset="1" stopColor="#FFE0A8" /></linearGradient></defs>
    <rect width={1080} height={1920} fill="url(#sun)" />
    <circle cx={880} cy={260} r={120} fill="#FFF3C4" opacity={0.85} />
    <rect x={60} y={360} width={960} height={1260} fill="#F3E3C3" />
    <rect x={120} y={430} width={840} height={110} rx={12} fill="#2F6B3A" />
    <text x={540} y={510} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={72} fill={MUST}>PADARIA</text>
    {Array.from({ length: 10 }).map((_, i) => (
      <path key={i} d={`M${60 + i * 96},560 h96 v90 q-48,40 -96,0 Z`} fill={i % 2 ? '#fff' : MUST} />
    ))}
    <rect x={130} y={720} width={500} height={600} fill="#7FB5D0" opacity={0.6} />
    {[820, 1000, 1180].map((y) => <rect key={y} x={150} y={y} width={460} height={14} fill="#7A4A24" />)}
    {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={210 + i * 110} cy={800} rx={44} ry={28} fill="#C98A3A" />)}
    <rect x={700} y={720} width={240} height={900} fill="#6B3E1E" />
    <circle cx={910} cy={1180} r={12} fill={MUST} />
    <rect x={0} y={1620} width={1080} height={300} fill="#C9BBA4" />
    <rect width={1080} height={1920} fill="rgba(255,170,90,.12)" />
  </g>
);
