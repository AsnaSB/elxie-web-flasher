/**
 * Device Manager for ELXIE Robotic Vehicle
 * 
 * Manages connection lifecycle, event subscriptions, and device state.
 */

import { DeviceInfo, DeviceTransport } from './DeviceTransport';
import { ElxieError } from '../utils/errors';
import { logger } from '../utils/logger';

export type ConnectionState = 'disconnected' | 'scanning' | 'connecting' | 'connected' | 'reconnecting';

export interface DeviceManagerEvents {
  onStateChange?: (state: ConnectionState) => void;
  onDeviceInfo?: (info: DeviceInfo | null) => void;
  onDisconnect?: () => void;
  onError?: (error: unknown) => void;
}

export class DeviceManager {
  private state: ConnectionState = 'disconnected';
  private deviceInfo: DeviceInfo | null = null;
  private unbindDisconnectListener?: () => void;

  constructor(
    private transport: DeviceTransport,
    private callbacks: DeviceManagerEvents = {}
  ) {}

  get isConnected(): boolean {
    return this.state === 'connected';
  }

  get isScanning(): boolean {
    return this.state === 'scanning' || this.state === 'connecting';
  }

  get currentState(): ConnectionState {
    return this.state;
  }

  get currentDeviceInfo(): DeviceInfo | null {
    return this.deviceInfo;
  }

  get activeTransport(): DeviceTransport {
    return this.transport;
  }

  setTransport(transport: DeviceTransport) {
    if (this.unbindDisconnectListener) {
      this.unbindDisconnectListener();
    }
    this.transport = transport;
  }

  private setState(state: ConnectionState) {
    this.state = state;
    this.callbacks.onStateChange?.(state);
  }

  private setDeviceInfo(info: DeviceInfo | null) {
    this.deviceInfo = info;
    this.callbacks.onDeviceInfo?.(info);
  }

  /**
   * Prompts user to select device and establishes communication.
   */
  async requestAndConnect(): Promise<DeviceInfo> {
    try {
      this.setState('scanning');
      logger.info("DeviceManager: Scanning and requesting ESP32-S3 hardware device...");

      const info = await this.transport.requestDevice();
      this.setDeviceInfo(info);
      this.setState('connected');

      // Bind disconnect event listener
      if (this.transport.onDisconnect) {
        this.unbindDisconnectListener = this.transport.onDisconnect(() => {
          this.handleUnexpectedDisconnect();
        });
      }

      logger.info(`DeviceManager: Connected to ${info.displayName}`);
      return info;
    } catch (err) {
      this.setState('disconnected');
      this.setDeviceInfo(null);
      this.callbacks.onError?.(err);
      throw err;
    }
  }

  /**
   * Refreshes device info from the connected hardware.
   */
  async refreshDeviceInfo(): Promise<DeviceInfo> {
    if (this.state !== 'connected') {
      throw new ElxieError("DEVICE_DISCONNECTED", "Cannot read device info when disconnected.");
    }
    try {
      const info = await this.transport.getDeviceInfo();
      this.setDeviceInfo(info);
      return info;
    } catch (err) {
      this.callbacks.onError?.(err);
      throw err;
    }
  }

  /**
   * Graceful disconnection
   */
  async disconnect(): Promise<void> {
    try {
      if (this.unbindDisconnectListener) {
        this.unbindDisconnectListener();
        this.unbindDisconnectListener = undefined;
      }
      await this.transport.disconnect();
    } finally {
      this.setState('disconnected');
      this.setDeviceInfo(null);
    }
  }

  /**
   * Handles unexpected USB cable unplugging / physical disconnect
   */
  private handleUnexpectedDisconnect(): void {
    logger.warn("DeviceManager: Unexpected disconnection detected.");
    this.setState('disconnected');
    this.setDeviceInfo(null);
    this.callbacks.onDisconnect?.();
  }
}
