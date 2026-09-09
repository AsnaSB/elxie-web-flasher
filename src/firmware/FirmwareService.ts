/**
 * Firmware Retrieval and Validation Service for ELXIE
 */

import { FirmwareManifest, FirmwareVersion, validateManifest } from './FirmwareManifest';
import { FirmwareValidator } from './FirmwareValidator';
import { firmwareConfig } from './firmwareConfig';
import { FirmwarePackage } from '../hardware/DeviceTransport';
import { ElxieError } from '../utils/errors';
import { logger } from '../utils/logger';

// Single source of truth for Hardware Test Firmware Versions
export const TEST_FIRMWARE_VERSIONS: Record<'v1' | 'v2' | 'v3' | 'standalone', FirmwareVersion> = {
  standalone: {
    version: "LED-TEST",
    releaseDate: "2026-08-19",
    description: "Standalone ESP32-S3 Hardware Diagnostic Firmware. Validates onboard WS2812 RGB LED (GPIO 48 / 38) and regular GPIOs with serial telemetry.",
    downloadUrl: "/firmware/standalone_led_test.bin",
    fileSize: 262144, // 256 KB
    recommended: false,
    channel: "test",
    ledColor: "green",
    flashOffset: 0x0000,
    highlights: [
      "Target: ESP32-S3 N16R8 (Factory Merged Binary @ 0x0000)",
      "LED Pins: GPIO 48 (WS2812), GPIO 38 (WS2812), GPIO 2, GPIO 21",
      "Blink Timing: 500 ms ON / 500 ms OFF",
      "Serial Output: 115200 baud startup & heartbeat"
    ]
  },
  v1: {
    version: "V1",
    releaseDate: "2026-08-19",
    description: "ESP32-S3 Hardware Verification Firmware. Continuously blinks the onboard RGB LED Green (500 ms ON, 500 ms OFF).",
    downloadUrl: "/firmware/v1_green.bin",
    fileSize: 262144, // 256 KB
    recommended: false,
    channel: "test",
    ledColor: "green",
    testVersionKey: "v1",
    flashOffset: 0x0000,
    highlights: [
      "LED Color: Green (WS2812 GRB: 255, 0, 0)",
      "Pattern: 500 ms ON / 500 ms OFF",
      "Target: ESP32-S3 N16R8 (GPIO 48 & GPIO 38)",
      "Serial Output: 115200 baud"
    ]
  },
  v2: {
    version: "V2",
    releaseDate: "2026-08-19",
    description: "ESP32-S3 Hardware Verification Firmware. Continuously blinks the onboard RGB LED Blue (500 ms ON, 500 ms OFF).",
    downloadUrl: "/firmware/v2_blue.bin",
    fileSize: 262144, // 256 KB
    recommended: false,
    channel: "test",
    ledColor: "blue",
    testVersionKey: "v2",
    flashOffset: 0x0000,
    highlights: [
      "LED Color: Blue (WS2812 GRB: 0, 0, 255)",
      "Pattern: 500 ms ON / 500 ms OFF",
      "Target: ESP32-S3 N16R8 (GPIO 48 & GPIO 38)",
      "Serial Output: 115200 baud"
    ]
  },
  v3: {
    version: "V3",
    releaseDate: "2026-08-19",
    description: "ESP32-S3 Hardware Verification Firmware. Continuously blinks the onboard RGB LED Red (500 ms ON, 500 ms OFF).",
    downloadUrl: "/firmware/v3_red.bin",
    fileSize: 262144, // 256 KB
    recommended: false,
    channel: "test",
    ledColor: "red",
    testVersionKey: "v3",
    flashOffset: 0x0000,
    highlights: [
      "LED Color: Red (WS2812 GRB: 0, 255, 0)",
      "Pattern: 500 ms ON / 500 ms OFF",
      "Target: ESP32-S3 N16R8 (GPIO 48 & GPIO 38)",
      "Serial Output: 115200 baud"
    ]
  }
};

// Curated releases used when Demo Mode or local distribution is active
const BUILTIN_FIRMWARE_MANIFEST: FirmwareManifest = {
  schemaVersion: "1.0",
  deviceFamily: "ELXIE",
  latest: "v1.3.0",
  versions: [
    {
      version: "v1.3.0",
      releaseDate: "2026-07-20",
      description: "Recommended stable release for ESP32-S3 N16R8 with improved motor smoothing, enhanced OLED facial emotions, and responsive ultrasonic obstacle sensing.",
      downloadUrl: "https://demo.elxie.local/firmware/elxie-v1.3.0.bin",
      checksum: "sha256:4a8e5f21c9b3e71d8820f66e319b22a07c11f42d",
      fileSize: 524288, // 512 KB
      recommended: true,
      channel: "stable",
      flashOffset: 0x0000,
      highlights: [
        "Enhanced expressive OLED digital face animations",
        "Smoother dual-motor speed ramping",
        "Reduced sensor latency on line-following mode",
        "Low battery audio chirps"
      ]
    },
    // Test Versions
    TEST_FIRMWARE_VERSIONS.standalone,
    TEST_FIRMWARE_VERSIONS.v1,
    TEST_FIRMWARE_VERSIONS.v2,
    TEST_FIRMWARE_VERSIONS.v3,
    {
      version: "v1.2.0",
      releaseDate: "2026-05-14",
      description: "Previous stable release with baseline robotics control and standard mobile app telemetry.",
      downloadUrl: "https://demo.elxie.local/firmware/elxie-v1.2.0.bin",
      checksum: "sha256:1f9c8d32b5e4a70b6611e33d209a11b05c00e31c",
      fileSize: 491520, // 480 KB
      recommended: false,
      channel: "stable",
      flashOffset: 0x0000,
      highlights: [
        "Standard motor drive routines",
        "Basic line sensing and obstacle detection"
      ]
    },
    {
      version: "v1.4.0-beta.1",
      releaseDate: "2026-08-02",
      description: "Experimental preview for ESP32-S3 with high-rate IMU telemetry and custom buzzer audio synthesis.",
      downloadUrl: "https://demo.elxie.local/firmware/elxie-v1.4.0-beta.1.bin",
      fileSize: 557056, // 544 KB
      recommended: false,
      channel: "beta",
      flashOffset: 0x0000,
      highlights: [
        "Experimental buzzer audio synthesis",
        "Fast 100Hz gyroscope sample rate"
      ]
    }
  ]
};

/**
 * Resolves relative firmware asset URLs against Vite's base URL and runtime window location.
 * Ensures assets work reliably under custom domains, local development, and GitHub Pages subpaths.
 */
export function resolveFirmwareUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;

  if (typeof window !== 'undefined' && window.location) {
    try {
      return new URL(cleanPath, new URL(cleanBase, window.location.href)).href;
    } catch {
      return `${cleanBase}${cleanPath}`;
    }
  }
  return `${cleanBase}${cleanPath}`;
}

export class FirmwareService {
  constructor(private isDemo: boolean = true) {}

  /**
   * Retrieves available firmware releases including Test Versions V1/V2/V3.
   */
  async getManifest(): Promise<FirmwareManifest> {
    logger.info(`Fetching firmware manifest (${this.isDemo ? 'Demo Mode' : 'Production'})...`);

    if (this.isDemo) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return BUILTIN_FIRMWARE_MANIFEST;
    }

    // Production mode - manifest fetch with local test firmware fallback
    if (!firmwareConfig.manifest || firmwareConfig.manifest === "XXXXXX") {
      logger.info("Using built-in ESP32-S3 N16R8 firmware manifest.");
      return BUILTIN_FIRMWARE_MANIFEST;
    }

    try {
      const manifestUrl = resolveFirmwareUrl(firmwareConfig.manifest);
      const response = await fetch(manifestUrl, {
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      const manifest = validateManifest(data);

      // Ensure test versions are always accessible
      const hasV1 = manifest.versions.some(v => v.version === "V1");
      if (!hasV1) {
        manifest.versions.push(
          TEST_FIRMWARE_VERSIONS.standalone,
          TEST_FIRMWARE_VERSIONS.v1,
          TEST_FIRMWARE_VERSIONS.v2,
          TEST_FIRMWARE_VERSIONS.v3
        );
      }

      return manifest;
    } catch (err: unknown) {
      const error = err as Error;
      logger.warn(`Remote manifest fetch failed (${error.message}), falling back to standard release list.`);
      return BUILTIN_FIRMWARE_MANIFEST;
    }
  }

  /**
   * Retrieves a specific test firmware release by key ('v1' | 'v2' | 'v3').
   */
  getTestFirmwareVersion(key: 'v1' | 'v2' | 'v3' | 'standalone'): FirmwareVersion {
    const version = TEST_FIRMWARE_VERSIONS[key];
    if (!version) {
      throw new ElxieError(
        'FIRMWARE_NOT_FOUND',
        `Unknown test firmware version "${key}". Expected "v1", "v2", "v3", or "standalone".`
      );
    }
    return version;
  }

  /**
   * Validates and processes a user-uploaded local .bin firmware file.
   */
  async validateAndLoadCustomFirmware(file: File): Promise<FirmwareVersion> {
    logger.info(`Validating uploaded firmware: ${file.name} (${file.size} bytes)...`);

    if (!file.name.toLowerCase().endsWith('.bin')) {
      throw new ElxieError(
        'INVALID_FIRMWARE',
        `"${file.name}" is not a .bin file. Please select a valid ESP32-S3 firmware binary.`
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const metadata = FirmwareValidator.validate(arrayBuffer, file.name);
    const checksum = await FirmwareValidator.computeChecksum(arrayBuffer);

    logger.info("Custom firmware validated successfully:", {
      fileName: metadata.fileName,
      fileSize: metadata.fileSize,
      flashMode: metadata.flashMode,
      flashFreq: metadata.flashFreq,
      flashSize: metadata.flashSize,
      chipName: metadata.chipName || "ESP32-S3"
    });

    const versionTag = file.name.replace(/\.bin$/i, '');

    return {
      version: versionTag,
      releaseDate: new Date().toISOString().split('T')[0],
      description: `Local custom ESP32-S3 binary (${metadata.flashMode}, ${metadata.flashFreq}, ${metadata.flashSize}).`,
      downloadUrl: `blob:${file.name}`,
      fileSize: file.size,
      checksum,
      channel: "custom",
      recommended: true,
      isCustomUpload: true,
      customBinaryData: arrayBuffer,
      metadata,
      flashOffset: 0x0000,
      highlights: [
        `Flash Mode: ${metadata.flashMode}`,
        `Flash Frequency: ${metadata.flashFreq}`,
        `Flash Size: ${metadata.flashSize}`,
        `Entry Point: ${metadata.entryPoint}`
      ]
    };
  }

  /**
   * Downloads and validates the firmware binary package.
   */
  async downloadFirmware(
    version: FirmwareVersion,
    onProgress?: (percentage: number) => void
  ): Promise<FirmwarePackage> {
    logger.info(`Processing firmware package for ${version.version}...`);

    // Handle user-uploaded custom binary
    if (version.customBinaryData) {
      if (onProgress) onProgress(100);
      return {
        version: version.version,
        data: version.customBinaryData,
        checksum: version.checksum,
        fileName: version.version.endsWith('.bin') ? version.version : `${version.version}.bin`,
        fileSize: version.customBinaryData.byteLength,
        flashOffset: version.flashOffset !== undefined ? version.flashOffset : 0x0000
      };
    }

    if (this.isDemo) {
      // Simulate stepped download progress for demo mode
      const steps = 10;
      for (let i = 1; i <= steps; i++) {
        await new Promise(r => setTimeout(r, 40));
        const pct = Math.round((i / steps) * 100);
        if (onProgress) onProgress(pct);
      }

      // Create valid mock ESP32 header binary payload
      const mockData = new Uint8Array(version.fileSize || 256 * 1024);
      mockData.fill(0xAA);
      // Valid ESP32-S3 header
      mockData[0] = 0xE9; // Magic
      mockData[1] = 0x03; // Segments
      mockData[2] = 0x02; // DIO
      mockData[3] = 0x4F; // 16MB 80MHz
      mockData[12] = 0x09; // ESP32-S3 Chip ID
      mockData[13] = 0x00;

      const fileName = version.testVersionKey
        ? `${version.testVersionKey}_${version.ledColor || 'test'}.bin`
        : `elxie-${version.version}.bin`;

      return {
        version: version.version,
        data: mockData.buffer,
        checksum: version.checksum,
        fileName,
        fileSize: version.fileSize || mockData.byteLength,
        flashOffset: version.flashOffset !== undefined ? version.flashOffset : 0x0000
      };
    }

    // Production download
    try {
      const resolvedUrl = resolveFirmwareUrl(version.downloadUrl);
      logger.info(`Downloading binary from: ${resolvedUrl}`);
      const response = await fetch(resolvedUrl);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const contentLength = response.headers.get('content-length');
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
      
      const reader = response.body?.getReader();
      let arrayBuffer: ArrayBuffer;

      if (!reader) {
        arrayBuffer = await response.arrayBuffer();
      } else {
        const chunks: Uint8Array[] = [];
        let receivedBytes = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            receivedBytes += value.length;
            if (totalBytes > 0 && onProgress) {
              onProgress(Math.round((receivedBytes / totalBytes) * 100));
            }
          }
        }

        const combined = new Uint8Array(receivedBytes);
        let offset = 0;
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }
        arrayBuffer = combined.buffer;
      }

      const fileName = version.downloadUrl.split('/').pop() || `elxie-${version.version}.bin`;

      // Validate downloaded binary through FirmwareValidator
      const metadata = FirmwareValidator.validate(arrayBuffer, fileName);
      logger.info(`Validated downloaded binary "${fileName}":`, {
        chip: metadata.chipName,
        flashMode: metadata.flashMode,
        flashFreq: metadata.flashFreq,
        size: metadata.fileSize
      });

      return {
        version: version.version,
        data: arrayBuffer,
        checksum: version.checksum,
        fileName,
        fileSize: arrayBuffer.byteLength,
        flashOffset: version.flashOffset !== undefined ? version.flashOffset : 0x0000
      };
    } catch (err: unknown) {
      const error = err as Error;
      logger.error(`Firmware download failed for ${version.version}: ${error.message}`);
      throw new ElxieError(
        "FIRMWARE_DOWNLOAD_FAILED",
        `Failed to download firmware binary (${version.version}): ${error.message}`
      );
    }
  }
}
