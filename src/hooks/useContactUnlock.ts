import { useState, useEffect, useCallback } from 'preact/hooks'
import { isContactUnlocked, setContactUnlocked, clearContactUnlock, getUnlockExpiryInfo } from '../utils/unlockPersistence'

export interface ContactUnlockData {
  name: string
  email: string
}

export function useContactUnlock() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check unlock status on mount
  useEffect(() => {
    try {
      const unlocked = isContactUnlocked()
      setIsUnlocked(unlocked)
    } catch (error) {
      console.warn('Error checking unlock status:', error)
      setIsUnlocked(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Function to unlock contact information
  const unlockContact = useCallback((userData: ContactUnlockData) => {
    try {
      setContactUnlocked(userData)
      setIsUnlocked(true)
      return true
    } catch (error) {
      console.warn('Error unlocking contact:', error)
      return false
    }
  }, [])

  // Function to lock contact information (for logout or manual reset)
  const lockContact = useCallback(() => {
    try {
      clearContactUnlock()
      setIsUnlocked(false)
    } catch (error) {
      console.warn('Error locking contact:', error)
    }
  }, [])

  // Function to get unlock expiry information
  const getExpiryInfo = useCallback(() => {
    try {
      return getUnlockExpiryInfo()
    } catch (error) {
      console.warn('Error getting expiry info:', error)
      return null
    }
  }, [])

  return {
    isUnlocked,
    isLoading,
    unlockContact,
    lockContact,
    getExpiryInfo
  }
}
