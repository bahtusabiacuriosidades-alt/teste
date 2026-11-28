import React from 'react';
import { AbsoluteFill } from 'remotion';
import './fonts';
import { MUST } from './lib';
import { Lauro, LauroDefs } from './chars/Lauro';
import { CuscoSit, CuscoDefs } from './chars/Others';

/** Story poll: next video — Inter or Grêmio history. Club colors only (no crests/logos).
 *  Safe zones: nothing important in the top ~250px or bottom ~300px. */
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';
const RED = '#D3121C';
const BLUE = '#0D80BF';

export const StoryGrenal: React.FC<{ placeholder?: boolean }> = ({ placeholder = true }) => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <LauroDefs />
      <CuscoDefs />
      <defs>
        <pattern id="stripes" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
          <rect width="60" height="60" fill={BLUE} />
          <rect x="40" width="10" height="60" fill="#111" />
          <rect x="50" width="10" height="60" fill="#fff" />
        </pattern>
        <radialGradient id="vig" cx="50%" cy="50%" r="70%">
          <stop offset="0.6" stopColor="rgba(0,0,0,0)" />
          <stop offset="1" stopColor="rgba(0,0,0,.45)" />
        </radialGradient>
      </defs>
      {/* split: red (left/top) vs blue (right/bottom), diagonal */}
      <rect width={1080} height={1920} fill="url(#stripes)" />
      <polygon points="0,0 1080,0 1080,520 0,1400" fill={RED} />
      <polygon points="0,0 1080,0 1080,520 0,1400" fill="rgba(255,255,255,.06)" />
      <line x1={0} y1={1400} x2={1080} y2={520} stroke="#fff" strokeWidth={18} />
      <line x1={0} y1={1400} x2={1080} y2={520} stroke={MUST} strokeWidth={6} />
      <rect width={1080} height={1920} fill="url(#vig)" />
      {/* Lauro neutral in the middle, Cusco looking up */}
      <g transform="translate(210,2000) scale(0.4)"><Lauro t={0.7} talk={0} expr="squint" arm="wave" armWobble={-10} /></g>
      <g transform="translate(830,1935) scale(0.6)"><CuscoSit t={0.4} chew={false} tiltHead={12} /></g>
    </svg>

    {/* top tag */}
    <div style={{ position: 'absolute', top: 260, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(20,16,12,.88)', borderRadius: 14, padding: '10px 22px', fontFamily: FONT, fontWeight: 900, fontSize: 32, color: '#fff' }}>
        <span style={{ color: MUST }}>BAH, TU SABIA?</span> · 🗳️ TU DECIDE
      </div>
    </div>

    <div style={{ position: 'absolute', top: 350, left: 50, right: 50, textAlign: 'center', fontFamily: FONT, fontWeight: 900, lineHeight: 1.05, color: '#fff', WebkitTextStroke: '12px #111', paintOrder: 'stroke fill' }}>
      <div style={{ fontSize: 64 }}>QUAL HISTÓRIA</div>
      <div style={{ fontSize: 64 }}>TU QUER VER NO</div>
      <div style={{ fontSize: 96, color: MUST, WebkitTextStroke: '16px #111' }}>PRÓXIMO VÍDEO?</div>
    </div>

    {/* team labels on each side of the diagonal */}
    <div style={{ position: 'absolute', top: 700, left: 70, transform: 'rotate(-8deg)', fontFamily: FONT, fontWeight: 900, fontSize: 130, color: '#fff', WebkitTextStroke: '16px #6E0A0F', paintOrder: 'stroke fill' }}>
      INTER
    </div>
    <div style={{ position: 'absolute', top: 900, right: 60, transform: 'rotate(-8deg)', fontFamily: FONT, fontWeight: 900, fontSize: 120, color: '#fff', WebkitTextStroke: '16px #05324B', paintOrder: 'stroke fill' }}>
      GRÊMIO
    </div>

    {/* VS badge */}
    <div style={{ position: 'absolute', top: 640, left: 800, width: 140, height: 140, borderRadius: 70, background: MUST, border: '8px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 60, color: '#1E1B18', boxShadow: '0 10px 30px rgba(0,0,0,.5)', transform: 'rotate(-8deg)' }}>
      VS
    </div>

    {/* poll sticker area */}
    <div style={{ position: 'absolute', top: 1090, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontFamily: FONT }}>
      <div style={{ background: 'rgba(20,16,12,.9)', color: '#fff', borderRadius: 40, padding: '14px 30px', fontWeight: 900, fontSize: 38, border: `4px solid ${MUST}` }}>
        VOTA 👇 O MAIS VOTADO VIRA VÍDEO
      </div>
      {placeholder && (
        <div style={{ marginTop: 8, width: 600, height: 150, borderRadius: 26, border: '5px dashed rgba(255,255,255,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.9)', fontWeight: 800, fontSize: 30, background: 'rgba(0,0,0,.2)' }}>
          cole o adesivo de ENQUETE aqui
        </div>
      )}
    </div>
  </AbsoluteFill>
);
