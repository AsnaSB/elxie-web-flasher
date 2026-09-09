import React, { useState, useEffect } from 'react';
import { FlasherProvider, useFlasher } from './state/flasherStore';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DebugPanel } from './components/DebugPanel';
import { Landing } from './pages/Landing';
import { Connect } from './pages/Connect';
import { Device } from './pages/Device';
import { Firmware } from './pages/Firmware';
import { Update } from './pages/Update';
import { Flashing } from './pages/Flashing';
import { Success } from './pages/Success';
import { Recovery } from './pages/Recovery';
import { DeviceSetupGuide } from './pages/DeviceSetupGuide';
import { AppV2 } from './ui-v2/AppV2';
import { Layers } from 'lucide-react';

interface VersionSwitchProps {
  uiVersion: 'v1' | 'v2';
  onToggleUiVersion: () => void;
}

const FlasherAppContentV1: React.FC<VersionSwitchProps> = ({ onToggleUiVersion }) => {
  const { step } = useFlasher();

  const renderActiveStep = () => {
    switch (step) {
      case 'welcome':
        return <Landing />;
      case 'connecting':
        return <Connect />;
      case 'connected':
        return <Device />;
      case 'checking_firmware':
      case 'select_firmware':
        return <Firmware />;
      case 'confirm_update':
        return <Update />;
      case 'preparing':
      case 'downloading':
      case 'flashing':
      case 'verifying':
      case 'restarting':
        return <Flashing />;
      case 'success':
        return <Success />;
      case 'error':
      case 'recovery':
        return <Recovery />;
      case 'guide':
        return <DeviceSetupGuide />;
      default:
        return <Landing />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Subtle Background Glow Orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-cyan-600/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[300px] bg-blue-600/5 blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <Header />

      {/* Floating Version Switcher in V1 */}
      <div className="fixed top-20 right-4 z-40">
        <button
          onClick={onToggleUiVersion}
          title="Switch to V2 Redesign UI"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-slate-900/90 text-cyan-300 border border-cyan-500/40 shadow-lg backdrop-blur-md hover:bg-slate-800 transition-all"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Switch to V2 UI</span>
        </button>
      </div>

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex items-center justify-center">
        {renderActiveStep()}
      </main>

      {/* Developer Diagnostic Inspection Panel */}
      <DebugPanel />

      {/* Footer */}
      <Footer />
    </div>
  );
};

const RootAppController: React.FC = () => {
  const [uiVersion, setUiVersion] = useState<'v1' | 'v2'>(() => {
    // Check URL search param first, then localStorage, default to 'v2'
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlVersion = urlParams.get('v');
      if (urlVersion === '1' || urlVersion === 'v1') return 'v1';
      if (urlVersion === '2' || urlVersion === 'v2') return 'v2';
      const stored = localStorage.getItem('elxie_ui_version');
      if (stored === 'v1' || stored === 'v2') return stored;
    }
    return 'v2';
  });

  const toggleUiVersion = () => {
    setUiVersion(prev => {
      const next = prev === 'v2' ? 'v1' : 'v2';
      if (typeof window !== 'undefined') {
        localStorage.setItem('elxie_ui_version', next);
      }
      return next;
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('elxie_ui_version', uiVersion);
    }
  }, [uiVersion]);

  if (uiVersion === 'v1') {
    return <FlasherAppContentV1 uiVersion={uiVersion} onToggleUiVersion={toggleUiVersion} />;
  }

  return <AppV2 uiVersion={uiVersion} onToggleUiVersion={toggleUiVersion} />;
};

export const App: React.FC = () => {
  return (
    <FlasherProvider>
      <RootAppController />
    </FlasherProvider>
  );
};

export default App;

