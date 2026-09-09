/**
 * Device Connected Screen View (V2 Minimal Galaxy Edition)
 */

import React from 'react';
import { useFlasher } from '../../state/flasherStore';
import { AnimatedElxieRobotV2 } from '../components/AnimatedElxieRobotV2';
import { RefreshCw, LogOut, ArrowRight } from 'lucide-react';
import { formatDisplayVersion } from '../../utils/version';

export const DeviceViewV2: React.FC = () => {
  const {
    deviceInfo,
    installedFirmware,
    checkForUpdates,
    disconnectDevice,
    isDemoMode,
    step,
    robotExpression
  } = useFlasher();

  const isChecking = step === 'checking_firmware';
  const displayFirmware = installedFirmware ? formatDisplayVersion(installedFirmware) : 'Not available';
  const batteryStr = isDemoMode ? '87%' : 'Not available';

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-4 space-y-6">
      
      {/* Large Connected Robot (Happy / Friendly) */}
      <AnimatedElxieRobotV2
        expression={robotExpression}
        size="lg"
        showPlatform={true}
        statusBadge="ONLINE"
      />

      {/* Clean Device Information Card */}
      <div className="w-full v2-glass-panel rounded-3xl p-6 sm:p-8 space-y-6 text-center border border-cyan-500/20 shadow-2xl">
        
        {/* Device Status Header */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold flex items-center justify-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span>ELXIE CONNECTED</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            {deviceInfo?.displayName || 'ELXIE Robot'}
          </h2>
        </div>

        {/* Clean Status Details Grid */}
        <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-white/5 text-left text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Connection</span>
            <span className="font-semibold text-slate-200">{isDemoMode ? 'USB (Demo)' : 'Wired USB'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Firmware</span>
            <span className="font-semibold text-cyan-300">{displayFirmware}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Battery</span>
            <span className="font-semibold text-slate-200">{batteryStr}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Status</span>
            <span className="font-semibold text-teal-300">Ready</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={checkForUpdates}
            disabled={isChecking}
            className="flex-1 py-4 px-6 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 shadow-[0_0_20px_rgba(32,224,232,0.3)] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-950 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking...' : 'CHECK FOR UPDATES'}</span>
            {!isChecking && <ArrowRight className="w-4 h-4 text-slate-950" />}
          </button>

          <button
            onClick={disconnectDevice}
            className="py-4 px-6 rounded-2xl font-semibold text-xs sm:text-sm text-slate-300 bg-slate-900/60 hover:bg-slate-800 hover:text-white border border-white/10 transition-all flex items-center justify-center space-x-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      </div>
    </div>
  );
};
