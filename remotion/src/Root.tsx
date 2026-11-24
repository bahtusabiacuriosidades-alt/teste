import React from 'react';
import { Composition, Still } from 'remotion';
import { Video01, DURATION_S } from './Video01';
import { Video02, DURATION_02 } from './Video02';
import { Video03, DURATION_03 } from './Video03';
import { FPS } from './lib';
import { Story02 } from './Story02';
import { StoryGrenal } from './StoryGrenal';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Video01" component={Video01} durationInFrames={Math.round(DURATION_S * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="Video02" component={Video02} durationInFrames={Math.round(DURATION_02 * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="Video03" component={Video03} durationInFrames={Math.round(DURATION_03 * FPS)} fps={FPS} width={1080} height={1920} />
    <Still id="Story02" component={Story02} width={1080} height={1920} />
    <Still id="Story02Limpo" component={Story02} width={1080} height={1920} defaultProps={{ placeholder: false }} />
    <Still id="StoryGrenal" component={StoryGrenal} width={1080} height={1920} />
    <Still id="StoryGrenalLimpo" component={StoryGrenal} width={1080} height={1920} defaultProps={{ placeholder: false }} />
  </>
);
