import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import './fonts';
import { FPS, MUST, kf, clamp, pop, easeOut } from './lib';
import { Lauro, LauroDefs } from './chars/Lauro';
import { CuscoSit, CuscoDefs } from './chars/Others';
import { Confetti } from './scenes/Mate';
import { BLUE, BLACK, OldBall, Jersey } from './scenes/Gremio';
import { StripesBG } from './Video04';

/* 10 s teaser: Grêmio won the poll — video coming soon. Text-only, fast cuts. */
export const DURATION_T04 = 10.2;
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';

const Slam: React.FC<{ t: number; at: number; lines: string[]; size: number; y: number; color?: string; rot?: number }> = ({ t, at, lines, size, y, color = '#fff', rot = -4 }) => {
  if (t < at) return null;
  const x = (t - at) / 0.18;
  const s = x < 1 ? 2.4 - 1.4 * easeOut(x) : 1 + Math.sin((t - at) * 6) * 0.015;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', transform: `rotate(${rot}deg) scale(${s})`, opacity: clamp(x * 2), fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.02, color, WebkitTextStroke: `${size * 0.16}px #111`, paintOrder: 'stroke fill', textShadow: '0 12px 28px rgba(0,0,0,.5)' }}>
      {lines.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  );
};

/* poll bars racing, Grêmio wins */
const PollBars: React.FC<{ t: number }> = ({ t }) => {
  // illustrative race only — no real percentages are shown
  const g = kf(t, [[1.2, 0], [1.7, 55], [2.0, 50], [2.4, 88]]);
  const i = kf(t, [[1.2, 0], [1.7, 58], [2.0, 62], [2.4, 52]]);
  const bar = (label: string, v: number, bg: string, y: number, win: boolean) => (
    <div style={{ position: 'absolute', left: 90, right: 90, top: y, height: 150, borderRadius: 28, background: 'rgba(255,255,255,.18)', overflow: 'hidden', border: win && t > 2.4 ? `6px solid ${MUST}` : '6px solid rgba(255,255,255,.6)' }}>
      <div style={{ width: `${v}%`, height: '100%', background: bg }} />
      <div style={{ position: 'absolute', left: 30, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 64, color: '#fff', WebkitTextStroke: '8px #111', paintOrder: 'stroke fill' }}>{label}</div>
      {win && t > 2.4 && <div style={{ position: 'absolute', right: 30, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 90, transform: `scale(${pop(t, 2.4)})` }}>🏆</div>}
    </div>
  );
  return (
    <>
      {bar('🔵 GRÊMIO', g, `repeating-linear-gradient(90deg, ${BLUE} 0 40px, ${BLACK} 40px 60px, #F4F4F4 60px 80px)`, 760, true)}
      {bar('🔴 INTER', i, '#C62828', 960, false)}
    </>
  );
};

const Clue: React.FC<{ t: number; at: number; dur: number; label: string; children: React.ReactNode }> = ({ t, at, dur, label, children }) => {
  if (t < at || t >= at + dur) return null;
  const lt = t - at;
  return (
    <>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
        <g transform={`translate(540,960) scale(${1.1 + lt * 0.25}) rotate(${Math.sin(t * 20) * 2})`}>{children}</g>
        <text x={540} y={1250} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={300} fill="rgba(255,255,255,.12)">?</text>
      </svg>
      <Slam t={t} at={at + 0.05} lines={[label]} size={78} y={1330} color={MUST} rot={-3} />
    </>
  );
};

export const Teaser04: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const shakeX = (t > 2.75 && t < 3.05) ? Math.sin(t * 140) * 14 : 0;
  const flash = [1.0, 2.75, 3.4, 4.1, 4.8, 5.5, 6.3, 8.3].some((c) => t >= c && t < c + 0.08);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', transform: `translateX(${shakeX}px)` }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
        <LauroDefs />
        <CuscoDefs />
        <StripesBG t={t * 4} dark={t < 1 ? 0.75 : t < 3.4 ? 0.45 : t < 6.3 ? 0.82 : 0.4} />
        {/* Lauro celebrates the win */}
        {t >= 2.75 && t < 3.4 && (
          <g transform={`translate(540,${1980 - Math.abs(Math.sin((t - 2.75) * 9)) * 80}) scale(0.5)`}>
            <Lauro t={t} talk={0.6} expr="delight" scarf cuiaRaise={1} arm="wave" armWobble={Math.sin(t * 20) * 25} />
          </g>
        )}
        {/* Lauro + Cusco: curiosity */}
        {t >= 6.3 && (
          <>
            <g transform="translate(400,1900) scale(0.5)"><Lauro t={t} talk={0} expr={t > 8.3 ? 'wink' : 'squint'} scarf arm={t > 8.3 ? 'pointDown' : 'down'} tilt={-4} /></g>
            <g transform="translate(800,1880) scale(0.66)"><CuscoSit t={t} chew={false} tiltHead={Math.sin(t * 5) > 0 ? 20 : -20} /></g>
          </>
        )}
        <Confetti t={t} start={2.78} />
      </svg>

      {/* 0–1: brand slam */}
      {t < 1.0 && <Slam t={t} at={0.05} lines={['BAH, TU', 'SABIA?']} size={150} y={720} color={MUST} />}
      {/* 1–2.4: poll */}
      {t >= 1.0 && t < 2.75 && (
        <>
          <Slam t={t} at={1.0} lines={['A VOTAÇÃO', 'ACABOU…']} size={96} y={360} rot={-3} />
          <PollBars t={t} />
        </>
      )}
      {t >= 2.75 && t < 3.4 && <Slam t={t} at={2.75} lines={['GRÊMIO', 'VENCEU! 🏆']} size={140} y={560} color="#fff" rot={-6} />}

      {/* 3.4–6.3: mysterious clues */}
      <Clue t={t} at={3.4} dur={0.7} label="UMA BOLA FURADA? 🤔">
        <g transform="scale(1.6)"><OldBall t={t} deflate={clamp((t - 3.6) / 0.4)} /></g>
      </Clue>
      <Clue t={t} at={4.1} dur={0.7} label="UMA CAMISA… MARROM? 😱">
        <g transform="scale(0.9)"><Jersey morph={0} /></g>
      </Clue>
      <Clue t={t} at={4.8} dur={0.7} label="7 CONTRA 10? ⚔️">
        <g>
          {Array.from({ length: 7 }).map((_, i) => <circle key={i} cx={-300 + i * 100} cy={-80} r={40} fill={BLUE} stroke={BLACK} strokeWidth={8} />)}
          {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={-405 + i * 90} cy={100} r={34} fill="#C62828" stroke="#fff" strokeWidth={6} />)}
        </g>
      </Clue>
      <Clue t={t} at={5.5} dur={0.8} label="10 × ? 👀">
        <g fontFamily="Montserrat" fontWeight={900} textAnchor="middle">
          <rect x={-380} y={-170} width={760} height={340} rx={30} fill="#3F352A" stroke={MUST} strokeWidth={10} />
          <text x={-170} y={80} fontSize={230} fill={MUST}>10</text>
          <text x={0} y={60} fontSize={110} fill="#fff">×</text>
          <text x={170} y={80} fontSize={230} fill="#fff" opacity={0.5 + 0.5 * Math.abs(Math.sin(t * 10))}>?</text>
        </g>
      </Clue>

      {/* 6.3–10: hook + soon */}
      {t >= 6.3 && t < 8.3 && <Slam t={t} at={6.3} lines={['A HISTÓRIA QUE', 'POUCA GENTE', 'CONHECE…']} size={92} y={380} rot={-3} />}
      {t >= 8.3 && (
        <>
          <Slam t={t} at={8.3} lines={['VÍDEO NOVO', 'EM BREVE']} size={120} y={360} color={MUST} rot={-4} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center' }}>
            <div style={{ transform: `scale(${pop(t, 8.6) * (1 + Math.sin(t * 12) * 0.04)})`, background: '#fff', color: '#111', borderRadius: 40, padding: '16px 34px', fontFamily: FONT, fontWeight: 900, fontSize: 48, boxShadow: '0 10px 26px rgba(0,0,0,.4)' }}>🔔 SEGUE PRA NÃO PERDER</div>
          </div>
        </>
      )}

      {/* brand tag */}
      <div style={{ position: 'absolute', left: 48, top: 150, background: 'rgba(20,16,12,.85)', borderRadius: 14, padding: '10px 22px', fontFamily: FONT, fontWeight: 900, fontSize: 32, color: '#fff' }}>
        <span style={{ color: MUST }}>BAH, TU SABIA?</span> · 🗳️ RESULTADO
      </div>

      {flash && <AbsoluteFill style={{ backgroundColor: 'rgba(255,255,255,.85)' }} />}
      {t > 9.75 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - 9.75) / 0.45)})` }} />}

      <Audio src={staticFile('audio/teaser04_musica.mp3')} />
      {([
        ['boom', 0.05, 0.6], ['whoosh', 0.95, 0.35], ['tictac', 1.1, 0.35], ['riser', 1.25, 0.4],
        ['ding', 2.4, 0.4], ['boom', 2.75, 0.7], ['aplauso', 2.78, 0.45], ['pop', 2.8, 0.4],
        ['whoosh', 3.35, 0.35], ['bolafura', 3.55, 0.45], ['whoosh', 4.05, 0.35], ['erro', 4.2, 0.3],
        ['whoosh', 4.75, 0.35], ['boom', 4.85, 0.4], ['whoosh', 5.45, 0.35], ['tictac', 5.6, 0.35],
        ['riser', 5.2, 0.35], ['boom', 6.3, 0.6], ['latido', 7.3, 0.35], ['boom', 8.3, 0.6], ['ding', 8.6, 0.35],
      ] as [string, number, number][]).map(([n, at, v], i) => (
        <Sequence key={i} from={Math.round(at * FPS)} durationInFrames={Math.round(3 * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
