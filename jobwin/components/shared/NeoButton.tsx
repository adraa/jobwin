import React from 'react';
import { sendDebugLog } from '@/utils/debug.ts';

interface NeoButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  style?: React.CSSProperties;
}

export const NeoButton = ({ children, onClick, variant = 'primary', className = '', style = {} }: NeoButtonProps) => {
  const baseStyle = "relative overflow-hidden group px-6 py-2.5 md:px-8 md:py-3.5 font-display font-medium transition-all duration-300 flex items-center justify-center tracking-tight text-sm md:text-base rounded-full transform active:scale-95 min-h-[44px] md:min-h-[52px]";

  const variants: Record<'primary' | 'secondary' | 'outline', string> = {
    primary: "bg-[#0071E3] text-white hover:bg-[#0077ED] shadow-sm hover:shadow-md border border-transparent",
    secondary: "bg-white text-[#1D1D1F] border border-[#D2D2D7] hover:border-[#0071E3] hover:text-[#0071E3]",
    outline: "bg-transparent text-[#0071E3] border border-[#0071E3] hover:bg-[#0071E3]/5"
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    sendDebugLog({
      runId: 'run2',
      hypothesisId: 'H1',
      location: 'NeoButton.tsx:handleClick',
      message: 'NeoButton click',
      data: {
        variant,
        className,
        hasOnClick: Boolean(onClick)
      }
    });

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button onClick={handleClick} className={`${baseStyle} ${variants[variant] || ''} ${className}`} style={style}>
      <span className="relative z-10 flex items-center justify-center gap-2 w-full">
        {children}
      </span>
    </button>
  );
};
