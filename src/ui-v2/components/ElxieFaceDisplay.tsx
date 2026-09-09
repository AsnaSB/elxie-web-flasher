/**
 * ElxieFaceDisplay Component (Interactive Robot Face System)
 * 
 * Reusable, scalable facial expression overlay with 100% horizontal alignment
 * and symmetric eye geometry across all states.
 */

import React from 'react';
import { RobotExpression } from '../../state/flasherStore';

export type ExtendedExpression = 
  | RobotExpression 
  | 'idle' 
  | 'success' 
  | 'error' 
  | 'connecting' 
  | 'flashing' 
  | 'complete';

export interface ElxieFaceDisplayProps {
  expression?: ExtendedExpression;
  className?: string;
}

export const ElxieFaceDisplay: React.FC<ElxieFaceDisplayProps> = ({
  expression = 'happy',
  className = ''
}) => {
  // Normalize expression to 8 core states
  const normalizeExpression = (exp: ExtendedExpression) => {
    switch (exp) {
      case 'connecting':
        return 'connecting';
      case 'idle':
      case 'waiting':
        return 'idle';
      case 'thinking':
      case 'curious':
        return 'thinking';
      case 'flashing':
      case 'focused':
      case 'working':
        return 'flashing';
      case 'success':
      case 'complete':
      case 'excited':
        return 'complete';
      case 'error':
      case 'concerned':
        return 'error';
      case 'happy':
      case 'friendly':
      default:
        return 'happy';
    }
  };

  const currentMode = normalizeExpression(expression);

  // Dynamic glow color
  const getGlowColor = () => {
    switch (currentMode) {
      case 'complete':
        return {
          core: '#00f5d4', // Vibrant Teal
          glow: 'rgba(0, 245, 212, 0.4)',
          filter: 'drop-shadow(0 0 6px #00f5d4) drop-shadow(0 0 14px #00e5ff)'
        };
      case 'error':
        return {
          core: '#f59e0b', // Subtle amber warning
          glow: 'rgba(245, 158, 11, 0.4)',
          filter: 'drop-shadow(0 0 6px #f59e0b) drop-shadow(0 0 12px rgba(239, 68, 68, 0.5))'
        };
      case 'thinking':
        return {
          core: '#38bdf8', // Sky Blue
          glow: 'rgba(56, 189, 248, 0.4)',
          filter: 'drop-shadow(0 0 6px #38bdf8) drop-shadow(0 0 12px #818cf8)'
        };
      case 'connecting':
        return {
          core: '#00e5ff',
          glow: 'rgba(0, 229, 255, 0.45)',
          filter: 'drop-shadow(0 0 6px #00e5ff) drop-shadow(0 0 14px #00b0ff)'
        };
      case 'flashing':
        return {
          core: '#00e5ff',
          glow: 'rgba(0, 229, 255, 0.45)',
          filter: 'drop-shadow(0 0 6px #00e5ff) drop-shadow(0 0 14px #00f5d4)'
        };
      case 'idle':
        return {
          core: '#38bdf8',
          glow: 'rgba(56, 189, 248, 0.3)',
          filter: 'drop-shadow(0 0 4px #38bdf8) drop-shadow(0 0 10px #0ea5e9)'
        };
      case 'happy':
      default:
        return {
          core: '#00e5ff', // Primary Cyan
          glow: 'rgba(0, 229, 255, 0.4)',
          filter: 'drop-shadow(0 0 6px #00e5ff) drop-shadow(0 0 14px #00b0ff)'
        };
    }
  };

  const theme = getGlowColor();

  return (
    <div
      className={`w-full h-full flex items-center justify-center relative overflow-hidden select-none ${className}`}
      style={{
        background: 'radial-gradient(ellipse at center, #020612 0%, #000000 100%)',
        boxShadow: 'inset 0 0 16px rgba(0, 229, 255, 0.15), inset 0 0 4px rgba(255, 255, 255, 0.05)',
        borderRadius: 'inherit'
      }}
    >
      {/* 1. Subtle OLED Pixel Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(rgba(0, 229, 255, 0.6) 1px, transparent 0)',
          backgroundSize: '4px 4px'
        }}
      />

      {/* 2. Scalable Vector OLED Face Graphics (100% Horizontal Alignment) */}
      <svg
        viewBox="0 0 200 120"
        className="w-full h-full relative z-10"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: theme.filter }}
      >
        {/* =========================================================
            STATE 1: HAPPY (Curved Joyful Eyes ^ ^)
            ========================================================= */}
        {currentMode === 'happy' && (
          <g className="transition-all duration-300">
            {/* Perfectly Symmetrical Blinking Eyes (^ ^) on Y-baseline 56 */}
            <g className="animate-blink" style={{ transformOrigin: '100px 56px' }}>
              <path
                d="M 38 56 Q 60 26 82 56"
                fill="none"
                stroke={theme.core}
                strokeWidth="11"
                strokeLinecap="round"
              />
              <path
                d="M 118 56 Q 140 26 162 56"
                fill="none"
                stroke={theme.core}
                strokeWidth="11"
                strokeLinecap="round"
              />
            </g>

            {/* Cute Smiling Mouth */}
            <path
              d="M 90 76 Q 100 88 110 76"
              fill="none"
              stroke={theme.core}
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* =========================================================
            STATE 2: CONNECTING (Searching / Pairing Eyes - Perfectly Aligned)
            ========================================================= */}
        {currentMode === 'connecting' && (
          <g className="transition-all duration-300">
            {/* Perfectly Horizontal Symmetrical Searching Eyes at Y=54 */}
            <g className="animate-pulse" style={{ transformOrigin: '100px 54px' }}>
              {/* Left Eye */}
              <ellipse cx="60" cy="54" rx="16" ry="18" fill={theme.core} />
              <circle cx="64" cy="48" r="5" fill="#ffffff" />

              {/* Right Eye (Identical Y=54 baseline) */}
              <ellipse cx="140" cy="54" rx="16" ry="18" fill={theme.core} />
              <circle cx="144" cy="48" r="5" fill="#ffffff" />
            </g>

            {/* Centered Symmetrical Searching Signal Indicator */}
            <g className="animate-pulse">
              <circle cx="88" cy="80" r="3" fill={theme.core} className="animate-ping opacity-75" />
              <circle cx="88" cy="80" r="3" fill={theme.core} />
              <circle cx="100" cy="80" r="3.5" fill={theme.core} className="animate-ping [animation-delay:200ms] opacity-75" />
              <circle cx="100" cy="80" r="3.5" fill={theme.core} />
              <circle cx="112" cy="80" r="3" fill={theme.core} className="animate-ping [animation-delay:400ms] opacity-75" />
              <circle cx="112" cy="80" r="3" fill={theme.core} />
            </g>
          </g>
        )}

        {/* =========================================================
            STATE 3: THINKING (Both Eyes Looking In Unison - Symmetrical Baseline)
            ========================================================= */}
        {currentMode === 'thinking' && (
          <g className="transition-all duration-300">
            {/* Both Eyes on Identical Y=50 Baseline */}
            <ellipse cx="60" cy="50" rx="15" ry="17" fill={theme.core} />
            <circle cx="65" cy="44" r="5" fill="#ffffff" />

            <ellipse cx="140" cy="50" rx="15" ry="17" fill={theme.core} />
            <circle cx="145" cy="44" r="5" fill="#ffffff" />

            {/* Symmetrical Thinking Progress Dots */}
            <circle cx="86" cy="80" r="3.5" fill={theme.core} className="animate-bounce" />
            <circle cx="100" cy="80" r="3.5" fill={theme.core} className="animate-bounce [animation-delay:150ms]" />
            <circle cx="114" cy="80" r="3.5" fill={theme.core} className="animate-bounce [animation-delay:300ms]" />
          </g>
        )}

        {/* =========================================================
            STATE 4: IDLE (Relaxed Symmetrical Eyes)
            ========================================================= */}
        {currentMode === 'idle' && (
          <g className="transition-all duration-500 animate-pulse">
            {/* Relaxed Oval Eyes on Y=54 */}
            <g className="animate-blink" style={{ transformOrigin: '100px 54px' }}>
              <ellipse cx="60" cy="54" rx="16" ry="18" fill={theme.core} />
              <circle cx="65" cy="48" r="5.5" fill="#ffffff" />
              <ellipse cx="140" cy="54" rx="16" ry="18" fill={theme.core} />
              <circle cx="145" cy="48" r="5.5" fill="#ffffff" />
            </g>

            {/* Gentle Smile */}
            <path
              d="M 92 78 Q 100 86 108 78"
              fill="none"
              stroke={theme.core}
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* =========================================================
            STATE 5: COMPLETE / SUCCESS (Celebratory Joyful Eyes)
            ========================================================= */}
        {currentMode === 'complete' && (
          <g className="transition-all duration-300">
            {/* Joyful Eyes on Y=54 with Sparkles */}
            <g className="animate-blink" style={{ transformOrigin: '100px 54px' }}>
              <path
                d="M 36 54 Q 60 22 84 54"
                fill="none"
                stroke={theme.core}
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 116 54 Q 140 22 164 54"
                fill="none"
                stroke={theme.core}
                strokeWidth="12"
                strokeLinecap="round"
              />
            </g>

            {/* Symmetrical Sparkle Glints */}
            <circle cx="60" cy="24" r="3.5" fill="#ffffff" className="animate-ping" />
            <circle cx="140" cy="24" r="3.5" fill="#ffffff" className="animate-ping" />

            {/* Large Happy Smile */}
            <path
              d="M 86 76 Q 100 94 114 76"
              fill="none"
              stroke={theme.core}
              strokeWidth="6.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* =========================================================
            STATE 6: ERROR (Symmetrical Concerned Eyes)
            ========================================================= */}
        {currentMode === 'error' && (
          <g className="transition-all duration-300">
            {/* Slanted Concerned Eyes on Y=54 */}
            <ellipse cx="60" cy="54" rx="14" ry="16" fill={theme.core} />
            <circle cx="57" cy="49" r="4.5" fill="#ffffff" />
            <ellipse cx="140" cy="54" rx="14" ry="16" fill={theme.core} />
            <circle cx="137" cy="49" r="4.5" fill="#ffffff" />

            {/* Symmetrical Slanted Brows */}
            <path d="M 44 32 L 76 42" stroke={theme.core} strokeWidth="4" strokeLinecap="round" />
            <path d="M 156 32 L 124 42" stroke={theme.core} strokeWidth="4" strokeLinecap="round" />

            {/* Downward Concerned Mouth */}
            <path
              d="M 88 84 Q 100 74 112 84"
              fill="none"
              stroke={theme.core}
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* =========================================================
            STATE 7: FLASHING (Symmetrical Tech Visor Bars)
            ========================================================= */}
        {currentMode === 'flashing' && (
          <g className="transition-all duration-300">
            {/* Tech Visor Bars on Y=44 */}
            <rect x="36" y="44" width="46" height="16" rx="8" fill={theme.core} />
            <rect x="118" y="44" width="46" height="16" rx="8" fill={theme.core} />

            {/* Active Scanning Laser Line */}
            <line
              x1="26"
              y1="52"
              x2="174"
              y2="52"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              className="animate-pulse"
            />

            {/* Focused Straight Mouth */}
            <line x1="88" y1="80" x2="112" y2="80" stroke={theme.core} strokeWidth="4.5" strokeLinecap="round" />
          </g>
        )}
      </svg>

      {/* 3. Screen Specular Glass Curved Reflection */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 35%, transparent 60%)'
        }}
      />
    </div>
  );
};
