import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { resolve } from 'path'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/portfolio/' : '/',
  plugins: [
    preact(),
    createHtmlPlugin({
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true
      },
      inject: {
        data: {
          title: 'João Maia - Software Developer Portfolio',
          description: 'Enterprise-grade portfolio showcasing full-stack engineering expertise',
          keywords: 'software engineer, full-stack developer, cloud architecture, enterprise solutions',
          author: 'João Maia',
          ogImage: './img/profile.jpg',
          ogUrl: 'https://joaomaia.dev'
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
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['preact', 'preact-router']
        },
        // Enterprise-grade chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Advanced Terser configuration for obfuscation
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2
      },
      mangle: {
        toplevel: false,
        safari10: true,
        properties: false
      },
      format: {
        comments: false
      }
    },
    // Copy vendor assets
    copyPublicDir: true,
    // Enable chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  preview: {
    port: 3000,
    open: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  optimizeDeps: {
    include: ['preact', 'preact-router', 'preact/jsx-runtime', 'preact/hooks'],
    exclude: ['@types/node']
  },
  // Ensure static assets are served correctly
  publicDir: 'public',
  // TypeScript support
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    target: 'es2020'
  },
  // Performance optimizations
  define: {
    __DEV__: false,
    __PROD__: true
  }
})
