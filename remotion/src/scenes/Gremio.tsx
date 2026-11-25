import React from 'react';
import { MUST, clamp, easeOut, kf, pop } from '../lib';

/* All "stage" illustrations live in a 1000x1000 box centered at (0,0). Club colors only — no crests/logos. */
export const BLUE = '#0D80BF';
export const BLACK = '#151515';
const SEPIA_BG = '#E9D6B0';

export const StageFrame: React.FC<{ fill?: string; children: React.ReactNode }> = ({ fill = '#F4EBDD', children }) => (
  <g>
    <defs>
      <clipPath id="stageClip"><rect x={-500} y={-500} width={1000} height={1000} rx={48} /></clipPath>
    </defs>
    <rect x={-492} y={-480} width={1000} height={1000} rx={48} fill="rgba(0,0,0,.35)" />
    <g clipPath="url(#stageClip)">
      <rect x={-500} y={-500} width={1000} height={1000} fill={fill} />
      {children}
    </g>
    <rect x={-500} y={-500} width={1000} height={1000} rx={48} fill="none" stroke="#fff" strokeWidth={10} />
  </g>
);

/* Old leather ball: deflate 0..1, burst particles after burstT */
export const OldBall: React.FC<{ t: number; deflate?: number; burst?: number }> = ({ t, deflate = 0, burst = 0 }) => (
  <g>
    <ellipse cx={0} cy={130 - 20 * deflate} rx={150 + 40 * deflate} ry={22} fill="rgba(0,0,0,.25)" />
    <g transform={`translate(0,${40 * deflate}) scale(${1 + 0.25 * deflate},${1 - 0.45 * deflate})`}>
      <circle cx={0} cy={0} r={120} fill="#8A5A2B" />
      <circle cx={-30} cy={-40} r={60} fill="rgba(255,255,255,.12)" />
      <path d="M-120,0 C-60,-20 60,-20 120,0 M-120,0 C-60,24 60,24 120,0 M0,-120 C-22,-60 -22,60 0,120 M0,-120 C22,-60 22,60 0,120" stroke="#5C3A1A" strokeWidth={6} fill="none" />
      <path d="M-10,-92 l20,0 M-10,-80 l20,0 M-10,-68 l20,0" stroke="#E8D3B0" strokeWidth={4} />
      {deflate > 0.3 && <path d="M-80,40 q20,-10 40,0 q20,10 40,0 q20,-10 40,0" stroke="#5C3A1A" strokeWidth={5} fill="none" opacity={deflate} />}
    </g>
    {burst > 0 && [0, 1, 2, 3, 4, 5].map((i) => {
      const a = -Math.PI / 2 + (i - 2.5) * 0.35, d = 120 + burst * 220;
      return <circle key={i} cx={Math.cos(a) * d} cy={-30 + Math.sin(a) * d} r={20 + burst * 30} fill="#fff" opacity={0.7 * (1 - burst)} />;
    })}
    {burst > 0 && burst < 1 && (
      <text x={0} y={-200 - burst * 60} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={90} fill="#fff" stroke="#151515" strokeWidth={12} paintOrder="stroke" transform={`rotate(-8)`} opacity={1 - burst * 0.6}>FSSSSS!</text>
    )}
  </g>
);

/* 1900s exhibition match (sepia) */
const Player: React.FC<{ x: number; y: number; s?: number; c: string; leg?: number }> = ({ x, y, s = 1, c, leg = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cx={0} cy={-150} r={30} fill="#D9B48A" />
    <path d="M-22,-140 q22,10 44,0" stroke="#3B2414" strokeWidth={8} fill="none" />
    <rect x={-34} y={-120} width={68} height={90} rx={14} fill={c} />
    <rect x={-30} y={-32} width={60} height={46} rx={8} fill="#F4EEE2" />
    <rect x={-26} y={10} width={18} height={80} rx={8} fill="#2A2420" transform={`rotate(${leg} -17 10)`} />
    <rect x={8} y={10} width={18} height={80} rx={8} fill="#2A2420" transform={`rotate(${-leg} 17 10)`} />
  </g>
);
export const StageMatch: React.FC<{ t: number; burstT: number }> = ({ t, burstT }) => {
  const b = clamp((t - burstT) / 0.6);
  return (
    <StageFrame fill={SEPIA_BG}>
      <rect x={-500} y={-60} width={1000} height={560} fill="#B7A06A" />
      <line x1={-500} y1={-60} x2={500} y2={-60} stroke="#F4EEE2" strokeWidth={8} />
      <rect x={-420} y={-330} width={840} height={170} fill="#C9B184" />
      {Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={-390 + i * 52} cy={-240 + (i % 2) * 26} r={20} fill="#7A6444" />)}
      <Player x={-300} y={260} c="#5A6B8A" leg={Math.sin(t * 8) * 14} />
      <Player x={-120} y={300} c="#7A3A2A" leg={-Math.sin(t * 8) * 14} />
      <Player x={260} y={260} c="#5A6B8A" leg={Math.sin(t * 8 + 1) * 14} />
      <g transform="translate(80,300) scale(0.6)"><OldBall t={t} deflate={b} burst={b} /></g>
      <rect x={-500} y={-500} width={1000} height={1000} fill="rgba(120,80,30,.18)" />
    </StageFrame>
  );
};

/* Cândido Dias raises his ball from the crowd */
export const StageCandido: React.FC<{ t: number; lt: number }> = ({ t, lt }) => {
  const up = easeOut(clamp(lt / 0.8));
  return (
    <StageFrame fill={SEPIA_BG}>
      <rect x={-500} y={60} width={1000} height={440} fill="#C9B184" />
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i} transform={`translate(${-420 + i * 140},${220 + (i % 2) * 30})`}>
          <circle cx={0} cy={-80} r={40} fill="#B99A70" /><rect x={-50} y={-40} width={100} height={160} rx={30} fill="#8A7458" />
        </g>
      ))}
      <g transform="translate(0,150)">
        <rect x={-80} y={-60} width={160} height={300} rx={40} fill="#3F3A34" />
        <circle cx={0} cy={-120} r={62} fill="#E2BE98" />
        <path d="M-40,-96 q40,18 80,0" stroke="#3B2414" strokeWidth={10} fill="none" />
        <ellipse cx={0} cy={-176} rx={90} ry={16} fill="#1E1B18" />
        <path d="M-56,-176 C-56,-250 56,-250 56,-176 Z" fill="#1E1B18" />
        <rect x={60} y={-40} width={44} height={200} rx={22} fill="#3F3A34" transform={`rotate(${-160 * up} 82 -30)`} />
        <g transform={`translate(${82 - Math.sin((-160 * up * Math.PI) / 180) * 190},${-30 + Math.cos((-160 * up * Math.PI) / 180) * 190})`}>
          <g transform="scale(0.55)"><OldBall t={t} /></g>
        </g>
      </g>
      <rect x={-500} y={-500} width={1000} height={1000} fill="rgba(120,80,30,.15)" />
    </StageFrame>
  );
};

/* Calendar page + FUNDADO stamp */
export const StageCalendar: React.FC<{ t: number; stampT: number; day?: string; month?: string; year?: string; stamp?: string; stampC?: string }> = ({ t, stampT, day = '15', month = 'SETEMBRO', year = '1903', stamp = 'FUNDADO', stampC = BLUE }) => (
  <StageFrame fill="#2F4F6F">
    <g transform="rotate(-4)">
      <rect x={-300} y={-330} width={600} height={660} rx={30} fill="#FAF6EE" />
      <rect x={-300} y={-330} width={600} height={150} rx={30} fill="#B23A2E" />
      <rect x={-300} y={-230} width={600} height={50} fill="#B23A2E" />
      <text x={0} y={-230} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={72} fill="#fff">{month}</text>
      <text x={0} y={110} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={320} fill="#1E1B18">{day}</text>
      <text x={0} y={250} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={90} fill="#5A5048">{year}</text>
      {[-200, -100, 0, 100, 200].map((x) => <circle key={x} cx={x} cy={-345} r={18} fill="#9AA0A8" />)}
    </g>
    {t > stampT && (
      <g transform={`translate(130,360) rotate(-14) scale(${(2.2 - 1.2 * easeOut((t - stampT) / 0.2)) * 0.85})`} opacity={easeOut((t - stampT) / 0.2)}>
        <rect x={-260} y={-80} width={520} height={160} rx={20} fill="none" stroke={stampC} strokeWidth={16} />
        <text x={0} y={36} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={110} fill={stampC}>{stamp}</text>
      </g>
    )}
  </StageFrame>
);

/* Jersey: celeste+havana → tricolor stripes (morph 0..1 wipes top→bottom) */
export const Jersey: React.FC<{ morph: number }> = ({ morph }) => {
  const shape = 'M-170,-260 L-70,-300 Q0,-250 70,-300 L170,-260 L300,-140 L230,-40 L170,-90 L170,300 L-170,300 L-170,-90 L-230,-40 L-300,-140 Z';
  return (
    <g>
      <defs>
        <clipPath id="jerseyClip"><path d={shape} /></clipPath>
        <clipPath id="wipeClip"><rect x={-320} y={-320} width={640} height={640 * morph} /></clipPath>
      </defs>
      <g clipPath="url(#jerseyClip)">
        <rect x={-320} y={-320} width={320} height={640} fill="#8EC9EE" />
        <rect x={0} y={-320} width={320} height={640} fill="#A0703F" />
        <g clipPath="url(#wipeClip)">
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-320 + i * 56} y={-320} width={56} height={640} fill={[BLUE, BLACK, '#F4F4F4', BLACK][i % 4]} />)}
        </g>
      </g>
      <path d={shape} fill="none" stroke="#1E1B18" strokeWidth={10} strokeLinejoin="round" />
      <path d="M-70,-300 Q0,-230 70,-300" fill="none" stroke="#1E1B18" strokeWidth={10} />
    </g>
  );
};

export const StageJersey: React.FC<{ t: number; morph: number; labels?: boolean }> = ({ morph, labels = true }) => (
  <StageFrame fill="#FDF7EC">
    <g transform="translate(0,40) scale(1.15)"><Jersey morph={morph} /></g>
    {labels && morph < 0.05 && (
      <g fontFamily="Montserrat" fontWeight={900}>
        <rect x={-460} y={-440} width={330} height={90} rx={20} fill="#8EC9EE" stroke="#1E1B18" strokeWidth={6} />
        <text x={-295} y={-380} textAnchor="middle" fontSize={44} fill="#1E1B18">CELESTE</text>
        <rect x={130} y={-440} width={330} height={90} rx={20} fill="#A0703F" stroke="#1E1B18" strokeWidth={6} />
        <text x={295} y={-380} textAnchor="middle" fontSize={44} fill="#fff">HAVANA</text>
      </g>
    )}
  </StageFrame>
);

/* World map (stylized) with an arc from Porto Alegre to Japan */
export const StageWorld: React.FC<{ t: number; prog: number; germany?: number; dotC?: string }> = ({ t, prog, germany = 0, dotC = BLUE }) => {
  const P = { x: -210, y: 230 }, J = { x: 390, y: -60 };
  const cx = 60, cy = -330;
  const pt = (k: number) => ({ x: (1 - k) * (1 - k) * P.x + 2 * (1 - k) * k * cx + k * k * J.x, y: (1 - k) * (1 - k) * P.y + 2 * (1 - k) * k * cy + k * k * J.y });
  const dot = pt(prog);
  return (
    <StageFrame fill="#9FD3EE">
      <g fill="#7DB34E" stroke="#5E8F3A" strokeWidth={6}>
        <path d="M-430,-260 C-380,-320 -260,-330 -230,-260 C-210,-200 -280,-150 -300,-100 C-320,-60 -380,-80 -400,-140 Z" />
        <path d="M-280,-60 C-220,-60 -170,0 -180,80 C-190,170 -200,280 -230,330 C-260,300 -260,200 -290,120 C-320,40 -330,-40 -280,-60 Z" />
        <path d="M-60,-300 C0,-330 80,-320 100,-270 C80,-230 20,-230 -20,-240 C-50,-250 -80,-270 -60,-300 Z" />
        <path d="M-60,-200 C20,-200 80,-120 60,0 C40,120 0,180 -20,200 C-60,140 -80,40 -90,-60 C-96,-140 -100,-190 -60,-200 Z" />
        <path d="M100,-300 C220,-340 380,-320 430,-240 C420,-160 300,-120 200,-130 C140,-140 90,-200 100,-300 Z" />
        <path d="M300,120 C360,100 420,140 410,200 C370,240 300,220 290,180 Z" />
        <ellipse cx={400} cy={-70} rx={16} ry={40} transform="rotate(30 400 -70)" />
      </g>
      <path d={`M${P.x},${P.y} Q${cx},${cy} ${J.x},${J.y}`} fill="none" stroke="#fff" strokeWidth={8} strokeDasharray="22 16" opacity={0.85} />
      <circle cx={P.x} cy={P.y} r={16} fill="#B23A2E" stroke="#fff" strokeWidth={5} />
      <text x={P.x + 26} y={P.y + 50} fontFamily="Montserrat" fontWeight={900} fontSize={34} fill="#1E1B18">PORTO ALEGRE</text>
      <circle cx={J.x} cy={J.y} r={16} fill="#B23A2E" stroke="#fff" strokeWidth={5} />
      <text x={J.x - 10} y={J.y + 58} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill="#1E1B18">JAPÃO</text>
      {prog > 0 && <g transform={`translate(${dot.x},${dot.y + Math.sin(t * 10) * 4})`}><circle r={30} fill={dotC} stroke="#fff" strokeWidth={6} /><circle r={10} fill="#fff" /></g>}
      {germany > 0 && (
        <g transform={`translate(10,-360) scale(${germany})`}>
          <rect x={-60} y={-40} width={120} height={27} fill="#111" /><rect x={-60} y={-13} width={120} height={27} fill="#DD0000" /><rect x={-60} y={14} width={120} height={27} fill="#FFCE00" />
          <rect x={-60} y={-40} width={120} height={81} fill="none" stroke="#fff" strokeWidth={4} />
        </g>
      )}
    </StageFrame>
  );
};

/* Scoreboard (SVG) */
export const Scoreboard: React.FC<{ t: number; at: number; home: string; away: string; hs: number; as: number; label: string; sepia?: boolean; homeC?: string; awayC?: string }> = ({ t, at, home, away, hs, as, label, sepia, homeC = BLUE, awayC = '#B23A2E' }) => {
  const s = pop(t, at, 0.3);
  return (
    <StageFrame fill={sepia ? SEPIA_BG : '#1E2A36'}>
      <g transform={`scale(${s})`} fontFamily="Montserrat" fontWeight={900}>
        <rect x={-440} y={-220} width={880} height={440} rx={36} fill={sepia ? '#3F352A' : '#0E141A'} stroke={MUST} strokeWidth={10} />
        <rect x={-400} y={-180} width={340} height={90} rx={16} fill={homeC} />
        <rect x={60} y={-180} width={340} height={90} rx={16} fill={awayC} />
        <text x={-230} y={-118} textAnchor="middle" fontSize={home.length > 9 ? 40 : 52} fill="#fff">{home}</text>
        <text x={230} y={-118} textAnchor="middle" fontSize={away.length > 9 ? 40 : 52} fill="#fff">{away}</text>
        <text x={-230} y={110} textAnchor="middle" fontSize={230} fill={MUST}>{hs}</text>
        <text x={0} y={90} textAnchor="middle" fontSize={120} fill="#fff">×</text>
        <text x={230} y={110} textAnchor="middle" fontSize={230} fill="#fff">{as}</text>
      </g>
      <g transform={`translate(0,370) scale(${pop(t, at + 0.3)})`}>
        <rect x={-Math.min(460, label.length * 0.62 * Math.min(58, 820 / (0.62 * label.length)) / 2 + 50)} y={-55} width={Math.min(920, label.length * 0.62 * Math.min(58, 820 / (0.62 * label.length)) + 100)} height={110} rx={55} fill={MUST} />
        <text x={0} y={20} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={Math.min(58, 820 / (0.62 * label.length))} fill="#1E1B18">{label}</text>
      </g>
      {sepia && <rect x={-500} y={-500} width={1000} height={1000} fill="rgba(120,80,30,.18)" />}
    </StageFrame>
  );
};

/* Batalha dos Aflitos: top view, 7 vs 10, penalty saved, goal */
export const StagePitch7: React.FC<{ t: number; saveT: number; goalT: number }> = ({ t, saveT, goalT }) => {
  const blue = [[-60, 300], [-200, 150], [80, 150], [-120, 0], [120, -40], [0, -170], [0, 400]];
  const red = [[-260, -300], [260, -300], [-150, -330], [150, -330], [0, -260], [-300, -120], [300, -120], [-80, -100], [90, -130], [0, -420]];
  // ball: penalty toward the blue goal (bottom), saved, then counter-attack into the red goal (top)
  const bx = t < saveT ? 0 : t < goalT ? kf(t, [[saveT, 40], [goalT - 0.4, 60]]) : kf(t, [[goalT, 60], [goalT + 0.4, 30]]);
  const by = t < saveT ? kf(t, [[saveT - 1.2, 250], [saveT, 420]]) : t < goalT ? kf(t, [[saveT, 420], [goalT - 0.3, -300]]) : kf(t, [[goalT - 0.3, -300], [goalT, -455]]);
  return (
    <StageFrame fill="#3E8E41">
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-500} y={-500 + i * 125} width={1000} height={62} fill="rgba(255,255,255,.05)" />)}
      <g stroke="#fff" strokeWidth={6} fill="none">
        <rect x={-420} y={-460} width={840} height={920} />
        <line x1={-420} y1={0} x2={420} y2={0} />
        <circle cx={0} cy={0} r={90} />
        <rect x={-200} y={-460} width={400} height={150} />
        <rect x={-200} y={310} width={400} height={150} />
        <rect x={-80} y={-480} width={160} height={20} fill="#fff" />
        <rect x={-80} y={460} width={160} height={20} fill="#fff" />
      </g>
      {red.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={26} fill="#C62828" stroke="#fff" strokeWidth={6} /></g>)}
      {blue.map(([x, y], i) => <g key={i}><circle cx={x} cy={y + (i === 6 ? 0 : Math.sin(t * 3 + i) * 6)} r={28} fill={BLUE} stroke={BLACK} strokeWidth={6} /></g>)}
      <circle cx={bx} cy={by} r={16} fill="#fff" stroke="#111" strokeWidth={4} />
      {t > saveT && t < saveT + 1 && <text x={0} y={330} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={80} fill={MUST} stroke="#111" strokeWidth={10} paintOrder="stroke">DEFENDEU!</text>}
      {t > goalT && <text x={0} y={-300} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={140} fill="#fff" stroke="#111" strokeWidth={14} paintOrder="stroke" transform={`scale(${pop(t, goalT)})`}>GOL!</text>}
      <g fontFamily="Montserrat" fontWeight={900}>
        <rect x={-470} y={-490} width={190} height={70} rx={14} fill={BLUE} /><text x={-375} y={-442} textAnchor="middle" fontSize={40} fill="#fff">7</text>
        <rect x={280} y={-490} width={190} height={70} rx={14} fill="#C62828" /><text x={375} y={-442} textAnchor="middle" fontSize={40} fill="#fff">10</text>
      </g>
    </StageFrame>
  );
};

/* Stadiums */
export const StageStadium: React.FC<{ t: number; kind: 'baixada' | 'olimpico' | 'arena' }> = ({ t, kind }) => (
  <StageFrame fill={kind === 'baixada' ? SEPIA_BG : kind === 'olimpico' ? '#BFD9EA' : '#1C2733'}>
    {kind === 'baixada' && (
      <g>
        <rect x={-500} y={120} width={1000} height={380} fill="#9DB36A" />
        <path d="M-420,120 L-420,-60 L420,-60 L420,120 Z" fill="#8A6A44" />
        {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={-420} y={-60 + i * 36} width={840} height={10} fill="#6B4E2E" />)}
        <path d="M-440,-60 L0,-200 L440,-60 Z" fill="#5A3A24" />
        <text x={0} y={-90} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={48} fill="#F4EEE2">BAIXADA</text>
      </g>
    )}
    {kind === 'olimpico' && (
      <g>
        <ellipse cx={0} cy={140} rx={460} ry={250} fill="#9AA4AA" />
        <ellipse cx={0} cy={160} rx={360} ry={170} fill="#3E8E41" />
        <ellipse cx={0} cy={160} rx={360} ry={170} fill="none" stroke="#fff" strokeWidth={6} />
        {Array.from({ length: 6 }).map((_, i) => <ellipse key={i} cx={0} cy={140} rx={460 - i * 16} ry={250 - i * 13} fill="none" stroke={[BLUE, BLACK, '#fff'][i % 3]} strokeWidth={6} opacity={0.7} />)}
        <text x={0} y={-200} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={64} fill="#1E1B18">OLÍMPICO · 1954</text>
      </g>
    )}
    {kind === 'arena' && (
      <g>
        <path d="M-460,200 C-400,-160 400,-160 460,200 Z" fill="#E8EEF2" />
        <path d="M-420,200 C-360,-110 360,-110 420,200 Z" fill={BLUE} />
        {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={-400 + i * 60} y1={200} x2={-400 + i * 60 + (i - 7) * 10} y2={-40 + Math.abs(i - 7) * 14} stroke="rgba(255,255,255,.35)" strokeWidth={6} />)}
        <rect x={-500} y={200} width={1000} height={300} fill="#2A3440" />
        {[-300, -100, 100, 300].map((x) => <circle key={x} cx={x} cy={-260} r={8} fill="#FFE08A" opacity={0.6 + 0.4 * Math.sin(t * 4 + x)} />)}
        <text x={0} y={330} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={64} fill="#fff">ARENA · 2012</text>
      </g>
    )}
  </StageFrame>
);

/* Hino: music notes + bus strike + "até a pé" footprints */
export const StageHino: React.FC<{ t: number; lt: number; strikeT: number }> = ({ t, lt, strikeT }) => (
  <StageFrame fill="#1E2A36">
    {Array.from({ length: 9 }).map((_, i) => {
      const ph = (t * 0.35 + i * 0.11) % 1;
      return <text key={i} x={-420 + i * 105} y={300 - ph * 700} fontSize={80} fill={[BLUE, '#fff', MUST][i % 3]} opacity={1 - ph}>♪</text>;
    })}
    <text x={0} y={-300} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={60} fill="#fff">LUPICÍNIO RODRIGUES</text>
    <text x={0} y={-220} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={90} fill={MUST}>1953</text>
    {t > strikeT && (
      <g transform={`translate(0,90) scale(${pop(t, strikeT)})`}>
        <rect x={-260} y={-90} width={520} height={180} rx={26} fill="#E9C46A" />
        <rect x={-230} y={-60} width={460} height={70} rx={10} fill="#9FD3EE" />
        <circle cx={-150} cy={100} r={38} fill="#222" /><circle cx={150} cy={100} r={38} fill="#222" />
        <circle cx={0} cy={0} r={160} fill="none" stroke="#E53935" strokeWidth={24} />
        <line x1={-110} y1={-110} x2={110} y2={110} stroke="#E53935" strokeWidth={24} />
      </g>
    )}
    {lt > 0 && t > strikeT + 1.2 && Array.from({ length: 6 }).map((_, i) => {
      const show = clamp((t - strikeT - 1.2) * 3 - i);
      return <ellipse key={i} cx={-300 + i * 120} cy={380 + (i % 2) * 40} rx={26} ry={44} fill="#fff" opacity={show * 0.9} transform={`rotate(${i % 2 ? 15 : -15} ${-300 + i * 120} ${380 + (i % 2) * 40})`} />;
    })}
  </StageFrame>
);

/* Striped flag with golden star */
export const StageStarFlag: React.FC<{ t: number; starT: number }> = ({ t, starT }) => {
  const wave = (x: number) => Math.sin(t * 3 + x / 120) * 18;
  return (
    <StageFrame fill="#BFD9EA">
      <rect x={-380} y={-380} width={20} height={800} fill="#6B6F75" />
      {Array.from({ length: 10 }).map((_, i) => (
        <path key={i} d={`M${-360 + i * 72},${-360 + wave(i * 72)} L${-288 + i * 72},${-360 + wave(i * 72 + 72)} L${-288 + i * 72},${60 + wave(i * 72 + 72)} L${-360 + i * 72},${60 + wave(i * 72)} Z`} fill={[BLUE, BLACK, '#F4F4F4'][i % 3]} />
      ))}
      {t > starT && (
        <g transform={`translate(0,${-150 + wave(360)}) scale(${pop(t, starT, 0.35)}) rotate(${t * 20})`}>
          <path d="M0,-110 L28,-36 L106,-34 L44,14 L66,90 L0,46 L-66,90 L-44,14 L-106,-34 L-28,-36 Z" fill="#F2C230" stroke="#9A7410" strokeWidth={8} />
        </g>
      )}
    </StageFrame>
  );
};

/* Generic trophies row (no official trophy designs) */
export const Trophy: React.FC<{ c?: string }> = ({ c = '#F2C230' }) => (
  <g>
    <path d="M-60,-120 L60,-120 C60,-40 30,0 0,10 C-30,0 -60,-40 -60,-120 Z" fill={c} stroke="#9A7410" strokeWidth={6} />
    <path d="M-60,-100 C-100,-100 -100,-40 -50,-30 M60,-100 C100,-100 100,-40 50,-30" stroke="#9A7410" strokeWidth={8} fill="none" />
    <rect x={-12} y={8} width={24} height={50} fill={c} />
    <rect x={-50} y={56} width={100} height={30} rx={6} fill="#5A3A24" />
  </g>
);
export const StageTrophies: React.FC<{ t: number; items: [number, string, string][] }> = ({ t, items }) => (
  <StageFrame fill="#1E2A36">
    {items.map(([at, year, label], i) => {
      const cols = Math.min(items.length, 3);
      const row = Math.floor(i / cols), col = i % cols;
      const n = Math.min(cols, items.length - row * cols);
      const x = (col - (n - 1) / 2) * 300, y = -160 + row * 380;
      const s = pop(t, at);
      return s > 0 ? (
        <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
          <Trophy c={label.includes('MUNDIAL') ? '#F2C230' : label.includes('LIBERTA') ? '#E6E9EE' : '#F2C230'} />
          <text x={0} y={150} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={56} fill={MUST}>{year}</text>
          <text x={0} y={200} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={30} fill="#fff">{label}</text>
        </g>
      ) : null;
    })}
  </StageFrame>
);

/* Big title card (chapter openers) — auto-sizes and wraps long titles */
const wrap = (txt: string, max = 16) => {
  if (txt.length <= max) return [txt];
  const words = txt.split(' ');
  let best = [txt], bestDiff = 1e9;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' '), b = words.slice(i).join(' ');
    const d = Math.abs(a.length - b.length);
    if (d < bestDiff) { bestDiff = d; best = [a, b]; }
  }
  return best;
};
export const StageTitle: React.FC<{ t: number; at: number; kicker: string; title: string; bg?: string; stripes?: string[] }> = ({ t, at, kicker, title, bg = BLUE, stripes = [BLACK, '#F4F4F4'] }) => {
  const lines = wrap(title);
  const longest = Math.max(...lines.map((l) => l.length));
  const fs = Math.min(110, 860 / (0.66 * longest));
  const kfs = Math.min(56, 860 / (0.62 * kicker.length));
  return (
    <StageFrame fill={bg}>
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-500 + i * 90} y={-500} width={30} height={1000} fill={stripes[i % stripes.length]} opacity={0.18} />)}
      <g transform={`scale(${pop(t, at, 0.3)})`} fontFamily="Montserrat" fontWeight={900} textAnchor="middle">
        <text x={0} y={-40 - (lines.length - 1) * fs * 0.55} fontSize={kfs} fill={MUST}>{kicker}</text>
        {lines.map((l, i) => (
          <text key={i} x={0} y={70 + (i - (lines.length - 1) / 2) * fs * 1.1} fontSize={fs} fill="#fff" stroke="#111" strokeWidth={10} paintOrder="stroke">{l}</text>
        ))}
      </g>
    </StageFrame>
  );
};

/* 1909 · first Gre-Nal: sepia field, wooden scoreboard "? × ?" that reveals the score,
   two flags, and Cusco crossing the pitch, looking at both sides, then celebrating. */
const Flag: React.FC<{ t: number; x: number; c: string; stripes?: boolean }> = ({ t, x, c, stripes }) => (
  <g transform={`translate(${x},120)`}>
    <rect x={-6} y={-260} width={12} height={300} fill="#5A4A38" />
    {Array.from({ length: 6 }).map((_, i) => {
      const w = (k: number) => Math.sin(t * 4 + k / 30) * 10;
      const x0 = i * 26, x1 = (i + 1) * 26;
      const fill = stripes ? [BLUE, BLACK, '#F4F4F4'][i % 3] : i % 2 ? '#F4F4F4' : c;
      return <path key={i} d={`M${x0},${-255 + w(x0)} L${x1},${-255 + w(x1)} L${x1},${-150 + w(x1)} L${x0},${-150 + w(x0)} Z`} fill={stripes ? fill : c} />;
    })}
  </g>
);
export const StageGrenal1909: React.FC<{ t: number; a: number; labelT: number; revealT: number; home?: string; away?: string; hs?: number; as?: number; run: (t: number) => React.ReactNode; sit: (t: number, tilt: number) => React.ReactNode }> = ({ t, a, labelT, revealT, home = 'GRÊMIO', away = 'INTER', hs = 10, as = 0, run, sit }) => {
  const lt = t - a;
  const arriveT = a + 1.5;
  const cx = t < arriveT ? kf(t, [[a, -620], [arriveT, 0]]) : t < revealT + 0.45 ? 0 : kf(t, [[revealT + 0.45, 0], [revealT + 1.4, 700]]);
  const look = t >= arriveT && t < revealT ? (Math.sin((t - arriveT) * 3.2) > 0 ? 22 : -22) : 0;
  const hop = t > revealT && t < revealT + 0.45 ? Math.sin(((t - revealT) / 0.45) * Math.PI) * 120 : 0;
  const reveal = pop(t, revealT, 0.3);
  return (
    <StageFrame fill={SEPIA_BG}>
      <rect x={-500} y={0} width={1000} height={500} fill="#B7A06A" />
      <rect x={-500} y={-130} width={1000} height={130} fill="#C9B184" />
      {Array.from({ length: 18 }).map((_, i) => <circle key={i} cx={-470 + i * 55} cy={-70 + (i % 2) * 22} r={18} fill="#7A6444" />)}
      <line x1={-500} y1={0} x2={500} y2={0} stroke="#F4EEE2" strokeWidth={6} />
      <Flag t={t} x={-400} c={BLUE} stripes />
      <Flag t={t} x={300} c="#C62828" />
      {/* wooden scoreboard */}
      <g transform="translate(0,-300)" fontFamily="Montserrat" fontWeight={900} textAnchor="middle">
        <rect x={-380} y={-130} width={760} height={260} rx={18} fill="#6B4E2E" stroke="#3E2A16" strokeWidth={10} />
        <text x={-210} y={-60} fontSize={44} fill="#F4EEE2">{home}</text>
        <text x={210} y={-60} fontSize={44} fill="#F4EEE2">{away}</text>
        <text x={0} y={70} fontSize={90} fill="#F4EEE2">×</text>
        {t < revealT ? (
          <g fill="#F4EEE2" opacity={0.55 + 0.45 * Math.abs(Math.sin(t * 4))}>
            <text x={-210} y={80} fontSize={130}>?</text>
            <text x={210} y={80} fontSize={130}>?</text>
          </g>
        ) : (
          <g transform={`scale(${reveal})`}>
            <text x={-210} y={80} fontSize={140} fill={MUST}>{hs}</text>
            <text x={210} y={80} fontSize={140} fill="#F4EEE2">{as}</text>
          </g>
        )}
      </g>
      {t > labelT && (
        <g transform={`translate(0,-70) scale(${pop(t, labelT)})`}>
          <rect x={-250} y={-46} width={500} height={92} rx={46} fill={MUST} />
          <text x={0} y={18} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={48} fill="#1E1B18">1º GRE-NAL · 1909</text>
        </g>
      )}
      {/* Cusco */}
      <g transform={`translate(${cx},${330 - hop})`}>
        {t < arriveT || t > revealT + 0.45 ? <g transform="scale(0.62)">{run(t)}</g> : <g transform="translate(0,120) scale(0.62)">{sit(t, look)}</g>}
      </g>
      {lt > 0 && <rect x={-500} y={-500} width={1000} height={1000} fill="rgba(120,80,30,.15)" />}
    </StageFrame>
  );
};
