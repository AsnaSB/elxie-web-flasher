/**
 * ELXIE Brand Logo Component
 */

// TODO: Replace placeholder logo with official ELXIE logo.

import React from 'react';

interface ElxieLogoProps {
  className?: string;
  onClick?: () => void;
  showSubtitle?: boolean;
}

export const ElxieLogo: React.FC<ElxieLogoProps> = ({
  className = '',
  onClick,
  showSubtitle = true
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center space-x-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Tech Glyph Icon */}
      <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 p-0.5 shadow-md flex items-center justify-center">
        <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
          <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="8.5" cy="16" r="1" fill="currentColor" />
            <circle cx="15.5" cy="16" r="1" fill="currentColor" />
            <path d="M12 7v4" />
            <line x1="8" y1="3" x2="12" y2="7" />
            <line x1="16" y1="3" x2="12" y2="7" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-1">
          <span className="font-display font-extrabold text-xl tracking-wider text-white">
            ELXIE
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
        </div>
        {showSubtitle && (
          <span className="text-[9px] font-mono font-medium tracking-widest text-cyan-400/90 -mt-1 uppercase">
            Web Flasher
          </span>
        )}
      </div>
    </div>
  );
};
