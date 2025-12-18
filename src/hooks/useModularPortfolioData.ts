/* eslint-disable no-console */
import { useState, useEffect, useCallback } from 'preact/hooks'
import type { PortfolioData, UsePortfolioDataReturn } from '../types'

// Cache for preloaded data
const dataCache = new Map<string, Map<string, Record<string, unknown>>>()

// Define critical vs. non-critical sections
const CRITICAL_SECTIONS = ['personal', 'social', 'experience', 'education', 'skills', 'meta']
const NON_CRITICAL_SECTIONS = ['projects', 'certifications', 'interests', 'awards', 'testimonials']

// Helper function to get the correct data path
function getDataPath(language: string, section: string): string {
  // Use relative path to work with GitHub Pages base URL
  return `./data/${language}/${section}.json`
}

// Helper function to load a single JSON file
async function loadJsonFile<T>(path: string): Promise<T> {
  const response = await fetch(path)
  
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status} ${response.statusText}`)
  }
  
  return await response.json()
}

// Helper function to load all sections for a language
async function loadLanguageData(language: string): Promise<Map<string, Record<string, unknown>>> {
  if (dataCache.has(language)) {
    return dataCache.get(language)!
  }

  const languageData = new Map<string, Record<string, unknown>>()
  
  // Load all sections in parallel
  const loadPromises = [...CRITICAL_SECTIONS, ...NON_CRITICAL_SECTIONS].map(async (section) => {
    try {
      const dataPath = getDataPath(language, section)
      const data = await loadJsonFile(dataPath)
      languageData.set(section, data as Record<string, unknown>)
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn(`Failed to load ${section} for ${language}:`, error)
      }
      // Set empty data for failed sections
      if (section === 'projects' || section === 'certifications' || section === 'interests' || section === 'awards' || section === 'testimonials') {
        languageData.set(section, [] as unknown as Record<string, unknown>)
      } else {
        throw error // Critical sections must load
      }
    }
  })

  await Promise.all(loadPromises)
  
  // Cache the data
  dataCache.set(language, languageData)
  return languageData
}

// Helper function to create portfolio data from loaded sections
function createPortfolioData(sections: Map<string, Record<string, unknown>>): PortfolioData {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    personal: sections.get('personal') as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    social: sections.get('social') as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    experience: sections.get('experience') as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    education: sections.get('education') as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    skills: sections.get('skills') as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projects: (sections.get('projects') as any) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    certifications: (sections.get('certifications') as any) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interests: (sections.get('interests') as any) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    awards: (sections.get('awards') as any) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    testimonials: (sections.get('testimonials') as any) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta: sections.get('meta') as any
  }
}

// Helper function to create critical data with only essential sections
function createCriticalData(sections: Map<string, Record<string, unknown>>): PortfolioData {
  const portfolio = createPortfolioData(sections)
  
  return {
    ...portfolio,
    // Limit non-critical sections for initial load
    projects: portfolio.projects?.slice(0, 2) || [], // Only first 2 projects
    certifications: portfolio.certifications?.slice(0, 1) || [], // Only first certification
    interests: portfolio.interests?.slice(0, 3) || [], // Only first 3 interests
    awards: portfolio.awards?.slice(0, 1) || [], // Only first award
    testimonials: portfolio.testimonials?.slice(0, 1) || [] // Only first testimonial
  }
}

export function useModularPortfolioData(currentLanguage: 'en' | 'pt-PT' = 'en'): UsePortfolioDataReturn {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set(CRITICAL_SECTIONS))

  // Load critical data first
  useEffect(() => {
    const loadCriticalData = async () => {
      const languages = ['en', 'pt-PT']
      
      try {
        setLoading(true)
        setError(null)
        
        // Load all language datasets in parallel
        const loadPromises = languages.map(async (lang) => {
          try {
            await loadLanguageData(lang)
          } catch (error) {
            if (import.meta.env.DEV) {
              // eslint-disable-next-line no-console
              console.error(`Failed to load ${lang} data:`, error)
            }
            throw error
          }
        })
        
        await Promise.all(loadPromises)
        
        // Set initial data with only critical sections
        const languageData = dataCache.get(currentLanguage) || dataCache.get('en')
        if (languageData) {
          const criticalData = createCriticalData(languageData)
          setPortfolioData(criticalData)
        } else if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('No initial data available after loading')
        }
        
      } catch (err) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('Error loading portfolio data:', err)
        }
        setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }

    loadCriticalData()
  }, []) // Only run once on mount

  // Switch language instantly using cached data
  useEffect(() => {
    if (dataCache.has(currentLanguage)) {
      const languageData = dataCache.get(currentLanguage)!
      const criticalData = createCriticalData(languageData)
      setPortfolioData(criticalData)
    }
  }, [currentLanguage]) // Switch instantly when language changes

  // Load additional sections on demand
  const loadSection = useCallback(async (section: string) => {
    if (loadedSections.has(section) || !dataCache.has(currentLanguage)) {
      return
    }

    try {
      const languageData = dataCache.get(currentLanguage)!
      
      // Simulate progressive loading for better UX
      await new Promise(resolve => setTimeout(resolve, 100))
      
      setPortfolioData(prev => {
        if (!prev) {
          return prev
        }
        
        return {
          ...prev,
          [section]: languageData.get(section)
        }
      })
      
      setLoadedSections(prev => new Set([...prev, section]))
      
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn(`Failed to load ${section} section:`, error)
      }
    }
  }, [currentLanguage, loadedSections])

  // Load all sections at once (for users who want everything)
  const loadAllSections = useCallback(async () => {
    if (!dataCache.has(currentLanguage)) {
      return
    }

    try {
      const languageData = dataCache.get(currentLanguage)!
      const fullData = createPortfolioData(languageData)
      setPortfolioData(fullData)
      setLoadedSections(new Set([...CRITICAL_SECTIONS, ...NON_CRITICAL_SECTIONS]))
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('Failed to load all sections:', error)
      }
    }
  }, [currentLanguage])

  // Check if section is loaded
  const isSectionLoaded = useCallback((section: string) => {
    return loadedSections.has(section)
  }, [loadedSections])

  // Get loading status for specific section
  const getSectionLoadingStatus = useCallback((section: string) => {
    if (loadedSections.has(section)) {
      return 'loaded'
    }
    if (CRITICAL_SECTIONS.includes(section)) {
      return 'critical'
    }
    return 'pending'
  }, [loadedSections])

  return { 
    portfolioData, 
    loading, 
    error, 
    loadSection, 
    loadAllSections,
    loadedSections: Array.from(loadedSections),
    isSectionLoaded,
    getSectionLoadingStatus
  }
}

// New hook for accessing both portfolio data and UI translations
export function useModularConsolidatedData(currentLanguage: 'en' | 'pt-PT' = 'en') {
  const [data, setData] = useState<{ portfolio: PortfolioData; ui: Record<string, unknown> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const languageData = await loadLanguageData(currentLanguage)
        const portfolio = createPortfolioData(languageData)
        const ui = languageData.get('ui')
        
        if (!portfolio || !ui) {
          throw new Error(`${currentLanguage} data is missing required sections`)
        }
        
        setData({ portfolio, ui })
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentLanguage])

  return { data, loading, error }
}
