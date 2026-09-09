/**
 * Device Setup & Driver Guide Page (V1 Minimal Theme)
 */

import React from 'react';
import { useFlasher } from '../state/flasherStore';
import { getDeviceCapabilities } from '../utils/browserCapabilities';
import { ArrowLeft, Cable, Monitor, Smartphone, HelpCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const DeviceSetupGuide: React.FC = () => {
  const { setStep, connectDevice, isConnecting } = useFlasher();
  const capabilities = getDeviceCapabilities();

  return (
    <div className="w-full max-w-3xl mx-auto py-4 space-y-6 text-left">
      
      {/* Back Button */}
      <button
        onClick={() => setStep('connecting')}
        className="text-xs font-semibold text-slate-400 hover:text-cyan-300 flex items-center space-x-1.5 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Connect</span>
      </button>

      {/* Header */}
      <div className="bg-slate-900/90 border border-cyan-500/20 rounded-2xl p-6 space-y-2">
        <h1 className="text-2xl font-bold font-display text-white">
          ESP32-S3 Hardware & Driver Setup Guide
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          Follow these instructions to connect and flash your ESP32-S3 N16R8 development board on Windows, Mac, Linux, or Android.
        </p>
      </div>

      {/* Quick Diagnostics */}
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>System Compatibility Status</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-lg border border-white/5 flex justify-between">
            <span className="text-slate-400">Environment:</span>
            <span className="text-cyan-300">{capabilities.browserName} ({capabilities.osName})</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-white/5 flex justify-between">
            <span className="text-slate-400">Web Serial:</span>
            <span className={capabilities.supportsWebSerial ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {capabilities.supportsWebSerial ? 'Supported' : 'Unavailable'}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-white/5">
          {capabilities.statusMessage}
        </p>
      </div>

      {/* Windows Section */}
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 space-y-3 text-xs text-slate-300">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <Monitor className="w-4 h-4 text-cyan-400" />
          <span>1. Windows 10 & 11 Desktop Setup</span>
        </h2>
        <ol className="list-decimal list-inside space-y-1.5 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-white/5">
          <li>Connect your ESP32-S3 board with a verified USB data cable.</li>
          <li><strong>Native USB Interface:</strong> Automatically recognized by Windows built-in USB CDC driver (<code>usbser.sys</code>) as <em>"USB Serial Device (COMx)"</em> with zero extra drivers needed.</li>
          <li><strong>Secondary USB-UART Bridge:</strong> If using a board with a secondary CP2102 or CH340 chip, the respective vendor driver is required only for that port.</li>
          <li>Return to ELXIE and click <strong>CONNECT ELXIE</strong>.</li>
        </ol>
      </div>

      {/* Android Section */}
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 space-y-3 text-xs text-slate-300">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <span>2. Android Smartphone Setup (USB OTG)</span>
        </h2>
        <ol className="list-decimal list-inside space-y-1.5 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-white/5">
          <li>Ensure your Android device supports USB OTG (enable OTG in Settings if required on OnePlus/Oppo/Realme).</li>
          <li>Connect your ESP32-S3 to your phone using a USB OTG adapter and a verified USB data cable.</li>
          <li>Open ELXIE in a browser that supports the Web Serial API (such as Kiwi Browser).</li>
          <li>Tap <strong>CONNECT ELXIE</strong> and tap <strong>Allow</strong> on the Android USB permission prompt.</li>
        </ol>
        <div className="bg-purple-950/40 border border-purple-500/20 p-3 rounded-xl text-purple-200 text-[11px] flex items-start space-x-2">
          <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span>Note: Direct hardware flashing is not available in iOS/iPadOS browsers due to platform WebKit restrictions. To flash hardware, use an Android device with Web Serial support or a desktop computer.</span>
        </div>
      </div>

      {/* Troubleshooting Section */}
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 space-y-3 text-xs text-slate-300">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>3. Device Not Detected? Quick Troubleshooting</span>
        </h2>
        <div className="space-y-2">
          <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
            <span className="font-bold text-amber-300">Charge-Only Cable:</span> Many cables provide 5V power only without data lines. Switch to a known USB data sync cable.
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
            <span className="font-bold text-cyan-300">Port In Use:</span> Close Arduino IDE Serial Monitor, VS Code, or other serial monitors locking the COM port.
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
            <span className="font-bold text-yellow-300">Recovery Bootloader Mode:</span> If automatic handshake fails: 1. Hold <strong>BOOT</strong>. 2. Tap <strong>RESET</strong>. 3. Release <strong>BOOT</strong>. 4. Click Scan Again.
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setStep('welcome')}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
        >
          Return Home
        </button>
        <button
          onClick={connectDevice}
          disabled={isConnecting}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 shadow-md flex items-center space-x-2 disabled:opacity-50"
        >
          <Cable className="w-4 h-4" />
          <span>Connect Device Now</span>
        </button>
      </div>
    </div>
  );
};
