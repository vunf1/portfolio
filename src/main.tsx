import { render } from 'preact'
import Router, { Route } from 'preact-router'
import { App } from './App'
import { preloadTranslations } from './contexts/TranslationContext'
import { getInitialLanguage } from './lib/locale'
import { ROUTE_MATCH_ALL, isPathnameInvalid } from './config/routes'
import { NotFoundView } from './components/NotFoundView'
import { createBrowserHistory } from './utils/browserHistory'
import './index.css'

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
    if (appElement) render(<NotFoundView />, appElement)
    return
  }

  try {
    const initialLang = getInitialLanguage()
    document.documentElement.setAttribute('lang', initialLang === 'pt-PT' ? 'pt-PT' : 'en')
    await preloadTranslations(initialLang)

    const appElement = document.getElementById('app')
    if (appElement) {
      render(
        <Router history={createBrowserHistory()} onChange={handleRouteChange}>
          <Route path={ROUTE_MATCH_ALL} component={App} />
        </Router>,
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
        <Router history={createBrowserHistory()} onChange={handleRouteChange}>
          <Route path={ROUTE_MATCH_ALL} component={App} />
        </Router>,
        appElement
      )
    }
  }
}

initializeApp()
