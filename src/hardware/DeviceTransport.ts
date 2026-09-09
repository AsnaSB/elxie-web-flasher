/**
 * Hardware Abstraction Layer - Interfaces and Types for ELXIE Flasher
 */

export interface HardwareProfile {
  id: string;
  displayName: string;
  transport: string;
  firmwareFormat: string;
  flashingConfig: unknown;
}

export const ELXIE_DEFAULT_PROFILE: HardwareProfile = {
  id: "esp32-s3-n16r8",
  displayName: "ESP32-S3 N16R8 (ELXIE)",
  transport: "web-serial",
  firmwareFormat: "bin",
  flashingConfig: {
    flashSize: "16MB",
    flashMode: "dio",
    flashFreq: "80m",
    baudRate: 460800
  }
};

export interface DeviceInfo {
  displayName: string;
  firmwareVersion?: string;
  connected: boolean;
  hardwareRevision?: string;
  serialNumber?: string;
  bootloaderMode?: boolean;
  /** Technical hardware attributes exposed only in Developer Debug Mode */
  technicalDetails?: Record<string, unknown>;
}

export interface FirmwarePackage {
  version: string;
  data: ArrayBuffer;
  checksum?: string;
  fileName: string;
  fileSize: number;
  flashOffset?: number;
}

export interface FlashProgress {
  stage: "preparing" | "downloading" | "flashing" | "verifying" | "restarting";
  percentage?: number;
  message: string;
  bytesWritten?: number;
  totalBytes?: number;
}

export interface DeviceTransport {
  readonly isSupported: boolean;
  readonly isDemo: boolean;
  
  /**
   * Prompts the browser for device permission and detects the connected ELXIE robot.
   */
  requestDevice(): Promise<DeviceInfo>;

  /**
   * Establishes a wired data session with the robot.
   */
  connect(): Promise<void>;

  /**
   * Disconnects the wired session.
   */
  disconnect(): Promise<void>;

  /**
   * Reads device information, including current installed firmware version if supported.
   */
  getDeviceInfo(): Promise<DeviceInfo>;

  /**
   * Places the robot into bootloader flashing mode if required by transport.
   */
  enterBootloader?(): Promise<void>;

  /**
   * Flashes the firmware package with stage/progress reporting.
   */
  flashFirmware(
    firmware: FirmwarePackage,
    onProgress: (progress: FlashProgress) => void
  ): Promise<void>;

  /**
   * Verifies firmware integrity on the device post-flash.
   */
  verifyFirmware?(): Promise<boolean>;

  /**
   * Restarts the robot into normal operating mode.
   */
  restart?(): Promise<void>;

  /**
   * Event listener for physical cable disconnection.
   */
  onDisconnect?(callback: () => void): () => void;
}
