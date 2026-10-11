
import { useEffect, useState } from 'react';

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
  const [result, setResult] = useState<BrowserDiagnosticResult | null>(null);

  useEffect(() => {
    const nav = navigator as Navigator & {
      serial?: { requestPort?: unknown };
      usb?: { requestDevice?: unknown };
    };

    setResult({
      secureContext: window.isSecureContext,
      userAgent: navigator.userAgent,
      isAndroid: /android/i.test(navigator.userAgent),
      supportsWebSerial: !!nav.serial,
      supportsWebUSB: !!nav.usb,
      serialRequestPortAvailable: typeof nav.serial?.requestPort === 'function',
      usbRequestDeviceAvailable: typeof nav.usb?.requestDevice === 'function',
    });
  }, []);

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
    <section style={{
      margin: 16,
      padding: 16,
      border: '2px solid #777',
      borderRadius: 12,
      fontFamily: 'sans-serif',
      overflowWrap: 'anywhere',
    }}>
      <h2>ELXIE Browser Diagnostics</h2>
      <p>Read-only check. This does not connect to or modify the ESP32.</p>

      {rows.map(([label, value]) => (
        <p key={label}>
          <strong>{label}:</strong> {value ? 'YES' : 'NO'}
        </p>
      ))}

      <details>
        <summary>Browser details</summary>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{result.userAgent}</pre>
      </details>
    </section>
  );
}
