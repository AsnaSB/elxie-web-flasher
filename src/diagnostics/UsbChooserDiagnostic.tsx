
import { useState } from 'react';

type Nav = Navigator & {
  serial?: {
    requestPort?: (options?: unknown) => Promise<{
      getInfo?: () => {
        usbVendorId?: number;
        usbProductId?: number;
      };
    }>;
    getPorts?: () => Promise<unknown[]>;
  };
  usb?: {
    requestDevice?: (options: unknown) => Promise<UsbLike>;
    getDevices?: () => Promise<unknown[]>;
  };
};

interface UsbLike {
  vendorId: number;
  productId: number;
  productName?: string;
  manufacturerName?: string;
  usbVersionMajor?: number;
  usbVersionMinor?: number;
  deviceClass?: number;
  deviceSubclass?: number;
  deviceProtocol?: number;
  opened?: boolean;
  configurations?: Array<{
    interfaces?: Array<{
      interfaceNumber?: number;
      alternates?: Array<{
        interfaceClass?: number;
        interfaceSubclass?: number;
        interfaceProtocol?: number;
      }>;
    }>;
  }>;
}

const hex = (n: number | undefined, width = 4) =>
  n === undefined
    ? 'n/a'
    : `0x${n.toString(16).toUpperCase().padStart(width, '0')}`;

const timestamp = () => new Date().toISOString().slice(11, 19);

function describeUsb(device: UsbLike): string[] {
  const lines = [
    `VID ${hex(device.vendorId)} PID ${hex(device.productId)}`,
    `Product: ${device.productName ?? 'n/a'}`,
    `Manufacturer: ${device.manufacturerName ?? 'n/a'}`,
    `USB version: ${device.usbVersionMajor ?? '?'}.${device.usbVersionMinor ?? '?'}`,
    `Device class: ${hex(device.deviceClass, 2)}`,
    `Opened: ${String(device.opened)} (diagnostic must not open it)`,
  ];

  const configurations = device.configurations ?? [];

  if (configurations.length === 0) {
    lines.push('Interface descriptors are not exposed.');
  }

  configurations.forEach((configuration, index) => {
    (configuration.interfaces ?? []).forEach((usbInterface) => {
      (usbInterface.alternates ?? []).forEach((alternate) => {
        lines.push(
          `Config ${index}, interface ${usbInterface.interfaceNumber}: ` +
          `class=${hex(alternate.interfaceClass, 2)}, ` +
          `subclass=${hex(alternate.interfaceSubclass, 2)}, ` +
          `protocol=${hex(alternate.interfaceProtocol, 2)}`
        );
      });
    });
  });

  return lines;
}

export default function UsbChooserDiagnostic() {
  const [lines, setLines] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const nav = navigator as Nav;

  function log(...messages: string[]) {
    setLines((previous) => [
      ...previous,
      ...messages.map((message) => `[${timestamp()}] ${message}`),
    ]);
  }

  async function run(
    label: string,
    operation: () => Promise<string[]>
  ) {
    log(`--- ${label} ---`);

    try {
      const result = await operation();
      log(`${label}: RESOLVED`, ...result);
    } catch (error) {
      const err = error as { name?: string; message?: string };

      log(
        `${label}: REJECTED`,
        `Error name: ${err.name ?? 'unknown'}`,
        `Error message: ${err.message ?? String(error)}`
      );
    }
  }

  function serialChooser(filtered: boolean) {
    return run(
      filtered ? 'Web Serial chooser (VID 303A)' : 'Web Serial chooser (any)',
      async () => {
        if (typeof nav.serial?.requestPort !== 'function') {
          throw new Error('navigator.serial.requestPort is unavailable');
        }

        const port = await nav.serial.requestPort(
          filtered
            ? { filters: [{ usbVendorId: 0x303a }] }
            : undefined
        );

        const info = port.getInfo?.() ?? {};

        return [
          `Selected port VID=${hex(info.usbVendorId)}`,
          `Selected port PID=${hex(info.usbProductId)}`,
          'Port was not opened.',
        ];
      }
    );
  }

  function usbChooser(filtered: boolean) {
    return run(
      filtered ? 'WebUSB chooser (VID 303A)' : 'WebUSB chooser (any)',
      async () => {
        if (typeof nav.usb?.requestDevice !== 'function') {
          throw new Error('navigator.usb.requestDevice is unavailable');
        }

        const device = await nav.usb.requestDevice(
          filtered
            ? { filters: [{ vendorId: 0x303a }] }
            : { acceptAllDevices: true }
        );

        return [
          ...describeUsb(device),
          'Device was not opened; no interface was claimed.',
        ];
      }
    );
  }

  async function listGranted() {
    log('--- Previously granted devices ---');

    try {
      const ports = await nav.serial?.getPorts?.();
      log(`navigator.serial.getPorts(): ${ports?.length ?? 'unavailable'}`);
    } catch (error) {
      log(`serial.getPorts() error: ${String(error)}`);
    }

    try {
      const devices = await nav.usb?.getDevices?.();
      log(`navigator.usb.getDevices(): ${devices?.length ?? 'unavailable'}`);
    } catch (error) {
      log(`usb.getDevices() error: ${String(error)}`);
    }
  }

  async function copyReport() {
    const report = [
      `User agent: ${navigator.userAgent}`,
      `Secure context: ${window.isSecureContext}`,
      `Web Serial API: ${typeof nav.serial?.requestPort === 'function'}`,
      `WebUSB API: ${typeof nav.usb?.requestDevice === 'function'}`,
      ...lines,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
    } catch {
      log('Clipboard unavailable. Long-press the report text to copy it.');
    }
  }

  const buttonStyle = {
    padding: '10px 12px',
    margin: '4px',
  } as const;

  return (
    <section style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #777' }}>
      <h3>USB chooser diagnostics (read-only)</h3>

      <p>
        These tests request browser device choosers. They do not open ports,
        open devices, claim interfaces, send data, or flash firmware.
        Cancel any Android system USB-access prompt.
      </p>

      <div>
        <button type="button" style={buttonStyle} onClick={() => serialChooser(true)}>
          Serial chooser (303A)
        </button>

        <button type="button" style={buttonStyle} onClick={() => serialChooser(false)}>
          Serial chooser (any)
        </button>

        <button type="button" style={buttonStyle} onClick={() => usbChooser(true)}>
          WebUSB chooser (303A)
        </button>

        <button type="button" style={buttonStyle} onClick={() => usbChooser(false)}>
          WebUSB chooser (any)
        </button>

        <button type="button" style={buttonStyle} onClick={listGranted}>
          List granted
        </button>

        <button type="button" style={buttonStyle} onClick={copyReport}>
          {copied ? 'Copied' : 'Copy report'}
        </button>

        <button type="button" style={buttonStyle} onClick={() => setLines([])}>
          Clear
        </button>
      </div>

      <pre style={{ whiteSpace: 'pre-wrap', userSelect: 'text' }}>
        {lines.length ? lines.join('\n') : 'No results yet.'}
      </pre>
    </section>
  );
}
