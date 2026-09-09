import React from 'react';
import { useFlasher } from '../../state/flasherStore';
import { AnimatedElxieRobotV2 } from '../components/AnimatedElxieRobotV2';
import { ArrowLeft, ArrowRight, Cable, AlertCircle, RefreshCw, BookOpen, Smartphone, Monitor, ShieldAlert } from 'lucide-react';

export const ConnectViewV2: React.FC = () => {
  const {
    connectDevice,
    scanAndConnect,
    isConnecting,
    isDemoMode,
    transportSupported,
    capabilities,
    setStep,
    robotExpression
  } = useFlasher();

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-4 space-y-6">
      
      {/* Top Navigation Row */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={() => setStep('welcome')}
          className="text-xs font-semibold text-slate-400 hover:text-cyan-300 flex items-center space-x-1.5 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={() => setStep('guide')}
          className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center space-x-1.5 transition-colors group bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Device Setup Guide</span>
        </button>
      </div>

      {/* Large Centered Robot (Connecting / Happy Expression) */}
      <AnimatedElxieRobotV2
        expression={isConnecting ? 'connecting' : (robotExpression || 'happy')}
        size="lg"
        showPlatform={true}
      />

      {/* Clean Connect Card */}
      <div className="w-full v2-glass-panel rounded-3xl p-6 sm:p-8 space-y-6 text-center border border-cyan-500/20 shadow-2xl">
        
        {/* Title & Guidance */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              WIRED USB PAIRING
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
              {capabilities.isMobile ? (
                <>
                  <Smartphone className="w-3 h-3 text-cyan-400" />
                  <span>{capabilities.isAndroid ? 'Android OTG' : 'Mobile'}</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3 h-3 text-cyan-400" />
                  <span>{capabilities.osName}</span>
                </>
              )}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Connect your ELXIE
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {capabilities.isAndroid
              ? 'Connect your ESP32-S3 to your phone using a USB OTG data cable. Requires a browser with Web Serial API support.'
              : 'Connect your ESP32-S3 using a USB data cable, then click below to pair via Web Serial.'}
          </p>
        </div>

        {/* Compatibility Advisory if unsupported or iOS */}
        {capabilities.isIOS && !isDemoMode && (
          <div className="bg-purple-950/50 border border-purple-500/30 rounded-xl p-3 text-xs text-purple-200 flex items-start space-x-2 text-left">
            <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-purple-300">iOS Direct Flashing Notice</p>
              <p className="text-[11px] text-slate-300">
                Direct hardware flashing is not available in iOS/iPadOS browsers due to platform WebKit restrictions. Please use a desktop computer (Windows/macOS/Linux) or explore Demo Mode.
              </p>
            </div>
          </div>
        )}

        {!transportSupported && !capabilities.isIOS && !isDemoMode && (
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 flex items-start space-x-2 text-left">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-300">Web Serial Support Required</p>
              <p className="text-[11px] text-slate-300">
                This browser does not provide the Web Serial API required for direct ESP32-S3 hardware flashing. Please use a desktop Chromium browser (Google Chrome, Microsoft Edge, Brave, Opera) or test in Demo Mode.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 space-y-3">
          <button
            onClick={connectDevice}
            disabled={isConnecting}
            className="w-full py-4 px-8 rounded-2xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 shadow-[0_0_20px_rgba(32,224,232,0.3)] active:scale-[0.99] transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin" />
                <span>Searching for ELXIE...</span>
              </>
            ) : (
              <>
                <Cable className="w-4 h-4 text-slate-950" />
                <span>CONNECT ELXIE</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Secondary Scan / Retry Button */}
          <div className="flex items-center justify-center space-x-4 pt-1">
            <button
              onClick={scanAndConnect}
              disabled={isConnecting}
              className="text-xs font-mono text-slate-400 hover:text-cyan-300 flex items-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Refresh / Scan Again</span>
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setStep('guide')}
              className="text-xs font-mono text-slate-400 hover:text-cyan-300 flex items-center space-x-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Setup & Driver Help</span>
            </button>
          </div>
        </div>

        {/* Subtle Hint */}
        <div className="text-[11px] font-mono text-slate-400">
          {isDemoMode ? 'Demo Mode active • Simulated USB pairing' : 'Web Serial API connection'}
        </div>
      </div>
    </div>
  );
};
