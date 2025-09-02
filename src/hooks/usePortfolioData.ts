import { useState, useEffect, useCallback } from 'preact/hooks'
import { useI18n } from './useI18n'
import type { PortfolioData, UsePortfolioDataReturn } from '../types'

// Cache for preloaded data
const dataCache = new Map<string, { portfolio: PortfolioData; ui: Record<string, unknown> }>()

// Define critical vs. non-critical sections
const CRITICAL_SECTIONS = ['hero', 'about', 'experience', 'education', 'skills']
const NON_CRITICAL_SECTIONS = ['projects', 'certifications', 'interests', 'awards', 'testimonials']

export function usePortfolioData(): UsePortfolioDataReturn {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set(CRITICAL_SECTIONS))
  const { currentLanguage } = useI18n()

  // Load critical data first
  useEffect(() => {
    const loadCriticalData = async () => {
      const languages = ['en', 'pt-PT']
      
      try {
        setLoading(true)
        setError(null)
        
        // Load all language datasets in parallel
        const loadPromises = languages.map(async (lang) => {
          if (dataCache.has(lang)) {
            return dataCache.get(lang)!
          }
          
          const dataFile = lang === 'pt-PT' ? 'portfolio-pt-PT.json' : 'portfolio-en.json'
          const response = await fetch(`./data/${dataFile}`)
          
          if (!response.ok) {
            throw new Error(`Failed to load ${lang} data: ${response.status} ${response.statusText}`)
          }
          
          const data = await response.json()
          
          // Validate data structure
          if (!data.portfolio || !data.ui) {
            throw new Error(`${lang} portfolio data is missing required sections`)
          }
          
          // Cache the data
          dataCache.set(lang, data)
          return data
        })
        
        await Promise.all(loadPromises)
        
        // Set initial data with only critical sections
        const initialData = dataCache.get(currentLanguage) || dataCache.get('en')
        if (initialData) {
          const criticalData = createCriticalData(initialData.portfolio)
          setPortfolioData(criticalData)
        }
        
      } catch (err) {
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
      const data = dataCache.get(currentLanguage)!
      const criticalData = createCriticalData(data.portfolio)
      setPortfolioData(criticalData)
    }
  }, [currentLanguage]) // Switch instantly when language changes

  // Load additional sections on demand
  const loadSection = useCallback(async (section: string) => {
    if (loadedSections.has(section) || !dataCache.has(currentLanguage)) {
      return
    }

    try {
      const data = dataCache.get(currentLanguage)!
      
      // Simulate progressive loading for better UX
      await new Promise(resolve => setTimeout(resolve, 100))
      
      setPortfolioData(prev => {
        if (!prev) return prev
        
        return {
          ...prev,
          [section]: data.portfolio[section as keyof PortfolioData]
        }
      })
      
      setLoadedSections(prev => new Set([...prev, section]))
      
    } catch (error) {
      console.warn(`Failed to load ${section} section:`, error)
    }
  }, [currentLanguage, loadedSections])

  // Load all sections at once (for users who want everything)
  const loadAllSections = useCallback(async () => {
    if (!dataCache.has(currentLanguage)) {
      return
    }

    try {
      const data = dataCache.get(currentLanguage)!
      setPortfolioData(data.portfolio)
      setLoadedSections(new Set([...CRITICAL_SECTIONS, ...NON_CRITICAL_SECTIONS]))
    } catch (error) {
      console.warn('Failed to load all sections:', error)
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

// Helper function to create critical data with only essential sections
function createCriticalData(portfolio: PortfolioData): PortfolioData {
  return {
    ...portfolio,
    // Include critical sections
    personal: portfolio.personal,
    social: portfolio.social,
    experience: portfolio.experience,
    education: portfolio.education,
    skills: portfolio.skills,
    // Limit non-critical sections for initial load
    projects: portfolio.projects?.slice(0, 2), // Only first 2 projects
    certifications: portfolio.certifications?.slice(0, 1), // Only first certification
    interests: portfolio.interests?.slice(0, 3), // Only first 3 interests
    awards: portfolio.awards?.slice(0, 1), // Only first award
    testimonials: portfolio.testimonials?.slice(0, 1) // Only first testimonial
  }
}

// New hook for accessing both portfolio data and UI translations
export function useConsolidatedData() {
  const [data, setData] = useState<{ portfolio: PortfolioData; ui: Record<string, unknown> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { currentLanguage } = useI18n()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const dataFile = currentLanguage === 'pt-PT' ? 'portfolio-pt-PT.json' : 'portfolio-en.json'
        const response = await fetch(`./data/${dataFile}`)
        
        if (!response.ok) {
          throw new Error(`Failed to load ${currentLanguage} data: ${response.status} ${response.statusText}`)
        }
        
        const loadedData = await response.json()
        
        if (!loadedData.portfolio || !loadedData.ui) {
          throw new Error(`${currentLanguage} data is missing required sections`)
        }
        
        setData(loadedData)
        
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




