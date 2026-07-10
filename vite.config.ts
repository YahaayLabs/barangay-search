import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    dts({
      include: ['src'],
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ],
  server: {
    open: '/playground/index.html',
    // Avoid CORS when Vite falls back to :5174 — playground calls same-origin proxy.
    proxy: {
      '/gis-api': {
        target: 'https://api.gis.ph',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gis-api/, ''),
        secure: true,
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BarangaySearch',
      fileName: 'barangay-search',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // Bundle gis.ph-sdk so a single CDN script works without bare imports
      external: [],
      output: {
        exports: 'named',
      },
    },
    sourcemap: true,
  },
})
