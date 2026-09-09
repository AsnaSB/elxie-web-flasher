/**
 * Developer Diagnostic & Debug Inspection Panel
 * 
 * Accessible when VITE_DEBUG_MODE=true or toggled via header terminal icon.
 */

import React, { useState } from 'react';
import { useFlasher } from '../state/flasherStore';
import { Terminal, X, Trash2, Zap, Bug, ShieldAlert } from 'lucide-react';
import { logger } from '../utils/logger';

export const DebugPanel: React.FC = () => {
  const {
    isDebugMode,
    toggleDebugMode,
    step,
    isDemoMode,
    deviceInfo,
    selectedFirmware,
    installedFirmware,
    flashProgress,
    logs,
    simulateError
  } = useFlasher();

  const [activeTab, setActiveTab] = useState<'state' | 'logs' | 'simulate'>('state');

  if (!isDebugMode) return null;

  return (
    <aside aria-label="Developer diagnostics" className="fixed bottom-4 right-4 z-50 w-full max-w-md bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden text-xs font-mono text-slate-200">
      
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold">
          <Terminal className="w-4 h-4" />
          <span>Developer Diagnostics</span>
        </div>
        <button
          onClick={toggleDebugMode}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
          title="Close Debug Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/50 text-[11px]">
        <button
          onClick={() => setActiveTab('state')}
          className={`flex-1 py-1.5 px-3 text-center border-b-2 font-medium ${
            activeTab === 'state'
              ? 'border-cyan-400 text-cyan-300 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          State & Hardware
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-1.5 px-3 text-center border-b-2 font-medium ${
            activeTab === 'logs'
              ? 'border-cyan-400 text-cyan-300 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Logs ({logs.length})
        </button>
        <button
          onClick={() => setActiveTab('simulate')}
          className={`flex-1 py-1.5 px-3 text-center border-b-2 font-medium ${
            activeTab === 'simulate'
              ? 'border-cyan-400 text-cyan-300 bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Fault Injection
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 max-h-72 overflow-y-auto space-y-3">
        
        {/* TAB: State */}
        {activeTab === 'state' && (
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Step:</span>
              <span className="font-bold text-cyan-300">{step}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Mode:</span>
              <span className="font-bold text-amber-300">{isDemoMode ? 'Demo Simulator' : 'Physical Hardware'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Device Connected:</span>
              <span className={deviceInfo?.connected ? 'text-emerald-400' : 'text-slate-500'}>
                {deviceInfo?.connected ? 'TRUE' : 'FALSE'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Installed FW:</span>
              <span className="text-slate-200">{installedFirmware || 'None / Unknown'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Selected Target FW:</span>
              <span className="text-slate-200">{selectedFirmware?.version || 'None'}</span>
            </div>
            {flashProgress && (
              <div className="py-1 border-b border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Flash Progress:</span>
                  <span className="text-teal-300">{flashProgress.percentage ?? 'N/A'}%</span>
                </div>
                <div className="text-slate-400 text-[10px] truncate">{flashProgress.message}</div>
              </div>
            )}
          </div>
        )}

        {/* TAB: Logs */}
        {activeTab === 'logs' && (
          <div className="space-y-1.5">
            <div className="flex justify-end pb-1">
              <button
                onClick={() => logger.clear()}
                className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
            {logs.map((log) => (
              <div
                key={log.id}
                className={`text-[10px] p-1.5 rounded ${
                  log.level === 'error'
                    ? 'bg-rose-950/60 text-rose-300 border border-rose-900/50'
                    : log.level === 'warn'
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-900/50'
                    : 'bg-slate-900 text-slate-300'
                }`}
              >
                <span className="text-slate-500 mr-1.5">[{log.timestamp}]</span>
                <span className="font-semibold mr-1 uppercase text-[9px]">{log.level}:</span>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* TAB: Simulate Faults */}
        {activeTab === 'simulate' && (
          <div className="space-y-2">
            <p className="text-[11px] text-slate-400 mb-2">
              Inject simulated hardware faults to test error handling & recovery flows in Demo Mode:
            </p>
            <button
              onClick={() => simulateError('disconnect')}
              disabled={!isDemoMode}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-200 hover:text-rose-300 border border-slate-800 hover:border-rose-700/60 flex items-center space-x-2 text-left disabled:opacity-40"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Simulate Cable Disconnect</span>
            </button>
            <button
              onClick={() => simulateError('flash')}
              disabled={!isDemoMode}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-amber-950 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-700/60 flex items-center space-x-2 text-left disabled:opacity-40"
            >
              <Bug className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Simulate Flash Memory Write Error</span>
            </button>
            <button
              onClick={() => simulateError('verify')}
              disabled={!isDemoMode}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-purple-950 text-slate-200 hover:text-purple-300 border border-slate-800 hover:border-purple-700/60 flex items-center space-x-2 text-left disabled:opacity-40"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Simulate Signature Verify Failure</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
