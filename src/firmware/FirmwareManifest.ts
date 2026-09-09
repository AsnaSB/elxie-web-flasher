/**
 * Firmware Manifest Schema and Validation
 */

import { ValidatedFirmwareMetadata } from './FirmwareValidator';

export type ReleaseChannel = "stable" | "beta" | "development" | "custom" | "test";

export interface FirmwareVersion {
  version: string;
  releaseDate?: string;
  description?: string;
  downloadUrl: string;
  checksum?: string;
  fileSize?: number;
  recommended?: boolean;
  channel?: ReleaseChannel;
  minHardwareRevision?: string;
  highlights?: string[];
  flashOffset?: number;
  isCustomUpload?: boolean;
  customBinaryData?: ArrayBuffer;
  metadata?: ValidatedFirmwareMetadata;
  ledColor?: "green" | "blue" | "red";
  testVersionKey?: "v1" | "v2" | "v3";
}

export interface FirmwareManifest {
  schemaVersion?: string;
  deviceFamily?: string;
  latest: string;
  versions: FirmwareVersion[];
}

/**
 * Validates a parsed JSON object against the expected FirmwareManifest schema.
 */
export function validateManifest(data: unknown): FirmwareManifest {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid manifest: root element must be an object.");
  }

  const manifest = data as Record<string, unknown>;

  if (typeof manifest.latest !== "string" || !manifest.latest.trim()) {
    throw new Error("Invalid manifest: 'latest' version string is required.");
  }

  if (!Array.isArray(manifest.versions) || manifest.versions.length === 0) {
    throw new Error("Invalid manifest: 'versions' array must contain at least one release.");
  }

  const validatedVersions: FirmwareVersion[] = manifest.versions.map((v: unknown, idx: number) => {
    if (!v || typeof v !== "object") {
      throw new Error(`Invalid manifest: version entry at index ${idx} is not an object.`);
    }

    const item = v as Record<string, unknown>;
    if (typeof item.version !== "string" || !item.version.trim()) {
      throw new Error(`Invalid manifest: missing 'version' string at index ${idx}.`);
    }
    if (typeof item.downloadUrl !== "string" || !item.downloadUrl.trim()) {
      throw new Error(`Invalid manifest: missing 'downloadUrl' for version ${item.version}.`);
    }

    let channel: ReleaseChannel = "stable";
    if (item.channel === "beta" || item.channel === "development" || item.channel === "custom" || item.channel === "test") {
      channel = item.channel;
    }

    return {
      version: item.version,
      releaseDate: typeof item.releaseDate === "string" ? item.releaseDate : undefined,
      description: typeof item.description === "string" ? item.description : undefined,
      downloadUrl: item.downloadUrl,
      checksum: typeof item.checksum === "string" ? item.checksum : undefined,
      fileSize: typeof item.fileSize === "number" ? item.fileSize : undefined,
      recommended: Boolean(item.recommended),
      channel,
      minHardwareRevision: typeof item.minHardwareRevision === "string" ? item.minHardwareRevision : undefined,
      highlights: Array.isArray(item.highlights) ? (item.highlights as string[]) : undefined,
      ledColor: (item.ledColor === "green" || item.ledColor === "blue" || item.ledColor === "red") ? item.ledColor : undefined,
      testVersionKey: (item.testVersionKey === "v1" || item.testVersionKey === "v2" || item.testVersionKey === "v3") ? item.testVersionKey : undefined
    };
  });

  return {
    schemaVersion: typeof manifest.schemaVersion === "string" ? manifest.schemaVersion : "1.0",
    deviceFamily: typeof manifest.deviceFamily === "string" ? manifest.deviceFamily : "ELXIE",
    latest: manifest.latest,
    versions: validatedVersions
  };
}
