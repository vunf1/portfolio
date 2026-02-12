import { Component } from 'preact'
import { useTranslation } from '../contexts/TranslationContext'
import { Icon } from './ui/Icon'
import { Button } from './ui/Button'
import type { ErrorBoundaryProps, ErrorBoundaryState } from '../types'

function ErrorBoundaryContent() {
  const { t } = useTranslation()
  return (
    <div className="error-boundary">
      <div className="error-content">
        <Icon name="exclamation-triangle" size={48} className="mb-4" />
        <h2>{t('common.somethingWentWrong')}</h2>
        <p>{t('common.errorBoundaryMessage')}</p>
        <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
          <Icon name="refresh" size={18} className="mr-2" />
          {t('common.refreshPage')}
        </Button>
      </div>
    </div>
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

  override render() {
    if (this.state.hasError) {
      return <ErrorBoundaryContent />
    }
    return this.props.children
  }
}
