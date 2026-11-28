import React from 'react';
import { MUST, clamp, easeOut, easeInOut, lerp, pop } from '../lib';
import { StageFrame } from './Gremio';
import { RS } from './Mate';

/* #009 · "O RS tem um deserto?" — areais do Pampa (arenização). Ilustrações 2D (quadros em caixa 1000x1000 centrada em 0,0). */
const F = 'Montserrat';
const INK = '#1E1B18';
const AREIA = '#E9CF9A';
const AREIA_E = '#C9A86A';
const CAMPO = '#6E8F3E';

/* ---------- Cenário: coxilha com manchas de areia e dunas, fim de tarde (fundo do 3D) ---------- */
export const DesertoWorld: React.FC<{ t: number; w?: number; h?: number }> = ({ t, w = 1080, h = 1920 }) => {
  const ridge = (y: number, amp: number, ph: number, f: number) => {
    let d = `M-700,${h + 700} L-700,${y}`;
    for (let x = -700; x <= w + 700; x += 40) d += ` L${x},${y - amp * (0.55 + 0.45 * Math.sin(x / f + ph)) - amp * 0.3 * Math.sin(x / (f * 0.41) + ph * 1.7)}`;
    return d + ` L${w + 700},${h + 700} Z`;
  };
  const duna = (cx: number, cy: number, rw: number, rh: number, k = 1) => (
    <g>
      <path d={`M${cx - rw},${cy} Q${cx - rw * 0.3},${cy - rh * 1.2} ${cx + rw * 0.1},${cy - rh} Q${cx + rw * 0.5},${cy - rh * 0.8} ${cx + rw},${cy} Z`} fill={AREIA} />
      <path d={`M${cx + rw * 0.1},${cy - rh} Q${cx + rw * 0.5},${cy - rh * 0.8} ${cx + rw},${cy} L${cx + rw * 0.15},${cy} Z`} fill={AREIA_E} opacity={0.55} />
      {Array.from({ length: 4 }).map((_, i) => (
        <path key={i} d={`M${cx - rw * (0.7 - i * 0.12)},${cy - rh * (0.15 + i * 0.18)} q${rw * 0.2},${-rh * 0.08} ${rw * 0.45 * k},0`} stroke="rgba(150,115,60,.35)" strokeWidth={3} fill="none" />
      ))}
    </g>
  );
  const Arvore: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-12,0 L-7,-130 L7,-130 L12,0 Z" fill="#4A3424" />
      {[[-60, -180, 70], [0, -215, 82], [60, -185, 70]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#4F6B33" />)}
    </g>
  );
  return (
    <g>
      <defs>
        <linearGradient id="dsSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FA6C9" />
          <stop offset="0.55" stopColor="#EBC890" />
          <stop offset="1" stopColor="#F7D9A0" />
        </linearGradient>
        <radialGradient id="dsSun"><stop offset="0" stopColor="#FFF6DA" /><stop offset="0.3" stopColor="#FFE6AA" stopOpacity="0.9" /><stop offset="1" stopColor="#FFD38A" stopOpacity="0" /></radialGradient>
        <linearGradient id="dsChao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E6C88E" /><stop offset="1" stopColor="#D2AE6C" /></linearGradient>
      </defs>
      <rect x={-700} y={-700} width={w + 1400} height={h + 1400} fill="url(#dsSky)" />
      <circle cx={w * 0.78} cy={h * 0.48} r={430} fill="url(#dsSun)" />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={((i * 640 + t * 12) % (w + 1200)) - 600} cy={h * (0.12 + 0.08 * i)} rx={250} ry={26} fill="#FFF4E0" opacity={0.4} />)}
      <path d={ridge(h * 0.6, h * 0.05, 0.6, 300)} fill="#A9AE84" opacity={0.85} />
      <path d={ridge(h * 0.64, h * 0.05, 2.3, 240)} fill="#8E9E62" />
      {/* areais ao longe, no meio do campo */}
      {duna(w * 0.2, h * 0.655, 160, 26, 0.6)}
      {duna(w * 0.72, h * 0.66, 220, 34, 0.7)}
      <Arvore x={w * 0.52} y={h * 0.655} s={0.22} />
      <path d={ridge(h * 0.71, h * 0.04, 4.1, 360)} fill={CAMPO} />
      {duna(w * 0.05, h * 0.74, 300, 70)}
      {duna(w * 0.95, h * 0.745, 340, 90)}
      {/* cerca de arame */}
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-400 + i * 120} y={h * 0.77 - 70} width={9} height={74} rx={3} fill="#5B4632" />)}
      {[0, 1].map((k) => <path key={k} d={`M-400,${h * 0.77 - 52 + k * 26} L${w + 400},${h * 0.77 - 52 + k * 26}`} stroke="#6E6658" strokeWidth={2} opacity={0.8} />)}
      {/* gado bem pequeno ao longe (perspectiva) */}
      {[[0.38, 0.69], [0.44, 0.695], [0.6, 0.692]].map(([x, y], i) => (
        <g key={i} transform={`translate(${w * x},${h * y}) scale(0.5)`}>
          <ellipse cx={0} cy={-14} rx={20} ry={10} fill={i === 1 ? '#3A2A20' : '#7A4A2A'} />
          <rect x={-16} y={-8} width={4} height={12} fill="#2A1A10" /><rect x={12} y={-8} width={4} height={12} fill="#2A1A10" />
          <circle cx={20} cy={-20} r={7} fill={i === 1 ? '#3A2A20' : '#7A4A2A'} />
        </g>
      ))}
      {/* chão do primeiro plano: areia com marcas de vento e tufos de capim */}
      <path d={`M-700,${h * 0.8} Q${w * 0.3},${h * 0.77} ${w * 0.6},${h * 0.79} T${w + 700},${h * 0.8} L${w + 700},${h + 700} L-700,${h + 700} Z`} fill="url(#dsChao)" />
      {Array.from({ length: 22 }).map((_, i) => {
        const y = h * 0.83 + (i % 11) * 32, x0 = ((i * 157) % (w + 200)) - 100;
        return <path key={i} d={`M${x0},${y} q60,-10 120,0 t120,0`} stroke="rgba(150,115,60,.28)" strokeWidth={4} fill="none" />;
      })}
      {Array.from({ length: 16 }).map((_, i) => {
        const x = ((i * 233) % (w + 200)) - 100, y = h * 0.82 + ((i * 89) % 260);
        const sw = Math.sin(t * 2.2 + i) * 4;
        return <path key={i} d={`M${x},${y} q${-6 + sw},-24 ${-10 + sw},-34 M${x},${y} q${4 + sw},-28 ${10 + sw},-36 M${x},${y} q${sw},-30 ${2 + sw},-40`} stroke="#8FA24A" strokeWidth={4} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
};

/* ---------- Areia voando (camada por cima de tudo) ---------- */
export const AreiaVento: React.FC<{ t: number; forca: number; w?: number; h?: number }> = ({ t, forca, w = 1080, h = 1920 }) => {
  if (forca <= 0.01) return null;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', pointerEvents: 'none' }}>
      {Array.from({ length: 70 }).map((_, i) => {
        const sp = 260 + (i % 7) * 70;
        const x = ((i * 173.3 + t * sp) % (w + 300)) - 150;
        const y = h * 0.62 + ((i * 97.1) % (h * 0.36)) + Math.sin(t * 3 + i) * 12;
        const l = 10 + (i % 5) * 9;
        return <line key={i} x1={x} y1={y} x2={x - l} y2={y + 2} stroke="#F3DDAE" strokeWidth={2 + (i % 3)} strokeLinecap="round" opacity={0.55 * forca} />;
      })}
    </svg>
  );
};

/* ---------- Quadro: mapa do RS com Alegrete ---------- */
export const StageMapaAlegrete: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = easeOut(clamp((t - a - 0.2) / 0.8));
  return (
    <StageFrame fill="#BFE0F2">
      <g transform="translate(-340,-390) scale(1.06)">
        <path d={RS} fill="#B9D38A" stroke="#7FA357" strokeWidth={10} strokeLinejoin="round" />
        {/* manchas de areia no sudoeste */}
        {[[120, 400, 18], [150, 430, 13], [95, 455, 11], [175, 395, 10]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r * k} fill={AREIA} stroke={AREIA_E} strokeWidth={3} />
        ))}
        <g transform={`translate(130,420) scale(${pop(t, a + 0.6, 0.3)})`}>
          <path d="M0,0 C-30,-40 -30,-70 0,-80 C30,-70 30,-40 0,0 Z" fill="#C62828" stroke="#fff" strokeWidth={6} transform="translate(0,-10)" />
          <circle cx={0} cy={-60} r={12} fill="#fff" />
        </g>
        <text x={330} y={330} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={70} fill="rgba(40,70,30,.4)">RS</text>
      </g>
      <g transform={`translate(-110,250) scale(${pop(t, a + 0.9, 0.3)})`}>
        <rect x={-210} y={-60} width={420} height={110} rx={26} fill="rgba(20,16,12,.9)" stroke={MUST} strokeWidth={6} />
        <text x={0} y={18} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill="#fff">ALEGRETE</text>
      </g>
      <text x={-460} y={-410} fontFamily={F} fontWeight={900} fontSize={48} fill={INK} opacity={k}>SUDOESTE</text>
      <text x={-460} y={-365} fontFamily={F} fontWeight={700} fontSize={32} fill={INK} opacity={k}>do Rio Grande do Sul</text>
      <text x={460} y={470} textAnchor="end" fontFamily={F} fontWeight={700} fontSize={22} fill="rgba(20,16,12,.7)">mapa ilustrativo</text>
    </StageFrame>
  );
};

/* ---------- MÉTRICA 1: pluviômetro (chuva por ano) ---------- */
export const MetricChuva: React.FC<{ t: number; a: number; val?: number }> = ({ t, a, val = 1400 }) => {
  const k = easeInOut(clamp((t - a - 0.3) / 2.2));
  return (
    <StageFrame fill="#CFE4F2">
      {Array.from({ length: 40 }).map((_, i) => {
        const x = -480 + ((i * 97) % 960), y = (((i * 131 + (t - a) * 900) % 1000) - 500);
        return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 34} stroke="#5A8FC4" strokeWidth={5} strokeLinecap="round" opacity={0.6} />;
      })}
      <g transform="translate(-170,40)">
        <path d="M-120,-360 L120,-360 L80,-300 L-80,-300 Z" fill="#9FB6C8" stroke={INK} strokeWidth={6} />
        <rect x={-90} y={-300} width={180} height={680} rx={20} fill="rgba(255,255,255,.75)" stroke={INK} strokeWidth={8} />
        <rect x={-76} y={lerp(368, -286, k)} width={152} height={lerp(0, 654, k)} rx={14} fill="#3F86C9" />
        {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={40} y={360 - i * 82} width={i % 2 ? 26 : 44} height={6} fill={INK} />)}
      </g>
      <g transform="translate(220,-120)">
        <rect x={-230} y={-120} width={460} height={240} rx={30} fill="rgba(20,16,12,.9)" stroke={MUST} strokeWidth={6} />
        <text x={0} y={20} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={104} fill="#fff">≈ {Math.round(k * val).toLocaleString('pt-BR')}</text>
        <text x={0} y={80} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={34} fill={MUST}>MM DE CHUVA POR ANO</text>
      </g>
      <g transform={`translate(220,210) scale(${pop(t, a + 2.5, 0.3)}) rotate(-5)`}>
        <rect x={-210} y={-50} width={420} height={100} rx={22} fill="#C62828" stroke="#fff" strokeWidth={6} />
        <text x={0} y={16} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={44} fill="#fff">DESERTO? NÃO!</text>
      </g>
      <text x={-470} y={470} fontFamily={F} fontWeight={700} fontSize={22} fill="rgba(20,16,12,.75)">média aproximada em Alegrete · série 1928–2009</text>
    </StageFrame>
  );
};

/* ---------- Quadro: arenização em 3 passos (chuva → valeta → vento) ---------- */
export const StageArenizacao: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const lt = t - a;
  const step = lt < 1.9 ? 0 : lt < 3.8 ? 1 : 2;
  const k = (s: number) => easeOut(clamp((lt - s * 1.9) / 0.6));
  return (
    <StageFrame fill="#F2E3C2">
      {/* corte do solo: grama em cima, areia antiga embaixo */}
      <rect x={-500} y={-60} width={1000} height={560} fill={AREIA} />
      {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M-500,${20 + i * 70} Q0,${0 + i * 70} 500,${30 + i * 70}`} stroke={AREIA_E} strokeWidth={4} fill="none" opacity={0.5} />)}
      <path d={`M-500,-60 L500,-60 L500,-20 L-500,-20 Z`} fill={CAMPO} />
      <text x={-470} y={140} fontFamily={F} fontWeight={900} fontSize={30} fill="rgba(90,60,20,.65)">AREIA ANTIGA</text>
      {/* 1 · chuva forte */}
      {step >= 0 && Array.from({ length: 36 }).map((_, i) => {
        const x = -480 + ((i * 89) % 960), y = -480 + (((i * 137 + lt * 1100) % 420));
        return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 30} stroke="#4C82BE" strokeWidth={5} opacity={step === 0 ? 0.8 : 0.25} />;
      })}
      {/* 2 · valeta (ravina) abrindo e levando areia */}
      <path d={`M-60,-60 Q-30,${lerp(-60, 160, k(1))} 0,${lerp(-60, 200, k(1))} Q30,${lerp(-60, 160, k(1))} 60,-60 Z`} fill="#B48A4E" />
      {step >= 1 && Array.from({ length: 14 }).map((_, i) => {
        const u = ((lt * 0.6 + i / 14) % 1);
        return <circle key={i} cx={lerp(0, 380, u)} cy={-70 - Math.sin(u * Math.PI) * 40} r={7} fill={AREIA_E} opacity={k(1)} />;
      })}
      {/* 3 · vento espalhando */}
      {step >= 2 && Array.from({ length: 24 }).map((_, i) => {
        const x = ((i * 113 + lt * 700) % 1100) - 550, y = -250 + (i % 8) * 28;
        return <path key={i} d={`M${x},${y} q40,-14 80,0`} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85 * k(2)} />;
      })}
      {step >= 2 && <path d={`M100,-60 Q260,${-60 - 80 * k(2)} 480,-60 Z`} fill={AREIA} />}
      {/* rótulos dos passos */}
      <g transform="translate(0,-420)">
        {['🌧️ CHUVA FORTE', '🕳️ ABRE VALETAS', '💨 O VENTO ESPALHA'].map((s, i) => (
          <g key={i} transform={`translate(${-310 + i * 310},0)`} opacity={step >= i ? 1 : 0.3}>
            <rect x={-145} y={-40} width={290} height={80} rx={20} fill={step === i ? MUST : 'rgba(20,16,12,.85)'} stroke="#fff" strokeWidth={4} />
            <text x={0} y={13} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={27} fill={step === i ? INK : '#fff'}>{s}</text>
          </g>
        ))}
      </g>
    </StageFrame>
  );
};

/* ---------- MÉTRICA 2: hectares → campos de futebol (virada) ---------- */
export const MetricCampos: React.FC<{ t: number; a: number; flipT: number }> = ({ t, a, flipT }) => {
  const k = easeInOut(clamp((t - a - 0.2) / 1.8));
  const flip = easeInOut(clamp((t - flipT) / 0.5));
  const nCampos = Math.round(easeInOut(clamp((t - flipT - 0.3) / 1.4)) * 5000);
  return (
    <StageFrame fill="#CFE0A8">
      {/* grade de campinhos aparecendo */}
      {Array.from({ length: 48 }).map((_, i) => {
        const cx = -420 + (i % 8) * 120, cy = -40 + Math.floor(i / 8) * 80;
        const on = flip > i / 48;
        return (
          <g key={i} transform={`translate(${cx},${cy})`} opacity={on ? 1 : 0.15}>
            <rect x={-50} y={-30} width={100} height={60} rx={6} fill="#3E8A3E" stroke="#fff" strokeWidth={3} />
            <line x1={0} y1={-30} x2={0} y2={30} stroke="#fff" strokeWidth={2} /><circle cx={0} cy={0} r={10} fill="none" stroke="#fff" strokeWidth={2} />
          </g>
        );
      })}
      <g transform="translate(0,-300)" style={{ transformBox: 'fill-box' }}>
        <g transform={`scale(1,${Math.abs(1 - 2 * flip)})`}>
          <rect x={-330} y={-110} width={660} height={220} rx={30} fill="rgba(20,16,12,.92)" stroke={MUST} strokeWidth={6} />
          {flip < 0.5 ? (
            <>
              <text x={0} y={20} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={100} fill="#fff">≈ {Math.round(k * 3670).toLocaleString('pt-BR')}</text>
              <text x={0} y={80} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={34} fill={MUST}>HECTARES DE AREAL</text>
            </>
          ) : (
            <>
              <text x={0} y={20} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={100} fill={MUST}>{nCampos >= 5000 ? '+ de 5 mil' : nCampos.toLocaleString('pt-BR')} ⚽</text>
              <text x={0} y={80} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={34} fill="#fff">CAMPOS DE FUTEBOL</text>
            </>
          )}
        </g>
      </g>
      <text x={-470} y={455} fontFamily={F} fontWeight={700} fontSize={21} fill="rgba(20,16,12,.75)">Atlas da Arenização (UFRGS, 2001): ≈ 3.670 ha em 10 municípios</text>
      <text x={-470} y={480} fontFamily={F} fontWeight={700} fontSize={21} fill="rgba(20,16,12,.75)">campo oficial 105 m × 68 m ≈ 0,71 ha</text>
    </StageFrame>
  );
};

/* ---------- MÉTRICA 3: linha do tempo ---------- */
export const MetricLinhaTempo: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = easeInOut(clamp((t - a - 0.2) / 2.0));
  const marcos: [number, string, string][] = [[0, 'SÉC. XIX', 'primeiros relatos dos areais'], [0.5, '1987', 'nasce o nome "arenização"'], [1, 'HOJE', 'pesquisa e cuidado com o campo']];
  return (
    <StageFrame fill="#F4EBDD">
      <line x1={-330} y1={0} x2={330} y2={0} stroke="rgba(20,16,12,.2)" strokeWidth={16} strokeLinecap="round" />
      <line x1={-330} y1={0} x2={lerp(-330, 330, k)} y2={0} stroke={MUST} strokeWidth={16} strokeLinecap="round" />
      {marcos.map(([p, ano, txt], i) => {
        const x = lerp(-330, 330, p), on = k >= p - 0.02;
        return (
          <g key={i} transform={`translate(${x},0)`} opacity={on ? 1 : 0.25}>
            <circle r={on ? 30 : 22} fill={on ? '#C62828' : '#999'} stroke="#fff" strokeWidth={7} />
            <text y={i % 2 ? 110 : -70} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill={INK}>{ano}</text>
            <text y={i % 2 ? 160 : -140} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={30} fill={INK}>{txt.length > 22 ? txt.slice(0, txt.lastIndexOf(' ', 20)) : txt}<tspan x={0} dy={34}>{txt.length > 22 ? txt.slice(txt.lastIndexOf(' ', 20) + 1) : ''}</tspan></text>
          </g>
        );
      })}
      <text x={0} y={-330} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={54} fill={INK}>ORIGEM NATURAL</text>
      <text x={-470} y={470} fontFamily={F} fontWeight={700} fontSize={22} fill="rgba(20,16,12,.75)">fontes: Embrapa; Suertegaray (UFRGS)</text>
    </StageFrame>
  );
};
