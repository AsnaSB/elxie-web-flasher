/**
 * Connection Card Component
 * 
 * Guides user to plug in USB cable and initiate connection.
 */

import React from 'react';
import { useFlasher } from '../state/flasherStore';
import { Cable, Usb, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';

export const ConnectionCard: React.FC = () => {
  const {
    connectDevice,
    isConnecting,
    isDemoMode,
    transportSupported
  } = useFlasher();

  return (
    <div className="w-full max-w-md mx-auto glass-card rounded-2xl p-6 sm:p-8 text-center space-y-6">
      
      {/* Visual Cable Icon */}
      <div className="relative w-16 h-16 mx-auto rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shadow-glow-cyan">
        <Usb className="w-8 h-8 text-cyan-400 animate-pulse" />
      </div>

      {/* Heading and Explanatory Text */}
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Connect your ELXIE
        </h2>
        <p className="text-sm text-slate-300">
          Connect your robot using a <span className="text-cyan-300 font-semibold">USB cable</span> to continue.
        </p>
      </div>

      {/* Browser compatibility alert if unsupported */}
      {!transportSupported && !isDemoMode && (
        <div className="bg-amber-950/70 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-200 flex items-start space-x-2 text-left">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Hardware communication requires Google Chrome or Microsoft Edge. Alternatively, switch to Demo Mode above.
          </span>
        </div>
      )}

      {/* Connect CTA Button */}
      <div className="pt-2">
        <button
          onClick={connectDevice}
          disabled={isConnecting}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isConnecting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Waiting for your robot...</span>
            </>
          ) : (
            <>
              <Cable className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Connect ELXIE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>

      {/* Demo Notice */}
      {isDemoMode && (
        <div className="flex items-center justify-center space-x-1.5 text-xs text-amber-400/90 font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Demo Mode: Connects to simulated ELXIE robot</span>
        </div>
      )}
    </div>
  );
};
