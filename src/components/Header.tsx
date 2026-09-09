/**
 * Application Header with Mode Badge and Diagnostics Toggle
 */

import React from 'react';
import { ElxieLogo } from './ElxieLogo';
import { useFlasher } from '../state/flasherStore';
import { Terminal, Usb, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    isDemoMode,
    isDebugMode,
    toggleDemoMode,
    toggleDebugMode,
    deviceInfo,
    resetToHome
  } = useFlasher();

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <ElxieLogo onClick={resetToHome} />

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Connection Status Pill if connected */}
          {deviceInfo?.connected && (
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal-950/80 border border-teal-500/40 text-teal-300">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>ELXIE Connected</span>
            </div>
          )}

          {/* Demo Mode Toggle Badge */}
          <button
            onClick={toggleDemoMode}
            title="Click to toggle between Demo Mode and Real Hardware Mode"
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-200 ${
              isDemoMode
                ? 'bg-amber-950/80 border border-amber-500/50 text-amber-300 hover:bg-amber-900/50 shadow-[0_0_10px_rgba(254,228,64,0.15)]'
                : 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/50'
            }`}
          >
            {isDemoMode ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>DEMO MODE</span>
              </>
            ) : (
              <>
                <Usb className="w-3.5 h-3.5 text-cyan-400" />
                <span>HARDWARE MODE</span>
              </>
            )}
          </button>

          {/* Developer Debug Panel Toggle */}
          <button
            onClick={toggleDebugMode}
            aria-label="Toggle developer diagnostic panel"
            title="Toggle Developer Debug Mode"
            className={`p-2 rounded-lg border transition-colors ${
              isDebugMode
                ? 'bg-slate-800 border-cyan-400 text-cyan-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
