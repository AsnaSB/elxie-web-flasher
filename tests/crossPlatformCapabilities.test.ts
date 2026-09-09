import { describe, it, expect, afterEach } from 'vitest';
import { getDeviceCapabilities } from '../src/utils/browserCapabilities';
import { ElxieError, getFriendlyErrorInfo } from '../src/utils/errors';

describe('Cross-Platform Capabilities and Device Detection', () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      configurable: true,
      writable: true,
    });
  });

  it('detects Windows Desktop with Web Serial support (Chrome / Edge)', () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        serial: {},
        usb: {},
      },
      configurable: true,
    });

    const caps = getDeviceCapabilities();
    expect(caps.isDesktop).toBe(true);
    expect(caps.isMobile).toBe(false);
    expect(caps.isWindows).toBe(true);
    expect(caps.isAndroid).toBe(false);
    expect(caps.isIOS).toBe(false);
    expect(caps.supportsWebSerial).toBe(true);
    expect(caps.canFlashDirectly).toBe(true);
    expect(caps.supportStatus).toBe('fully_supported');
    expect(caps.osName).toBe('Windows');
    expect(caps.browserName).toBe('Google Chrome');
  });

  it('detects Android Phone with Web Serial support (Chrome / Kiwi with OTG)', () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        serial: {},
        usb: {},
      },
      configurable: true,
    });

    const caps = getDeviceCapabilities();
    expect(caps.isDesktop).toBe(false);
    expect(caps.isMobile).toBe(true);
    expect(caps.isAndroid).toBe(true);
    expect(caps.isIOS).toBe(false);
    expect(caps.supportsWebSerial).toBe(true);
    expect(caps.canFlashDirectly).toBe(true);
    expect(caps.supportStatus).toBe('fully_supported');
    expect(caps.osName).toBe('Android');
    expect(caps.statusMessage).toContain('OTG');
  });

  it('detects Apple iOS (iPhone/iPad) and reports clear restriction with recommendation', () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        // No navigator.serial on iOS WebKit
      },
      configurable: true,
    });

    const caps = getDeviceCapabilities();
    expect(caps.isMobile).toBe(true);
    expect(caps.isIOS).toBe(true);
    expect(caps.isAndroid).toBe(false);
    expect(caps.supportsWebSerial).toBe(false);
    expect(caps.canFlashDirectly).toBe(false);
    expect(caps.supportStatus).toBe('unsupported');
    expect(caps.osName).toBe('iOS');
    expect(caps.statusMessage).toContain('iOS/iPadOS');
    expect(caps.recommendedAction).toContain('Android device');
  });

  it('detects Android without Web Serial and reports unavailable status without falsely claiming support', () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        // navigator.serial is undefined in default vanilla Android Chrome
      },
      configurable: true,
    });

    const caps = getDeviceCapabilities();
    expect(caps.isAndroid).toBe(true);
    expect(caps.supportsWebSerial).toBe(false);
    expect(caps.canFlashDirectly).toBe(false);
    expect(caps.supportStatus).toBe('unsupported');
    expect(caps.statusMessage).toContain('Web Serial API is unavailable');
    expect(caps.recommendedAction).toContain('Kiwi Browser');
  });

  it('detects Desktop Firefox without Web Serial and advises Chromium browsers', () => {
    Object.defineProperty(global, 'navigator', {
      value: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
        // No navigator.serial on Firefox
      },
      configurable: true,
    });

    const caps = getDeviceCapabilities();
    expect(caps.isWindows).toBe(true);
    expect(caps.supportsWebSerial).toBe(false);
    expect(caps.canFlashDirectly).toBe(false);
    expect(caps.supportStatus).toBe('unsupported');
    expect(caps.recommendedAction).toContain('Chrome');
  });
});

describe('Actionable Error Handling & Troubleshooting Guide Integration', () => {
  it('handles NO_DEVICE_SELECTED with scan and guide actions', () => {
    const err = new ElxieError('NO_DEVICE_SELECTED');
    const info = getFriendlyErrorInfo(err);

    expect(info.title).toBe('No ESP32-S3 Detected');
    expect(info.troubleshootingTip).toContain('USB data cable');
    expect(info.recoveryActions.some(a => a.action === 'reconnect')).toBe(true);
    expect(info.recoveryActions.some(a => a.action === 'guide')).toBe(true);
  });

  it('handles USB_CABLE_CHARGE_ONLY with distinct diagnosis and guide action', () => {
    const err = new ElxieError('USB_CABLE_CHARGE_ONLY');
    const info = getFriendlyErrorInfo(err);

    expect(info.title).toContain('Cable');
    expect(info.message).toContain('data');
    expect(info.recoveryActions.some(a => a.action === 'guide')).toBe(true);
  });

  it('handles DRIVER_MISSING with direct link to Driver Guide', () => {
    const err = new ElxieError('DRIVER_MISSING');
    const info = getFriendlyErrorInfo(err);

    expect(info.title).toContain('Driver');
    expect(info.recoveryActions[0].action).toBe('guide');
    expect(info.recoveryActions[0].label).toContain('Driver Guide');
  });

  it('handles DEVICE_BUSY with instructions to close other serial monitors', () => {
    const err = new ElxieError('DEVICE_BUSY');
    const info = getFriendlyErrorInfo(err);

    expect(info.title).toContain('Already in Use');
    expect(info.troubleshootingTip).toContain('Arduino IDE');
    expect(info.troubleshootingTip).toContain('VS Code');
  });

  it('handles BOOTLOADER_MODE_REQUIRED with physical button sequence', () => {
    const err = new ElxieError('BOOTLOADER_MODE_REQUIRED');
    const info = getFriendlyErrorInfo(err);

    expect(info.title).toContain('Bootloader');
    expect(info.troubleshootingTip).toContain('BOOT');
    expect(info.troubleshootingTip).toContain('RESET');
  });

  it('handles PERMISSION_DENIED with grant access action', () => {
    const err = new ElxieError('PERMISSION_DENIED');
    const info = getFriendlyErrorInfo(err);

    expect(info.title).toContain('Permission Denied');
    expect(info.recoveryActions[0].action).toBe('reconnect');
  });

  it('automatically classifies DOM NotFoundError as NO_DEVICE_SELECTED', () => {
    const domError = new Error('No port selected by the user.');
    domError.name = 'NotFoundError';
    const info = getFriendlyErrorInfo(domError);

    expect(info.title).toBe('No ESP32-S3 Detected');
    expect(info.recoveryActions.some(a => a.action === 'guide')).toBe(true);
  });

  it('automatically classifies busy port errors as DEVICE_BUSY', () => {
    const busyError = new Error('The port is already open or busy.');
    const info = getFriendlyErrorInfo(busyError);

    expect(info.title).toBe('Serial Port Already in Use');
  });
});
