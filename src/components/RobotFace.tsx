/**
 * Emotive Digital OLED Face Screen for ELXIE Robot
 */

import React from 'react';
import { RobotExpression } from '../state/flasherStore';

interface RobotFaceProps {
  expression: RobotExpression;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RobotFace: React.FC<RobotFaceProps> = ({
  expression = 'friendly',
  className = '',
  size = 'md'
}) => {
  const getEyeContent = () => {
    switch (expression) {
      case 'happy':
      case 'excited':
        return (
          <g className="transition-all duration-300">
            {/* Curved Happy Eyes */}
            <path
              d="M 28 42 Q 40 22 52 42"
              fill="none"
              stroke="#00f5d4"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M 88 42 Q 100 22 112 42"
              fill="none"
              stroke="#00f5d4"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Sparkle Stars for excited */}
            {expression === 'excited' && (
              <>
                <circle cx="40" cy="18" r="2.5" fill="#fee440" className="animate-ping" />
                <circle cx="100" cy="18" r="2.5" fill="#fee440" className="animate-ping" />
              </>
            )}
            {/* Cheerful Smile */}
            <path
              d="M 58 52 Q 70 62 82 52"
              fill="none"
              stroke="#00f5d4"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        );

      case 'curious':
        return (
          <g className="transition-all duration-300">
            {/* Left Eye normal */}
            <ellipse cx="40" cy="36" rx="12" ry="14" fill="#00f5d4" />
            <circle cx="43" cy="33" r="4" fill="#ffffff" />
            {/* Right Eye raised & wider */}
            <ellipse cx="100" cy="30" rx="14" ry="16" fill="#00f5d4" />
            <circle cx="104" cy="27" r="5" fill="#ffffff" />
            {/* Inquisitive Mouth */}
            <circle cx="70" cy="52" r="4" fill="#00f5d4" />
          </g>
        );

      case 'focused':
      case 'working':
        return (
          <g className="transition-all duration-300">
            {/* Determined Narrow Eyes */}
            <rect x="26" y="32" width="28" height="10" rx="5" fill="#00bbf9" />
            <rect x="86" y="32" width="28" height="10" rx="5" fill="#00bbf9" />
            {/* Scanline Laser Bar */}
            <line
              x1="20"
              y1="37"
              x2="120"
              y2="37"
              stroke="#00f5d4"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="animate-pulse"
            />
            {/* Determined flat mouth */}
            <line x1="62" y1="52" x2="78" y2="52" stroke="#00bbf9" strokeWidth="3" strokeLinecap="round" />
          </g>
        );

      case 'thinking':
        return (
          <g className="transition-all duration-300">
            {/* Looking up-right */}
            <ellipse cx="45" cy="28" rx="12" ry="13" fill="#00f5d4" />
            <circle cx="48" cy="24" r="4" fill="#ffffff" />
            <ellipse cx="105" cy="28" rx="12" ry="13" fill="#00f5d4" />
            <circle cx="108" cy="24" r="4" fill="#ffffff" />
            {/* Pulsing thinking dots */}
            <circle cx="62" cy="50" r="2.5" fill="#00f5d4" className="animate-bounce" />
            <circle cx="70" cy="50" r="2.5" fill="#00f5d4" className="animate-bounce delay-100" />
            <circle cx="78" cy="50" r="2.5" fill="#00f5d4" className="animate-bounce delay-200" />
          </g>
        );

      case 'waiting':
        return (
          <g className="transition-all duration-300">
            {/* Sleeping / Relaxed Lines */}
            <path d="M 28 36 Q 40 42 52 36" fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
            <path d="M 88 36 Q 100 42 112 36" fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
            {/* Small Z's */}
            <text x="75" y="24" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold" className="animate-pulse">z</text>
            <text x="85" y="16" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold" className="animate-pulse delay-150">Z</text>
          </g>
        );

      case 'concerned':
        return (
          <g className="transition-all duration-300">
            {/* Concerned Slanted Brow Eyes */}
            <ellipse cx="40" cy="38" rx="12" ry="13" fill="#fee440" />
            <circle cx="40" cy="36" r="4" fill="#ffffff" />
            <ellipse cx="100" cy="38" rx="12" ry="13" fill="#fee440" />
            <circle cx="100" cy="36" r="4" fill="#ffffff" />
            {/* Wavy Concerned Mouth */}
            <path
              d="M 60 52 Q 65 48 70 52 Q 75 56 80 52"
              fill="none"
              stroke="#fee440"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        );

      case 'friendly':
      default:
        return (
          <g className="transition-all duration-300">
            {/* Friendly Classic Glowing Eyes */}
            <g className="animate-blink" style={{ transformOrigin: '70px 36px' }}>
              <ellipse cx="40" cy="36" rx="13" ry="15" fill="#00f5d4" />
              <circle cx="44" cy="32" r="4.5" fill="#ffffff" />
              <ellipse cx="100" cy="36" rx="13" ry="15" fill="#00f5d4" />
              <circle cx="104" cy="32" r="4.5" fill="#ffffff" />
            </g>
            {/* Gentle Smile */}
            <path
              d="M 62 50 Q 70 56 78 50"
              fill="none"
              stroke="#00f5d4"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        );
    }
  };

  const dimensions = {
    sm: 'w-24 h-12',
    md: 'w-44 h-24',
    lg: 'w-60 h-32'
  }[size];

  return (
    <div className={`relative ${dimensions} ${className} flex items-center justify-center rounded-xl bg-slate-950/90 border border-teal-500/40 shadow-oled overflow-hidden`}>
      {/* Subtle OLED Pixel Matrix Grid background */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00f5d4 0.75px, transparent 0.75px)',
          backgroundSize: '4px 4px'
        }}
      />

      <svg
        viewBox="0 0 140 70"
        className="w-full h-full p-1 drop-shadow-[0_0_8px_rgba(0,245,212,0.6)]"
      >
        {getEyeContent()}
      </svg>
    </div>
  );
};
