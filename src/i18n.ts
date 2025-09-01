import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import consolidated data files
import enData from './data/portfolio-en.json'
import ptPTData from './data/portfolio-pt-PT.json'

const resources = {
  en: {
    translation: enData.ui
  },
  'pt-PT': {
    translation: ptPTData.ui
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

export default i18n
