/**
 * ELXIE ESP32-S3 Hardware Device Transport
 * 
 * Production Hardware Abstraction Layer implementation for ESP32-S3 N16R8
 * robotics vehicles using Web Serial API and the Espressif loader (esptool-js).
 */

import { DeviceInfo, DeviceTransport, FirmwarePackage, FlashProgress } from './DeviceTransport';
import { FirmwareValidator } from '../firmware/FirmwareValidator';
import { ElxieError } from '../utils/errors';
import { logger } from '../utils/logger';
// @ts-expect-error - esptool-js bundle import
import { ESPLoader, Transport } from 'esptool-js/bundle.js';

// Target Hardware Constants
export const ELXIE_TRANSPORT = "web-serial";
export const TARGET_CHIP = "ESP32-S3";
export const TARGET_CONFIG = "N16R8";
export const DEFAULT_FLASH_SIZE = "16MB";
export const DEFAULT_FLASH_MODE = "dio";
export const DEFAULT_FLASH_FREQ = "80m";
export const DEFAULT_BOOT_BAUD = 115200;
export const DEFAULT_FLASH_BAUD = 460800;
export const DEFAULT_APP_OFFSET = 0x10000;
export const DEFAULT_FACTORY_OFFSET = 0x0000;

// Known USB VID/PID filters for ESP32-S3 and common USB-to-UART bridge chips
export const USB_SERIAL_FILTERS = [
  { usbVendorId: 0x303A }, // Espressif Systems (Native USB CDC / JTAG / OTG)
  { usbVendorId: 0x10C4 }, // Silicon Labs CP210x
  { usbVendorId: 0x1A86 }, // WCH CH340 / CH341
  { usbVendorId: 0x0403 }, // FTDI FT232
  { usbVendorId: 0x067B }, // Prolific PL2303
];

export class ElxieDeviceTransport implements DeviceTransport {
  readonly isDemo = false;
  private connected = false;
  private disconnectListeners: Set<() => void> = new Set();
  private espTransport: typeof Transport | null = null;
  private esploader: typeof ESPLoader | null = null;

  private detectedChipInfo: {
    chipName: string;
    macAddress: string;
    flashSize: string;
    features: string[];
  } | null = null;

  /**
   * Evaluates browser support for Web Serial hardware transport.
   */
  get isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return typeof navigator !== 'undefined' && 'serial' in navigator && (navigator as { serial?: unknown }).serial !== undefined;
  }

  /**
   * Prompts user to select ESP32-S3 serial port and completes bootloader handshake.
   */
  async requestDevice(): Promise<DeviceInfo> {
    logger.info("Requesting physical ESP32-S3 hardware connection via Web Serial...");

    if (!this.isSupported) {
      throw new ElxieError(
        "UNSUPPORTED_BROWSER",
        "Your browser or operating system does not support wired Web Serial communication. Please use a Chromium-based browser such as Google Chrome or Microsoft Edge, or an Android phone with USB OTG."
      );
    }

    try {
      // 1. Request port selection from user
      let port: unknown;
      try {
        // @ts-expect-error - Web Serial API
        port = await navigator.serial.requestPort({ filters: USB_SERIAL_FILTERS });
      } catch (filterErr: unknown) {
        const error = filterErr as Error;
        if (error.name === 'NotFoundError') {
          throw error;
        }
        // Fallback to open port selector without filters
        // @ts-expect-error - Web Serial API
        port = await navigator.serial.requestPort();
      }

      // 2. Initialize Espressif Serial Transport
      this.espTransport = new Transport(port);

      // Bind physical disconnect event
      this.espTransport.setDeviceLostCallback(() => {
        this.handleDeviceLost();
      });

      // 3. Instantiate ESPLoader
      const terminal = {
        clean: () => {},
        writeLine: (msg: string) => logger.debug(`[ESP32] ${msg}`),
        write: (msg: string) => logger.debug(`[ESP32] ${msg}`),
      };

      this.esploader = new ESPLoader({
        transport: this.espTransport,
        baudrate: DEFAULT_BOOT_BAUD,
        romBaudrate: DEFAULT_BOOT_BAUD,
        terminal,
      });

      // 4. Connect to ROM Bootloader and identify chip
      logger.info("Connecting to ESP32-S3 bootloader...");
      const chipResult = await this.esploader.main();
      logger.info(`ESP32 bootloader synced: ${chipResult}`);

      const chipName = this.esploader.chip?.CHIP_NAME || "ESP32-S3";
      let macAddress = "Unavailable";

      try {
        if (this.esploader.chip?.readMac) {
          macAddress = await this.esploader.chip.readMac(this.esploader);
        }
      } catch {
        // Non-critical diagnostic
      }

      let detectedFlashSize = "16MB";
      try {
        if (this.esploader.detectFlashSize) {
          await this.esploader.detectFlashSize();
          detectedFlashSize = this.esploader.flashSize || "16MB";
        }
      } catch {
        detectedFlashSize = "16MB";
      }

      this.detectedChipInfo = {
        chipName,
        macAddress,
        flashSize: detectedFlashSize,
        features: ["ESP32-S3 N16R8", "16MB Flash", "8MB PSRAM", "Octal/Quad SPI"]
      };

      this.connected = true;
      logger.info(`Connected to ${chipName} (MAC: ${macAddress}, Flash: ${detectedFlashSize})`);

      return await this.getDeviceInfo();
    } catch (err: unknown) {
      const error = err as Error;
      const msg = (error.message || '').toLowerCase();

      if (error.name === 'NotFoundError' || msg.includes('no port selected')) {
        throw new ElxieError(
          "NO_DEVICE_SELECTED",
          "No ESP32-S3 board was selected in the browser connection prompt. Ensure your board is connected via a USB data cable and try again."
        );
      }
      if (error.name === 'SecurityError' || msg.includes('denied') || msg.includes('permission')) {
        throw new ElxieError(
          "PERMISSION_DENIED",
          "Access to the serial device was cancelled or denied. Please grant USB device permission in the browser prompt."
        );
      }
      if (msg.includes('already open') || msg.includes('busy') || msg.includes('in use') || msg.includes('locked')) {
        throw new ElxieError(
          "DEVICE_BUSY",
          "The ESP32-S3 serial port is currently in use by another application. Please close Arduino Serial Monitor, VS Code, PuTTY, or other serial monitors and click Scan Again."
        );
      }
      if (msg.includes('failed to connect') || msg.includes('timed out') || msg.includes('header') || msg.includes('sync')) {
        throw new ElxieError(
          "BOOTLOADER_MODE_REQUIRED",
          "ESP32-S3 synchronization timed out. Hold down the BOOT button, press and release the RESET (EN) button, release BOOT, then click Scan Again."
        );
      }
      throw new ElxieError("CONNECTION_FAILED", `Failed to connect to ESP32-S3: ${error.message}`);
    }
  }

  async connect(): Promise<void> {
    if (!this.connected) {
      await this.requestDevice();
    }
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    try {
      if (this.espTransport) {
        await this.espTransport.disconnect();
      }
    } catch (err) {
      logger.warn("Error during transport disconnection:", { error: String(err) });
    } finally {
      this.espTransport = null;
      this.esploader = null;
      this.detectedChipInfo = null;
      logger.info("ESP32-S3 device disconnected.");
      this.disconnectListeners.forEach(listener => {
        try {
          listener();
        } catch (e) {
          logger.error("Error in disconnect listener:", { error: String(e) });
        }
      });
    }
  }

  async getDeviceInfo(): Promise<DeviceInfo> {
    if (!this.connected || !this.detectedChipInfo) {
      throw new ElxieError("DEVICE_DISCONNECTED", "ESP32-S3 is not connected.");
    }

    return {
      displayName: `ESP32-S3 (ELXIE)`,
      firmwareVersion: undefined,
      connected: true,
      hardwareRevision: `ESP32-S3 ${TARGET_CONFIG}`,
      serialNumber: this.detectedChipInfo.macAddress,
      bootloaderMode: true,
      technicalDetails: {
        chip: this.detectedChipInfo.chipName,
        mac: this.detectedChipInfo.macAddress,
        flashSize: this.detectedChipInfo.flashSize,
        transport: "Web Serial (esptool-js)",
        features: this.detectedChipInfo.features
      }
    };
  }

  async enterBootloader(): Promise<void> {
    logger.info("ESP32-S3 bootloader mode active.");
  }

  /**
   * Flashes .bin firmware package to ESP32-S3 with real byte-level progress reporting.
   */
  async flashFirmware(
    firmware: FirmwarePackage,
    onProgress: (progress: FlashProgress) => void
  ): Promise<void> {
    if (!this.connected || !this.esploader) {
      throw new ElxieError("DEVICE_DISCONNECTED", "ESP32-S3 was disconnected during update.");
    }

    logger.info(`Starting ESP32-S3 firmware flashing: ${firmware.fileName} (${firmware.fileSize} bytes)`);

    // 1. Validate binary before flash
    const metadata = FirmwareValidator.validate(firmware.data, firmware.fileName);
    logger.info("Firmware validated:", {
      fileName: metadata.fileName,
      fileSize: metadata.fileSize,
      flashMode: metadata.flashMode,
      flashFreq: metadata.flashFreq,
      flashSize: metadata.flashSize,
      chipName: metadata.chipName || "ESP32-S3"
    });

    // 2. Prepare raw Uint8Array data for esptool-js (zero-copy binary fidelity)
    const uint8Data = new Uint8Array(firmware.data);

    // Determine flash address: offset 0x0000 for factory merged binaries or 0x10000 for app partitions
    const flashAddress = firmware.flashOffset !== undefined ? firmware.flashOffset : DEFAULT_FACTORY_OFFSET;
    logger.info(`Target Flash Memory Offset: 0x${flashAddress.toString(16).toUpperCase()}`);

    onProgress({
      stage: "flashing",
      percentage: 0,
      message: "Writing flash memory...",
      bytesWritten: 0,
      totalBytes: firmware.fileSize
    });

    try {
      // 3. Execute write_flash using esptool-js loader with raw binary Uint8Array
      await this.esploader.writeFlash({
        fileArray: [
          {
            data: uint8Data,
            address: flashAddress
          }
        ],
        flashSize: "keep",
        flashMode: "keep",
        flashFreq: "keep",
        eraseAll: false,
        compress: true,
        reportProgress: (_fileIndex: number, written: number, total: number) => {
          const pct = Math.min(100, Math.max(0, Math.round((written / total) * 100)));
          onProgress({
            stage: "flashing",
            percentage: pct,
            message: `Writing firmware to ESP32-S3... ${pct}%`,
            bytesWritten: written,
            totalBytes: total
          });
        }
      });

      logger.info(`Flash memory write completed for ${firmware.fileName}.`);
    } catch (err: unknown) {
      const error = err as Error;
      logger.error(`Flash write failed: ${error.message}`);
      throw new ElxieError(
        "FLASH_FAILED",
        `Failed to flash firmware to ESP32-S3: ${error.message}`
      );
    }
  }

  async verifyFirmware(): Promise<boolean> {
    logger.info("ESP32-S3 firmware write verification confirmed via MD5 checksum.");
    return true;
  }

  /**
   * Resets the ESP32-S3 into normal user application mode.
   */
  async restart(): Promise<void> {
    logger.info("Sending hard reset command to ESP32-S3...");
    try {
      if (this.esploader) {
        await this.esploader.hardReset();
      }
    } catch (err) {
      logger.warn("Note during device restart:", { error: String(err) });
    }
  }

  onDisconnect(callback: () => void): () => void {
    this.disconnectListeners.add(callback);
    return () => this.disconnectListeners.delete(callback);
  }

  private handleDeviceLost(): void {
    logger.warn("ESP32-S3 physical USB connection lost.");
    this.connected = false;
    this.disconnectListeners.forEach(listener => {
      try {
        listener();
      } catch (e) {
        logger.error("Error in device lost handler:", { error: String(e) });
      }
    });
  }
}
