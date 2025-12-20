import { render } from 'preact'
import { App } from './App'
import { preloadTranslations } from './contexts/TranslationContext'
import './index.css'

async function initializeApp() {
  try {
    // Parse language from URL parameter first, then localStorage, then default to English
    const urlParams = new URLSearchParams(window.location.search)
    const urlLang = urlParams.get('lang') as 'en' | 'pt-PT' | null
    const savedLang = localStorage.getItem('i18nextLng') as 'en' | 'pt-PT'
    
    // Priority: URL parameter > localStorage > default to English
    const initialLang = (urlLang && (urlLang === 'en' || urlLang === 'pt-PT')) 
      ? urlLang 
      : (savedLang || 'en')
    
    // Save URL language to localStorage if it was provided
    if (urlLang && (urlLang === 'en' || urlLang === 'pt-PT')) {
      localStorage.setItem('i18nextLng', urlLang)
    }
    
    // Set initial HTML lang attribute
    document.documentElement.setAttribute('lang', initialLang === 'pt-PT' ? 'pt-PT' : 'en')
    
    // Preload translations before rendering
    await preloadTranslations(initialLang)
    
    const appElement = document.getElementById('app')
    if (appElement) {
      render(<App />, appElement)
    } else if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('App element not found')
    }
  } catch (error) {
    // Always log errors for debugging (even in production)
    // eslint-disable-next-line no-console
    console.error('Failed to initialize app:', error)
    if (error instanceof Error && error.stack) {
      // eslint-disable-next-line no-console
      console.error('Error stack:', error.stack)
    }
    
    // Fallback: render app anyway
    const appElement = document.getElementById('app')
    if (appElement) {
      render(<App />, appElement)
    }
  }
}

initializeApp()




