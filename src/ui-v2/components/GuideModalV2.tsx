/**
 * Guide & Tutorial Modal (V2 Redesign)
 */

import React from 'react';
import { X, Cable, ShieldCheck, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface GuideModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  onStartConnect: () => void;
}

export const GuideModalV2: React.FC<GuideModalV2Props> = ({
  isOpen,
  onClose,
  onStartConnect
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        className="v2-glass-panel rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-cyan-500/30 shadow-2xl relative text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close guide"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            STEP-BY-STEP TUTORIAL
          </span>
          <h2 id="guide-title" className="text-2xl font-bold font-display text-white">
            How to Update Your ELXIE Robot
          </h2>
          <p className="text-sm text-slate-300">
            Updating your robot takes less than 2 minutes using your browser and a wired USB cable.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          {/* Step 1 */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cable className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-white">1. Plug In USB</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect ELXIE to your computer using a data-capable USB-C cable. Make sure the robot is powered on.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-white">2. Select Software</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose the recommended stable firmware version or an experimental preview channel.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-white">3. Auto Install</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The flasher installs and verifies the firmware package, then automatically restarts ELXIE.
            </p>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-cyan-950/30 rounded-2xl p-4 border border-cyan-500/20 flex items-start space-x-3 text-xs text-cyan-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">Smart Hardware Guard:</strong> ELXIE verifies digital checksums before installing. If an update is interrupted, the safety recovery system lets you restore your robot instantly.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              onStartConnect();
            }}
            className="flex-1 py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 hover:from-teal-300 hover:to-cyan-300 shadow-lg shadow-teal-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
          >
            <span>Connect My Robot Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="py-3.5 px-5 rounded-xl font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-700 transition-all"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
