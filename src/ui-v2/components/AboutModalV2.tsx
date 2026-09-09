/**
 * About ELXIE Modal (V2 Redesign)
 */

import React from 'react';
import { X, Sparkles, ShieldCheck, Heart } from 'lucide-react';

export interface AboutModalV2Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModalV2: React.FC<AboutModalV2Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        className="v2-glass-panel rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-cyan-500/30 shadow-2xl relative text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close about dialog"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-extrabold font-display text-white">ELXIE</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              v1.0.0
            </span>
          </div>
          <p className="text-xs font-mono text-cyan-400">Educational Robotics & Web Flasher</p>
        </div>

        {/* Description */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            ELXIE is an intelligent, programmable educational robotic vehicle designed to make robotics, STEM, and creative coding accessible to students and creators worldwide.
          </p>
          <p>
            The ELXIE Web Flasher provides safe, in-browser firmware management over standard wired USB connection using modern Web Serial and WebUSB standards with automated cryptographic verification and fail-safe recovery.
          </p>
        </div>

        {/* Pillars */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center space-x-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Built-in fail-safe bootloader recovery</span>
          </div>
          <div className="flex items-center space-x-2.5 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Full virtual Demo Mode for offline exploration</span>
          </div>
          <div className="flex items-center space-x-2.5 text-xs text-slate-300">
            <Heart className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Crafted for curious minds and future engineers</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>ELXIE Robotics © 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
