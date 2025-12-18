import { useState, useEffect, useCallback } from 'preact/hooks'

// Global translation state
let globalTranslations: Record<string, unknown> = {}
let globalCurrentLanguage: 'en' | 'pt-PT' = 'en'
let translationListeners: Array<() => void> = []
let translationsLoaded = false
const allTranslationsCache = new Map<string, Record<string, unknown>>()

// Translation state management
export function useTranslation() {
  const [, setTranslations] = useState<Record<string, unknown>>(globalTranslations)
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

  // Load translations from modular data files
  const loadTranslations = useCallback(async (lang: 'en' | 'pt-PT') => {
    try {
      const uiFile = `ui.json`
      const response = await fetch(`./data/${lang}/${uiFile}`)
      
      if (response.ok) {
        const data = await response.json()
        globalTranslations = data
        globalCurrentLanguage = lang
        translationsLoaded = true
        
        // Cache the translations for instant switching
        allTranslationsCache.set(lang, data)
        
        // Notify all listeners
        translationListeners.forEach(listener => listener())
      }
    } catch (error) {
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
    // Check if we have cached translations for this language
    if (allTranslationsCache.has(lang)) {
      globalTranslations = allTranslationsCache.get(lang)!
      globalCurrentLanguage = lang
      translationsLoaded = true
      
      // Notify all listeners immediately
      translationListeners.forEach(listener => listener())
    } else {
      // Fallback to loading if not cached
      globalCurrentLanguage = lang
      loadTranslations(lang)
    }
    
    localStorage.setItem('i18nextLng', lang)
  }, [loadTranslations])

  // Translation function - not using useCallback to ensure it's recreated on every render
  const t = (key: string, defaultValue?: string) => {
    const keys = key.split('.')
    let value: unknown = globalTranslations
    
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
    currentLanguage: globalCurrentLanguage,
    changeLanguage,
    isEnglish: globalCurrentLanguage === 'en',
    isPortuguese: globalCurrentLanguage === 'pt-PT',
    supportedLanguages: ['en', 'pt-PT'] as const
  }
}

// Function to preload translations before app renders
export async function preloadTranslations(lang: 'en' | 'pt-PT' = 'en'): Promise<void> {
  if (translationsLoaded && globalCurrentLanguage === lang && allTranslationsCache.has(lang)) {
    return
  }
  
  try {
    // Load both languages in parallel for instant switching
    const languages = ['en', 'pt-PT'] as const
    
    const loadPromises = languages.map(async (language) => {
      if (allTranslationsCache.has(language)) {
        return { language, data: allTranslationsCache.get(language)! }
      }
      
      const uiFile = `ui.json`
      const response = await fetch(`./data/${language}/${uiFile}`)
      
      if (response.ok) {
        const data = await response.json()
        allTranslationsCache.set(language, data)
        return { language, data }
      }
      return null
    })
    
    const results = await Promise.all(loadPromises)
    const validResults = results.filter((result): result is { language: 'en' | 'pt-PT'; data: Record<string, unknown> } => result !== null)
    
    // Set the initial language
    const initialData = validResults.find(r => r.language === lang)?.data || validResults[0]?.data
    if (initialData) {
      globalTranslations = initialData
      globalCurrentLanguage = lang
      translationsLoaded = true
      
      // Notify all listeners
      translationListeners.forEach(listener => listener())
    }
  } catch (error) {
    globalTranslations = {}
  }
}
