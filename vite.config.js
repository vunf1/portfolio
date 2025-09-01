import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  plugins: [
    preact(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'João Maia - Software Developer Portfolio'
        }
      }
    })
  ],
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['preact', 'preact-router']
        }
      }
    },
    // Copy vendor assets
    copyPublicDir: true
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  preview: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['preact', 'preact/jsx-runtime', 'preact/hooks', 'preact-router']
  },
  // Ensure static assets are served correctly
  publicDir: 'public'
})
