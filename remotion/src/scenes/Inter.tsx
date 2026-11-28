import React from 'react';
import { MUST, clamp, easeOut, easeInOut, kf, lerp, pop } from '../lib';
import { StageFrame, Trophy } from './Gremio';

/* #005 Inter — cenas. Só cores e nome do clube: sem escudo, sem logo, sem mascote oficial. */
export const RED = '#C62828';
export const RED_D = '#8E1B1B';
const SEPIA = '#E9D6B0';
const F = 'Montserrat';

/* ---------- Mundo (fundo em tela cheia, desenhado dentro da câmera) ----------
 * Pôr do sol no Guaíba. Desenhado maior que a tela para a câmera poder andar. */
export const GuaibaWorld: React.FC<{ t: number; w?: number; h?: number; flags?: 'inter' | 'rs' | 'none' }> = ({ t, w = 1080, h = 1920, flags = 'inter' }) => {
  const sx = w / 1080, horizon = h * 0.735, shore = h * 0.81;
  return (
    <g>
      <defs>
        <linearGradient id="gwSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3C2A5A" />
          <stop offset="0.45" stopColor="#C8553D" />
          <stop offset="0.8" stopColor="#F2A65A" />
          <stop offset="1" stopColor="#F9D18B" />
        </linearGradient>
        <linearGradient id="gwWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E89A5C" />
          <stop offset="1" stopColor="#6B4E6E" />
        </linearGradient>
        <linearGradient id="gwGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5E7F3A" />
          <stop offset="1" stopColor="#3D5A26" />
        </linearGradient>
        <radialGradient id="gwSun">
          <stop offset="0" stopColor="#FFF3C4" />
          <stop offset="0.5" stopColor="#FFD27A" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFB04A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={-600} y={-600} width={w + 1200} height={horizon + 600} fill="url(#gwSky)" />
      {/* nuvens finas andando */}
      {[0, 1, 2, 3].map((i) => {
        const x = ((i * 420 + t * 12) % (w + 900)) - 450;
        return <ellipse key={i} cx={x} cy={h * (0.12 + 0.07 * i)} rx={220 * sx} ry={18} fill="#FFD8B0" opacity={0.25} />;
      })}
      <circle cx={w * 0.7} cy={horizon - 40} r={260 * sx} fill="url(#gwSun)" />
      <circle cx={w * 0.7} cy={horizon - 20} r={70 * sx} fill="#FFE9A8" />
      {/* skyline distante de Porto Alegre */}
      <g fill="#4A2E3E" opacity={0.85}>
        {Array.from({ length: 26 }).map((_, i) => {
          const bw = 40 + ((i * 37) % 50), bh = 60 + ((i * 53) % 150);
          return <rect key={i} x={-300 + i * ((w + 600) / 26)} y={horizon - bh} width={bw * sx} height={bh} />;
        })}
        <rect x={w * 0.18} y={horizon - 260} width={30} height={260} />
        <path d={`M${w * 0.18 - 10},${horizon - 260} L${w * 0.18 + 15},${horizon - 330} L${w * 0.18 + 40},${horizon - 260} Z`} />
      </g>
      {/* Guaíba */}
      <rect x={-600} y={horizon} width={w + 1200} height={shore - horizon + 40} fill="url(#gwWater)" />
      {Array.from({ length: 9 }).map((_, i) => {
        const y = horizon + 14 + i * ((shore - horizon) / 9);
        const ww = 160 - i * 10 + Math.sin(t * 2 + i) * 20;
        return <rect key={i} x={w * 0.7 - ww / 2 + Math.sin(t * 1.3 + i * 2) * 10} y={y} width={ww} height={5} rx={2.5} fill="#FFE9A8" opacity={0.55 - i * 0.04} />;
      })}
      {/* margem / gramado */}
      <path d={`M-600,${shore} Q${w * 0.3},${shore - 30} ${w * 0.6},${shore - 6} T${w + 600},${shore - 10} L${w + 600},${h + 600} L-600,${h + 600} Z`} fill="url(#gwGround)" />
      {/* calçadão */}
      <path d={`M-600,${h * 0.93} Q${w / 2},${h * 0.9} ${w + 600},${h * 0.93} L${w + 600},${h + 600} L-600,${h + 600} Z`} fill="#B9A383" />
      <path d={`M-600,${h * 0.93} Q${w / 2},${h * 0.9} ${w + 600},${h * 0.93}`} stroke="#8E7A5C" strokeWidth={6} fill="none" />
      {/* bandeirinhas vermelho e branco */}
      {flags !== 'none' && [-0.12, 1.1].map((k, i) => {
        const x = w * k, y = shore - 10;
        const wv = Math.sin(t * 5 + i) * 8;
        return (
          <g key={i}>
            <rect x={x - 5} y={y - 360} width={10} height={360} fill="#5A4A3A" />
            <path d={`M${x + 5},${y - 355} q60,${-10 + wv} 120,0 q-6,40 0,80 q-60,${-10 - wv} -120,0 Z`} fill={flags === 'rs' ? '#1E7B3A' : RED} />
            <path d={`M${x + 5},${y - 315} q60,${-10 + wv} 120,0 l0,12 q-60,${-10 - wv} -120,0 Z`} fill={flags === 'rs' ? '#C62828' : '#F4F4F4'} />
            {flags === 'rs' && <path d={`M${x + 5},${y - 303} q60,${-10 + wv} 120,0 l0,28 q-60,${-10 - wv} -120,0 Z`} fill="#F2C230" />}
          </g>
        );
      })}
    </g>
  );
};

/* ---------- Gente de 1909 (figura simples, semi-realista) ---------- */
export const Gent: React.FC<{ t: number; skin?: string; coat?: string; hat?: 'boater' | 'cap' | 'bowler' | 'none'; walk?: number; look?: number; dress?: boolean }> = ({ t, skin = '#D8A47C', coat = '#3E3A36', hat = 'boater', walk = 0, look = 0, dress = false }) => {
  const ph = t * 7;
  const b = -Math.abs(Math.sin(ph)) * 8 * walk;
  const lg = Math.sin(ph) * 14 * walk;
  return (
    <g transform={`translate(0,${b})`}>
      <ellipse cx={0} cy={4 - b} rx={60} ry={12} fill="rgba(0,0,0,.25)" />
      {dress ? (
        <path d="M-50,-150 L50,-150 L70,-10 L-70,-10 Z" fill={coat} />
      ) : (
        <g>
          <rect x={-34} y={-150} width={28} height={146} rx={10} fill="#2A2724" transform={`rotate(${lg} -20 -150)`} />
          <rect x={6} y={-150} width={28} height={146} rx={10} fill="#2A2724" transform={`rotate(${-lg} 20 -150)`} />
        </g>
      )}
      <path d="M-56,-270 Q-62,-200 -50,-140 L50,-140 Q62,-200 56,-270 Q0,-290 -56,-270 Z" fill={coat} />
      <path d="M-14,-282 L0,-240 L14,-282 Z" fill="#F4EFE6" />
      <rect x={-74} y={-266} width={22} height={110} rx={11} fill={coat} transform={`rotate(${8 + lg * 0.6} -63 -266)`} />
      <rect x={52} y={-266} width={22} height={110} rx={11} fill={coat} transform={`rotate(${-8 - lg * 0.6} 63 -266)`} />
      <g transform={`rotate(${look} 0 -300)`}>
        <ellipse cx={0} cy={-322} rx={38} ry={44} fill={skin} />
        <ellipse cx={-10} cy={-334} rx={16} ry={14} fill="rgba(255,255,255,.12)" />
        <circle cx={-13 + look * 0.4} cy={-326} r={4} fill="#1E140C" />
        <circle cx={13 + look * 0.4} cy={-326} r={4} fill="#1E140C" />
        {!dress && <path d="M-16,-302 q16,-8 32,0" stroke="#3A2416" strokeWidth={6} fill="none" strokeLinecap="round" />}
        {hat === 'boater' && <g><rect x={-56} y={-360} width={112} height={10} rx={5} fill="#D9C38A" /><rect x={-36} y={-386} width={72} height={30} rx={4} fill="#E8D49A" /><rect x={-36} y={-366} width={72} height={8} fill="#3A2A1A" /></g>}
        {hat === 'bowler' && <g><ellipse cx={0} cy={-356} rx={54} ry={9} fill="#1E1B18" /><path d="M-36,-356 Q-36,-404 0,-404 Q36,-404 36,-356 Z" fill="#26221E" /></g>}
        {hat === 'cap' && <path d="M-42,-348 Q-40,-382 0,-384 Q40,-382 44,-350 L64,-346 Q40,-338 -42,-344 Z" fill="#5A5048" />}
        {hat === 'none' && <path d="M-38,-338 Q-36,-372 0,-372 Q36,-372 38,-338 Q20,-356 -38,-338 Z" fill="#2A1A10" />}
      </g>
    </g>
  );
};

const SKINS = ['#E2B08A', '#8A5A3C', '#C68E64', '#5E3B26', '#D9A47A', '#A8714C', '#EBC3A0', '#704630'];
const COATS = ['#3E3A36', '#5A3A2A', '#2E3F52', '#4E4A2E', '#6A2E2A', '#3A3A44', '#5C4A3A', '#2E4A3A'];
const HATS: ('boater' | 'cap' | 'bowler' | 'none')[] = ['cap', 'boater', 'none', 'bowler', 'cap', 'none', 'boater', 'cap'];

/* ---------- Card: portão do clube (fechado / abrindo) ---------- */
export const StageGate: React.FC<{ t: number; open?: number; crowd?: number; sign?: string }> = ({ t, open = 0, crowd = 0, sign = 'SÓCIOS' }) => {
  const leaf = 1 - open * 0.82;
  return (
    <StageFrame fill={SEPIA}>
      <rect x={-500} y={160} width={1000} height={340} fill="#BFA77A" />
      {/* muros de tijolo */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <rect x={sd < 0 ? -500 : 270} y={-260} width={230} height={430} fill="#A0522D" />
          {Array.from({ length: 12 }).map((_, r) => Array.from({ length: 5 }).map((__, c) => (
            <rect key={`${r}${c}`} x={(sd < 0 ? -500 : 270) + c * 48 + (r % 2) * 24 - 12} y={-260 + r * 36} width={44} height={32} fill="none" stroke="#7A3E20" strokeWidth={3} />
          )))}
        </g>
      ))}
      {/* pilares */}
      {[-290, 270].map((x) => <rect key={x} x={x} y={-330} width={40} height={500} fill="#8C8070" />)}
      {/* portão de ferro em duas folhas */}
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${sd * 250},0) scale(${leaf},1) translate(${-sd * 250},0)`}>
          <rect x={sd < 0 ? -250 : 0} y={-300} width={250} height={20} fill="#2A2622" />
          <rect x={sd < 0 ? -250 : 0} y={140} width={250} height={20} fill="#2A2622" />
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <rect x={(sd < 0 ? -244 : 6) + i * 31} y={-330} width={10} height={480} fill="#2A2622" />
              <path d={`M${(sd < 0 ? -244 : 6) + i * 31 - 6},-330 l11,-24 l11,24 Z`} fill="#2A2622" />
            </g>
          ))}
        </g>
      ))}
      {/* placa */}
      <g transform={`translate(0,${-150 + open * 40}) rotate(${open * 18})`} opacity={1 - open}>
        <rect x={-150} y={-44} width={300} height={88} rx={10} fill="#F4EBDD" stroke="#2A2622" strokeWidth={6} />
        <text x={0} y={18} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={52} fill="#2A2622">{sign}</text>
      </g>
      {/* os três irmãos do lado de fora, olhando */}
      {crowd <= 0 && [-300, -170, 330].map((x, i) => (
        <g key={i} transform={`translate(${x},${420}) scale(${0.92 + i * 0.04})`}>
          <Gent t={t} skin={['#E2B08A', '#D9A47A', '#E8B994'][i]} coat={['#3E3A36', '#2E3F52', '#4E4A2E'][i]} hat={(['boater', 'cap', 'bowler'] as const)[i]} look={i === 2 ? -10 : 10} />
        </g>
      ))}
      {/* povo entrando pelo portão aberto (perspectiva: diminui ao entrar) */}
      {crowd > 0 && Array.from({ length: 8 }).map((_, i) => {
        const k = clamp(crowd * 1.6 - i * 0.09);
        const x = lerp(-380 + (i % 4) * 250, -60 + (i % 4) * 40, k);
        const y = lerp(470, 120, k);
        const s = lerp(1.05, 0.55, k);
        return (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`} opacity={k >= 1 ? 0 : 1}>
            <Gent t={t + i * 0.3} skin={SKINS[i]} coat={COATS[i]} hat={HATS[i]} walk={1} dress={i === 2 || i === 6} />
          </g>
        );
      }).reverse()}
      <rect x={-500} y={-500} width={1000} height={1000} fill="rgba(120,80,30,.14)" />
    </StageFrame>
  );
};

/* ---------- Card: mapa São Paulo → Porto Alegre com trem ---------- */
export const StageTrain: React.FC<{ t: number; prog: number }> = ({ t, prog }) => {
  const A = { x: 250, y: -330 }, B = { x: -150, y: 300 }, C = { x: 260, y: 60 };
  const pt = (k: number) => ({ x: (1 - k) ** 2 * A.x + 2 * (1 - k) * k * C.x + k * k * B.x, y: (1 - k) ** 2 * A.y + 2 * (1 - k) * k * C.y + k * k * B.y });
  const p = pt(prog), p2 = pt(Math.min(1, prog + 0.02));
  const ang = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
  return (
    <StageFrame fill="#9FD3EE">
      <path d="M-500,-500 L330,-500 C360,-400 400,-330 330,-250 C300,-150 380,-60 300,60 C230,160 120,240 40,330 C-20,400 -60,450 -80,500 L-500,500 Z" fill="#B9D38A" stroke="#7FA357" strokeWidth={8} />
      <path d="M-500,180 C-400,200 -300,240 -200,320" stroke="#7FA357" strokeWidth={4} strokeDasharray="10 10" fill="none" />
      <path d={`M${A.x},${A.y} Q${C.x},${C.y} ${B.x},${B.y}`} fill="none" stroke="#5A4A3A" strokeWidth={14} />
      <path d={`M${A.x},${A.y} Q${C.x},${C.y} ${B.x},${B.y}`} fill="none" stroke="#E9D6B0" strokeWidth={6} strokeDasharray="4 18" />
      {[A, B].map((q, i) => (
        <g key={i}>
          <circle cx={q.x} cy={q.y} r={20} fill={RED} stroke="#fff" strokeWidth={6} />
          <text x={q.x + (i ? -10 : -30)} y={q.y + (i ? 70 : -36)} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={40} fill="#1E1B18">{i ? 'PORTO ALEGRE' : 'SÃO PAULO'}</text>
        </g>
      ))}
      {/* trem */}
      <g transform={`translate(${p.x},${p.y}) rotate(${ang})`}>
        {[1, 2].map((k) => <rect key={k} x={-60 - k * 78} y={-26} width={70} height={52} rx={8} fill={k === 1 ? '#6A4A30' : '#7A5A3C'} stroke="#2A1A10" strokeWidth={4} />)}
        <rect x={-55} y={-30} width={100} height={60} rx={10} fill="#2A2622" />
        <rect x={10} y={-40} width={24} height={30} fill="#2A2622" />
        <circle cx={44} cy={0} r={10} fill="#FFD27A" />
      </g>
      {prog > 0 && prog < 1 && [0, 1, 2].map((k) => {
        const ph = (t * 1.6 + k / 3) % 1;
        return <circle key={k} cx={p.x - ph * 60} cy={p.y - 50 - ph * 90} r={14 + ph * 26} fill="#fff" opacity={0.7 * (1 - ph)} />;
      })}
      <g transform="translate(-300,-380)">
        <rect x={-110} y={-46} width={220} height={92} rx={46} fill={MUST} />
        <text x={0} y={18} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={50} fill="#1E1B18">1908</text>
      </g>
    </StageFrame>
  );
};

/* ---------- Card: rolo compressor achatando o 10 × 0 e as 6 taças ---------- */
export const StageRoller: React.FC<{ t: number; at: number; flatT: number; cupsT: number }> = ({ t, at, flatT, cupsT }) => {
  const rx = kf(t, [[at, -820], [flatT, 0], [flatT + 1.4, 820]]);
  const flat = easeOut(clamp((t - flatT + 0.15) / 0.25));
  const drum = (t - at) * 360;
  return (
    <StageFrame fill={SEPIA}>
      <rect x={-500} y={180} width={1000} height={320} fill="#9C8C70" />
      <rect x={-500} y={176} width={1000} height={10} fill="#5A4A3A" />
      {/* placar de madeira 10 × 0 */}
      <g transform={`translate(0,180) scale(${1 + flat * 0.25},${1 - flat * 0.9}) translate(0,-180)`} opacity={t > cupsT ? 1 - clamp((t - cupsT) / 0.3) : 1}>
        <rect x={-340} y={-200} width={680} height={380} rx={18} fill="#6B4E2E" stroke="#3E2A16" strokeWidth={10} />
        <text x={-170} y={-110} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={42} fill="#F4EEE2">GRÊMIO</text>
        <text x={170} y={-110} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={42} fill="#F4EEE2">INTER</text>
        <text x={-170} y={80} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={170} fill={MUST}>10</text>
        <text x={0} y={60} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={90} fill="#F4EEE2">×</text>
        <text x={170} y={80} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={170} fill="#F4EEE2">0</text>
        <rect x={-340} y={150} width={680} height={30} fill="#3E2A16" />
      </g>
      {/* rolo compressor vermelho */}
      {t > at && t < flatT + 1.5 && (
        <g transform={`translate(${rx},${180 + Math.sin(t * 30) * 2})`}>
          <rect x={-40} y={-250} width={210} height={130} rx={14} fill={RED} stroke={RED_D} strokeWidth={8} />
          <rect x={0} y={-236} width={90} height={70} rx={8} fill="#BFE3F2" />
          <rect x={170} y={-270} width={22} height={70} fill="#2A2622" />
          <rect x={-200} y={-160} width={240} height={50} rx={10} fill={RED_D} />
          <g transform="translate(-140,-80)">
            <circle r={84} fill="#5A5048" stroke="#2A2622" strokeWidth={10} />
            <g transform={`rotate(${drum})`}><rect x={-80} y={-6} width={160} height={12} fill="#2A2622" /><rect x={-6} y={-80} width={12} height={160} fill="#2A2622" /></g>
          </g>
          <g transform="translate(120,-50)">
            <circle r={52} fill="#2A2622" />
            <g transform={`rotate(${drum * 1.6})`}><circle r={22} fill="#8C8070" /><rect x={-48} y={-5} width={96} height={10} fill="#8C8070" /></g>
          </g>
          {[0, 1, 2].map((k) => {
            const ph = (t * 2 + k / 3) % 1;
            return <circle key={k} cx={181 - ph * 40} cy={-290 - ph * 110} r={12 + ph * 22} fill="#5A5048" opacity={0.6 * (1 - ph)} />;
          })}
        </g>
      )}
      {t > flatT && t < flatT + 0.5 && <text x={0} y={-300} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={110} fill="#fff" stroke="#1E1B18" strokeWidth={12} paintOrder="stroke" transform={`rotate(-6) scale(${pop(t, flatT)})`}>PLAFT!</text>}
      {/* seis taças, uma por ano */}
      {[1940, 1941, 1942, 1943, 1944, 1945].map((y, i) => {
        const s = pop(t, cupsT + i * 0.16);
        const x = -375 + i * 150;
        return s > 0 ? (
          <g key={y} transform={`translate(${x},20) scale(${s})`}>
            <g transform="scale(0.9)"><Trophy /></g>
            <text x={0} y={150} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={38} fill="#1E1B18">{y}</text>
          </g>
        ) : null;
      })}
      <rect x={-500} y={-500} width={1000} height={1000} fill="rgba(120,80,30,.12)" />
    </StageFrame>
  );
};

/* ---------- Card: Beira-Rio (aterro avançando sobre o rio e estádio subindo em tijolos) ---------- */
export const StageBeiraRio: React.FC<{ t: number; fill: number; build: number; labelT: number }> = ({ t, fill, build, labelT }) => {
  const rows = 10;
  const shown = build * rows;
  const landX = lerp(-500, 420, easeInOut(fill));
  return (
    <StageFrame fill="#F7C98B">
      <circle cx={300} cy={-260} r={90} fill="#FFE9A8" />
      {/* rio */}
      <rect x={-500} y={160} width={1000} height={340} fill="#5D8FB5" />
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-460 + ((i * 190 + t * 40) % 1000)} y={200 + i * 45} width={90} height={6} rx={3} fill="#A9CBE2" opacity={0.7} />)}
      {/* aterro */}
      <path d={`M-500,150 L${landX},150 L${landX + 60},500 L-500,500 Z`} fill="#8A6A44" />
      <path d={`M-500,150 L${landX},150`} stroke="#5E7F3A" strokeWidth={14} />
      {/* caminhõezinhos de terra no aterro */}
      {fill > 0 && fill < 1 && <g transform={`translate(${landX - 70},120)`}><rect x={-50} y={-40} width={70} height={40} fill="#C9A24A" /><rect x={20} y={-30} width={36} height={30} fill={RED} /><circle cx={-30} cy={4} r={12} fill="#2A2622" /><circle cx={36} cy={4} r={12} fill="#2A2622" /></g>}
      {/* estádio: anel oval subindo fileira por fileira */}
      <g transform="translate(-40,150)">
        {Array.from({ length: rows }).map((_, r) => {
          const k = clamp(shown - r);
          if (k <= 0) return null;
          const y = -r * 26, wr = 360 - r * 6;
          return (
            <g key={r} opacity={k} transform={`translate(0,${(1 - k) * -30})`}>
              <rect x={-wr} y={y - 26} width={wr * 2} height={26} fill={r % 2 ? '#B85A3A' : '#C96A48'} />
              {Array.from({ length: 14 }).map((__, c) => <rect key={c} x={-wr + c * (wr / 7) + (r % 2) * (wr / 14)} y={y - 26} width={2} height={26} fill="rgba(80,30,20,.45)" />)}
            </g>
          );
        })}
        {build >= 1 && (
          <g>
            <path d="M-320,-262 Q0,-330 320,-262" stroke={RED} strokeWidth={22} fill="none" />
            <path d="M-320,-262 Q0,-330 320,-262" stroke="#F4F4F4" strokeWidth={6} fill="none" strokeDasharray="30 30" />
            {[-280, -140, 0, 140, 280].map((x) => <rect key={x} x={x - 4} y={-380} width={8} height={110} fill="#5A5048" />)}
          </g>
        )}
      </g>
      {/* torcedores carregando tijolo */}
      {build > 0 && build < 1 && [0, 1, 2].map((i) => {
        const x = ((t * 70 + i * 220) % 700) - 470;
        return (
          <g key={i} transform={`translate(${x},150) scale(0.42)`}>
            <Gent t={t + i} skin={SKINS[i * 2]} coat={COATS[i + 3]} hat={HATS[i]} walk={1} />
            <rect x={-30} y={-300} width={60} height={30} fill="#B85A3A" stroke="#6A2A1A" strokeWidth={4} />
          </g>
        );
      })}
      {t > labelT && (
        <g transform={`translate(0,-400) scale(${pop(t, labelT)})`}>
          <rect x={-260} y={-48} width={520} height={96} rx={48} fill={MUST} />
          <text x={0} y={18} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={50} fill="#1E1B18">BEIRA-RIO · 1969</text>
        </g>
      )}
    </StageFrame>
  );
};

const Star: React.FC<{ r?: number; c?: string }> = ({ r = 90, c = MUST }) => {
  const pts = Array.from({ length: 10 }).map((_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.42 : r;
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
  }).join(' ');
  return <polygon points={pts} fill={c} stroke="#9A7410" strokeWidth={6} strokeLinejoin="round" />;
};

/* ---------- Card: tri brasileiro (3 estrelas) + invicto ---------- */
export const StageStars: React.FC<{ t: number; at: [number, number, number]; invT: number }> = ({ t, at, invT }) => (
  <StageFrame fill={RED_D}>
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-600 + i * 110 + ((t * 18) % 110)} y={-700} width={44} height={1400} fill="#fff" opacity={0.05} transform="rotate(14)" />)}
    <text x={0} y={-330} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={60} fill="#fff">CAMPEÃO BRASILEIRO</text>
    {at.map((a, i) => {
      const s = pop(t, a, 0.3);
      const x = (i - 1) * 290;
      const glow = t > a ? 0.35 + 0.15 * Math.sin(t * 5 + i) : 0;
      return (
        <g key={i} transform={`translate(${x},${-110 - (i === 1 ? 30 : 0)})`}>
          <circle r={120} fill="#FFE9A8" opacity={glow} />
          <g transform={`scale(${s}) rotate(${(1 - clamp((t - a) / 0.4)) * 90})`}><Star /></g>
          {s > 0 && <text x={0} y={170} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={84} fill="#fff" transform={`scale(${pop(t, a + 0.1)})`}>{['1975', '1976', '1979'][i]}</text>}
        </g>
      );
    })}
    {t > invT && (
      <g transform={`translate(0,290) scale(${pop(t, invT, 0.3)})`}>
        <rect x={-390} y={-90} width={780} height={180} rx={30} fill="#F4F4F4" />
        <text x={0} y={36} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={96} fill={RED}>0 DERROTAS</text>
      </g>
    )}
    {t > invT + 0.9 && (
      <g transform={`translate(230,170) rotate(-12) scale(${(2 - easeOut((t - invT - 0.9) / 0.2)) * 0.7})`} opacity={easeOut((t - invT - 0.9) / 0.2)}>
        <rect x={-210} y={-60} width={420} height={120} rx={16} fill="none" stroke={MUST} strokeWidth={14} />
        <text x={0} y={30} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={84} fill={MUST}>INVICTO</text>
      </g>
    )}
  </StageFrame>
);

/* ---------- Card: duas Libertadores (taças genéricas) ---------- */
export const StageCups: React.FC<{ t: number; at: [number, number] }> = ({ t, at }) => (
  <StageFrame fill="#1E2A36">
    {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-600 + i * 130} y={-700} width={50} height={1400} fill={RED} opacity={0.12} transform="rotate(14)" />)}
    <text x={0} y={-330} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={62} fill="#fff">LIBERTADORES</text>
    {at.map((a, i) => (
      <g key={i} transform={`translate(${(i ? 1 : -1) * 220},40) scale(${pop(t, a, 0.3) * 1.9})`}>
        <Trophy c="#E8C040" />
        <text x={0} y={140} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={48} fill="#fff">{i ? '2010' : '2006'}</text>
      </g>
    ))}
  </StageFrame>
);

/* Confete com cores escolhidas */
export const ConfettiC: React.FC<{ t: number; start: number; colors?: string[]; cx?: number; cy?: number }> = ({ t, start, colors = [RED, '#F4F4F4', MUST], cx = 540, cy = 900 }) => {
  const dt = t - start;
  if (dt < 0 || dt > 3) return null;
  return (
    <g>
      {Array.from({ length: 70 }).map((_, i) => {
        const ang = (i / 70) * Math.PI * 2 + i;
        const v = 500 + (i % 7) * 120;
        const x = cx + Math.cos(ang) * v * dt;
        const y = cy + Math.sin(ang) * v * dt * 0.6 + 900 * dt * dt;
        return <rect key={i} x={x} y={y} width={18} height={30} rx={4} fill={colors[i % colors.length]} transform={`rotate(${dt * 500 + i * 40} ${x} ${y})`} opacity={1 - dt / 3} />;
      })}
    </g>
  );
};

/* Cachecol solto (para o final, ao lado do Cusco) */
export const ScarfProp: React.FC<{ kind: 'inter' | 'gremio' }> = ({ kind }) => (
  <g>
    {Array.from({ length: 8 }).map((_, i) => (
      <rect key={i} x={-40} y={-200 + i * 50} width={80} height={50} fill={kind === 'inter' ? (i % 2 ? '#F4F4F4' : RED) : ['#0D80BF', '#151515', '#F4F4F4'][i % 3]} />
    ))}
    <rect x={-40} y={-200} width={80} height={400} rx={6} fill="none" stroke="rgba(0,0,0,.3)" strokeWidth={4} />
    {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={-34 + i * 13} y1={200} x2={-34 + i * 13} y2={230} stroke="#F4F4F4" strokeWidth={5} />)}
  </g>
);

/* ---------- Card: Estádio dos Eucaliptos (1931, Menino Deus) ---------- */
export const StageEucaliptos: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const k = easeOut(clamp((t - at) / 1.2));
  return (
    <StageFrame fill="#CFE3EE">
      <rect x={-500} y={120} width={1000} height={380} fill="#6E9A45" />
      {/* eucaliptos balançando */}
      {[-430, -330, 330, 440].map((x, i) => (
        <g key={i} transform={`translate(${x},130) rotate(${Math.sin(t * 1.5 + i) * 2})`}>
          <rect x={-10} y={-420} width={20} height={420} fill="#C9B8A0" />
          <ellipse cx={0} cy={-420} rx={70} ry={140} fill="#5F8A5A" />
          <ellipse cx={-30} cy={-330} rx={50} ry={90} fill="#6E9A68" />
        </g>
      ))}
      {/* arquibancada de madeira subindo */}
      <g transform={`translate(0,130) scale(1,${k})`}>
        {Array.from({ length: 5 }).map((_, r) => (
          <rect key={r} x={-260 + r * 12} y={-60 - r * 50} width={520 - r * 24} height={50} fill={r % 2 ? '#8A5A34' : '#9C6A3E'} stroke="#5A3A20" strokeWidth={4} />
        ))}
        <rect x={-270} y={-330} width={540} height={24} fill={RED} />
        <path d="M-280,-330 L0,-400 L280,-330 Z" fill="#7A2A22" />
      </g>
      <g transform={`translate(0,330) scale(${pop(t, at + 0.8)})`}>
        <rect x={-330} y={-50} width={660} height={100} rx={50} fill={MUST} />
        <text x={0} y={18} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={46} fill="#1E1B18">EUCALIPTOS · 1931</text>
      </g>
    </StageFrame>
  );
};

/* ---------- Card: Saci (figura genérica do folclore, NÃO o mascote oficial) ---------- */
export const StageSaci: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const hop = Math.abs(Math.sin(t * 4)) * 70;
  const x = Math.sin(t * 0.9) * 200;
  const sp = (t * 6) % (Math.PI * 2);
  return (
    <StageFrame fill="#2E4A2E">
      <rect x={-500} y={180} width={1000} height={320} fill="#4E6E36" />
      {/* redemoinho */}
      {[0, 1, 2].map((k) => <ellipse key={k} cx={x} cy={170 - k * 60} rx={150 - k * 30} ry={24} fill="none" stroke="#D9C9A0" strokeWidth={6} opacity={0.35} transform={`rotate(${Math.sin(sp + k) * 8} ${x} ${170 - k * 60})`} />)}
      <g transform={`translate(${x},${170 - hop}) scale(${pop(t, at, 0.3)})`}>
        <ellipse cx={0} cy={hop + 6} rx={70} ry={12} fill="rgba(0,0,0,.3)" />
        {/* uma perna só */}
        <rect x={-14} y={-150} width={28} height={150} rx={12} fill="#5A3624" />
        <ellipse cx={8} cy={-4} rx={30} ry={12} fill="#4A2A1A" />
        <rect x={-60} y={-200} width={120} height={70} rx={20} fill="#C62828" />
        <path d="M-56,-330 Q-66,-250 -50,-196 L50,-196 Q66,-250 56,-330 Q0,-350 -56,-330 Z" fill="#5A3624" />
        <rect x={-88} y={-330} width={28} height={130} rx={14} fill="#5A3624" transform={`rotate(${20 + Math.sin(t * 8) * 20} -74 -330)`} />
        <rect x={60} y={-330} width={28} height={130} rx={14} fill="#5A3624" transform={`rotate(${-20 - Math.sin(t * 8) * 20} 74 -330)`} />
        <ellipse cx={0} cy={-390} rx={56} ry={62} fill="#6A4430" />
        <circle cx={-20} cy={-396} r={7} fill="#fff" /><circle cx={20} cy={-396} r={7} fill="#fff" />
        <circle cx={-18} cy={-395} r={4} fill="#120A05" /><circle cx={22} cy={-395} r={4} fill="#120A05" />
        <path d="M-24,-364 Q0,-344 24,-364" stroke="#2A1408" strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* gorro vermelho */}
        <path d="M-58,-420 Q-50,-500 40,-520 Q90,-526 110,-490 Q60,-480 58,-420 Z" fill="#C62828" />
        <circle cx={110} cy={-490} r={14} fill="#F4F4F4" />
      </g>
      <g transform="translate(0,-380)">
        <rect x={-260} y={-46} width={520} height={92} rx={46} fill={MUST} />
        <text x={0} y={16} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={44} fill="#1E1B18">FOLCLORE · SACI</text>
      </g>
    </StageFrame>
  );
};

/* ---------- Card: o gol do Mundial 2006, visto de cima (bonequinhos genéricos) ---------- */
export const StageGoal: React.FC<{ t: number; stealT: number; passT: number; goalT: number }> = ({ t, stealT, passT, goalT }) => {
  const BAR = '#1D3D8F';
  const ball = t < stealT ? { x: kf(t, [[stealT - 2.5, -150], [stealT, 40]]), y: -40 }
    : t < passT ? { x: kf(t, [[stealT, 40], [passT, 120]]), y: kf(t, [[stealT, -40], [passT, 60]]) }
    : t < passT + 0.5 ? { x: kf(t, [[passT, 120], [passT + 0.5, 250]]), y: kf(t, [[passT, 60], [passT + 0.5, -120]]) }
    : t < goalT ? { x: kf(t, [[passT + 0.5, 250], [goalT - 0.25, 320]]), y: kf(t, [[passT + 0.5, -120], [goalT - 0.25, -170]]) }
    : { x: kf(t, [[goalT - 0.25, 320], [goalT + 0.15, 450]]), y: kf(t, [[goalT - 0.25, -170], [goalT + 0.15, -10]]) };
  const p = (x: number, y: number, c: string, k: number, label?: string) => (
    <g key={k} transform={`translate(${x},${y})`}>
      <circle r={26} fill={c} stroke="#fff" strokeWidth={5} />
      {label && <text y={-40} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={30} fill="#fff" stroke="#1E1B18" strokeWidth={6} paintOrder="stroke">{label}</text>}
    </g>
  );
  const iar = { x: t < stealT ? kf(t, [[stealT - 2, -40], [stealT, 40]]) : kf(t, [[stealT, 40], [passT, 110]]), y: t < stealT ? -40 : kf(t, [[stealT, -40], [passT, 50]]) };
  const gab = { x: kf(t, [[passT - 1, 160], [goalT - 0.3, 300]]), y: kf(t, [[passT - 1, -60], [goalT - 0.3, -160]]) };
  return (
    <StageFrame fill="#3E8E3E">
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-500 + i * 125} y={-500} width={62} height={1000} fill="#4A9A48" />)}
      <rect x={-460} y={-420} width={920} height={840} fill="none" stroke="#fff" strokeWidth={6} />
      <line x1={0} y1={-420} x2={0} y2={420} stroke="#fff" strokeWidth={6} />
      <circle r={110} fill="none" stroke="#fff" strokeWidth={6} />
      <rect x={300} y={-200} width={160} height={400} fill="none" stroke="#fff" strokeWidth={6} />
      <rect x={460} y={-80} width={30} height={160} fill="rgba(255,255,255,.5)" stroke="#fff" strokeWidth={4} />
      {[[-200, 200], [-260, -180], [180, 230], [380, 0]].map(([x, y], i) => p(x + Math.sin(t + i) * 10, y, BAR, 10 + i))}
      {p(t < stealT ? kf(t, [[stealT - 2.5, -150], [stealT, 30]]) : 30 + Math.sin(t) * 6, t < stealT ? -40 : -40, BAR, 20)}
      {[[-300, 120], [-120, 260]].map(([x, y], i) => p(x + Math.sin(t * 1.3 + i) * 12, y, RED, 30 + i))}
      {p(iar.x, iar.y, RED, 40, t > stealT - 0.5 && t < passT + 1 ? 'IARLEY' : undefined)}
      {p(gab.x, gab.y, RED, 41, t > passT - 0.5 ? 'GABIRU' : undefined)}
      <circle cx={ball.x} cy={ball.y} r={13} fill="#fff" stroke="#1E1B18" strokeWidth={4} />
      {t > goalT && (
        <g transform={`translate(0,-300) scale(${pop(t, goalT, 0.3)}) rotate(-6)`}>
          <text textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={150} fill={MUST} stroke="#1E1B18" strokeWidth={14} paintOrder="stroke">GOOOL!</text>
        </g>
      )}
    </StageFrame>
  );
};

/* ---------- Card: a queda (Série B) e a volta (Série A) ---------- */
export const StageDrop: React.FC<{ t: number; downT: number; upT: number }> = ({ t, downT, upT }) => {
  const d = easeOut(clamp((t - downT) / 0.6));
  const u = easeOut(clamp((t - upT) / 0.6));
  const y = 220 * d - 380 * u;
  return (
    <StageFrame fill="#1E2A36">
      <rect x={-380} y={-360} width={760} height={150} rx={20} fill={u > 0 ? '#2E7D32' : 'rgba(255,255,255,.12)'} />
      <text x={0} y={-262} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={84} fill="#fff">SÉRIE A</text>
      <rect x={-380} y={210} width={760} height={150} rx={20} fill={d > 0 && u < 1 ? RED : 'rgba(255,255,255,.12)'} />
      <text x={0} y={308} textAnchor="middle" fontFamily={F} fontWeight={900} fontSize={84} fill="#fff">SÉRIE B</text>
      <g transform={`translate(0,${y - 80})`}>
        <path d={u > 0.5 ? 'M0,-110 L90,0 L35,0 L35,110 L-35,110 L-35,0 L-90,0 Z' : 'M0,110 L90,0 L35,0 L35,-110 L-35,-110 L-35,0 L-90,0 Z'} fill={u > 0.5 ? '#43A047' : RED} stroke="#fff" strokeWidth={8} />
      </g>
      {d > 0 && <text x={-330} y={-60} fontFamily={F} fontWeight={900} fontSize={56} fill="#fff" opacity={1 - u}>2016</text>}
      {u > 0 && <text x={330} y={-60} textAnchor="end" fontFamily={F} fontWeight={900} fontSize={56} fill="#fff">2017</text>}
    </StageFrame>
  );
};
