import { renderHook, act } from '@testing-library/preact'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDarkReader } from '../useDarkReader'

const mockEnable = vi.fn()
const mockDisable = vi.fn()

vi.mock('darkreader', () => ({
  enable: (...args: unknown[]) => mockEnable(...args),
  disable: () => mockDisable(),
  isEnabled: () => false
}))

describe('useDarkReader', () => {
  let sessionStorageMock: Record<string, string>

  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorageMock = {}
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: vi.fn((key: string) => sessionStorageMock[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          sessionStorageMock[key] = value
        }),
        removeItem: vi.fn((key: string) => {
          delete sessionStorageMock[key]
        }),
        clear: vi.fn(() => {
          sessionStorageMock = {}
        }),
        length: 0,
        key: vi.fn()
      },
      writable: true
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns isDark false and toggleDarkMode when storage is empty', () => {
    const { result } = renderHook(() => useDarkReader())
    expect(result.current.isDark).toBe(false)
    expect(typeof result.current.toggleDarkMode).toBe('function')
  })

  it('calls enable and sets storage when toggling from light to dark', async () => {
    const { result } = renderHook(() => useDarkReader())
    await act(async () => {
      result.current.toggleDarkMode()
    })
    await vi.waitFor(() => {
      expect(mockEnable).toHaveBeenCalledWith({
        brightness: 100,
        contrast: 90,
        sepia: 10
      })
    })
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      'portfolio-darkreader',
      'true'
    )
  })

  it('calls disable and removes storage when toggling from dark to light', async () => {
    sessionStorageMock['portfolio-darkreader'] = 'true'
    const { result } = renderHook(() => useDarkReader())
    await vi.waitFor(() => {
      expect(mockEnable).toHaveBeenCalled()
    })
    await act(async () => {
      result.current.toggleDarkMode()
    })
    await vi.waitFor(() => {
      expect(mockDisable).toHaveBeenCalled()
    })
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith(
      'portfolio-darkreader'
    )
  })

  it('restores dark state from sessionStorage on mount', async () => {
    sessionStorageMock['portfolio-darkreader'] = 'true'
    renderHook(() => useDarkReader())
    await vi.waitFor(() => {
      expect(mockEnable).toHaveBeenCalledWith({
        brightness: 100,
        contrast: 90,
        sepia: 10
      })
    })
  })
})
