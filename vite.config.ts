import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'es2015', // Support older browsers while maintaining modern features
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console functions
        passes: 2, // Multiple compression passes
      },
      mangle: {
        toplevel: true, // Mangle top-level names
        safari10: true, // Safari 10 compatibility
      },
      format: {
        comments: false, // Remove comments
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['preact', 'preact-router'],
          utils: ['preact/hooks', 'preact/jsx-runtime'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          components: [
            './src/components/About',
            './src/components/Experience',
            './src/components/Education',
            './src/components/Skills',
            './src/components/Projects',
            './src/components/Certifications',
            './src/components/Interests',
            './src/components/Awards',
            './src/components/Testimonials'
          ]
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Optimize chunk loading
        experimentalMinChunkSize: 10000, // Minimum chunk size in bytes
      },
      // Tree shaking optimization
      treeshake: {
        moduleSideEffects: false, // Assume no side effects
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
    // Enable source maps for debugging (optional - can be disabled for production)
    sourcemap: false,
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000, // 1MB warning limit
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'preact',
      'preact/hooks',
      'preact-router',
      'i18next',
      'react-i18next',
      'i18next-browser-languagedetector'
    ],
    exclude: ['@preact/preset-vite'],
  },
  // Server configuration for development
  server: {
    port: 3000,
    open: true,
    // Security headers for development
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  },
  // Preview configuration
  preview: {
    port: 4173,
    open: true,
    // Security headers for preview
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  },
})
