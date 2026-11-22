import React from 'react';
import { MUST, easeOut } from '../lib';

const CAR = '#C68642';
const CAR_D = '#A86D33';
const MUZ = '#8A5A2B';

const Heart: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <path transform={`translate(${x},${y}) scale(${s}) rotate(12)`} d="M0,10 C-25,-15 -50,10 0,45 C50,10 25,-15 0,10 Z" fill="#F4EFE6" />
);

/** Cusco side view, facing right, running */
export const CuscoRun: React.FC<{ t: number; bread?: boolean }> = ({ t, bread = true }) => {
  const sw = Math.sin(t * 22) * 32;
  const leg = (x: number, ang: number, c: string) => (
    <g transform={`translate(${x},30) rotate(${ang})`}>
      <rect x={-17} y={0} width={34} height={115} rx={16} fill={c} />
      <ellipse cx={4} cy={112} rx={22} ry={12} fill={c} />
    </g>
  );
  const bob = Math.abs(Math.sin(t * 22)) * -10;
  return (
    <g transform={`translate(0,${bob})`}>
      {leg(-95, -sw, CAR_D)}
      {leg(85, sw, CAR_D)}
      <path d="M-150,-30 C-230,-60 -230,-150 -170,-150 C-130,-150 -140,-100 -175,-100" stroke={CAR} strokeWidth={26} fill="none" strokeLinecap="round" transform={`rotate(${Math.sin(t * 30) * 8} -150 -30)`} />
      <ellipse cx={0} cy={0} rx={165} ry={82} fill={CAR} />
      {leg(-120, sw, CAR)}
      {leg(105, -sw, CAR)}
      <Heart x={120} y={10} s={0.9} />
      <path d="M95,-60 L175,-35 L120,40 Z" fill={MUST} />
      <g transform="translate(175,-85)">
        <path d="M-40,-60 L-5,-140 L20,-55 Z" fill={CAR_D} />
        <circle cx={0} cy={0} r={72} fill={CAR} />
        <ellipse cx={70} cy={18} rx={56} ry={34} fill={CAR} />
        <ellipse cx={98} cy={16} rx={30} ry={24} fill={MUZ} />
        <ellipse cx={120} cy={8} rx={13} ry={11} fill="#1a1a1a" />
        <circle cx={18} cy={-18} r={13} fill="#5A3A1E" />
        <circle cx={22} cy={-22} r={5} fill="#fff" />
        <path d={`M30,-58 Q75,-70 82,-20 Q55,-30 30,-40 Z`} fill={CAR_D} transform={`rotate(${Math.sin(t * 22) * 10} 30 -58)`} />
        {bread && (
          <g transform="translate(95,52) rotate(-8)">
            <ellipse cx={0} cy={0} rx={58} ry={30} fill="#C98A3A" />
            <ellipse cx={-6} cy={-8} rx={40} ry={16} fill="#E2A957" />
          </g>
        )}
      </g>
    </g>
  );
};

/** Cusco sitting, front view, chewing */
export const CuscoSit: React.FC<{ t: number; chew?: boolean; tiltHead?: number }> = ({ t, chew = true, tiltHead = 0 }) => {
  const jaw = chew ? Math.abs(Math.sin(t * 9)) * 10 : 0;
  const wag = Math.sin(t * 14) * 25;
  return (
    <g>
      <path d="M90,120 C170,90 190,10 150,-20" stroke={CAR} strokeWidth={28} fill="none" strokeLinecap="round" transform={`rotate(${wag} 90 120)`} />
      <ellipse cx={-85} cy={150} rx={70} ry={55} fill={CAR_D} />
      <ellipse cx={85} cy={150} rx={70} ry={55} fill={CAR_D} />
      <ellipse cx={0} cy={50} rx={120} ry={150} fill={CAR} />
      <rect x={-62} y={60} width={44} height={150} rx={20} fill={CAR} />
      <rect x={18} y={60} width={44} height={150} rx={20} fill={CAR} />
      <ellipse cx={-40} cy={208} rx={30} ry={15} fill={CAR_D} />
      <ellipse cx={40} cy={208} rx={30} ry={15} fill={CAR_D} />
      <Heart x={0} y={-10} s={1.3} />
      <path d="M-95,-95 L95,-95 L0,20 Z" fill={MUST} />
      <g transform={`rotate(${tiltHead} 0 -170)`}>
        <path d="M-95,-215 L-70,-330 L-25,-245 Z" fill={CAR_D} />
        <circle cx={0} cy={-170} r={105} fill={CAR} />
        <path d="M45,-250 Q120,-280 125,-180 Q85,-200 55,-215 Z" fill={CAR_D} />
        <ellipse cx={0} cy={-118} rx={62} ry={44} fill={MUZ} opacity={0.55} />
        <ellipse cx={0} cy={-140} rx={20} ry={15} fill="#1a1a1a" />
        <circle cx={-40} cy={-195} r={15} fill="#5A3A1E" />
        <circle cx={40} cy={-195} r={15} fill="#5A3A1E" />
        <circle cx={-35} cy={-200} r={5} fill="#fff" />
        <circle cx={45} cy={-200} r={5} fill="#fff" />
        {chew && (
          <g transform={`translate(0,${-95 + jaw})`}>
            <ellipse cx={0} cy={0} rx={52} ry={26} fill="#C98A3A" />
            <ellipse cx={-6} cy={-7} rx={36} ry={13} fill="#E2A957" />
          </g>
        )}
      </g>
    </g>
  );
};

/** São Paulo bakery clerk */
export const Clerk: React.FC<{ t: number; talk: number; lt: number }> = ({ t, talk, lt }) => {
  const tilt = (4 + 12 * easeOut(lt / 1.2)) + (t > 6.6 && t < 6.9 ? Math.sin(t * 90) * 2 : 0);
  const blink = lt > 1.6 && lt < 1.75 ? 0.1 : 1;
  const pp = t > 6.6 ? 1.12 : 1;
  return (
    <g>
      <path d="M200,1950 L270,1300 Q540,1200 810,1300 L880,1950 Z" fill="#8FB3D6" />
      <path d="M330,1950 L380,1330 L700,1330 L750,1950 Z" fill="#FAFAFA" />
      <path d="M400,1330 L470,1180 M680,1330 L610,1180" stroke="#ddd" strokeWidth={8} />
      <rect x={485} y={1100} width={110} height={140} rx={40} fill="#E8B48C" />
      <rect x={760} y={1380} width={150} height={190} rx={10} fill="#B98A55" />
      <rect x={760} y={1380} width={150} height={28} rx={6} fill="#A27645" />
      <ellipse cx={780} cy={1500} rx={46} ry={50} fill="#F1C29A" />
      <g transform={`rotate(${tilt} 540 900)`}>
        <ellipse cx={345} cy={930} rx={34} ry={52} fill="#E8B48C" />
        <ellipse cx={735} cy={930} rx={34} ry={52} fill="#E8B48C" />
        <ellipse cx={540} cy={910} rx={195} ry={225} fill="#F1C29A" />
        <ellipse cx={440} cy={990} rx={34} ry={20} fill="rgba(240,120,100,.3)" />
        <ellipse cx={640} cy={990} rx={34} ry={20} fill="rgba(240,120,100,.3)" />
        {[465, 615].map((ex) => (
          <g key={ex}>
            <ellipse cx={ex} cy={900} rx={40 * pp} ry={48 * pp * blink} fill="#fff" />
            <ellipse cx={ex} cy={905} rx={22 * pp} ry={24 * pp * blink} fill="#3A2A1A" />
            {blink > 0.5 && <circle cx={ex + 8} cy={896} r={6} fill="#fff" />}
          </g>
        ))}
        <rect x={413} y={819} width={104} height={22} rx={11} fill="#4A3424" transform="rotate(9 465 830)" />
        <rect x={563} y={789 - 10 * easeOut(lt / 0.8)} width={104} height={22} rx={11} fill="#4A3424" transform={`rotate(-20 615 ${800 - 10 * easeOut(lt / 0.8)})`} />
        <ellipse cx={540} cy={965} rx={26} ry={32} fill="#E09D78" />
        <ellipse cx={552} cy={1055} rx={20 + 18 * talk} ry={6 + 46 * talk} fill="#5A1A1A" />
        <path d="M350,760 A190,90 0 0 1 730,760 Z" fill="#3A2A1A" />
        <path d="M370,760 L400,600 L680,600 L710,760 Z" fill="#fff" />
        <rect x={365} y={730} width={350} height={45} rx={10} fill="#EDEDED" />
      </g>
    </g>
  );
};
