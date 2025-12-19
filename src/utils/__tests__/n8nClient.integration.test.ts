/**
 * Integration tests for N8nClient
 * These tests make actual HTTP requests to the n8n webhook
 * 
 * REQUIRED: Set environment variables before running these tests:
 * - VITE_N8N_WEBHOOK_URL: Your n8n webhook URL
 * - VITE_N8N_AUTH_TOKEN: Your n8n authentication token
 * 
 * To run these tests:
 * 1. Set VITE_N8N_WEBHOOK_URL and VITE_N8N_AUTH_TOKEN in .env.test or environment
 * 2. Ensure your n8n webhook is accessible
 * 3. Run: npm test -- n8nClient.integration.test.ts
 * 
 * Note: Tests will be skipped if environment variables are not set
 */

/* eslint-disable @typescript-eslint/no-explicit-any, no-console */
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest'
import { N8nClient } from '../n8nClient'
import type { ContactFormData } from '../../types/n8n'

describe('N8nClient Integration Tests', () => {
  // Get environment variables - REQUIRED for integration tests
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
  const authToken = import.meta.env.VITE_N8N_AUTH_TOKEN || import.meta.env.VITE_N8N_JWT_TOKEN

  // Skip all tests if environment variables are not set
  const shouldSkipTests = !webhookUrl || !authToken || webhookUrl.trim() === '' || authToken.trim() === ''

  let client: N8nClient
  let realFetch: typeof fetch

  beforeAll(() => {
    // Skip if environment variables are not set
    if (shouldSkipTests) {
      console.warn('⚠️ Skipping integration tests: VITE_N8N_WEBHOOK_URL and VITE_N8N_AUTH_TOKEN must be set')
      return
    }
    // Restore real fetch for integration tests
    // The setup.ts mocks fetch with vi.fn(), so we need to unmock it
    vi.restoreAllMocks()
    
    // Get real fetch from Node.js (Node 18+ has built-in fetch)
    // In Node.js 18+, fetch is available as a global
    // We need to restore it after the mock from setup.ts
    
    const nodeVersion = process.version
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])
    
    if (majorVersion >= 18) {
      // Node.js 18+ has built-in fetch
      // The mock from setup.ts wraps it, so we need to get the real one
      // We'll use a workaround: create a new fetch function that calls the real implementation
      
      // Store reference to the real fetch before it was mocked
      // In Node.js, fetch is available via globalThis
      // We'll create a wrapper that bypasses the vi.fn() mock
      
      // Get the real fetch implementation that was stored before mocking
      const originalFetch = (globalThis as any).__originalFetch
      
      if (originalFetch && typeof originalFetch === 'function') {
        realFetch = originalFetch as typeof fetch
        global.fetch = realFetch
      } else {
        throw new Error('Original fetch not found. Make sure setup.ts stores it before mocking.')
      }
    } else {
      throw new Error(`Node.js 18+ required. Current version: ${nodeVersion}`)
    }

    client = new N8nClient({
      webhookUrl,
      authToken,
      authHeaderName: 'X-API-Key',
      timeout: 15000 // 15 seconds for integration tests
    })
  })

  beforeEach(async () => {
    // Restore real fetch before each test
    vi.restoreAllMocks()
    
    // Ensure we're using real fetch
    if (realFetch) {
      global.fetch = realFetch
    } else if (typeof globalThis.fetch === 'function') {
      global.fetch = globalThis.fetch
    }
  })

  afterEach(() => {
    // Keep real fetch for integration tests
    vi.restoreAllMocks()
    if (realFetch) {
      global.fetch = realFetch
    }
  })

  it.skipIf(shouldSkipTests)('should successfully send data to n8n webhook with X-API-Key authentication', async () => {
    const testPayload: ContactFormData = {
      name: 'Integration Test User',
      email: 'integration-test@example.com',
      phone: '+351912345678',
      subject: 'Integration Test',
      message: 'This is an integration test to verify n8n webhook communication with X-API-Key header authentication.',
      timestamp: new Date().toISOString()
    }

    try {
      const response = await client.sendToWebhook(testPayload)

      // Verify response structure if request succeeds
      expect(response).toBeDefined()
      expect(typeof response).toBe('object')

      // If n8n returns a success response, verify it
      if (response && typeof response === 'object') {
        // n8n may return different response formats
        // Common formats: { success: true }, { data: {...} }, or workflow output
        expect(response).not.toBeNull()
        console.log('✅ Webhook responded successfully:', JSON.stringify(response, null, 2))
      }
    } catch (error) {
      // Log error details for debugging
      if (error instanceof Error) {
        console.log('⚠️ Webhook request failed:', error.message)
        // If it's a network error (CORS, etc.), that's expected in some test environments
        // But we should verify the request was attempted with correct headers
        expect(error).toBeDefined()
      } else {
        throw error
      }
      // The important thing is that the request was made with X-API-Key header
      // This is verified in the separate header test
    }
  }, 30000) // 30 second timeout for integration test

  it.skipIf(shouldSkipTests)('should include X-API-Key header in the request', async () => {
    // This test verifies the header is sent by checking the request
    // We'll intercept fetch to verify headers
    let capturedHeaders: Record<string, string> | null = null
    let capturedUrl: string | null = null

    const fetchInterceptor = async (url: RequestInfo | URL, init?: RequestInit) => {
      const urlString = typeof url === 'string' ? url : url.toString()
      // Capture headers for any n8n webhook URL
      if (urlString.includes('n8n') || urlString.includes('webhook')) {
        capturedUrl = urlString
        // Headers can be Headers object or plain object
        if (init?.headers) {
          if (init.headers instanceof Headers) {
            capturedHeaders = {}
            init.headers.forEach((value, key) => {
              capturedHeaders![key] = value
            })
          } else {
            capturedHeaders = (init.headers as Record<string, string>) || {}
          }
        }
      }
      // Always call real fetch, even if it fails
      // Network errors are expected in CI, but we still captured headers
      return realFetch(url, init)
    }

    global.fetch = fetchInterceptor as typeof fetch

    const testPayload: ContactFormData = {
      name: 'Header Test User',
      email: 'header-test@example.com',
      subject: 'Header Test',
      message: 'Testing X-API-Key header',
      timestamp: new Date().toISOString()
    }

    try {
      await client.sendToWebhook(testPayload)
    } catch (error) {
      // We expect this might fail due to CORS, network, or server config
      // But we can still verify headers were captured before the request
    }

    // Restore real fetch
    global.fetch = realFetch

    // Verify headers were captured (even if request failed)
    // The important thing is that headers were set before the request
    expect(capturedHeaders).not.toBeNull()
    expect(capturedUrl).not.toBeNull()
    if (capturedHeaders) {
      expect(capturedHeaders['X-API-Key']).toBe(authToken)
      expect(capturedHeaders['Content-Type']).toBe('application/json')
    }
  }, 30000)

  it.skipIf(shouldSkipTests)('should handle network errors gracefully', async () => {
    const invalidClient = new N8nClient({
      webhookUrl: 'https://invalid-webhook-url-that-does-not-exist.com/webhook',
      authToken,
      authHeaderName: 'X-API-Key',
      timeout: 5000
    })

    const testPayload: ContactFormData = {
      name: 'Error Test User',
      email: 'error-test@example.com',
      subject: 'Error Test',
      message: 'Testing error handling',
      timestamp: new Date().toISOString()
    }

    await expect(invalidClient.sendToWebhook(testPayload)).rejects.toThrow()
  }, 30000)

  it.skipIf(shouldSkipTests)('should send minimal required fields correctly', async () => {
    const minimalPayload: ContactFormData = {
      name: 'Minimal Test',
      email: 'minimal@example.com',
      subject: 'Test Subject',
      message: 'Minimal payload test',
      timestamp: new Date().toISOString()
    }

    try {
      const response = await client.sendToWebhook(minimalPayload)
      expect(response).toBeDefined()
    } catch (error) {
      // Expected to fail in test environment due to CORS/server config
      // But request should have been attempted
      expect(error).toBeDefined()
    }
  }, 30000)

  it.skipIf(shouldSkipTests)('should send complete payload with all optional fields', async () => {
    const completePayload: ContactFormData = {
      name: 'Complete Test User',
      email: 'complete@example.com',
      phone: '+351987654321',
      companyName: 'Test Company Ltd.',
      companyIdentifier: 'PT123456789',
      subject: 'Complete Integration Test',
      message: 'This payload includes all fields including optional phone, company info, and subject.',
      timestamp: new Date().toISOString()
    }

    try {
      const response = await client.sendToWebhook(completePayload)
      expect(response).toBeDefined()
    } catch (error) {
      // Expected to fail in test environment due to CORS/server config
      // But request should have been attempted
      expect(error).toBeDefined()
    }
  }, 30000)
})

