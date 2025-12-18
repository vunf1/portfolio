import { render } from 'preact'
import { App } from './App'
import { preloadTranslations } from './contexts/TranslationContext'
import './index.css'

async function initializeApp() {
  try {
    // Determine initial language - always default to English
    const savedLang = localStorage.getItem('i18nextLng') as 'en' | 'pt-PT'
    const initialLang = savedLang || 'en'
    
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
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Failed to initialize app:', error)
    }
    
    // Fallback: render app anyway
    const appElement = document.getElementById('app')
    if (appElement) {
      render(<App />, appElement)
    }
  }
}

initializeApp()




