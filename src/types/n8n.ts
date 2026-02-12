/**
 * TypeScript types for n8n webhook integration
 */

/**
 * Contact form data structure sent to n8n webhook
 */
export interface ContactFormData {
  /** Full name of the contact */
  name: string
  /** Email address (validated format) */
  email: string
  /** Phone number in E.164 format (optional) */
  phone?: string
  /** Company name (optional) */
  companyName?: string
  /** Unique company identifier (e.g., VAT number, tax ID, company registration number) (optional) */
  companyIdentifier?: string
  /** Subject/topic of the message (required) */
  subject: string
  /** Message content */
  message: string
  /** ISO 8601 timestamp when the form was submitted (auto-generated) */
  timestamp?: string
  /** Recipient email for n8n workflow to send notifications (e.g. joaomaia@jmsit.cloud) */
  recipientEmail?: string
}

/**
 * Response structure from n8n webhook
 * Note: n8n webhooks typically return the data that was received,
 * but the exact structure may vary based on workflow configuration
 */
export interface N8nWebhookResponse {
  /** Success indicator */
  success?: boolean
  /** Response data from n8n workflow */
  data?: unknown
  /** Error message if any */
  error?: string
  /** Execution ID or reference */
  executionId?: string
}

/**
 * Authentication method for n8n webhook
 */
export type N8nAuthMethod = 'bearer' | 'header' | 'custom'

/**
 * Configuration options for N8nClient
 */
export interface N8nClientConfig {
  /** Webhook URL endpoint */
  webhookUrl: string
  /** Authentication token */
  authToken?: string
  /** 
   * Authentication method:
   * - 'bearer': Uses Authorization: Bearer <token> (n8n Bearer Auth)
   * - 'header': Uses custom header name with token value (n8n Header Auth)
   * - 'custom': Uses custom headers from headers option (n8n Custom Auth)
   * Default: 'header'
   */
  authMethod?: N8nAuthMethod
  /** 
   * Custom header name for authentication token (only used when authMethod is 'header')
   * Default: 'Authorization'
   * Common n8n header names: 'X-API-Key', 'X-Auth-Token', 'Authorization'
   */
  authHeaderName?: string
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number
  /** 
   * Optional custom headers (used when authMethod is 'custom' or as additional headers)
   * For n8n Custom Auth, provide headers as JSON object
   */
  headers?: Record<string, string>
  /** Enable retry logic (default: false) */
  enableRetry?: boolean
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number
  /** Retry delay in milliseconds (default: 1000) */
  retryDelay?: number
}

/**
 * Error types for n8n client operations
 */
export class N8nClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly response?: unknown
  ) {
    super(message)
    this.name = 'N8nClientError'
  }
}

export class N8nNetworkError extends N8nClientError {
  public readonly originalError?: Error
  
  constructor(message: string, originalError?: Error) {
    super(message)
    this.name = 'N8nNetworkError'
    this.originalError = originalError
  }
}

export class N8nTimeoutError extends N8nClientError {
  constructor(message: string = 'Request timeout') {
    super(message)
    this.name = 'N8nTimeoutError'
  }
}

