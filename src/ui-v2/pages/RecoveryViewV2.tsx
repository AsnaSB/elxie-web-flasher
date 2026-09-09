import React from 'react';
import { useFlasher } from '../../state/flasherStore';
import { AnimatedElxieRobotV2 } from '../components/AnimatedElxieRobotV2';
import { RefreshCw, Usb, ArrowLeft, AlertTriangle, BookOpen, Layers } from 'lucide-react';

export const RecoveryViewV2: React.FC = () => {
  const {
    errorInfo,
    retryLastAction,
    connectDevice,
    resetToHome,
    setStep,
    robotExpression
  } = useFlasher();

  const handleAction = (actionType: string) => {
    switch (actionType) {
      case 'retry':
        retryLastAction();
        break;
      case 'reconnect':
        connectDevice();
        break;
      case 'select_version':
        setStep('select_firmware');
        break;
      case 'guide':
        setStep('guide');
        break;
      case 'home':
      default:
        resetToHome();
        break;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-4 space-y-6">
      
      {/* Large Concerned Robot */}
      <AnimatedElxieRobotV2
        expression={robotExpression}
        size="lg"
        showPlatform={true}
        statusBadge="ATTENTION"
      />

      {/* Reassuring Recovery Card */}
      <div className="w-full v2-glass-panel rounded-3xl p-6 sm:p-8 space-y-6 text-center border border-amber-500/30 shadow-2xl">
        
        {/* Title */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center justify-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>TROUBLESHOOTING & RECOVERY</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            {errorInfo?.title || 'Update interrupted'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {errorInfo?.message || 'Do not panic. Your ESP32-S3 can be recovered safely.'}
          </p>
        </div>

        {/* Actionable Troubleshooting Guidance */}
        {errorInfo?.troubleshootingTip && (
          <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-amber-500/20 text-left text-xs font-mono space-y-2 text-slate-300 whitespace-pre-line leading-relaxed">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Recommended Fix:</span>
            </div>
            <p className="text-slate-300 text-[11px]">{errorInfo.troubleshootingTip}</p>
          </div>
        )}

        {/* Dynamic Action Buttons */}
        <div className="flex flex-wrap gap-2.5 pt-2 justify-center">
          {errorInfo?.recoveryActions && errorInfo.recoveryActions.length > 0 ? (
            errorInfo.recoveryActions.map((act, idx) => (
              <button
                key={idx}
                onClick={() => handleAction(act.action)}
                className={`py-3 px-5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                  act.isPrimary
                    ? 'flex-1 min-w-[140px] text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 shadow-[0_0_20px_rgba(32,224,232,0.3)]'
                    : 'text-slate-300 bg-slate-900/80 hover:bg-slate-800 hover:text-white border border-white/10'
                }`}
              >
                {act.action === 'retry' && <RefreshCw className="w-3.5 h-3.5" />}
                {act.action === 'reconnect' && <Usb className="w-3.5 h-3.5" />}
                {act.action === 'guide' && <BookOpen className="w-3.5 h-3.5 text-cyan-400" />}
                {act.action === 'select_version' && <Layers className="w-3.5 h-3.5" />}
                {act.action === 'home' && <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{act.label}</span>
              </button>
            ))
          ) : (
            <>
              <button
                onClick={retryLastAction}
                className="flex-1 py-3 px-5 rounded-2xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RETRY</span>
              </button>
              <button
                onClick={() => setStep('guide')}
                className="py-3 px-5 rounded-2xl font-semibold text-xs text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/10 transition-all flex items-center justify-center space-x-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>DRIVER GUIDE</span>
              </button>
              <button
                onClick={resetToHome}
                className="py-3 px-5 rounded-2xl font-semibold text-xs text-slate-400 hover:text-slate-200 bg-slate-900/40 border border-white/5 transition-all flex items-center justify-center space-x-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>HOME</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
