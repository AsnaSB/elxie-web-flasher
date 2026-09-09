/**
 * Firmware Version Selector Component
 */

import React, { useState, useRef } from 'react';
import { useFlasher } from '../state/flasherStore';
import { FirmwareCard } from './FirmwareCard';
import { ReleaseChannel } from '../firmware/FirmwareManifest';
import { VersionComparator } from '../firmware/VersionComparator';
import { formatDisplayVersion } from '../utils/version';
import { Layers, ArrowLeft, Upload, Activity } from 'lucide-react';

export const VersionSelector: React.FC = () => {
  const {
    manifest,
    installedFirmware,
    selectVersion,
    uploadCustomFirmware,
    setStep
  } = useFlasher();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeChannel, setActiveChannel] = useState<ReleaseChannel | 'all'>('all');
  const [isUploading, setIsUploading] = useState(false);

  const versions = manifest?.versions || [];
  const filteredVersions = VersionComparator.filterByChannel(
    VersionComparator.sortVersions(versions),
    activeChannel
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      await uploadCustomFirmware(file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Hidden File Input for Custom .bin */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".bin"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setStep('connected')}
            className="text-xs text-slate-400 hover:text-cyan-300 flex items-center space-x-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Device</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Available ELXIE Software
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Currently installed: <span className="font-mono text-cyan-300 font-semibold">{formatDisplayVersion(installedFirmware || undefined)}</span>
          </p>
        </div>

        {/* Upload & Channel Filter Tabs */}
        <div className="flex items-center space-x-2 self-start sm:self-center flex-wrap gap-y-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Upload and flash a custom ESP32-S3 .bin firmware file"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-800 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Validating...' : 'Upload .bin'}</span>
          </button>

          <div role="tablist" aria-label="Firmware release channels" className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              role="tab"
              aria-selected={activeChannel === 'all'}
              onClick={() => setActiveChannel('all')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                activeChannel === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              role="tab"
              aria-selected={activeChannel === 'test'}
              onClick={() => setActiveChannel('test')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center space-x-1 ${
                activeChannel === 'test'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Test</span>
            </button>
            <button
              role="tab"
              aria-selected={activeChannel === 'stable'}
              onClick={() => setActiveChannel('stable')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                activeChannel === 'stable'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Stable
            </button>
            <button
              role="tab"
              aria-selected={activeChannel === 'beta'}
              onClick={() => setActiveChannel('beta')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                activeChannel === 'beta'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Beta
            </button>
          </div>
        </div>
      </div>

      {/* Version List */}
      <div className="space-y-3">
        {filteredVersions.length > 0 ? (
          filteredVersions.map((ver) => (
            <FirmwareCard
              key={ver.version}
              version={ver}
              isCurrent={installedFirmware === ver.version}
              onSelect={selectVersion}
            />
          ))
        ) : (
          <div className="text-center py-12 glass-card rounded-xl text-slate-400 text-xs">
            <Layers className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p>No firmware releases found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
