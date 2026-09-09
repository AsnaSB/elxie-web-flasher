import { describe, it, expect } from 'vitest';
import { FirmwareValidator } from '../src/firmware/FirmwareValidator';
import { FirmwareService } from '../src/firmware/FirmwareService';
import { ElxieError } from '../src/utils/errors';

describe('ESP32-S3 Firmware Validator and Service', () => {
  // Helper to create a valid synthetic ESP32-S3 firmware binary
  function createSyntheticEsp32Binary(size: number = 1024): ArrayBuffer {
    const buffer = new ArrayBuffer(size);
    const view = new DataView(buffer);
    
    // Offset 0: Magic byte 0xE9
    view.setUint8(0, 0xE9);
    // Offset 1: Segment count 3
    view.setUint8(1, 0x03);
    // Offset 2: SPI mode DIO (2)
    view.setUint8(2, 0x02);
    // Offset 3: 16MB (4) + 80MHz (0xF) -> 0x4F
    view.setUint8(3, 0x4F);
    // Offset 4: Entry point 0x40378000
    view.setUint32(4, 0x40378000, true);
    // Offset 12: Chip ID for ESP32-S3 (0x0009)
    view.setUint16(12, 0x0009, true);

    return buffer;
  }

  it('validates a correct ESP32-S3 .bin firmware binary', () => {
    const data = createSyntheticEsp32Binary(2048);
    const result = FirmwareValidator.validate(data, 'elxie-v1.3.0.bin');

    expect(result.isValid).toBe(true);
    expect(result.magicByte).toBe('0xE9');
    expect(result.segmentCount).toBe(3);
    expect(result.flashMode).toBe('DIO');
    expect(result.flashFreq).toBe('80 MHz');
    expect(result.flashSize).toBe('16 MB');
    expect(result.chipName).toBe('ESP32-S3');
    expect(result.fileSize).toBe(2048);
  });

  it('rejects files without .bin extension', () => {
    const data = createSyntheticEsp32Binary();
    expect(() => FirmwareValidator.validate(data, 'firmware.hex')).toThrowError(ElxieError);
    expect(() => FirmwareValidator.validate(data, 'firmware.hex')).toThrowError(/requires a compiled \.bin/);
  });

  it('rejects empty or excessively small buffers', () => {
    const emptyBuffer = new ArrayBuffer(10);
    expect(() => FirmwareValidator.validate(emptyBuffer, 'firmware.bin')).toThrowError(ElxieError);
    expect(() => FirmwareValidator.validate(emptyBuffer, 'firmware.bin')).toThrowError(/too small/);
  });

  it('rejects files missing the 0xE9 magic byte', () => {
    const corruptBuffer = new ArrayBuffer(1024);
    const view = new DataView(corruptBuffer);
    view.setUint8(0, 0xAA); // Invalid magic

    expect(() => FirmwareValidator.validate(corruptBuffer, 'corrupt.bin')).toThrowError(ElxieError);
    expect(() => FirmwareValidator.validate(corruptBuffer, 'corrupt.bin')).toThrowError(/Missing ESP32 image header magic byte/);
  });

  it('rejects binaries larger than 16MB for N16R8', () => {
    // 17 MB buffer
    const oversizedBuffer = new ArrayBuffer(17 * 1024 * 1024);
    const view = new DataView(oversizedBuffer);
    view.setUint8(0, 0xE9);

    expect(() => FirmwareValidator.validate(oversizedBuffer, 'huge.bin')).toThrowError(ElxieError);
    expect(() => FirmwareValidator.validate(oversizedBuffer, 'huge.bin')).toThrowError(/exceeds ESP32-S3 N16R8 flash capacity/);
  });

  it('processes custom uploaded File object in FirmwareService', async () => {
    const buffer = createSyntheticEsp32Binary(4096);
    const mockFile = {
      name: 'elxie-custom-build.bin',
      size: buffer.byteLength,
      arrayBuffer: async () => buffer
    } as unknown as File;

    const service = new FirmwareService(false);
    const versionObj = await service.validateAndLoadCustomFirmware(mockFile);

    expect(versionObj.version).toBe('elxie-custom-build');
    expect(versionObj.isCustomUpload).toBe(true);
    expect(versionObj.channel).toBe('custom');
    expect(versionObj.customBinaryData).toBeDefined();
    expect(versionObj.metadata?.chipName).toBe('ESP32-S3');
    expect(versionObj.metadata?.flashSize).toBe('16 MB');
  });
});
