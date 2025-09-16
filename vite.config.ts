import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const buildMode = process.env.BUILD_MODE

export default defineConfig(() => {
  // Base configuration
  const baseConfig = {
    plugins: [
      react({
        jsxRuntime: 'classic',
        jsxImportSource: undefined
      })
    ],
    esbuild: {
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment'
    },
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    css: {
      postcss: './postcss.config.js'
    }
  }

  // Library build (React as external dependency)
  if (buildMode === 'lib') {
    return {
      ...baseConfig,
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
      }
    }
  }

  // Standalone build (React bundled in)
  if (buildMode === 'standalone') {
    return {
      plugins: [
        react({
          jsxRuntime: 'classic',
          jsxImportSource: undefined
        })
      ],
      esbuild: {
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment'
      },
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
          external: []
        },
        cssCodeSplit: false,
        sourcemap: true,
        minify: 'esbuild'
      },
      css: {
        postcss: './postcss.config.js'
      }
    }
  }

  // Development mode (default)
  return {
    ...baseConfig,
    publicDir: 'public',
    preview: {
      port: 4173,
      open: true
    }
  }
})
