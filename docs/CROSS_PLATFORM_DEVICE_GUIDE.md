# ELXIE Cross-Platform Device & Flashing Guide

This document provides a technical reference for connecting and flashing the **ESP32-S3 N16R8** development board using the **ELXIE Web Flasher** application.

---

## 1. Platform Compatibility Matrix

The ELXIE Web Flasher relies exclusively on the **Web Serial API** for hardware communication and firmware flashing.

| Platform / OS | Browser / Environment | Direct Hardware Flashing |
| :--- | :--- | :--- |
| **Windows (10 / 11)** | Chromium browser with Web Serial (Google Chrome, Microsoft Edge, Brave, Opera) | Supported |
| **macOS (Intel / Apple Silicon)** | Chromium browser with Web Serial (Google Chrome, Microsoft Edge, Brave, Opera) | Supported |
| **Linux (Ubuntu, Debian, Fedora)** | Chromium browser with Web Serial (Google Chrome, Chromium, Brave, Edge) | Supported, serial port permissions (`dialout` group) may be required |
| **Android (Smartphones / Tablets)** | Browser exposing Web Serial + USB OTG (e.g., Kiwi Browser) | Supported when browser and device provide the required Web Serial API |
| **Apple iOS / iPadOS (iPhone / iPad)** | Current mainstream browsers (Safari, Chrome iOS, Firefox iOS) | Not supported for direct Web Serial flashing (platform WebKit restrictions) |

> [!NOTE]
> Standard Google Chrome for Android currently leaves the Web Serial API disabled by default. On Android, direct flashing requires a browser that exposes the Web Serial API (such as Kiwi Browser) or enabling experimental browser flags (`chrome://flags#enable-web-serial`), along with an active USB OTG connection.

---

## 2. ESP32-S3 Hardware Interfaces & Drivers

The target hardware is an **ESP32-S3 N16R8 development board**.

### 1. Native ESP32-S3 USB Interface (Default)
* **Hardware Details**: Built-in USB Serial/JTAG / CDC controller (Vendor ID `0x303A`, Product ID `0x1001`).
* **Windows (10 & 11)**: Uses the built-in Microsoft USB CDC driver (`usbser.sys`). **No separate CP210x or CH340 driver is required.**
* **macOS / Linux / Android**: Handled automatically by native operating system CDC ACM drivers.

### 2. Secondary USB-to-UART Bridge (Only If Present)
* Some development boards feature a second USB connector connected to a dedicated USB-to-UART bridge (e.g., Silicon Labs CP2102/CP2104 or WCH CH340).
* **Driver Requirement**: Vendor drivers are **only** required if physically connected to this secondary UART bridge port.

---

## 3. Connection Procedures

### A. Desktop Computers (Windows, macOS, Linux)
1. Connect the ESP32-S3 board to your computer using a verified **USB data cable**.
2. Open **ELXIE Web Flasher** in **Google Chrome**, **Microsoft Edge**, **Brave**, or **Opera**.
3. Click **"CONNECT ELXIE"**.
4. Select the serial device in the browser dialog and click **Connect**.
5. Choose your target firmware version (V1 Green, V2 Blue, V3 Red, or custom `.bin`) and proceed with the update.

### B. Android Mobile Devices
1. Ensure your Android device supports **USB OTG** (enable OTG in Android Settings if required).
2. Connect the ESP32-S3 to your phone using a **USB OTG adapter** and a verified USB data cable.
3. Open ELXIE in a browser that supports the Web Serial API (e.g., **Kiwi Browser**).
4. Tap **"CONNECT ELXIE"**.
5. When prompted, grant USB device permissions to the browser.
6. Select the firmware version and initiate flashing.

---

## 4. Troubleshooting & Recovery Procedures

### 1. Device Not Found / Port Selector Empty (`NO_DEVICE_SELECTED`)
* **Cause**: The cable may be a charge-only cable lacking data wires, or the USB connection is loose.
* **Fix**: Use a verified USB data cable that supports high-speed sync. If on Android, verify USB OTG is active.

### 2. Port Locked or In Use (`DEVICE_BUSY`)
* **Cause**: Another program (Arduino IDE Serial Monitor, VS Code Serial Monitor, PlatformIO, or PuTTY) has exclusive access to the serial port.
* **Fix**: Close all other serial monitors and click **"Refresh / Scan Again"**.

### 3. Recovery Bootloader Sequence (`BOOTLOADER_MODE_REQUIRED`)
* **When to use**: If the ESP32-S3 fails to respond to automatic software reset or synchronization times out.
* **Procedure**:
  1. Hold down the physical **BOOT** (GPIO 0) button on the ESP32-S3.
  2. Tap and release the **RESET** (EN) button once.
  3. Release the **BOOT** button.
  4. Return to ELXIE and click **"Scan Again"**.

---

## 5. In-App Device Setup & Diagnostics Guide

The ELXIE application provides a built-in **Device Setup Guide** accessible from the connection screen and error recovery views:
* **Windows & Desktop Tab**: Explains native USB CDC driver detection and Device Manager verification.
* **Android Phone Tab**: Outlines USB OTG requirements and browser Web Serial prerequisites.
* **Troubleshooting Tab**: Quick reference for cables, port conflicts, and bootloader recovery.
* **Live Capability Diagnostics**: Real-time evaluation of `navigator.serial` availability on the user's browser.
