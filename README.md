# ELXIE Web Flasher

> Official browser-based wired firmware installer for the **ELXIE** educational robotic car platform.

![ELXIE Robotics](public/assets/robot/elxie-robot.svg)

---

## 1. Project Overview

The **ELXIE Web Flasher** allows students, educators, and makers to update and restore their ELXIE robots directly from modern web browsers over a single USB cable connection.

The application adheres to a strict Hardware Abstraction Layer (HAL) and centralized firmware manifest design. It is built to provide an approachable, friendly, and robust experience without exposing complex low-level serial parameters or technical repository structures to end users.

---

## 2. Key Features

- 🚗 **Car-Like Animated Robot Character**: An interactive SVG representation of ELXIE with an emotive OLED digital face screen that dynamically reacts to update stages (`friendly`, `curious`, `happy`, `focused`, `working`, `thinking`, `waiting`, `excited`, `concerned`).
- ⚡ **Wired Hardware Abstraction**: Clean separation between UI layers and underlying browser hardware APIs (Web Serial / WebUSB / DFU / UF2).
- 🔄 **Safe Update Lifecycle**: End-to-end multi-stage pipeline:
  `Connect` ➔ `Detect` ➔ `Check Version` ➔ `Select` ➔ `Prepare` ➔ `Download` ➔ `Flash` ➔ `Verify` ➔ `Restart` ➔ `Confirm`.
- 🛡️ **Empathetic Error Recovery**: Clear, actionable error cards (Cable Disconnected, Permission Denied, Incompatible Firmware, Checksum Mismatch) with one-click recovery paths.
- 🧪 **Full Demo Simulator**: Out-of-the-box virtual device testing (`VITE_DEMO_MODE=true`) with realistic timing, stage callbacks, and diagnostic fault injections.
- 🔍 **Developer Diagnostic Panel**: Embedded inspection panel displaying live state variables, memory logs, and simulation triggers.
- ♿ **Accessibility & Motion First**: Semantic markup, keyboard navigation, focus rings, and full `prefers-reduced-motion` compliance.

---

## 3. Architecture

```
elxie-web-flasher/
├── public/
│   ├── assets/
│   │   ├── logo/elxie-logo.svg       # Brand SVG logo
│   │   └── robot/elxie-robot.svg     # Car-like robot illustration
│   └── favicon.svg                   # Browser favicon
├── src/
│   ├── components/                   # Reusable UI & presentation widgets
│   │   ├── ConnectionCard.tsx        # USB connect instructions & trigger
│   │   ├── DebugPanel.tsx            # Floating developer diagnostic panel
│   │   ├── DeviceStatus.tsx          # Connected robot status summary
│   │   ├── ElxieLogo.tsx             # Brand header logo
│   │   ├── ElxieRobot.tsx            # Animated robotic vehicle visual
│   │   ├── ErrorCard.tsx             # Error and recovery guidance
│   │   ├── FirmwareCard.tsx          # Single release row item
│   │   ├── Footer.tsx                # Accessible footer
│   │   ├── Header.tsx                # Top nav with demo & debug toggles
│   │   ├── ProgressBar.tsx           # Multi-stage and percentage bar
│   │   ├── RobotFace.tsx             # Dynamic OLED facial expressions
│   │   ├── SuccessCard.tsx           # Update completion celebration
│   │   ├── UpdateStages.tsx          # Step checklist progression
│   │   └── VersionSelector.tsx       # Version picker with channel tabs
│   ├── firmware/                     # Firmware retrieval & validation layer
│   │   ├── firmwareConfig.ts         # Centralized endpoints & placeholders
│   │   ├── FirmwareManifest.ts       # Manifest schema & JSON validation
│   │   ├── FirmwareService.ts        # Download, chunking, and verification
│   │   └── VersionComparator.ts      # Semver sorting & channel filtering
│   ├── hardware/                     # Hardware Abstraction Layer (HAL)
│   │   ├── DeviceManager.ts          # Connection lifecycle & cable events
│   │   ├── DeviceTransport.ts        # HAL interface definitions
│   │   ├── ElxieDeviceTransport.ts   # Real hardware implementation (Placeholders)
│   │   ├── Flasher.ts                # Update process orchestrator
│   │   └── MockDeviceTransport.ts    # Virtual demo device simulator
│   ├── pages/                        # Screen state views
│   │   ├── Connect.tsx
│   │   ├── Device.tsx
│   │   ├── Firmware.tsx
│   │   ├── Flashing.tsx
│   │   ├── Landing.tsx
│   │   ├── Recovery.tsx
│   │   ├── Success.tsx
│   │   └── Update.tsx
│   ├── state/
│   │   └── flasherStore.ts           # Centralized React state machine
│   ├── styles/
│   │   └── globals.css               # Design tokens, cyber glow, OLED styles
│   ├── utils/
│   │   ├── errors.ts                 # Typed errors & friendly recovery copy
│   │   ├── format.ts                 # Byte and date formatters
│   │   ├── logger.ts                 # In-memory diagnostic ring buffer
│   │   └── version.ts                # Semantic version parser & comparator
│   ├── App.tsx                       # Root view orchestrator
│   └── main.tsx                      # React DOM mount
├── tests/                            # Automated Vitest test suite
│   ├── manifest.test.ts
│   ├── mockTransport.test.ts
│   ├── stateMachine.test.ts
│   └── version.test.ts
├── .env.example
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 4. Installation

Ensure **Node.js 18+** and **npm** are installed.

```bash
# Clone the repository and enter the directory
cd elxie-web-flasher

# Install dependencies
npm install
```

---

## 5. Development

Start the local Vite development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

By default, `VITE_DEMO_MODE=true` is enabled, allowing instant testing of the entire user journey without physical hardware.

---

## 6. Running Tests & Production Build

### Run Unit & Integration Tests
```bash
npm run test
```

### Build Production Bundle
```bash
npm run build
```

The compiled assets will be placed in the `dist/` directory, ready for hosting on any static web server (GitHub Pages, Cloudflare Pages, Firebase Hosting, Nginx, etc.).

---

## 7. Demo Mode vs. Real Hardware Mode

The application supports dual operating modes via dependency injection:

| Mode | Trigger | Behavior |
| :--- | :--- | :--- |
| **Demo Mode** | `VITE_DEMO_MODE=true` or Top Header Badge | Connects to `MockDeviceTransport`. Simulates realistic stage timing, byte progress, and allows injecting cable disconnects or verify errors via the debug panel. |
| **Real Hardware Mode** | `VITE_DEMO_MODE=false` or Top Header Badge | Connects to `ElxieDeviceTransport`. Requests browser device permissions and communicates directly with physical ELXIE robotic hardware. |

---

## 8. Browser Requirements

Physical hardware communication requires a browser with Web Hardware API support:

- **Supported (Desktop Recommended)**:
  - Google Chrome (v89+)
  - Microsoft Edge (v89+)
  - Opera (v75+)
  - Brave (v1.22+)
- **Not Supported for Physical Hardware**:
  - Mozilla Firefox *(Mozilla has declined Web Serial/WebUSB support on security grounds)*
  - Apple Safari (macOS / iOS)

*Note: In unsupported browsers, Demo Mode remains fully functional.*

---

## 9. Firmware Integration

Firmware manifests are served as structured JSON files. Normal users never see repository links or raw artifact paths.

### Manifest Schema Format:
```json
{
  "schemaVersion": "1.0",
  "deviceFamily": "ELXIE",
  "latest": "v1.3.0",
  "versions": [
    {
      "version": "v1.3.0",
      "releaseDate": "2026-07-20",
      "description": "Recommended release with improved motor control and OLED facial expressions.",
      "downloadUrl": "https://releases.elxie.local/firmware/elxie-v1.3.0.bin",
      "checksum": "sha256:4a8e5f21c9b3e71d8820f66e319b22a07c11f42d",
      "fileSize": 524288,
      "recommended": true,
      "channel": "stable",
      "highlights": [
        "Enhanced expressive OLED digital face animations",
        "Smoother dual-motor speed ramping"
      ]
    }
  ]
}
```

---

## 10. Placeholders That Must Be Replaced (`XXXXXX`)

As the embedded hardware flashing specifications and official cloud distribution endpoints are pending confirmation from the hardware engineering team, several architectural placeholders are marked with `XXXXXX`.

Here is the exact registry of all placeholders:

| # | Placeholder | File Location | Required Value | Source / Team Responsible | Required for Real Flashing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `VITE_FIRMWARE_REPOSITORY` | `.env.example`, `src/firmware/firmwareConfig.ts` | Official ELXIE firmware distribution repository URL | DevOps / Infrastructure Team | No (Internal reference) |
| **2** | `VITE_FIRMWARE_MANIFEST` | `.env.example`, `src/firmware/firmwareConfig.ts` | Public URL to the official JSON `manifest.json` | Cloud / Release Engineering | **Yes** |
| **3** | `VITE_FLASH_PROTOCOL` | `.env.example`, `src/hardware/ElxieDeviceTransport.ts` | Confirmed browser transport identifier (e.g. `'web-serial'`, `'web-usb'`) | Embedded Hardware Team | **Yes** |
| **4** | `ELXIE_USB_VID` / `ELXIE_USB_PID` | `src/hardware/ElxieDeviceTransport.ts` | Official USB Vendor ID (VID) and Product ID (PID) hex values | Hardware Team | **Yes** |
| **5** | `ELXIE_BAUD_RATE` | `src/hardware/ElxieDeviceTransport.ts` | Flashing communication speed (e.g. `115200` or `921600`) | Embedded Firmware Team | **Yes** |
| **6** | `ELXIE_FLASH_BASE_ADDRESS` | `src/hardware/ElxieDeviceTransport.ts` | Base flash memory offset (e.g. `0x0000` or `0x10000`) | Embedded Firmware Team | **Yes** |
| **7** | `ELXIE_DEFAULT_PROFILE` | `src/hardware/DeviceTransport.ts` | Complete hardware revision configuration profile | Hardware Engineering | **Yes** |
| **8** | Official Logo & Robot Artwork | `public/assets/`, `src/components/ElxieLogo.tsx`, `src/components/ElxieRobot.tsx` | High-resolution production vector SVG assets for ELXIE brand | Product Design Team | No (Placeholders present) |

---

## 11. Instructions for Replacing Placeholders

### To Connect to Real ELXIE Hardware:
1. Open `.env` and set:
   ```env
   VITE_DEMO_MODE=false
   VITE_FIRMWARE_MANIFEST=https://updates.elxie.io/manifest.json
   VITE_FLASH_PROTOCOL=web-serial
   ```
2. Open [`src/hardware/ElxieDeviceTransport.ts`](src/hardware/ElxieDeviceTransport.ts) and set the USB filters and flashing driver:
   ```ts
   export const ELXIE_TRANSPORT = "web-serial";
   export const ELXIE_USB_VID = 0x303A; // Replace with actual VID
   export const ELXIE_USB_PID = 0x1001; // Replace with actual PID
   ```
3. Implement the `flashFirmware` method in `ElxieDeviceTransport.ts` using the chosen flashing library (e.g. `esptool-js`, `@webusb/dfu`, or custom transport).

---

## 12. Troubleshooting & Recovery Guide

- **Robot not detected when clicking Connect**:
  - Check that the USB cable supports data (not a charge-only cable).
  - Verify ELXIE's power switch is in the **ON** position.
  - In Linux, ensure the user has permissions to access the serial/USB port (`dialout` group).
- **Update Interrupted / Disconnected**:
  - Click **Reconnect ELXIE** on the recovery screen without refreshing the browser.
- **Verification Failed**:
  - Click **Retry Installation** to safely re-write the firmware block.

---

## 13. License

ELXIE Educational Platform © 2026. All rights reserved.
