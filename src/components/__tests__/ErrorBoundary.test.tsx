import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/preact'
import { ErrorBoundary } from '../ErrorBoundary'

vi.mock('../FloatingActionButton', () => ({
  FloatingActionButton: () => <div data-testid="fab-mock" />
}))

vi.mock('../../contexts/TranslationContext', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => {
      const map: Record<string, string> = {
        'common.errorUnexpectedTitle': 'Unexpected title',
        'common.errorBoundaryMessage': 'Boundary message body',
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

let flakyRenderCount = 0
function FlakyChild() {
  flakyRenderCount += 1
  if (flakyRenderCount === 1) {
    throw new Error('boom')
  }
  return <div>recovered</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    flakyRenderCount = 0
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders fallback with alert and recovers after Try again', async () => {
    render(
      <ErrorBoundary>
        <FlakyChild />
      </ErrorBoundary>
    )

    expect(screen.getByRole('heading', { name: 'Unexpected title' })).toBeInTheDocument()
    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('aria-live', 'assertive')
    expect(alert).toHaveTextContent('Boundary message body')

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    await waitFor(() => {
      expect(screen.getByText('recovered')).toBeInTheDocument()
    })
  })
})
