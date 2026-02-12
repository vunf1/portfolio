import { render } from 'preact'
import { App } from './App'
import { preloadTranslations } from './contexts/TranslationContext'
import { getInitialLanguage } from './lib/locale'
import './index.css'

async function initializeApp() {
  try {
    const initialLang = getInitialLanguage()
    document.documentElement.setAttribute('lang', initialLang === 'pt-PT' ? 'pt-PT' : 'en')
    await preloadTranslations(initialLang)

    const appElement = document.getElementById('app')
    if (appElement) {
      render(<App />, appElement)
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
      render(<App />, appElement)
    }
  }
}

initializeApp()
