/**
 * Header Component (Exact Reference Layout)
 * 
 * Clean top navigation bar matching the reference image.
 */

import React, { useState } from 'react';
import { useFlasher } from '../../state/flasherStore';
import { Home, BookOpen, Info, Sparkles, Usb, Sun, HelpCircle, ChevronDown } from 'lucide-react';

export interface HeaderV2Props {
  onOpenGuide: () => void;
  onOpenAbout: () => void;
  onOpenHelp: () => void;
  uiVersion: 'v1' | 'v2';
  onToggleUiVersion: () => void;
}

export const HeaderV2: React.FC<HeaderV2Props> = ({
  onOpenGuide,
  onOpenAbout,
  onOpenHelp,
  uiVersion,
  onToggleUiVersion
}) => {
  const {
    isDemoMode,
    toggleDemoMode,
    resetToHome,
    step
  } = useFlasher();

  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);

  return (
    <header className="w-full bg-[#040714]/60 backdrop-blur-xl sticky top-0 z-40 border-b border-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Glowing Robot Brandmark */}
        <button
          onClick={resetToHome}
          className="flex items-center space-x-3 group text-left focus:outline-none"
        >
          {/* Cyan Glowing Robot Face Icon */}
          <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center group-hover:border-cyan-400 transition-colors">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
              <circle cx="12" cy="3.5" r="1.5" fill="#00e5ff" />
              <line x1="12" y1="5" x2="12" y2="7.5" stroke="#00e5ff" strokeWidth="1.5" />
              <rect x="3.5" y="7.5" width="17" height="13" rx="3.5" fill="#070c1e" stroke="#00e5ff" strokeWidth="1.5" />
              <circle cx="8.5" cy="13" r="1.5" fill="#00e5ff" />
              <circle cx="15.5" cy="13" r="1.5" fill="#00e5ff" />
              <path d="M 9.5 16.5 Q 12 18 14.5 16.5" stroke="#00e5ff" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black font-display tracking-wide text-white group-hover:text-cyan-200 transition-colors">
                ELXIE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>
            <div className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
              WEB FLASHER
            </div>
          </div>
        </button>

        {/* Center: Navigation Pill Tabs */}
        <nav className="hidden md:flex items-center space-x-3">
          
          {/* Home Pill */}
          <button
            onClick={resetToHome}
            className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              step === 'welcome'
                ? 'bg-slate-900/90 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span>Home</span>
          </button>

          {/* Guide Pill */}
          <button
            onClick={onOpenGuide}
            className="flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900/60 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>

          {/* About Pill */}
          <button
            onClick={onOpenAbout}
            className="flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900/60 transition-all"
          >
            <Info className="w-3.5 h-3.5" />
            <span>About</span>
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Demo Mode Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => setIsDemoDropdownOpen(prev => !prev)}
              className="flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wide transition-all ref-glass-pill text-cyan-300 hover:border-cyan-400/60 shadow-lg"
            >
              {isDemoMode ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Demo Mode</span>
                </>
              ) : (
                <>
                  <Usb className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Hardware Mode</span>
                </>
              )}
              <ChevronDown className="w-3.5 h-3.5 opacity-70 ml-0.5" />
            </button>

            {/* Dropdown Options */}
            {isDemoDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 ref-glass-card rounded-2xl p-1.5 z-50 shadow-2xl text-xs font-mono">
                <button
                  onClick={() => {
                    if (!isDemoMode) toggleDemoMode();
                    setIsDemoDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2 transition-colors ${
                    isDemoMode ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Demo Mode</span>
                </button>

                <button
                  onClick={() => {
                    if (isDemoMode) toggleDemoMode();
                    setIsDemoDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2 transition-colors mt-1 ${
                    !isDemoMode ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Usb className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Hardware Mode</span>
                </button>
              </div>
            )}
          </div>

          {/* Theme Indicator */}
          <button
            aria-label="Theme"
            className="p-2.5 rounded-full ref-glass-pill text-slate-300 hover:text-white transition-colors"
          >
            <Sun className="w-4 h-4" />
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold ref-glass-pill text-slate-300 hover:text-white transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </button>

          {/* UI Version Switcher */}
          <button
            onClick={onToggleUiVersion}
            title={`Switch to UI ${uiVersion === 'v2' ? 'V1 (Classic)' : 'V2 (Reference)'}`}
            className="px-2.5 py-1 rounded-full text-[10px] font-mono text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
          >
            <span className="text-cyan-400 font-bold uppercase">{uiVersion}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
