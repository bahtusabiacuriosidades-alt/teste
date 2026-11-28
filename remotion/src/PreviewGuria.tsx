import React from 'react';
import { AbsoluteFill } from 'remotion';
import './fonts';
import { Lauro, LauroDefs } from './chars/Lauro';
import { Pia, PiaDefs } from './chars/Pia';
import { Guria, GuriaDefs } from './chars/Guria';
import { CuscoSit, CuscoDefs } from './chars/Others';
import { GuaibaWorld } from './scenes/Inter';

/* Prévia da Guria (vestida de prenda) junto com o elenco, para aprovação. */
export const PreviewGuria: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <LauroDefs /><PiaDefs /><GuriaDefs /><CuscoDefs />
      <GuaibaWorld t={2} w={1920} h={1080} />
      <g transform="translate(330,1050) scale(0.5)"><Lauro t={1.2} talk={0.3} expr="smile" arm="pointSide" /></g>
      <g transform="translate(720,1050) scale(-0.5,0.5)"><Guria t={1.0} talk={0.5} expr="talk" arms="down" gaze={1} /></g>
      <g transform="translate(1040,1050) scale(0.5)"><Guria t={2.3} talk={0} expr="smile" arms="skirt" /></g>
      <g transform="translate(1340,1050) scale(0.5)"><Guria t={3.1} talk={0.8} expr="shock" arms="cheer" /></g>
      <g transform="translate(1640,1050) scale(-0.5,0.5)"><Pia t={1.4} talk={0} expr="smug" arms="cross" gaze={1} /></g>
      <g transform="translate(1830,1050) scale(0.42)"><CuscoSit t={0.5} chew={false} tiltHead={14} /></g>
      <text x={960} y={80} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={54} fill="#fff" stroke="#1A0A12" strokeWidth={10} paintOrder="stroke">A GURIA · VESTIDA DE PRENDA</text>
    </svg>
  </AbsoluteFill>
);
