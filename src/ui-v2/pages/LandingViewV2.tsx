/**
 * Landing Page View
 * 
 * Clean, balanced layout with the authentic ELXIE robot, interactive face overlay,
 * organized status card, and right-side hero text & CTAs.
 */

import React from 'react';
import { useFlasher } from '../../state/flasherStore';
import { AnimatedElxieRobotV2 } from '../components/AnimatedElxieRobotV2';
import { StatusCardV2 } from '../components/StatusCardV2';
import { Cable, ShieldCheck, Cpu, ArrowRight, Play } from 'lucide-react';

export interface LandingViewV2Props {
  onOpenGuide: () => void;
}

export const LandingViewV2: React.FC<LandingViewV2Props> = ({ onOpenGuide }) => {
  const { setStep, robotExpression } = useFlasher();

  const handleConnectClick = () => {
    setStep('connecting');
  };

  return (
    <div className="w-full flex flex-col justify-center items-center py-4 sm:py-8">
      
      {/* Hero Grid Container */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Side: 3D Robot with Face Overlay & Organized Status Panel (Cols 1 to 6) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
          
          {/* Main 3D Robot Container */}
          <div className="w-full flex justify-center items-center">
            <AnimatedElxieRobotV2
              expression={robotExpression || 'happy'}
              size="hero"
              showPlatform={true}
            />
          </div>

          {/* Clean Horizontally Organized Status Card */}
          <div className="w-full flex justify-center pt-1">
            <StatusCardV2 />
          </div>
        </div>

        {/* Right Side: Headlines, Feature Badges, and Action Buttons (Cols 7 to 12) */}
        <div className="lg:col-span-6 text-center lg:text-left space-y-6 max-w-xl mx-auto lg:mx-0 pl-0 lg:pl-4">
          
          {/* Tracked Subtitle */}
          <div className="text-xs font-mono font-bold tracking-[0.3em] text-cyan-400 uppercase">
            ELXIE WEB FLASHER
          </div>

          {/* Main Headline with energetic ELXIE styling */}
          <div className="space-y-1">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-display text-white tracking-tight leading-[1.05]">
              Keep Your
            </h1>
            <div className="relative inline-block">
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-400 italic pr-4">
                ELXIE
              </span>
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black font-display text-white tracking-tight">
                Ready.
              </span>
              {/* Electric blue underline brush accent */}
              <div className="absolute -bottom-2 left-0 w-36 sm:w-44 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent rounded-full shadow-[0_0_12px_#00e5ff]" />
            </div>
          </div>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal pt-2">
            Update your ELXIE software directly from your browser with a simple wired connection.
          </p>

          {/* 3 Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            
            {/* Feature 1 */}
            <div className="ref-glass-pill rounded-2xl p-3 flex items-center space-x-2.5 border border-cyan-500/25">
              <Cable className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight">Wired USB</div>
                <div className="text-[10px] text-slate-400 leading-tight">Connection</div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="ref-glass-pill rounded-2xl p-3 flex items-center space-x-2.5 border border-cyan-500/25">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight">Verified</div>
                <div className="text-[10px] text-slate-400 leading-tight">Software Only</div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="ref-glass-pill rounded-2xl p-3 flex items-center space-x-2.5 border border-cyan-500/25">
              <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight">Smart Hardware</div>
                <div className="text-[10px] text-slate-400 leading-tight">Guard</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-3 justify-center lg:justify-start">
            
            {/* Primary Glowing Gradient CTA */}
            <button
              onClick={handleConnectClick}
              id="hero-connect-btn"
              className="w-full sm:w-auto py-4 px-9 rounded-full font-black text-sm sm:text-base text-slate-950 ref-btn-primary flex items-center justify-center space-x-3 group active:scale-[0.98]"
            >
              <Cable className="w-5 h-5 text-slate-950" />
              <span className="tracking-wide">CONNECT ELXIE</span>
              <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1.5 transition-transform" />
            </button>

            {/* Secondary Watch Guide CTA */}
            <button
              onClick={onOpenGuide}
              className="w-full sm:w-auto py-4 px-7 rounded-full font-bold text-xs sm:text-sm text-slate-200 ref-glass-pill hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center space-x-2.5 border border-cyan-500/30"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span>Watch Guide</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
