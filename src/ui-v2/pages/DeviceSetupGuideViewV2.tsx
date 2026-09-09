/**
 * Device Setup & Driver Guide (V2 Galaxy Edition)
 * 
 * Comprehensive walkthrough for:
 * 1. Before You Start (ESP32-S3 N16R8, USB Data Cable, OTG Adapter)
 * 2. Windows Setup (Device Manager, COM ports, Native USB vs CP210x/CH340 drivers)
 * 3. Android Setup (USB OTG, Phone OTG settings, USB permission dialog)
 * 4. Device Not Detected & Troubleshooting (Cable, Wrong Port, Port Busy, Bootloader Mode)
 * 5. Interactive Capability Verification
 */

import React, { useState } from 'react';
import { useFlasher } from '../../state/flasherStore';
import { getDeviceCapabilities } from '../../utils/browserCapabilities';
import {
  ArrowLeft,
  Cable,
  Monitor,
  Smartphone,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  ShieldAlert,
  Zap
} from 'lucide-react';

export const DeviceSetupGuideViewV2: React.FC = () => {
  const { setStep, connectDevice, isConnecting } = useFlasher();
  const [activeTab, setActiveTab] = useState<'windows' | 'android' | 'troubleshooting' | 'verify'>('windows');

  const capabilities = getDeviceCapabilities();

  return (
    <div className="w-full max-w-4xl mx-auto py-4 space-y-6 text-left">
      
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep('connecting')}
          className="text-xs font-semibold text-slate-400 hover:text-cyan-300 flex items-center space-x-1.5 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Flasher</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-slate-400">Environment:</span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide ${
            capabilities.supportStatus === 'fully_supported'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
              : capabilities.supportStatus === 'partially_supported'
              ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
              : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
          }`}>
            {capabilities.browserName} on {capabilities.osName}
          </span>
        </div>
      </div>

      {/* Main Glass Header Card */}
      <div className="v2-glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-cyan-500/30 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              OFFICIAL HARDWARE SETUP GUIDE
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
              ESP32-S3 Hardware & Driver Setup
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Complete guide for connecting your ESP32-S3 N16R8 board from Windows, macOS, Linux, and Android smartphones.
            </p>
          </div>

          <button
            onClick={connectDevice}
            disabled={isConnecting}
            className="self-start sm:self-center px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 shadow-md active:scale-95 transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Cable className="w-3.5 h-3.5" />
                <span>Connect Device Now</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Interactive Guide Navigation Tabs */}
        <div className="flex items-center space-x-2 pt-2 overflow-x-auto pb-1 border-b border-white/10">
          <button
            onClick={() => setActiveTab('windows')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'windows'
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Windows & Desktop</span>
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'android'
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android Phone (OTG)</span>
          </button>

          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'troubleshooting'
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Troubleshooting</span>
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'verify'
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Capability Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Windows & Desktop Setup */}
      {activeTab === 'windows' && (
        <div className="space-y-4">
          <div className="v2-glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-lg font-bold font-display text-white flex items-center space-x-2">
              <Monitor className="w-5 h-5 text-cyan-400" />
              <span>Windows 10 / 11 Desktop Configuration</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
              <div className="bg-slate-900/80 rounded-xl p-4 border border-white/5 space-y-2">
                <span className="font-bold text-cyan-300 font-mono text-xs uppercase">
                  1. Native USB Port (No Driver Needed)
                </span>
                <p className="text-slate-300">
                  The ESP32-S3 uses a built-in USB Serial/JTAG controller. On Windows 10 and 11, the native USB interface uses the built-in Microsoft USB CDC driver (<code>usbser.sys</code>) with zero external drivers required.
                </p>
                <div className="text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-white/5">
                  Device Manager: <span className="text-emerald-300">Ports (COM & LPT) → USB Serial Device (COMx)</span>
                </div>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-4 border border-white/5 space-y-2">
                <span className="font-bold text-cyan-300 font-mono text-xs uppercase">
                  2. Secondary UART Bridge Port (Optional)
                </span>
                <p className="text-slate-300">
                  If using a dual-port development board connected via its secondary UART bridge port (CP2102 or CH340), the vendor VCP driver is required only for that bridge chip.
                </p>
                <div className="text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-white/5">
                  Device Manager: <span className="text-cyan-300">Silicon Labs CP210x</span> or <span className="text-cyan-300">USB-SERIAL CH340</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Desktop Instructions */}
            <div className="space-y-2 pt-2">
              <h4 className="font-mono text-xs uppercase font-bold text-slate-300">
                Step-by-Step Desktop Flashing Flow
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <li>Plug the ESP32-S3 into your computer using a verified <strong>USB data cable</strong>.</li>
                <li>Open this flasher in a Chromium browser (<strong>Google Chrome</strong>, <strong>Microsoft Edge</strong>, <strong>Brave</strong>, or <strong>Opera</strong>).</li>
                <li>Click <strong>CONNECT ELXIE</strong>.</li>
                <li>In the browser popup, select the port named <strong>"USB Serial Device"</strong> or <strong>"ESP32-S3"</strong>, then click <strong>Connect</strong>.</li>
                <li>Select your firmware version (V1, V2, V3) and click <strong>START UPDATE</strong>.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Android Phone (OTG) Setup */}
      {activeTab === 'android' && (
        <div className="space-y-4">
          <div className="v2-glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-lg font-bold font-display text-white flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-cyan-400" />
              <span>Android Smartphone Flashing Requirements</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Flashing from an Android smartphone requires hardware USB OTG support and a browser that exposes the Web Serial API.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/80 rounded-xl p-3.5 border border-white/5 space-y-1.5">
                <span className="font-bold text-cyan-300 font-mono">1. USB OTG & Data Cable</span>
                <p className="text-slate-400 text-[11px]">
                  Connect your ESP32-S3 via a USB OTG adapter and a verified data cable (ensure OTG is enabled in phone settings if required).
                </p>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-3.5 border border-white/5 space-y-1.5">
                <span className="font-bold text-cyan-300 font-mono">2. Web Serial Browser</span>
                <p className="text-slate-400 text-[11px]">
                  Open ELXIE in an Android browser supporting Web Serial (e.g. Kiwi Browser). Default Android Chrome does not enable Web Serial out-of-the-box.
                </p>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-3.5 border border-white/5 space-y-1.5">
                <span className="font-bold text-cyan-300 font-mono">3. Grant USB Permission</span>
                <p className="text-slate-400 text-[11px]">
                  When Android displays <em>"Allow browser to access USB device?"</em>, tap <strong>OK / Allow</strong>.
                </p>
              </div>
            </div>

            {/* Android Chrome Notice */}
            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-xs space-y-1 text-slate-300">
              <span className="font-bold text-cyan-300 font-mono">Browser Availability Note</span>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Standard Google Chrome for Android currently leaves Web Serial disabled by default. If using Chrome on Android, Web Serial may be enabled experimentally via <code>chrome://flags#enable-web-serial</code>, though this is browser-dependent. For guaranteed direct flashing, use Kiwi Browser or a desktop computer.
              </p>
            </div>

            {/* iOS Notice Box */}
            <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 text-xs text-purple-200 space-y-1.5">
              <span className="font-bold flex items-center space-x-1.5 text-purple-300 font-mono">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>Notice Regarding Apple iOS (iPhone & iPad)</span>
              </span>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Direct hardware flashing is not available in iOS/iPadOS browsers due to platform WebKit restrictions. To flash your ESP32-S3, please use an Android device with Web Serial support or a desktop computer.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Troubleshooting Scenarios */}
      {activeTab === 'troubleshooting' && (
        <div className="space-y-4">
          <div className="v2-glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-lg font-bold font-display text-white flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>Common Connection Issues & Fixes</span>
            </h3>

            <div className="space-y-3 text-xs">
              
              {/* Scenario 1 */}
              <div className="bg-slate-900/80 rounded-xl p-4 border border-white/5 space-y-1.5">
                <span className="font-bold text-amber-300 font-mono flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Issue 1: "No ESP32-S3 Detected" / Port List Empty</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Cause:</strong> The USB cable is a charging-only cable (lacking D+ / D- data wires) or the board is plugged into an unpowered USB hub.
                </p>
                <p className="text-slate-400 text-[11px]">
                  <strong>Fix:</strong> Switch to a verified data sync cable that supports file transfer, and plug directly into your computer or phone OTG port.
                </p>
              </div>

              {/* Scenario 2 */}
              <div className="bg-slate-900/80 rounded-xl p-4 border border-white/5 space-y-1.5">
                <span className="font-bold text-amber-300 font-mono flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Issue 2: ESP32-S3 Has Two USB Ports</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Cause:</strong> On DevKitC-1 boards with two USB-C connectors, one connects to Native USB and the other to the UART bridge.
                </p>
                <p className="text-slate-400 text-[11px]">
                  <strong>Fix:</strong> Connect to the Native USB port (usually labeled "USB"). If using the "UART" port, ensure appropriate CP210x/CH340 drivers are present.
                </p>
              </div>

              {/* Scenario 3 */}
              <div className="bg-slate-900/80 rounded-xl p-4 border border-white/5 space-y-1.5">
                <span className="font-bold text-amber-300 font-mono flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Issue 3: "Serial Port Already Open / Busy"</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Cause:</strong> Another application is holding an exclusive lock on the COM port.
                </p>
                <p className="text-slate-400 text-[11px]">
                  <strong>Fix:</strong> Close Arduino IDE Serial Monitor, VS Code Serial Monitor, PuTTY, or other browser flasher tabs, then click "Scan Again".
                </p>
              </div>

              {/* Scenario 4 */}
              <div className="bg-slate-900/80 rounded-xl p-4 border border-white/5 space-y-1.5">
                <span className="font-bold text-amber-300 font-mono flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Issue 4: Recovery Bootloader Sequence</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>When to use:</strong> If the ESP32-S3 times out during synchronization or fails to respond to automatic software reset.
                </p>
                <p className="text-slate-400 text-[11px]">
                  <strong>Procedure:</strong> 1. Press and hold the <strong>BOOT</strong> (GPIO 0) button. 2. Press and release the <strong>RESET</strong> (EN) button. 3. Release the <strong>BOOT</strong> button. 4. Return to ELXIE and click "Scan Again".
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Interactive Capability Diagnostics */}
      {activeTab === 'verify' && (
        <div className="space-y-4">
          <div className="v2-glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-lg font-bold font-display text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              <span>Live Browser & Hardware Capabilities</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">Web Serial API:</span>
                <span className={capabilities.supportsWebSerial ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {capabilities.supportsWebSerial ? 'AVAILABLE ✓' : 'UNAVAILABLE ✗'}
                </span>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">WebUSB API:</span>
                <span className={capabilities.supportsWebUSB ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {capabilities.supportsWebUSB ? 'AVAILABLE ✓' : 'UNAVAILABLE ✗'}
                </span>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">Operating System:</span>
                <span className="text-cyan-300 font-bold">{capabilities.osName}</span>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">Browser:</span>
                <span className="text-cyan-300 font-bold">{capabilities.browserName}</span>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/5 flex items-center justify-between sm:col-span-2">
                <span className="text-slate-400">Hardware Flashing Status:</span>
                <span className={`font-bold ${
                  capabilities.canFlashDirectly ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {capabilities.canFlashDirectly ? 'READY FOR HARDWARE FLASHING' : 'DEMO MODE AVAILABLE'}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-white">System Advisory:</span>
              <p>{capabilities.statusMessage}</p>
              <p className="text-cyan-300 font-mono text-[11px] pt-1">{capabilities.recommendedAction}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-slate-900/90 to-cyan-950/60 p-4 sm:p-5 rounded-2xl border border-cyan-500/30">
        <div className="text-xs text-slate-300 text-center sm:text-left">
          <span className="font-bold text-white block">Ready to connect your ESP32-S3?</span>
          <span>Ensure your USB data cable is connected and click Connect below.</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStep('welcome')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Return Home
          </button>

          <button
            onClick={connectDevice}
            disabled={isConnecting}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Cable className="w-3.5 h-3.5" />
            <span>Connect ELXIE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
