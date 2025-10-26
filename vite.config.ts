import { defineConfig, loadEnv } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '')
  
  // Set base URL for deployment
  const base = '/'
  
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
        drop_console: false, // Keep console logs for debugging
        drop_debugger: true,
        pure_funcs: [], // Don't remove any functions
        passes: 1, // Single pass to avoid issues
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
    devSourcemap: true, // Enable CSS source maps in dev
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
    port: 3000, // Use same port as dev for consistency
    open: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  },
  }
})
