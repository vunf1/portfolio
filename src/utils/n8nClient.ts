/**
 * n8n Webhook Client
 * 
 * A client class for sending data to n8n webhook endpoints.
 * Supports timeout, error handling, and optional retry logic.
 * 
 * @example
 * ```typescript
 * const client = new N8nClient({
 *   webhookUrl: 'https://n8n.jmsit.cloud/webhook-test/...'
 * })
 * 
 * const result = await client.sendToWebhook({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   message: 'Hello!'
 * })
 * ```
 */

import type {
  ContactFormData,
  N8nWebhookResponse,
  N8nClientConfig,
  N8nAuthMethod
} from '../types/n8n'
import {
  N8nClientError as N8nClientErrorClass,
  N8nNetworkError as N8nNetworkErrorClass,
  N8nTimeoutError as N8nTimeoutErrorClass
} from '../types/n8n'

/**
 * Default webhook URL from environment variable or fallback
 * Configure via VITE_N8N_WEBHOOK_URL environment variable
 */
const DEFAULT_WEBHOOK_URL =
  import.meta.env.VITE_N8N_WEBHOOK_URL ||
  'https://n8n.jmsit.cloud/webhook-test/a86fbdb6-e4e6-4972-a502-37af612d2f6a'

/**
 * Default authentication token from environment variable or fallback
 * Configure via VITE_N8N_AUTH_TOKEN environment variable
 */
const DEFAULT_AUTH_TOKEN =
  import.meta.env.VITE_N8N_AUTH_TOKEN ||
  import.meta.env.VITE_N8N_JWT_TOKEN ||
  'cd324c00a80c293b3993805f45f4c23281a06f23e4381dc2008eefa223e73e97'

/**
 * Default authentication method (n8n Header Auth)
 */
const DEFAULT_AUTH_METHOD = 'header' as const

/**
 * Default authentication header name (for Header Auth method)
 */
const DEFAULT_AUTH_HEADER_NAME = 'X-API-Key'

/**
 * Default configuration values
 */
const DEFAULT_TIMEOUT = 10000 // 10 seconds
const DEFAULT_MAX_RETRIES = 3
const DEFAULT_RETRY_DELAY = 1000 // 1 second

/**
 * Client for communicating with n8n webhook endpoints
 */
export class N8nClient {
  private readonly webhookUrl: string
  private readonly timeout: number
  private readonly headers: Record<string, string>
  private readonly enableRetry: boolean
  private readonly maxRetries: number
  private readonly retryDelay: number

  /**
   * Creates a new N8nClient instance
   * @param config - Client configuration
   */
  constructor(config?: Partial<N8nClientConfig>) {
    // Validate webhook URL first
    // If webhookUrl is explicitly provided (even if empty), use it; otherwise use default
    const webhookUrl = config?.webhookUrl !== undefined 
      ? config.webhookUrl 
      : DEFAULT_WEBHOOK_URL
    
    if (!webhookUrl || webhookUrl.trim() === '') {
      throw new N8nClientErrorClass('Webhook URL is required')
    }
    
    this.webhookUrl = webhookUrl
    this.timeout = config?.timeout || DEFAULT_TIMEOUT
    
    // Get authentication configuration
    const authMethod = config?.authMethod || DEFAULT_AUTH_METHOD
    const authToken = config?.authToken || DEFAULT_AUTH_TOKEN
    const authHeaderName = config?.authHeaderName || DEFAULT_AUTH_HEADER_NAME
    
    // Build headers based on authentication method (n8n compatible)
    this.headers = {
      'Content-Type': 'application/json',
      ...this.buildAuthHeaders(authMethod, authToken, authHeaderName, config?.headers)
    }
    
    this.enableRetry = config?.enableRetry ?? false
    this.maxRetries = config?.maxRetries || DEFAULT_MAX_RETRIES
    this.retryDelay = config?.retryDelay || DEFAULT_RETRY_DELAY
  }

  /**
   * Builds authentication headers based on n8n authentication method
   * 
   * n8n supports three authentication methods:
   * 1. Bearer Auth: Authorization: Bearer <token>
   * 2. Header Auth: Custom header name with token value
   * 3. Custom Auth: Multiple custom headers defined in JSON
   * 
   * @param authMethod - Authentication method to use
   * @param authToken - Authentication token (if applicable)
   * @param authHeaderName - Custom header name (for Header Auth)
   * @param customHeaders - Custom headers (for Custom Auth)
   * @returns Headers object with authentication
   */
  private buildAuthHeaders(
    authMethod: N8nAuthMethod,
    authToken?: string,
    authHeaderName?: string,
    customHeaders?: Record<string, string>
  ): Record<string, string> {
    const authHeaders: Record<string, string> = {}

    switch (authMethod) {
      case 'bearer':
        // n8n Bearer Auth: Authorization: Bearer <token>
        if (authToken) {
          authHeaders['Authorization'] = `Bearer ${authToken}`
        }
        break

      case 'header':
        // n8n Header Auth: Custom header name with token value
        if (authToken && authHeaderName) {
          authHeaders[authHeaderName] = authToken
        }
        break

      case 'custom':
        // n8n Custom Auth: Multiple custom headers
        if (customHeaders) {
          Object.assign(authHeaders, customHeaders)
        }
        break
    }

    return authHeaders
  }

  /**
   * Sends data to the n8n webhook endpoint
   * @param payload - Data to send to the webhook
   * @returns Promise resolving to the webhook response
   * @throws {N8nClientError} If the request fails
   */
  async sendToWebhook(payload: ContactFormData): Promise<N8nWebhookResponse> {
    // Add timestamp if not provided
    const dataWithTimestamp: ContactFormData = {
      ...payload,
      timestamp: payload.timestamp || new Date().toISOString()
    }

    if (this.enableRetry) {
      return this.sendWithRetry(dataWithTimestamp)
    }

    return this.sendRequest(dataWithTimestamp)
  }

  /**
   * Sends a request with retry logic
   * @param payload - Data to send
   * @param attempt - Current attempt number
   * @returns Promise resolving to the webhook response
   */
  private async sendWithRetry(
    payload: ContactFormData,
    attempt: number = 1
  ): Promise<N8nWebhookResponse> {
    try {
      return await this.sendRequest(payload)
    } catch (error) {
      // Don't retry on client errors (4xx) or if max retries reached
      if (
        error instanceof N8nClientErrorClass &&
        (error.statusCode !== undefined && error.statusCode < 500) ||
        attempt >= this.maxRetries
      ) {
        throw error
      }

      // Wait before retrying with exponential backoff
      const delay = this.retryDelay * Math.pow(2, attempt - 1)
      await this.sleep(delay)

      return this.sendWithRetry(payload, attempt + 1)
    }
  }

  /**
   * Sends a single HTTP request to the webhook
   * @param payload - Data to send
   * @returns Promise resolving to the webhook response
   * @throws {N8nClientError} If the request fails
   */
  private async sendRequest(payload: ContactFormData): Promise<N8nWebhookResponse> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorMessage = `HTTP error: ${response.status} ${response.statusText}`
        let errorData: unknown

        try {
          errorData = await response.json()
          if (typeof errorData === 'object' && errorData !== null) {
            const errorObj = errorData as { message?: string; error?: string }
            errorMessage = errorObj.message || errorObj.error || errorMessage
          }
        } catch {
          // If response is not JSON, use status text
          try {
            const text = await response.text()
            if (text) {
              errorMessage = text
            }
          } catch {
            // Ignore text parsing errors
          }
        }

        throw new N8nClientErrorClass(
          errorMessage,
          response.status,
          errorData
        )
      }

      // n8n webhooks typically return the received data or workflow execution result
      let responseData: N8nWebhookResponse
      try {
        const json = await response.json()
        responseData = {
          success: true,
          data: json,
          executionId: typeof json === 'object' && json !== null && 'executionId' in json
            ? String(json.executionId)
            : undefined
        }
      } catch {
        // If response is not JSON, treat as success with raw response
        const text = await response.text()
        responseData = {
          success: true,
          data: text || undefined
        }
      }

      return responseData
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof N8nClientErrorClass) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('aborted')) {
          throw new N8nTimeoutErrorClass(
            `Request timeout after ${this.timeout}ms`
          )
        }

        if (error.message.includes('fetch') || error.message.includes('network')) {
          throw new N8nNetworkErrorClass(
            `Network error: ${error.message}`,
            error
          )
        }
      }

      throw new N8nNetworkErrorClass(
        `Failed to send request: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Sleep utility for retry delays
   * @param ms - Milliseconds to sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Gets the configured webhook URL
   * @returns The webhook URL
   */
  getWebhookUrl(): string {
    return this.webhookUrl
  }
}

