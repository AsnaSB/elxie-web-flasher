/**
 * Firmware Version Sorting and Filtering
 */

import { FirmwareVersion, ReleaseChannel } from './FirmwareManifest';
import { compareVersions } from '../utils/version';

export class VersionComparator {
  /**
   * Sorts firmware versions with recommended versions on top,
   * followed by descending semantic version number.
   */
  static sortVersions(versions: FirmwareVersion[]): FirmwareVersion[] {
    return [...versions].sort((a, b) => {
      // If one is marked explicitly as recommended, it takes priority
      if (a.recommended && !b.recommended) return -1;
      if (!a.recommended && b.recommended) return 1;

      // Otherwise sort by semantic version descending (newer first)
      return compareVersions(b.version, a.version);
    });
  }

  /**
   * Filters firmware versions by channel.
   */
  static filterByChannel(versions: FirmwareVersion[], channel?: ReleaseChannel | "all"): FirmwareVersion[] {
    if (!channel || channel === "all") return versions;
    return versions.filter(v => v.channel === channel);
  }
}
