/**
 * Error & Recovery Card Component
 * 
 * Displays user-friendly, empathetic error states with actionable recovery pathways.
 */

import React from 'react';
import { useFlasher } from '../state/flasherStore';
import { AlertOctagon, RefreshCw, Usb, ArrowLeft, Layers, HelpCircle, Terminal } from 'lucide-react';

export const ErrorCard: React.FC = () => {
  const {
    errorInfo,
    rawError,
    retryLastAction,
    connectDevice,
    checkForUpdates,
    resetToHome,
    isDebugMode
  } = useFlasher();

  const handleAction = (actionType: string) => {
    switch (actionType) {
      case 'reconnect':
        connectDevice();
        break;
      case 'retry':
        retryLastAction();
        break;
      case 'select_version':
        checkForUpdates();
        break;
      case 'home':
      default:
        resetToHome();
        break;
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'reconnect':
        return <Usb className="w-4 h-4" />;
      case 'retry':
        return <RefreshCw className="w-4 h-4" />;
      case 'select_version':
        return <Layers className="w-4 h-4" />;
      case 'home':
      default:
        return <ArrowLeft className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto glass-card rounded-2xl p-6 sm:p-8 space-y-6 text-center">
      
      {/* Alert Icon */}
      <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.2)]">
        <AlertOctagon className="w-8 h-8 text-rose-400 animate-pulse" />
      </div>

      {/* Error Message */}
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
          {errorInfo?.title || 'Something Went Wrong'}
        </h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          {errorInfo?.message || 'ELXIE encountered an unexpected problem.'}
        </p>
      </div>

      {/* Troubleshooting Tip Box */}
      {errorInfo?.troubleshootingTip && (
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 text-left text-xs text-slate-300 flex items-start space-x-3">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-cyan-300 block mb-0.5">Recommended steps:</span>
            <span>{errorInfo.troubleshootingTip}</span>
          </div>
        </div>
      )}

      {/* Developer Raw Error (Debug Mode Only) */}
      {isDebugMode && Boolean(rawError) && (
        <div className="bg-slate-950 rounded-xl p-3 border border-rose-900/50 text-left text-[11px] font-mono text-rose-300 overflow-x-auto">
          <div className="flex items-center space-x-1 text-rose-400 font-bold mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer Stack Info:</span>
          </div>
          <pre>{String(rawError instanceof Error ? rawError.stack || rawError.message : rawError)}</pre>
        </div>
      )}

      {/* Recovery Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {errorInfo?.recoveryActions && errorInfo.recoveryActions.length > 0 ? (
          errorInfo.recoveryActions.map((rec, idx) => (
            <button
              key={idx}
              onClick={() => handleAction(rec.action)}
              className={`flex-1 py-3 px-5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center space-x-2 ${
                rec.isPrimary
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              {getActionIcon(rec.action)}
              <span>{rec.label}</span>
            </button>
          ))
        ) : (
          <button
            onClick={resetToHome}
            className="w-full py-3 px-5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </button>
        )}
      </div>
    </div>
  );
};
