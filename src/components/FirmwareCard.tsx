/**
 * Firmware Version Card Item
 */

import React from 'react';
import { FirmwareVersion } from '../firmware/FirmwareManifest';
import { formatBytes, formatDate } from '../utils/format';
import { formatDisplayVersion } from '../utils/version';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

interface FirmwareCardProps {
  version: FirmwareVersion;
  isCurrent?: boolean;
  onSelect: (version: FirmwareVersion) => void;
}

export const FirmwareCard: React.FC<FirmwareCardProps> = ({
  version,
  isCurrent = false,
  onSelect
}) => {
  const getLedBadge = (color?: 'green' | 'blue' | 'red') => {
    switch (color) {
      case 'green':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GREEN BLINK (500ms)</span>
          </span>
        );
      case 'blue':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-blue-950 text-blue-300 border border-blue-500/40 flex items-center space-x-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>BLUE BLINK (500ms)</span>
          </span>
        );
      case 'red':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-rose-950 text-rose-300 border border-rose-500/40 flex items-center space-x-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span>RED BLINK (500ms)</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`glass-card rounded-xl p-5 border transition-all duration-200 ${
        version.recommended
          ? 'border-cyan-500/50 bg-slate-900/90 shadow-[0_0_20px_rgba(14,165,233,0.12)]'
          : version.channel === 'test'
          ? 'border-slate-700 bg-slate-900/60 hover:border-cyan-500/30'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Version Info & Badges */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold font-mono text-white">
              {formatDisplayVersion(version.version)}
            </span>

            {/* Test LED Badge */}
            {getLedBadge(version.ledColor)}

            {version.recommended && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 flex items-center space-x-1 shadow-sm">
                <Sparkles className="w-3 h-3" />
                <span>RECOMMENDED</span>
              </span>
            )}

            {isCurrent && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 flex items-center space-x-1">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>INSTALLED</span>
              </span>
            )}

            {version.channel && version.channel !== 'stable' && version.channel !== 'test' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800/60 uppercase">
                {version.channel}
              </span>
            )}
          </div>

          {/* Description */}
          {version.description && (
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {version.description}
            </p>
          )}

          {/* Release Highlights */}
          {version.highlights && version.highlights.length > 0 && (
            <ul className="text-[11px] text-slate-400 space-y-1 pt-1">
              {version.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-center space-x-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-400" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Metadata */}
          <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-500 pt-1">
            {version.releaseDate && <span>Released {formatDate(version.releaseDate)}</span>}
            {version.fileSize && <span>• {formatBytes(version.fileSize)}</span>}
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 self-end sm:self-center">
          <button
            onClick={() => onSelect(version)}
            className={`py-2.5 px-5 rounded-xl font-semibold text-xs transition-all flex items-center space-x-1.5 ${
              version.recommended
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            <span>Select</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
