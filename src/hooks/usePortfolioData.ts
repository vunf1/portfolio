import { useState, useEffect } from 'preact/hooks'
import { useI18n } from './useI18n'
import type { PortfolioData, UsePortfolioDataReturn } from '../types'

// Cache for preloaded data
const dataCache = new Map<string, { portfolio: PortfolioData; ui: Record<string, unknown> }>()

export function usePortfolioData(): UsePortfolioDataReturn {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { currentLanguage } = useI18n()

  // Preload both language datasets
  useEffect(() => {
    const preloadData = async () => {
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
          const response = await fetch(`/data/${dataFile}`)
          
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
        
        // Set initial data
        const initialData = dataCache.get(currentLanguage) || dataCache.get('en')
        if (initialData) {
          setPortfolioData(initialData.portfolio)
        }
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }

    preloadData()
  }, []) // Only run once on mount

  // Switch language instantly using cached data
  useEffect(() => {
    if (dataCache.has(currentLanguage)) {
      setPortfolioData(dataCache.get(currentLanguage)!.portfolio)
    }
  }, [currentLanguage]) // Switch instantly when language changes

  return { portfolioData, loading, error }
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
        const response = await fetch(`/data/${dataFile}`)
        
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




