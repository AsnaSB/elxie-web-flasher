/**
 * Semantic Version Utilities for ELXIE Firmware
 */

export interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  raw: string;
}

/**
 * Normalizes version strings by trimming leading 'v' or 'V'
 */
export function normalizeVersion(versionStr: string): string {
  if (!versionStr) return "0.0.0";
  return versionStr.trim().replace(/^[vV]/, '');
}

/**
 * Parses a semantic version string into major, minor, patch, and prerelease components.
 */
export function parseSemver(versionStr: string): ParsedVersion {
  const clean = normalizeVersion(versionStr);
  const [main, prerelease] = clean.split('-');
  const parts = main.split('.').map(num => parseInt(num, 10) || 0);

  return {
    major: parts[0] ?? 0,
    minor: parts[1] ?? 0,
    patch: parts[2] ?? 0,
    prerelease,
    raw: versionStr
  };
}

/**
 * Compares two semantic version strings.
 * Returns:
 *   1 if v1 > v2
 *  -1 if v1 < v2
 *   0 if v1 === v2
 */
export function compareVersions(v1: string, v2: string): number {
  const p1 = parseSemver(v1);
  const p2 = parseSemver(v2);

  if (p1.major !== p2.major) return p1.major > p2.major ? 1 : -1;
  if (p1.minor !== p2.minor) return p1.minor > p2.minor ? 1 : -1;
  if (p1.patch !== p2.patch) return p1.patch > p2.patch ? 1 : -1;

  // Prerelease comparison: release version without prerelease is higher than version with prerelease
  if (!p1.prerelease && p2.prerelease) return 1;
  if (p1.prerelease && !p2.prerelease) return -1;
  if (p1.prerelease && p2.prerelease) {
    return p1.prerelease.localeCompare(p2.prerelease);
  }

  return 0;
}

/**
 * Checks if targetVersion is strictly newer than currentVersion.
 */
export function isNewerVersion(targetVersion: string, currentVersion?: string): boolean {
  if (!currentVersion) return true;
  return compareVersions(targetVersion, currentVersion) > 0;
}

/**
 * Formats version with consistent 'v' prefix for display.
 */
export function formatDisplayVersion(versionStr?: string): string {
  if (!versionStr) return "Unknown";
  const clean = normalizeVersion(versionStr);
  return `v${clean}`;
}
