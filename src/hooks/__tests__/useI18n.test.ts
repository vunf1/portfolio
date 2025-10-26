import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/preact'
import { useI18n } from '../useI18n'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
} as any // eslint-disable-line @typescript-eslint/no-explicit-any
global.localStorage = mockLocalStorage

// Mock navigator.language
Object.defineProperty(navigator, 'language', {
  writable: true,
  value: 'en-US'
})

describe('useI18n Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes with English as default language', async () => {
    const { result } = renderHook(() => useI18n())
    
    expect(result.current.currentLanguage).toBe('en')
    expect(result.current.isEnglish).toBe(true)
    expect(result.current.isPortuguese).toBe(false)
  })

  it('loads translations from data file', async () => {
    const mockTranslations = {
      hero: {
        title: 'Software Developer',
        cta: 'Get In Touch'
      },
      navigation: {
        about: 'About'
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTranslations
    })

    const { result } = renderHook(() => useI18n())
    
    // Wait for async translation loading
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockFetch).toHaveBeenCalledWith('./data/en/ui.json')
    expect(result.current.t('hero.title')).toBe('Software Developer')
    expect(result.current.t('hero.cta')).toBe('Get In Touch')
  })

  it('handles translation loading errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useI18n())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Should return key as fallback
    expect(result.current.t('hero.title')).toBe('hero.title')
  })

  it('changes language and loads new translations', async () => {
    const mockEnTranslations = { hero: { title: 'Software Developer' } }
    const mockPtTranslations = { hero: { title: 'Desenvolvedor de Software' } }

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockEnTranslations
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPtTranslations
      })

    const { result } = renderHook(() => useI18n())
    
    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.currentLanguage).toBe('en')
    expect(result.current.t('hero.title')).toBe('Software Developer')

    // Change language
    act(() => {
      result.current.changeLanguage('pt-PT')
    })

    expect(result.current.currentLanguage).toBe('pt-PT')
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('i18nextLng', 'pt-PT')

    // Wait for new translations to load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockFetch).toHaveBeenCalledWith('./data/pt-PT/ui.json')
    expect(result.current.t('hero.title')).toBe('Desenvolvedor de Software')
  })

  it('uses saved language from localStorage', async () => {
    mockLocalStorage.getItem.mockReturnValue('pt-PT')
    
    const mockPtTranslations = { hero: { title: 'Desenvolvedor de Software' } }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPtTranslations
    })

    const { result } = renderHook(() => useI18n())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.currentLanguage).toBe('pt-PT')
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('i18nextLng')
  })

  it('always defaults to English regardless of browser language', async () => {
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'pt-BR'
    })

    const mockEnTranslations = { hero: { title: 'Software Developer' } }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockEnTranslations
    })

    const { result } = renderHook(() => useI18n())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Should always default to English, even with Portuguese browser language
    expect(result.current.currentLanguage).toBe('en')
  })

  it('handles nested translation keys', async () => {
    const mockTranslations = {
      hero: {
        title: 'Software Developer',
        actions: {
          projects: 'View Projects'
        }
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTranslations
    })

    const { result } = renderHook(() => useI18n())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.t('hero.title')).toBe('Software Developer')
    expect(result.current.t('hero.actions.projects')).toBe('View Projects')
  })

  it('returns default value for missing keys', async () => {
    const mockTranslations = { hero: { title: 'Software Developer' } }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTranslations
    })

    const { result } = renderHook(() => useI18n())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.t('missing.key', 'Default Value')).toBe('Default Value')
    expect(result.current.t('missing.key')).toBe('missing.key')
  })

  it('provides correct language flags', () => {
    const { result } = renderHook(() => useI18n())
    
    expect(result.current.supportedLanguages).toEqual(['en', 'pt-PT'])
    
    act(() => {
      result.current.changeLanguage('pt-PT')
    })
    
    expect(result.current.isEnglish).toBe(false)
    expect(result.current.isPortuguese).toBe(true)
  })

  it('handles malformed translation data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}) // No ui property
    })

    const { result } = renderHook(() => useI18n())
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Should return key as fallback
    expect(result.current.t('hero.title')).toBe('hero.title')
  })
})
