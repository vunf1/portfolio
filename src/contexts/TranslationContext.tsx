import { useState, useEffect, useCallback } from 'preact/hooks'

// Global translation state
let globalTranslations: Record<string, unknown> = {}
let globalCurrentLanguage: 'en' | 'pt-PT' = 'en'
let translationListeners: Array<() => void> = []
let translationsLoaded = false
let allTranslationsCache = new Map<string, Record<string, unknown>>()

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
          
          // Cache the translations for instant switching
          allTranslationsCache.set(lang, data.ui)
          
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
    
    // Check if we have cached translations for this language
    if (allTranslationsCache.has(lang)) {
      console.log('✅ useTranslation: Using cached translations for instant switch')
      globalTranslations = allTranslationsCache.get(lang)!
      globalCurrentLanguage = lang
      translationsLoaded = true
      
      // Notify all listeners immediately
      translationListeners.forEach(listener => listener())
    } else {
      // Fallback to loading if not cached
      console.log('⚠️ useTranslation: No cached translations, loading...')
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
    console.log('🔄 preloadTranslations: Loading all translations for instant switching')
    
    const loadPromises = languages.map(async (language) => {
      if (allTranslationsCache.has(language)) {
        console.log(`✅ preloadTranslations: Using cached translations for ${language}`)
        return { language, data: allTranslationsCache.get(language)! }
      }
      
      const dataFile = language === 'pt-PT' ? 'portfolio-pt-PT.json' : 'portfolio-en.json'
      console.log(`📥 preloadTranslations: Loading ${language} from ${dataFile}`)
      
      const response = await fetch(`/data/${dataFile}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.ui) {
          console.log(`✅ preloadTranslations: Successfully loaded ${language}`)
          allTranslationsCache.set(language, data.ui)
          return { language, data: data.ui }
        }
      } else {
        console.warn(`❌ preloadTranslations: Failed to load ${language}, response not ok:`, response.status)
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
      
      console.log('✅ preloadTranslations: All translations loaded, instant switching ready')
      
      // Notify all listeners
      translationListeners.forEach(listener => listener())
    }
  } catch (error) {
    console.warn('❌ preloadTranslations: Failed to load translations:', error)
    globalTranslations = {}
  }
}
