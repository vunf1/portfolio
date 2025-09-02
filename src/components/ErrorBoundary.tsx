import { Component } from 'preact'
import type { ErrorBoundaryProps, ErrorBoundaryState } from '../types'

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static override getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: unknown) {
    // Log error to console in development
    if (process.env['NODE_ENV'] === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <i className="fa-solid fa-exclamation-triangle fa-3x mb-4"></i>
            <h2>Something went wrong</h2>
            <p>We're sorry, but something unexpected happened. Please try refreshing the page.</p>
            <button 
              className="btn-premium mt-4"
              onClick={() => window.location.reload()}
            >
              <i className="fa-solid fa-refresh me-2"></i>
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
