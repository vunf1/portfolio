import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/preact'
import { Navigation } from '../Navigation'
import type { NavigationProps } from '../../types/components'

// Mock the TranslationContext
vi.mock('../../contexts/TranslationContext', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'navigation.brand': 'João Maia',
        'hero.title': 'Full-Stack Developer',
        'navigation.about': 'About',
        'navigation.experience': 'Experience',
        'navigation.education': 'Education',
        'navigation.skills': 'Skills',
        'navigation.projects': 'Projects',
        'navigation.contact': 'Contact'
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

vi.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({
    isDarkMode: false,
    toggleTheme: vi.fn()
  })
}))

const mockNavigationItems = [
  { id: 'about', label: 'About', icon: 'fa-user' },
  { id: 'experience', label: 'Experience', icon: 'fa-briefcase' },
  { id: 'projects', label: 'Projects', icon: 'fa-code' },
  { id: 'contact', label: 'Contact', icon: 'fa-envelope' }
]

const defaultProps: NavigationProps = {
  items: mockNavigationItems,
  activeId: 'about'
}

describe('Navigation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0
    })
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024
    })
  })

  it('renders navigation with brand section', () => {
    render(<Navigation {...defaultProps} />)
    
    expect(screen.getByText('João Maia')).toBeInTheDocument()
    expect(screen.getByText('Full-Stack Developer')).toBeInTheDocument()
  })

  it('renders navigation items', () => {
    render(<Navigation {...defaultProps} />)
    
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('highlights active navigation item', () => {
    render(<Navigation {...defaultProps} activeId="projects" />)
    
    const activeLink = screen.getByText('Projects').closest('a')
    expect(activeLink).toHaveClass('active')
  })


  it('renders mobile toggle button', () => {
    render(<Navigation {...defaultProps} />)
    
    const mobileToggle = screen.getByLabelText('Toggle navigation menu')
    expect(mobileToggle).toBeInTheDocument()
  })

  it('toggles mobile menu when toggle button is clicked', () => {
    render(<Navigation {...defaultProps} />)
    
    const mobileToggle = screen.getByLabelText('Toggle navigation menu')
    const navMenu = document.querySelector('.nav-menu')
    
    expect(navMenu).toHaveClass('collapsed')
    
    fireEvent.click(mobileToggle)
    expect(navMenu).not.toHaveClass('collapsed')
    
    fireEvent.click(mobileToggle)
    expect(navMenu).toHaveClass('collapsed')
  })

  it('handles navigation item click', () => {
    const mockOnNavigate = vi.fn()
    render(<Navigation {...defaultProps} onNavigate={mockOnNavigate} />)
    
    const aboutLink = screen.getByText('About')
    fireEvent.click(aboutLink)
    
    expect(mockOnNavigate).toHaveBeenCalledWith('about')
  })

  it('handles brand click', () => {
    const mockOnNavigate = vi.fn()
    render(<Navigation {...defaultProps} onNavigate={mockOnNavigate} />)
    
    const brandLink = screen.getByText('João Maia').closest('a')
    fireEvent.click(brandLink!)
    
    expect(mockOnNavigate).toHaveBeenCalledWith('hero')
  })

  it('closes mobile menu when clicking outside', () => {
    render(<Navigation {...defaultProps} />)
    
    const mobileToggle = screen.getByLabelText('Toggle navigation menu')
    const navMenu = document.querySelector('.nav-menu')
    
    // Open mobile menu
    fireEvent.click(mobileToggle)
    expect(navMenu).not.toHaveClass('collapsed')
    
    // Click outside
    fireEvent.click(document.body)
    expect(navMenu).toHaveClass('collapsed')
  })

  it('closes mobile menu on desktop resize', () => {
    render(<Navigation {...defaultProps} />)
    
    const mobileToggle = screen.getByLabelText('Toggle navigation menu')
    const navMenu = document.querySelector('.nav-menu')
    
    // Open mobile menu
    fireEvent.click(mobileToggle)
    expect(navMenu).not.toHaveClass('collapsed')
    
    // Simulate desktop resize
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024
    })
    
    fireEvent(window, new Event('resize'))
    expect(navMenu).toHaveClass('collapsed')
  })

  it('applies scrolled class when scrolled', () => {
    render(<Navigation {...defaultProps} />)
    
    const nav = document.querySelector('.premium-nav')
    expect(nav).not.toHaveClass('scrolled')
    
    // Simulate scroll
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 100
    })
    
    fireEvent(window, new Event('scroll'))
    expect(nav).toHaveClass('scrolled')
  })

  it('applies custom className', () => {
    render(<Navigation {...defaultProps} className="custom-nav" />)
    
    const nav = document.querySelector('.premium-nav')
    expect(nav).toHaveClass('custom-nav')
  })

  it('applies custom id', () => {
    render(<Navigation {...defaultProps} id="custom-nav" />)
    
    const nav = document.getElementById('custom-nav')
    expect(nav).toBeInTheDocument()
  })

  it('renders icons for navigation items', () => {
    render(<Navigation {...defaultProps} />)
    
    const aboutIcon = document.querySelector('.fa-user')
    const experienceIcon = document.querySelector('.fa-briefcase')
    
    expect(aboutIcon).toBeInTheDocument()
    expect(experienceIcon).toBeInTheDocument()
  })

  it('handles navigation with no items', () => {
    render(<Navigation {...defaultProps} items={[]} />)
    
    // Should still render brand and controls
    expect(screen.getByText('João Maia')).toBeInTheDocument()
    expect(screen.getByLabelText('Toggle navigation menu')).toBeInTheDocument()
  })
})
