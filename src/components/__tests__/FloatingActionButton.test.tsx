import { render, screen, fireEvent } from '@testing-library/preact'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { FloatingActionButton } from '../FloatingActionButton'
import { useTranslation } from '../../contexts/TranslationContext'

// Mock the hooks
vi.mock('../../contexts/TranslationContext')

const mockUseTranslation = vi.mocked(useTranslation)

describe('FloatingActionButton', () => {
  const mockChangeLanguage = vi.fn()

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
    
    // Setup default mock implementations
    mockUseTranslation.mockReturnValue({
      t: (key: string, defaultValue?: string) => defaultValue || key,
      currentLanguage: 'en' as const,
      changeLanguage: mockChangeLanguage,
      isEnglish: true,
      isPortuguese: false,
      supportedLanguages: ['en', 'pt-PT'] as const
    })

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    })

    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the language toggle button', () => {
    render(<FloatingActionButton />)
    
    const languageButton = screen.getByRole('button', { name: /language/i })
    expect(languageButton).toBeInTheDocument()
    expect(languageButton).toHaveClass('fab-item-language')
  })

  it('shows language toggle button', () => {
    render(<FloatingActionButton />)
    
    const languageButton = screen.getByRole('button', { name: /language/i })
    expect(languageButton).toBeInTheDocument()
    expect(languageButton).toHaveClass('fab-item-language')
  })

  it('calls changeLanguage when language button is clicked', () => {
    render(<FloatingActionButton />)
    
    const languageButton = screen.getByRole('button', { name: /language/i })
    fireEvent.click(languageButton)
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('pt-PT')
  })

  it('shows correct language labels', () => {
    mockUseTranslation.mockReturnValue({
      t: (key: string, defaultValue?: string) => defaultValue || key,
      currentLanguage: 'pt-PT' as const,
      changeLanguage: mockChangeLanguage,
      isEnglish: false,
      isPortuguese: true,
      supportedLanguages: ['en', 'pt-PT'] as const
    })

    render(<FloatingActionButton />)
    
    const languageButton = screen.getByRole('button', { name: /language/i })
    expect(languageButton).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<FloatingActionButton className="custom-fab" />)
    
    const container = document.querySelector('.fab-items-static')
    expect(container).toHaveClass('custom-fab')
  })

  it('has proper ARIA attributes', () => {
    render(<FloatingActionButton />)
    
    const languageButton = screen.getByRole('button', { name: /language/i })
    expect(languageButton).toHaveAttribute('aria-label')
  })
})
