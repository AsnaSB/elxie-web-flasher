import { describe, it, expect } from 'vitest';
import {
  compareVersions,
  isNewerVersion,
  parseSemver,
  normalizeVersion,
  formatDisplayVersion
} from '../src/utils/version';

describe('Version Utilities', () => {
  describe('normalizeVersion', () => {
    it('strips leading v or V', () => {
      expect(normalizeVersion('v1.2.3')).toBe('1.2.3');
      expect(normalizeVersion('V2.0.0')).toBe('2.0.0');
      expect(normalizeVersion('1.0.0')).toBe('1.0.0');
      expect(normalizeVersion('')).toBe('0.0.0');
    });
  });

  describe('parseSemver', () => {
    it('correctly parses major, minor, patch and prerelease', () => {
      const parsed = parseSemver('v1.3.5-beta.2');
      expect(parsed.major).toBe(1);
      expect(parsed.minor).toBe(3);
      expect(parsed.patch).toBe(5);
      expect(parsed.prerelease).toBe('beta.2');
    });

    it('handles incomplete versions gracefully', () => {
      const parsed = parseSemver('v2.1');
      expect(parsed.major).toBe(2);
      expect(parsed.minor).toBe(1);
      expect(parsed.patch).toBe(0);
    });
  });

  describe('compareVersions', () => {
    it('identifies higher major versions', () => {
      expect(compareVersions('v2.0.0', 'v1.9.9')).toBe(1);
      expect(compareVersions('v1.0.0', 'v2.0.0')).toBe(-1);
    });

    it('identifies higher minor versions', () => {
      expect(compareVersions('v1.3.0', 'v1.2.0')).toBe(1);
      expect(compareVersions('v1.2.0', 'v1.3.0')).toBe(-1);
    });

    it('identifies higher patch versions', () => {
      expect(compareVersions('v1.2.5', 'v1.2.4')).toBe(1);
      expect(compareVersions('v1.2.4', 'v1.2.5')).toBe(-1);
    });

    it('identifies equal versions', () => {
      expect(compareVersions('v1.2.3', '1.2.3')).toBe(0);
    });

    it('prioritizes stable release over prerelease', () => {
      expect(compareVersions('v1.3.0', 'v1.3.0-beta.1')).toBe(1);
      expect(compareVersions('v1.3.0-beta.1', 'v1.3.0')).toBe(-1);
    });
  });

  describe('isNewerVersion', () => {
    it('returns true when candidate is newer than current', () => {
      expect(isNewerVersion('v1.3.0', 'v1.2.0')).toBe(true);
      expect(isNewerVersion('v2.0.0', 'v1.9.9')).toBe(true);
    });

    it('returns false when candidate is older or equal', () => {
      expect(isNewerVersion('v1.2.0', 'v1.3.0')).toBe(false);
      expect(isNewerVersion('v1.2.0', 'v1.2.0')).toBe(false);
    });

    it('returns true when current version is undefined', () => {
      expect(isNewerVersion('v1.0.0', undefined)).toBe(true);
    });
  });

  describe('formatDisplayVersion', () => {
    it('formats with standard v prefix', () => {
      expect(formatDisplayVersion('1.3.0')).toBe('v1.3.0');
      expect(formatDisplayVersion('v1.3.0')).toBe('v1.3.0');
      expect(formatDisplayVersion(undefined)).toBe('Unknown');
    });
  });
});
