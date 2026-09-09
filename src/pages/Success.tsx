/**
 * Success Screen View
 */

import React from 'react';
import { useFlasher } from '../state/flasherStore';
import { ElxieRobot } from '../components/ElxieRobot';
import { SuccessCard } from '../components/SuccessCard';

export const Success: React.FC = () => {
  const { robotExpression } = useFlasher();

  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-6 max-w-lg mx-auto px-4">
      {/* Excited, Happy Robot */}
      <ElxieRobot expression={robotExpression} size="md" statusBadge="UP TO DATE" />

      {/* Success Celebration Card */}
      <SuccessCard />
    </div>
  );
};
