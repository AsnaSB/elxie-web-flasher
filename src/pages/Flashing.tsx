/**
 * Active Flashing & Installation Screen
 */

import React from 'react';
import { useFlasher } from '../state/flasherStore';
import { ElxieRobot } from '../components/ElxieRobot';
import { ProgressBar } from '../components/ProgressBar';
import { UpdateStages } from '../components/UpdateStages';
import { formatDisplayVersion } from '../utils/version';
import { Cable } from 'lucide-react';

export const Flashing: React.FC = () => {
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
        return 'Downloading Software';
      case 'flashing':
        return 'Updating ELXIE';
      case 'verifying':
        return 'Verifying Firmware';
      case 'restarting':
        return 'Restarting Robot';
      default:
        return 'Updating ELXIE';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-6 max-w-lg mx-auto px-4">
      
      {/* Animated Robot in active working state */}
      <ElxieRobot expression={robotExpression} size="md" isMoving={true} />

      {/* Main Flashing Status Container */}
      <div className="w-full glass-card rounded-2xl p-6 sm:p-8 space-y-6 text-center">
        
        {/* Title */}
        <div className="space-y-1" aria-live="assertive" aria-atomic="true">
          <h2 className="text-2xl font-bold font-display text-white">
            {getStageTitle()}
          </h2>
          <p className="text-xs font-mono text-cyan-300">
            Installing {formatDisplayVersion(selectedFirmware?.version)}
          </p>
        </div>

        {/* Dynamic Progress Bar */}
        <ProgressBar progress={flashProgress} />

        {/* Update Stages Checklist */}
        <UpdateStages currentStep={step} />

        {/* Caution advisory */}
        <div className="flex items-center justify-center space-x-2 text-xs text-amber-300/90 font-mono bg-amber-950/40 border border-amber-500/30 rounded-xl p-3">
          <Cable className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Keep your ELXIE connected and still</span>
        </div>
      </div>
    </div>
  );
};
