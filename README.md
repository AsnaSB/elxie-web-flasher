# ELXIE Web Flasher

A browser-based firmware flashing interface for the **ELXIE educational robotic car**, built with React, TypeScript, and Vite. The current website uses the redesigned **V2 interface** and separates the UI, firmware handling, device transport, and workflow state.

![ELXIE robot — current website artwork](public/assets/robot/elxie-robot.svg)

> **Hardware status:** The application includes a Web Serial implementation for ESP32-S3 hardware and browser diagnostics for Web Serial/WebUSB capabilities. Successful physical flashing depends on the device, USB connection, bootloader communication, firmware image, and configuration. Android WebUSB detection and the complete Android flashing workflow should be verified separately.

## Features

- **V2 user interface:** landing, connection, device setup, firmware selection, flashing, success, and recovery screens.
- **Animated ELXIE robot:** current robot artwork with an interactive facial-display overlay.
- **Firmware handling:** built-in test firmware entries, manifest validation, version utilities, and support for loading a local `.bin` file.
- **Hardware abstraction:** shared transport interface, real ESP32-S3 transport, and a mock transport for simulated workflows.
- **Web Serial integration:** the real-hardware transport uses `esptool-js` to communicate with the ESP32-S3 ROM bootloader through a serial port.
- **Browser diagnostics:** checks browser capabilities and helps inspect USB/Serial chooser behavior.
- **Developer diagnostics:** logging and a diagnostics interface for investigating connection and flashing problems.
- **Automated tests:** Vitest tests for firmware validation, manifests, transport behavior, browser capabilities, state transitions, and version utilities.

## How it works

```text
Browser (ELXIE Web Flasher)
          |
          v
V2 interface and shared workflow state
          |
          v
Firmware service and validation
          |
          v
Flasher
          |
          v
Device transport
    |             |
    |             +--> Mock transport (simulation)
    |
    +--> Web Serial + esptool-js
                    |
                    v
                USB connection
                    |
                    v
               ESP32-S3 bootloader
                    |
                    v
               Device flash memory
```

The website can serve firmware files from `public/firmware/`. In real-hardware mode, the firmware service fetches the selected binary and the transport attempts to flash it. A successful page load, USB chooser appearance, or simulated progress display does **not** by itself prove that a physical device was flashed successfully.

## Technology stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- `esptool-js` for ESP32 serial flashing
- Vitest for automated tests
- Browser Web Serial API; WebUSB is also inspected by the browser diagnostics

## Project structure

```text
elxie-web-flasher/
├── public/
│   ├── assets/
│   │   ├── background/
│   │   ├── logo/
│   │   └── robot/
│   ├── firmware/
│   │   ├── standalone_led_test.bin
│   │   ├── v1_green.bin
│   │   ├── v2_blue.bin
│   │   └── v3_red.bin
│   └── favicon.svg
├── src/
│   ├── assets/robot/
│   │   └── elxie-robot.png
│   ├── components/          # Original/reusable UI components
│   ├── diagnostics/         # Browser and USB chooser diagnostics
│   ├── firmware/            # Manifest, binary retrieval, validation
│   ├── hardware/            # Device transports and flashing orchestration
│   ├── pages/               # Original interface pages
│   ├── state/               # Shared flasher workflow state
│   ├── styles/              # Global styles
│   ├── ui-v2/
│   │   ├── components/      # Current V2 UI components
│   │   ├── pages/           # Current V2 workflow screens
│   │   └── styles/
│   ├── utils/               # Capabilities, errors, logging, formatting
│   ├── App.tsx              # Application entry/controller
│   └── main.tsx             # React mount point
├── tests/
├── docs/
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

### Key modules

| File | Responsibility |
|---|---|
| `src/App.tsx` | Root controller; currently defaults to V2 while retaining V1 switching logic. |
| `src/ui-v2/AppV2.tsx` | Coordinates the redesigned V2 screens and components. |
| `src/state/flasherStore.tsx` | Shared workflow and application state. |
| `src/firmware/FirmwareService.ts` | Retrieves firmware entries and downloads/processes binary data. |
| `src/firmware/FirmwareManifest.ts` | Firmware manifest types and validation. |
| `src/firmware/FirmwareValidator.ts` | Validates firmware binary data and extracts supported metadata. |
| `src/hardware/DeviceTransport.ts` | Contract shared by hardware transport implementations. |
| `src/hardware/ElxieDeviceTransport.ts` | Real-hardware Web Serial transport using `esptool-js`. |
| `src/hardware/Flasher.ts` | Coordinates the firmware update process. |
| `src/hardware/MockDeviceTransport.ts` | Simulates a device for demo/testing workflows. |
| `src/diagnostics/BrowserDiagnostic.tsx` | Displays browser capability information. |
| `src/diagnostics/UsbChooserDiagnostic.tsx` | Helps diagnose browser USB and Serial device selection. |

## Requirements

- Node.js and npm
- A recent Chromium-based browser for hardware APIs
- For physical flashing: a compatible USB data connection, supported device interface, correct firmware image, and ESP32-S3 bootloader communication

Browser support varies by API, operating system, and device. Web Serial and WebUSB are separate APIs with different permissions and transport behavior. Firefox and Safari should not be assumed to support the hardware workflow. Demo mode can be used without a physical robot.

## Run locally

Clone the repository and enter the project directory:

```bash
git clone https://github.com/AsnaSB/elxie-web-flasher.git
cd elxie-web-flasher
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

For access from another device on the same network, Vite may need to be started with a host binding, and the firewall/network must allow access. **Local-network access alone does not grant USB permissions or guarantee that mobile hardware flashing works.** Web hardware APIs also require a supported browser and an appropriate secure context.

## Demo mode and real hardware

The application supports a mock transport and a real-hardware transport. Check the current environment configuration and application state before testing; do not assume a successful demo run is a real flash.

| Mode | Behavior |
|---|---|
| Demo / mock | Uses simulated device behavior and mock firmware data for exercising the UI and workflow. No physical firmware write is proven by this mode. |
| Real hardware | Uses the real device transport. The current `ElxieDeviceTransport.ts` implementation uses Web Serial and `esptool-js` to request a serial port and attempt an ESP32-S3 bootloader handshake and flash operation. |

Use the project's current `.env.example` and configuration files to determine the supported environment variable names and defaults. Do not publish secrets in environment files.

## Firmware files

The repository includes these public firmware assets:

- `public/firmware/standalone_led_test.bin`
- `public/firmware/v1_green.bin`
- `public/firmware/v2_blue.bin`
- `public/firmware/v3_red.bin`

The firmware service currently contains entries that reference these paths. The `.bin` files are compiled firmware images; related source projects are maintained separately under the root `firmware/` directory.

**Before flashing hardware**, confirm that the selected binary matches the target board and intended firmware build, and verify its flash layout/address and other hardware-specific requirements. Do not infer compatibility from a filename alone.

## Android / WebUSB status

The project includes browser diagnostics for Web Serial and WebUSB capability and device selection. The current real-hardware transport imports `esptool-js` and uses **Web Serial**. WebUSB chooser detection by itself is not the same as a complete WebUSB flashing transport.

For Android testing, verify each stage separately:

1. The phone supports USB OTG/host mode and the cable carries data.
2. The browser can see and let the user select the ESP32-S3 device.
3. The application opens the required interface and establishes bootloader communication.
4. Firmware transfer and verification complete on the physical board.

Do not report mobile flashing as working until the complete physical-hardware sequence has been tested successfully.

## Tests and production build

Run the automated tests:

```bash
npm test
```

Run TypeScript checking:

```bash
npx tsc --noEmit
```

Create the production build:

```bash
npm run build
```

Vite writes the production bundle to `dist/`. Test results and build output should be checked after changes rather than assumed.

## Troubleshooting

### The device does not appear in the browser chooser

- Use a USB cable that supports data, not charging only.
- Confirm the robot is powered and the phone/laptop is acting as the USB host.
- Close other applications that may have the serial port open.
- Check browser support and the diagnostic panel.
- For ESP32 bootloader synchronization failures, follow the board-specific BOOT/RESET procedure documented by the hardware team.

### The website opens on Android but cannot connect

A page loading successfully only proves network access. Check OTG/host detection, the USB cable/adapter, browser chooser selection, and the actual transport implementation separately. Web Serial and WebUSB are not interchangeable.

### The progress indicator completes but the robot does not change

Confirm that demo mode is disabled for the hardware test, that the selected firmware was actually downloaded, that the bootloader handshake succeeded, and that the correct binary and flash address were used. A simulated progress sequence is not evidence of a physical firmware write.

### Firmware download fails

Check the selected firmware URL, whether the file exists under `public/firmware/`, and the browser console/network response. Verify manifest configuration if a remote manifest is used.

## Deployment

The project is configured as a Vite static web application and includes GitHub Pages deployment workflow configuration. A production deployment should be made only after tests and the production build pass. Confirm the configured Vite base path and deployment workflow when changing hosting settings.

Live website: https://asnasb.github.io/elxie-web-flasher/  
Repository: https://github.com/AsnaSB/elxie-web-flasher

## License

Check the repository's license and project ownership terms before redistributing this application or its firmware assets.
