import { useState, useEffect, useCallback } from 'preact/hooks'

export interface ContactUnlockForm {
  fullName: string
  email: string
  phone: string
  company?: string
  reason: string
}

export interface ContactPrivacyGateState {
  isUnlocked: boolean
  isLoading: boolean
  error: string | null
  unlockContact: (formData: ContactUnlockForm) => Promise<boolean>
  lockContact: () => void
  deleteUnlockData: () => void
}

const CONTACT_UNLOCK_KEY = 'contact_unlocked'
const CONTACT_UNLOCK_TIMESTAMP_KEY = 'contact_unlock_timestamp'
const CONTACT_USER_DATA_KEY = 'contact_user_data'
const UNLOCK_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

// Validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePhone(phone: string): boolean {
  // E.164 format validation (e.g., +351 934 330 807)
  const phoneRegex = /^\+[1-9]\d{1,14}$/
  const cleanPhone = phone.replace(/\s/g, '')
  return phoneRegex.test(cleanPhone)
}

function validateFullName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().split(' ').length >= 2
}

export function useContactPrivacyGate(): ContactPrivacyGateState {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if contact is unlocked on mount
  useEffect(() => {
    try {
      const unlocked = localStorage.getItem(CONTACT_UNLOCK_KEY)
      const timestamp = localStorage.getItem(CONTACT_UNLOCK_TIMESTAMP_KEY)
      
      if (unlocked === 'true' && timestamp) {
        const unlockTime = parseInt(timestamp, 10)
        const now = Date.now()
        
        // Check if unlock is still valid (within 30 days)
        if (now - unlockTime < UNLOCK_DURATION) {
          setIsUnlocked(true)
        } else {
          // Unlock expired, remove from storage
          localStorage.removeItem(CONTACT_UNLOCK_KEY)
          localStorage.removeItem(CONTACT_UNLOCK_TIMESTAMP_KEY)
          localStorage.removeItem(CONTACT_USER_DATA_KEY)
        }
      }
    } catch (err) {
      console.warn('Failed to check contact unlock status:', err)
    }
  }, [])

  const unlockContact = useCallback(async (formData: ContactUnlockForm): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate form data
      if (!validateFullName(formData.fullName)) {
        throw new Error('Please provide your full name (first and last name)')
      }

      if (!validateEmail(formData.email)) {
        throw new Error('Please provide a valid email address')
      }

      if (!validatePhone(formData.phone)) {
        throw new Error('Please provide a valid phone number in E.164 format (e.g., +351 934 330 807)')
      }

      if (!formData.reason.trim()) {
        throw new Error('Please specify your reason for contact')
      }

      // Simulate API call with rate limiting and honeypot check
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Store unlock state and user data in localStorage
      localStorage.setItem(CONTACT_UNLOCK_KEY, 'true')
      localStorage.setItem(CONTACT_UNLOCK_TIMESTAMP_KEY, Date.now().toString())
      localStorage.setItem(CONTACT_USER_DATA_KEY, JSON.stringify(formData))

      setIsUnlocked(true)
      setIsLoading(false)
      
      console.log('✅ Contact information unlocked successfully')
      return true

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unlock contact information'
      setError(errorMessage)
      setIsLoading(false)
      console.error('❌ Failed to unlock contact:', errorMessage)
      return false
    }
  }, [])

  const lockContact = useCallback(() => {
    try {
      localStorage.removeItem(CONTACT_UNLOCK_KEY)
      localStorage.removeItem(CONTACT_UNLOCK_TIMESTAMP_KEY)
      localStorage.removeItem(CONTACT_USER_DATA_KEY)
      setIsUnlocked(false)
      setError(null)
      console.log('🔒 Contact information locked')
    } catch (err) {
      console.warn('Failed to lock contact:', err)
    }
  }, [])

  const deleteUnlockData = useCallback(() => {
    try {
      localStorage.removeItem(CONTACT_UNLOCK_KEY)
      localStorage.removeItem(CONTACT_UNLOCK_TIMESTAMP_KEY)
      localStorage.removeItem(CONTACT_USER_DATA_KEY)
      setIsUnlocked(false)
      setError(null)
      console.log('🗑️ Contact unlock data deleted')
    } catch (err) {
      console.warn('Failed to delete unlock data:', err)
    }
  }, [])

  return {
    isUnlocked,
    isLoading,
    error,
    unlockContact,
    lockContact,
    deleteUnlockData
  }
}
