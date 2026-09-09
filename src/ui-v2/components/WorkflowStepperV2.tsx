/**
 * WorkflowStepperV2 Component (Exact Reference Layout)
 * 
 * Sleek 5-step workflow glass bar at bottom of the screen:
 * 1. CONNECT (Plug in your ELXIE)
 * 2. DETECT (Device is identified)
 * 3. SELECT (Choose firmware)
 * 4. FLASH (Install & verify)
 * 5. COMPLETE (ELXIE is ready!)
 */

import React from 'react';
import { FlasherStep } from '../../state/flasherStore';
import { Cable, Search, Download, Cpu, CheckCircle2, ChevronRight } from 'lucide-react';

export interface WorkflowStepperV2Props {
  currentStep: FlasherStep;
  className?: string;
}

export const WorkflowStepperV2: React.FC<WorkflowStepperV2Props> = ({
  currentStep,
  className = ''
}) => {
  const getStepIndex = (step: FlasherStep): number => {
    switch (step) {
      case 'welcome':
      case 'connecting':
        return 0; // CONNECT
      case 'connected':
      case 'checking_firmware':
        return 1; // DETECT
      case 'select_firmware':
      case 'confirm_update':
        return 2; // SELECT
      case 'preparing':
      case 'downloading':
      case 'flashing':
      case 'verifying':
      case 'restarting':
        return 3; // FLASH
      case 'success':
        return 4; // COMPLETE
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(currentStep);

  const steps = [
    {
      number: 1,
      label: 'CONNECT',
      sublabel: 'Plug in your ELXIE',
      icon: Cable
    },
    {
      number: 2,
      label: 'DETECT',
      sublabel: 'Device is identified',
      icon: Search
    },
    {
      number: 3,
      label: 'SELECT',
      sublabel: 'Choose firmware',
      icon: Download
    },
    {
      number: 4,
      label: 'FLASH',
      sublabel: 'Install & verify',
      icon: Cpu
    },
    {
      number: 5,
      label: 'COMPLETE',
      sublabel: 'ELXIE is ready!',
      icon: CheckCircle2
    }
  ];

  return (
    <nav
      aria-label="Workflow progress"
      className={`w-full max-w-5xl mx-auto ref-glass-card rounded-3xl p-3.5 sm:p-5 flex items-center justify-between shadow-2xl border border-cyan-500/20 backdrop-blur-2xl ${className}`}
    >
      {steps.map((s, idx) => {
        const isCompleted = activeIndex > idx || (activeIndex === 4 && idx === 4);
        const isActive = activeIndex === idx;
        const IconComponent = s.icon;

        return (
          <React.Fragment key={s.label}>
            {/* Step Capsule */}
            <div className="flex flex-col items-center text-center space-y-1.5 flex-1 px-1 sm:px-2">
              
              {/* Badge & Icon Row */}
              <div className="flex items-center space-x-1.5">
                {/* Number Badge */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_#00e5ff]'
                      : isCompleted
                      ? 'bg-teal-400 text-slate-950'
                      : 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                  }`}
                >
                  {s.number}
                </div>

                {/* Step Icon */}
                <IconComponent
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-cyan-300'
                      : isCompleted
                      ? 'text-teal-400'
                      : 'text-slate-400'
                  }`}
                />
              </div>

              {/* Title */}
              <span
                className={`font-mono text-xs sm:text-sm font-black tracking-wider uppercase transition-colors ${
                  isActive
                    ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]'
                    : isCompleted
                    ? 'text-slate-200'
                    : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>

              {/* Sublabel */}
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:block">
                {s.sublabel}
              </span>
            </div>

            {/* Step Chevron Separator */}
            {idx < steps.length - 1 && (
              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-colors ${
                  activeIndex > idx ? 'text-cyan-400' : 'text-slate-700'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
