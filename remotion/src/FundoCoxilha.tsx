import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CoxilhaWorld } from './Teste3D';

/** Fundo da coxilha (fim de tarde) em quadro único, para usar atrás dos personagens 3D. */
export const FundoCoxilha: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#F8DCA2' }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <CoxilhaWorld t={0} w={1080} h={1920} />
    </svg>
  </AbsoluteFill>
);
