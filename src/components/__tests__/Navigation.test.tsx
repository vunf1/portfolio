import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within, waitFor } from '@testing-library/preact'
import { Navigation } from '../Navigation'
import type { NavigationProps } from '../../types/components'
import { scrollToPortfolioSection } from '../../lib/scrollToPortfolioSection'

vi.mock('../../lib/scrollToPortfolioSection', () => ({
  scrollToPortfolioSection: vi.fn()
}))

vi.mock('../../contexts/TranslationContext', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'navigation.brand': 'João Maia',
        'hero.title': 'Full-Stack Engineer',
        'navigation.about': 'About',
        'navigation.experience': 'Experience',
        'navigation.education': 'Education',
        'navigation.skills': 'Skills',
        'navigation.projects': 'Projects',
        'navigation.menu': 'Menu',
        'navigation.menuDescription': 'Jump to section',
        'navigation.sectionsNav': 'Portfolio sections',
        'navigation.backToHome': 'Back to Home',
        'navigation.backToLanding': 'Back to Landing Page'
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

const mockNavigationItems = [
  { id: 'about', label: 'About', icon: 'fa-user' },
  { id: 'experience', label: 'Experience', icon: 'fa-briefcase' },
  { id: 'education', label: 'Education', icon: 'fa-graduation-cap' },
  { id: 'projects', label: 'Projects', icon: 'fa-code' }
]

const defaultProps: NavigationProps = {
  items: mockNavigationItems,
  activeId: 'about'
}

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'scrollY', { writable: true, value: 0 })
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1200 })
  })

  it('renders brand and subtitle', () => {
    render(<Navigation {...defaultProps} />)
    expect(screen.getByText('João Maia')).toBeInTheDocument()
    expect(screen.getByText('Full-Stack Engineer')).toBeInTheDocument()
  })

  it('renders section links in desktop nav', () => {
    render(<Navigation {...defaultProps} />)
    const nav = screen.getByRole('navigation', { name: 'Portfolio sections' })
    expect(within(nav).getByRole('button', { name: 'About' })).toBeInTheDocument()
    expect(within(nav).getByRole('button', { name: 'Experience' })).toBeInTheDocument()
    expect(within(nav).getByRole('button', { name: 'Projects' })).toBeInTheDocument()
  })

  it('highlights active section', () => {
    render(<Navigation {...defaultProps} activeId="projects" />)
    const nav = screen.getByRole('navigation', { name: 'Portfolio sections' })
    const active = within(nav).getByRole('button', { name: 'Projects' })
    expect(active.className).toMatch(/bg-gray-100/)
  })

  it('calls onNavigate when a section is clicked', () => {
    const onNavigate = vi.fn()
    render(<Navigation {...defaultProps} onNavigate={onNavigate} />)
    fireEvent.click(screen.getByRole('button', { name: 'About' }))
    expect(onNavigate).toHaveBeenCalledWith('about')
  })

  it('navigates to first section id when brand is clicked', () => {
    const onNavigate = vi.fn()
    render(<Navigation {...defaultProps} onNavigate={onNavigate} />)
    const brand = screen.getByText('João Maia').closest('a')
    fireEvent.click(brand!)
    expect(onNavigate).toHaveBeenCalledWith('about')
  })

  it('adds shadow on scroll', () => {
    render(<Navigation {...defaultProps} />)
    const header = document.querySelector('header')
    expect(header?.className).not.toMatch(/shadow-sm/)

    Object.defineProperty(window, 'scrollY', { writable: true, value: 100 })
    fireEvent(window, new Event('scroll'))

    expect(header?.className).toMatch(/shadow-sm/)
  })

  it('applies custom className and id on header', () => {
    render(<Navigation {...defaultProps} className="custom-nav" id="custom-nav" />)
    const header = document.getElementById('custom-nav')
    expect(header).toBeTruthy()
    expect(header?.className).toMatch(/custom-nav/)
  })

  it('opens mobile sheet with section actions', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 600 })
    render(<Navigation {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: /menu/i }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(document.body.contains(dialog)).toBe(true)
    expect(within(dialog).getByRole('button', { name: 'Education' })).toBeInTheDocument()
  })

  it('closes sheet after section click on narrow viewport', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 600 })
    render(<Navigation {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: /menu/i }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Projects' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('defers scroll until after mobile sheet closes (scroll lock released)', async () => {
    const scrollMock = vi.mocked(scrollToPortfolioSection)
    scrollMock.mockClear()
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 600 })
    render(<Navigation {...defaultProps} />)

    fireEvent.click(screen.getByRole('button', { name: /menu/i }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Education' }))

    await waitFor(() => {
      expect(scrollMock).toHaveBeenCalledWith('education', { navHeight: 80, offset: 20 })
    })
  })

  it('renders back control and calls onBackClick', () => {
    const onBackClick = vi.fn()
    render(
      <Navigation
        {...defaultProps}
        showBackButton
        onBackClick={onBackClick}
      />
    )
    const back = screen.getAllByRole('button', { name: /back to home/i })[0]
    fireEvent.click(back)
    expect(onBackClick).toHaveBeenCalled()
  })

  it('with empty items still renders brand and uses experience as brand target', () => {
    const onNavigate = vi.fn()
    render(<Navigation {...defaultProps} items={[]} onNavigate={onNavigate} />)
    expect(screen.getByText('João Maia')).toBeInTheDocument()
    fireEvent.click(screen.getByText('João Maia').closest('a')!)
    expect(onNavigate).toHaveBeenCalledWith('experience')
  })
})
