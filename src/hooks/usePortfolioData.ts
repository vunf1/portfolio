/* eslint-disable no-console */
import { useState, useEffect, useCallback } from 'preact/hooks'
import type { PortfolioData, UsePortfolioDataReturn } from '../types'

type SupportedLanguage = 'en' | 'pt-PT'
type LoadedSectionsByLanguage = Record<SupportedLanguage, Set<string>>

// Cache for preloaded data (shared across hook instances)
export const dataCache = new Map<SupportedLanguage, Map<string, Record<string, unknown>>>()

// Track in-flight section fetches to deduplicate concurrent requests
const sectionFetchPromises = new Map<string, Promise<void>>()

const CRITICAL_SECTIONS = ['personal', 'social', 'experience', 'education', 'skills', 'meta', 'ui']
const NON_CRITICAL_SECTIONS = ['projects', 'certifications', 'interests', 'awards', 'testimonials']
const ALL_SECTIONS = [...CRITICAL_SECTIONS, ...NON_CRITICAL_SECTIONS]

const criticalPrefetched: Record<SupportedLanguage, boolean> = { en: false, 'pt-PT': false }
const nonCriticalPrefetched: Record<SupportedLanguage, boolean> = { en: false, 'pt-PT': false }

function getDataPath(language: SupportedLanguage, section: string): string {
  return `./data/${language}/${section}.json`
}

async function loadJsonFile<T>(path: string): Promise<T> {
  const response = await fetch(path)

  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

async function ensureSectionLoaded(
  language: SupportedLanguage,
  section: string,
  languageData: Map<string, Record<string, unknown>>
): Promise<void> {
  if (languageData.has(section)) {
    return
  }

  const cacheKey = `${language}:${section}`
  let fetchPromise = sectionFetchPromises.get(cacheKey)

  if (!fetchPromise) {
    fetchPromise = (async () => {
      try {
        const dataPath = getDataPath(language, section)
        const data = await loadJsonFile<Record<string, unknown>>(dataPath)
        languageData.set(section, data)
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn(`Failed to load ${section} for ${language}:`, error)
        }
        if (NON_CRITICAL_SECTIONS.includes(section)) {
          languageData.set(section, [] as unknown as Record<string, unknown>)
        } else {
          throw error
        }
      } finally {
        sectionFetchPromises.delete(cacheKey)
      }
    })()
    sectionFetchPromises.set(cacheKey, fetchPromise)
  }

  await fetchPromise
}

async function loadLanguageSections(
  language: SupportedLanguage,
  sections: string[] = ALL_SECTIONS
): Promise<Map<string, Record<string, unknown>>> {
  let languageData = dataCache.get(language)

  if (!languageData) {
    languageData = new Map<string, Record<string, unknown>>()
    dataCache.set(language, languageData)
  }

  const sectionsToLoad = sections.filter(section => !languageData!.has(section))
  await Promise.all(sectionsToLoad.map(section => ensureSectionLoaded(language, section, languageData!)))

  return languageData
}

interface IdleDeadline {
  didTimeout: boolean
  timeRemaining: () => number
}

type IdleRequestCallback = (deadline: IdleDeadline) => void

interface IdleRequestOptions {
  timeout?: number
}

function scheduleIdleLoad(language: SupportedLanguage, sections: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    const execute = () => {
      loadLanguageSections(language, sections)
        .then(() => resolve(true))
        .catch(error => {
          if (import.meta.env.DEV) {
            console.warn(`Prefetch failed for ${language}:`, error)
          }
          resolve(false)
        })
    }

    if (typeof window === 'undefined') {
      execute()
      return
    }

    const idleWindow = window as typeof window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
    }
    
    if ('requestIdleCallback' in window && idleWindow.requestIdleCallback) {
      idleWindow.requestIdleCallback(() => execute(), { timeout: 5000 })
    } else {
      window.setTimeout(() => execute(), 200)
    }
  })
}

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

function createCriticalData(sections: Map<string, Record<string, unknown>>): PortfolioData {
  const portfolio = createPortfolioData(sections)

  return {
    ...portfolio,
    projects: Array.isArray(portfolio.projects) ? portfolio.projects.slice(0, 2) : [],
    certifications: Array.isArray(portfolio.certifications) ? portfolio.certifications.slice(0, 1) : [],
    interests: Array.isArray(portfolio.interests) ? portfolio.interests.slice(0, 3) : [],
    awards: Array.isArray(portfolio.awards) ? portfolio.awards.slice(0, 1) : [],
    testimonials: Array.isArray(portfolio.testimonials) ? portfolio.testimonials.slice(0, 1) : []
  }
}

export function usePortfolioData(currentLanguage: SupportedLanguage = 'en'): UsePortfolioDataReturn {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [loadedSectionsByLanguage, setLoadedSectionsByLanguage] = useState<LoadedSectionsByLanguage>({
    en: new Set<string>(),
    'pt-PT': new Set<string>()
  })

  const markSectionsLoaded = useCallback((language: SupportedLanguage, sections: string[]) => {
    setLoadedSectionsByLanguage(prev => {
      const nextSet = new Set(prev[language])
      let changed = false

      sections.forEach(section => {
        if (!nextSet.has(section)) {
          nextSet.add(section)
          changed = true
        }
      })

      if (!changed) {
        return prev
      }

      return {
        ...prev,
        [language]: nextSet
      }
    })
  }, [])

  useEffect(() => {
    let cancelled = false

    const ensureCriticalSections = async () => {
      setError(null)
      const cachedData = dataCache.get(currentLanguage)
      const missingCritical = CRITICAL_SECTIONS.filter(section => !(cachedData?.has(section)))

      if (missingCritical.length === 0 && cachedData) {
        const criticalData = createCriticalData(cachedData)
        
        // Validate critical data before setting it
        if (!criticalData || !criticalData.personal || !criticalData.meta || !criticalData.social) {
          // If cached data is invalid, reload it
          setLoading(true)
        } else {
          setPortfolioData(criticalData)
          markSectionsLoaded(currentLanguage, CRITICAL_SECTIONS)
          setLoading(false)
          criticalPrefetched[currentLanguage] = true
          return
        }
      }

      setLoading(true)

      try {
        const languageData = await loadLanguageSections(currentLanguage, CRITICAL_SECTIONS)
        if (cancelled) {
          return
        }

        const criticalData = createCriticalData(languageData)
        
        // Validate critical data before setting it
        if (!criticalData || !criticalData.personal || !criticalData.meta || !criticalData.social) {
          const missingFields = []
          if (!criticalData) {
            missingFields.push('criticalData')
          }
          if (!criticalData?.personal) {
            missingFields.push('personal')
          }
          if (!criticalData?.meta) {
            missingFields.push('meta')
          }
          if (!criticalData?.social) {
            missingFields.push('social')
          }
          
          const errorMsg = `Missing critical portfolio data fields: ${missingFields.join(', ')}`
          // Always log errors for debugging
          console.error('Portfolio data validation failed:', errorMsg, criticalData)
          throw new Error(errorMsg)
        }
        
        setPortfolioData(criticalData)
        markSectionsLoaded(currentLanguage, CRITICAL_SECTIONS)
        criticalPrefetched[currentLanguage] = true
      } catch (err) {
        if (cancelled) {
          return
        }

        const normalizedError = err instanceof Error ? err : new Error('Unknown error occurred')
        setError(normalizedError)
        // Always log errors for debugging (even in production)
        console.error('Error loading portfolio data:', normalizedError)
        if (normalizedError.stack) {
          console.error('Error stack:', normalizedError.stack)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    ensureCriticalSections()

    return () => {
      cancelled = true
    }
  }, [currentLanguage, markSectionsLoaded])

  useEffect(() => {
    if (loading || !portfolioData) {
      return
    }

    let cancelled = false

    const runPrefetches = async () => {
      const secondaryLanguage: SupportedLanguage = currentLanguage === 'en' ? 'pt-PT' : 'en'

      if (!nonCriticalPrefetched[currentLanguage]) {
        const success = await scheduleIdleLoad(currentLanguage, NON_CRITICAL_SECTIONS)
        if (!success) {
          nonCriticalPrefetched[currentLanguage] = false
        } else {
          nonCriticalPrefetched[currentLanguage] = true
          if (!cancelled) {
            markSectionsLoaded(currentLanguage, NON_CRITICAL_SECTIONS)
          }
        }
      }

      if (!criticalPrefetched[secondaryLanguage]) {
        const success = await scheduleIdleLoad(secondaryLanguage, CRITICAL_SECTIONS)
        if (!success) {
          criticalPrefetched[secondaryLanguage] = false
        } else {
          criticalPrefetched[secondaryLanguage] = true
          if (!cancelled) {
            markSectionsLoaded(secondaryLanguage, CRITICAL_SECTIONS)
          }
        }
      }
    }

    void runPrefetches()

    return () => {
      cancelled = true
    }
  }, [currentLanguage, loading, markSectionsLoaded, portfolioData])

  const updateSectionFromCache = useCallback((language: SupportedLanguage, section: string) => {
    const languageData = dataCache.get(language)
    if (!languageData) {
      return
    }

    setPortfolioData(prev => {
      if (!prev) {
        return prev
      }

      const sectionData = languageData.get(section)
      if (typeof sectionData === 'undefined') {
        return prev
      }

      return {
        ...prev,
        [section]: sectionData
      }
    })
  }, [])

  const loadSection = useCallback(async (section: string) => {
    const language = currentLanguage
    if (loadedSectionsByLanguage[language]?.has(section)) {
      return
    }

    try {
      await loadLanguageSections(language, [section])
      updateSectionFromCache(language, section)
      markSectionsLoaded(language, [section])
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn(`Failed to load ${section} section:`, err)
      }
    }
  }, [currentLanguage, loadedSectionsByLanguage, markSectionsLoaded, updateSectionFromCache])

  const loadAllSections = useCallback(async () => {
    try {
      await loadLanguageSections(currentLanguage, ALL_SECTIONS)
      const languageData = dataCache.get(currentLanguage)
      if (!languageData) {
        return
      }

      setPortfolioData(createPortfolioData(languageData))
      markSectionsLoaded(currentLanguage, ALL_SECTIONS)
      criticalPrefetched[currentLanguage] = true
      nonCriticalPrefetched[currentLanguage] = true
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('Failed to load all sections:', err)
      }
    }
  }, [currentLanguage, markSectionsLoaded])

  const isSectionLoaded = useCallback((section: string) => {
    return loadedSectionsByLanguage[currentLanguage]?.has(section) ?? false
  }, [currentLanguage, loadedSectionsByLanguage])

  const getSectionLoadingStatus = useCallback((section: string) => {
    if (isSectionLoaded(section)) {
      return 'loaded'
    }
    if (CRITICAL_SECTIONS.includes(section)) {
      return 'critical'
    }
    return 'pending'
  }, [isSectionLoaded])

  return {
    portfolioData,
    loading,
    error,
    loadSection,
    loadAllSections,
    loadedSections: Array.from(loadedSectionsByLanguage[currentLanguage] ?? []),
    isSectionLoaded,
    getSectionLoadingStatus
  }
}

export function useConsolidatedData(currentLanguage: SupportedLanguage = 'en') {
  const [data, setData] = useState<{ portfolio: PortfolioData; ui: Record<string, unknown> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const languageData = await loadLanguageSections(currentLanguage)
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

export function resetPortfolioDataCaches() {
  dataCache.clear()
  sectionFetchPromises.clear()
  criticalPrefetched.en = false
  criticalPrefetched['pt-PT'] = false
  nonCriticalPrefetched.en = false
  nonCriticalPrefetched['pt-PT'] = false
}
