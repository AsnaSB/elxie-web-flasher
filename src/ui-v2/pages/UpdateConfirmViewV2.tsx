/**
 * Update Confirmation Screen View (V2 Minimal Galaxy Edition)
 */

import React from 'react';
import { useFlasher } from '../../state/flasherStore';
import { AnimatedElxieRobotV2 } from '../components/AnimatedElxieRobotV2';
import { formatDisplayVersion } from '../../utils/version';
import { Zap, ArrowLeft, ShieldAlert } from 'lucide-react';

export const UpdateConfirmViewV2: React.FC = () => {
  const {
    installedFirmware,
    selectedFirmware,
    startUpdate,
    cancelUpdate,
    robotExpression
  } = useFlasher();

  if (!selectedFirmware) {
    cancelUpdate();
    return null;
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-4 space-y-6">
      
      {/* Back Link */}
      <div className="w-full flex justify-start">
        <button
          onClick={cancelUpdate}
          className="text-xs font-semibold text-slate-400 hover:text-cyan-300 flex items-center space-x-1.5 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Version List</span>
        </button>
      </div>

      {/* Large Focused Robot */}
      <AnimatedElxieRobotV2
        expression={robotExpression}
        size="lg"
        showPlatform={true}
      />

      {/* Confirmation Glass Card */}
      <div className="w-full v2-glass-panel rounded-3xl p-6 sm:p-8 space-y-6 text-center border border-cyan-500/20 shadow-2xl">
        
        {/* Title */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            CONFIRMATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Ready to update ELXIE?
          </h2>
        </div>

        {/* Version Comparison */}
        <div className="grid grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/5 text-left font-mono">
          <div>
            <span className="text-[10px] uppercase text-slate-400 block mb-1">
              Current Version
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-200">
              {installedFirmware ? formatDisplayVersion(installedFirmware) : 'Not available'}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-teal-400 block mb-1">
              New Version
            </span>
            <span className="text-sm sm:text-base font-bold text-cyan-300">
              {formatDisplayVersion(selectedFirmware.version)}
            </span>
          </div>
        </div>

        {/* Concise Warning */}
        <div className="bg-cyan-950/30 border border-cyan-500/20 rounded-2xl p-4 text-xs text-cyan-200 flex items-start space-x-3 text-left">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-slate-300">
            Keep ELXIE connected during the update. Do not disconnect the USB cable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={startUpdate}
            className="flex-1 py-4 px-6 rounded-2xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 shadow-[0_0_20px_rgba(32,224,232,0.3)] active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 text-slate-950" />
            <span>START UPDATE</span>
          </button>

          <button
            onClick={cancelUpdate}
            className="py-4 px-6 rounded-2xl font-semibold text-xs sm:text-sm text-slate-300 bg-slate-900/60 hover:bg-slate-800 hover:text-white border border-white/10 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
