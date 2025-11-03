import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  optimizeDeps: {
    include: [
      '@emotion/is-prop-valid',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion',
      '@headlessui/react',
      '@heroicons/react',
      '@tanstack/react-query',
      'clsx',
      'date-fns',
      'lucide-react',
      'tailwind-merge',
      'zustand'
    ]
  }
})
