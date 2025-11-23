#!/usr/bin/env node
/**
 * n8n Webhook Test Script
 * 
 * Sends authenticated requests to n8n webhook endpoints for testing.
 * Supports single or multiple requests with data from CLI args or JSON files.
 * 
 * Usage:
 *   npm run test:n8n -- --data '{"Name":"...","Email":"..."}'
 *   npm run test:n8n -- --file example-data.json
 *   npm run test:n8n -- --file example-data.json --multiple
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import type { ContactFormData } from '../../src/types/n8n'
// Note: N8nClient uses import.meta.env internally, but we pass webhookUrl and authToken
// directly in the config, so those functions are never called at runtime
import { N8nClient } from '../../src/utils/n8nClient'

// Load environment variables from .env files
config({ path: resolve(process.cwd(), '.env') })
config({ path: resolve(process.cwd(), '.env.local') })

/**
 * User input data format (before mapping to ContactFormData)
 */
interface UserInputData {
  Name?: string
  Email?: string
  Phone?: string
  CompanyName?: string
  CompanyID?: string
  Subject?: string
  Message?: string
  // Also support ContactFormData format directly
  name?: string
  email?: string
  phone?: string
  companyName?: string
  companyIdentifier?: string
  subject?: string
  message?: string
  timestamp?: string
}

/**
 * Maps user input data to ContactFormData format
 */
function mapToContactFormData(input: UserInputData): ContactFormData {
  const mapped: ContactFormData = {
    name: input.name || input.Name || '',
    email: input.email || input.Email || '',
    subject: input.subject || input.Subject || '',
    message: input.message || input.Message || '',
  }

  // Optional fields
  if (input.phone || input.Phone) {
    mapped.phone = input.phone || input.Phone
  }
  if (input.companyName || input.CompanyName) {
    mapped.companyName = input.companyName || input.CompanyName
  }
  if (input.companyIdentifier || input.CompanyID) {
    mapped.companyIdentifier = input.companyIdentifier || input.CompanyID
  }
  if (input.timestamp) {
    mapped.timestamp = input.timestamp
  } else {
    // Auto-generate timestamp if not provided
    mapped.timestamp = new Date().toISOString()
  }

  return mapped
}

/**
 * Validates ContactFormData has all required fields
 */
function validateContactFormData(data: ContactFormData): void {
  const errors: string[] = []

  if (!data.name || data.name.trim() === '') {
    errors.push('name is required')
  }
  if (!data.email || data.email.trim() === '') {
    errors.push('email is required')
  }
  if (!data.subject || data.subject.trim() === '') {
    errors.push('subject is required')
  }
  if (!data.message || data.message.trim() === '') {
    errors.push('message is required')
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`)
  }
}

/**
 * Gets webhook URL from environment variables
 */
function getWebhookUrl(): string {
  const url =
    process.env.VITE_N8N_WEBHOOK_URL ||
    process.env.N8N_WEBHOOK_URL ||
    ''

  if (!url || url.trim() === '') {
    throw new Error(
      'Webhook URL is required. Set VITE_N8N_WEBHOOK_URL or N8N_WEBHOOK_URL in .env file'
    )
  }

  return url
}

/**
 * Gets authentication token from environment variables
 */
function getAuthToken(): string {
  const token =
    process.env.VITE_N8N_AUTH_TOKEN ||
    process.env.VITE_N8N_JWT_TOKEN ||
    process.env.N8N_AUTH_TOKEN ||
    ''

  if (!token || token.trim() === '') {
    throw new Error(
      'Authentication token is required. Set VITE_N8N_AUTH_TOKEN or N8N_AUTH_TOKEN in .env file'
    )
  }

  return token
}

/**
 * Parses command line arguments
 */
function parseArgs(): {
  data?: string
  file?: string
  multiple: boolean
  webhookUrl?: string
  delay?: number
} {
  const args = process.argv.slice(2)
  const result: {
    data?: string
    file?: string
    multiple: boolean
    webhookUrl?: string
    delay?: number
  } = {
    multiple: false,
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const nextArg = args[i + 1]

    if (arg === '--data' && nextArg) {
      result.data = nextArg
      i++
    } else if (arg === '--file' && nextArg) {
      result.file = nextArg
      i++
    } else if (arg === '--multiple') {
      result.multiple = true
    } else if (arg === '--webhook-url' && nextArg) {
      result.webhookUrl = nextArg
      i++
    } else if (arg === '--delay' && nextArg) {
      result.delay = parseInt(nextArg, 10)
      i++
    }
  }

  return result
}

/**
 * Reads and parses JSON file
 */
function readJsonFile(filePath: string): unknown {
  try {
    const content = readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read JSON file ${filePath}: ${error.message}`)
    }
    throw new Error(`Failed to read JSON file ${filePath}`)
  }
}

/**
 * Converts input to array of ContactFormData
 */
function normalizeToContactFormDataArray(input: unknown): ContactFormData[] {
  if (Array.isArray(input)) {
    return input.map((item) => {
      const mapped = mapToContactFormData(item as UserInputData)
      validateContactFormData(mapped)
      return mapped
    })
  } else if (typeof input === 'object' && input !== null) {
    const mapped = mapToContactFormData(input as UserInputData)
    validateContactFormData(mapped)
    return [mapped]
  } else {
    throw new Error('Input must be an object or array of objects')
  }
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    const args = parseArgs()

    // Get webhook URL and auth token from environment (or CLI override)
    const webhookUrl = args.webhookUrl || getWebhookUrl()
    const authToken = getAuthToken()

    console.log('🚀 n8n Webhook Test Script\n')
    console.log(`📡 Webhook URL: ${webhookUrl}`)
    console.log(`🔑 Auth Token: ${authToken.substring(0, 8)}...\n`)

    // Parse input data
    let inputData: unknown

    if (args.data) {
      // Parse from CLI argument
      try {
        inputData = JSON.parse(args.data)
      } catch (error) {
        throw new Error(`Invalid JSON in --data argument: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    } else if (args.file) {
      // Read from file
      const filePath = resolve(process.cwd(), args.file)
      inputData = readJsonFile(filePath)
    } else {
      throw new Error('Either --data or --file argument is required')
    }

    // Normalize to ContactFormData array
    const contactDataArray = normalizeToContactFormDataArray(inputData)

    if (contactDataArray.length === 0) {
      throw new Error('No valid contact data found')
    }

    console.log(`📦 Found ${contactDataArray.length} request(s) to send\n`)

    // Create N8nClient
    const client = new N8nClient({
      webhookUrl,
      authToken,
    })

    // Send requests
    const delay = args.delay || 1000 // Default 1 second delay between requests

    for (let i = 0; i < contactDataArray.length; i++) {
      const data = contactDataArray[i]
      const requestNumber = i + 1
      const total = contactDataArray.length

      console.log(`📤 Sending request ${requestNumber}/${total}...`)
      console.log(`   Name: ${data.name}`)
      console.log(`   Email: ${data.email}`)
      console.log(`   Subject: ${data.subject}`)

      try {
        const response = await client.sendToWebhook(data)
        console.log(`   ✅ Success!`)
        if (response.executionId) {
          console.log(`   Execution ID: ${response.executionId}`)
        }
        if (response.data) {
          console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`)
        }
      } catch (error) {
        console.error(`   ❌ Failed!`)
        if (error instanceof Error) {
          console.error(`   Error: ${error.message}`)
          if ('statusCode' in error && error.statusCode) {
            console.error(`   Status Code: ${error.statusCode}`)
          }
        } else {
          console.error(`   Error: ${String(error)}`)
        }
      }

      // Add delay between requests (except for the last one)
      if (i < contactDataArray.length - 1) {
        console.log(`   ⏳ Waiting ${delay}ms before next request...\n`)
        await sleep(delay)
      }
    }

    console.log('\n✨ Done!')
  } catch (error) {
    console.error('\n❌ Error:')
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(String(error))
    }
    process.exit(1)
  }
}

// Run main function
main()

