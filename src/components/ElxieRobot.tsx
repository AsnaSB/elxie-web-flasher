/**
 * ELXIE Robot Educational Vehicle Visual Component
 * 
 * Renders an animated car-like robot with wheels, chassis, headlights,
 * and an expressive digital OLED face that reacts to application state.
 */

// TODO: Replace placeholder robot visual with the official ELXIE robot artwork.

import React from 'react';
import { RobotFace } from './RobotFace';
import { RobotExpression } from '../state/flasherStore';

interface ElxieRobotProps {
  expression: RobotExpression;
  size?: 'sm' | 'md' | 'lg';
  isMoving?: boolean;
  statusBadge?: string;
}

export const ElxieRobot: React.FC<ElxieRobotProps> = ({
  expression,
  size = 'md',
  isMoving = false,
  statusBadge
}) => {
  const containerSizes = {
    sm: 'w-48 h-36',
    md: 'w-72 h-56',
    lg: 'w-96 h-72'
  }[size];

  const faceSizes: { [key in 'sm' | 'md' | 'lg']: 'sm' | 'md' | 'lg' } = {
    sm: 'sm',
    md: 'md',
    lg: 'lg'
  };

  const getBeaconColor = () => {
    switch (expression) {
      case 'excited':
      case 'happy':
        return '#00f5d4'; // Teal
      case 'working':
      case 'focused':
        return '#00bbf9'; // Cyan
      case 'concerned':
        return '#fee440'; // Amber
      case 'waiting':
        return '#38bdf8';
      default:
        return '#00f5d4';
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${containerSizes}`}>
      {/* Floating chassis container */}
      <div className={`relative flex flex-col items-center transition-transform duration-500 ${isMoving ? 'animate-float' : ''}`}>
        
        {/* Antenna with status beacon */}
        <div className="relative flex flex-col items-center -mb-1 z-10">
          <div
            className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg animate-pulse transition-colors duration-300"
            style={{
              backgroundColor: getBeaconColor(),
              boxShadow: `0 0 14px ${getBeaconColor()}`
            }}
          />
          <div className="w-1 h-4 bg-gradient-to-b from-slate-400 to-slate-600 rounded-t" />
        </div>

        {/* Robot Main Body Chassis */}
        <div className="relative w-56 md:w-64 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 p-3 rounded-2xl border-2 border-cyan-500/40 shadow-2xl z-20">
          
          {/* Top Chassis Highlights & Sensor pods */}
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400/80 animate-ping" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400">ELXIE</span>
            </div>
            {/* Ultrasonic sensor eye-ports */}
            <div className="flex space-x-2">
              <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-cyan-400/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
              </div>
              <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-cyan-400/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
              </div>
            </div>
          </div>

          {/* Front OLED Digital Face Screen */}
          <div className="flex justify-center my-1 relative">
            <RobotFace expression={expression} size={faceSizes[size]} />
            {/* Glossy Screen Reflection Overlay */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />
          </div>

          {/* Front Bumper & Headlights */}
          <div className="flex items-center justify-between px-3 mt-2 pt-2 border-t border-slate-700/60 relative">
            {/* Left Headlight */}
            <div className="relative">
              <div className="w-5 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#38bdf8]" />
              {isMoving && (
                <div className="absolute top-2 -left-4 w-12 h-16 headlight-beam-left pointer-events-none opacity-60" />
              )}
            </div>

            {/* Front Grill / Bumper */}
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>

            {/* Right Headlight */}
            <div className="relative">
              <div className="w-5 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#38bdf8]" />
              {isMoving && (
                <div className="absolute top-2 -right-4 w-12 h-16 headlight-beam-right pointer-events-none opacity-60" />
              )}
            </div>
          </div>
        </div>

        {/* Wheels (Left and Right) with Dynamic Tread Motion */}
        <div className="absolute -bottom-4 w-64 md:w-72 flex justify-between px-1 pointer-events-none z-10">
          {/* Left Wheel */}
          <div className="w-7 h-14 bg-gradient-to-r from-slate-950 via-slate-800 to-slate-900 rounded-lg border border-slate-700 shadow-xl overflow-hidden relative">
            <div className={`w-full h-full flex flex-col justify-around py-1 ${isMoving ? 'animate-tread' : ''}`}>
              <div className="w-full h-1 bg-slate-700/80" />
              <div className="w-full h-1 bg-cyan-500/50 shadow-[0_0_4px_#38bdf8]" />
              <div className="w-full h-1 bg-slate-700/80" />
              <div className="w-full h-1 bg-cyan-500/30" />
            </div>
          </div>

          {/* Right Wheel */}
          <div className="w-7 h-14 bg-gradient-to-l from-slate-950 via-slate-800 to-slate-900 rounded-lg border border-slate-700 shadow-xl overflow-hidden relative">
            <div className={`w-full h-full flex flex-col justify-around py-1 ${isMoving ? 'animate-tread' : ''}`}>
              <div className="w-full h-1 bg-slate-700/80" />
              <div className="w-full h-1 bg-cyan-500/50 shadow-[0_0_4px_#38bdf8]" />
              <div className="w-full h-1 bg-slate-700/80" />
              <div className="w-full h-1 bg-cyan-500/30" />
            </div>
          </div>
        </div>

        {/* Ground Ambient Shadow */}
        <div className="w-48 h-3 bg-cyan-500/10 rounded-full blur-md mt-6" />
      </div>

      {/* Optional Status Floating Pill */}
      {statusBadge && (
        <div className="absolute -bottom-2 px-3 py-0.5 rounded-full text-[11px] font-mono tracking-wider font-semibold bg-slate-900/90 text-cyan-300 border border-cyan-500/30 shadow-md z-30">
          {statusBadge}
        </div>
      )}
    </div>
  );
};
