/**
 * Device Connected Dashboard Screen
 */

import React from 'react';
import { useFlasher } from '../state/flasherStore';
import { ElxieRobot } from '../components/ElxieRobot';
import { DeviceStatus } from '../components/DeviceStatus';

export const Device: React.FC = () => {
  const { robotExpression } = useFlasher();

  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-6 max-w-xl mx-auto px-4">
      {/* Robot Visual */}
      <ElxieRobot expression={robotExpression} size="md" statusBadge="ONLINE" />

      {/* Device Status Card */}
      <DeviceStatus />
    </div>
  );
};
