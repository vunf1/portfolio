import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Initialize with empty resources, will be loaded dynamically
const resources = {
  en: {
    translation: {}
  },
  'pt-PT': {
    translation: {}
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en', // Set default language to English
    debug: false, // Set to true for development debugging
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    
    supportedLngs: ['en', 'pt-PT'],
    ns: ['translation'],
    defaultNS: 'translation'
  })

// Function to dynamically load translations
export async function loadTranslations(language: string) {
  try {
    const dataFile = language === 'pt-PT' ? 'portfolio-pt-PT.json' : 'portfolio-en.json'
    const response = await fetch(`./data/${dataFile}`)
    
    if (!response.ok) {
      throw new Error(`Failed to load ${language} translations: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.ui) {
      i18n.addResourceBundle(language, 'translation', data.ui, true, true)
      i18n.changeLanguage(language)
    }
  } catch (error) {
    // Silently handle translation loading errors
    // In production, you might want to log this to an error reporting service
  }
}

// Load initial translations
loadTranslations('en')

export default i18n
