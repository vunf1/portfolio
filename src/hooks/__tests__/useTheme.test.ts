import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/preact'
import { useTheme } from '../useTheme'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = mockLocalStorage

// Document methods are mocked in setup.ts

describe('useTheme Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes with light theme by default', () => {
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.isDarkMode).toBe(false)
  })

  it('initializes with saved theme preference from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('true')
    
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.isDarkMode).toBe(true)
  })

  it('applies light theme classes and attributes on initialization', () => {
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.isDarkMode).toBe(false)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('darkMode', 'false')
  })

  it('applies dark theme classes and attributes when dark mode is enabled', () => {
    mockLocalStorage.getItem.mockReturnValue('true')
    
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.isDarkMode).toBe(true)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('darkMode', 'true')
  })

  it('saves theme preference to localStorage', () => {
    renderHook(() => useTheme())
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('darkMode', 'false')
  })

  it('toggles theme from light to dark', () => {
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.isDarkMode).toBe(false)
    
    act(() => {
      result.current.toggleTheme()
    })
    
    expect(result.current.isDarkMode).toBe(true)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('darkMode', 'true')
  })

  it('toggles theme from dark to light', () => {
    mockLocalStorage.getItem.mockReturnValue('true')
    
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.isDarkMode).toBe(true)
    
    act(() => {
      result.current.toggleTheme()
    })
    
    expect(result.current.isDarkMode).toBe(false)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('darkMode', 'false')
  })

  it('updates theme state when theme changes', () => {
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.isDarkMode).toBe(false)
    
    act(() => {
      result.current.toggleTheme()
    })
    
    expect(result.current.isDarkMode).toBe(true)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('darkMode', 'true')
  })

  it('handles invalid localStorage data gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-json')
    
    const { result } = renderHook(() => useTheme())
    
    // Should default to light theme
    expect(result.current.isDarkMode).toBe(false)
  })

  it('handles localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })
    
    const { result } = renderHook(() => useTheme())
    
    // Should default to light theme
    expect(result.current.isDarkMode).toBe(false)
  })

  it('handles localStorage setItem errors gracefully', () => {
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('localStorage setItem error')
    })
    
    const { result } = renderHook(() => useTheme())
    
    // Should still work, just not save to localStorage
    expect(result.current.isDarkMode).toBe(false)
    
    act(() => {
      result.current.toggleTheme()
    })
    
    expect(result.current.isDarkMode).toBe(true)
  })

  it('provides toggleTheme function', () => {
    const { result } = renderHook(() => useTheme())
    
    expect(typeof result.current.toggleTheme).toBe('function')
  })

  it('maintains theme state across re-renders', () => {
    const { result, rerender } = renderHook(() => useTheme())
    
    act(() => {
      result.current.toggleTheme()
    })
    
    expect(result.current.isDarkMode).toBe(true)
    
    rerender()
    
    expect(result.current.isDarkMode).toBe(true)
  })
})
