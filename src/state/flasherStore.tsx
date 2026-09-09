/**
 * Centralized Update State Machine and Store for ELXIE Web Flasher
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { DeviceInfo, DeviceTransport, FlashProgress } from '../hardware/DeviceTransport';
import { MockDeviceTransport } from '../hardware/MockDeviceTransport';
import { ElxieDeviceTransport } from '../hardware/ElxieDeviceTransport';
import { DeviceManager } from '../hardware/DeviceManager';
import { FirmwareService } from '../firmware/FirmwareService';
import { FirmwareManifest, FirmwareVersion } from '../firmware/FirmwareManifest';
import { Flasher } from '../hardware/Flasher';
import { ElxieError, FriendlyErrorInfo, getFriendlyErrorInfo } from '../utils/errors';
import { logger, LogEntry } from '../utils/logger';

import { getDeviceCapabilities, DeviceCapabilities } from '../utils/browserCapabilities';

export type FlasherStep =
  | 'welcome'
  | 'connecting'
  | 'connected'
  | 'checking_firmware'
  | 'select_firmware'
  | 'confirm_update'
  | 'preparing'
  | 'downloading'
  | 'flashing'
  | 'verifying'
  | 'restarting'
  | 'success'
  | 'error'
  | 'recovery'
  | 'guide';

export type RobotExpression =
  | 'friendly'
  | 'curious'
  | 'happy'
  | 'focused'
  | 'working'
  | 'thinking'
  | 'waiting'
  | 'excited'
  | 'concerned';

export interface FlasherState {
  step: FlasherStep;
  isConnecting: boolean;
  isDemoMode: boolean;
  isDebugMode: boolean;
  deviceInfo: DeviceInfo | null;
  manifest: FirmwareManifest | null;
  selectedFirmware: FirmwareVersion | null;
  selectedFirmwareVersion?: 'v1' | 'v2' | 'v3' | string;
  installedFirmware: string | null;
  flashProgress: FlashProgress | null;
  errorInfo: FriendlyErrorInfo | null;
  rawError: unknown | null;
  logs: LogEntry[];
  robotExpression: RobotExpression;
  transportSupported: boolean;
  capabilities: DeviceCapabilities;
}

export interface FlasherActions {
  setStep: (step: FlasherStep) => void;
  toggleDemoMode: () => void;
  toggleDebugMode: () => void;
  connectDevice: () => Promise<void>;
  scanAndConnect: () => Promise<void>;
  disconnectDevice: () => Promise<void>;
  checkForUpdates: () => Promise<void>;
  selectVersion: (version: FirmwareVersion) => void;
  selectTestVersion: (key: 'v1' | 'v2' | 'v3') => void;
  uploadCustomFirmware: (file: File) => Promise<void>;
  startUpdate: () => Promise<void>;
  cancelUpdate: () => void;
  retryLastAction: () => Promise<void>;
  resetToHome: () => void;
  openGuide: () => void;
  simulateError: (type: 'disconnect' | 'flash' | 'verify') => void;
}

const FlasherContext = createContext<(FlasherState & FlasherActions) | null>(null);

export const FlasherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize configuration from environment (Defaulting to Demo Mode for instant usability if specified or true)
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const envVal = import.meta.env.VITE_DEMO_MODE;
    return envVal === undefined ? false : envVal === 'true';
  });

  const [isDebugMode, setIsDebugMode] = useState<boolean>(() => {
    return import.meta.env.VITE_DEBUG_MODE === 'true';
  });

  const [step, setStep] = useState<FlasherStep>('welcome');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [manifest, setManifest] = useState<FirmwareManifest | null>(null);
  const [selectedFirmware, setSelectedFirmware] = useState<FirmwareVersion | null>(null);
  const [installedFirmware, setInstalledFirmware] = useState<string | null>(null);
  const [flashProgress, setFlashProgress] = useState<FlashProgress | null>(null);
  const [errorInfo, setErrorInfo] = useState<FriendlyErrorInfo | null>(null);
  const [rawError, setRawError] = useState<unknown | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>(() => logger.getEntries());

  const stepRef = useRef<FlasherStep>(step);
  stepRef.current = step;

  // Selected test version identifier ('v1' | 'v2' | 'v3' | string)
  const selectedFirmwareVersion = selectedFirmware?.testVersionKey || selectedFirmware?.version;

  // Instantiate transport and services based on active mode
  const transport = useMemo<DeviceTransport>(() => {
    return isDemoMode ? new MockDeviceTransport() : new ElxieDeviceTransport();
  }, [isDemoMode]);

  const firmwareService = useMemo<FirmwareService>(() => {
    return new FirmwareService(isDemoMode);
  }, [isDemoMode]);

  // Subscribe to logger
  useEffect(() => {
    return logger.subscribe((newEntry) => {
      setLogs(prev => [newEntry, ...prev.slice(0, 199)]);
    });
  }, []);

  // Compute reactive robot facial expression based on state
  const robotExpression = useMemo<RobotExpression>(() => {
    if (isConnecting) return 'curious';

    switch (step) {
      case 'welcome':
        return 'friendly';
      case 'connecting':
        return 'curious';
      case 'connected':
        return 'happy';
      case 'checking_firmware':
        return 'thinking';
      case 'select_firmware':
        return 'friendly';
      case 'confirm_update':
        return 'focused';
      case 'preparing':
      case 'downloading':
        return 'focused';
      case 'flashing':
        return 'working';
      case 'verifying':
        return 'thinking';
      case 'restarting':
        return 'waiting';
      case 'success':
        return 'excited';
      case 'error':
      case 'recovery':
        return 'concerned';
      default:
        return 'friendly';
    }
  }, [step, isConnecting]);

  // Unified Error Dispatcher
  const handleError = useCallback((err: unknown) => {
    logger.error("Flasher State Error:", { error: String(err) });
    const friendly = getFriendlyErrorInfo(err);
    setErrorInfo(friendly);
    setRawError(err);
    setStep('error');
  }, []);

  // Device Manager setup
  const deviceManager = useMemo<DeviceManager>(() => {
    return new DeviceManager(transport, {
      onDeviceInfo: (info) => {
        setDeviceInfo(info);
        if (info?.firmwareVersion) {
          setInstalledFirmware(info.firmwareVersion);
        }
      },
      onDisconnect: () => {
        setDeviceInfo(null);
        const currentStep = stepRef.current;
        // If disconnected during flashing, handle with recovery state
        if (['preparing', 'downloading', 'flashing', 'verifying', 'restarting'].includes(currentStep)) {
          handleError(new ElxieError('DEVICE_DISCONNECTED'));
        } else {
          setStep('welcome');
        }
      },
      onError: (err) => {
        handleError(err);
      }
    });
  }, [transport, handleError]);

  const capabilities = useMemo(() => getDeviceCapabilities(), []);

  // Connect flow
  const connectDevice = useCallback(async () => {
    try {
      setIsConnecting(true);
      setErrorInfo(null);
      const info = await deviceManager.requestAndConnect();
      setDeviceInfo(info);
      if (info.firmwareVersion) {
        setInstalledFirmware(info.firmwareVersion);
      }
      setStep('connected');
    } catch (err) {
      handleError(err);
    } finally {
      setIsConnecting(false);
    }
  }, [deviceManager, handleError]);

  // Dedicated Scan & Connect action (clears previous errors without page reload)
  const scanAndConnect = useCallback(async () => {
    setErrorInfo(null);
    setRawError(null);
    logger.info("Retrying device scan and connection...");
    await connectDevice();
  }, [connectDevice]);

  const openGuide = useCallback(() => {
    setStep('guide');
  }, []);

  // Disconnect flow
  const disconnectDevice = useCallback(async () => {
    try {
      await deviceManager.disconnect();
      setDeviceInfo(null);
      setSelectedFirmware(null);
      setStep('welcome');
    } catch (err) {
      handleError(err);
    }
  }, [deviceManager, handleError]);

  // Check for updates
  const checkForUpdates = useCallback(async () => {
    try {
      setStep('checking_firmware');
      const manifestData = await firmwareService.getManifest();
      setManifest(manifestData);
      
      // Auto-select recommended or latest version
      const recommended = manifestData.versions.find(v => v.recommended) || manifestData.versions[0];
      setSelectedFirmware(recommended || null);

      setStep('select_firmware');
    } catch (err) {
      handleError(err);
    }
  }, [firmwareService, handleError]);

  // Select firmware version
  const selectVersion = useCallback((version: FirmwareVersion) => {
    setSelectedFirmware(version);
    setStep('confirm_update');
  }, []);

  // Select test firmware version ('v1' | 'v2' | 'v3')
  const selectTestVersion = useCallback((key: 'v1' | 'v2' | 'v3') => {
    const testVersion = firmwareService.getTestFirmwareVersion(key);
    setSelectedFirmware(testVersion);
    setStep('confirm_update');
  }, [firmwareService]);

  // Upload custom .bin firmware
  const uploadCustomFirmware = useCallback(async (file: File) => {
    try {
      const customVersion = await firmwareService.validateAndLoadCustomFirmware(file);
      setSelectedFirmware(customVersion);
      setStep('confirm_update');
    } catch (err) {
      handleError(err);
    }
  }, [firmwareService, handleError]);

  // Start Update
  const startUpdate = useCallback(async () => {
    if (!selectedFirmware) {
      handleError(new ElxieError('FIRMWARE_NOT_FOUND', 'No firmware version selected for update.'));
      return;
    }

    try {
      setStep('preparing');
      const flasher = new Flasher({
        transport,
        firmwareService,
        onProgress: (progress) => {
          setFlashProgress(progress);
          if (progress.stage === 'flashing') setStep('flashing');
          else if (progress.stage === 'verifying') setStep('verifying');
          else if (progress.stage === 'restarting') setStep('restarting');
          else if (progress.stage === 'downloading') setStep('downloading');
        }
      });

      await flasher.updateFirmware(selectedFirmware);
      setInstalledFirmware(selectedFirmware.version);
      setStep('success');
    } catch (err) {
      handleError(err);
    }
  }, [selectedFirmware, transport, firmwareService, handleError]);

  const cancelUpdate = useCallback(() => {
    setStep('select_firmware');
  }, []);

  const resetToHome = useCallback(() => {
    setStep('welcome');
    setErrorInfo(null);
    setFlashProgress(null);
  }, []);

  const retryLastAction = useCallback(async () => {
    setErrorInfo(null);
    if (!deviceInfo) {
      await connectDevice();
    } else if (!manifest) {
      await checkForUpdates();
    } else if (selectedFirmware) {
      await startUpdate();
    } else {
      setStep('welcome');
    }
  }, [deviceInfo, manifest, selectedFirmware, connectDevice, checkForUpdates, startUpdate]);

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode(prev => {
      const next = !prev;
      logger.info(`Mode toggled to: ${next ? 'DEMO MODE' : 'REAL HARDWARE MODE'}`);
      return next;
    });
    // Reset connection when switching modes
    setDeviceInfo(null);
    setStep('welcome');
  }, []);

  const toggleDebugMode = useCallback(() => {
    setIsDebugMode(prev => !prev);
  }, []);

  // Diagnostic helper for triggering simulated failures in demo
  const simulateError = useCallback((type: 'disconnect' | 'flash' | 'verify') => {
    if (transport instanceof MockDeviceTransport) {
      if (type === 'disconnect') {
        transport.simulateDisconnect = true;
      } else if (type === 'flash') {
        transport.simulateFlashError = true;
      } else if (type === 'verify') {
        transport.simulateVerifyError = true;
      }
      logger.warn(`Diagnostic: Triggered mock error injection for '${type}'`);
    }
  }, [transport]);

  const value = {
    step,
    isConnecting,
    isDemoMode,
    isDebugMode,
    deviceInfo,
    manifest,
    selectedFirmware,
    selectedFirmwareVersion,
    installedFirmware,
    flashProgress,
    errorInfo,
    rawError,
    logs,
    robotExpression,
    transportSupported: transport.isSupported,
    capabilities,
    setStep,
    toggleDemoMode,
    toggleDebugMode,
    connectDevice,
    scanAndConnect,
    disconnectDevice,
    checkForUpdates,
    selectVersion,
    selectTestVersion,
    uploadCustomFirmware,
    startUpdate,
    cancelUpdate,
    retryLastAction,
    resetToHome,
    openGuide,
    simulateError
  };

  return <FlasherContext.Provider value={value}>{children}</FlasherContext.Provider>;
};

export function useFlasher() {
  const context = useContext(FlasherContext);
  if (!context) {
    throw new Error('useFlasher must be used within a FlasherProvider');
  }
  return context;
}
