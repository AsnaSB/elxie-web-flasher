import { describe, it, expect } from 'vitest';
import { ElxieError, getFriendlyErrorInfo } from '../src/utils/errors';

describe('Error and Recovery State Machine Mappings', () => {
  it('correctly maps DEVICE_NOT_FOUND to friendly error with retry action', () => {
    const err = new ElxieError('DEVICE_NOT_FOUND');
    const info = getFriendlyErrorInfo(err);

    expect(info.title).toBe('No ESP32-S3 Detected');
    expect(info.recoveryActions.some(a => a.action === 'reconnect')).toBe(true);
    expect(info.recoveryActions.some(a => a.action === 'home')).toBe(true);
    expect(info.recoveryActions.some(a => a.action === 'guide')).toBe(true);
  });

  it('correctly maps DEVICE_DISCONNECTED to actionable reconnection flow', () => {
    const err = new ElxieError('DEVICE_DISCONNECTED');
    const info = getFriendlyErrorInfo(err);

    expect(info.title).toBe('USB Connection Interrupted');
    expect(info.message).toContain('disconnected');
    expect(info.recoveryActions[0].action).toBe('reconnect');
  });

  it('correctly maps FLASH_FAILED to retry update action', () => {
    const err = new ElxieError('FLASH_FAILED', 'Flash memory write timeout');
    const info = getFriendlyErrorInfo(err);

    expect(info.title).toBe('Installation Failed');
    expect(info.recoveryActions.some(a => a.action === 'retry')).toBe(true);
  });

  it('correctly maps UNSUPPORTED_BROWSER', () => {
    const err = new ElxieError('UNSUPPORTED_BROWSER');
    const info = getFriendlyErrorInfo(err);

    expect(info.title).toBe('Browser or OS Not Supported');
    expect(info.troubleshootingTip).toContain('Google Chrome');
    expect(info.recoveryActions.some(a => a.action === 'guide')).toBe(true);
  });

  it('handles standard javascript generic errors gracefully', () => {
    const err = new Error('Network timeout during handshake');
    const info = getFriendlyErrorInfo(err);

    expect(info.title).toBe('Connection Issue');
    expect(info.message).toBe('Network timeout during handshake');
    expect(info.recoveryActions.some(a => a.action === 'guide')).toBe(true);
  });
});
