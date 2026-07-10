/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GISPH_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
