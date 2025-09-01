import { Component } from 'preact'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  render() {
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
