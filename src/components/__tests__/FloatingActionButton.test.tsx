import { render, screen, fireEvent, waitFor } from '@testing-library/preact'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { FloatingActionButton } from '../FloatingActionButton'
import { useTheme } from '../../hooks/useTheme'
import { useTranslation } from '../../contexts/TranslationContext'

// Mock the hooks
vi.mock('../../hooks/useTheme')
vi.mock('../../contexts/TranslationContext')

const mockUseTheme = vi.mocked(useTheme)
const mockUseTranslation = vi.mocked(useTranslation)

describe('FloatingActionButton', () => {
  const mockToggleTheme = vi.fn()
  const mockChangeLanguage = vi.fn()

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()
    
    // Setup default mock implementations
    mockUseTheme.mockReturnValue({
      isDarkMode: false,
      toggleTheme: mockToggleTheme
    })

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

  it('renders the main FAB button', () => {
    render(<FloatingActionButton />)
    
    const mainButton = screen.getByRole('button', { name: /open menu/i })
    expect(mainButton).toBeInTheDocument()
    expect(mainButton).toHaveClass('fab-main')
  })

  it('shows cog icon when collapsed', () => {
    render(<FloatingActionButton />)
    
    const cogIcon = screen.getByRole('button', { name: /open menu/i }).querySelector('.fa-cog')
    expect(cogIcon).toBeInTheDocument()
  })

  it('expands when main button is clicked', async () => {
    render(<FloatingActionButton />)
    
    const mainButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(mainButton)
    
    await waitFor(() => {
      expect(mainButton).toHaveClass('fab-main-expanded')
      expect(mainButton).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('shows theme toggle button when expanded', async () => {
    render(<FloatingActionButton />)
    
    const mainButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(mainButton)
    
    await waitFor(() => {
      const themeButton = screen.getByRole('button', { name: /switch to dark/i })
      expect(themeButton).toBeInTheDocument()
      expect(themeButton).toHaveClass('fab-item-theme')
    })
  })

  it('shows language toggle button when expanded', async () => {
    render(<FloatingActionButton />)
    
    const mainButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(mainButton)
    
    await waitFor(() => {
      const languageButton = screen.getByRole('button', { name: /switch to portuguese/i })
      expect(languageButton).toBeInTheDocument()
      expect(languageButton).toHaveClass('fab-item-language')
    })
  })

  it('calls toggleTheme when theme button is clicked', async () => {
    render(<FloatingActionButton />)
    
    const mainButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(mainButton)
    
    await waitFor(() => {
      const themeButton = screen.getByRole('button', { name: /switch to dark/i })
      fireEvent.click(themeButton)
    })
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1)
  })

  it('calls changeLanguage when language button is clicked', async () => {
    render(<FloatingActionButton />)
    
    const mainButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(mainButton)
    
    await waitFor(() => {
      const languageButton = screen.getByRole('button', { name: /switch to portuguese/i })
      fireEvent.click(languageButton)
    })
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('pt-PT')
  })

  it('keeps menu open when theme button is clicked', async () => {
    render(<FloatingActionButton />)
    
    const mainButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(mainButton)
    
    await waitFor(() => {
      const themeButton = screen.getByRole('button', { name: /switch to dark/i })
      fireEvent.click(themeButton)
    })
    
    await waitFor(() => {
      expect(mainButton).toHaveClass('fab-main-expanded')
      expect(mainButton).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('keeps menu open when language button is clicked', async () => {
    render(<FloatingActionButton />)
    
    const mainButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(mainButton)
    
    await waitFor(() => {
      const languageButton = screen.getByRole('button', { name: /switch to portuguese/i })
      fireEvent.click(languageButton)
    })
    
    await waitFor(() => {
      expect(mainButton).toHaveClass('fab-main-expanded')
      expect(mainButton).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('shows correct icons for dark mode', () => {
    mockUseTheme.mockReturnValue({
      isDarkMode: true,
      toggleTheme: mockToggleTheme
    })

    render(<FloatingActionButton />)
    
    const mainButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(mainButton)
    
    const themeButton = screen.getByRole('button', { name: /switch to light/i })
    const sunIcon = themeButton.querySelector('.fa-sun')
    expect(sunIcon).toBeInTheDocument()
  })

  it('shows correct icons for light mode', () => {
    mockUseTheme.mockReturnValue({
      isDarkMode: false,
      toggleTheme: mockToggleTheme
    })

    render(<FloatingActionButton />)
    
    const mainButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(mainButton)
    
    const themeButton = screen.getByRole('button', { name: /switch to dark/i })
    const moonIcon = themeButton.querySelector('.fa-moon')
    expect(moonIcon).toBeInTheDocument()
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
    
    const mainButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(mainButton)
    
    const languageButton = screen.getByRole('button', { name: /switch to english/i })
    expect(languageButton).toBeInTheDocument()
  })

  it('closes menu when escape key is pressed', async () => {
    render(<FloatingActionButton />)
    
    const mainButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(mainButton)
    
    await waitFor(() => {
      expect(mainButton).toHaveClass('fab-main-expanded')
    })
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    await waitFor(() => {
      expect(mainButton).not.toHaveClass('fab-main-expanded')
    })
  })

  it('loads saved position from localStorage', () => {
    const mockGetItem = vi.fn().mockReturnValue('{"x": 100, "y": 200}')
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    })

    render(<FloatingActionButton />)
    
    expect(mockGetItem).toHaveBeenCalledWith('fab-position')
  })

  it('handles localStorage errors gracefully', () => {
    const mockGetItem = vi.fn().mockImplementation(() => {
      throw new Error('localStorage error')
    })
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    })

    // Should not throw
    expect(() => render(<FloatingActionButton />)).not.toThrow()
  })

  it('applies custom className', () => {
    render(<FloatingActionButton className="custom-fab" />)
    
    const container = document.querySelector('.fab-container')
    expect(container).toHaveClass('custom-fab')
  })

  it('has proper ARIA attributes', () => {
    render(<FloatingActionButton />)
    
    const mainButton = screen.getByRole('button', { name: /open menu/i })
    expect(mainButton).toHaveAttribute('aria-expanded', 'false')
    expect(mainButton).toHaveAttribute('aria-haspopup', 'menu')
  })

  it('updates ARIA attributes when expanded', async () => {
    render(<FloatingActionButton />)
    
    const mainButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(mainButton)
    
    await waitFor(() => {
      expect(mainButton).toHaveAttribute('aria-expanded', 'true')
    })
  })
})
