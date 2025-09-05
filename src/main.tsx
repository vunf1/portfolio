import { render } from 'preact'
import { App } from './App'
import { preloadTranslations } from './contexts/TranslationContext'
import './index.css'
import './css/premium.css'

console.log('🚀 Main.tsx starting...')

async function initializeApp() {
  try {
    // Determine initial language - always default to English
    const savedLang = localStorage.getItem('i18nextLng') as 'en' | 'pt-PT'
    const initialLang = savedLang || 'en'
    
    console.log('🔄 Preloading translations for language:', initialLang)
    
    // Preload translations before rendering
    await preloadTranslations(initialLang)
    
    console.log('✅ Translations preloaded successfully')
    
    const appElement = document.getElementById('app')
    if (appElement) {
      console.log('✅ App element found, rendering...')
      render(<App />, appElement)
      console.log('✅ App rendered successfully')
    } else {
      console.error('❌ App element not found!')
    }
  } catch (error) {
    console.error('❌ Failed to initialize app:', error)
    
    // Fallback: render app anyway
    const appElement = document.getElementById('app')
    if (appElement) {
      render(<App />, appElement)
    }
  }
}

initializeApp()




