import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // For test mode, use test defaults unless explicitly set via process.env
  // This ensures tests use predictable values by default
  const isTestMode = mode === 'test' || process.env.NODE_ENV === 'test'
  
  // Get test environment variables, prioritizing test defaults for test mode
  const testWebhookUrl = isTestMode 
    ? (process.env.VITE_N8N_WEBHOOK_URL || 'https://test-n8n.example.com/webhook/test')
    : (process.env.VITE_N8N_WEBHOOK_URL || loadEnv(mode, process.cwd(), '').VITE_N8N_WEBHOOK_URL || 'https://test-n8n.example.com/webhook/test')
  
  const testAuthToken = isTestMode
    ? (process.env.VITE_N8N_AUTH_TOKEN || 'test-auth-token')
    : (process.env.VITE_N8N_AUTH_TOKEN || loadEnv(mode, process.cwd(), '').VITE_N8N_AUTH_TOKEN || 'test-auth-token')
  
  const testEmailJsKey = process.env.VITE_EMAILJS_PUBLIC_KEY || 'test-public-key'
  const testEmailJsService = process.env.VITE_EMAILJS_SERVICE_ID || 'test-service-id'
  const testEmailJsTemplate = process.env.VITE_EMAILJS_TEMPLATE_ID || 'test-template-id'

  return {
    define: {
      'import.meta.env.VITE_N8N_WEBHOOK_URL': JSON.stringify(testWebhookUrl),
      'import.meta.env.VITE_N8N_AUTH_TOKEN': JSON.stringify(testAuthToken),
      'import.meta.env.VITE_EMAILJS_PUBLIC_KEY': JSON.stringify(testEmailJsKey),
      'import.meta.env.VITE_EMAILJS_SERVICE_ID': JSON.stringify(testEmailJsService),
      'import.meta.env.VITE_EMAILJS_TEMPLATE_ID': JSON.stringify(testEmailJsTemplate),
      'import.meta.env.DEV': 'true',
      'import.meta.env.PROD': 'false',
      'import.meta.env.MODE': JSON.stringify('test')
    },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    exclude: ['node_modules', 'dist', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        '**/main.tsx',
        '**/App.tsx',
        '**/vite-env.d.ts',
      ],
      thresholds: {
        statements: 30,
        branches: 30,
        functions: 30,
        lines: 30,
      },
    },
  },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  }
})
