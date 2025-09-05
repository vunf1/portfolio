import { useState, useEffect, useCallback } from 'preact/hooks'

export function useI18n() {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'pt-PT'>('en')
  const [translations, setTranslations] = useState<Record<string, unknown>>({})

  // Load translations from data files
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const dataFile = currentLanguage === 'pt-PT' ? 'portfolio-pt-PT.json' : 'portfolio-en.json'
        console.log('🔄 useI18n: Loading translations for', currentLanguage, 'from', dataFile)
        const response = await fetch(`/data/${dataFile}`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.ui) {
            console.log('✅ useI18n: Successfully loaded UI translations for', currentLanguage)
            setTranslations(data.ui)
          }
        } else {
          console.warn('❌ useI18n: Failed to load translations, response not ok:', response.status)
        }
      } catch (error) {
        console.warn('❌ useI18n: Failed to load translations:', error)
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
    console.log('🔄 useI18n: Changing language from', currentLanguage, 'to', lang)
    setCurrentLanguage(lang)
    localStorage.setItem('i18nextLng', lang)
  }, [currentLanguage])

  // Simple translation function - not using useCallback to ensure it's recreated on every render
  const t = (key: string, defaultValue?: string) => {
    const keys = key.split('.')
    let value: unknown = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        return defaultValue || key
      }
    }
    
    return (value as string) || defaultValue || key
  }

  return {
    t,
    currentLanguage,
    changeLanguage,
    isEnglish: currentLanguage === 'en',
    isPortuguese: currentLanguage === 'pt-PT',
    supportedLanguages: ['en', 'pt-PT'] as const
  }
}
