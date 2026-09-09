/**
 * ELXIE Status Component (Organized & Horizontally Aligned Glass Card)
 * 
 * Displays clean, well-aligned device metrics with high readability.
 */

import React from 'react';
import { useFlasher } from '../../state/flasherStore';
import { BatteryCharging, Cpu, Link2, Sparkles, ShieldCheck } from 'lucide-react';
import { formatDisplayVersion } from '../../utils/version';

export interface StatusCardV2Props {
  className?: string;
}

export const StatusCardV2: React.FC<StatusCardV2Props> = ({ className = '' }) => {
  const {
    deviceInfo,
    installedFirmware,
    isDemoMode,
    step
  } = useFlasher();

  const isConnected = Boolean(
    deviceInfo?.connected ||
    ['connected', 'checking_firmware', 'select_firmware', 'confirm_update', 'preparing', 'downloading', 'flashing', 'verifying', 'restarting', 'success'].includes(step)
  );

  const batteryPercent = isConnected ? (isDemoMode ? '87%' : '—') : '—';
  const firmwareTag = installedFirmware ? formatDisplayVersion(installedFirmware) : (isConnected ? 'v1.2.0' : 'Not connected');
  const modeText = isDemoMode ? 'Demo' : (isConnected ? 'USB' : 'Disconnected');

  return (
    <div className={`ref-glass-card rounded-2xl p-4 sm:p-4.5 w-full max-w-sm sm:max-w-md shadow-2xl border border-cyan-500/30 backdrop-blur-2xl ${className}`}>
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-mono font-bold tracking-widest text-slate-300 uppercase">
            ELXIE STATUS
          </span>
        </div>

        {/* Live Pulse Indicator */}
        <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-cyan-500/20">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected
                ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse'
                : 'bg-slate-500'
            }`}
          />
          <span className={`text-[11px] font-mono font-semibold ${isConnected ? 'text-emerald-300' : 'text-slate-400'}`}>
            {isConnected ? 'Connected' : 'Standby'}
          </span>
        </div>
      </div>

      {/* Horizontally Aligned Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
        
        {/* Metric 1: Battery */}
        <div className="bg-slate-900/70 p-2.5 rounded-xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px] uppercase">
            <BatteryCharging className="w-3 h-3 text-cyan-400" />
            <span>Battery</span>
          </div>
          <span className="font-bold text-cyan-300 text-sm mt-1">{batteryPercent}</span>
        </div>

        {/* Metric 2: Firmware */}
        <div className="bg-slate-900/70 p-2.5 rounded-xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px] uppercase">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>Firmware</span>
          </div>
          <span className="font-bold text-cyan-300 text-sm mt-1 truncate">{firmwareTag}</span>
        </div>

        {/* Metric 3: Mode */}
        <div className="bg-slate-900/70 p-2.5 rounded-xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center space-x-1 text-slate-400 text-[10px] uppercase">
            {isDemoMode ? (
              <Sparkles className="w-3 h-3 text-amber-400" />
            ) : (
              <Link2 className="w-3 h-3 text-cyan-400" />
            )}
            <span>Mode</span>
          </div>
          <span className={`font-bold text-sm mt-1 ${isDemoMode ? 'text-amber-300' : 'text-cyan-300'}`}>
            {modeText}
          </span>
        </div>
      </div>
    </div>
  );
};
