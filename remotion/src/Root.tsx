import React from 'react';
import { Composition } from 'remotion';
import { Video01, DURATION_S } from './Video01';
import { FPS } from './lib';

export const RemotionRoot: React.FC = () => (
  <Composition id="Video01" component={Video01} durationInFrames={Math.round(DURATION_S * FPS)} fps={FPS} width={1080} height={1920} />
);
