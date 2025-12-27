import React from 'react';
import { Marquee } from './Marquee.tsx';

interface PromoBarProps {
  onClick?: () => void;
}

export const PromoBar = ({ onClick }: PromoBarProps) => (
  <div
    onClick={onClick}
    className="fixed top-14 md:top-16 left-0 w-full h-7 md:h-8 bg-lime-400 z-40 flex items-center overflow-hidden cursor-pointer active:bg-lime-300 md:hover:bg-lime-300 transition-colors shadow-sm"
  >
    <Marquee className="py-0 [--gap:2rem] md:[--gap:3rem]" repeat={10} style={{ '--duration': '4s' } as React.CSSProperties}>
      <div className="flex items-center gap-2 md:gap-3 font-bold font-display text-[10px] md:text-sm text-black tracking-widest uppercase">
        <span className="animate-pulse text-xs md:text-sm">✦</span>
        <span>BUY NOW & SAVE RM29</span>
      </div>
    </Marquee>
  </div>
);
