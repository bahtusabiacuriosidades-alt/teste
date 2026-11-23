import React from 'react';
import { AbsoluteFill } from 'remotion';
import './fonts';
import { MUST } from './lib';
import { Lauro, LauroDefs } from './chars/Lauro';
import { CuscoSit, CuscoDefs } from './chars/Others';
import { TownBG } from './scenes/Tupa';

/** Instagram/TikTok story teaser for video #002 (still image, 1080x1920).
 *  Safe zones: nothing important in the top ~250px or bottom ~300px. */
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';

export const Story02: React.FC<{ placeholder?: boolean }> = ({ placeholder = true }) => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
      <LauroDefs />
      <CuscoDefs />
      <g transform="translate(540,1300) scale(1.15) translate(-540,-1300)">
        <TownBG t={2.3} storm={1} roofs={0} />
      </g>
      <rect width={1080} height={1920} fill="url(#storyFade)" />
      <defs>
        <linearGradient id="storyFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(10,12,18,.85)" />
          <stop offset="0.45" stopColor="rgba(10,12,18,.35)" />
          <stop offset="1" stopColor="rgba(10,12,18,.75)" />
        </linearGradient>
      </defs>
      <g transform="translate(330,1975) scale(0.4)"><Lauro t={1.1} talk={0} expr="sad" arm="hold" /></g>
      <g transform="translate(760,1930) scale(0.6)"><CuscoSit t={0.4} chew={false} tiltHead={-8} /></g>
    </svg>

    {/* top tag */}
    <div style={{ position: 'absolute', top: 270, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(20,16,12,.85)', borderRadius: 14, padding: '10px 22px', fontFamily: FONT, fontWeight: 900, fontSize: 32, color: '#fff' }}>
        <span style={{ color: MUST }}>BAH, TU SABIA?</span> · #002 · 🤝 SOLIDARIEDADE
      </div>
    </div>

    {/* headline */}
    <div style={{ position: 'absolute', top: 370, left: 60, right: 60, textAlign: 'center', fontFamily: FONT, fontWeight: 900, lineHeight: 1.05 }}>
      <div style={{ fontSize: 86, color: '#fff', WebkitTextStroke: '14px #111', paintOrder: 'stroke fill' }}>TU QUER AJUDAR</div>
      <div style={{ fontSize: 110, color: MUST, WebkitTextStroke: '16px #111', paintOrder: 'stroke fill' }}>TUPANCIRETÃ?</div>
    </div>

    {/* hook */}
    <div style={{ position: 'absolute', top: 650, left: 80, right: 80, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: '#C62828', color: '#fff', borderRadius: 26, padding: '22px 30px', fontFamily: FONT, fontWeight: 900, fontSize: 50, textAlign: 'center', border: '5px solid #fff', boxShadow: '0 12px 30px rgba(0,0,0,.45)', transform: 'rotate(-2deg)' }}>
        ⚠️ Um Pix errado pode cair<br />na mão de golpista
      </div>
    </div>

    <div style={{ position: 'absolute', top: 880, left: 80, right: 80, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 46, color: '#fff', WebkitTextStroke: '10px #111', paintOrder: 'stroke fill', lineHeight: 1.2 }}>
      O que doar, onde entregar<br />e como não cair em golpe
    </div>

    {/* link sticker area */}
    <div style={{ position: 'absolute', top: 1000, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontFamily: FONT }}>
      <div style={{ background: MUST, color: '#1E1B18', borderRadius: 40, padding: '16px 36px', fontWeight: 900, fontSize: 44, boxShadow: '0 10px 26px rgba(0,0,0,.4)' }}>
        ▶️ VÍDEO NOVO NO PERFIL
      </div>
      <div style={{ fontSize: 48 }}>👇</div>
      {placeholder && (
        <div style={{ width: 520, height: 96, borderRadius: 24, border: '5px dashed rgba(255,255,255,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.8)', fontWeight: 800, fontSize: 30 }}>
          cole o adesivo de link aqui
        </div>
      )}
    </div>
  </AbsoluteFill>
);
