import React from 'react';
import { MUST, WORDS, isGaucho, pop, easeOut, clamp, Word } from '../lib';
import { CuscoSit } from '../chars/Others';

const font = 'Montserrat, "Noto Color Emoji", sans-serif';

export const HUD: React.FC<{ num?: string; cat?: string; top?: number; left?: number }> = ({ num = '#001', cat = '🗣️ DICIONÁRIO GAÚCHO', top = 150, left = 48 }) => (
  <div style={{ position: 'absolute', left, top, fontFamily: font }}>
    <div style={{ display: 'inline-block', background: 'rgba(20,16,12,.75)', borderRadius: 14, padding: '10px 22px', fontWeight: 900, fontSize: 34, color: '#fff' }}>
      <span style={{ color: MUST }}>BAH, TU SABIA?</span> · {num}
    </div>
    <div style={{ marginTop: 12 }}>
      <span style={{ display: 'inline-block', background: 'rgba(255,255,255,.95)', borderRadius: 30, padding: '8px 20px', fontWeight: 900, fontSize: 26, color: '#2A2420', boxShadow: '0 5px 14px rgba(0,0,0,.2)' }}>
        {cat}
      </span>
    </div>
  </div>
);

/** translation pill: "KEY = meaning" — key in mustard on dark */
export const TPill: React.FC<{ t: number; start: number; end: number; k: string; v: string; y?: number; sep?: string }> = ({ t, start, end, k, v, y = 420, sep = ' = ' }) => {
  if (t < start || t > end) return null;
  const s = pop(t, start);
  const out = clamp((end - t) / 0.15);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: out }}>
      <div style={{ transform: `scale(${s})`, background: 'rgba(20,16,12,.9)', borderRadius: 26, padding: '18px 34px', fontFamily: font, fontWeight: 900, fontSize: 46, color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,.35)', border: `4px solid ${MUST}`, maxWidth: 960, textAlign: 'center', lineHeight: 1.2 }}>
        <span style={{ color: MUST }}>{k}</span>{sep}{v}
      </div>
    </div>
  );
};

export const Tag: React.FC<{ t: number; start: number; end: number; text: string; x: number; y: number; light?: boolean }> = ({ t, start, end, text, x, y, light = true }) => {
  if (t < start || t > end) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `scale(${pop(t, start)})`, background: light ? '#fff' : 'rgba(20,16,12,.85)', color: light ? '#2A2420' : '#fff', borderRadius: 30, padding: '10px 24px', fontFamily: font, fontWeight: 900, fontSize: 38, boxShadow: '0 6px 16px rgba(0,0,0,.25)' }}>
      • {text}
    </div>
  );
};

export const BigText: React.FC<{ t: number; start: number; end: number; lines: string[]; y: number; size: number; color?: string; shake?: number; rot?: number }> = ({ t, start, end, lines, y, size, color = MUST, shake = 0, rot = -4 }) => {
  if (t < start || t > end) return null;
  const s = pop(t, start, 0.25);
  const fade = clamp((end - t) / 0.2);
  const dx = shake ? Math.sin(t * 70) * shake : 0, dy = shake ? Math.cos(t * 55) * shake : 0;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', opacity: fade, transform: `translate(${dx}px,${dy}px) rotate(${rot}deg) scale(${s})`, fontFamily: font, fontWeight: 900, fontSize: size, lineHeight: 1.05, color, WebkitTextStroke: `${size * 0.2}px #2A1A0A`, paintOrder: 'stroke fill', textShadow: '0 10px 24px rgba(0,0,0,.35)' }}>
      {lines.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  );
};

/** highlighted closing sentence, gaúcho words in mustard */
export const Phrase: React.FC<{ t: number; start: number; end: number; lines: { text: string; at: number }[]; y: number }> = ({ t, start, end, lines, y }) => {
  if (t < start || t > end) return null;
  return (
    <div style={{ position: 'absolute', left: 40, right: 40, top: y, textAlign: 'center', fontFamily: font, fontWeight: 900, fontSize: 72, lineHeight: 1.15 }}>
      {lines.map((l, i) =>
        t >= l.at ? (
          <div key={i} style={{ transform: `scale(${pop(t, l.at)})`, color: '#fff', WebkitTextStroke: '14px #1a1a1a', paintOrder: 'stroke fill', marginBottom: 14 }}>
            {l.text.split(' ').map((w, j) => (
              <span key={j} style={{ color: isGaucho(w) ? MUST : '#fff' }}>{w} </span>
            ))}
          </div>
        ) : null,
      )}
    </div>
  );
};

export const Stamp: React.FC<{ t: number; start: number; end: number; text: string; x: number; y: number }> = ({ t, start, end, text, x, y }) => {
  if (t < start || t > end) return null;
  const p = easeOut((t - start) / 0.18);
  const s = 2.2 - 1.2 * p;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `rotate(-8deg) scale(${s})`, opacity: p, border: `8px solid ${MUST}`, borderRadius: 20, background: 'rgba(20,16,12,.88)', color: MUST, padding: '14px 26px', fontFamily: font, fontWeight: 900, fontSize: 46 }}>
      {text}
    </div>
  );
};

export const Captions: React.FC<{ t: number; hidden: boolean; y?: number; words?: Word[]; size?: number; left?: number; right?: number }> = ({ t, hidden, y = 1405, words = WORDS, size = 108, left = 0, right = 0 }) => {
  if (hidden) return null;
  const i = words.findIndex((w, idx) => {
    const next = words[idx + 1]?.s ?? w.e + 0.5;
    return t >= w.s && t < Math.min(next, Math.max(w.e + 0.15, w.s + 0.18));
  });
  if (i < 0) return null;
  const w = words[i];
  const s = 1 + 0.18 * (1 - easeOut((t - w.s) / 0.09));
  return (
    <div style={{ position: 'absolute', left, right, top: y, textAlign: 'center' }}>
      <span style={{ display: 'inline-block', transform: `scale(${s})`, fontFamily: font, fontWeight: 900, fontSize: size, color: isGaucho(w.w) ? MUST : '#fff', WebkitTextStroke: `${Math.round(size * 0.185)}px rgba(0,0,0,.92)`, paintOrder: 'stroke fill', textShadow: '0 8px 18px rgba(0,0,0,.45)' }}>
        {w.w}
      </span>
    </div>
  );
};

/**
 * Selo do Cusco (a partir do #007): selo postal que cai no meio da tela como carimbo de carta.
 * Borda serrilhada, desenho do Cusco, carimbo redondo de correio e o texto "CARIMBADO PELO CUSCO".
 * `at` = segundo do carimbo (junto com o latido). Fica ~1,5 s e sai girando.
 * Precisa de <CuscoDefs /> em algum <svg> da página (os gradientes são globais).
 */
export const SeloCusco: React.FC<{ t: number; at: number; num: string; tema: string; size?: number; cx?: number; cy?: number; dur?: number }> = ({ t, at, num, tema, size = 620, cx = 540, cy = 900, dur = 1.5 }) => {
  const lt = t - at;
  if (lt < 0 || lt > dur + 0.45) return null;
  const inK = easeOut(lt / 0.16);
  const outK = clamp((lt - dur) / 0.45);
  const s = (2.0 - 1.0 * inK) * (1 - outK * 0.9);
  const rot = -7 + outK * 260;
  const op = Math.min(inK * 1.2, 1) * (1 - outK);
  const postmark = clamp((lt - 0.18) / 0.06);
  const n = 18; // dentes por lado
  const W = 500, H = 600, r = 13;
  let teeth = '';
  for (let i = 0; i <= n; i++) {
    teeth += `M${(i * W) / n},0 m-${r},0 a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 -${2 * r},0 `;
    teeth += `M${(i * W) / n},${H} m-${r},0 a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 -${2 * r},0 `;
  }
  for (let i = 0; i <= Math.round((n * H) / W); i++) {
    const y = (i * H) / Math.round((n * H) / W);
    teeth += `M0,${y} m-${r},0 a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 -${2 * r},0 `;
    teeth += `M${W},${y} m-${r},0 a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 -${2 * r},0 `;
  }
  const ring = `${'BAH, TU SABIA? · ' + num + ' · ' + tema + ' · '}`;
  return (
    <div style={{ position: 'absolute', left: cx - size / 2, top: cy - size * 0.6, width: size, height: size * 1.2, transform: `rotate(${rot}deg) scale(${s})`, opacity: op, filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.45))' }}>
      <svg viewBox="-40 -40 580 680" width={size} height={size * 1.2}>
        <defs>
          <mask id="seloTeeth">
            <rect x={-40} y={-40} width={580} height={680} fill="#fff" />
            <path d={teeth} fill="#000" />
          </mask>
          <path id="seloRing" d="M370,250 m-125,0 a125,125 0 1,1 250,0 a125,125 0 1,1 -250,0" />
        </defs>
        <g mask="url(#seloTeeth)">
          <rect x={-14} y={-14} width={W + 28} height={H + 28} fill="#FBF3DF" />
        </g>
        <rect x={26} y={26} width={W - 52} height={H - 52} fill="#E9D6B0" stroke="#B07A4A" strokeWidth={6} />
        <rect x={40} y={40} width={W - 80} height={H - 210} fill="#BFD8E8" />
        <path d={`M40,${H - 260} Q250,${H - 300} ${W - 40},${H - 260} L${W - 40},${H - 170} L40,${H - 170} Z`} fill="#7A9A4A" />
        <g transform={`translate(250,${H - 190}) scale(0.95)`}>
          <CuscoSit t={t} chew={false} tiltHead={10 + Math.sin(t * 6) * 6} />
        </g>
        <text x={250} y={H - 110} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={40} fill="#3A2410">🐕 CARIMBADO</text>
        <text x={250} y={H - 62} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={40} fill="#3A2410">PELO CUSCO</text>
                {/* carimbo redondo de correio, torto, tinta vermelho-escura */}
        <g opacity={postmark * 0.85} transform="rotate(-14 370 250)">
          <circle cx={370} cy={250} r={150} fill="none" stroke="#8E1B1B" strokeWidth={10} />
          <circle cx={370} cy={250} r={100} fill="none" stroke="#8E1B1B" strokeWidth={5} />
          <text fontFamily="Montserrat" fontWeight={900} fontSize={27} fill="#8E1B1B" letterSpacing={1}>
            <textPath href="#seloRing">{ring}</textPath>
          </text>
          <text x={370} y={265} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={46} fill="#8E1B1B">{num}</text>
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M520,${185 + k * 34} q30,-16 60,0 t60,0 t60,0`} stroke="#8E1B1B" strokeWidth={8} fill="none" />
          ))}
        </g>
      </svg>
    </div>
  );
};
