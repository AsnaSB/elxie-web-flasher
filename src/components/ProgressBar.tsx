/**
 * Fluid Animated Progress Bar Component for ELXIE Flasher
 */

import React from 'react';
import { formatBytes } from '../utils/format';
import { FlashProgress } from '../hardware/DeviceTransport';

interface ProgressBarProps {
  progress: FlashProgress | null;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  const percentage = progress?.percentage ?? 0;
  const hasPercentage = typeof progress?.percentage === 'number';

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {/* Label and Percentage counter */}
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="text-slate-300 font-medium">
          {progress?.message || 'Processing update...'}
        </span>
        {hasPercentage && (
          <span className="text-cyan-400 font-bold">{percentage}%</span>
        )}
      </div>

      {/* Progress Track */}
      <div
        role="progressbar"
        aria-valuenow={hasPercentage ? percentage : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={progress?.message || 'Firmware update progress'}
        className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700/80 p-0.5"
      >
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-300 relative shadow-[0_0_12px_rgba(14,165,233,0.6)]"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        >
          {/* Subtle moving shine */}
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>

      {/* Byte details if available */}
      {progress?.bytesWritten && progress?.totalBytes && (
        <div className="flex justify-end text-[11px] font-mono text-slate-400">
          <span>
            {formatBytes(progress.bytesWritten)} / {formatBytes(progress.totalBytes)}
          </span>
        </div>
      )}
    </div>
  );
};
