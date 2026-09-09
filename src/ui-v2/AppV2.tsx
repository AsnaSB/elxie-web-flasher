/**
 * ELXIE Web Flasher — V2 Application Root Container (Exact Reference Format)
 * 
 * Faithfully matches the visual format, deep-space background, 3D animated robot,
 * glowing circuit line, and bottom stepper.
 */

import React, { useState } from 'react';
import { useFlasher } from '../state/flasherStore';
import { HeaderV2 } from './components/HeaderV2';
import { WorkflowStepperV2 } from './components/WorkflowStepperV2';
import { GalaxyBackground } from './components/GalaxyBackground';
import { GuideModalV2 } from './components/GuideModalV2';
import { AboutModalV2 } from './components/AboutModalV2';
import { DebugDrawerV2 } from './components/DebugDrawerV2';

import { LandingViewV2 } from './pages/LandingViewV2';
import { ConnectViewV2 } from './pages/ConnectViewV2';
import { DeviceViewV2 } from './pages/DeviceViewV2';
import { FirmwareViewV2 } from './pages/FirmwareViewV2';
import { UpdateConfirmViewV2 } from './pages/UpdateConfirmViewV2';
import { FlashingViewV2 } from './pages/FlashingViewV2';
import { SuccessViewV2 } from './pages/SuccessViewV2';
import { RecoveryViewV2 } from './pages/RecoveryViewV2';
import { DeviceSetupGuideViewV2 } from './pages/DeviceSetupGuideViewV2';
import { Activity } from 'lucide-react';

import './styles/v2-theme.css';

export interface AppV2Props {
  uiVersion: 'v1' | 'v2';
  onToggleUiVersion: () => void;
}

export const AppV2: React.FC<AppV2Props> = ({ uiVersion, onToggleUiVersion }) => {
  const { step, setStep } = useFlasher();

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const renderActiveStep = () => {
    switch (step) {
      case 'welcome':
        return <LandingViewV2 onOpenGuide={() => setIsGuideOpen(true)} />;
      case 'connecting':
        return <ConnectViewV2 />;
      case 'connected':
        return <DeviceViewV2 />;
      case 'checking_firmware':
      case 'select_firmware':
        return <FirmwareViewV2 />;
      case 'confirm_update':
        return <UpdateConfirmViewV2 />;
      case 'preparing':
      case 'downloading':
      case 'flashing':
      case 'verifying':
      case 'restarting':
        return <FlashingViewV2 />;
      case 'success':
        return <SuccessViewV2 />;
      case 'error':
      case 'recovery':
        return <RecoveryViewV2 />;
      case 'guide':
        return <DeviceSetupGuideViewV2 />;
      default:
        return <LandingViewV2 onOpenGuide={() => setIsGuideOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col v2-bg-universe text-slate-100 relative font-sans overflow-x-hidden select-none">
      
      {/* 1. Deep Space Atmosphere Background */}
      <GalaxyBackground currentStep={step} />

      {/* 2. Top Navigation Header */}
      <HeaderV2
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        uiVersion={uiVersion}
        onToggleUiVersion={onToggleUiVersion}
      />

      {/* 3. Main Dynamic Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col justify-between">
        
        {/* Dynamic Step View */}
        <div className="flex-1 flex items-center justify-center my-auto">
          {renderActiveStep()}
        </div>

        {/* 5-Step Workflow Stepper Bar at Bottom */}
        <div className="pt-6 pb-2">
          <WorkflowStepperV2 currentStep={step} />
        </div>
      </main>

      {/* Developer Diagnostics Drawer */}
      <DebugDrawerV2 />

      {/* Modals */}
      <GuideModalV2
        isOpen={isGuideOpen || isHelpOpen}
        onClose={() => {
          setIsGuideOpen(false);
          setIsHelpOpen(false);
        }}
        onStartConnect={() => setStep('connecting')}
      />

      <AboutModalV2
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Reference Footer */}
      <footer className="w-full bg-[#040714]/80 backdrop-blur-md py-3 text-xs font-mono text-slate-400 border-t border-cyan-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center space-x-2 text-slate-400">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">ELXIE Educational Robotics</span>
            <span>•</span>
            <span>Safe In-Browser Firmware Installer</span>
            <span>•</span>
            <span>Built for Curious Minds</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>ELXIE © 2026</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
              v1.0.0
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
