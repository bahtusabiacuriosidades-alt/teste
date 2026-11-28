import React from 'react';
import { clamp, easeInOut, lerp } from './lib';

/*
 * Câmera virtual do "Bah, tu sabia?".
 *
 * Ideia: cada cena ganha uma lista de "planos" (Shot). A câmera fica parada
 * (com uma respiração bem leve) e só se move na transição de um plano para o
 * outro, com ease-in-out. Assim o vídeo fica movimentado sem cansar:
 *   - no máximo um movimento por fala;
 *   - zoom sempre entre 1.0 e 1.35 (nunca corta o cenário);
 *   - "punch" (soquinho de zoom) só nos impactos: gol, carimbo, virada.
 *
 * Coordenadas no espaço do SVG (1080×1920 no vertical, 1920×1080 no longo).
 * x/y = ponto que a câmera mira; z = zoom.
 */
export type Shot = {
  /** segundo (tempo global) em que este plano está totalmente no lugar */
  at: number;
  x: number;
  y: number;
  z: number;
  /** rotação em graus (use pouco: -2 a 2) */
  r?: number;
  /** duração da chegada a este plano (s). Padrão 0.9 */
  ease?: number;
};

export type CamState = { x: number; y: number; z: number; r: number };

/** posição da câmera no tempo t */
export const camAt = (t: number, shots: Shot[]): CamState => {
  if (!shots.length) return { x: 0, y: 0, z: 1, r: 0 };
  let cur = shots[0];
  let state: CamState = { x: cur.x, y: cur.y, z: cur.z, r: cur.r ?? 0 };
  for (let i = 1; i < shots.length; i++) {
    const s = shots[i];
    const d = s.ease ?? 0.9;
    if (t <= s.at - d) break;
    const k = easeInOut(clamp((t - (s.at - d)) / d));
    state = { x: lerp(state.x, s.x, k), y: lerp(state.y, s.y, k), z: lerp(state.z, s.z, k), r: lerp(state.r, s.r ?? 0, k) };
    cur = s;
    if (k < 1) break;
  }
  return state;
};

/** respiração leve de câmera na mão (amplitude pequena para não enjoar) */
export const breathe = (t: number, amp = 1) => ({
  x: (Math.sin(t * 0.7) * 6 + Math.sin(t * 1.9) * 2) * amp,
  y: (Math.cos(t * 0.55) * 5 + Math.sin(t * 1.3) * 2) * amp,
  r: Math.sin(t * 0.45) * 0.25 * amp,
});

/** soquinho de zoom num impacto (gol, carimbo): sobe rápido e volta em ~0.35 s */
export const punch = (t: number, at: number, amount = 0.06) => {
  const x = t - at;
  if (x < 0 || x > 0.4) return 0;
  return x < 0.07 ? (x / 0.07) * amount : amount * (1 - easeInOut((x - 0.07) / 0.33));
};

/** câmera que acompanha um personagem andando (x do personagem), com atraso suave */
export const follow = (targetX: (t: number) => number, t: number, lag = 0.25) => targetX(t - lag);

/**
 * Envolve o conteúdo do SVG.
 * `shots` define os planos; `punches` lista os segundos de impacto;
 * `follow` (opcional) soma um deslocamento horizontal para acompanhar quem anda.
 */
export const Cam: React.FC<{
  t: number;
  w?: number;
  h?: number;
  shots: Shot[];
  punches?: number[];
  followX?: number;
  breath?: number;
  children: React.ReactNode;
}> = ({ t, w = 1080, h = 1920, shots, punches = [], followX = 0, breath = 1, children }) => {
  const c = camAt(t, shots);
  const b = breathe(t, breath);
  const z = clamp(c.z + punches.reduce((a, p) => a + punch(t, p), 0), 1, 1.45);
  const cx = c.x + followX + b.x;
  const cy = c.y + b.y;
  // mantém o ponto (cx, cy) no centro da tela
  const tx = w / 2 - cx * z;
  const ty = h / 2 - cy * z;
  return <g transform={`translate(${tx},${ty}) scale(${z}) rotate(${c.r + b.r} ${cx} ${cy})`}>{children}</g>;
};

/* Planos prontos (vertical 1080×1920), para usar como ponto de partida */
export const V = {
  /** geral: cenário inteiro */
  wide: (at: number, ease?: number): Shot => ({ at, x: 540, y: 960, z: 1.0, ease }),
  /** médio no Lauro (personagem embaixo, centro) */
  lauro: (at: number, x = 540, ease?: number): Shot => ({ at, x, y: 1250, z: 1.22, ease }),
  /** close no rosto do Lauro (use pouco: só na reação) */
  closeLauro: (at: number, x = 540, ease?: number): Shot => ({ at, x, y: 1150, z: 1.35, ease }),
  /** plano no Cusco (embaixo à direita) */
  cusco: (at: number, x = 820, ease?: number): Shot => ({ at, x, y: 1450, z: 1.3, ease }),
  /** mira no meio da tela, levemente fechado (placares, mapas) */
  center: (at: number, z = 1.12, ease?: number): Shot => ({ at, x: 540, y: 900, z, ease }),
};
