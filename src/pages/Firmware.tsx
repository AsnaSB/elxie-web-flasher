/**
 * Firmware Selection Screen
 */

import React from 'react';
import { VersionSelector } from '../components/VersionSelector';

export const Firmware: React.FC = () => {
  return (
    <div className="py-6 px-4">
      <VersionSelector />
    </div>
  );
};
