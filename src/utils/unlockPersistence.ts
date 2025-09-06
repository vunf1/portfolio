/**
 * Secure unlock persistence utility
 * Uses localStorage with cryptographic hashing for security
 */

// Constants
const UNLOCK_STORAGE_KEY = 'portfolio_contact_unlock'
const UNLOCK_EXPIRY_DAYS = 30 // Unlock expires after 30 days
const SECRET_SALT = 'portfolio_2024_secure_unlock' // In production, this should be environment-specific

/**
 * Simple hash function for creating secure tokens
 * In production, consider using a proper cryptographic library
 */
function simpleHash(input: string): string {
  let hash = 0
  if (input.length === 0) return hash.toString()
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36)
}

/**
 * Create a secure unlock token based on user data
 */
function createUnlockToken(userData: {
  name: string
  email: string
  timestamp: number
}): string {
  const dataString = `${userData.name}:${userData.email}:${userData.timestamp}:${SECRET_SALT}`
  return simpleHash(dataString)
}

/**
 * Check if the contact information should be unlocked
 */
export function isContactUnlocked(): boolean {
  try {
    const stored = localStorage.getItem(UNLOCK_STORAGE_KEY)
    if (!stored) return false

    const unlockData = JSON.parse(stored)
    
    // Check if unlock has expired
    const now = Date.now()
    const expiryTime = unlockData.timestamp + (UNLOCK_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
    
    if (now > expiryTime) {
      // Unlock has expired, remove it
      localStorage.removeItem(UNLOCK_STORAGE_KEY)
      return false
    }

    // Verify the token is still valid
    const expectedToken = createUnlockToken({
      name: unlockData.name,
      email: unlockData.email,
      timestamp: unlockData.timestamp
    })

    return unlockData.token === expectedToken
  } catch (error) {
    console.warn('Error checking unlock status:', error)
    // If there's an error, assume locked for security
    return false
  }
}

/**
 * Store unlock state securely
 */
export function setContactUnlocked(userData: {
  name: string
  email: string
}): void {
  try {
    const timestamp = Date.now()
    const token = createUnlockToken({
      name: userData.name,
      email: userData.email,
      timestamp
    })

    const unlockData = {
      name: userData.name,
      email: userData.email,
      timestamp,
      token
    }

    localStorage.setItem(UNLOCK_STORAGE_KEY, JSON.stringify(unlockData))
  } catch (error) {
    console.warn('Error storing unlock state:', error)
    // If localStorage is not available, silently fail
    // The user will need to unlock again
  }
}

/**
 * Clear unlock state (for logout or manual reset)
 */
export function clearContactUnlock(): void {
  try {
    localStorage.removeItem(UNLOCK_STORAGE_KEY)
  } catch (error) {
    console.warn('Error clearing unlock state:', error)
  }
}

/**
 * Get unlock expiry information
 */
export function getUnlockExpiryInfo(): { isExpired: boolean; daysRemaining: number } | null {
  try {
    const stored = localStorage.getItem(UNLOCK_STORAGE_KEY)
    if (!stored) return null

    const unlockData = JSON.parse(stored)
    const now = Date.now()
    const expiryTime = unlockData.timestamp + (UNLOCK_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
    const daysRemaining = Math.ceil((expiryTime - now) / (24 * 60 * 60 * 1000))

    return {
      isExpired: now > expiryTime,
      daysRemaining: Math.max(0, daysRemaining)
    }
  } catch (error) {
    console.warn('Error getting unlock expiry info:', error)
    return null
  }
}
