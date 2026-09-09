import { describe, it, expect } from 'vitest';
import { validateManifest } from '../src/firmware/FirmwareManifest';
import { VersionComparator } from '../src/firmware/VersionComparator';

describe('Firmware Manifest and VersionComparator', () => {
  const validManifestData = {
    schemaVersion: "1.0",
    deviceFamily: "ELXIE",
    latest: "v1.3.0",
    versions: [
      {
        version: "v1.2.0",
        releaseDate: "2026-05-14",
        description: "Previous release",
        downloadUrl: "https://example.com/v1.2.0.bin",
        recommended: false,
        channel: "stable"
      },
      {
        version: "v1.3.0",
        releaseDate: "2026-07-20",
        description: "Latest recommended release",
        downloadUrl: "https://example.com/v1.3.0.bin",
        recommended: true,
        channel: "stable"
      },
      {
        version: "v1.4.0-beta.1",
        releaseDate: "2026-08-01",
        description: "Beta release",
        downloadUrl: "https://example.com/v1.4.0-beta.1.bin",
        recommended: false,
        channel: "beta"
      }
    ]
  };

  describe('validateManifest', () => {
    it('validates a correct manifest structure', () => {
      const parsed = validateManifest(validManifestData);
      expect(parsed.latest).toBe('v1.3.0');
      expect(parsed.versions.length).toBe(3);
      expect(parsed.versions[1].version).toBe('v1.3.0');
      expect(parsed.versions[1].recommended).toBe(true);
    });

    it('throws error when latest is missing', () => {
      const invalid = { ...validManifestData, latest: '' };
      expect(() => validateManifest(invalid)).toThrow("Invalid manifest: 'latest' version string is required.");
    });

    it('throws error when versions array is empty', () => {
      const invalid = { ...validManifestData, versions: [] };
      expect(() => validateManifest(invalid)).toThrow("Invalid manifest: 'versions' array must contain at least one release.");
    });

    it('throws error when a version item is missing downloadUrl', () => {
      const invalid = {
        latest: 'v1.0.0',
        versions: [{ version: 'v1.0.0', downloadUrl: '' }]
      };
      expect(() => validateManifest(invalid)).toThrow("missing 'downloadUrl'");
    });
  });

  describe('VersionComparator', () => {
    it('sorts recommended versions to the top', () => {
      const parsed = validateManifest(validManifestData);
      const sorted = VersionComparator.sortVersions(parsed.versions);
      expect(sorted[0].version).toBe('v1.3.0');
      expect(sorted[0].recommended).toBe(true);
    });

    it('filters versions by channel', () => {
      const parsed = validateManifest(validManifestData);
      const stableOnly = VersionComparator.filterByChannel(parsed.versions, 'stable');
      expect(stableOnly.length).toBe(2);
      expect(stableOnly.every(v => v.channel === 'stable')).toBe(true);

      const betaOnly = VersionComparator.filterByChannel(parsed.versions, 'beta');
      expect(betaOnly.length).toBe(1);
      expect(betaOnly[0].version).toBe('v1.4.0-beta.1');
    });
  });
});
