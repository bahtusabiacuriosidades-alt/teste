import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import './fonts';
import { FPS, MUST, clamp, easeOut, easeInOut, lerp, kf, pop, Word } from './lib';
import { Cam } from './camera';
import { HUD, BigText, Captions } from './ui/Overlays';
import rmsData from './data/v07/rms.json';

/*
 * Teste "falso 3D" (10 s): o Lauro e o Cusco das folhas de personagem 3D,
 * recortados e animados como bonecos de recorte (troca de vista ao virar,
 * balanço ao caminhar, pulo, aceno com antebraço articulado e queixo que
 * desce com o volume da voz). Voz reaproveitada do #007.
 */
export const DURATION_T3D = 10;
const font = 'Montserrat, "Noto Color Emoji", sans-serif';
const RMS = rmsData as number[];

const WW = 2400; // largura do mundo
const GROUND = 1720; // linha do chão do Lauro
const FIG = 960; // altura do Lauro na tela (câmera afastada)
const WARM = 'sepia(0.16) saturate(1.12) brightness(1.02)'; // casa a luz de estúdio com o fim de tarde

type Jaw = { mx: number; my: number; mw: number; jx: number; jy: number; rx: number; ry: number; max: number };
type View = { src: string; w: number; h: number; jaw?: Jaw };

const LAURO: Record<'frente' | 'perfil' | 'aceno', View> = {
  frente: { src: 'img/3d/lauro_frente.png', w: 609, h: 1411, jaw: { mx: 300, my: 226, mw: 74, jx: 300, jy: 262, rx: 64, ry: 40, max: 9 } },
  perfil: { src: 'img/3d/lauro_perfil.png', w: 475, h: 1415 },
  aceno: { src: 'img/3d/lauro_aceno_corpo.png', w: 361, h: 727, jaw: { mx: 151, my: 118, mw: 32, jx: 152, jy: 138, rx: 30, ry: 22, max: 4.5 } },
};
const CUSCO: View = { src: 'img/3d/cusco_perfil.png', w: 894, h: 1085 };

/* ---------- voz: dois trechos do #007 ---------- */
const V1 = { at: 0, src: 0, dur: 0.86 }; // "Bah, tu sabia"
const V2 = { at: 7.3, src: 87.72, dur: 1.78 }; // "Comenta aí o nome da tua cidade!"
const talk = (t: number) => {
  for (const v of [V1, V2]) {
    if (t >= v.at && t < v.at + v.dur) {
      const f = Math.round((t - v.at + v.src) * FPS);
      const r = ((RMS[f] ?? 0) + (RMS[f - 1] ?? 0)) / 2;
      return Math.pow(clamp(r), 1.4) * clamp((v.at + v.dur - t) / 0.08);
    }
  }
  return 0;
};

const WORDS: Word[] = [
  ...[['Comenta', 87.78, 88.14], ['aí', 88.14, 88.28], ['o', 88.28, 88.36], ['nome', 88.36, 88.56], ['da', 88.56, 88.68], ['tua', 88.68, 88.9], ['cidade!', 88.9, 89.36]].map(
    ([w, s, e]) => ({ w: w as string, s: (s as number) - V2.src + V2.at, e: (e as number) - V2.src + V2.at }),
  ),
];

/* ---------- cenário: coxilha no fim de tarde ---------- */
export const CoxilhaWorld: React.FC<{ t: number; w: number; h: number }> = ({ t, w, h }) => {
  const ridge = (y: number, amp: number, ph: number, f: number) => {
    let d = `M-700,${h + 700} L-700,${y}`;
    for (let x = -700; x <= w + 700; x += 40) d += ` L${x},${y - amp * (0.55 + 0.45 * Math.sin(x / f + ph)) - amp * 0.3 * Math.sin(x / (f * 0.41) + ph * 1.7)}`;
    return d + ` L${w + 700},${h + 700} Z`;
  };
  const Tree: React.FC<{ x: number; y: number; s: number; c: string }> = ({ x, y, s, c }) => (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-14,0 L-8,-150 L8,-150 L14,0 Z" fill="#4A3424" />
      <path d="M0,-120 L-60,-190 M0,-130 L55,-200" stroke="#4A3424" strokeWidth={12} />
      {[[-70, -210, 80], [0, -250, 95], [70, -215, 80], [-30, -180, 70], [40, -180, 70]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={c} opacity={0.96} />
      ))}
    </g>
  );
  return (
    <g>
      <defs>
        <linearGradient id="cxSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FA3C4" />
          <stop offset="0.5" stopColor="#E9C690" />
          <stop offset="1" stopColor="#F8DCA2" />
        </linearGradient>
        <radialGradient id="cxSun">
          <stop offset="0" stopColor="#FFF7DE" />
          <stop offset="0.25" stopColor="#FFE9B0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFD58A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cxGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7C9443" />
          <stop offset="1" stopColor="#4E6B2A" />
        </linearGradient>
      </defs>
      <rect x={-700} y={-700} width={w + 1400} height={h + 1400} fill="url(#cxSky)" />
      <circle cx={w * 0.78} cy={h * 0.5} r={420} fill="url(#cxSun)" />
      {[0, 1, 2, 3].map((i) => {
        const x = ((i * 700 + t * 14) % (w + 1200)) - 600;
        return <ellipse key={i} cx={x} cy={h * (0.12 + 0.07 * i)} rx={260} ry={28} fill="#FFF4E0" opacity={0.4} />;
      })}
      <path d={ridge(h * 0.62, h * 0.05, 0.6, 300)} fill="#A9AE84" opacity={0.85} />
      <path d={ridge(h * 0.66, h * 0.05, 2.3, 240)} fill="#8E9E62" />
      <Tree x={w * 0.12} y={h * 0.66} s={0.35} c="#55703A" />
      <Tree x={w * 0.55} y={h * 0.665} s={0.28} c="#55703A" />
      <path d={ridge(h * 0.73, h * 0.045, 4.1, 360)} fill="url(#cxGround)" />
      {/* cerca de arame ao fundo */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = -400 + i * 120;
        return <rect key={i} x={x} y={h * 0.79 - 70} width={9} height={74} rx={3} fill="#5B4632" />;
      })}
      {[0, 1].map((k) => <path key={k} d={`M-400,${h * 0.79 - 52 + k * 26} L${w + 400},${h * 0.79 - 52 + k * 26}`} stroke="#6E6658" strokeWidth={2} opacity={0.8} />)}
      <Tree x={w * 0.9} y={h * 0.8} s={1.25} c="#3F5A2A" />
      <rect x={-700} y={h * 0.84} width={w + 1400} height={h} fill="#5F7E33" />
      {Array.from({ length: 60 }).map((_, i) => {
        const x = (i * 97) % (w + 200) - 100, y = h * 0.86 + ((i * 53) % 220);
        const sw = Math.sin(t * 2 + i) * 4;
        return <path key={i} d={`M${x},${y} q${-6 + sw},-26 ${-10 + sw},-38 M${x},${y} q${4 + sw},-30 ${10 + sw},-40`} stroke="#86A24A" strokeWidth={4} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
};

/* ---------- boneco recortado com queixo articulado ---------- */
const Pic: React.FC<{
  id: string; v: View; x: number; y: number; hgt: number; sx?: number; sy?: number; rot?: number;
  jaw?: number; filter?: string; opacity?: number; children?: React.ReactNode;
}> = ({ id, v, x, y, hgt, sx = 1, sy = 1, rot = 0, jaw = 0, filter, opacity = 1, children }) => {
  const k = hgt / v.h;
  const j = v.jaw;
  const d = j ? jaw * j.max : 0;
  const href = staticFile(v.src);
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${k * sx},${k * sy}) translate(${-v.w / 2},${-v.h})`} style={{ filter }} opacity={opacity}>
      <image href={href} width={v.w} height={v.h} />
      {j && d > 0.15 && (
        <>
          <defs>
            <radialGradient id={`jf-${id}`}>
              <stop offset="0.5" stopColor="#fff" />
              <stop offset="1" stopColor="#000" />
            </radialGradient>
            <mask id={`jm-${id}`} maskUnits="userSpaceOnUse" x={0} y={0} width={v.w} height={v.h}>
              <ellipse cx={j.jx} cy={j.jy} rx={j.rx} ry={j.ry} fill={`url(#jf-${id})`} />
            </mask>
            <clipPath id={`jc-${id}`}>
              <rect x={0} y={j.my} width={v.w} height={v.h} />
            </clipPath>
          </defs>
          <g clipPath={`url(#jc-${id})`}>
            <g mask={`url(#jm-${id})`}>
              <image href={href} width={v.w} height={v.h} transform={`translate(0,${d})`} />
            </g>
          </g>
          <ellipse cx={j.mx} cy={j.my + d / 2} rx={j.mw / 2} ry={d / 2 + 0.4} fill="#2B0F0A" />
          <ellipse cx={j.mx} cy={j.my + d * 0.12} rx={j.mw * 0.34} ry={Math.min(d * 0.14, j.max * 0.12)} fill="#EFE7DC" opacity={0.85} />
        </>
      )}
      {children}
    </g>
  );
};

const Shadow: React.FC<{ x: number; y: number; rx: number; lift?: number }> = ({ x, y, rx, lift = 0 }) => (
  <ellipse cx={x} cy={y + 6} rx={rx * (1 - lift * 0.3)} ry={rx * 0.15 * (1 - lift * 0.3)} fill="rgba(40,30,10,.3)" />
);

/* ---------- tempos ---------- */
const WALK_A = 1.45, WALK_B = 4.3, STEP = 0.42;
const X0 = 470, X1 = 1500;
const TURN1 = 1.2, TURN2 = 4.3, SWAP = 6.75;
const lauroX = (t: number) => (t < WALK_A ? X0 : t < WALK_B ? lerp(X0, X1, (t - WALK_A) / (WALK_B - WALK_A)) : X1);
const hop = (t: number, at: number, dur = 0.42, hgt = 70) => {
  const u = (t - at) / dur;
  if (u < 0 || u > 1) return { y: 0, sq: 1 };
  if (u < 0.15) return { y: 0, sq: 1 - 0.08 * Math.sin((u / 0.15) * Math.PI) };
  const v = (u - 0.15) / 0.85;
  return { y: Math.sin(v * Math.PI) * hgt, sq: v > 0.9 ? 1 - 0.06 * Math.sin(((v - 0.9) / 0.1) * Math.PI) : 1.03 };
};
/** vira de uma vista para outra (apertando no eixo X), devolve a escala e qual vista mostrar */
const turn = (t: number, at: number, d = 0.26): { sx: number; second: boolean } => {
  const u = (t - at) / d;
  if (u <= 0) return { sx: 1, second: false };
  if (u >= 1) return { sx: 1, second: true };
  if (u < 0.5) return { sx: 1 - 0.85 * easeInOut(u * 2), second: false };
  return { sx: 0.15 + 0.85 * easeOut((u - 0.5) * 2), second: true };
};

const SFX: [string, number, number][] = [
  ['boing', 0.06, 0.5], ['whoosh', TURN1, 0.55],
  ...Array.from({ length: Math.floor((WALK_B - WALK_A) / STEP) + 1 }).map((_, i) => ['passo', WALK_A + i * STEP, 0.55] as [string, number, number]),
  ['whoosh', TURN2, 0.5], ['patinhas', 4.7, 0.6], ['latido', 5.35, 0.9], ['boing', 5.5, 0.45],
  ['plim', SWAP, 0.45], ['pop', 7.5, 0.6],
];

export const Teste3D: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const lx = lauroX(t);
  const walking = t >= WALK_A && t < WALK_B;
  const ph = (t - WALK_A) / STEP;
  const walkBob = walking ? -Math.abs(Math.sin(Math.PI * ph)) * 20 : 0;
  const walkRot = walking ? Math.sin(Math.PI * ph) * 2.2 : 0;
  const h1 = hop(t, 0.05), h2 = hop(t, 5.5, 0.4, 55);
  const hy = h1.y + h2.y, sq = h1.sq * h2.sq;
  const idleRot = Math.sin(t * 2.1) * 1.1;
  const breath = 1 + Math.sin(t * 3) * 0.006;

  // qual vista: frente → (vira) perfil caminhando → (vira) frente → aceno
  const T1 = turn(t, TURN1), T2 = turn(t, TURN2);
  let view: 'frente' | 'perfil' = 'frente';
  let sx = 1;
  if (t < TURN2) { view = T1.second ? 'perfil' : 'frente'; sx = T1.sx; } else { view = T2.second ? 'frente' : 'perfil'; sx = T2.sx; }
  const swapK = clamp((t - SWAP) / 0.22);
  const jaw = talk(t);

  // Cusco atravessa correndo atrás do Lauro
  const cT = (t - 4.7) / 1.9;
  const cx = lerp(700, 2350, cT);
  const cBob = -Math.abs(Math.sin(t * 15)) * 26;
  const cRot = Math.sin(t * 15) * 5;

  // câmera: acompanha o Lauro; no fim chega mais perto para o aceno
  const followX = clamp(lauroX(t - 0.3) - X0, 0, X1 - X0);
  const shots = [
    { at: 0, x: 540, y: 1000, z: 1.0 },
    { at: 1.1, x: 540, y: 1010, z: 1.06, ease: 0.9 },
    { at: 7.6, x: 540 + 40, y: 1160, z: 1.16, ease: 0.9 },
  ];

  const lauroY = GROUND - hy + walkBob;
  return (
    <AbsoluteFill style={{ backgroundColor: '#F8DCA2' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
        <Cam t={t} shots={shots} followX={followX} punches={[5.35]}>
          <CoxilhaWorld t={t} w={WW} h={1920} />
          {/* Cusco (mais ao fundo = menor) */}
          {cT > 0 && cT < 1 && (
            <>
              <Shadow x={cx} y={1610} rx={100} lift={-cBob / 60} />
              <Pic id="cusco" v={CUSCO} x={cx} y={1610 + cBob} hgt={255} rot={cRot} filter={WARM} />
            </>
          )}
          <Shadow x={lx} y={GROUND} rx={190} lift={hy / 80} />
          {swapK < 1 && (
            <Pic id={`l-${view}`} v={LAURO[view]} x={lx} y={lauroY} hgt={FIG} sx={sx * (view === 'frente' ? 1 / Math.sqrt(sq) : 1)} sy={sq * breath}
              rot={walking ? walkRot : idleRot} jaw={view === 'frente' ? jaw : 0} filter={WARM} opacity={1 - swapK} />
          )}
          {swapK > 0 && (
            <Pic id="l-aceno" v={LAURO.aceno} x={lx} y={GROUND} hgt={FIG * 1.02} sy={breath} rot={Math.sin(t * 1.8) * 1.4} jaw={jaw} opacity={swapK}>
              <image href={staticFile('img/3d/lauro_aceno_braco.png')} width={361} height={727} transform={`rotate(${Math.sin((t - SWAP) * 9) * 9} 292 246)`} />
            </Pic>
          )}
        </Cam>
      </svg>

      <HUD num="TESTE 3D" cat="🧪 PROTÓTIPO · FALSO 3D" />
      <BigText t={t} start={0.05} end={1.7} lines={['BAH, TU', 'SABIA…?']} y={265} size={128} shake={t < 0.4 ? 4 : 0} />
      {t > 7.45 && (
        <div style={{ position: 'absolute', left: 60, right: 60, top: 262, textAlign: 'center', transform: `scale(${pop(t, 7.45, 0.25)}) rotate(-2deg)` }}>
          <div style={{ display: 'inline-block', background: 'rgba(20,16,12,.86)', borderRadius: 34, padding: '26px 40px', border: `6px solid ${MUST}`, fontFamily: font, fontWeight: 900, color: '#fff', lineHeight: 1.15 }}>
            <div style={{ fontSize: 76 }}>COMENTA 👇</div>
            <div style={{ fontSize: 64, color: MUST }}>A TUA CIDADE</div>
            <div style={{ fontSize: 34, marginTop: 10, opacity: 0.9 }}>A MAIS CURTIDA É O PRÓXIMO VÍDEO</div>
          </div>
        </div>
      )}
      <Captions t={t} hidden={false} words={WORDS} y={1545} />
      {t > 9.6 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - 9.6) / 0.4)})` }} />}

      {/* áudio */}
      <Sequence from={Math.round(V1.at * FPS)} durationInFrames={Math.round(V1.dur * FPS)} layout="none">
        <Audio src={staticFile('audio/v07_voz.mp3')} startFrom={Math.round(V1.src * FPS)} volume={(f) => clamp((V1.dur * FPS - f) / 3)} />
      </Sequence>
      <Sequence from={Math.round(V2.at * FPS)} durationInFrames={Math.round(V2.dur * FPS)} layout="none">
        <Audio src={staticFile('audio/v07_voz.mp3')} startFrom={Math.round(V2.src * FPS)} volume={(f) => clamp(f / 2) * clamp((V2.dur * FPS - f) / 3)} />
      </Sequence>
      <Audio src={staticFile('audio/v07_musica.mp3')} volume={(f) => kf(f / FPS, [[0, 0.7], [9.2, 0.7], [10, 0]])} />
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={Math.round(2 * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
