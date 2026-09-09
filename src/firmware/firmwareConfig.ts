/**
 * Centralized Firmware Infrastructure Configuration for ELXIE
 * 
 * IMPORTANT:
 * All release URLs and repository structures are centralized here.
 * Raw repository URLs and firmware paths MUST NEVER be displayed
 * to normal end users in the UI.
 */

// TODO: Replace XXXXXX with the official ELXIE firmware repository.
// This must never be exposed in the normal user interface.
export const FIRMWARE_REPOSITORY = "XXXXXX";

// TODO: Replace XXXXXX with the official ELXIE firmware JSON manifest endpoint.
export const FIRMWARE_MANIFEST_URL = "XXXXXX";

// TODO: Replace XXXXXX with the official firmware binary release source/CDN.
export const FIRMWARE_RELEASE_SOURCE = "XXXXXX";

export const firmwareConfig = {
  repository: import.meta.env.VITE_FIRMWARE_REPOSITORY || FIRMWARE_REPOSITORY,
  manifest: import.meta.env.VITE_FIRMWARE_MANIFEST || FIRMWARE_MANIFEST_URL,
  releaseSource: FIRMWARE_RELEASE_SOURCE,
  defaultChannel: "stable" as const
};
