import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { FirmwareService, TEST_FIRMWARE_VERSIONS } from '../src/firmware/FirmwareService';
import { FirmwareValidator } from '../src/firmware/FirmwareValidator';
import { ElxieError } from '../src/utils/errors';

describe('Firmware Version Test Selection (V1 / V2 / V3)', () => {
  // Test 1: Version Selection & Mapping
  it('correctly maps V1, V2, and V3 to their respective binary files and LED colors', () => {
    expect(TEST_FIRMWARE_VERSIONS.v1.version).toBe('V1');
    expect(TEST_FIRMWARE_VERSIONS.v1.downloadUrl).toBe('/firmware/v1_green.bin');
    expect(TEST_FIRMWARE_VERSIONS.v1.ledColor).toBe('green');
    expect(TEST_FIRMWARE_VERSIONS.v1.channel).toBe('test');

    expect(TEST_FIRMWARE_VERSIONS.v2.version).toBe('V2');
    expect(TEST_FIRMWARE_VERSIONS.v2.downloadUrl).toBe('/firmware/v2_blue.bin');
    expect(TEST_FIRMWARE_VERSIONS.v2.ledColor).toBe('blue');
    expect(TEST_FIRMWARE_VERSIONS.v2.channel).toBe('test');

    expect(TEST_FIRMWARE_VERSIONS.v3.version).toBe('V3');
    expect(TEST_FIRMWARE_VERSIONS.v3.downloadUrl).toBe('/firmware/v3_red.bin');
    expect(TEST_FIRMWARE_VERSIONS.v3.ledColor).toBe('red');
    expect(TEST_FIRMWARE_VERSIONS.v3.channel).toBe('test');
  });

  // Test 2: Validation of pre-built binary files
  it('validates the generated ESP32-S3 test firmware binaries with FirmwareValidator', () => {
    const fwDir = path.join(process.cwd(), 'public', 'firmware');

    const files = [
      { name: 'v1_green.bin', key: 'v1' },
      { name: 'v2_blue.bin', key: 'v2' },
      { name: 'v3_red.bin', key: 'v3' }
    ];

    for (const f of files) {
      const filePath = path.join(fwDir, f.name);
      expect(fs.existsSync(filePath)).toBe(true);

      const buffer = fs.readFileSync(filePath);
      const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

      const metadata = FirmwareValidator.validate(arrayBuffer, f.name);
      expect(metadata.isValid).toBe(true);
      expect(metadata.magicByte).toBe('0xE9');
      expect(metadata.flashSize).toBe('16 MB');
      expect(metadata.flashMode).toBe('DIO');
      expect(metadata.flashFreq).toBe('80 MHz');
      expect(metadata.chipName).toBe('ESP32-S3');
    }
  });

  // Test 3: Manifest includes test versions
  it('includes V1, V2, and V3 in manifest query with channel test', async () => {
    const service = new FirmwareService(true);
    const manifest = await service.getManifest();

    const v1 = manifest.versions.find(v => v.version === 'V1');
    const v2 = manifest.versions.find(v => v.version === 'V2');
    const v3 = manifest.versions.find(v => v.version === 'V3');

    expect(v1).toBeDefined();
    expect(v1?.ledColor).toBe('green');
    expect(v1?.channel).toBe('test');

    expect(v2).toBeDefined();
    expect(v2?.ledColor).toBe('blue');
    expect(v2?.channel).toBe('test');

    expect(v3).toBeDefined();
    expect(v3?.ledColor).toBe('red');
    expect(v3?.channel).toBe('test');
  });

  // Test 4: Firmware package retrieval in Demo Mode
  it('prepares valid firmware package for V1 in Demo Mode', async () => {
    const service = new FirmwareService(true);
    const pkg = await service.downloadFirmware(TEST_FIRMWARE_VERSIONS.v1);

    expect(pkg.version).toBe('V1');
    expect(pkg.fileName).toBe('v1_green.bin');
    expect(pkg.data.byteLength).toBeGreaterThan(0);

    // Validate generated demo buffer
    const metadata = FirmwareValidator.validate(pkg.data, pkg.fileName);
    expect(metadata.isValid).toBe(true);
    expect(metadata.magicByte).toBe('0xE9');
  });

  // Test 5: Error handling for invalid test key
  it('throws FIRMWARE_NOT_FOUND error when querying an unknown test version', () => {
    const service = new FirmwareService(true);
    // @ts-expect-error - Testing runtime error for invalid key
    expect(() => service.getTestFirmwareVersion('v99')).toThrowError(ElxieError);
    // @ts-expect-error - Testing runtime error for invalid key
    expect(() => service.getTestFirmwareVersion('v99')).toThrowError(/Unknown test firmware version/);
  });
});
