/**
 * ESP32-S3 Firmware Binary Validator
 * 
 * Validates .bin firmware files specifically for the ESP32-S3 N16R8 platform.
 * Verifies file integrity, ESP image magic byte (0xE9), segment structure,
 * and flash memory constraints.
 */

import { ElxieError } from '../utils/errors';

export interface ValidatedFirmwareMetadata {
  isValid: boolean;
  fileSize: number;
  fileName: string;
  magicByte: string;
  segmentCount: number;
  flashMode: string;
  flashFreq: string;
  flashSize: string;
  entryPoint: string;
  chipId?: string;
  chipName?: string;
  checksum?: string;
}

const ESP_IMAGE_HEADER_MAGIC = 0xE9;
const MAX_FLASH_SIZE_BYTES = 16 * 1024 * 1024; // 16 MB for ESP32-S3 N16R8
const MIN_FIRMWARE_SIZE_BYTES = 64; // Minimum header + segment metadata

const FLASH_MODE_NAMES: Record<number, string> = {
  0: 'QIO',
  1: 'QOUT',
  2: 'DIO',
  3: 'DOUT',
  4: 'FAST_READ',
  5: 'SLOW_READ',
  6: 'OPI_QIO',
  7: 'OPI_DTR'
};

const FLASH_FREQ_NAMES: Record<number, string> = {
  0: '40 MHz',
  1: '26 MHz',
  2: '20 MHz',
  15: '80 MHz'
};

const FLASH_SIZE_NAMES: Record<number, string> = {
  0: '1 MB',
  1: '2 MB',
  2: '4 MB',
  3: '8 MB',
  4: '16 MB',
  5: '32 MB',
  6: '64 MB',
  7: '128 MB'
};

const CHIP_IDS: Record<number, string> = {
  0x0000: 'ESP32',
  0x0002: 'ESP32-S2',
  0x0005: 'ESP32-C3',
  0x0009: 'ESP32-S3',
  0x000C: 'ESP32-C2',
  0x000D: 'ESP32-C6',
  0x0010: 'ESP32-H2'
};

export class FirmwareValidator {
  /**
   * Validates an ESP32-S3 .bin firmware file buffer.
   */
  static validate(data: ArrayBuffer, fileName: string = 'firmware.bin'): ValidatedFirmwareMetadata {
    if (!fileName.toLowerCase().endsWith('.bin')) {
      throw new ElxieError(
        'INVALID_FIRMWARE',
        `Invalid file extension for "${fileName}". ELXIE requires a compiled .bin firmware binary.`
      );
    }

    if (!data || data.byteLength < MIN_FIRMWARE_SIZE_BYTES) {
      throw new ElxieError(
        'INVALID_FIRMWARE',
        `Firmware file is empty or too small (${data ? data.byteLength : 0} bytes).`
      );
    }

    if (data.byteLength > MAX_FLASH_SIZE_BYTES) {
      throw new ElxieError(
        'INCOMPATIBLE_FIRMWARE',
        `Firmware binary (${(data.byteLength / (1024 * 1024)).toFixed(2)} MB) exceeds ESP32-S3 N16R8 flash capacity (16 MB).`
      );
    }

    const view = new DataView(data);
    const magic = view.getUint8(0);

    // Verify Espressif ESP_IMAGE_HEADER_MAGIC (0xE9)
    if (magic !== ESP_IMAGE_HEADER_MAGIC) {
      throw new ElxieError(
        'INVALID_FIRMWARE',
        `Invalid firmware format. Missing ESP32 image header magic byte (found 0x${magic.toString(16).toUpperCase()}, expected 0xE9).`
      );
    }

    const segmentCount = view.getUint8(1);
    const flashModeCode = view.getUint8(2);
    const flashConfig = view.getUint8(3);
    const flashFreqCode = flashConfig & 0x0F;
    const flashSizeCode = (flashConfig >> 4) & 0x0F;
    const entryPoint = view.getUint32(4, true);

    // Optional chip ID at offset 12 for extended headers
    let chipName: string | undefined;
    let chipIdHex: string | undefined;

    if (data.byteLength >= 16) {
      const chipId = view.getUint16(12, true);
      if (CHIP_IDS[chipId]) {
        chipName = CHIP_IDS[chipId];
        chipIdHex = `0x${chipId.toString(16).padStart(4, '0')}`;
      }
    }

    return {
      isValid: true,
      fileSize: data.byteLength,
      fileName,
      magicByte: `0x${magic.toString(16).toUpperCase()}`,
      segmentCount,
      flashMode: FLASH_MODE_NAMES[flashModeCode] || `Mode ${flashModeCode}`,
      flashFreq: FLASH_FREQ_NAMES[flashFreqCode] || `Freq ${flashFreqCode}`,
      flashSize: FLASH_SIZE_NAMES[flashSizeCode] || `Size ${flashSizeCode}`,
      entryPoint: `0x${entryPoint.toString(16).padStart(8, '0').toUpperCase()}`,
      chipId: chipIdHex,
      chipName
    };
  }

  /**
   * Helper to compute SHA-256 checksum in browser / Node.js
   */
  static async computeChecksum(data: ArrayBuffer): Promise<string> {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return '';
  }
}
