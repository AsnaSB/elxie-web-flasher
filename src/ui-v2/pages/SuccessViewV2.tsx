/**
 * Success Screen View (V2 Minimal Galaxy Edition)
 */

import React, { useEffect } from 'react';
import { useFlasher } from '../../state/flasherStore';
import { AnimatedElxieRobotV2 } from '../components/AnimatedElxieRobotV2';
import { formatDisplayVersion } from '../../utils/version';
import { Check, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SuccessViewV2: React.FC = () => {
  const {
    installedFirmware,
    selectedFirmware,
    isDemoMode,
    checkForUpdates,
    setStep,
    robotExpression
  } = useFlasher();

  // Trigger subtle celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#20e0e8', '#20d6a0', '#5ce7ff', '#ffffff']
      });
    } catch {
      // Fallback
    }
  }, []);

  const versionTag = selectedFirmware?.version || installedFirmware || 'v1.3.0';

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-4 space-y-6">
      
      {/* Large Excited Robot */}
      <AnimatedElxieRobotV2
        expression={robotExpression}
        size="lg"
        showPlatform={true}
        statusBadge="UP TO DATE"
      />

      {/* Success Card */}
      <div className="w-full v2-glass-panel rounded-3xl p-6 sm:p-8 space-y-6 text-center border border-teal-500/30 shadow-2xl">
        
        {/* Title */}
        <div className="space-y-1.5" aria-live="polite">
          <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold flex items-center justify-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
            <span>UPDATE COMPLETED</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            ELXIE IS READY
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Firmware updated successfully to{' '}
            <span className="font-mono font-bold text-teal-300">
              {formatDisplayVersion(versionTag)}
            </span>
          </p>
        </div>

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="text-[11px] font-mono text-amber-400/90 bg-amber-950/30 border border-amber-500/20 rounded-xl p-2.5">
            Demo Mode: Simulated flashing cycle completed
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => setStep('connected')}
            className="flex-1 py-4 px-6 rounded-2xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 shadow-[0_0_20px_rgba(32,224,232,0.3)] active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <Check className="w-4 h-4 text-slate-950" />
            <span>DONE</span>
          </button>

          <button
            onClick={checkForUpdates}
            className="py-4 px-6 rounded-2xl font-semibold text-xs sm:text-sm text-slate-300 bg-slate-900/60 hover:bg-slate-800 hover:text-white border border-white/10 transition-all flex items-center justify-center space-x-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Check for Updates</span>
          </button>
        </div>
      </div>
    </div>
  );
};
