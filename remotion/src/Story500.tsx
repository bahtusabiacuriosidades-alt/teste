import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import './fonts';
import { FPS, MUST, clamp, easeOut, kf, pop } from './lib';
import { Lauro, LauroDefs } from './chars/Lauro';
import { Pia, PiaDefs } from './chars/Pia';
import { CuscoSit, CuscoDefs } from './chars/Others';
import { GuaibaWorld, ConfettiC } from './scenes/Inter';

/* Story: comemoração dos 500 seguidores (8 s animado + still).
 * Áreas seguras: nada importante nos 250 px de cima nem nos 300 px de baixo. */
export const DURATION_S500 = 8;
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';
const HIT = 2.3; // momento em que o contador chega em 500
const jump = (t: number, at: number, dur: number, h: number) => (t > at && t < at + dur ? Math.sin((Math.PI * (t - at)) / dur) * h : 0);

export const Story500: React.FC<{ still?: boolean }> = ({ still = false }) => {
  const frame = useCurrentFrame();
  const t = still ? 3.7 : frame / FPS;
  const n = Math.round(500 * easeOut(clamp((t - 0.3) / (HIT - 0.3))));
  const punch = t > HIT && t < HIT + 0.35 ? 1 + 0.18 * Math.sin(((t - HIT) / 0.35) * Math.PI) : 1;
  const party = t > HIT;
  const hopL = party ? jump((t - HIT) % 1.1, 0, 0.45, 90) : 0;
  const hopP = party ? jump((t - HIT + 0.3) % 1.0, 0, 0.4, 110) : 0;
  const hopC = party ? jump((t - HIT + 0.6) % 0.9, 0, 0.35, 120) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
        <LauroDefs />
        <PiaDefs />
        <CuscoDefs />
        <defs>
          <linearGradient id="s5gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.1" stopColor="#FFF1A8" />
            <stop offset="0.55" stopColor="#FFC531" />
            <stop offset="1" stopColor="#E07B00" />
          </linearGradient>
          <filter id="s5sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#000" floodOpacity="0.5" /></filter>
        </defs>
        <GuaibaWorld t={t} />
        <rect width={1080} height={1920} fill="rgba(20,8,30,.25)" />
        {/* raios dourados girando atrás do número */}
        <g transform={`translate(540,640) rotate(${t * 12})`} opacity={0.35 + 0.25 * clamp((t - HIT) / 0.3)}>
          {Array.from({ length: 18 }).map((_, i) => (
            <path key={i} d="M0,0 L-60,-1100 L60,-1100 Z" fill="#FFE9A8" transform={`rotate(${i * 20})`} opacity={i % 2 ? 0.5 : 0.25} />
          ))}
        </g>
        {/* número */}
        <g transform={`translate(540,730) scale(${punch * (0.6 + 0.4 * easeOut(clamp(t / 0.4)))}) rotate(-4)`} filter="url(#s5sh)">
          <text x={0} y={0} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={380} fill="#1A0A12" stroke="#1A0A12" strokeWidth={44} strokeLinejoin="round" paintOrder="stroke" letterSpacing={-8}>{n}</text>
          <text x={0} y={0} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={380} fill="url(#s5gold)" stroke="#fff" strokeWidth={12} strokeLinejoin="round" paintOrder="stroke" letterSpacing={-8}>{n}</text>
        </g>
        {/* personagens comemorando */}
        <g transform={`translate(810,${1815 - hopC})`}><g transform="scale(0.46)"><CuscoSit t={t} chew={false} tiltHead={party ? Math.sin(t * 6) * 18 : 0} /></g></g>
        <g transform={`translate(300,1830) scale(0.36)`}>
          <Lauro t={t} talk={party ? 0.6 + 0.4 * Math.abs(Math.sin(t * 7)) : 0.1} expr={party ? 'delight' : 'shock'} arm={party ? 'wave' : 'down'} armWobble={Math.sin(t * 9) * 12} cuiaRaise={party ? 1 : 0} hop={hopL / 0.36} />
        </g>
        <g transform={`translate(630,1830) scale(-0.38,0.38)`}>
          <Pia t={t} talk={party ? 0.7 : 0} expr={party ? 'laugh' : 'shock'} arms={party ? 'cheer' : 'down'} hop={hopP / 0.38} gaze={1} />
        </g>
        {party && <ConfettiC t={t} start={HIT} colors={['#FFC531', '#F4F4F4', '#C8553D', '#2BB3FF', '#6E9A45']} cy={700} />}
        {party && <ConfettiC t={t} start={HIT + 2.5} colors={['#FFC531', '#F4F4F4', '#C8553D', '#2BB3FF', '#6E9A45']} cy={760} />}
      </svg>

      {/* selo */}
      <div style={{ position: 'absolute', top: 270, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(20,16,12,.88)', borderRadius: 14, padding: '10px 22px', fontFamily: FONT, fontWeight: 900, fontSize: 34, color: '#fff' }}>
          <span style={{ color: MUST }}>BAH, TU SABIA?</span> · 🎉 CHEGAMOS!
        </div>
      </div>
      {/* SEGUIDORES + obrigado */}
      <div style={{ position: 'absolute', top: 790, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 900, color: '#fff', WebkitTextStroke: '14px #1A0A12', paintOrder: 'stroke fill', transform: `scale(${pop(t, 0.5, 0.3)}) rotate(-3deg)` }}>
        <div style={{ fontSize: 120 }}>SEGUIDORES!</div>
      </div>
      <div style={{ position: 'absolute', top: 950, left: 60, right: 60, textAlign: 'center', fontFamily: FONT, fontWeight: 900, lineHeight: 1.1, transform: `scale(${pop(t, HIT + 0.2, 0.3)})` }}>
        <div style={{ fontSize: 58, color: MUST, WebkitTextStroke: '10px #1A0A12', paintOrder: 'stroke fill' }}>BAH, MUITO OBRIGADO, TCHÊ! ❤️</div>
        <div style={{ marginTop: 16, display: 'inline-block', background: 'rgba(20,16,12,.85)', borderRadius: 16, padding: '8px 20px', fontSize: 38, color: '#fff', opacity: clamp((t - HIT - 0.6) / 0.3) }}>
          O Lauro, o Piá e o Cusco agradecem 🧉
        </div>
      </div>

      {!still && (
        <>
          <Audio src={staticFile('audio/v05_musica.mp3')} startFrom={Math.round(10 * FPS)} volume={(f) => kf(f / FPS, [[0, 0.5], [7.2, 0.5], [8, 0]])} />
          {Array.from({ length: 10 }).map((_, i) => (
            <Sequence key={i} from={Math.round((0.35 + i * 0.19) * FPS)} durationInFrames={FPS} layout="none"><Audio src={staticFile('sfx/tictac.wav')} volume={0.12} /></Sequence>
          ))}
          <Sequence from={Math.round(HIT * FPS)} durationInFrames={5 * FPS} layout="none"><Audio src={staticFile('sfx/boom.wav')} volume={0.4} /></Sequence>
          <Sequence from={Math.round(HIT * FPS)} durationInFrames={5 * FPS} layout="none"><Audio src={staticFile('sfx/aplauso.wav')} volume={0.45} /></Sequence>
          <Sequence from={Math.round((HIT + 0.5) * FPS)} durationInFrames={2 * FPS} layout="none"><Audio src={staticFile('sfx/latido.wav')} volume={0.3} /></Sequence>
          <Sequence from={0} durationInFrames={2 * FPS} layout="none"><Audio src={staticFile('sfx/riser.wav')} volume={0.25} /></Sequence>
        </>
      )}
    </AbsoluteFill>
  );
};
