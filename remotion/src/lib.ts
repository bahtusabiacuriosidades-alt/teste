import rmsData from './data/rms.json';
import wordsData from './data/words.json';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const MUST = '#D9A021';
export const DARK = '#1E1B18';

export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const easeInOut = (x: number) => {
  const v = clamp(x);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
/** keyframe helper: kf(t, [[t0,v0],[t1,v1],...]) with ease-in-out between keys */
export const kf = (t: number, keys: [number, number][]) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i];
    const [t1, v1] = keys[i + 1];
    if (t <= t1) return lerp(v0, v1, easeInOut((t - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
};
/** pop-in scale: overshoots then settles */
export const pop = (t: number, start: number, dur = 0.22) => {
  const x = (t - start) / dur;
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return x < 0.6 ? easeOut(x / 0.6) * 1.15 : lerp(1.15, 1, easeOut((x - 0.6) / 0.4));
};

const rms = rmsData as number[];
/** voice level 0..1 at time t (Lauro only — silenced while the clerk talks) */
export const voice = (t: number) => {
  const v = rms[Math.floor(t * FPS)] ?? 0;
  return v;
};
export const lauroTalk = (t: number) => (t > 6.5 && t < 8.4 ? 0 : voice(t));
export const clerkTalk = (t: number) => (t > 6.5 && t < 8.4 ? voice(t) : 0);

export type Word = { w: string; s: number; e: number };
export const WORDS = wordsData as Word[];
export const GAUCHO = new Set([
  'bah', 'tchê', 'aprochega', 'cacetinho', 'cacetinhos', 'negrinho', 'bergamota',
  'sinaleira', 'xis', 'tri', 'capaz', 'pechada', 'cusco', 'gaúcho', 'chimarrão', 'cuia', 'erva', 'mate', 'cevar', 'morrinho',
  'piá', 'nono', 'nona', 'nonos', 'talian', 'tropeiros', 'bah…',
]);
/** per-video voice level (0..1) from an rms array sampled at FPS */
export const makeVoice = (r: number[]) => (t: number) => r[Math.floor(t * FPS)] ?? 0;

export const isGaucho = (w: string) => GAUCHO.has(w.toLowerCase().replace(/[?!.,"]/g, ''));
