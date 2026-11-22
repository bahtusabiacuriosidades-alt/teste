import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import './fonts';
import { FPS, MUST, kf, easeOut, clamp, lauroTalk, clerkTalk, pop } from './lib';
import { Lauro, LauroDefs } from './chars/Lauro';
import { CuscoRun, CuscoSit, Clerk } from './chars/Others';
import {
  BakeryBG, CounterFG, SPBakeryBG, BasketClose, PartyBG, PartyTableFG, BackyardBG,
  StreetBG, Car, Xis, LancheriaBG, StorefrontBG,
} from './scenes/Backgrounds';
import { HUD, TPill, Tag, BigText, Phrase, Stamp, Captions } from './ui/Overlays';


export const DURATION_S = 89.17;

const Place: React.FC<{ x: number; y: number; s: number; children: React.ReactNode }> = ({ x, y, s, children }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>{children}</g>
);
const Cam: React.FC<{ z?: number; cx?: number; cy?: number; dx?: number; dy?: number; children: React.ReactNode }> = ({ z = 1, cx = 540, cy = 1000, dx = 0, dy = 0, children }) => (
  <g transform={`translate(${dx},${dy}) translate(${cx},${cy}) scale(${z}) translate(${-cx},${-cy})`}>{children}</g>
);
const shake = (t: number, a: number, b: number, amp: number) =>
  t > a && t < b ? { dx: Math.sin(t * 140) * amp * (1 - (t - a) / (b - a)), dy: Math.cos(t * 120) * amp * 0.6 * (1 - (t - a) / (b - a)) } : { dx: 0, dy: 0 };

type Scene = { a: number; b: number; draw: (t: number, lt: number) => React.ReactNode };

const suspense = (t: number, lt: number) => (
  <>
    <Cam z={kf(lt, [[0, 1.85], [3.8, 2.2]])} cy={930}>
      <BakeryBG />
      <Lauro t={t} talk={lauroTalk(t)} expr="squint" />
    </Cam>
    <rect width={1080} height={1920} fill="url(#vig)" />
  </>
);

const SCENES: Scene[] = [
  // 1 — hook
  { a: 0, b: 3.9, draw: (t, lt) => {
    const s = shake(t, 0, 0.3, 12);
    return (
      <Cam z={kf(lt, [[0, 1], [3.9, 1.07]])} {...s}>
        <BakeryBG />
        <Lauro t={t} talk={lauroTalk(t)} expr="shock" browBoost={-10 * (1 - easeOut(lt / 0.3))} />
        <CounterFG />
      </Cam>
    );
  } },
  // 2 — São Paulo clerk
  { a: 3.9, b: 8.6, draw: (t, lt) => {
    const s = shake(t, 6.6, 6.9, 18);
    const punch = t > 7.7 ? 0.1 * (1 - easeOut((t - 7.7) / 0.25)) + 0.04 : 0;
    return (
      <Cam z={1.02 + 0.05 * (lt / 4.7) + punch} {...s}>
        <SPBakeryBG />
        <Clerk t={t} lt={lt} talk={clerkTalk(t)} />
        {[[6.6, 830, 640], [7.7, 230, 560]].map(([tq, x, y]) =>
          t > tq ? (
            <g key={tq} transform={`translate(${x},${y}) scale(${pop(t, tq)}) rotate(${Math.sin(t * 6) * 9})`}>
              <text textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={190} fill="#fff" stroke="#1a1a1a" strokeWidth={16} paintOrder="stroke">?</text>
            </g>
          ) : null,
        )}
      </Cam>
    );
  } },
  // 3a — laugh / intro
  { a: 8.6, b: 13.4, draw: (t, lt) => (
    <Cam z={1.05}>
      <BakeryBG />
      <Lauro t={t} talk={lauroTalk(t)} expr={lt < 1.6 ? 'laugh' : 'talk'} tilt={lt < 1.6 ? -4 + Math.sin(t * 10) * 1.5 : Math.sin(t * 2) * 1} />
      <CounterFG />
    </Cam>
  ) },
  // 3b — "te aprochega"
  { a: 13.4, b: 16.2, draw: (t) => (
    <Cam z={1.12} cy={1100}>
      <BakeryBG />
      <Lauro t={t} talk={lauroTalk(t)} expr="smile" arm="wave" armWobble={Math.sin(t * 10) * 28} />
      <CounterFG />
    </Cam>
  ) },
  // 4 — cacetinho
  { a: 16.2, b: 21.9, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1.05], [5.7, 1.15]])}>
      <BasketClose t={t} lift={kf(lt, [[0.2, 0], [1.4, 1]])} />
    </Cam>
  ) },
  // 5 — negrinho
  { a: 21.9, b: 26.8, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1], [4.9, 1.06]])}>
      <PartyBG />
      <Place x={43} y={200} s={0.92}>
        <Lauro t={t} talk={lauroTalk(t)} expr={lt < 1.2 ? 'delight' : 'smile'} arm="hold" obj="brigadeiro" objLift={kf(lt, [[0, 40], [0.5, -20]])} />
      </Place>
      <PartyTableFG />
    </Cam>
  ) },
  // 6 — bergamota (+ toss at 33.7)
  { a: 26.8, b: 34.7, draw: (t, lt) => {
    const toss = t > 33.7 && t < 34.35 ? -Math.sin((Math.PI * (t - 33.7)) / 0.65) * 300 : 0;
    return (
      <Cam z={t < 31.9 ? 1 : 1.1} cy={900}>
        <BackyardBG />
        <Place x={81} y={330} s={0.85}>
          <Lauro t={t} talk={lauroTalk(t)} expr={t < 31.9 ? 'talk' : 'smile'} arm="hold" obj="bergamota" objLift={toss} browBoost={-14} />
        </Place>
      </Cam>
    );
  } },
  // 7 — sinaleira
  { a: 34.7, b: 38.4, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1.04], [3.7, 1.0]])}>
      <StreetBG light={t < 37.6 ? 'red' : 'green'} />
      <Place x={60} y={1760 - 2740 * 0.5} s={0.5}>
        <Lauro t={t} talk={lauroTalk(t)} expr="talk" arm="pointUp" full />
      </Place>
      <g transform="translate(420,1760) scale(0.55)"><Car color="#3B82C4" /></g>
    </Cam>
  ) },
  // 8a — xis reveal
  { a: 38.4, b: 44.9, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1.75], [1.8, 1.0]])} cy={1350}>
      <LancheriaBG />
      <Place x={216} y={560} s={0.6}>
        <Lauro t={t} talk={lauroTalk(t)} expr="shock" />
      </Place>
      <g transform="translate(540,1460) scale(1.2)"><Xis /></g>
    </Cam>
  ) },
  // 8b — xis close-up
  { a: 44.9, b: 49.4, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1], [4.5, 1.08]])}>
      <LancheriaBG />
      <g transform="translate(540,1080) scale(2.3)"><Xis /></g>
    </Cam>
  ) },
  // 9 — tri
  { a: 49.4, b: 54.6, draw: (t) => (
    <Cam z={1.02}>
      <LancheriaBG />
      <Place x={27} y={150} s={0.95}>
        <Lauro t={t} talk={lauroTalk(t)} expr="delight" arm="thumbsUp" armWobble={Math.sin(t * 8) * 6} />
      </Place>
      <g transform="translate(540,1760) scale(0.85)"><Xis /></g>
    </Cam>
  ) },
  // 10 — capaz
  { a: 54.6, b: 62.6, draw: (t) => (
    <Cam z={t < 59 ? 1.0 : 1.1} cy={1000}>
      <BakeryBG />
      <Lauro t={t} talk={lauroTalk(t)} expr="stern" arm="wag" armWobble={Math.sin(t * 13) * 16} tilt={Math.sin(t * 13) * 2} />
      <CounterFG />
    </Cam>
  ) },
  // 11 — suspense
  { a: 62.6, b: 66.4, draw: (t, lt) => suspense(t, lt) },
  // 12 — PECHADA freeze (music break)
  { a: 66.4, b: 68.3, draw: () => (
    <g filter="url(#desat)">{suspense(66.39, 66.39 - 62.6)}</g>
  ) },
  // 13 — pechada: cars
  { a: 68.3, b: 74.5, draw: (t, lt) => {
    const bx = kf(t, [[68.3, 470], [68.5, 608], [68.75, 585]]);
    const hit = t > 68.5;
    const s = shake(t, 68.5, 68.9, 16);
    return (
      <Cam z={1.0} {...s}>
        <StreetBG light="red" />
        <Place x={0} y={1720 - 2740 * 0.45} s={0.45}>
          <Lauro t={t} talk={lauroTalk(t)} expr={lt < 2.5 ? 'shock' : 'laugh'} arm="pointSide" armWobble={Math.sin(t * 6) * 4} />
        </Place>
        <g transform={`translate(880,${1760 + (hit && t < 68.9 ? Math.sin(t * 90) * 6 : 0)}) scale(0.8)`}><Car color="#B23A2E" dent={hit} /></g>
        <g transform={`translate(${bx},1770) scale(0.8)`}><Car color="#2F8F9D" /></g>
        {t > 68.5 && t < 69.1 && (
          <g transform={`translate(740,1700) scale(${pop(t, 68.5, 0.15)})`}>
            <path d="M0,-90 L22,-28 L88,-28 L35,10 L55,75 L0,35 L-55,75 L-35,10 L-88,-28 L-22,-28 Z" fill="#FFD43B" stroke="#1a1a1a" strokeWidth={8} />
          </g>
        )}
      </Cam>
    );
  } },
  // 14 — Cusco steals the cacetinho
  { a: 74.5, b: 77.5, draw: (t, lt) => (
    <Cam z={1.0}>
      <BakeryBG />
      <Place x={-170} y={430} s={0.8}>
        <Lauro t={t} talk={lauroTalk(t)} expr="angry" arm="pointSide" armWobble={Math.sin(t * 9) * 8} />
      </Place>
      <CounterFG />
      <g transform={`translate(${kf(lt, [[0, 380], [0.8, 540], [2.95, 1150]])},1450) scale(1.05)`}>
        <CuscoRun t={t} />
      </g>
    </Cam>
  ) },
  // 15 — closing phrase
  { a: 77.5, b: 81.0, draw: (t, lt) => (
    <Cam z={kf(lt, [[0, 1.0], [3.5, 1.05]])}>
      <StorefrontBG />
      <Place x={-60} y={330} s={0.9}>
        <Lauro t={t} talk={lauroTalk(t)} expr="smile" cuiaRaise={kf(lt, [[0, 0], [0.6, 1]])} />
      </Place>
      <g transform="translate(860,1650) scale(0.95)"><CuscoSit t={t} /></g>
    </Cam>
  ) },
  // 16 — CTA
  { a: 81.0, b: 89.2, draw: (t) => (
    <Cam z={1.05} cy={1100}>
      <StorefrontBG />
      <Place x={-60} y={330} s={0.9}>
        <Lauro t={t} talk={lauroTalk(t)} expr={t > 85.9 ? 'wink' : 'smile'} arm="pointDown" armWobble={Math.sin(t * 7) * 8} />
      </Place>
      <g transform="translate(860,1650) scale(0.95)"><CuscoSit t={t} chew={false} tiltHead={Math.sin(t * 2) * 12} /></g>
    </Cam>
  ) },
];

const CUTS = SCENES.map((s) => s.a).filter((a) => a > 0);

const SFX: [string, number, number][] = [
  ['plim', 0.0, 0.35],
  ...CUTS.filter((c) => c !== 66.4 && c !== 44.9).map((c) => ['whoosh', c - 0.12, 0.26] as [string, number, number]),
  ...[14.0, 16.3, 22.0, 27.0, 34.9, 38.7, 59.2, 68.4, 82.1, 87.0].map((c) => ['ding', c, 0.22] as [string, number, number]),
  ['scratch', 6.33, 0.35],
  ['pop', 6.6, 0.3], ['pop', 7.7, 0.3],
  ['pop', 45.2, 0.3], ['pop', 45.9, 0.3], ['pop', 46.6, 0.3],
  ['pop', 51.6, 0.28], ['pop', 52.26, 0.28], ['pop', 53.14, 0.28], ['pop', 53.96, 0.28],
  ['boing', 33.7, 0.35],
  ['toin', 68.5, 0.5], ['buzina', 68.75, 0.3],
  ['latido', 74.6, 0.55], ['patinhas', 74.95, 0.35],
  ['carimbo', 76.9, 0.45],
];

export const Video01: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sc = SCENES.find((s) => t >= s.a && t < s.b) ?? SCENES[SCENES.length - 1];
  const lt = t - sc.a;
  const lastCut = CUTS.filter((c) => c <= t).pop() ?? -1;
  const flash = lastCut > 0 && lastCut !== 66.4 && t - lastCut < 0.1 ? 1 - (t - lastCut) / 0.1 : 0;
  const hideCaps = (t > 66.4 && t < 68.3) || (t > 77.5 && t < 81.0) || t < 0.05;
  const tris = [51.6, 52.26, 53.14, 53.96];

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute' }}>
        <LauroDefs />
        <defs>
          <filter id="desat"><feColorMatrix type="saturate" values="0.12" /></filter>
          <radialGradient id="vig" cx="50%" cy="48%" r="65%">
            <stop offset="0.55" stopColor="rgba(0,0,0,0)" />
            <stop offset="1" stopColor="rgba(0,0,0,.55)" />
          </radialGradient>
        </defs>
        {sc.draw(t, lt)}
      </svg>

      {/* overlays */}
      <HUD />
      <BigText t={t} start={0} end={1.5} lines={['BAH, TU', 'SABIA?']} y={330} size={120} />
      {t >= 3.9 && t < 8.6 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center' }}>
          <div style={{ transform: `scale(${pop(t, 3.9)})`, background: '#fff', color: '#B23A2E', borderRadius: 40, padding: '14px 32px', fontFamily: 'Montserrat, "Noto Color Emoji"', fontWeight: 900, fontSize: 44, boxShadow: '0 8px 20px rgba(0,0,0,.25)' }}>📍 SÃO PAULO</div>
        </div>
      )}
      <TPill t={t} start={14.0} end={16.2} k="TE APROCHEGA" v="CHEGA MAIS 👋" />
      <TPill t={t} start={16.3} end={21.9} k="CACETINHO" v="PÃO FRANCÊS 🥖" />
      <TPill t={t} start={22.0} end={26.8} k="NEGRINHO" v="BRIGADEIRO 🍫" />
      <TPill t={t} start={27.0} end={34.7} k="BERGAMOTA" v="TANGERINA / MEXERICA / PONCÃ 🍊" />
      <TPill t={t} start={34.9} end={38.4} k="SINALEIRA" v="SEMÁFORO 🚦" />
      <TPill t={t} start={38.7} end={44.9} k="XIS" v="SANDUÍCHE (GIGANTE) 🍔" />
      <Tag t={t} start={45.2} end={49.4} text="OVO" x={110} y={820} />
      <Tag t={t} start={45.9} end={49.4} text="MILHO" x={650} y={760} />
      <Tag t={t} start={46.6} end={49.4} text="ERVILHA" x={330} y={1200} />
      <TPill t={t} start={51.5} end={54.6} k="TRI" v="MUITO 👍" />
      {tris.map((tr) => <BigText key={tr} t={t} start={tr} end={tr + 0.55} lines={['TRI!']} y={600} size={150} rot={-6} />)}
      <TPill t={t} start={59.2} end={62.6} k="CAPAZ!" v="IMAGINA! / DE JEITO NENHUM 🙅" />
      <BigText t={t} start={66.4} end={68.3} lines={['PECHADA?']} y={760} size={170} shake={9} />
      <TPill t={t} start={68.4} end={74.5} k="PECHADA" v="BATIDA DE CARRO 🚗" />
      <Stamp t={t} start={76.9} end={77.5} text="🐕 O CUSCO APROVOU" x={330} y={640} />
      <Phrase t={t} start={77.5} end={81.0} y={430} lines={[{ text: 'Aqui a gente não fala errado, tchê.', at: 77.64 }, { text: 'A gente fala gaúcho.', at: 79.62 }]} />
      <TPill t={t} start={82.1} end={89.2} k="COMO CHAMA" v="NA TUA CIDADE? 👇" sep=" " />
      {t >= 87.0 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center' }}>
          <div style={{ transform: `scale(${pop(t, 87.0)})`, background: MUST, color: '#1E1B18', borderRadius: 40, padding: '16px 36px', fontFamily: 'Montserrat, "Noto Color Emoji"', fontWeight: 900, fontSize: 50, boxShadow: '0 8px 20px rgba(0,0,0,.3)' }}>SEGUE PRA MAIS BAH! 🧉</div>
        </div>
      )}
      <Captions t={t} hidden={hideCaps} />

      {flash > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash})` }} />}
      {t > 88.7 && <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clamp((t - 88.7) / 0.45)})` }} />}

      {/* audio */}
      <Audio src={staticFile('audio/video01_voz_normalizada.mp3')} />
      <Audio src={staticFile('audio/video01_musica_alinhada.mp3')} />
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} durationInFrames={45} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
