import UsbChooserDiagnostic from './UsbChooserDiagnostic';
import { useEffect, useState } from 'react';

interface UsbDeviceInfo {
  vendorId: number;
  productId: number;
  productName?: string;
  manufacturerName?: string;
}

interface BrowserDiagnosticResult {
  secureContext: boolean;
  userAgent: string;
  isAndroid: boolean;
  supportsWebSerial: boolean;
  supportsWebUSB: boolean;
  serialRequestPortAvailable: boolean;
  usbRequestDeviceAvailable: boolean;
}

export default function BrowserDiagnostic() {
  const [result, setResult] =
    useState<BrowserDiagnosticResult | null>(null);
  const [usbDevices, setUsbDevices] =
    useState<UsbDeviceInfo[] | null>(null);
  const [usbStatus, setUsbStatus] = useState(
    'USB device check has not been run.'
  );
  const [checkingUsb, setCheckingUsb] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & {
      serial?: { requestPort?: unknown };
      usb?: {
        requestDevice?: unknown;
        getDevices?: () => Promise<UsbDeviceInfo[]>;
      };
    };

    setResult({
      secureContext: window.isSecureContext,
      userAgent: navigator.userAgent,
      isAndroid: /android/i.test(navigator.userAgent),
      supportsWebSerial: !!nav.serial,
      supportsWebUSB: !!nav.usb,
      serialRequestPortAvailable:
        typeof nav.serial?.requestPort === 'function',
      usbRequestDeviceAvailable:
        typeof nav.usb?.requestDevice === 'function',
    });
  }, []);

  async function checkUsbDevices() {
    const nav = navigator as Navigator & {
      usb?: {
        getDevices?: () => Promise<UsbDeviceInfo[]>;
      };
    };

    if (typeof nav.usb?.getDevices !== 'function') {
      setUsbDevices(null);
      setUsbStatus('WebUSB getDevices() is unavailable.');
      return;
    }

    setCheckingUsb(true);
    setUsbDevices(null);
    setUsbStatus('Checking previously authorized USB devices...');

    try {
      const devices = await nav.usb.getDevices();

      setUsbDevices(
        devices.map((device) => ({
          vendorId: device.vendorId,
          productId: device.productId,
          productName: device.productName,
          manufacturerName: device.manufacturerName,
        }))
      );

      setUsbStatus(
        devices.length === 0
          ? 'No previously authorized WebUSB devices found. This does not prove that no USB device is physically connected.'
          : `Found ${devices.length} previously authorized WebUSB device(s).`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      setUsbStatus(`USB enumeration failed: ${message}`);
    } finally {
      setCheckingUsb(false);
    }
  }

  if (!result) return <p>Checking browser capabilities...</p>;

  const rows = [
    ['Secure context (HTTPS)', result.secureContext],
    ['Android device', result.isAndroid],
    ['Web Serial API', result.supportsWebSerial],
    ['Web Serial requestPort()', result.serialRequestPortAvailable],
    ['WebUSB API', result.supportsWebUSB],
    ['WebUSB requestDevice()', result.usbRequestDeviceAvailable],
  ] as const;

  return (
    <section
      style={{
        margin: 16,
        padding: 16,
        border: '2px solid #777',
        borderRadius: 12,
        fontFamily: 'sans-serif',
        overflowWrap: 'anywhere',
      }}
    >
      <h2>ELXIE Browser Diagnostics</h2>
      <p>
        Read-only diagnostics. The USB check lists previously authorized
        devices; it does not open a device, claim an interface, send commands,
        or flash firmware.
      </p>

      {rows.map(([label, value]) => (
        <p key={label}>
          <strong>{label}:</strong> {value ? 'YES' : 'NO'}
        </p>
      ))}
    <UsbChooserDiagnostic />

        <details>
        <summary>Browser details</summary>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
            {result.userAgent}
        </pre>
        </details>
      <button
        type="button"
        onClick={checkUsbDevices}
        disabled={checkingUsb}
        style={{ padding: '10px 14px', margin: '8px 0' }}
      >
        {checkingUsb ? 'Checking USB devices...' : 'Check USB Devices'}
      </button>

      <p role="status">{usbStatus}</p>

      {usbDevices && usbDevices.length > 0 && (
        <div>
          <h3>Previously authorized USB devices</h3>
          {usbDevices.map((device, index) => (
            <div
              key={`${device.vendorId}-${device.productId}-${index}`}
              style={{
                border: '1px solid #777',
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
              }}
            >
              <p>
                <strong>Vendor ID:</strong>{' '}
                0x{device.vendorId.toString(16).padStart(4, '0').toUpperCase()}
              </p>
              <p>
                <strong>Product ID:</strong>{' '}
                0x{device.productId.toString(16).padStart(4, '0').toUpperCase()}
              </p>
              <p>
                <strong>Manufacturer:</strong>{' '}
                {device.manufacturerName || 'Not provided'}
              </p>
              <p>
                <strong>Product:</strong>{' '}
                {device.productName || 'Not provided'}
              </p>
            </div>
          ))}
        </div>
      )}

      <details>
        <summary>Browser details</summary>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{result.userAgent}</pre>
      </details>
    </section>
  );
}
