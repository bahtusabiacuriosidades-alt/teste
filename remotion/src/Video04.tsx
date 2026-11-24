import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import './fonts';
import { FPS, MUST, kf, clamp, pop, makeVoice, Word } from './lib';
import { Lauro, LauroDefs } from './chars/Lauro';
import { CuscoSit, CuscoDefs } from './chars/Others';
import { Confetti } from './scenes/Mate';
import { BLUE, BLACK, OldBall, StageMatch, StageCandido, StageCalendar, StageJersey, StageWorld, Scoreboard, StagePitch7 } from './scenes/Gremio';
import { HUD, BigText, Captions } from './ui/Overlays';
import rms04 from './data/v04/rms.json';
import words04 from './data/v04/words.json';

/* #004 (curto, vertical) — A história do Grêmio */
export const DURATION_04 = 80.7;
const talk = makeVoice(rms04 as number[]);
const WORDS04 = words04 as Word[];
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';

const Place: React.FC<{ x: number; y: number; s: number; children: React.ReactNode }> = ({ x, y, s, children }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>{children}</g>
);
const jump = (t: number, at: number, dur: number, h: number) => (t > at && t < at + dur ? Math.sin((Math.PI * (t - at)) / dur) * h : 0);

export const StripesBG: React.FC<{ t: number; dark?: number }> = ({ t, dark = 0.55 }) => (
  <g>
    <rect width={1080} height={1920} fill={BLUE} />
    {Array.from({ length: 14 }).map((_, i) => (
      <rect key={i} x={-200 + i * 110 + ((t * 20) % 110)} y={-100} width={40} height={2200} fill={i % 2 ? BLACK : '#F4F4F4'} opacity={0.35} transform="rotate(12 540 960)" />
    ))}
    <rect width={1080} height={1920} fill={`rgba(8,18,30,${dark})`} />
  </g>
);

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <g transform="translate(540,935) scale(0.95)">{children}</g>
);

type Scene = { a: number; b: number; draw: (t: number, lt: number) => React.ReactNode };
const SCENES: Scene[] = [
  { a: 0, b: 4.1, draw: (t, lt) => (
    <>
      <StripesBG t={t} />
      <g transform={`translate(540,${800 + jump(lt, 0, 0.5, -40)}) scale(1.7)`}><OldBall t={t} deflate={clamp((t - 2.9) / 0.6)} burst={clamp((t - 2.9) / 0.8)} /></g>
      <Place x={540} y={1920} s={0.5}><Lauro t={t} talk={talk(t)} expr="shock" scarf hop={jump(t, 2.95, 0.35, 90)} /></Place>
    </>
  ) },
  { a: 4.1, b: 12.9, draw: (t) => (<><StripesBG t={t} /><Stage><StageMatch t={t} burstT={12.0} /></Stage></>) },
  { a: 12.9, b: 18.6, draw: (t, lt) => (<><StripesBG t={t} /><Stage><StageCandido t={t} lt={lt} /></Stage></>) },
  { a: 18.6, b: 25.9, draw: (t) => (<><StripesBG t={t} /><Stage><StageCalendar t={t} stampT={23.6} /></Stage></>) },
  { a: 25.9, b: 34.5, draw: (t) => (<><StripesBG t={t} /><Stage><StageJersey t={t} morph={0} /></Stage></>) },
  { a: 34.5, b: 40.4, draw: (t) => (<><StripesBG t={t} /><Stage><StageJersey t={t} morph={kf(t, [[34.8, 0], [36.2, 1]])} labels={false} /></Stage></>) },
  { a: 40.4, b: 48.5, draw: (t) => (<><StripesBG t={t} /><Stage><StageWorld t={t} prog={kf(t, [[42.1, 0], [45.3, 1]])} germany={pop(t, 47.9)} /></Stage></>) },
  { a: 48.5, b: 51.9, draw: (t) => (
    <><StripesBG t={t} /><Stage><Scoreboard t={t} at={48.8} home="GRÊMIO" away="HAMBURGO" hs={2} as={1} label="⚽⚽ RENATO" awayC="#2A2A2A" /></Stage><Confetti t={t} start={49.4} /></>
  ) },
  { a: 51.9, b: 59.9, draw: (t) => (
    <><StripesBG t={t} /><Stage><Scoreboard t={t} at={56.0} home="GRÊMIO" away="INTER" hs={10} as={0} label="1º GRE-NAL · 1909" sepia awayC="#C62828" /></Stage></>
  ) },
  { a: 59.9, b: 67.6, draw: (t) => (<><StripesBG t={t} /><Stage><StagePitch7 t={t} saveT={63.4} goalT={65.3} /></Stage></>) },
  { a: 67.6, b: 71.4, draw: (t, lt) => (
    <>
      <StripesBG t={t} dark={0.25} />
      <Place x={540} y={1860} s={0.6}><Lauro t={t} talk={talk(t)} expr="delight" scarf cuiaRaise={kf(lt, [[0, 0], [0.5, 1]])} hop={jump(t, 69.0, 0.4, 100)} /></Place>
      <Confetti t={t} start={69.1} />
    </>
  ) },
  { a: 71.4, b: 80.8, draw: (t) => (
    <>
      <StripesBG t={t} dark={0.35} />
      <Place x={420} y={1860} s={0.56}><Lauro t={t} talk={talk(t)} expr={t > 74.6 ? 'wink' : 'smile'} scarf arm="pointDown" armWobble={Math.sin(t * 7) * 6} /></Place>
      <g transform={`translate(840,1860) scale(0.72)`}><CuscoSit t={t} chew={false} tiltHead={t > 74.6 ? 18 : -10} /></g>
      {t > 74.6 && (
        <g transform={`translate(${kf(t, [[74.6, 1250], [75.2, 980]])},1620) rotate(-20)`}>
          <rect x={-40} y={-120} width={80} height={240} rx={10} fill="#C62828" />
          {[-60, 0, 60].map((y) => <rect key={y} x={-40} y={y - 6} width={80} height={12} fill="#fff" />)}
        </g>
      )}
    </>
  ) },
];
const CUTS = SCENES.map((s) => s.a).filter((a) => a > 0);

const Chip: React.FC<{ t: number; a: number; b: number; text: string; kind?: 'bad' | 'good' | 'warn' | 'info'; y?: number }> = ({ t, a, b, text, kind = 'info', y = 300 }) => {
  if (t < a || t > b) return null;
  const bg = { bad: '#C62828', good: '#2E7D32', warn: MUST, info: 'rgba(20,16,12,.9)' }[kind];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: clamp((b - t) / 0.15) }}>
      <div style={{ transform: `scale(${pop(t, a)})`, background: bg, color: kind === 'warn' ? '#1E1B18' : '#fff', borderRadius: 40, padding: '14px 30px', fontFamily: FONT, fontWeight: 900, fontSize: text.length > 26 ? 36 : 44, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(0,0,0,.35)', border: '4px solid rgba(255,255,255,.85)' }}>{text}</div>
    </div>
  );
};

const SFX: [string, number, number][] = [
  ['plim', 0.0, 0.3], ['scratch', 2.95, 0.3], ['whoosh', 3.0, 0.25],
  ...CUTS.map((c) => ['whoosh', c - 0.12, 0.2] as [string, number, number]),
  ['erro', 12.0, 0.25], ['pop', 14.6, 0.3], ['carimbo', 23.6, 0.45], ['pop', 33.3, 0.3],
  ['boing', 34.9, 0.3], ['ding', 39.6, 0.25], ['whoosh', 42.1, 0.3], ['ding', 47.9, 0.3],
  ['aplauso', 49.0, 0.35], ['pop', 49.4, 0.3], ['carimbo', 56.0, 0.4],
  ['acerto', 63.4, 0.3], ['aplauso', 65.3, 0.4],
  ['aplauso', 69.1, 0.35], ['latido', 74.8, 0.35],
];

export const Video04: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sc = SCENES.find((s) => t >= s.a && t < s.b) ?? SCENES[SCENES.length - 1];
  const lt = t - sc.a;
  const lastCut = CUTS.filter((c) => c <= t).pop() ?? -1;
  const flash = lastCut > 0 && lastCut !== 48.5 && t - lastCut < 0.1 ? 1 - (t - lastCut) / 0.1 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
        <LauroDefs />
        <CuscoDefs />
        {sc.draw(t, lt)}
      </svg>
      <HUD num="#004" cat="🔵⚫⚪ HISTÓRIA" />
      <BigText t={t} start={0} end={1.5} lines={['BAH, TU', 'SABIA?']} y={380} size={110} />
      <Chip t={t} a={4.2} b={12.9} text="📍 PORTO ALEGRE · 1903" kind="warn" />
      <Chip t={t} a={14.6} b={18.6} text="⚽ CÂNDIDO DIAS" />
      <Chip t={t} a={21.7} b={25.9} text="🎂 15/09/1903" kind="warn" />
      <Chip t={t} a={33.3} b={34.5} text="😱 HAVANA = MARROM" kind="bad" />
      <Chip t={t} a={36.9} b={40.4} text="🇩🇪 HAMBURGO? (UMA VERSÃO)" />
      <Chip t={t} a={42.1} b={48.5} text="🏆 MUNDIAL 1983" kind="warn" />
      <Chip t={t} a={61.3} b={67.6} text="⚔️ BATALHA DOS AFLITOS · 2005" kind="warn" />
      <BigText t={t} start={69.1} end={71.4} lines={['IMORTAL', 'TRICOLOR']} y={420} size={120} color="#fff" />
      <Chip t={t} a={71.5} b={80.8} text="COMENTA TEU MOMENTO 👇" kind="warn" />
      <Chip t={t} a={76.7} b={80.8} text="🔴 INTER: EM BREVE" kind="bad" y={420} />
      <Captions t={t} hidden={t < 0.05} words={WORDS04} y={1440} />
      {flash > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash})` }} />}
      {t > 80.2 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - 80.2) / 0.5)})` }} />}
      <Audio src={staticFile('audio/video04_voz.mp3')} />
      <Audio src={staticFile('audio/video04_musica.mp3')} />
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={Math.round(5 * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
