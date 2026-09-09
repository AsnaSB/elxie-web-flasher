/**
 * Landing Page Screen
 * 
 * Minimalist, visually strong entry view with animated robot.
 */

import React from 'react';
import { useFlasher } from '../state/flasherStore';
import { ElxieRobot } from '../components/ElxieRobot';
import { ArrowRight, Cable } from 'lucide-react';

export const Landing: React.FC = () => {
  const { setStep, robotExpression } = useFlasher();

  return (
    <div className="flex flex-col items-center justify-center text-center py-6 sm:py-12 space-y-8 max-w-2xl mx-auto px-4">
      
      {/* Animated Hero Robot */}
      <div className="pt-2">
        <ElxieRobot expression={robotExpression} size="lg" isMoving={true} />
      </div>

      {/* Main Copy */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
          Keep your robot ready.
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-md mx-auto leading-relaxed">
          Update your ELXIE software directly from your browser with a simple wired connection.
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-2 w-full max-w-xs">
        <button
          onClick={() => setStep('connecting')}
          className="w-full py-4 px-8 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 group"
        >
          <Cable className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>CONNECT ELXIE</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
