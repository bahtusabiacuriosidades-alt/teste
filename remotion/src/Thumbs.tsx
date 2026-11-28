import React from 'react';
import { AbsoluteFill } from 'remotion';
import './fonts';
import { Lauro, LauroDefs, Expr } from './chars/Lauro';
import { Pia, PiaDefs } from './chars/Pia';
import { CuscoSit, CuscoDefs } from './chars/Others';
import { OldBall, BLUE } from './scenes/Gremio';
import { RED } from './scenes/Inter';
import { Guria, GuriaDefs } from './chars/Guria';
import { RSFlag, VERDE, VERMELHO, AMARELO } from './scenes/Farroupilha';

/* Thumbnails do YouTube (1280×720, renderizar com --scale=1.5 → 1920×1080).
 * Estilo chamativo: texto gigante com contorno e degradê, personagem em close com cara de choque,
 * emojis, fundo colorido com brilho e borda neon. Só cores e nome dos clubes (sem escudo). */
const W = 1280, H = 720;
const EMOJI = '"Noto Color Emoji", sans-serif';

type Theme = { bg1: string; bg2: string; stripes: string[]; neon: string; g1: [string, string]; g2: [string, string] };

const Bg: React.FC<{ th: Theme }> = ({ th }) => (
  <g>
    <defs>
      <radialGradient id="tbBg" cx="62%" cy="45%" r="80%">
        <stop offset="0" stopColor={th.bg1} />
        <stop offset="1" stopColor={th.bg2} />
      </radialGradient>
      <filter id="tbBlur"><feGaussianBlur stdDeviation="14" /></filter>
      <filter id="tbGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      <filter id="tbShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity="0.55" /></filter>
    </defs>
    <rect width={W} height={H} fill="url(#tbBg)" />
    {/* listras desfocadas (as cores do clube) */}
    <g filter="url(#tbBlur)" opacity={0.55}>
      {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={-200 + i * 110} y={-200} width={46} height={1200} fill={th.stripes[i % th.stripes.length]} transform={`rotate(16 ${W / 2} ${H / 2})`} />)}
    </g>
    {/* luzes de estádio */}
    {[[180, 90], [520, 60], [880, 80], [1180, 110]].map(([x, y], i) => (
      <g key={i} filter="url(#tbBlur)"><circle cx={x} cy={y} r={70} fill="#fff" opacity={0.35} /></g>
    ))}
    {/* faíscas */}
    {Array.from({ length: 26 }).map((_, i) => {
      const x = (i * 197) % W, y = (i * 131) % H, r = 2 + (i % 4);
      return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.5} />;
    })}
  </g>
);

const BigWord: React.FC<{ text: string; x: number; y: number; size: number; grad: [string, string]; id: string; rot?: number; stroke?: number }> = ({ text, x, y, size, grad, id, rot = -5, stroke = 22 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`} filter="url(#tbShadow)">
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.1" stopColor={grad[0]} />
        <stop offset="0.9" stopColor={grad[1]} />
      </linearGradient>
    </defs>
    <text x={0} y={0} fontFamily="Montserrat" fontWeight={900} fontSize={size} fill="#0B0B12" stroke="#0B0B12" strokeWidth={stroke + 10} strokeLinejoin="round" paintOrder="stroke" letterSpacing={-2}>{text}</text>
    <text x={0} y={0} fontFamily="Montserrat" fontWeight={900} fontSize={size} fill={`url(#${id})`} stroke="#fff" strokeWidth={stroke * 0.45} strokeLinejoin="round" paintOrder="stroke" letterSpacing={-2}>{text}</text>
    <text x={0} y={-size * 0.04} fontFamily="Montserrat" fontWeight={900} fontSize={size} fill="rgba(255,255,255,.18)" letterSpacing={-2} clipPath="none">{text}</text>
  </g>
);

const Emo: React.FC<{ e: string; x: number; y: number; s: number; r?: number }> = ({ e, x, y, s, r = 0 }) => (
  <text x={x} y={y} fontFamily={EMOJI} fontSize={s} textAnchor="middle" transform={`rotate(${r} ${x} ${y})`} filter="url(#tbShadow)">{e}</text>
);

const Neon: React.FC<{ c: string }> = ({ c }) => (
  <g>
    <rect x={10} y={10} width={W - 20} height={H - 20} rx={26} fill="none" stroke={c} strokeWidth={10} filter="url(#tbGlow)" />
    <rect x={10} y={10} width={W - 20} height={H - 20} rx={26} fill="none" stroke="#fff" strokeWidth={3} opacity={0.8} />
  </g>
);

/* Lauro em close (cabeça + tronco), olhando assustado */
const LauroClose: React.FC<{ x: number; expr: Expr; scarf?: 'gremio' | 'inter'; arm?: React.ComponentProps<typeof Lauro>['arm'] }> = ({ x, expr, scarf, arm = 'down' }) => (
  <g transform={`translate(${x},${H + 1000}) scale(0.98)`} filter="url(#tbShadow)">
    <Lauro t={1.0} talk={0.95} expr={expr} arm={arm} scarf={scarf ?? false} browBoost={-6} shadow={false} />
  </g>
);

const GREMIO: Theme = { bg1: '#2BB3FF', bg2: '#06243F', stripes: [BLUE, '#111', '#F4F4F4'], neon: '#3EC5FF', g1: ['#7FE3FF', '#0D80BF'], g2: ['#FFE45C', '#FF8A00'] };
const INTER: Theme = { bg1: '#FF5A4A', bg2: '#3A0606', stripes: [RED, '#F4F4F4'], neon: '#FF4A3D', g1: ['#FFFFFF', '#FF6B5E'], g2: ['#FFE45C', '#FF8A00'] };

export const ThumbGremio: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <LauroDefs />
      <CuscoDefs />
      <Bg th={GREMIO} />
      {/* bola estourando atrás do texto */}
      <g transform="translate(700,470) scale(0.95) rotate(-10)"><OldBall t={0} deflate={0.35} burst={0.25} /></g>
      <LauroClose x={1040} expr="shock" scarf="gremio" />
      <BigWord text="A BOLA" x={40} y={210} size={150} grad={GREMIO.g1} id="g1" />
      <BigWord text="FUROU!" x={60} y={380} size={190} grad={GREMIO.g2} id="g2" rot={-5} />
      {/* faixa de baixo */}
      <g transform="translate(70,470) rotate(-3)" filter="url(#tbShadow)">
        <rect x={0} y={0} width={560} height={92} rx={18} fill="#0B0B12" />
        <rect x={6} y={6} width={548} height={80} rx={14} fill={BLUE} />
        <text x={280} y={62} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={46} fill="#fff">E NASCEU O GRÊMIO</text>
      </g>
      <Emo e="😱" x={790} y={130} s={110} r={10} />
      <Emo e="⚽" x={600} y={640} s={90} r={-12} />
      <Emo e="🏆" x={120} y={660} s={90} r={-8} />
      <Emo e="🤯" x={1190} y={110} s={80} r={14} />
      <Neon c={GREMIO.neon} />
    </svg>
  </AbsoluteFill>
);

export const ThumbInter: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <LauroDefs />
      <PiaDefs />
      <CuscoDefs />
      <Bg th={INTER} />
      {/* taça brilhando atrás */}
      <LauroClose x={1070} expr="delight" scarf="inter" />
      {/* Piá chocado, menor, na frente à esquerda do Lauro */}
      <g transform={`translate(800,${H + 420}) scale(-0.74,0.74)`} filter="url(#tbShadow)">
        <Pia t={1.0} talk={0.9} expr="shock" arms="down" shadow={false} gaze={1} />
      </g>
      <BigWord text="DE 10×0" x={40} y={200} size={140} grad={INTER.g1} id="i1" />
      <BigWord text="A CAMPEÃO" x={40} y={350} size={128} grad={INTER.g2} id="i2" />
      <BigWord text="DO MUNDO!" x={60} y={490} size={128} grad={INTER.g2} id="i3" rot={-4} />
      <g transform="translate(70,540) rotate(-3)" filter="url(#tbShadow)">
        <rect x={0} y={0} width={520} height={92} rx={18} fill="#0B0B12" />
        <rect x={6} y={6} width={508} height={80} rx={14} fill={RED} />
        <text x={260} y={62} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={46} fill="#fff">A HISTÓRIA DO INTER</text>
      </g>
      <Emo e="😱" x={690} y={110} s={100} r={-10} />
      <Emo e="🔥" x={1200} y={100} s={80} r={12} />
      <Emo e="🏆" x={660} y={680} s={96} r={10} />
      <Neon c={INTER.neon} />
    </svg>
  </AbsoluteFill>
);

const FARRO: Theme = { bg1: '#3FBF6A', bg2: '#062A12', stripes: [VERDE, VERMELHO, AMARELO], neon: '#F2C230', g1: ['#FFFFFF', '#A8F0B8'], g2: ['#FFE45C', '#FF8A00'] };

export const ThumbFarroupilha: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <LauroDefs />
      <GuriaDefs />
      <Bg th={FARRO} />
      {/* bandeira rio-grandense tremulando atrás */}
      <g transform="translate(560,250) rotate(-8) scale(1.05)" filter="url(#tbShadow)"><RSFlag t={1.3} w={300} h={200} /></g>
      <LauroClose x={1070} expr="shock" />
      <g transform={`translate(800,${H + 430}) scale(-0.78,0.78)`} filter="url(#tbShadow)">
        <Guria t={1.0} talk={0.9} expr="shock" arms="down" shadow={false} gaze={1} />
      </g>
      <BigWord text="O RS JÁ" x={40} y={190} size={150} grad={FARRO.g1} id="f1" />
      <BigWord text="FOI UM" x={50} y={350} size={150} grad={FARRO.g2} id="f2" />
      <BigWord text="PAÍS?!" x={60} y={520} size={170} grad={FARRO.g2} id="f3" rot={-4} />
      <g transform="translate(70,575) rotate(-3)" filter="url(#tbShadow)">
        <rect x={0} y={0} width={600} height={86} rx={18} fill="#0B0B12" />
        <rect x={6} y={6} width={588} height={74} rx={14} fill={VERDE} />
        <text x={300} y={56} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={36} fill="#fff">REVOLUÇÃO FARROUPILHA</text>
      </g>
      <Emo e="😱" x={1190} y={560} s={100} r={-10} />
      <Emo e="🐎" x={1200} y={100} s={80} r={12} />
      <Emo e="⛵" x={650} y={680} s={86} r={10} />
      <Neon c={FARRO.neon} />
    </svg>
  </AbsoluteFill>
);

/* ---------- Capa de Reels (1080×1920) do #005 Inter ----------
 * Inspirada no clima de "papel de parede": noite, vermelho com brilho, faíscas, estádio iluminado embaixo.
 * Sem escudo e sem logo: só o nome e as cores. Texto importante entre y≈300 e y≈1600 (corte 4:5/3:4 do perfil). */
const RW = 1080, RH = 1920;
const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
export const ReelInter: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <svg width={RW} height={RH} viewBox={`0 0 ${RW} ${RH}`}>
      <LauroDefs />
      <PiaDefs />
      <defs>
        <radialGradient id="riBg" cx="50%" cy="38%" r="75%">
          <stop offset="0" stopColor="#7A0A0A" />
          <stop offset="0.45" stopColor="#2E0303" />
          <stop offset="1" stopColor="#060000" />
        </radialGradient>
        <radialGradient id="riGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FF3B30" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FF3B30" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="riTitle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFC9C4" />
        </linearGradient>
        <filter id="riBlur"><feGaussianBlur stdDeviation="18" /></filter>
        <filter id="riSoft"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id="riGlowF" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="riSh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#000" floodOpacity="0.7" /></filter>
      </defs>
      <rect width={RW} height={RH} fill="url(#riBg)" />
      {/* faixas de luz diagonais */}
      <g filter="url(#riBlur)" opacity={0.55}>
        {[[-200, 200, 18], [700, 120, -22], [-100, 1100, 12], [800, 1000, -14]].map(([x, y, r], i) => (
          <rect key={i} x={x} y={y} width={700} height={50} fill="#FF2A1A" transform={`rotate(${r} ${x + 350} ${y + 25})`} />
        ))}
      </g>
      {/* luzes da cidade (bokeh) */}
      {Array.from({ length: 160 }).map((_, i) => {
        const x = rnd(i) * RW, y = 1050 + rnd(i + 99) * 380;
        return <circle key={i} cx={x} cy={y} r={1.5 + rnd(i + 7) * 3} fill={rnd(i + 3) > 0.7 ? '#FFD9A0' : '#FF6A50'} opacity={0.35 + rnd(i + 5) * 0.5} />;
      })}
      {/* brilho central */}
      <circle cx={540} cy={560} r={520} fill="url(#riGlow)" opacity={0.55} />
      {/* estádio iluminado embaixo (genérico, oval com pilares) */}
      <g transform="translate(540,1610)">
        <ellipse cx={0} cy={40} rx={560} ry={200} fill="#140000" />
        {Array.from({ length: 46 }).map((_, i) => {
          const a = (i / 46) * Math.PI * 2;
          const x = Math.cos(a) * 500, y = Math.sin(a) * 170;
          if (y < -40) return null;
          return <rect key={i} x={x - 9} y={y - 20} width={18} height={150 + y * 0.25} fill={i % 2 ? '#B3121A' : '#8A0C12'} />;
        })}
        <ellipse cx={0} cy={-10} rx={430} ry={120} fill="#2A0606" />
        <ellipse cx={0} cy={-10} rx={330} ry={82} fill="#3F7A2E" />
        <ellipse cx={0} cy={-10} rx={430} ry={120} fill="none" stroke="#FFF4E6" strokeWidth={14} filter="url(#riGlowF)" />
        <ellipse cx={0} cy={-10} rx={455} ry={130} fill="none" stroke="#FF5A40" strokeWidth={6} filter="url(#riSoft)" opacity={0.8} />
        {Array.from({ length: 18 }).map((_, i) => {
          const a = (i / 18) * Math.PI * 2;
          return <circle key={i} cx={Math.cos(a) * 430} cy={-10 + Math.sin(a) * 120} r={10} fill="#FFF8E8" filter="url(#riSoft)" />;
        })}
      </g>
      {/* faíscas */}
      {Array.from({ length: 70 }).map((_, i) => {
        const x = rnd(i + 300) * RW, y = rnd(i + 400) * 1500;
        return <rect key={i} x={x} y={y} width={4 + rnd(i) * 8} height={2 + rnd(i + 1) * 4} fill={rnd(i + 2) > 0.5 ? '#FF8A6A' : '#FFE0C8'} opacity={0.4 + rnd(i + 3) * 0.6} transform={`rotate(${rnd(i + 4) * 360} ${x} ${y})`} />;
      })}
      {/* Lauro e Piá */}
      <g transform="translate(370,1640) scale(0.4)" filter="url(#riSh)">
        <Lauro t={1.0} talk={0.7} expr="delight" arm="pointUp" scarf="inter" shadow={false} cuiaRaise={1} />
      </g>
      <g transform="translate(760,1650) scale(-0.44,0.44)" filter="url(#riSh)">
        <Pia t={1.2} talk={0.8} expr="shock" arms="down" shadow={false} gaze={1} />
      </g>
      {/* título */}
      <g transform="translate(540,0)" textAnchor="middle" fontFamily="Montserrat" fontWeight={900}>
        <text x={0} y={390} fontSize={84} fill="#FFFFFF" letterSpacing={6} filter="url(#riGlowF)" opacity={0.95}>A HISTÓRIA DO</text>
        <g filter="url(#riSh)">
          <text x={0} y={660} fontSize={300} fill="#1A0000" stroke="#1A0000" strokeWidth={36} strokeLinejoin="round" paintOrder="stroke" letterSpacing={-8}>INTER</text>
        </g>
        <text x={0} y={660} fontSize={300} fill="#FF2A1A" opacity={0.85} filter="url(#riBlur)" letterSpacing={-8}>INTER</text>
        <text x={0} y={660} fontSize={300} fill="url(#riTitle)" stroke="#FF3B30" strokeWidth={8} paintOrder="stroke" letterSpacing={-8}>INTER</text>
        <g transform="translate(0,770)">
          <rect x={-400} y={-52} width={800} height={96} rx={48} fill="#D9A021" stroke="#1A0000" strokeWidth={6} />
          <text x={0} y={14} fontSize={42} fill="#1E1B18">DE 1909 AO TOPO DO MUNDO</text>
        </g>
      </g>
      <text x={130} y={1000} fontFamily='"Noto Color Emoji"' fontSize={90} transform="rotate(-12 130 1000)">🔥</text>
      <text x={915} y={1010} fontFamily='"Noto Color Emoji"' fontSize={100} transform="rotate(10 915 1010)">😱</text>
    </svg>
  </AbsoluteFill>
);

/* #007 Caxias do Sul: roxo-uva com verde de parreiral */
const CAXIAS: Theme = { bg1: '#9A4DC0', bg2: '#1E0A2A', stripes: ['#5B2A6E', '#5C8A34', '#D9A021'], neon: '#B57BFF', g1: ['#FFFFFF', '#E3C8FF'], g2: ['#FFE45C', '#FF8A00'] };

export const ThumbCaxias: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <LauroDefs />
      <PiaDefs />
      <Bg th={CAXIAS} />
      {/* placa de estrada de madeira */}
      <LauroClose x={1070} expr="shock" />
      <g transform={`translate(1110,${H + 470}) scale(-0.74,0.74)`} filter="url(#tbShadow)">
        <Pia t={1.0} talk={0.9} expr="laugh" arms="down" shadow={false} gaze={1} />
      </g>
      <BigWord text="CAXIAS" x={40} y={190} size={160} grad={CAXIAS.g1} id="c1" />
      <BigWord text="JÁ TEVE" x={50} y={350} size={140} grad={CAXIAS.g2} id="c2" />
      <BigWord text="OUTRO NOME?!" x={50} y={500} size={96} grad={CAXIAS.g2} id="c3" rot={-4} />
      <g transform="translate(70,560) rotate(-3)" filter="url(#tbShadow)">
        <rect x={0} y={0} width={560} height={120} rx={12} fill="#9A6A3A" stroke="#5A3A20" strokeWidth={8} />
        <rect x={10} y={40} width={540} height={4} fill="#7A4E26" opacity={0.6} />
        <rect x={10} y={80} width={540} height={4} fill="#7A4E26" opacity={0.6} />
        <text x={280} y={78} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={44} fill="#2A1A0A">CAMPO DOS BUGRES</text>
      </g>
      <Emo e="😱" x={1000} y={600} s={90} r={-10} />
      <Emo e="🍇" x={1200} y={100} s={86} r={12} />
      <Emo e="❄️" x={690} y={600} s={70} r={10} />
      <Neon c={CAXIAS.neon} />
    </svg>
  </AbsoluteFill>
);
