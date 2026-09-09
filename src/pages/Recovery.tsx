/**
 * Error & Recovery Screen View
 */

import React from 'react';
import { useFlasher } from '../state/flasherStore';
import { ElxieRobot } from '../components/ElxieRobot';
import { ErrorCard } from '../components/ErrorCard';

export const Recovery: React.FC = () => {
  const { robotExpression } = useFlasher();

  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-6 max-w-lg mx-auto px-4">
      {/* Concerned robot face */}
      <ElxieRobot expression={robotExpression} size="md" statusBadge="ATTENTION" />

      {/* Error & Recovery guidance */}
      <ErrorCard />
    </div>
  );
};
