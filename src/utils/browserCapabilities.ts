/**
 * Browser & Platform Capability Detection for ELXIE Web Flasher
 * 
 * Accurately detects operating system, mobile form factors (Android / iOS / Desktop),
 * and hardware connectivity APIs (Web Serial, WebUSB) with actionable guidance.
 */

export interface DeviceCapabilities {
  /** True if running on a mobile phone or tablet */
  isMobile: boolean;
  /** True if running on an Android device */
  isAndroid: boolean;
  /** True if running on an Apple iOS device (iPhone / iPad / iPod) */
  isIOS: boolean;
  /** True if running on a desktop or laptop computer */
  isDesktop: boolean;
  /** True if running on Microsoft Windows */
  isWindows: boolean;
  /** True if running on macOS */
  isMac: boolean;
  /** True if running on Linux */
  isLinux: boolean;
  /** True if the browser supports the Web Serial API (navigator.serial) */
  supportsWebSerial: boolean;
  /** True if the browser supports the WebUSB API (navigator.usb) */
  supportsWebUSB: boolean;
  /** True if the browser can perform direct wired hardware flashing */
  canFlashDirectly: boolean;
  /** Browser brand name (Chrome, Edge, Safari, Firefox, Opera, Brave, etc.) */
  browserName: string;
  /** Operating system name */
  osName: string;
  /** High-level support categorization */
  supportStatus: 'fully_supported' | 'partially_supported' | 'unsupported';
  /** User-friendly compatibility explanation */
  statusMessage: string;
  /** Recommended action or alternative */
  recommendedAction: string;
}

/**
 * Detects the current browser brand from navigator.userAgent.
 */
export function detectBrowserName(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('edg/') || ua.includes('edge/')) return 'Microsoft Edge';
  if (ua.includes('opr/') || ua.includes('opera/')) return 'Opera';
  if (ua.includes('brave/')) return 'Brave';
  if (ua.includes('samsungbrowser/')) return 'Samsung Internet';
  if (ua.includes('chrome/') || ua.includes('crios/')) return 'Google Chrome';
  if (ua.includes('firefox/') || ua.includes('fxios/')) return 'Mozilla Firefox';
  if (ua.includes('safari/') && !ua.includes('chrome/')) return 'Apple Safari';
  return 'Browser';
}

/**
 * Detects the operating system from userAgent or platform.
 */
export function detectOSName(userAgent: string, platform?: string): string {
  const ua = userAgent.toLowerCase();
  const plat = (platform || '').toLowerCase();

  if (ua.includes('android')) return 'Android';
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'iOS';
  if (plat.includes('win') || ua.includes('windows')) return 'Windows';
  if (plat.includes('mac') || ua.includes('macintosh')) return 'macOS';
  if (plat.includes('linux') || ua.includes('linux')) return 'Linux';
  return 'Desktop';
}

/**
 * Analyzes the runtime environment and returns full hardware capability metrics.
 */
export function getDeviceCapabilities(
  customUserAgent?: string,
  customNavigator?: { serial?: unknown; usb?: unknown; platform?: string }
): DeviceCapabilities {
  const nav = customNavigator || (typeof navigator !== 'undefined' ? navigator : undefined);
  const ua = customUserAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  const platform = nav?.platform || '';

  const uaLower = ua.toLowerCase();
  const isAndroid = uaLower.includes('android');
  const isIOS = /iphone|ipad|ipod/.test(uaLower) || (platform === 'MacIntel' && typeof nav !== 'undefined' && 'maxTouchPoints' in nav && (nav as { maxTouchPoints: number }).maxTouchPoints > 1);
  const isMobile = isAndroid || isIOS || /mobile|tablet|webos|blackberry|iemobile|opera mini/.test(uaLower);
  const isDesktop = !isMobile;

  const isWindows = !isMobile && (uaLower.includes('windows') || platform.toLowerCase().includes('win'));
  const isMac = !isMobile && (uaLower.includes('macintosh') || platform.toLowerCase().includes('mac'));
  const isLinux = !isMobile && !isWindows && !isMac && (uaLower.includes('linux') || platform.toLowerCase().includes('linux'));

  const supportsWebSerial = Boolean(nav && 'serial' in nav && (nav as { serial?: unknown }).serial !== undefined);
  const supportsWebUSB = Boolean(nav && 'usb' in nav && (nav as { usb?: unknown }).usb !== undefined);
  const canFlashDirectly = supportsWebSerial;

  const browserName = detectBrowserName(ua);
  const osName = detectOSName(ua, platform);

  let supportStatus: 'fully_supported' | 'partially_supported' | 'unsupported' = 'unsupported';
  let statusMessage = '';
  let recommendedAction = '';

  if (supportsWebSerial) {
    if (isAndroid) {
      supportStatus = 'fully_supported';
      statusMessage = 'Web Serial API is available on this Android browser. Hardware flashing is supported with a USB OTG data cable and USB permissions.';
      recommendedAction = 'Connect your ESP32-S3 via a USB OTG data cable, tap "CONNECT ELXIE", and grant USB permission.';
    } else {
      supportStatus = 'fully_supported';
      statusMessage = 'Web Serial API is available on your browser.';
      recommendedAction = 'Connect your ESP32-S3 using a USB data cable and click "CONNECT ELXIE".';
    }
  } else if (isIOS) {
    supportStatus = 'unsupported';
    statusMessage = 'Direct hardware flashing is not available in iOS/iPadOS browsers due to platform WebKit restrictions.';
    recommendedAction = 'Please use a desktop computer (Windows/macOS/Linux) or an Android device with Web Serial support, or explore using Demo Mode.';
  } else if (isAndroid) {
    supportStatus = 'unsupported';
    statusMessage = 'Direct hardware flashing is not available in this Android browser because the Web Serial API is unavailable.';
    recommendedAction = 'Try a browser/environment with Web Serial API support (such as Kiwi Browser with USB OTG), or use a desktop computer.';
  } else {
    supportStatus = 'unsupported';
    statusMessage = `${browserName} on ${osName} does not provide the Web Serial API required for hardware flashing.`;
    recommendedAction = 'Please open ELXIE using Google Chrome, Microsoft Edge, Opera, or Brave on a desktop computer.';
  }

  return {
    isMobile,
    isAndroid,
    isIOS,
    isDesktop,
    isWindows,
    isMac,
    isLinux,
    supportsWebSerial,
    supportsWebUSB,
    canFlashDirectly,
    browserName,
    osName,
    supportStatus,
    statusMessage,
    recommendedAction
  };
}
