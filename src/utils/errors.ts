/**
 * Error Handling Architecture for ELXIE Web Flasher
 */

export type ElxieErrorCode =
  | "DEVICE_NOT_FOUND"
  | "NO_DEVICE_SELECTED"
  | "USB_CABLE_CHARGE_ONLY"
  | "DRIVER_MISSING"
  | "DEVICE_BUSY"
  | "BOOTLOADER_MODE_REQUIRED"
  | "PERMISSION_DENIED"
  | "UNSUPPORTED_BROWSER"
  | "CONNECTION_FAILED"
  | "DEVICE_DISCONNECTED"
  | "FIRMWARE_NOT_FOUND"
  | "FIRMWARE_DOWNLOAD_FAILED"
  | "INVALID_FIRMWARE"
  | "INCOMPATIBLE_FIRMWARE"
  | "FLASH_FAILED"
  | "VERIFICATION_FAILED"
  | "RESTART_FAILED"
  | "UNKNOWN_ERROR";

export interface ErrorRecoveryAction {
  label: string;
  action: "retry" | "reconnect" | "select_version" | "home" | "guide";
  isPrimary?: boolean;
}

export interface FriendlyErrorInfo {
  title: string;
  message: string;
  troubleshootingTip: string;
  recoveryActions: ErrorRecoveryAction[];
}

export class ElxieError extends Error {
  readonly code: ElxieErrorCode;
  readonly technicalDetail?: string;

  constructor(code: ElxieErrorCode, message?: string, technicalDetail?: string) {
    super(message || code);
    this.name = "ElxieError";
    this.code = code;
    this.technicalDetail = technicalDetail;
  }
}

export function getFriendlyErrorInfo(error: unknown): FriendlyErrorInfo {
  let code: ElxieErrorCode = "UNKNOWN_ERROR";
  let fallbackMessage = "An unexpected error occurred while communicating with ELXIE.";

  if (error instanceof ElxieError) {
    code = error.code;
    fallbackMessage = error.message;
  } else if (error instanceof Error) {
    fallbackMessage = error.message;
    const msg = error.message.toLowerCase();
    if (msg.includes('no port selected') || error.name === 'NotFoundError') {
      code = 'NO_DEVICE_SELECTED';
    } else if (msg.includes('already open') || msg.includes('busy') || msg.includes('access denied')) {
      code = 'DEVICE_BUSY';
    } else if (msg.includes('security') || msg.includes('permission')) {
      code = 'PERMISSION_DENIED';
    } else if (msg.includes('not supported') || msg.includes('serial') && msg.includes('undefined')) {
      code = 'UNSUPPORTED_BROWSER';
    }
  }

  switch (code) {
    case "NO_DEVICE_SELECTED":
    case "DEVICE_NOT_FOUND":
      return {
        title: "No ESP32-S3 Detected",
        message: "No compatible ESP32-S3 board or serial port was selected in the browser connection prompt.",
        troubleshootingTip: "1. Connect your ESP32-S3 using a USB data cable (not a charge-only cable).\n2. For Android, ensure a USB OTG adapter is connected and OTG is enabled.\n3. Try a different USB port or check the Device Setup Guide.",
        recoveryActions: [
          { label: "Scan Again", action: "reconnect", isPrimary: true },
          { label: "Device Setup Guide", action: "guide" },
          { label: "Return Home", action: "home" }
        ]
      };

    case "USB_CABLE_CHARGE_ONLY":
      return {
        title: "USB Cable Lacks Data Lines",
        message: "Your ESP32-S3 board is receiving power, but no data interface is being recognized by the operating system.",
        troubleshootingTip: "Many low-cost USB cables only provide 5V power wires. Replace your cable with a verified USB data sync cable.",
        recoveryActions: [
          { label: "Try Another Cable & Retry", action: "reconnect", isPrimary: true },
          { label: "Device Setup Guide", action: "guide" },
          { label: "Return Home", action: "home" }
        ]
      };

    case "DRIVER_MISSING":
      return {
        title: "USB Driver or Port Not Recognized",
        message: "Your computer or phone does not recognize the USB-to-UART or Native USB interface of the ESP32-S3 board.",
        troubleshootingTip: "On Windows, open Device Manager and verify 'Ports (COM & LPT)'. Native ESP32-S3 USB works automatically on Windows 10/11; CP2102/CH340 boards may require standard drivers.",
        recoveryActions: [
          { label: "Open Driver Guide", action: "guide", isPrimary: true },
          { label: "Scan Again", action: "reconnect" },
          { label: "Return Home", action: "home" }
        ]
      };

    case "DEVICE_BUSY":
      return {
        title: "Serial Port Already in Use",
        message: "The ESP32-S3 serial port is currently locked by another application.",
        troubleshootingTip: "Please close any open Serial Monitors (such as Arduino IDE, VS Code Serial Monitor, PuTTY, PlatformIO, or another browser tab) and click 'Scan Again'.",
        recoveryActions: [
          { label: "Scan Again", action: "reconnect", isPrimary: true },
          { label: "Device Setup Guide", action: "guide" },
          { label: "Return Home", action: "home" }
        ]
      };

    case "BOOTLOADER_MODE_REQUIRED":
      return {
        title: "Bootloader Download Mode Required",
        message: "The ESP32-S3 ROM bootloader did not automatically respond to the flash synchronization signal.",
        troubleshootingTip: "Hold down the 'BOOT' (or GPIO 0) button, tap the 'RESET' (or EN) button once, then release the 'BOOT' button. Click 'Scan Again'.",
        recoveryActions: [
          { label: "Retry in Bootloader Mode", action: "reconnect", isPrimary: true },
          { label: "Device Setup Guide", action: "guide" },
          { label: "Return Home", action: "home" }
        ]
      };

    case "PERMISSION_DENIED":
      return {
        title: "USB Access Permission Denied",
        message: "Browser access to the USB serial device was cancelled or denied.",
        troubleshootingTip: "Click 'Grant Access', select your ESP32-S3 device in the dialog, and click 'Connect'. On Android, grant the USB permission popup.",
        recoveryActions: [
          { label: "Grant Access", action: "reconnect", isPrimary: true },
          { label: "Device Setup Guide", action: "guide" },
          { label: "Return Home", action: "home" }
        ]
      };

    case "UNSUPPORTED_BROWSER":
      return {
        title: "Browser or OS Not Supported",
        message: "Your current browser or operating system does not support wired Web Serial hardware flashing.",
        troubleshootingTip: "• Desktop: Use Google Chrome, Microsoft Edge, Opera, or Brave.\n• Android: Use Chromium / Google Chrome with a USB OTG adapter.\n• iOS: Apple restricts direct USB serial access on iPhone/iPad; please use a computer or Android device, or switch to Demo Mode.",
        recoveryActions: [
          { label: "Open Setup Guide", action: "guide", isPrimary: true },
          { label: "Return Home", action: "home" }
        ]
      };

    case "DEVICE_DISCONNECTED":
      return {
        title: "USB Connection Interrupted",
        message: "The ESP32-S3 was unplugged or disconnected during the update sequence.",
        troubleshootingTip: "Check your USB cable connection and OTG adapter. Keep the board steady and undisturbed during updates.",
        recoveryActions: [
          { label: "Reconnect ESP32-S3", action: "reconnect", isPrimary: true },
          { label: "Device Setup Guide", action: "guide" },
          { label: "Return Home", action: "home" }
        ]
      };

    case "CONNECTION_FAILED":
      return {
        title: "Connection Failed",
        message: fallbackMessage || "Unable to establish communication with the ESP32-S3 board.",
        troubleshootingTip: "Unplug the USB cable, wait 3 seconds, reconnect it firmly, and click 'Scan Again'.",
        recoveryActions: [
          { label: "Scan Again", action: "reconnect", isPrimary: true },
          { label: "Device Setup Guide", action: "guide" },
          { label: "Return Home", action: "home" }
        ]
      };

    case "FIRMWARE_DOWNLOAD_FAILED":
      return {
        title: "Download Failed",
        message: "Could not download the selected ELXIE software update package.",
        troubleshootingTip: "Check your network connection and retry the download.",
        recoveryActions: [
          { label: "Try Again", action: "retry", isPrimary: true },
          { label: "Choose Another Version", action: "select_version" },
          { label: "Return Home", action: "home" }
        ]
      };

    case "INVALID_FIRMWARE":
    case "INCOMPATIBLE_FIRMWARE":
      return {
        title: "Incompatible Firmware Binary",
        message: "The selected firmware binary is not compatible with the ESP32-S3 N16R8 hardware.",
        troubleshootingTip: "Please select one of the verified official test versions (V1, V2, V3) or an official stable release.",
        recoveryActions: [
          { label: "Choose Another Version", action: "select_version", isPrimary: true },
          { label: "Return Home", action: "home" }
        ]
      };

    case "FLASH_FAILED":
      return {
        title: "Installation Failed",
        message: "An error occurred while writing flash memory to the ESP32-S3.",
        troubleshootingTip: "Ensure the USB cable is firmly seated, the board is powered properly, and retry.",
        recoveryActions: [
          { label: "Retry Flash", action: "retry", isPrimary: true },
          { label: "Reconnect Device", action: "reconnect" },
          { label: "Return Home", action: "home" }
        ]
      };

    case "VERIFICATION_FAILED":
      return {
        title: "Verification Check Failed",
        message: "The firmware checksum on the flash memory could not be verified.",
        troubleshootingTip: "The board was safely halted. Please re-flash the firmware.",
        recoveryActions: [
          { label: "Retry Installation", action: "retry", isPrimary: true },
          { label: "Return Home", action: "home" }
        ]
      };

    case "RESTART_FAILED":
      return {
        title: "Manual Reset Required",
        message: "The firmware was written successfully, but the automatic reboot command timed out.",
        troubleshootingTip: "Press the 'RESET' (EN) button on your ESP32-S3 board to start the new firmware.",
        recoveryActions: [
          { label: "Check Connection", action: "reconnect", isPrimary: true },
          { label: "Return Home", action: "home" }
        ]
      };

    default:
      return {
        title: "Connection Issue",
        message: fallbackMessage,
        troubleshootingTip: "Please ensure your ESP32-S3 board is connected via a USB data cable and try again.",
        recoveryActions: [
          { label: "Scan Again", action: "reconnect", isPrimary: true },
          { label: "Device Setup Guide", action: "guide" },
          { label: "Return Home", action: "home" }
        ]
      };
  }
}
