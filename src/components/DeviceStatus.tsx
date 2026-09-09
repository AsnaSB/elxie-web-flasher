/**
 * Device Status Component
 * 
 * Displays a clean, friendly status card for the connected ELXIE robot.
 * Technical hardware details are hidden from end users and shown only in Debug Mode.
 */

import React from 'react';
import { useFlasher } from '../state/flasherStore';
import { CheckCircle2, RefreshCw, LogOut, Cpu } from 'lucide-react';
import { formatDisplayVersion } from '../utils/version';

export const DeviceStatus: React.FC = () => {
  const {
    deviceInfo,
    installedFirmware,
    checkForUpdates,
    disconnectDevice,
    isDebugMode,
    isDemoMode,
    step
  } = useFlasher();

  const isChecking = step === 'checking_firmware';

  return (
    <div className="w-full max-w-lg mx-auto glass-card rounded-2xl p-6 sm:p-8 space-y-6">
      
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              {deviceInfo?.displayName || 'ELXIE'}
            </h2>
            <div className="flex items-center space-x-1.5 text-xs text-teal-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Connected</span>
              {isDemoMode && (
                <span className="text-[10px] text-amber-400 font-mono ml-1">(DEMO)</span>
              )}
            </div>
          </div>
        </div>

        {/* Current Software Badge */}
        <div className="text-right">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
            Current Software
          </span>
          <span className="text-sm font-mono font-bold text-cyan-300">
            {installedFirmware ? formatDisplayVersion(installedFirmware) : 'Current version unavailable'}
          </span>
        </div>
      </div>

      {/* Developer Technical Details (Hidden from normal users) */}
      {isDebugMode && deviceInfo?.technicalDetails && (
        <div className="bg-slate-950/90 rounded-xl p-4 border border-cyan-500/20 text-xs font-mono space-y-1.5 text-left">
          <div className="flex items-center space-x-1 text-cyan-400 font-bold mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Developer Hardware Details:</span>
          </div>
          <p className="text-slate-400">
            Hardware: <span className="text-slate-200">{deviceInfo.hardwareRevision || 'Unknown'}</span>
          </p>
          <p className="text-slate-400">
            Serial: <span className="text-slate-200">{deviceInfo.serialNumber || 'N/A'}</span>
          </p>
          {Object.entries(deviceInfo.technicalDetails).map(([key, val]) => (
            <p key={key} className="text-slate-400">
              {key}: <span className="text-cyan-300">{String(val)}</span>
            </p>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={checkForUpdates}
          disabled={isChecking}
          className="flex-1 py-3 px-5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Checking for updates...' : 'Check for Updates'}</span>
        </button>

        <button
          onClick={disconnectDevice}
          className="py-3 px-5 rounded-xl font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 hover:text-white border border-slate-700 flex items-center justify-center space-x-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Disconnect</span>
        </button>
      </div>
    </div>
  );
};
