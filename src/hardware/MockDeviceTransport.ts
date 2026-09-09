/**
 * Mock Device Transport for ELXIE Web Flasher
 * 
 * Simulates a physical ESP32-S3 N16R8 robotic vehicle over a virtual connection with
 * realistic stage delays, step progress, and interactive diagnostic simulation.
 */

import { DeviceInfo, DeviceTransport, FirmwarePackage, FlashProgress } from './DeviceTransport';
import { ElxieError } from '../utils/errors';
import { logger } from '../utils/logger';

export class MockDeviceTransport implements DeviceTransport {
  readonly isDemo = true;
  readonly isSupported = true;

  private connected = false;
  private currentVersion = "v1.2.0";
  private disconnectListeners: Set<() => void> = new Set();

  // Test / Simulation flags
  public simulateDisconnect = false;
  public simulateFlashError = false;
  public simulateVerifyError = false;
  public speedMultiplier = 1;

  private async delay(ms: number): Promise<void> {
    const duration = Math.max(5, Math.round(ms * this.speedMultiplier));
    await new Promise((resolve) => setTimeout(resolve, duration));
  }

  async requestDevice(): Promise<DeviceInfo> {
    logger.info("[Mock Transport] Requesting virtual ESP32-S3 connection...");
    // Simulate brief USB enumeration / handshake delay
    await this.delay(500);

    this.connected = true;
    return this.getDeviceInfo();
  }

  async connect(): Promise<void> {
    await this.delay(300);
    this.connected = true;
    logger.info("[Mock Transport] ESP32-S3 (Demo Device) connected successfully.");
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    logger.info("[Mock Transport] ESP32-S3 Demo Device disconnected.");
    this.disconnectListeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        logger.error("Error in mock disconnect listener:", { error: String(e) });
      }
    });
  }

  async getDeviceInfo(): Promise<DeviceInfo> {
    if (!this.connected) {
      throw new ElxieError("DEVICE_DISCONNECTED", "ELXIE is not connected.");
    }

    return {
      displayName: "ESP32-S3 (ELXIE)",
      firmwareVersion: this.currentVersion,
      connected: true,
      hardwareRevision: "ESP32-S3 N16R8",
      serialNumber: "ELX-S3-DEMO-87A2",
      bootloaderMode: true,
      technicalDetails: {
        chip: "ESP32-S3 (QFN56)",
        board: "ESP32-S3 N16R8 Dev Board",
        flashSize: "16MB (Octal SPI)",
        psramSize: "8MB (Octal SPI)",
        transport: "Web Serial (Virtual)",
        mode: "DEMO MODE",
        mac: "DC:54:75:A8:92:10"
      }
    };
  }

  async enterBootloader(): Promise<void> {
    logger.info("[Mock Transport] Entering virtual bootloader mode...");
    await this.delay(400);
  }

  async flashFirmware(
    firmware: FirmwarePackage,
    onProgress: (progress: FlashProgress) => void
  ): Promise<void> {
    if (!this.connected) {
      throw new ElxieError("DEVICE_DISCONNECTED", "ELXIE was disconnected during the update.");
    }

    logger.info(`[Mock Transport] Flashing firmware ${firmware.version} (${firmware.fileSize} bytes)...`);

    // Simulated chunk flashing steps
    const totalSteps = 20;
    const totalBytes = firmware.fileSize || 1024 * 512;

    for (let i = 1; i <= totalSteps; i++) {
      if (this.simulateDisconnect) {
        this.connected = false;
        this.disconnectListeners.forEach((l) => l());
        throw new ElxieError("DEVICE_DISCONNECTED", "ELXIE was disconnected while writing flash memory.");
      }

      if (this.simulateFlashError && i === 12) {
        throw new ElxieError("FLASH_FAILED", "Flash write verification mismatch at sector 0x00048000.");
      }

      await this.delay(100);
      const percentage = Math.round((i / totalSteps) * 100);
      const bytesWritten = Math.round((i / totalSteps) * totalBytes);

      onProgress({
        stage: "flashing",
        percentage,
        bytesWritten,
        totalBytes,
        message: `Writing firmware to ESP32-S3... ${percentage}%`
      });
    }

    // Update the installed version in memory upon completion
    this.currentVersion = firmware.version;
    logger.info(`[Mock Transport] Flash completed for ${firmware.version}.`);
  }

  async verifyFirmware(): Promise<boolean> {
    logger.info("[Mock Transport] Verifying firmware image...");
    await this.delay(600);

    if (this.simulateVerifyError) {
      throw new ElxieError("VERIFICATION_FAILED", "Cryptographic signature check failed.");
    }

    return true;
  }

  async restart(): Promise<void> {
    logger.info("[Mock Transport] Restarting ELXIE robot...");
    // Simulate brief device reboot reset
    await this.delay(800);
  }

  onDisconnect(callback: () => void): () => void {
    this.disconnectListeners.add(callback);
    return () => this.disconnectListeners.delete(callback);
  }

  /**
   * Helper for testing state changes
   */
  triggerUnexpectedDisconnect(): void {
    this.connected = false;
    this.disconnectListeners.forEach((l) => l());
  }
}
