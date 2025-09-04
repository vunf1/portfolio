import { useState, useEffect, useCallback } from 'preact/hooks'

export function useI18n() {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'pt-PT'>('en')
  const [translations, setTranslations] = useState<Record<string, unknown>>({})

  // Load translations from data files
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const dataFile = currentLanguage === 'pt-PT' ? 'portfolio-pt-PT.json' : 'portfolio-en.json'
        const response = await fetch(`/data/${dataFile}`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.ui) {
            setTranslations(data.ui)
          }
        }
      } catch (error) {
        console.warn('Failed to load translations:', error)
        // Fallback to empty translations
        setTranslations({})
      }
    }

    loadTranslations()
  }, [currentLanguage])

  // Initialize language from localStorage or browser
  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng') as 'en' | 'pt-PT'
    const browserLang = navigator.language.startsWith('pt') ? 'pt-PT' : 'en'
    const initialLang = savedLang || browserLang || 'en'
    setCurrentLanguage(initialLang)
  }, [])

  const changeLanguage = useCallback((lang: 'en' | 'pt-PT') => {
    setCurrentLanguage(lang)
    localStorage.setItem('i18nextLng', lang)
  }, [])

  // Simple translation function
  const t = useCallback((key: string, defaultValue?: string) => {
    const keys = key.split('.')
    let value = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return defaultValue || key
      }
    }
    
    return value || defaultValue || key
  }, [translations])

  return {
    t,
    currentLanguage,
    changeLanguage,
    isEnglish: currentLanguage === 'en',
    isPortuguese: currentLanguage === 'pt-PT',
    supportedLanguages: ['en', 'pt-PT'] as const
  }
}
