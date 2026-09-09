/**
 * Success Celebration Card Component
 */

import React, { useEffect } from 'react';
import { useFlasher } from '../state/flasherStore';
import { CheckCircle2, Sparkles, RefreshCw, Check } from 'lucide-react';
import { formatDisplayVersion } from '../utils/version';
import confetti from 'canvas-confetti';

export const SuccessCard: React.FC = () => {
  const {
    installedFirmware,
    selectedFirmware,
    isDemoMode,
    checkForUpdates,
    setStep
  } = useFlasher();

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f5d4', '#00bbf9', '#fee440', '#ffffff']
      });
    } catch {
      // Graceful fallback if canvas-confetti is constrained
    }
  }, []);

  const versionTag = selectedFirmware?.version || installedFirmware || 'v1.3.0';

  return (
    <div className="w-full max-w-lg mx-auto glass-card rounded-2xl p-6 sm:p-8 space-y-6 text-center border-teal-500/40 shadow-[0_0_30px_rgba(0,245,212,0.15)]">
      
      {/* Success Badge */}
      <div className="relative w-20 h-20 mx-auto rounded-3xl bg-teal-950/90 border-2 border-teal-400 flex items-center justify-center shadow-glow-teal">
        <CheckCircle2 className="w-10 h-10 text-teal-300 animate-bounce" />
        <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-400 animate-spin-slow" />
      </div>

      {/* Main Title */}
      <div className="space-y-2" aria-live="polite">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-950 border border-teal-500/50 text-teal-300">
          <Check className="w-3.5 h-3.5 text-teal-400" />
          <span>UPDATE COMPLETED</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
          ELXIE IS READY!
        </h2>

        <p className="text-sm text-slate-300">
          Your robot has been successfully updated to{' '}
          <span className="font-mono font-bold text-teal-300">{formatDisplayVersion(versionTag)}</span>.
        </p>
      </div>

      {/* Demo Warning Pill if active */}
      {isDemoMode && (
        <div className="bg-amber-950/70 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-300 flex items-center justify-center space-x-2 font-mono">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>DEMO MODE — Virtual update simulation completed</span>
        </div>
      )}

      {/* Post-update actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => setStep('connected')}
          className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 hover:from-teal-300 hover:to-cyan-300 shadow-lg shadow-teal-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
        >
          <Check className="w-4 h-4" />
          <span>Done</span>
        </button>

        <button
          onClick={checkForUpdates}
          className="py-3.5 px-5 rounded-xl font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 flex items-center justify-center space-x-2 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Check for Updates</span>
        </button>
      </div>
    </div>
  );
};
