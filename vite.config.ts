import { defineConfig, loadEnv } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Determine base path:
  // - For GitHub Pages: use repository name from env or default to '/portfolio/'
  // - For custom domain: use VITE_APP_URL pathname
  // - For local dev: use '/'
  let base = '/'
  if (env.VITE_BASE_PATH) {
    // Explicit base path (for GitHub Pages: '/portfolio/')
    base = env.VITE_BASE_PATH
  } else if (env.VITE_APP_URL) {
    // Custom domain URL
    try {
      const url = new URL(env.VITE_APP_URL)
      base = url.pathname || '/'
    } catch {
      base = '/'
    }
  }
  // Ensure base path ends with '/' for proper asset resolution
  if (base !== '/' && !base.endsWith('/')) {
    base += '/'
  }
  const isProductionLike = mode === 'production' || mode === 'staging'
  const pureConsoleFunctions = isProductionLike
    ? ['console.log', 'console.info', 'console.debug', 'console.warn']
    : []

  return {
    base,
    plugins: [
      preact()
    ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  publicDir: 'public',
    build: {
      target: 'es2015',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProductionLike,
          drop_debugger: true,
          pure_funcs: pureConsoleFunctions,
          passes: 1,
        },
      mangle: {
        toplevel: false, // Don't mangle top-level names
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // Simplified chunking - let Vite handle it automatically
        manualChunks: undefined,
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Ensure no source references
        sourcemap: false,
      },
      // Conservative tree shaking
      treeshake: {
        moduleSideEffects: true, // Assume side effects exist
        propertyReadSideEffects: true,
        unknownGlobalSideEffects: true,
      },
    },
    sourcemap: false, // Completely disable source maps in production
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    chunkSizeWarningLimit: 2000, // Increase warning limit
    assetsInlineLimit: 4096,
    // Ensure no source files are included
    emptyOutDir: true,
  },
    css: {
      postcss: './postcss.config.cjs',
      devSourcemap: true,
    },
    optimizeDeps: {
      include: [
        'preact',
        'preact/hooks',
        'preact/compat',
        'preact-router'
      ],
      exclude: ['@preact/preset-vite'],
    },
    server: {
      port: 3000,
      open: true,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
      fs: {
        allow: ['..']
      }
    },
    preview: {
      port: 3000,
      open: true,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
    },
  }
})
