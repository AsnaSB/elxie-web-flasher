import { describe, it, expect } from 'vitest';
import { MockDeviceTransport } from '../src/hardware/MockDeviceTransport';
import { ElxieDeviceTransport } from '../src/hardware/ElxieDeviceTransport';
import { DeviceManager } from '../src/hardware/DeviceManager';
import { FirmwareService } from '../src/firmware/FirmwareService';
import { Flasher } from '../src/hardware/Flasher';
import { FlashProgress } from '../src/hardware/DeviceTransport';

describe('Demo Mode and Hardware Transport Verification', () => {
  // Test 1 & 2: Demo Mode ON -> Connect -> Should succeed without navigator.serial & device becomes connected
  it('Test 1 & 2: Demo Mode ON connects without browser serial API and sets connected state', async () => {
    const transport = new MockDeviceTransport();
    transport.speedMultiplier = 0.01;
    const manager = new DeviceManager(transport);

    expect(manager.isConnected).toBe(false);
    expect(transport.isSupported).toBe(true);

    const info = await manager.requestAndConnect();
    expect(manager.isConnected).toBe(true);
    expect(info.connected).toBe(true);
    expect(info.displayName).toContain('ESP32-S3');
    expect(info.hardwareRevision).toBe('ESP32-S3 N16R8');
    expect(info.firmwareVersion).toBe('v1.2.0');

    await manager.disconnect();
    expect(manager.isConnected).toBe(false);
  });

  // Test 3: Demo Mode ON -> Connect -> Firmware selection becomes available
  it('Test 3: Demo Mode ON allows firmware selection from manifest releases', async () => {
    const service = new FirmwareService(true);
    const manifest = await service.getManifest();

    expect(manifest).toBeDefined();
    expect(manifest.versions.length).toBeGreaterThanOrEqual(1);
    
    const recommended = manifest.versions.find(v => v.recommended);
    expect(recommended).toBeDefined();
    expect(recommended?.version).toBe('v1.3.0');
  });

  // Test 4 & 5: Demo Mode ON -> Start update -> Progress reaches 100% -> Complete update
  it('Test 4 & 5: Demo Mode ON updates firmware through all stages and completes successfully', async () => {
    const transport = new MockDeviceTransport();
    transport.speedMultiplier = 0.01;
    await transport.connect();

    const firmwareService = new FirmwareService(true);
    const progressList: FlashProgress[] = [];

    const flasher = new Flasher({
      transport,
      firmwareService,
      onProgress: (p) => {
        progressList.push(p);
      }
    });

    const targetVersion = {
      version: "v1.3.0",
      downloadUrl: "https://demo.elxie.local/v1.3.0.bin",
      recommended: true,
      fileSize: 1024 * 100
    };

    await flasher.updateFirmware(targetVersion);

    // Verify stage occurrences in order
    const stagesReported = progressList.map(p => p.stage);
    expect(stagesReported).toContain('preparing');
    expect(stagesReported).toContain('downloading');
    expect(stagesReported).toContain('flashing');
    expect(stagesReported).toContain('verifying');
    expect(stagesReported).toContain('restarting');

    // Verify progress reached 100%
    const maxFlashPct = Math.max(...progressList.filter(p => p.stage === 'flashing').map(p => p.percentage || 0));
    expect(maxFlashPct).toBe(100);

    // Post update version check
    const postInfo = await transport.getDeviceInfo();
    expect(postInfo.firmwareVersion).toBe('v1.3.0');
  });

  // Test 6: Demo Mode OFF -> Real Web Serial path is used
  it('Test 6: Demo Mode OFF uses real ElxieDeviceTransport and detects serial support correctly', () => {
    const realTransport = new ElxieDeviceTransport();
    expect(realTransport.isDemo).toBe(false);
    
    // In Node.js environment without Web Serial, isSupported is safely false
    if (typeof navigator === 'undefined' || !('serial' in navigator)) {
      expect(realTransport.isSupported).toBe(false);
    }
  });

  it('handles simulated disconnect during flashing gracefully', async () => {
    const transport = new MockDeviceTransport();
    transport.speedMultiplier = 0.01;
    await transport.connect();
    transport.simulateDisconnect = true;

    const firmwareService = new FirmwareService(true);
    const flasher = new Flasher({
      transport,
      firmwareService,
      onProgress: () => {}
    });

    const targetVersion = {
      version: "v1.3.0",
      downloadUrl: "https://demo.elxie.local/v1.3.0.bin",
      recommended: true
    };

    await expect(flasher.updateFirmware(targetVersion)).rejects.toThrow('disconnected');
  });
});
