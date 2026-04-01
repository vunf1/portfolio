import { Component, type ComponentChildren, render } from 'preact'
import Router, { Route } from 'preact-router'
import { App } from './App'
import { preloadTranslations } from './contexts/TranslationContext'
import { getInitialLanguage } from './lib/locale'
import { ROUTE_MATCH_ALL, isPathnameInvalid } from './config/routes'
import { NotFoundView } from './components/NotFoundView'
import { createBrowserHistory } from './utils/browserHistory'
import './index.css'

/** Tier-2 fallback: no app hooks, Button, or Icon — survives failures in shared UI. */
class RootErrorBoundary extends Component<{ children: ComponentChildren }, { hasError: boolean }> {
  constructor(props: { children: ComponentChildren }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  override componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error('Root error boundary:', error)
  }

  override render() {
    if (this.state.hasError) {
      const lang = typeof document !== 'undefined' ? document.documentElement.lang : ''
      const pt = lang.toLowerCase().startsWith('pt')
      return (
        <div
          style={{
            fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
            padding: '2rem',
            maxWidth: '28rem',
            margin: '10vh auto',
            lineHeight: 1.5
          }}
        >
          <h1 style={{ fontSize: '1.25rem', margin: '0 0 0.75rem' }}>
            {pt ? 'Algo correu mal' : 'Something went wrong'}
          </h1>
          <p style={{ margin: 0, color: '#555', fontSize: '0.9375rem' }}>
            {pt ? 'Atualize a página para continuar.' : 'Please refresh the page to continue.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1.25rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
              background: '#f5f5f5'
            }}
          >
            {pt ? 'Atualizar página' : 'Refresh page'}
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function handleRouteChange(event: { url: string }) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[Router]', event.url)
  }
}

async function initializeApp() {
  if (isPathnameInvalid()) {
    const initialLang = getInitialLanguage()
    document.documentElement.setAttribute('lang', initialLang === 'pt-PT' ? 'pt-PT' : 'en')
    await preloadTranslations(initialLang)
    const appElement = document.getElementById('app')
    if (appElement) {render(<NotFoundView />, appElement)}
    return
  }

  try {
    const initialLang = getInitialLanguage()
    document.documentElement.setAttribute('lang', initialLang === 'pt-PT' ? 'pt-PT' : 'en')
    await preloadTranslations(initialLang)

    const appElement = document.getElementById('app')
    if (appElement) {
      render(
        <RootErrorBoundary>
          <Router history={createBrowserHistory()} onChange={handleRouteChange}>
            <Route path={ROUTE_MATCH_ALL} component={App} />
          </Router>
        </RootErrorBoundary>,
        appElement
      )
    } else if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('App element not found')
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize app:', error)
    if (error instanceof Error && error.stack) {
      // eslint-disable-next-line no-console
      console.error('Error stack:', error.stack)
    }
    const appElement = document.getElementById('app')
    if (appElement) {
      render(
        <RootErrorBoundary>
          <Router history={createBrowserHistory()} onChange={handleRouteChange}>
            <Route path={ROUTE_MATCH_ALL} component={App} />
          </Router>
        </RootErrorBoundary>,
        appElement
      )
    }
  }
}

initializeApp()
