import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/preact'
import { Hero } from '../Hero'
import type { HeroProps } from '../../types'

// Mock the useI18n hook
vi.mock('../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'hero.title': 'Software Developer',
        'hero.cta': 'Get In Touch',
        'navigation.projects': 'View Projects'
      }
      return translations[key] || key
    }
  })
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
  profileImage: '/img/profile.jpg',
  summary: 'Full-stack developer with passion for modern web technologies',
  longSummary: 'Experienced full-stack developer specializing in React, Node.js, and cloud technologies',
  coreValues: ['Innovation', 'Quality', 'Collaboration']
}

const mockSocial = [
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/joaomaia',
    icon: 'fa-linkedin',
    color: '#0077B5'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/joaomaia',
    icon: 'fa-github',
    color: '#333'
  }
]

const defaultProps: HeroProps = {
  personal: mockPersonal,
  social: mockSocial
}

describe('Hero Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders hero section with personal information', () => {
    render(<Hero {...defaultProps} />)
    
    expect(screen.getByText('João Maia')).toBeInTheDocument()
    expect(screen.getByText('Software Developer')).toBeInTheDocument()
    expect(screen.getByText(mockPersonal.longSummary)).toBeInTheDocument()
  })

  it('renders profile image with correct attributes', () => {
    render(<Hero {...defaultProps} />)
    
    const profileImage = screen.getByAltText('João Maia Profile')
    expect(profileImage).toBeInTheDocument()
    expect(profileImage).toHaveAttribute('src', '/img/profile.jpg')
    expect(profileImage).toHaveAttribute('loading', 'lazy')
    expect(profileImage).toHaveAttribute('decoding', 'async')
  })

  it('renders core values when provided', () => {
    render(<Hero {...defaultProps} />)
    
    expect(screen.getByText('Innovation')).toBeInTheDocument()
    expect(screen.getByText('Quality')).toBeInTheDocument()
    expect(screen.getByText('Collaboration')).toBeInTheDocument()
  })

  it('renders social links', () => {
    render(<Hero {...defaultProps} />)
    
    const linkedinLink = screen.getByLabelText('LinkedIn')
    const githubLink = screen.getByLabelText('GitHub')
    
    expect(linkedinLink).toBeInTheDocument()
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/joaomaia')
    expect(linkedinLink).toHaveAttribute('target', '_blank')
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer')
    
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('href', 'https://github.com/joaomaia')
  })

  it('renders action buttons', () => {
    render(<Hero {...defaultProps} />)
    
    expect(screen.getByText('Get In Touch')).toBeInTheDocument()
    expect(screen.getByText('View Projects')).toBeInTheDocument()
  })

  it('handles scroll down button click', () => {
    const mockOnScrollDown = vi.fn()
    render(<Hero {...defaultProps} onScrollDown={mockOnScrollDown} />)
    
    const scrollButton = screen.getByLabelText('Scroll down to explore')
    fireEvent.click(scrollButton)
    
    expect(mockOnScrollDown).toHaveBeenCalledTimes(1)
  })

  it('handles contact button click', () => {
    // Mock scrollIntoView
    const mockScrollIntoView = vi.fn()
    const mockGetElementById = vi.spyOn(document, 'getElementById')
    mockGetElementById.mockReturnValue({
      scrollIntoView: mockScrollIntoView
    } as any)

    render(<Hero {...defaultProps} />)
    
    const contactButton = screen.getByText('Get In Touch')
    fireEvent.click(contactButton)
    
    expect(mockGetElementById).toHaveBeenCalledWith('contact')
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('handles projects button click', () => {
    // Mock scrollIntoView
    const mockScrollIntoView = vi.fn()
    const mockGetElementById = vi.spyOn(document, 'getElementById')
    mockGetElementById.mockReturnValue({
      scrollIntoView: mockScrollIntoView
    } as any)

    render(<Hero {...defaultProps} />)
    
    const projectsButton = screen.getByText('View Projects')
    fireEvent.click(projectsButton)
    
    expect(mockGetElementById).toHaveBeenCalledWith('projects')
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
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

  it('handles empty social array gracefully', () => {
    const propsWithoutSocial = {
      ...defaultProps,
      social: []
    }
    
    render(<Hero {...propsWithoutSocial} />)
    
    expect(screen.getByText('No social links available')).toBeInTheDocument()
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
