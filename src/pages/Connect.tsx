/**
 * Connect Page Screen
 */

import React from 'react';
import { useFlasher } from '../state/flasherStore';
import { ElxieRobot } from '../components/ElxieRobot';
import { ConnectionCard } from '../components/ConnectionCard';
import { ArrowLeft } from 'lucide-react';

export const Connect: React.FC = () => {
  const { robotExpression, setStep } = useFlasher();

  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-6 max-w-xl mx-auto px-4">
      
      {/* Back button */}
      <div className="w-full max-w-md flex justify-start">
        <button
          onClick={() => setStep('welcome')}
          className="text-xs text-slate-400 hover:text-cyan-300 flex items-center space-x-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Robot Visual */}
      <ElxieRobot expression={robotExpression} size="md" />

      {/* Connection Card */}
      <ConnectionCard />
    </div>
  );
};
