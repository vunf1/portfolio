import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/preact'
import { PageLoader } from '../PageLoader'

// Mock TranslationContext
vi.mock('../../../contexts/TranslationContext', () => ({
  useTranslation: () => ({
    t: (key: string) => (key === 'common.loading' ? 'Loading...' : key)
  })
}))

describe('PageLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with correct role and aria attributes', () => {
    render(<PageLoader />)
    const loader = screen.getByRole('status', { name: 'Loading...' })
    expect(loader).toBeInTheDocument()
    expect(loader).toHaveAttribute('aria-live', 'polite')
    expect(loader).toHaveAttribute('aria-label', 'Loading...')
  })

  it('provides loading text for screen readers via aria-label', () => {
    render(<PageLoader />)
    const loader = screen.getByRole('status', { name: 'Loading...' })
    expect(loader).toHaveAttribute('aria-label', 'Loading...')
  })

  it('renders single element with page-loader class', () => {
    const { container } = render(<PageLoader />)
    const loader = container.querySelector('.page-loader')
    expect(loader).toBeInTheDocument()
    expect(loader?.children.length).toBe(0)
  })
})
