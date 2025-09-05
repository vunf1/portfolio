import { useState, useEffect, useCallback } from 'preact/hooks'

// Global translation state
let globalTranslations: Record<string, unknown> = {}
let globalCurrentLanguage: 'en' | 'pt-PT' = 'en'
let translationListeners: Array<() => void> = []
let translationsLoaded = false

// Translation state management
export function useTranslation() {
  const [translations, setTranslations] = useState<Record<string, unknown>>(globalTranslations)
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'pt-PT'>(globalCurrentLanguage)

  // Subscribe to global state changes
  useEffect(() => {
    const listener = () => {
      setTranslations(globalTranslations)
      setCurrentLanguage(globalCurrentLanguage)
    }
    translationListeners.push(listener)
    
    return () => {
      translationListeners = translationListeners.filter(l => l !== listener)
    }
  }, [])

  // Load translations from data files
  const loadTranslations = useCallback(async (lang: 'en' | 'pt-PT') => {
    try {
      const dataFile = lang === 'pt-PT' ? 'portfolio-pt-PT.json' : 'portfolio-en.json'
      console.log('🔄 useTranslation: Loading translations for', lang, 'from', dataFile)
      
      const response = await fetch(`/data/${dataFile}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.ui) {
          console.log('✅ useTranslation: Successfully loaded UI translations for', lang)
          globalTranslations = data.ui
          globalCurrentLanguage = lang
          translationsLoaded = true
          
          // Notify all listeners
          translationListeners.forEach(listener => listener())
        }
      } else {
        console.warn('❌ useTranslation: Failed to load translations, response not ok:', response.status)
      }
    } catch (error) {
      console.warn('❌ useTranslation: Failed to load translations:', error)
      globalTranslations = {}
    }
  }, [])

  // Initialize language from localStorage with English as default
  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng') as 'en' | 'pt-PT'
    // Always default to English, only use saved language if it exists
    const initialLang = savedLang || 'en'
    
    if (initialLang !== globalCurrentLanguage) {
      globalCurrentLanguage = initialLang
      translationListeners.forEach(listener => listener())
    }
    
    // Load translations immediately if not already loaded
    if (!translationsLoaded) {
      loadTranslations(globalCurrentLanguage)
    }
  }, [])

  // Load translations when language changes
  useEffect(() => {
    if (currentLanguage !== globalCurrentLanguage) {
      loadTranslations(currentLanguage)
    }
  }, [currentLanguage, loadTranslations])

  const changeLanguage = useCallback((lang: 'en' | 'pt-PT') => {
    console.log('🔄 useTranslation: Changing language from', globalCurrentLanguage, 'to', lang)
    globalCurrentLanguage = lang
    localStorage.setItem('i18nextLng', lang)
    loadTranslations(lang)
  }, [loadTranslations])

  // Translation function
  const t = useCallback((key: string, defaultValue?: string) => {
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

// Function to preload translations before app renders
export async function preloadTranslations(lang: 'en' | 'pt-PT' = 'en'): Promise<void> {
  if (translationsLoaded && globalCurrentLanguage === lang) {
    return
  }
  
  try {
    const dataFile = lang === 'pt-PT' ? 'portfolio-pt-PT.json' : 'portfolio-en.json'
    console.log('🔄 preloadTranslations: Loading translations for', lang, 'from', dataFile)
    
    const response = await fetch(`/data/${dataFile}`)
    
    if (response.ok) {
      const data = await response.json()
      if (data.ui) {
        console.log('✅ preloadTranslations: Successfully loaded UI translations for', lang)
        globalTranslations = data.ui
        globalCurrentLanguage = lang
        translationsLoaded = true
        
        // Notify all listeners
        translationListeners.forEach(listener => listener())
      }
    } else {
      console.warn('❌ preloadTranslations: Failed to load translations, response not ok:', response.status)
    }
  } catch (error) {
    console.warn('❌ preloadTranslations: Failed to load translations:', error)
    globalTranslations = {}
  }
}
