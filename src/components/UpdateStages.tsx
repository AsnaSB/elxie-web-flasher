/**
 * Update Stages Checklist Component
 * 
 * Displays visual progression:
 * ✓ Connected
 * ✓ Prepared
 * ✓ Firmware downloaded
 * ● Installing
 * ○ Verifying
 * ○ Restarting
 */

import React from 'react';
import { FlasherStep } from '../state/flasherStore';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface UpdateStagesProps {
  currentStep: FlasherStep;
  className?: string;
}

interface StageItem {
  id: string;
  label: string;
  stepKeys: FlasherStep[];
}

export const UpdateStages: React.FC<UpdateStagesProps> = ({ currentStep, className = '' }) => {
  const stages: StageItem[] = [
    { id: 'connected', label: 'Robot Connected', stepKeys: ['connected', 'checking_firmware', 'select_firmware', 'confirm_update'] },
    { id: 'prepared', label: 'Prepared for Update', stepKeys: ['preparing'] },
    { id: 'downloaded', label: 'Firmware Downloaded', stepKeys: ['downloading'] },
    { id: 'flashing', label: 'Installing Firmware', stepKeys: ['flashing'] },
    { id: 'verifying', label: 'Verifying Installation', stepKeys: ['verifying'] },
    { id: 'restarting', label: 'Restarting ELXIE', stepKeys: ['restarting'] },
  ];

  // Map steps to sequential index for accurate completion status
  const stepHierarchy: Record<FlasherStep, number> = {
    welcome: 0,
    connecting: 1,
    connected: 2,
    checking_firmware: 2,
    select_firmware: 2,
    confirm_update: 2,
    preparing: 3,
    downloading: 4,
    flashing: 5,
    verifying: 6,
    restarting: 7,
    success: 8,
    error: -1,
    recovery: -1,
    guide: -1
  };

  const currentLevel = stepHierarchy[currentStep] ?? 0;

  const getStageStatus = (stageIdx: number): 'completed' | 'active' | 'pending' => {
    // stageIdx: 0=connected(lvl2), 1=prepared(lvl3), 2=downloaded(lvl4), 3=flashing(lvl5), 4=verifying(lvl6), 5=restarting(lvl7)
    const requiredLevel = stageIdx + 2;

    if (currentLevel > requiredLevel) return 'completed';
    if (currentLevel === requiredLevel) return 'active';
    return 'pending';
  };

  return (
    <div className={`w-full bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 ${className}`}>
      <div className="space-y-2.5">
        {stages.map((stage, idx) => {
          const status = getStageStatus(idx);

          return (
            <div key={stage.id} className="flex items-center space-x-3 text-xs sm:text-sm">
              {status === 'completed' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {status === 'active' && (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
              )}
              {status === 'pending' && (
                <Circle className="w-4 h-4 text-slate-600 shrink-0" />
              )}

              <span
                className={`font-medium transition-colors ${
                  status === 'completed'
                    ? 'text-slate-300'
                    : status === 'active'
                    ? 'text-cyan-300 font-semibold'
                    : 'text-slate-500'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
