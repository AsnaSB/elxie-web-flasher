/**
 * Update Confirmation Screen
 */

import React from 'react';
import { useFlasher } from '../state/flasherStore';
import { ElxieRobot } from '../components/ElxieRobot';
import { formatDisplayVersion } from '../utils/version';
import { Zap, ArrowLeft, ShieldAlert } from 'lucide-react';

export const Update: React.FC = () => {
  const {
    deviceInfo,
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
    <div className="flex flex-col items-center justify-center py-6 space-y-6 max-w-lg mx-auto px-4">
      
      {/* Back Link */}
      <div className="w-full flex justify-start">
        <button
          onClick={cancelUpdate}
          className="text-xs text-slate-400 hover:text-cyan-300 flex items-center space-x-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Version List</span>
        </button>
      </div>

      {/* Robot Visual */}
      <ElxieRobot expression={robotExpression} size="md" />

      {/* Confirmation Card */}
      <div className="w-full glass-card rounded-2xl p-6 sm:p-8 space-y-6 text-center">
        
        {/* Title */}
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            Ready to Update
          </span>
          <h2 className="text-2xl font-bold font-display text-white">
            {deviceInfo?.displayName || 'ELXIE'}
          </h2>
        </div>

        {/* Version Comparison Box */}
        <div className="grid grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-left">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Current Software</span>
            <span className="text-sm font-mono font-bold text-slate-200">
              {installedFirmware ? formatDisplayVersion(installedFirmware) : 'Unavailable'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-teal-400 block">New Target</span>
            <span className="text-sm font-mono font-bold text-teal-300">
              {formatDisplayVersion(selectedFirmware.version)}
            </span>
          </div>
        </div>

        {/* Cable Caution Notice */}
        <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-3.5 text-xs text-cyan-200 flex items-start space-x-2.5 text-left">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Keep your robot connected via USB cable throughout the update. Do not power off ELXIE.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={startUpdate}
            className="flex-1 py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 hover:from-teal-300 hover:to-cyan-300 shadow-lg shadow-teal-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Start Update</span>
          </button>

          <button
            onClick={cancelUpdate}
            className="py-3.5 px-5 rounded-xl font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
