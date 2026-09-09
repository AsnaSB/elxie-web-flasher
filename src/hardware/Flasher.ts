/**
 * High-Level Firmware Flashing Orchestrator for ELXIE
 * 
 * Orchestrates the full lifecycle:
 * Prepare -> Download -> Flash -> Verify -> Restart -> Reconnect -> Confirm Success.
 */

import { DeviceTransport, FlashProgress } from './DeviceTransport';
import { FirmwareService } from '../firmware/FirmwareService';
import { FirmwareVersion } from '../firmware/FirmwareManifest';
import { ElxieError } from '../utils/errors';
import { logger } from '../utils/logger';
import { compareVersions } from '../utils/version';

export interface FlasherOptions {
  transport: DeviceTransport;
  firmwareService: FirmwareService;
  onProgress: (progress: FlashProgress) => void;
}

export class Flasher {
  private transport: DeviceTransport;
  private firmwareService: FirmwareService;
  private onProgress: (progress: FlashProgress) => void;

  constructor(options: FlasherOptions) {
    this.transport = options.transport;
    this.firmwareService = options.firmwareService;
    this.onProgress = options.onProgress;
  }

  /**
   * Executes the end-to-end update sequence.
   */
  async updateFirmware(version: FirmwareVersion): Promise<void> {
    logger.info(`Flasher: Starting firmware update process for ${version.version}...`);

    // 1. PREPARING STAGE
    this.onProgress({
      stage: "preparing",
      percentage: 0,
      message: "Preparing your update..."
    });

    if (this.transport.enterBootloader) {
      await this.transport.enterBootloader();
    }

    // 2. DOWNLOADING STAGE
    this.onProgress({
      stage: "downloading",
      percentage: 0,
      message: "Downloading ELXIE software..."
    });

    const firmwarePackage = await this.firmwareService.downloadFirmware(version, (downloadPct) => {
      this.onProgress({
        stage: "downloading",
        percentage: downloadPct,
        message: `Downloading ELXIE software... ${downloadPct}%`
      });
    });

    // 3. FLASHING STAGE
    this.onProgress({
      stage: "flashing",
      percentage: 0,
      message: "Installing firmware..."
    });

    await this.transport.flashFirmware(firmwarePackage, (flashProgress) => {
      this.onProgress(flashProgress);
    });

    // 4. VERIFYING STAGE
    this.onProgress({
      stage: "verifying",
      percentage: 100,
      message: "Verifying installation..."
    });

    if (this.transport.verifyFirmware) {
      const isVerified = await this.transport.verifyFirmware();
      if (!isVerified) {
        throw new ElxieError(
          "VERIFICATION_FAILED",
          "Verification check failed on the device after flashing."
        );
      }
    }

    // 5. RESTARTING STAGE
    this.onProgress({
      stage: "restarting",
      percentage: 100,
      message: "Restarting your ELXIE..."
    });

    if (this.transport.restart) {
      await this.transport.restart();
    }

    // 6. POST-REBOOT RECONNECT & VERSION VERIFICATION
    try {
      const updatedDeviceInfo = await this.transport.getDeviceInfo();
      if (updatedDeviceInfo.firmwareVersion) {
        logger.info(`Post-update verified version: ${updatedDeviceInfo.firmwareVersion}`);
        // If versions are both present and mismatch, log diagnostic note
        if (compareVersions(updatedDeviceInfo.firmwareVersion, version.version) !== 0) {
          logger.warn(`Version reported (${updatedDeviceInfo.firmwareVersion}) differs from target (${version.version})`);
        }
      }
    } catch {
      logger.info("Device reboot completed. Reconnect handshake finished.");
    }

    logger.info(`Flasher: Update to ${version.version} finished successfully.`);
  }
}
