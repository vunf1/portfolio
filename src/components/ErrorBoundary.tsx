import { Component } from 'preact'
import { useTranslation } from '../contexts/TranslationContext'
import type { ErrorBoundaryProps, ErrorBoundaryState } from '../types'
import { PortfolioErrorFallback } from './PortfolioErrorFallback'

/**
 * Catches synchronous render/lifecycle errors in descendants only.
 * Does not catch: errors in the parent tree, async errors in effects, or handler throws that do not rethrow during render.
 */
function ErrorBoundaryFallback({
  error,
  onReset
}: {
  error: Error | null
  onReset: () => void
}) {
  const { t } = useTranslation()
  return (
    <PortfolioErrorFallback
      variant="runtime"
      title={t('common.errorUnexpectedTitle', 'Something interrupted the experience')}
      message={t('common.errorBoundaryMessage', "We're sorry, but something unexpected happened. Please try refreshing the page.")}
      onTryAgain={onReset}
      devErrorMessage={error?.message}
      withFab
    />
  )
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static override getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error caught by boundary:', error, errorInfo)
    if (error.stack) {
      // eslint-disable-next-line no-console
      console.error('Error stack:', error.stack)
    }
  }

  private resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  override render() {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback error={this.state.error} onReset={this.resetError} />
    }
    return this.props.children
  }
}
