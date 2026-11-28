import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';

// Real photo sent by the user. Replace PHOTO_CREDIT with the author/source before publishing.
const PHOTO_CREDIT = 'Foto: reprodução';
import './fonts';
import { FPS, MUST, kf, clamp, pop, makeVoice, Word } from './lib';
import { Lauro, LauroDefs } from './chars/Lauro';
import { CuscoSit, CuscoDefs } from './chars/Others';
import { MapScene } from './scenes/Mate';
import { TownBG, ColetaBG, RoadBG, Shield, PhoneScam, PhotoSlide } from './scenes/Tupa';
import { HUD, BigText, Captions } from './ui/Overlays';
import rms02 from './data/v02/rms.json';
import words02 from './data/v02/words.json';

/* #002 — Como ajudar Tupanciretã do jeito certo (tom sóbrio, sem piadas) */
export const DURATION_02 = 68.6;
const talk = makeVoice(rms02 as number[]);
const WORDS02 = words02 as Word[];
const FONT = 'Montserrat, "Noto Color Emoji", sans-serif';

const Place: React.FC<{ x: number; y: number; s: number; children: React.ReactNode }> = ({ x, y, s, children }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>{children}</g>
);
const Cam: React.FC<{ z?: number; cx?: number; cy?: number; children: React.ReactNode }> = ({ z = 1, cx = 540, cy = 1000, children }) => (
  <g transform={`translate(${cx},${cy}) scale(${z}) translate(${-cx},${-cy})`}>{children}</g>
);
const Dim: React.FC<{ a?: number }> = ({ a = 0.5 }) => <rect width={1080} height={1920} fill={`rgba(15,18,24,${a})`} />;

const Duo: React.FC<{ t: number; expr: React.ComponentProps<typeof Lauro>['expr']; arm?: React.ComponentProps<typeof Lauro>['arm']; paw?: number; x?: number; s?: number }> = ({ t, expr, arm = 'down', paw = 0, x = 430, s = 0.56 }) => (
  <>
    <Place x={x} y={1840} s={s}><Lauro t={t} talk={talk(t)} expr={expr} arm={arm} /></Place>
    <g transform={`translate(${x + 380},1850) scale(0.8)`}><CuscoSit t={t} chew={false} paw={paw} tiltHead={Math.sin(t * 1.5) * 6} /></g>
  </>
);

type Scene = { a: number; b: number; draw: (t: number, lt: number) => React.ReactNode };
const SCENES: Scene[] = [
  // 1 — hook (cloudy)
  { a: 0, b: 6.2, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1.0], [6.2, 1.06]])} cy={1300}>
      <TownBG t={t} storm={0.75} roofs={0.2} />
      <Duo t={t} expr="sad" />
    </Cam>
  ) },
  // 2a — where: map pin
  { a: 6.2, b: 8.4, draw: (t) => (
    <Cam z={kf(t, [[6.2, 1.1], [8.4, 1.35]])} cx={500} cy={930}>
      <MapScene t={t} guaranis={0} reducoes={0} ruins={0} pin={pop(t, 6.4)} zoom={1} pinX={270} pinY={240} neighbours={false} />
    </Cam>
  ) },
  // 2b — the storm, houses without roofs (illustration)
  { a: 8.4, b: 9.9, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1.5], [1.5, 1.4]])} cy={1250}>
      <TownBG t={t} storm={1} roofs={0} />
    </Cam>
  ) },
  // 2c — real photo of the damage
  { a: 9.9, b: 11.95, draw: (t, lt) => (
    <PhotoSlide src={staticFile('img/tupa_01.png')} lt={lt} dur={2.05} credit={PHOTO_CREDIT} w={1080} h={938} />
  ) },
  // 3 — three things
  { a: 11.95, b: 15.55, draw: (t) => (
    <>
      <TownBG t={t} storm={0.6} roofs={0.2} />
      <Dim a={0.35} />
      <Duo t={t} expr="talk" />
    </>
  ) },
  // 4 — what to donate
  { a: 15.55, b: 25.15, draw: (t) => (<><TownBG t={t} storm={0.5} roofs={0.25} /><Dim a={0.6} /></>) },
  // 5 — where to deliver
  { a: 25.15, b: 32.35, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1.0], [7, 1.06]])} cy={1100}>
      <ColetaBG t={t} />
    </Cam>
  ) },
  // 6 — don't travel there, keep roads free
  { a: 32.35, b: 37.9, draw: (t, lt) => (
    <RoadBG t={t} truckX={kf(lt, [[0, -400], [5.5, 1400]])} />
  ) },
  // 7 — beware of scams
  { a: 37.9, b: 41.6, draw: (t) => (
    <>
      <TownBG t={t} storm={0.5} roofs={0.3} /><Dim a={0.65} />
      <g transform={`translate(540,1000) rotate(${Math.sin(t * 3) * 3})`}><Shield s={pop(t, 38.0, 0.35)} /></g>
    </>
  ) },
  // 8 — official channels vs unknown profiles
  { a: 41.6, b: 53.2, draw: (t) => (
    <>
      <TownBG t={t} storm={0.4} roofs={0.35} /><Dim a={0.7} />
      {t > 48.2 && (
        <g transform={`translate(540,1060) scale(${pop(t, 48.2, 0.3) * 0.95})`}>
          <PhoneScam cross={clamp((t - 49.6) / 0.35)} />
        </g>
      )}
    </>
  ) },
  // 9 — gaúcho é assim (sky clears, roofs come back)
  { a: 53.2, b: 57.55, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1.08], [4.3, 1.0]])} cy={1300}>
      <TownBG t={t} storm={kf(lt, [[0, 0.5], [3.0, 0]])} roofs={kf(lt, [[0.6, 0.3], [3.6, 1]])} sunset={1} />
      <Duo t={t} expr="smile" />
    </Cam>
  ) },
  // 10 — thank you (hand on chest, Cusco gives the paw)
  { a: 57.55, b: 62.7, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1.0], [5, 1.08]])} cy={1350}>
      <TownBG t={t} storm={0} roofs={1} sunset={1} />
      <Duo t={t} expr={lt > 1.2 ? 'smile' : 'sad'} arm="hold" paw={kf(t, [[60.8, 0], [61.3, 1]])} />
    </Cam>
  ) },
  // 11 — share
  { a: 62.7, b: 68.7, draw: (t) => (
    <Cam z={1.08} cy={1350}>
      <TownBG t={t} storm={0} roofs={1} sunset={1} />
      <Duo t={t} expr="smile" arm="pointDown" />
    </Cam>
  ) },
];
const CUTS = SCENES.map((s) => s.a).filter((a) => a > 0);

/* ---------------- overlays ---------------- */
const Chip: React.FC<{ t: number; a: number; b: number; text: string; kind: 'bad' | 'good' | 'warn' | 'info'; y?: number; fs?: number }> = ({ t, a, b, text, kind, y = 430, fs }) => {
  if (t < a || t > b) return null;
  const bg = { bad: '#C62828', good: '#2E7D32', warn: MUST, info: 'rgba(20,16,12,.9)' }[kind];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: clamp((b - t) / 0.2) }}>
      <div style={{ transform: `scale(${pop(t, a)})`, background: bg, color: kind === 'warn' ? '#1E1B18' : '#fff', borderRadius: 40, padding: '16px 30px', fontFamily: FONT, fontWeight: 900, fontSize: fs ?? (text.length > 28 ? 36 : 44), whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(0,0,0,.35)', border: '4px solid rgba(255,255,255,.85)' }}>{text}</div>
    </div>
  );
};

const Card: React.FC<{ t: number; at: number; emoji: string; label: string; w?: number }> = ({ t, at, emoji, label, w = 290 }) => (
  <div style={{ width: w, height: 250, transform: `scale(${pop(t, at)})`, opacity: t >= at ? 1 : 0, background: 'rgba(255,255,255,.95)', borderRadius: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,.3)', fontFamily: FONT }}>
    <div style={{ fontSize: 110, lineHeight: 1 }}>{emoji}</div>
    <div style={{ marginTop: 14, fontWeight: 900, fontSize: 32, color: '#1E1B18', textAlign: 'center' }}>{label}</div>
  </div>
);

const ITEMS: [number, string, string][] = [
  [17.52, '💧', 'ÁGUA POTÁVEL'], [18.54, '🥫', 'COMIDA'], [19.92, '⛺', 'LONA'],
  [20.5, '🏠', 'TELHA'], [21.06, '🛏️', 'COLCHÃO'], [21.72, '🧣', 'COBERTOR'],
  [22.54, '👕', 'ROUPA'], [23.8, '🧼', 'HIGIENE'], [24.3, '🧹', 'LIMPEZA'],
];

const Three: React.FC<{ t: number }> = ({ t }) => {
  if (t < 12.3 || t > 15.55) return null;
  const rows: [number, string, string][] = [[12.4, '1', 'O QUE DOAR'], [13.0, '2', 'ONDE ENTREGAR'], [13.6, '3', 'CUIDADO COM GOLPE']];
  return (
    <div style={{ position: 'absolute', left: 90, right: 90, top: 380, display: 'flex', flexDirection: 'column', gap: 26 }}>
      {rows.map(([at, n, txt]) => (
        <div key={n} style={{ transform: `scale(${pop(t, at)})`, opacity: t >= at ? 1 : 0, display: 'flex', alignItems: 'center', gap: 24, background: 'rgba(20,16,12,.88)', borderRadius: 24, padding: '18px 26px', border: `4px solid ${MUST}`, fontFamily: FONT }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: MUST, color: '#1E1B18', fontWeight: 900, fontSize: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</div>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 50 }}>{txt}</div>
        </div>
      ))}
    </div>
  );
};

const Columns: React.FC<{ t: number }> = ({ t }) => {
  if (t < 41.6 || t > 48.2) return null;
  const ok: [number, string][] = [[43.7, '🏛️ Prefeitura de Tupanciretã'], [45.38, '🏢 Governo do Estado'], [46.8, '🤝 Entidade conhecida']];
  return (
    <div style={{ position: 'absolute', left: 70, right: 70, top: 600, fontFamily: FONT }}>
      <div style={{ transform: `scale(${pop(t, 41.7)})`, background: '#2E7D32', color: '#fff', borderRadius: 24, padding: '20px 26px', fontWeight: 900, fontSize: 50, textAlign: 'center', border: '4px solid #fff' }}>✅ PIX SÓ EM CANAL OFICIAL</div>
      {ok.map(([at, txt]) => (
        <div key={txt} style={{ marginTop: 22, transform: `scale(${pop(t, at)})`, opacity: t >= at ? 1 : 0, background: 'rgba(255,255,255,.95)', borderRadius: 20, padding: '18px 26px', fontWeight: 900, fontSize: 42, color: '#1E1B18' }}>{txt}</div>
      ))}
    </div>
  );
};

const SFX: [string, number, number][] = [
  ['vento', 0.2, 0.2], ['chuva', 8.3, 0.25], ['vento', 8.4, 0.3],
  ...CUTS.map((c) => ['whoosh', c - 0.12, 0.12] as [string, number, number]),
  ['sino', 6.4, 0.18],
  ['ding', 12.4, 0.14], ['ding', 13.0, 0.14], ['ding', 13.6, 0.14],
  ...[17.52, 18.54, 19.92, 20.5, 21.06, 21.72, 22.54, 23.8, 24.3].map((a) => ['pop', a, 0.16] as [string, number, number]),
  ['ding', 29.48, 0.12], ['ding', 30.32, 0.12], ['ding', 31.0, 0.12],
  ['caminhao', 32.5, 0.3],
  ['erro', 38.0, 0.18],
  ['acerto', 41.7, 0.16], ['erro', 49.6, 0.18],
  ['sino', 53.3, 0.2], ['sino', 58.9, 0.22],
];

export const Video02: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sc = SCENES.find((s) => t >= s.a && t < s.b) ?? SCENES[SCENES.length - 1];
  const lt = t - sc.a;
  const lastCut = CUTS.filter((c) => c <= t).pop() ?? -1;
  const fade = lastCut > 0 && t - lastCut < 0.25 ? 1 - (t - lastCut) / 0.25 : 0; // soft dip-to-black between scenes

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
        <LauroDefs />
        <CuscoDefs />
        {sc.draw(t, lt)}
      </svg>

      <HUD num="#002" cat="🤝 SOLIDARIEDADE" />
      <Chip t={t} a={6.4} b={8.4} text="📍 TUPANCIRETÃ · RS" kind="warn" y={330} />
      <Chip t={t} a={9.0} b={11.95} text="MILHARES DE FAMÍLIAS SEM TELHADO" kind="info" y={330} />
      <Three t={t} />
      <Chip t={t} a={15.6} b={25.15} text="1 · O QUE DOAR" kind="warn" y={300} />
      {t >= 15.55 && t < 25.15 && (
        <div style={{ position: 'absolute', left: 40, right: 40, top: 440, display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
          {ITEMS.map(([at, e, l]) => <Card key={l} t={t} at={at} emoji={e} label={l} />)}
        </div>
      )}
      <Chip t={t} a={25.2} b={32.35} text="2 · ONDE ENTREGAR" kind="warn" y={300} />
      <Chip t={t} a={29.48} b={32.35} text="🏛️ PREFEITURA · 🏫 ESCOLA · 🤝 ENTIDADE" kind="info" y={430} />
      <Chip t={t} a={32.45} b={37.9} text="🚫 NÃO VÁ ATÉ A CIDADE" kind="bad" y={330} />
      <Chip t={t} a={35.1} b={37.9} text="🚑 DEIXA AS ESTRADAS LIVRES" kind="good" y={450} />
      <Chip t={t} a={38.0} b={41.6} text="3 · ⚠️ CUIDADO COM GOLPE" kind="bad" y={330} fs={50} />
      <Columns t={t} />
      <Chip t={t} a={48.3} b={51.5} text="❌ PIX DE PERFIL DESCONHECIDO" kind="bad" y={330} />
      <Chip t={t} a={51.55} b={53.2} text="👇 CANAIS OFICIAIS NA DESCRIÇÃO" kind="warn" y={330} />
      <BigText t={t} start={53.3} end={57.55} lines={['QUANDO UM CAI,', 'O RESTO LEVANTA JUNTO']} y={360} size={66} color="#fff" rot={0} />
      <BigText t={t} start={58.9} end={62.7} lines={['OBRIGADO,', 'TCHÊ ❤️']} y={340} size={110} rot={-2} />
      <Chip t={t} a={62.8} b={68.7} text="COMPARTILHA ❤️ INFORMAÇÃO CERTA AJUDA" kind="warn" y={360} />
      <Captions t={t} hidden={t < 0.05} words={WORDS02} />

      {fade > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${fade * 0.6})` }} />}
      {t > 68.0 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - 68.0) / 0.55)})` }} />}

      <Audio src={staticFile('audio/video02_voz.mp3')} />
      <Audio src={staticFile('audio/video02_musica.mp3')} />
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={Math.round(6 * FPS)} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
