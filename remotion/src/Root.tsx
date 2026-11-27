import React from 'react';
import { Composition, Still } from 'remotion';
import { Video01, DURATION_S } from './Video01';
import { Video02, DURATION_02 } from './Video02';
import { Video03, DURATION_03 } from './Video03';
import { Video04, DURATION_04 } from './Video04';
import { Video05, DURATION_05 } from './Video05';
import { Video05L, DURATION_05L } from './Video05L';
import { Video06, DURATION_06 } from './Video06';
import { Video06L, DURATION_06L } from './Video06L';
import { Video07, DURATION_07 } from './Video07';
import { Video07L, DURATION_07L } from './Video07L';
import { Video04L, DURATION_04L } from './Video04L';
import { Teaser04, DURATION_T04 } from './Teaser04';
import { FPS } from './lib';
import { Story02 } from './Story02';
import { StoryGrenal } from './StoryGrenal';
import { ThumbGremio, ThumbInter, ThumbFarroupilha, ThumbCaxias } from './Thumbs';
import { Story500, DURATION_S500 } from './Story500';
import { PreviewGuria } from './PreviewGuria';
import { Teste3D, DURATION_T3D } from './Teste3D';
import { FundoCoxilha } from './FundoCoxilha';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Video01" component={Video01} durationInFrames={Math.round(DURATION_S * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="Video02" component={Video02} durationInFrames={Math.round(DURATION_02 * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="Video03" component={Video03} durationInFrames={Math.round(DURATION_03 * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="Video04" component={Video04} durationInFrames={Math.round(DURATION_04 * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="Video04L" component={Video04L} durationInFrames={Math.round(DURATION_04L * FPS)} fps={FPS} width={1920} height={1080} />
    <Composition id="Video05" component={Video05} durationInFrames={Math.round(DURATION_05 * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="Video05L" component={Video05L} durationInFrames={Math.round(DURATION_05L * FPS)} fps={FPS} width={1920} height={1080} />
    <Composition id="Video06" component={Video06} durationInFrames={Math.round(DURATION_06 * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="Video06L" component={Video06L} durationInFrames={Math.round(DURATION_06L * FPS)} fps={FPS} width={1920} height={1080} />
    <Composition id="Video07" component={Video07} durationInFrames={Math.round(DURATION_07 * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="Video07L" component={Video07L} durationInFrames={Math.round(DURATION_07L * FPS)} fps={FPS} width={1920} height={1080} />
    <Still id="FundoCoxilha" component={FundoCoxilha} width={1080} height={1920} />
    <Composition id="Teste3D" component={Teste3D} durationInFrames={Math.round(DURATION_T3D * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="Teaser04" component={Teaser04} durationInFrames={Math.round(DURATION_T04 * FPS)} fps={FPS} width={1080} height={1920} />
    <Still id="Story02" component={Story02} width={1080} height={1920} />
    <Still id="Story02Limpo" component={Story02} width={1080} height={1920} defaultProps={{ placeholder: false }} />
    <Still id="StoryGrenal" component={StoryGrenal} width={1080} height={1920} />
    <Composition id="Story500" component={Story500} durationInFrames={Math.round(DURATION_S500 * FPS)} fps={FPS} width={1080} height={1920} />
    <Still id="Story500Foto" component={Story500} width={1080} height={1920} defaultProps={{ still: true }} />
    <Still id="PreviewGuria" component={PreviewGuria} width={1920} height={1080} />
    <Still id="ThumbGremio" component={ThumbGremio} width={1280} height={720} />
    <Still id="ThumbFarroupilha" component={ThumbFarroupilha} width={1280} height={720} />
    <Still id="ThumbCaxias" component={ThumbCaxias} width={1280} height={720} />
    <Still id="ThumbInter" component={ThumbInter} width={1280} height={720} />
    <Still id="StoryGrenalLimpo" component={StoryGrenal} width={1080} height={1920} defaultProps={{ placeholder: false }} />
  </>
);
