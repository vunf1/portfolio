/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { N8nClient } from '../n8nClient'
import { N8nClientError, N8nNetworkError, N8nTimeoutError, type ContactFormData } from '../../types/n8n'

// Mock fetch globally
global.fetch = vi.fn()

describe('N8nClient', () => {
  const mockWebhookUrl = 'https://n8n.jmsit.cloud/webhook-test/test-id'
  const mockPayload: ContactFormData = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Subject',
    message: 'Hello, this is a test message'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset AbortController for each test
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Constructor', () => {
    it('should create client with provided webhook URL', () => {
      const client = new N8nClient({ webhookUrl: mockWebhookUrl })
      expect(client.getWebhookUrl()).toBe(mockWebhookUrl)
    })

    it('should use default webhook URL from environment variable', () => {
      // Note: We can't easily mock import.meta.env in Vitest, so we test the fallback
      const client = new N8nClient()
      expect(client.getWebhookUrl()).toBeTruthy()
    })

    it('should throw error if webhook URL is empty', () => {
      expect(() => {
        new N8nClient({ webhookUrl: '' })
      }).toThrow('Webhook URL is required')
    })

    it('should accept custom timeout', () => {
      const client = new N8nClient({
        webhookUrl: mockWebhookUrl,
        timeout: 5000
      })
      expect(client).toBeInstanceOf(N8nClient)
    })

    it('should accept custom headers', () => {
      const client = new N8nClient({
        webhookUrl: mockWebhookUrl,
        headers: {
          'Authorization': 'Bearer token123'
        }
      })
      expect(client).toBeInstanceOf(N8nClient)
    })
  })

  describe('sendToWebhook', () => {
    it('should successfully send data to webhook', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true, data: mockPayload })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const client = new N8nClient({ webhookUrl: mockWebhookUrl })
      const result = await client.sendToWebhook(mockPayload)

      expect(global.fetch).toHaveBeenCalledWith(
        mockWebhookUrl,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: expect.stringContaining('"name":"John Doe"')
        })
      )

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('should add timestamp to payload if not provided', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const client = new N8nClient({ webhookUrl: mockWebhookUrl })
      await client.sendToWebhook(mockPayload)

      const callArgs = (global.fetch as any).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      
      expect(body.timestamp).toBeDefined()
      expect(typeof body.timestamp).toBe('string')
      expect(new Date(body.timestamp).getTime()).not.toBeNaN()
    })

    it('should preserve timestamp if provided', async () => {
      const customTimestamp = '2024-01-01T00:00:00.000Z'
      const payloadWithTimestamp = {
        ...mockPayload,
        timestamp: customTimestamp
      }

      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const client = new N8nClient({ webhookUrl: mockWebhookUrl })
      await client.sendToWebhook(payloadWithTimestamp)

      const callArgs = (global.fetch as any).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      
      expect(body.timestamp).toBe(customTimestamp)
    })

    it('should handle non-JSON response', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockRejectedValue(new Error('Not JSON')),
        text: vi.fn().mockResolvedValue('OK')
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const client = new N8nClient({ webhookUrl: mockWebhookUrl })
      const result = await client.sendToWebhook(mockPayload)

      expect(result.success).toBe(true)
      expect(result.data).toBe('OK')
    })
  })

  describe('Error Handling', () => {
    it('should throw N8nClientError for HTTP 400 error', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: vi.fn().mockResolvedValue({ error: 'Invalid payload' })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const client = new N8nClient({ webhookUrl: mockWebhookUrl })

      await expect(client.sendToWebhook(mockPayload)).rejects.toThrow(N8nClientError)
      await expect(client.sendToWebhook(mockPayload)).rejects.toThrow('Invalid payload')
    })

    it('should throw N8nClientError for HTTP 500 error', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockResolvedValue({ error: 'Server error' })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const client = new N8nClient({ webhookUrl: mockWebhookUrl })

      await expect(client.sendToWebhook(mockPayload)).rejects.toThrow(N8nClientError)
    })

    it('should throw N8nTimeoutError on timeout', async () => {
      const client = new N8nClient({
        webhookUrl: mockWebhookUrl,
        timeout: 100
      })

      // Mock fetch to reject with AbortError (simulating timeout abort)
      ;(global.fetch as any).mockImplementation(() => {
        const error = new Error('The operation was aborted')
        error.name = 'AbortError'
        return Promise.reject(error)
      })

      await expect(client.sendToWebhook(mockPayload)).rejects.toThrow(N8nTimeoutError)
    })

    it('should throw N8nNetworkError on network failure', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'))

      const client = new N8nClient({ webhookUrl: mockWebhookUrl })

      await expect(client.sendToWebhook(mockPayload)).rejects.toThrow(N8nNetworkError)
      await expect(client.sendToWebhook(mockPayload)).rejects.toThrow('Network error')
    })

    it('should handle fetch errors with abort signal', async () => {
      const client = new N8nClient({
        webhookUrl: mockWebhookUrl,
        timeout: 100
      })

      ;(global.fetch as any).mockImplementation(() => {
        const error = new Error('aborted')
        error.name = 'AbortError'
        return Promise.reject(error)
      })

      await expect(client.sendToWebhook(mockPayload)).rejects.toThrow(N8nTimeoutError)
    })

    it('should handle error response without JSON', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockRejectedValue(new Error('Not JSON')),
        text: vi.fn().mockResolvedValue('Server error message')
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const client = new N8nClient({ webhookUrl: mockWebhookUrl })

      await expect(client.sendToWebhook(mockPayload)).rejects.toThrow(N8nClientError)
      await expect(client.sendToWebhook(mockPayload)).rejects.toThrow('Server error message')
    })
  })

  describe('Retry Logic', () => {
    it('should retry on failure when enabled', async () => {
      const client = new N8nClient({
        webhookUrl: mockWebhookUrl,
        enableRetry: true,
        maxRetries: 2,
        retryDelay: 10
      })

      // First call fails, second succeeds
      const mockErrorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockResolvedValue({ error: 'Server error' })
      }

      const mockSuccessResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      vi.useRealTimers()
      ;(global.fetch as any)
        .mockResolvedValueOnce(mockErrorResponse)
        .mockResolvedValueOnce(mockSuccessResponse)

      const result = await client.sendToWebhook(mockPayload)

      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(result.success).toBe(true)
    })

    it('should not retry on 4xx errors', async () => {
      const client = new N8nClient({
        webhookUrl: mockWebhookUrl,
        enableRetry: true,
        maxRetries: 3
      })

      const mockErrorResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: vi.fn().mockResolvedValue({ error: 'Bad request' })
      }

      ;(global.fetch as any).mockResolvedValue(mockErrorResponse)

      await expect(client.sendToWebhook(mockPayload)).rejects.toThrow(N8nClientError)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should stop retrying after max retries', async () => {
      const client = new N8nClient({
        webhookUrl: mockWebhookUrl,
        enableRetry: true,
        maxRetries: 2,
        retryDelay: 10
      })

      const mockErrorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockResolvedValue({ error: 'Server error' })
      }

      vi.useRealTimers()
      ;(global.fetch as any).mockResolvedValue(mockErrorResponse)

      await expect(client.sendToWebhook(mockPayload)).rejects.toThrow(N8nClientError)
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('Request Configuration', () => {
    it('should send correct headers with custom auth method', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const client = new N8nClient({
        webhookUrl: mockWebhookUrl,
        authMethod: 'custom',
        headers: {
          'Authorization': 'Bearer token123',
          'X-Custom-Header': 'custom-value'
        }
      })

      await client.sendToWebhook(mockPayload)

      const callArgs = (global.fetch as any).mock.calls[0]
      expect(callArgs[1].headers).toMatchObject({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123',
        'X-Custom-Header': 'custom-value'
      })
    })

    it('should include auth token in custom header when provided', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const authToken = 'test-auth-token-123'
      const client = new N8nClient({
        webhookUrl: mockWebhookUrl,
        authToken
      })

      await client.sendToWebhook(mockPayload)

      const callArgs = (global.fetch as any).mock.calls[0]
      expect(callArgs[1].headers).toMatchObject({
        'Content-Type': 'application/json',
        'X-API-Key': authToken
      })
    })

    it('should use custom header name when provided', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const authToken = 'test-token-123'
      const client = new N8nClient({
        webhookUrl: mockWebhookUrl,
        authToken,
        authHeaderName: 'X-API-Key'
      })

      await client.sendToWebhook(mockPayload)

      const callArgs = (global.fetch as any).mock.calls[0]
      expect(callArgs[1].headers).toMatchObject({
        'Content-Type': 'application/json',
        'X-API-Key': authToken
      })
      expect(callArgs[1].headers).not.toHaveProperty('Authorization')
    })

    it('should use default auth token when not provided', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const client = new N8nClient({
        webhookUrl: mockWebhookUrl
      })

      await client.sendToWebhook(mockPayload)

      const callArgs = (global.fetch as any).mock.calls[0]
      expect(callArgs[1].headers).toHaveProperty('X-API-Key')
      expect(callArgs[1].headers['X-API-Key']).toBeTruthy()
    })

    it('should use Bearer auth method when specified (n8n Bearer Auth)', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const authToken = 'test-bearer-token-123'
      const client = new N8nClient({
        webhookUrl: mockWebhookUrl,
        authToken,
        authMethod: 'bearer'
      })

      await client.sendToWebhook(mockPayload)

      const callArgs = (global.fetch as any).mock.calls[0]
      expect(callArgs[1].headers).toMatchObject({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      })
    })

    it('should use Header auth method when specified (n8n Header Auth)', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const authToken = 'test-header-token-123'
      const client = new N8nClient({
        webhookUrl: mockWebhookUrl,
        authToken,
        authMethod: 'header',
        authHeaderName: 'X-API-Key'
      })

      await client.sendToWebhook(mockPayload)

      const callArgs = (global.fetch as any).mock.calls[0]
      expect(callArgs[1].headers).toMatchObject({
        'Content-Type': 'application/json',
        'X-API-Key': authToken
      })
      expect(callArgs[1].headers).not.toHaveProperty('Authorization')
    })

    it('should use Custom auth method when specified (n8n Custom Auth)', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const customHeaders = {
        'X-API-Key': 'custom-api-key',
        'X-Auth-Token': 'custom-auth-token',
        'X-Custom-Header': 'custom-value'
      }

      const client = new N8nClient({
        webhookUrl: mockWebhookUrl,
        authMethod: 'custom',
        headers: customHeaders
      })

      await client.sendToWebhook(mockPayload)

      const callArgs = (global.fetch as any).mock.calls[0]
      expect(callArgs[1].headers).toMatchObject({
        'Content-Type': 'application/json',
        ...customHeaders
      })
    })

    it('should send payload as JSON string', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ success: true })
      }

      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const client = new N8nClient({ webhookUrl: mockWebhookUrl })
      await client.sendToWebhook(mockPayload)

      const callArgs = (global.fetch as any).mock.calls[0]
      const body = JSON.parse(callArgs[1].body)
      
      expect(body.name).toBe(mockPayload.name)
      expect(body.email).toBe(mockPayload.email)
      expect(body.message).toBe(mockPayload.message)
    })
  })
})

