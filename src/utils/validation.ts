/**
 * Validation utilities for form inputs
 */

/**
 * Validates an email address format
 * @param email - Email address to validate
 * @returns true if email format is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a phone number in E.164 format
 * E.164 format: +[country code][number] (7-15 digits after country code)
 * @param phone - Phone number to validate
 * @returns true if phone number format is valid
 */
export const validatePhone = (phone: string): boolean => {
  // E.164 format validation - must be 7-15 digits after country code
  const phoneRegex = /^\+[1-9]\d{6,14}$/
  return phoneRegex.test(phone)
}

/**
 * Validates a name (full name)
 * @param name - Name to validate
 * @returns true if name is valid (at least 2 characters, letters and spaces only)
 */
export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim())
}

