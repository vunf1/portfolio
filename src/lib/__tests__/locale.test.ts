import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getInitialLanguage } from '../locale'

describe('getInitialLanguage', () => {
  const originalLocation = window.location

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn()
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns URL lang when ?lang=pt-PT', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        search: '?lang=pt-PT'
      },
      writable: true
    })
    expect(getInitialLanguage()).toBe('pt-PT')
  })

  it('returns URL lang when ?lang=en', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        search: '?lang=en'
      },
      writable: true
    })
    expect(getInitialLanguage()).toBe('en')
  })

  it('returns localStorage value when URL has no valid lang', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        search: ''
      },
      writable: true
    })
    vi.mocked(localStorage.getItem).mockReturnValue('pt-PT')
    expect(getInitialLanguage()).toBe('pt-PT')
  })

  it('returns "en" when no URL param and no localStorage', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        search: ''
      },
      writable: true
    })
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    expect(getInitialLanguage()).toBe('en')
  })

  it('returns "en" when URL has invalid lang and no valid localStorage', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        search: '?lang=fr'
      },
      writable: true
    })
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    expect(getInitialLanguage()).toBe('en')
  })

  it('prefers URL over localStorage', () => {
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        search: '?lang=pt-PT'
      },
      writable: true
    })
    vi.mocked(localStorage.getItem).mockReturnValue('en')
    expect(getInitialLanguage()).toBe('pt-PT')
  })
})
