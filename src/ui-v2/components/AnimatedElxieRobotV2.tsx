/**
 * AnimatedElxieRobotV2 Component
 * 
 * Embeds the authentic ELXIE robot image and positions the interactive
 * ElxieFaceDisplay component overlay precisely over the rectangular physical screen.
 * 
 * Architecture:
 * robot-wrapper (aspect-ratio: 1024 / 768)
 * ├── robot-image
 * └── face-display-overlay
 */

import React from 'react';
import { RobotExpression } from '../../state/flasherStore';
import { ElxieFaceDisplay, ExtendedExpression } from './ElxieFaceDisplay';
import robotImg from '../../assets/robot/elxie-robot.png';

export interface AnimatedElxieRobotV2Props {
  expression: ExtendedExpression | RobotExpression;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showPlatform?: boolean;
  statusBadge?: string;
  className?: string;
}

export const AnimatedElxieRobotV2: React.FC<AnimatedElxieRobotV2Props> = ({
  expression = 'happy',
  size = 'hero',
  showPlatform: _showPlatform = true,
  statusBadge,
  className = ''
}) => {
  // Proportional sizing without squashing or stretching
  const sizeClasses = {
    sm: 'w-60 sm:w-72 max-w-[300px]',
    md: 'w-76 sm:w-88 max-w-[360px]',
    lg: 'w-96 sm:w-[440px] max-w-[460px]',
    hero: 'w-full max-w-[480px] sm:max-w-[540px] md:max-w-[600px] lg:max-w-[640px]'
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${sizeClasses} ${className}`}>
      
      {/* ============================================================
          ROBOT WRAPPER (Preserves 1024x768 aspect ratio strictly)
          ============================================================ */}
      <div
        className="relative w-full aspect-[1024/768] flex items-center justify-center"
        style={{
          // CSS variables for pixel-perfect face alignment
          '--face-left': '38.0%',
          '--face-top': '25.8%',
          '--face-width': '30.2%',
          '--face-height': '20.6%',
          '--face-radius': '10%'
        } as React.CSSProperties}
      >
        
        {/* 1. Authentic Robot Base Image with Clean Dark Navy Background */}
        <img
          src={robotImg}
          alt="ELXIE Robot"
          className="w-full h-full object-contain pointer-events-none select-none"
        />

        {/* 2. Interactive Facial Display Overlay */}
        <div
          className="absolute pointer-events-none overflow-hidden"
          style={{
            left: 'var(--face-left)',
            top: 'var(--face-top)',
            width: 'var(--face-width)',
            height: 'var(--face-height)',
            borderRadius: 'var(--face-radius)',
            boxShadow: '0 0 10px rgba(0, 229, 255, 0.25), inset 0 0 12px rgba(0, 229, 255, 0.15)'
          }}
        >
          <ElxieFaceDisplay expression={expression} />
        </div>

        {/* 3. Subtle Live Antenna Beacon Glow Pulse */}
        <div
          className="absolute pointer-events-none rounded-full blur-md opacity-60 animate-pulse"
          style={{
            left: '48.8%',
            top: '10.5%',
            width: '3.5%',
            height: '4.5%',
            transform: 'translate(-50%, -50%)',
            background: expression === 'error' || expression === 'concerned' ? '#f59e0b' : '#00e5ff'
          }}
        />

        {/* Optional Status Pill Overlay */}
        {statusBadge && (
          <div className="absolute bottom-2 px-3.5 py-1 rounded-full text-[11px] font-mono tracking-wider font-bold bg-[#040714]/90 text-cyan-300 border border-cyan-500/40 shadow-lg backdrop-blur-md">
            {statusBadge}
          </div>
        )}
      </div>
    </div>
  );
};
