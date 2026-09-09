/**
 * Firmware Selection Screen View (V2 Minimal Galaxy Edition)
 */

import React, { useState, useRef } from 'react';
import { useFlasher } from '../../state/flasherStore';
import { FirmwareVersion, ReleaseChannel } from '../../firmware/FirmwareManifest';
import { formatDisplayVersion } from '../../utils/version';
import { formatBytes, formatDate } from '../../utils/format';
import { ArrowLeft, ArrowRight, Sparkles, Check, Layers, Upload, Activity } from 'lucide-react';

export const FirmwareViewV2: React.FC = () => {
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
  // For the version-selection page, show only the three
  // physical hardware test firmware versions.
  const testVersions = versions.filter(
    (ver) =>
      ver.channel === 'test' &&
      (ver.testVersionKey === 'v1' ||
        ver.testVersionKey === 'v2' ||
        ver.testVersionKey === 'v3')
  );

  const filteredVersions = testVersions.sort((a, b) => {
    const order = { v1: 1, v2: 2, v3: 3 };

    return (
      (order[a.testVersionKey as keyof typeof order] ?? 99) -
      (order[b.testVersionKey as keyof typeof order] ?? 99)
    );
  });

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

  const getLedBadge = (color?: 'green' | 'blue' | 'red') => {
    switch (color) {
      case 'green':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
            <span>GREEN BLINK (500ms)</span>
          </span>
        );
      case 'blue':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-blue-950/80 text-blue-300 border border-blue-500/40 flex items-center space-x-1.5 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_6px_#60a5fa]" />
            <span>BLUE BLINK (500ms)</span>
          </span>
        );
      case 'red':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-rose-950/80 text-rose-300 border border-rose-500/40 flex items-center space-x-1.5 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shadow-[0_0_6px_#fb7185]" />
            <span>RED BLINK (500ms)</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 space-y-6">

      {/* Hidden File Input for Custom .bin */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".bin"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Header & Channels */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setStep('connected')}
            className="text-xs font-semibold text-slate-400 hover:text-cyan-300 flex items-center space-x-1.5 mb-2 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Device</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Select Firmware Version
          </h2>
          <p className="text-xs text-slate-400">
            Currently installed:{' '}
            <span className="font-mono text-cyan-300 font-semibold">
              {installedFirmware ? formatDisplayVersion(installedFirmware) : 'Not available'}
            </span>
          </p>
        </div>

        {/* Channel Filters & Custom Upload Button */}
        <div className="flex items-center space-x-2 self-start sm:self-center flex-wrap gap-y-2">

          {/* Upload Custom .bin Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Upload and flash a custom ESP32-S3 .bin firmware file"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/80 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-800 transition-all shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Validating...' : 'Upload .bin'}</span>
          </button>

          {/* Minimal Channel Filter Tabs */}
          <div
            role="tablist"
            aria-label="Firmware release channels"
            className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10"
          >
            <button
              role="tab"
              aria-selected={activeChannel === 'all'}
              onClick={() => setActiveChannel('all')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${activeChannel === 'all'
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              All
            </button>
            <button
              role="tab"
              aria-selected={activeChannel === 'test'}
              onClick={() => setActiveChannel('test')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center space-x-1 ${activeChannel === 'test'
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <Activity className="w-3 h-3" />
              <span>Test</span>
            </button>
            {/*<button
              role="tab"
              aria-selected={activeChannel === 'stable'}
              onClick={() => setActiveChannel('stable')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                activeChannel === 'stable'
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
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
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Beta
            </button>*/}
          </div>
        </div>
      </div>

      {/* Firmware Releases List */}
      <div className="space-y-3">
        {filteredVersions.length > 0 ? (
          filteredVersions.map((ver: FirmwareVersion) => {
            const isInstalled = installedFirmware === ver.version;
            const isRec = Boolean(ver.recommended);
            const isTest = ver.channel === 'test';

            return (
              <div
                key={ver.version}
                className={`v2-glass-panel rounded-2xl p-5 sm:p-6 border transition-all duration-200 ${isRec
                  ? 'border-cyan-500/40 bg-slate-900/80 shadow-[0_0_20px_rgba(32,224,232,0.1)]'
                  : isTest
                    ? 'border-white/10 hover:border-cyan-500/30'
                    : 'border-white/5 hover:border-white/10'
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  {/* Version Information */}
                  <div className="space-y-1.5 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-bold font-mono text-white">
                        {formatDisplayVersion(ver.version)}
                      </span>

                      {/* Test LED Badge if present */}
                      {getLedBadge(ver.ledColor)}

                      {isRec && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 flex items-center space-x-1">
                          <Sparkles className="w-3 h-3" />
                          <span>RECOMMENDED</span>
                        </span>
                      )}

                      {isInstalled && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 flex items-center space-x-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>INSTALLED</span>
                        </span>
                      )}

                      {ver.channel && ver.channel !== 'stable' && ver.channel !== 'test' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/40 uppercase">
                          {ver.channel}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {ver.description && (
                      <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                        {ver.description}
                      </p>
                    )}

                    {/* Highlights */}
                    {ver.highlights && ver.highlights.length > 0 && (
                      <ul className="text-xs text-slate-400 space-y-0.5 pt-0.5">
                        {ver.highlights.map((h, i) => (
                          <li key={i} className="flex items-center space-x-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${ver.ledColor === 'green' ? 'bg-emerald-400' :
                              ver.ledColor === 'blue' ? 'bg-blue-400' :
                                ver.ledColor === 'red' ? 'bg-rose-400' :
                                  'bg-cyan-400'
                              }`} />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-500 pt-0.5">
                      {ver.releaseDate && <span>Released {formatDate(ver.releaseDate)}</span>}
                      {ver.fileSize && <span>• {formatBytes(ver.fileSize)}</span>}
                      {ver.downloadUrl && (
                        <span>• {ver.downloadUrl.split('/').pop()}</span>
                      )}
                    </div>
                  </div>

                  {/* Select Action */}
                  <div className="shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => selectVersion(ver)}
                      className={`py-2.5 px-5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 ${isRec
                        ? 'bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 text-slate-950 shadow-sm'
                        : isTest
                          ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                        }`}
                    >
                      <span>Select {ver.version}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 v2-glass-panel rounded-2xl text-slate-400 text-xs">
            <Layers className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p>No firmware releases found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
