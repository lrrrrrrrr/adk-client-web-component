import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Standalone build - React bundled in
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  build: {
    outDir: 'dist-standalone',
    lib: {
      entry: resolve(__dirname, 'src/web-component/standalone.ts'),
      name: 'AdkClient',
      fileName: () => 'adk-client-standalone.js',
      formats: ['umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    cssCodeSplit: false,
    sourcemap: true
  },
  css: {
    postcss: './postcss.config.js'
  }
})
