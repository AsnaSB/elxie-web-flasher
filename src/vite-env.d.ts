/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIRMWARE_REPOSITORY?: string;
  readonly VITE_FIRMWARE_MANIFEST?: string;
  readonly VITE_FLASH_PROTOCOL?: string;
  readonly VITE_DEMO_MODE?: string;
  readonly VITE_DEBUG_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
