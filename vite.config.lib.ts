import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Library build - React as external dependency
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-lib',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AdkClient',
      fileName: (format) => `adk-client.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: true
  },
  css: {
    postcss: './postcss.config.js'
  }
})
