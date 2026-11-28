import React from 'react';
import { AbsoluteFill } from 'remotion';
import { DesertoWorld } from './scenes/Deserto';

/** Fundo do #009 (areal no Pampa) em quadro único, para o 3D. */
export const FundoDeserto: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#F7D9A0' }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <DesertoWorld t={0} />
    </svg>
  </AbsoluteFill>
);
