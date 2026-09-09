/**
 * Flashing & Installation Screen View (V2 Minimal Galaxy Edition)
 */

import React from 'react';
import { useFlasher } from '../../state/flasherStore';
import { AnimatedElxieRobotV2 } from '../components/AnimatedElxieRobotV2';
import { formatDisplayVersion } from '../../utils/version';
import { formatBytes } from '../../utils/format';
import { CheckCircle2, Circle, Loader2, Cable } from 'lucide-react';

export const FlashingViewV2: React.FC = () => {
  const {
    step,
    flashProgress,
    selectedFirmware,
    robotExpression
  } = useFlasher();

  const getStageTitle = () => {
    switch (step) {
      case 'preparing':
        return 'Preparing ELXIE';
      case 'downloading':
        return 'Downloading firmware';
      case 'flashing':
        return 'Installing firmware';
      case 'verifying':
        return 'Verifying installation';
      case 'restarting':
        return 'Restarting ELXIE';
      default:
        return 'Installing firmware';
    }
  };

  const percentage = flashProgress?.percentage ?? 0;
  const hasPercentage = typeof flashProgress?.percentage === 'number';

  const stages = [
    { id: 'preparing', label: 'Preparing', stepKey: 'preparing' },
    { id: 'downloading', label: 'Downloading', stepKey: 'downloading' },
    { id: 'flashing', label: 'Flashing', stepKey: 'flashing' },
    { id: 'verifying', label: 'Verifying', stepKey: 'verifying' },
    { id: 'restarting', label: 'Restarting', stepKey: 'restarting' },
  ];

  const stepLevels: Record<string, number> = {
    welcome: 0,
    connecting: 0,
    connected: 0,
    checking_firmware: 0,
    select_firmware: 0,
    confirm_update: 0,
    preparing: 1,
    downloading: 2,
    flashing: 3,
    verifying: 4,
    restarting: 5,
    success: 6,
    error: -1,
    recovery: -1
  };

  const currentLevel = stepLevels[step] ?? 0;

  const getStageStatus = (stageIdx: number): 'completed' | 'active' | 'pending' => {
    const requiredLevel = stageIdx + 1;
    if (currentLevel > requiredLevel) return 'completed';
    if (currentLevel === requiredLevel) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-4 space-y-6">
      
      {/* Large Working Robot */}
      <AnimatedElxieRobotV2
        expression={robotExpression}
        size="lg"
        showPlatform={true}
        statusBadge="FLASHING"
      />

      {/* Flashing Console Card */}
      <div className="w-full v2-glass-panel rounded-3xl p-6 sm:p-8 space-y-6 text-center border border-cyan-500/30 shadow-2xl">
        
        {/* Title */}
        <div className="space-y-1" aria-live="assertive" aria-atomic="true">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            {getStageTitle()}
          </h2>
          <p className="text-xs font-mono text-cyan-300">
            Target {formatDisplayVersion(selectedFirmware?.version)}
          </p>
        </div>

        {/* Progress Bar & Counter */}
        <div className="space-y-2 text-left">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300">
              {flashProgress?.message || 'Writing flash memory...'}
            </span>
            {hasPercentage && (
              <span className="text-cyan-300 font-bold text-sm">{percentage}%</span>
            )}
          </div>

          {/* Progress Bar Track */}
          <div
            role="progressbar"
            aria-valuenow={hasPercentage ? percentage : undefined}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={flashProgress?.message || 'Firmware update progress'}
            className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700/80 p-0.5"
          >
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-teal-300 rounded-full transition-all duration-300 shadow-[0_0_15px_#20e0e8]"
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>

          {/* Transferred Bytes */}
          {flashProgress?.bytesWritten && flashProgress?.totalBytes && (
            <div className="flex justify-end text-[11px] font-mono text-slate-400">
              <span>
                Transferred: {formatBytes(flashProgress.bytesWritten)} / {formatBytes(flashProgress.totalBytes)}
              </span>
            </div>
          )}
        </div>

        {/* 5-Stage Linear Checklist */}
        <div className="bg-slate-900/60 rounded-2xl p-4 border border-white/5 text-left space-y-2.5 text-xs sm:text-sm">
          {stages.map((stg, idx) => {
            const status = getStageStatus(idx);
            return (
              <div key={stg.id} className="flex items-center space-x-2.5">
                {status === 'completed' && (
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                )}
                {status === 'active' && (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                )}
                {status === 'pending' && (
                  <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                )}

                <span
                  className={`font-medium font-mono text-xs transition-colors ${
                    status === 'completed'
                      ? 'text-slate-300'
                      : status === 'active'
                      ? 'text-cyan-300 font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  {stg.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Caution Advisory */}
        <div className="flex items-center justify-center space-x-2 text-xs text-amber-300/90 font-mono bg-amber-950/30 border border-amber-500/20 rounded-2xl p-3">
          <Cable className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Keep your robot connected via USB and undisturbed</span>
        </div>
      </div>
    </div>
  );
};
