/**
 * Footer Component with Educational & Hardware Notes
 */

import React from 'react';
import { ShieldCheck, Cpu, Cable } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-850 bg-slate-950 py-8 px-4 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        
        {/* Left note */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-medium text-slate-300">ELXIE Educational Robotics</span>
          <span>•</span>
          <span>Safe In-Browser Firmware Installer</span>
        </div>

        {/* Feature Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center space-x-1">
            <Cable className="w-3.5 h-3.5 text-cyan-400" />
            <span>Wired USB Connection</span>
          </div>
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Verified Software Only</span>
          </div>
          <div className="flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Smart Hardware Guard</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-slate-500 font-mono">
          ELXIE © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};
