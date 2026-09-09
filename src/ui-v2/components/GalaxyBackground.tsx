/**
 * GalaxyBackground Component (Clean #040714 Futuristic Navy Environment)
 * 
 * Provides a clean, dark futuristic navy environment without distracting lines or curves,
 * matching the exact background tone of the ELXIE reference image.
 */

import React from 'react';
import { FlasherStep } from '../../state/flasherStore';

export interface GalaxyBackgroundProps {
  currentStep?: FlasherStep;
}

export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({ currentStep: _currentStep = 'welcome' }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20 select-none">
      {/* 1. Dark Futuristic Navy Base Color (#040714) */}
      <div className="absolute inset-0 bg-[#040714]" />

      {/* 2. Soft Ambient Radial Navy/Cyan Atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 65% 50% at 30% 50%, rgba(0, 229, 255, 0.04), transparent 70%),
            radial-gradient(ellipse 50% 40% at 80% 30%, rgba(14, 165, 233, 0.03), transparent 60%),
            #040714
          `
        }}
      />

      {/* 3. Subtle Step Lighting Pulse */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: _currentStep === 'flashing'
            ? 'radial-gradient(ellipse 60% 50% at 30% 60%, rgba(0, 229, 255, 0.08), transparent 70%)'
            : _currentStep === 'success'
            ? 'radial-gradient(ellipse 60% 50% at 30% 60%, rgba(0, 245, 212, 0.08), transparent 70%)'
            : _currentStep === 'error' || _currentStep === 'recovery'
            ? 'radial-gradient(ellipse 60% 50% at 30% 60%, rgba(245, 158, 11, 0.06), transparent 70%)'
            : 'transparent'
        }}
      />
    </div>
  );
};
