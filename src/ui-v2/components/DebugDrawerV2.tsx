/**
 * Developer Diagnostics Drawer (V2 Redesign)
 */

import React from 'react';
import { useFlasher } from '../../state/flasherStore';
import { X, Terminal, AlertTriangle } from 'lucide-react';

export const DebugDrawerV2: React.FC = () => {
  const {
    isDebugMode,
    toggleDebugMode,
    isDemoMode,
    deviceInfo,
    logs,
    step,
    robotExpression,
    simulateError
  } = useFlasher();

  if (!isDebugMode) return null;

  return (
    <div className="fixed bottom-0 right-0 w-full sm:w-[480px] max-h-[70vh] bg-slate-950/95 border-t sm:border-l border-cyan-500/30 backdrop-blur-2xl z-50 shadow-2xl flex flex-col font-mono text-xs text-left animate-slideUp">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-cyan-400">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4" />
          <span className="font-bold">DEVELOPER DIAGNOSTICS</span>
        </div>
        <button
          onClick={toggleDebugMode}
          className="p-1 rounded text-slate-400 hover:text-white"
          aria-label="Close debug drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        
        {/* Status Snapshot */}
        <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-[11px]">
          <div>
            <span className="text-slate-500 block">Step:</span>
            <span className="text-cyan-300 font-bold">{step}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Robot Expression:</span>
            <span className="text-teal-300 font-bold">{robotExpression}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Mode:</span>
            <span className={isDemoMode ? 'text-amber-400' : 'text-cyan-400'}>
              {isDemoMode ? 'Demo Mode' : 'Hardware Mode'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Device Connected:</span>
            <span className={deviceInfo?.connected ? 'text-emerald-400' : 'text-slate-400'}>
              {deviceInfo?.connected ? 'YES' : 'NO'}
            </span>
          </div>
        </div>

        {/* Demo Error Injection Controls */}
        {isDemoMode && (
          <div className="space-y-2">
            <span className="text-slate-400 font-bold flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Fault Injection:</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => simulateError('disconnect')}
                className="p-2 rounded-lg bg-rose-950/50 border border-rose-800/60 text-rose-300 hover:bg-rose-900/50 text-[10px] text-center"
              >
                Inject Disconnect
              </button>
              <button
                onClick={() => simulateError('flash')}
                className="p-2 rounded-lg bg-amber-950/50 border border-amber-800/60 text-amber-300 hover:bg-amber-900/50 text-[10px] text-center"
              >
                Inject Flash Error
              </button>
              <button
                onClick={() => simulateError('verify')}
                className="p-2 rounded-lg bg-purple-950/50 border border-purple-800/60 text-purple-300 hover:bg-purple-900/50 text-[10px] text-center"
              >
                Inject Verify Error
              </button>
            </div>
          </div>
        )}

        {/* Live Logs Stream */}
        <div className="space-y-1.5">
          <span className="text-slate-400 font-bold block">Live Execution Logs:</span>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 h-36 overflow-y-auto space-y-1 text-[10px]">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div key={log.id} className="leading-tight">
                  <span className="text-slate-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                  <span
                    className={
                      log.level === 'error'
                        ? 'text-rose-400'
                        : log.level === 'warn'
                        ? 'text-amber-400'
                        : 'text-cyan-300'
                    }
                  >
                    {log.message}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-slate-600">No logs captured yet.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
