import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/preact'
import { PortfolioErrorFallback } from '../PortfolioErrorFallback'

vi.mock('../FloatingActionButton', () => ({
  FloatingActionButton: () => <div data-testid="fab-mock" />
}))

vi.mock('../../contexts/TranslationContext', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => {
      const map: Record<string, string> = {
        'common.tryAgain': 'Try again',
        'common.refreshPage': 'Refresh Page',
        'common.errorDevDetails': 'Dev details'
      }
      return map[key] ?? defaultValue ?? key
    },
    currentLanguage: 'en' as const,
    changeLanguage: vi.fn(),
    isEnglish: true,
    isPortuguese: false,
    supportedLanguages: ['en', 'pt-PT'] as const
  }),
  preloadTranslations: vi.fn().mockResolvedValue(undefined)
}))

describe('PortfolioErrorFallback', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes assertive live region and focuses Try again when provided', async () => {
    const onTryAgain = vi.fn()
    render(
      <PortfolioErrorFallback
        variant="data"
        title="Data title"
        message="Data message"
        onTryAgain={onTryAgain}
        withFab={false}
      />
    )

    expect(screen.getByRole('main')).toBeInTheDocument()
    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('aria-live', 'assertive')
    expect(alert).toHaveTextContent('Data message')

    const tryAgain = screen.getByRole('button', { name: 'Try again' })
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(tryAgain)
    })
  })

  it('focuses Refresh when Try again is omitted', async () => {
    render(
      <PortfolioErrorFallback
        variant="runtime"
        title="Runtime title"
        message="Runtime message"
        withFab={false}
      />
    )

    const refresh = screen.getByRole('button', { name: 'Refresh Page' })
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(refresh)
    })
  })
})
