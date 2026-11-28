import React from 'react';
import { MUST, clamp, easeOut, easeInOut, kf, lerp, pop } from '../lib';
import { StageFrame } from './Gremio';
import { RS } from './Mate';
import { Gent } from './Inter';

/* #006 Revolução Farroupilha — cards (1000×1000, centro em 0,0). Sem fotos de terceiros. */
export const VERDE = '#1E7B3A';
export const VERMELHO = '#C62828';
export const AMARELO = '#F2C230';
const F = 'Montserrat';

/* bandeira rio-grandense (faixas diagonais verde, vermelho, amarelo), sem brasão; ondula com t */
export const RSFlag: React.FC<{ t: number; w?: number; h?: number }> = ({ t, w = 300, h = 200 }) => {
  const n = 12;
  return (
    <g>
      <defs>
        <clipPath id={`rsf${w}`}><rect x={0} y={0} width={w} height={h} /></clipPath>
      </defs>
      {Array.from({ length: n }).map((_, i) => {
        const x0 = (i * w) / n, x1 = ((i + 1) * w) / n;
        const dy = (k: number) => Math.sin(t * 5 - k / 40) * 8 * (k / w);
        return (
          <g key={i}>
            <clipPath id={`rss${w}${i}`}>
              <path d={`M${x0},${dy(x0)} L${x1},${dy(x1)} L${x1},${h + dy(x1)} L${x0},${h + dy(x0)} Z`} />
            </clipPath>
            <g clipPath={`url(#rss${w}${i})`}>
              <g transform={`translate(0,${dy((x0 + x1) / 2)})`}>
                <polygon points={`0,0 ${w},0 0,${h}`} fill={VERDE} />
                <polygon points={`${w},0 ${w},${h} 0,${h}`} fill={AMARELO} />
                <polygon points={`${w * 0.72},0 ${w},0 ${w},${h * 0.28} ${w * 0.28},${h} 0,${h} 0,${h * 0.72}`} fill={VERMELHO} />
              </g>
            </g>
          </g>
        );
      })}
    </g>
  );
};

/* 1 · "O RS já foi um país?": o RS se solta do mapa */
export const StageCountry: React.FC<{ t: number; splitT: number }> = ({ t, splitT }) => {
  const k = easeOut(clamp((t - splitT) / 0.8));
  return (
    <StageFrame fill="#9FD3EE">
      <path d="M-380,-430 C-200,-470 120,-460 330,-380 C420,-300 440,-160 380,-40 C340,40 260,110 150,170 C60,230 -20,250 -70,240 C-150,220 -260,140 -330,40 C-420,-80 -460,-300 -380,-430 Z" fill="#B9D38A" stroke="#7FA357" strokeWidth={8} />
      <text x={-20} y={-120} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={70} fill="rgba(40,70,30,.35)">BRASIL</text>
      <g transform={`translate(${-230 + k * -40},${150 + k * 130}) scale(0.5) rotate(${k * -6} 330 385)`}>
        <path d={RS} fill={k > 0.3 ? '#F4E3A0' : '#B9D38A'} stroke={k > 0.3 ? VERMELHO : '#7FA357'} strokeWidth={k > 0.3 ? 16 : 10} strokeDasharray={k > 0.3 ? '30 18' : undefined} strokeLinejoin="round" />
        <text x={330} y={420} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill="#1E1B18">RS</text>
      </g>
      {k > 0.5 && (
        <g transform={`translate(240,280) scale(${pop(t, splitT + 0.5, 0.3)}) rotate(-8)`}>
          <text textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={190} fill={MUST} stroke="#1E1B18" strokeWidth={14} paintOrder="stroke">?</text>
        </g>
      )}
    </StageFrame>
  );
};

/* 2 · charque no varal + carimbo IMPOSTO */
export const StageCharque: React.FC<{ t: number; stampT: number }> = ({ t, stampT }) => (
  <StageFrame fill="#E9D6B0">
    <rect x={-500} y={260} width={1000} height={240} fill="#B9A07A" />
    {[-300, 300].map((x) => <rect key={x} x={x - 10} y={-320} width={20} height={600} fill="#6B4E2E" />)}
    <path d="M-300,-280 Q0,-230 300,-280" stroke="#4A3A2A" strokeWidth={6} fill="none" />
    {[-220, -120, -20, 80, 180].map((x, i) => (
      <g key={i} transform={`translate(${x},${-262 + Math.abs(x) * 0.08}) rotate(${Math.sin(t * 1.5 + i) * 4})`}>
        <path d="M-34,0 L34,0 L40,220 Q0,250 -40,220 Z" fill={i % 2 ? '#8E3B2A' : '#A2483A'} stroke="#5A2018" strokeWidth={4} />
        <path d="M-20,30 q10,60 -4,150 M16,40 q-6,70 6,140" stroke="rgba(255,230,210,.35)" strokeWidth={5} fill="none" />
      </g>
    ))}
    <text x={0} y={140} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={64} fill="#4A3A2A">CHARQUE</text>
    {t > stampT && (
      <g transform={`translate(80,300) rotate(-14) scale(${(2.2 - 1.2 * easeOut((t - stampT) / 0.2)) * 0.9})`} opacity={easeOut((t - stampT) / 0.2)}>
        <rect x={-250} y={-80} width={500} height={160} rx={20} fill="none" stroke={VERMELHO} strokeWidth={16} />
        <text x={0} y={36} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill={VERMELHO}>IMPOSTO</text>
      </g>
    )}
  </StageFrame>
);

/* 3 · camisa remendada no varal → bandeira "FARRAPOS" com orgulho */
export const StageFarrapos: React.FC<{ t: number; morphT: number }> = ({ t, morphT }) => {
  const k = easeInOut(clamp((t - morphT) / 0.8));
  return (
    <StageFrame fill={lerpColor(k)}>
      <g opacity={1 - k}>
        <path d="M-300,-280 Q0,-240 300,-280" stroke="#4A3A2A" strokeWidth={6} fill="none" />
        <g transform={`translate(0,-250) rotate(${Math.sin(t * 2) * 3})`}>
          <path d="M-150,0 L-60,-20 Q0,10 60,-20 L150,0 L210,120 L140,150 L130,90 L130,420 L-130,420 L-130,90 L-140,150 L-210,120 Z" fill="#8C7A5E" stroke="#4A3A2A" strokeWidth={6} />
          {[[-70, 120, 70, 60, '#A9946E'], [40, 250, 80, 70, '#6E5C40'], [-60, 320, 60, 50, '#B5A07A']].map(([x, y, w, h, c], i) => (
            <g key={i}>
              <rect x={x as number} y={y as number} width={w as number} height={h as number} fill={c as string} stroke="#3A2A1A" strokeWidth={4} transform={`rotate(${i * 7 - 6} ${x} ${y})`} />
              <path d={`M${(x as number) + 6},${(y as number) + 6} l${(w as number) - 12},0`} stroke="#F4EEE2" strokeWidth={3} strokeDasharray="6 6" />
            </g>
          ))}
          <path d="M100,380 l20,40 l-30,-10 Z M-110,400 l-14,30 l22,-6 Z" fill="#3A2A1A" />
        </g>
      </g>
      {k > 0 && (
        <g transform={`scale(${0.6 + 0.4 * k}) rotate(${-6 * k})`} opacity={k}>
          <rect x={-420} y={-120} width={840} height={240} rx={24} fill={VERMELHO} stroke="#fff" strokeWidth={12} />
          <text x={0} y={46} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={150} fill="#fff" stroke="#1E1B18" strokeWidth={10} paintOrder="stroke">FARRAPOS</text>
          {[-1, 1].map((s) => <text key={s} x={s * 350} y={-170} textAnchor="middle" fontFamily='"Noto Color Emoji"' fontSize={90}>✊</text>)}
        </g>
      )}
    </StageFrame>
  );
};
const lerpColor = (k: number) => {
  const a = [233, 214, 176], b = [30, 60, 40];
  return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(',')})`;
};

/* 4 · República Rio-Grandense: bandeira subindo no mastro + pin em Piratini */
export const StageRepublic: React.FC<{ t: number; flagT: number; pinT: number }> = ({ t, flagT, pinT }) => {
  const up = easeOut(clamp((t - flagT + 1.2) / 1.6));
  return (
    <StageFrame fill="#CFE3EE">
      <rect x={-500} y={260} width={1000} height={240} fill="#7FA357" />
      <rect x={-260} y={-420} width={14} height={700} fill="#8C8070" />
      <circle cx={-253} cy={-424} r={14} fill={MUST} />
      <g transform={`translate(-246,${lerp(200, -400, up)})`}><RSFlag t={t} w={330} h={220} /></g>
      {t > flagT && (
        <g transform={`translate(160,-40) scale(${pop(t, flagT, 0.3)})`}>
          <rect x={-200} y={-60} width={400} height={120} rx={20} fill="#1E1B18" />
          <text x={0} y={-8} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={34} fill={MUST}>REPÚBLICA</text>
          <text x={0} y={36} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={34} fill="#fff">RIO-GRANDENSE</text>
        </g>
      )}
      {t > pinT && (
        <g transform={`translate(180,200) scale(${pop(t, pinT, 0.3)})`}>
          <path d="M0,40 C-40,-10 -40,-60 0,-80 C40,-60 40,-10 0,40 Z" fill={VERMELHO} stroke="#fff" strokeWidth={6} />
          <circle cx={0} cy={-40} r={14} fill="#fff" />
          <rect x={-170} y={60} width={340} height={80} rx={40} fill={MUST} />
          <text x={0} y={114} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={40} fill="#1E1B18">PIRATINI · 1836</text>
        </g>
      )}
    </StageFrame>
  );
};

/* 5 · mapa RS → Laguna (SC) */
export const StageLaguna: React.FC<{ t: number; prog: number; julianaT: number }> = ({ t, prog, julianaT }) => {
  const A = { x: -120, y: 300 }, B = { x: 230, y: -260 };
  const C = { x: 260, y: 160 };
  const pt = (k: number) => ({ x: (1 - k) ** 2 * A.x + 2 * (1 - k) * k * C.x + k * k * B.x, y: (1 - k) ** 2 * A.y + 2 * (1 - k) * k * C.y + k * k * B.y });
  const p = pt(prog);
  return (
    <StageFrame fill="#9FD3EE">
      <path d="M-500,-500 L240,-500 C200,-380 260,-300 230,-200 C200,-80 280,40 230,180 C170,330 60,420 -60,500 L-500,500 Z" fill="#B9D38A" stroke="#7FA357" strokeWidth={8} />
      <path d="M-500,-40 C-300,-60 -120,-80 220,-120" stroke="#7FA357" strokeWidth={5} strokeDasharray="14 10" fill="none" />
      <text x={-200} y={-200} fontFamily={F} fontWeight={900} fontSize={54} fill="rgba(40,70,30,.4)">SC</text>
      <text x={-260} y={150} fontFamily={F} fontWeight={900} fontSize={54} fill="rgba(40,70,30,.4)">RS</text>
      <ellipse cx={-40} cy={300} rx={40} ry={150} fill="#9FD3EE" transform="rotate(-30 -40 300)" />
      <path d={`M${A.x},${A.y} Q${C.x},${C.y} ${B.x},${B.y}`} fill="none" stroke="#fff" strokeWidth={8} strokeDasharray="22 16" opacity={0.85} />
      <circle cx={B.x} cy={B.y} r={18} fill={VERMELHO} stroke="#fff" strokeWidth={6} />
      <text x={B.x - 30} y={B.y - 34} textAnchor="end" fontFamily={F} fontWeight={900} fontSize={40} fill="#1E1B18">LAGUNA · 1839</text>
      {prog > 0 && <g transform={`translate(${p.x},${p.y + Math.sin(t * 8) * 4})`}><circle r={26} fill={VERMELHO} stroke="#fff" strokeWidth={6} /><circle r={9} fill={AMARELO} /></g>}
      {t > julianaT && (
        <g transform={`translate(-60,-380) scale(${pop(t, julianaT, 0.3)})`}>
          <rect x={-260} y={-50} width={520} height={100} rx={50} fill={MUST} />
          <text x={0} y={16} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={44} fill="#1E1B18">REPÚBLICA JULIANA</text>
        </g>
      )}
    </StageFrame>
  );
};

/* barco sobre rodas */
const LandBoat: React.FC<{ t: number; c: string; name: string }> = ({ t, c, name }) => (
  <g>
    <rect x={-30} y={-330} width={14} height={260} fill="#5A4A3A" />
    <path d="M-16,-320 Q90,-250 -16,-110 Z" fill="#F4EEE2" stroke="#BFB5A2" strokeWidth={4} />
    <path d="M-220,-80 L220,-80 L170,10 L-170,10 Z" fill={c} stroke="#3A2A1A" strokeWidth={6} />
    <text x={0} y={-24} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={30} fill="#F4EEE2">{name}</text>
    <rect x={-190} y={10} width={380} height={22} fill="#6B4E2E" />
    {[-140, 0, 140].map((x) => (
      <g key={x} transform={`translate(${x},46) rotate(${-t * 220})`}>
        <circle r={38} fill="#8C6A44" stroke="#3A2A1A" strokeWidth={6} />
        {[0, 45, 90, 135].map((a) => <rect key={a} x={-3} y={-34} width={6} height={68} fill="#3A2A1A" transform={`rotate(${a})`} />)}
      </g>
    ))}
  </g>
);

/* 6 · os barcos andando POR TERRA (a virada) */
export const StageBoatsLand: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const x = kf(t, [[a, -700], [b, 520]]);
  const bump = Math.abs(Math.sin(t * 9)) * 6;
  return (
    <StageFrame fill="#CFE3EE">
      <path d="M-500,120 Q-200,60 0,110 T500,90 L500,500 L-500,500 Z" fill="#7FA357" />
      {[-380, -150, 120, 360].map((xx, i) => <ellipse key={i} cx={xx} cy={60 - (i % 2) * 20} rx={110} ry={40} fill="#6E9A45" opacity={0.6} />)}
      <g transform={`translate(${x},${300 - bump}) scale(0.8)`}><LandBoat t={t} c="#5A3A2A" name="SEIVAL" /></g>
      <g transform={`translate(${x - 470},${330 - bump}) scale(0.72)`}><LandBoat t={t} c="#3E4A5A" name="FARROUPILHA" /></g>
      {/* homens puxando (silhuetas simples) */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${x + 230 + i * 70},${390}) scale(0.45)`}>
          <Gent t={t + i * 0.3} skin={['#C68E64', '#8A5A3C', '#E2B08A'][i]} coat={['#5A3A2A', '#3E3A36', '#4E4A2E'][i]} hat={(['cap', 'none', 'boater'] as const)[i]} walk={1} />
        </g>
      ))}
      <path d={`M${x + 160},${330} L${x + 380},${260}`} stroke="#4A3A2A" strokeWidth={5} />
    </StageFrame>
  );
};

/* 7 · linha do tempo 1835 → 1845 */
export const StageTenYears: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = easeInOut(clamp((t - a) / 1.0));
  return (
    <StageFrame fill="#2A2420">
      <rect x={-400} y={-30} width={800} height={60} rx={30} fill="rgba(255,255,255,.15)" />
      <rect x={-400} y={-30} width={800 * k} height={60} rx={30} fill={MUST} />
      {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={-400 + i * 80 - 3} y={40} width={6} height={i % 5 === 0 ? 40 : 20} fill="#fff" opacity={0.6} />)}
      <text x={-400} y={140} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill="#fff">1835</text>
      <text x={400} y={140} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill="#fff" opacity={k}>1845</text>
      <text x={0} y={-140} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill={MUST} transform={`scale(${pop(t, a + 0.8, 0.3) || 0.001})`}>10 ANOS</text>
    </StageFrame>
  );
};

/* 8 · Porongos — SÓBRIO: noite, coxilha, lanças em silhueta. Sem violência gráfica, sem humor. */
export const StagePorongos: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = clamp((t - a) / 1.5);
  return (
    <StageFrame fill="#141A24">
      {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={-480 + ((i * 173) % 960)} cy={-460 + ((i * 97) % 420)} r={2 + (i % 3)} fill="#fff" opacity={0.25 + 0.2 * Math.sin(t + i)} />)}
      <circle cx={300} cy={-300} r={60} fill="#D9D2C0" opacity={0.6} />
      <path d="M-500,180 Q-250,60 0,140 T500,120 L500,500 L-500,500 Z" fill="#20262E" />
      {Array.from({ length: 9 }).map((_, i) => {
        const x = -360 + i * 90 + (i % 2) * 14;
        const h = 300 + (i % 3) * 40;
        return (
          <g key={i} opacity={k}>
            <rect x={x - 4} y={150 - h} width={8} height={h} fill="#0C0F14" transform={`rotate(${(i % 3) - 1} ${x} 150)`} />
            <path d={`M${x - 12},${150 - h} L${x},${120 - h} L${x + 12},${150 - h} Z`} fill="#0C0F14" />
          </g>
        );
      })}
      <g opacity={clamp((t - a - 0.8) / 1.0)}>
        <text x={0} y={330} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill="#E8E2D6">LANCEIROS NEGROS</text>
        <text x={0} y={400} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={40} fill="#B8B0A0">PORONGOS · 1844</text>
      </g>
    </StageFrame>
  );
};

/* 9 · Livro dos Heróis e Heroínas da Pátria abrindo */
export const StageBook: React.FC<{ t: number; openT: number }> = ({ t, openT }) => {
  const k = easeOut(clamp((t - openT) / 0.8));
  return (
    <StageFrame fill="#2A2420">
      <g transform="translate(0,40)">
        <rect x={-380} y={-260} width={760} height={520} rx={16} fill="#5A3A24" />
        <rect x={-360} y={-240} width={360} height={480} fill="#F4EEE2" />
        <g transform={`translate(0,0) scale(${lerp(-1, 1, k)},1)`}>
          <rect x={0} y={-240} width={360} height={480} fill={k > 0.5 ? '#F4EEE2' : '#7A4A2C'} stroke="#3A2414" strokeWidth={4} />
          {k <= 0.5 && <text x={180} y={-40} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={30} fill={MUST} transform="scale(-1,1) translate(-360,0)">LIVRO DOS HERÓIS</text>}
        </g>
        {k > 0.5 && (
          <g fontFamily={F} fontWeight={800}>
            <text x={-180} y={-170} textAnchor="middle" fontSize={26} fill="#5A4A3A">LIVRO DOS HERÓIS E</text>
            <text x={-180} y={-136} textAnchor="middle" fontSize={26} fill="#5A4A3A">HEROÍNAS DA PÁTRIA</text>
            {[-80, -30, 20, 70, 120].map((y) => <rect key={y} x={-320} y={y} width={280} height={10} rx={5} fill="#C9BFAE" />)}
            <rect x={30} y={-40} width={300} height={90} rx={12} fill={MUST} opacity={clamp((t - openT - 0.6) / 0.4)} />
            <text x={180} y={-4} textAnchor="middle" fontSize={34} fontWeight={900} fill="#1E1B18" opacity={clamp((t - openT - 0.6) / 0.4)}>LANCEIROS</text>
            <text x={180} y={34} textAnchor="middle" fontSize={34} fontWeight={900} fill="#1E1B18" opacity={clamp((t - openT - 0.6) / 0.4)}>NEGROS</text>
          </g>
        )}
      </g>
    </StageFrame>
  );
};

/* mão aberta (5 dedos) estilizada para o aperto de mãos */
const ShakeHand: React.FC<{ skin: string; cuff: string; flip?: boolean }> = ({ skin, cuff, flip }) => (
  <g transform={flip ? 'scale(-1,1)' : undefined}>
    <rect x={-360} y={-50} width={240} height={100} rx={20} fill={cuff} />
    <rect x={-140} y={-56} width={40} height={112} rx={10} fill="#F4EEE2" />
    <path d="M-100,-46 C-40,-60 20,-56 40,-30 L60,-30 C80,-30 80,-6 60,-6 L40,-6 C60,6 60,26 40,30 C40,46 20,52 0,46 C-30,56 -70,54 -100,46 Z" fill={skin} stroke="rgba(90,50,30,.4)" strokeWidth={3} />
    {[-30, -8, 14].map((x, i) => <path key={i} d={`M${x},-40 l0,80`} stroke="rgba(90,50,30,.25)" strokeWidth={3} />)}
    <path d="M-60,-46 q30,-30 60,-24" stroke="rgba(90,50,30,.4)" strokeWidth={4} fill="none" />
  </g>
);

/* 10 · Paz de Ponche Verde: aperto de mãos */
export const StagePeace: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const k = easeOut(clamp((t - at + 0.8) / 0.8));
  const shake = t > at ? Math.sin((t - at) * 14) * 8 * Math.max(0, 1 - (t - at) / 1.2) : 0;
  return (
    <StageFrame fill="#E9DFC8">
      <g transform={`translate(0,${shake}) scale(1.7)`}>
        <g transform={`translate(${lerp(-300, 0, k)},0)`}><ShakeHand skin="#D9A57B" cuff="#2E3F52" /></g>
        <g transform={`translate(${lerp(300, 0, k)},20)`}><ShakeHand skin="#C68E64" cuff={VERDE} flip /></g>
      </g>
      <g transform={`translate(0,-300) scale(${pop(t, at + 0.2, 0.3)})`}>
        <text textAnchor="middle" fontFamily='"Noto Color Emoji"' fontSize={110}>🕊️</text>
      </g>
      <g transform={`translate(0,300) scale(${pop(t, at + 0.4, 0.3)})`}>
        <rect x={-320} y={-56} width={640} height={112} rx={56} fill={MUST} />
        <text x={0} y={20} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={50} fill="#1E1B18">PONCHE VERDE · 1845</text>
      </g>
    </StageFrame>
  );
};

/* 11 · desfile do 20 de setembro (cavaleiros + bandeiras) */
export const StageParade: React.FC<{ t: number }> = ({ t }) => (
  <StageFrame fill="#CFE3EE">
    {/* bandeirolas */}
    <path d="M-500,-360 Q0,-300 500,-360" stroke="#5A4A3A" strokeWidth={4} fill="none" />
    {Array.from({ length: 14 }).map((_, i) => {
      const x = -470 + i * 72, y = -356 + Math.sin((i / 13) * Math.PI) * 52;
      return <path key={i} d={`M${x - 24},${y} L${x + 24},${y} L${x},${y + 46} Z`} fill={[VERDE, VERMELHO, AMARELO][i % 3]} transform={`rotate(${Math.sin(t * 3 + i) * 6} ${x} ${y})`} />;
    })}
    <rect x={-500} y={200} width={1000} height={300} fill="#B9A07A" />
    {[0, 1, 2].map((i) => {
      const x = ((t * 140 + i * 360) % 1300) - 650;
      const bob = Math.abs(Math.sin(t * 6 + i)) * 10;
      return (
        <g key={i} transform={`translate(${x},${240 - bob})`}>
          {/* cavalo */}
          <path d="M-130,-60 Q-120,-130 -20,-130 L80,-130 Q120,-150 150,-200 L180,-190 Q170,-140 140,-110 L120,-60 Z" fill={['#6B4A30', '#3A2A20', '#8C6A44'][i]} />
          {[-100, -60, 60, 100].map((lx, j) => <rect key={j} x={lx} y={-70} width={16} height={100} rx={6} fill={['#5A3A24', '#2A1A14', '#7A5A38'][i]} transform={`rotate(${Math.sin(t * 9 + j * 1.6 + i) * 14} ${lx + 8} -70)`} />)}
          {/* cavaleiro (silhueta) */}
          <rect x={-20} y={-250} width={60} height={130} rx={22} fill="#F4EEE2" />
          <circle cx={10} cy={-280} r={28} fill="#C68E64" />
          <ellipse cx={10} cy={-300} rx={56} ry={10} fill="#1E1B18" />
          <rect x={-14} y={-334} width={48} height={34} rx={8} fill="#1E1B18" />
          <path d="M-10,-200 L40,-200 L10,-160 Z" fill={MUST} />
          {/* bandeira */}
          <rect x={56} y={-420} width={6} height={260} fill="#8C8070" />
          <g transform="translate(62,-420) scale(0.42)"><RSFlag t={t + i} w={300} h={200} /></g>
        </g>
      );
    })}
  </StageFrame>
);

/* 12 · bandeira grande tremulando */
export const StageBigFlag: React.FC<{ t: number; at: number }> = ({ t, at }) => (
  <StageFrame fill="#1E2A36">
    <g transform={`translate(-330,-260) scale(${0.6 + 0.4 * easeOut(clamp((t - at) / 0.5))})`}><RSFlag t={t} w={660} h={440} /></g>
    <g transform={`translate(0,330) scale(${pop(t, at + 0.4, 0.3)})`}>
      <rect x={-440} y={-56} width={880} height={112} rx={56} fill={MUST} />
      <text x={0} y={14} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={34} fill="#1E1B18">NASCEU NA REPÚBLICA RIO-GRANDENSE</text>
    </g>
  </StageFrame>
);
