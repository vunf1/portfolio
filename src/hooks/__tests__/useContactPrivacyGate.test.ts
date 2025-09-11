import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/preact'
import { useContactPrivacyGate, type ContactUnlockForm } from '../useContactPrivacyGate'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useContactPrivacyGate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with locked state', () => {
    const { result } = renderHook(() => useContactPrivacyGate())
    
    expect(result.current.isUnlocked).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('unlocks contact with valid form data', async () => {
    const { result } = renderHook(() => useContactPrivacyGate())
    
    const formData: ContactUnlockForm = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+351 934 330 807',
      company: 'Test Company',
      reason: 'jobOpportunity'
    }

    await act(async () => {
      const success = await result.current.unlockContact(formData)
      expect(success).toBe(true)
    })

    expect(result.current.isUnlocked).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('contact_unlocked', 'true')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('contact_unlock_timestamp', expect.any(String))
    expect(localStorageMock.setItem).toHaveBeenCalledWith('contact_user_data', JSON.stringify(formData))
  })

  it('validates full name', async () => {
    const { result } = renderHook(() => useContactPrivacyGate())
    
    const formData: ContactUnlockForm = {
      fullName: 'John', // Only first name
      email: 'john@example.com',
      phone: '+351 934 330 807',
      reason: 'jobOpportunity'
    }

    await act(async () => {
      const success = await result.current.unlockContact(formData)
      expect(success).toBe(false)
    })

    expect(result.current.isUnlocked).toBe(false)
    expect(result.current.error).toBe('Please provide your full name (first and last name)')
  })

  it('validates email format', async () => {
    const { result } = renderHook(() => useContactPrivacyGate())
    
    const formData: ContactUnlockForm = {
      fullName: 'John Doe',
      email: 'invalid-email',
      phone: '+351 934 330 807',
      reason: 'jobOpportunity'
    }

    await act(async () => {
      const success = await result.current.unlockContact(formData)
      expect(success).toBe(false)
    })

    expect(result.current.isUnlocked).toBe(false)
    expect(result.current.error).toBe('Please provide a valid email address')
  })

  it('validates phone format', async () => {
    const { result } = renderHook(() => useContactPrivacyGate())
    
    const formData: ContactUnlockForm = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '123', // Invalid phone
      reason: 'jobOpportunity'
    }

    await act(async () => {
      const success = await result.current.unlockContact(formData)
      expect(success).toBe(false)
    })

    expect(result.current.isUnlocked).toBe(false)
    expect(result.current.error).toBe('Please provide a valid phone number in E.164 format (e.g., +351 934 330 807)')
  })

  it('validates reason is provided', async () => {
    const { result } = renderHook(() => useContactPrivacyGate())
    
    const formData: ContactUnlockForm = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+351 934 330 807',
      reason: '' // Empty reason
    }

    await act(async () => {
      const success = await result.current.unlockContact(formData)
      expect(success).toBe(false)
    })

    expect(result.current.isUnlocked).toBe(false)
    expect(result.current.error).toBe('Please specify your reason for contact')
  })

  it('locks contact and clears localStorage', () => {
    const { result } = renderHook(() => useContactPrivacyGate())
    
    act(() => {
      result.current.lockContact()
    })

    expect(result.current.isUnlocked).toBe(false)
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('contact_unlocked')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('contact_unlock_timestamp')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('contact_user_data')
  })

  it('deletes unlock data and clears localStorage', () => {
    const { result } = renderHook(() => useContactPrivacyGate())
    
    act(() => {
      result.current.deleteUnlockData()
    })

    expect(result.current.isUnlocked).toBe(false)
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('contact_unlocked')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('contact_unlock_timestamp')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('contact_user_data')
  })

  it('restores unlocked state from localStorage', () => {
    const mockTimestamp = Date.now().toString()
    localStorageMock.getItem
      .mockReturnValueOnce('true') // contact_unlocked
      .mockReturnValueOnce(mockTimestamp) // contact_unlock_timestamp

    const { result } = renderHook(() => useContactPrivacyGate())
    
    expect(result.current.isUnlocked).toBe(true)
  })

  it('expires unlock after 30 days', () => {
    const expiredTimestamp = (Date.now() - (31 * 24 * 60 * 60 * 1000)).toString() // 31 days ago
    localStorageMock.getItem
      .mockReturnValueOnce('true') // contact_unlocked
      .mockReturnValueOnce(expiredTimestamp) // contact_unlock_timestamp

    const { result } = renderHook(() => useContactPrivacyGate())
    
    expect(result.current.isUnlocked).toBe(false)
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('contact_unlocked')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('contact_unlock_timestamp')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('contact_user_data')
  })

  it('handles localStorage errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })

    const { result } = renderHook(() => useContactPrivacyGate())
    
    // Should not throw and should initialize with locked state
    expect(result.current.isUnlocked).toBe(false)
  })

  it('handles unlock errors gracefully', async () => {
    const { result } = renderHook(() => useContactPrivacyGate())
    
    // Mock localStorage.setItem to throw an error
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })

    const formData: ContactUnlockForm = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+351 934 330 807',
      reason: 'jobOpportunity'
    }

    await act(async () => {
      const success = await result.current.unlockContact(formData)
      expect(success).toBe(false)
    })

    expect(result.current.isUnlocked).toBe(false)
    expect(result.current.error).toBe('localStorage error')
  })
})
