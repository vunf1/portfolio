import { useState, useEffect, useCallback } from 'preact/hooks'
import { getInitialLanguage } from '../lib/locale'
import { getDataUrl } from '../utils/getDataUrl'

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
      const response = await fetch(getDataUrl(lang, uiFile))
      
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

  // When preload has not run (e.g. tests), sync initial language from getInitialLanguage() and load
  useEffect(() => {
    if (!translationsLoaded) {
      const initialLang = getInitialLanguage()
      if (globalCurrentLanguage !== initialLang) {
        globalCurrentLanguage = initialLang
        translationListeners.forEach(listener => listener())
      }
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

  // Translation function - supports dot-notation, fallback, and {{var}} interpolation
  const t = (
    key: string,
    defaultValue?: string,
    vars?: Record<string, string | undefined>
  ): string => {
    const keyParts = key.split('.')
    let value: unknown = globalTranslations

    for (const k of keyParts) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        value = defaultValue || key
        break
      }
    }

    let result = (typeof value === 'string' ? value : defaultValue) || key

    if (vars && Object.keys(vars).length > 0) {
      for (const [varKey, varValue] of Object.entries(vars)) {
        result = result.replace(
          new RegExp(`\\{\\{${varKey}\\}\\}`, 'g'),
          String(varValue ?? '')
        )
      }
    }

    return result
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
      const response = await fetch(getDataUrl(language, uiFile))
      
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
