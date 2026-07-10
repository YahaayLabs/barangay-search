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
