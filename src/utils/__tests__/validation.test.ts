import { describe, it, expect } from 'vitest'
import { validateEmail, validatePhone, validateName } from '../validation'

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('test+tag@example.org')).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test.example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('validates correct E.164 phone numbers', () => {
      expect(validatePhone('+1234567890')).toBe(true)
      expect(validatePhone('+351912345678')).toBe(true)
      expect(validatePhone('+44123456789')).toBe(true)
    })

    it('rejects invalid phone numbers', () => {
      expect(validatePhone('1234567890')).toBe(false) // Missing +
      expect(validatePhone('+0123456789')).toBe(false) // Starts with 0
      expect(validatePhone('+123')).toBe(false) // Too short
      expect(validatePhone('+123456789012345678')).toBe(false) // Too long
      expect(validatePhone('')).toBe(false)
    })
  })

  describe('validateName', () => {
    it('validates correct names', () => {
      expect(validateName('João Maia')).toBe(true)
      expect(validateName('John Doe')).toBe(true)
      expect(validateName('Mary Jane Smith')).toBe(true)
      expect(validateName('A')).toBe(false) // Too short
    })

    it('rejects invalid names', () => {
      expect(validateName('')).toBe(false)
      expect(validateName('123')).toBe(false) // Contains numbers
      expect(validateName('John@Doe')).toBe(false) // Contains special characters
      expect(validateName('   ')).toBe(false) // Only spaces
    })

    it('handles whitespace correctly', () => {
      expect(validateName('  João Maia  ')).toBe(true) // Trims whitespace
      expect(validateName('  A  ')).toBe(false) // Too short after trim
    })
  })
})
