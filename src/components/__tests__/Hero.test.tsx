import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/preact'
import { Hero } from '../Hero'
import type { HeroProps } from '../../types'

// Mock the TranslationContext
vi.mock('../../contexts/TranslationContext', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'hero.title': 'Full-Stack Developer',
        'hero.subtitle': 'Back-end Ops • Network • OOP',
        'hero.cta': 'Get In Touch',
        'navigation.projects': 'View Projects'
      }
      return translations[key] || key
    },
    currentLanguage: 'en',
    changeLanguage: vi.fn(),
    isEnglish: true,
    isPortuguese: false,
    supportedLanguages: ['en', 'pt-PT']
  }),
  preloadTranslations: vi.fn().mockResolvedValue(undefined)
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock navigator properties
Object.defineProperty(navigator, 'hardwareConcurrency', {
  writable: true,
  value: 4,
})

const mockPersonal = {
  name: 'João Maia',
  title: 'Full-Stack Developer',
  tagline: 'Back-end Ops • Network • OOP',
  summary: 'Full-stack developer with passion for modern web technologies',
  longSummary: 'Experienced full-stack developer specializing in React, Node.js, and cloud technologies',
  profileImage: './img/profile.jpg',
  coreValues: ['Innovation', 'Quality', 'Collaboration']
}

// const mockSocial = [
//   {
//     name: 'LinkedIn',
//     url: 'https://linkedin.com/in/joaomaia',
//     icon: 'fa-linkedin',
//     color: '#0077B5'
//   },
//   {
//     name: 'GitHub',
//     url: 'https://github.com/joaomaia',
//     icon: 'fa-github',
//     color: '#333'
//   }
// ]

const defaultProps: HeroProps = {
  personal: mockPersonal
}

describe('Hero Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders hero section with personal information', () => {
    render(<Hero {...defaultProps} />)
    
    expect(screen.getByText('João Maia')).toBeInTheDocument()
    expect(screen.getByText('Full-Stack Developer')).toBeInTheDocument()
    expect(screen.getByText(mockPersonal.longSummary)).toBeInTheDocument()
  })

  it('renders profile image with correct attributes', () => {
    const { container } = render(<Hero {...defaultProps} />)
    
    const profileImage = container.querySelector('img.hero-avatar') as HTMLImageElement
    expect(profileImage).toBeInTheDocument()
    expect(profileImage).toHaveAttribute('src', './img/profile.jpg')
    expect(profileImage).toHaveAttribute('alt', 'João Maia  - Full-Stack Developer')
    expect(profileImage).toHaveAttribute('loading', 'lazy')
    expect(profileImage).toHaveAttribute('decoding', 'async')
  })

  it('renders core values when provided', () => {
    render(<Hero {...defaultProps} />)
    
    expect(screen.getByText('Innovation')).toBeInTheDocument()
    expect(screen.getByText('Quality')).toBeInTheDocument()
    expect(screen.getByText('Collaboration')).toBeInTheDocument()
  })






  it('renders floating shapes and background elements', () => {
    render(<Hero {...defaultProps} />)
    
    // Check for floating shapes
    const shapes = document.querySelectorAll('.floating-shape')
    expect(shapes.length).toBeGreaterThan(0)
    
    // Check for data streams
    const streams = document.querySelectorAll('.data-stream')
    expect(streams.length).toBeGreaterThan(0)
  })


  it('uses longSummary when available', () => {
    render(<Hero {...defaultProps} />)
    
    expect(screen.getByText(mockPersonal.longSummary)).toBeInTheDocument()
  })

  it('falls back to summary when longSummary is not available', () => {
    const propsWithoutLongSummary = {
      ...defaultProps,
      personal: {
        ...mockPersonal,
        longSummary: undefined
      }
    }
    
    render(<Hero {...propsWithoutLongSummary} />)
    
    expect(screen.getByText(mockPersonal.summary)).toBeInTheDocument()
  })
})
