/**
 * Validates .env.example contains required EmailJS configuration keys.
 * Does NOT validate or expose actual credential values.
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

const REQUIRED_EMAILJS_KEYS = [
  'VITE_EMAILJS_PUBLIC_KEY',
  'VITE_EMAILJS_SERVICE_ID',
  'VITE_EMAILJS_TEMPLATE_ID'
] as const

function parseEnvExample(content: string): Map<string, string> {
  const map = new Map<string, string>()
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('#') || !trimmed) {continue}
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) {continue}
    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1).trim()
    if (key) {map.set(key, value)}
  }
  return map
}

describe('env validation', () => {
  const envExamplePath = resolve(process.cwd(), '.env.example')

  it('.env.example file exists', () => {
    expect(existsSync(envExamplePath)).toBe(true)
  })

  describe('EmailJS required keys', () => {
    let envVars: Map<string, string>

    it('reads .env.example without error', () => {
      const content = readFileSync(envExamplePath, 'utf-8')
      envVars = parseEnvExample(content)
      expect(envVars.size).toBeGreaterThan(0)
    })

    it('contains all required EmailJS keys', () => {
      const content = readFileSync(envExamplePath, 'utf-8')
      envVars = parseEnvExample(content)
      for (const key of REQUIRED_EMAILJS_KEYS) {
        expect(envVars.has(key), `Missing required key: ${key}`).toBe(true)
      }
    })

    it('EmailJS keys have non-empty values (placeholders or real)', () => {
      const content = readFileSync(envExamplePath, 'utf-8')
      envVars = parseEnvExample(content)
      for (const key of REQUIRED_EMAILJS_KEYS) {
        const value = envVars.get(key) ?? ''
        expect(value.length, `${key} should not be empty`).toBeGreaterThan(0)
      }
    })

    it('VITE_EMAILJS_PUBLIC_KEY has valid format (alphanumeric, 8+ chars)', () => {
      const content = readFileSync(envExamplePath, 'utf-8')
      envVars = parseEnvExample(content)
      const value = envVars.get('VITE_EMAILJS_PUBLIC_KEY') ?? ''
      expect(value.length).toBeGreaterThanOrEqual(8)
      expect(/^[a-zA-Z0-9_-]+$/.test(value), 'Public key should be alphanumeric').toBe(true)
    })

    it('VITE_EMAILJS_SERVICE_ID has valid format (alphanumeric + underscore)', () => {
      const content = readFileSync(envExamplePath, 'utf-8')
      envVars = parseEnvExample(content)
      const value = envVars.get('VITE_EMAILJS_SERVICE_ID') ?? ''
      expect(value.length).toBeGreaterThanOrEqual(3)
      expect(/^[a-zA-Z0-9_]+$/.test(value), 'Service ID should be alphanumeric with optional underscores').toBe(true)
    })

    it('VITE_EMAILJS_TEMPLATE_ID has valid format (alphanumeric + underscore)', () => {
      const content = readFileSync(envExamplePath, 'utf-8')
      envVars = parseEnvExample(content)
      const value = envVars.get('VITE_EMAILJS_TEMPLATE_ID') ?? ''
      expect(value.length).toBeGreaterThanOrEqual(3)
      expect(/^[a-zA-Z0-9_]+$/.test(value), 'Template ID should be alphanumeric with optional underscores').toBe(true)
    })
  })
})
