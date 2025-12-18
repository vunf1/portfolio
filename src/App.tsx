import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'preact/compat'
import { usePortfolioData } from './hooks/usePortfolioData'
import { useTranslation } from './contexts/TranslationContext'
import { Navigation } from './components/Navigation'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SectionSkeleton } from './components/SectionSkeleton'
import { FloatingActionButton } from './components/FloatingActionButton'
import { LandingPage } from './components/landing/LandingPage'
import { preloadPortfolioChunks } from './utils/preloadPortfolioChunks'
import { initializeSEO, updateSEOOnLanguageChange } from './utils/seo'

const logWarning = (message: string, detail: unknown) => {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(message, detail)
  }
}

// Lazy load non-critical components
const Experience = lazy(() => import('./components/Experience').then(module => ({ default: module.Experience })))
const Education = lazy(() => import('./components/Education').then(module => ({ default: module.Education })))
const Skills = lazy(() => import('./components/Skills').then(module => ({ default: module.Skills })))
const Projects = lazy(() => import('./components/Projects').then(module => ({ default: module.Projects })))
const Certifications = lazy(() => import('./components/Certifications').then(module => ({ default: module.Certifications })))
const Interests = lazy(() => import('./components/Interests').then(module => ({ default: module.Interests })))
const Awards = lazy(() => import('./components/Awards').then(module => ({ default: module.Awards })))
const Testimonials = lazy(() => import('./components/Testimonials').then(module => ({ default: module.Testimonials })))

export function App() {
  const { t, currentLanguage } = useTranslation()
  const { portfolioData, loading, error, loadAllSections } = usePortfolioData(currentLanguage)
  const [activeSection, setActiveSection] = useState('experience')
  const [isLanguageTransitioning, setIsLanguageTransitioning] = useState(false)
  const [showPortfolio, setShowPortfolio] = useState(false)
  const hasWarmedPortfolio = useRef(false)


  // Initialize SEO when portfolio data is available
  useEffect(() => {
    if (portfolioData && portfolioData.personal && portfolioData.meta && portfolioData.social) {
      initializeSEO(
        currentLanguage,
        portfolioData.personal,
        portfolioData.meta.seo,
        portfolioData.social,
        portfolioData
      )
    }
  }, [portfolioData, currentLanguage])

  // Update SEO when language changes
  useEffect(() => {
    if (portfolioData && portfolioData.personal && portfolioData.meta && portfolioData.social) {
      updateSEOOnLanguageChange(
        currentLanguage,
        portfolioData.personal,
        portfolioData.meta.seo,
        portfolioData.social,
        portfolioData
      )
    }
  }, [currentLanguage, portfolioData])

  // Handle smooth language transitions
  useEffect(() => {
    const handleLanguageChange = () => {
      setIsLanguageTransitioning(true)
      setTimeout(() => {
        setIsLanguageTransitioning(false)
      }, 300) // Match CSS transition duration
    }

    // Listen for language changes
    const observer = new MutationObserver(() => {
      handleLanguageChange()
    })

    // Observe the document for language changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang']
    })

    return () => observer.disconnect()
  }, [])



  // Intersection Observer for active section tracking
  useEffect(() => {
    if (!portfolioData) {
      return
    }

    const observerOptions = {
      threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // More granular thresholds
      rootMargin: '-20% 0px -20% 0px' // Better margin for section detection
    }

    const observer = new IntersectionObserver((entries) => {
      // Get all currently visible sections with their intersection ratios
      const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => ({
          id: entry.target.id,
          ratio: entry.intersectionRatio,
          element: entry.target
        }))
        .sort((a, b) => b.ratio - a.ratio) // Sort by visibility ratio

      // If we have visible sections, select the most visible one
      if (visibleSections.length > 0) {
        const mostVisible = visibleSections[0]
        setActiveSection(mostVisible.id)
      } else {
        // If no sections are visible, find the closest one by position
        const allSections = Array.from(document.querySelectorAll('section[id]'))
        const scrollPosition = window.scrollY + window.innerHeight / 2
        
        let closestSection = null
        let closestDistance = Infinity
        
        allSections.forEach(section => {
          const rect = section.getBoundingClientRect()
          const sectionTop = rect.top + window.scrollY
          const sectionCenter = sectionTop + rect.height / 2
          
          // Calculate distance from scroll position to section center
          const distance = Math.abs(scrollPosition - sectionCenter)
          
          if (distance < closestDistance) {
            closestDistance = distance
            closestSection = section.id
          }
        })
        
        if (closestSection) {
          setActiveSection(closestSection)
        }
      }
    }, observerOptions)

    // Function to observe all sections
    const observeSections = () => {
      const sections = document.querySelectorAll('section[id]')
      sections.forEach((section) => {
        // Only observe if not already observed
        if (!section.hasAttribute('data-observed')) {
          observer.observe(section)
          section.setAttribute('data-observed', 'true')
        }
      })
    }

    // Initial observation
    observeSections()

    // Re-observe sections after a delay to catch lazy-loaded components
    const timeoutId = setTimeout(observeSections, 1000)

    // Also observe when DOM changes (for lazy-loaded components)
    const mutationObserver = new MutationObserver(() => {
      observeSections()
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Fallback scroll listener for better section detection
    const handleScroll = () => {
      const sections = Array.from(document.querySelectorAll('section[id]'))
      const scrollPosition = window.scrollY + window.innerHeight / 2
      
      let closestSection = null
      let closestDistance = Infinity
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        const sectionTop = rect.top + window.scrollY
        const sectionCenter = sectionTop + rect.height / 2
        
        // Calculate distance from scroll position to section center
        const distance = Math.abs(scrollPosition - sectionCenter)
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestSection = section.id
        }
      })
      
      if (closestSection) {
        setActiveSection(closestSection)
      }
    }

    // Throttled scroll listener
    let scrollTimeout: ReturnType<typeof setTimeout> | undefined
    const throttledScrollHandler = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      scrollTimeout = window.setTimeout(handleScroll, 100)
    }

    window.addEventListener('scroll', throttledScrollHandler, { passive: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
      clearTimeout(timeoutId)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      window.removeEventListener('scroll', throttledScrollHandler)
    }
  }, [portfolioData])

  useEffect(() => {
    if (showPortfolio) {
      void loadAllSections()
      // Scroll to top when portfolio page loads
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        // Double-check after a small delay to handle any async rendering
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'instant' })
          document.documentElement.scrollTop = 0
          document.body.scrollTop = 0
        }, 0)
      })
    }
  }, [loadAllSections, showPortfolio])

  const warmPortfolio = useCallback(() => {
    if (hasWarmedPortfolio.current) {
      return
    }

    hasWarmedPortfolio.current = true

    const triggerChunkPreload = () => {
      preloadPortfolioChunks().catch((error) => {
        logWarning('⚠️ Failed to preload portfolio UI chunks:', error)
        hasWarmedPortfolio.current = false
      })
    }

    if (typeof window !== 'undefined') {
      const idleWindow = window as typeof window & { requestIdleCallback?: (callback: () => void) => number }
      if (idleWindow.requestIdleCallback) {
        idleWindow.requestIdleCallback(() => triggerChunkPreload())
      } else {
        window.setTimeout(() => triggerChunkPreload(), 0)
      }
    } else {
      triggerChunkPreload()
    }

    loadAllSections().catch((error) => {
      logWarning('⚠️ Failed to warm portfolio data:', error)
      hasWarmedPortfolio.current = false
    })
  }, [loadAllSections])

  // Show loading state
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  // Show landing page if portfolio is not requested
  if (!showPortfolio) {
    return (
      <ErrorBoundary>
        <LandingPage 
          onNavigateToPortfolio={() => setShowPortfolio(true)} 
          onWarmPortfolio={warmPortfolio}
        />
      </ErrorBoundary>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="error">
        <div className="error-content">
          <i className="fa-solid fa-exclamation-triangle fa-3x mb-4"></i>
          <h2>{t('common.error')}</h2>
          <p>{t('common.somethingWentWrong')}</p>
          <button 
            className="btn-premium mt-4"
            onClick={() => window.location.reload()}
          >
            <i className="fa-solid fa-refresh me-2"></i>
            {t('common.refresh')}
          </button>
        </div>
      </div>
    )
  }

  // Show error state if no data
  if (!portfolioData) {
    return (
      <div className="error">
        <div className="error-content">
          <i className="fa-solid fa-info-circle fa-3x mb-4"></i>
          <h2>{t('common.error')}</h2>
          <p>{t('common.somethingWentWrong')}</p>
          <button 
            className="btn-premium mt-4"
            onClick={() => window.location.reload()}
          >
            <i className="fa-solid fa-refresh me-2"></i>
            {t('common.refresh')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <>
        <Navigation 
          items={[
            { id: 'experience', label: String(t('navigation.experience')), icon: 'fa-solid fa-briefcase' },
            { id: 'education', label: String(t('navigation.education')), icon: 'fa-solid fa-graduation-cap' },
            { id: 'skills', label: String(t('navigation.skills')), icon: 'fa-solid fa-code' },
            ...(portfolioData.projects && portfolioData.projects.length > 0 ? [{ id: 'projects', label: String(t('navigation.projects')), icon: 'fa-solid fa-folder' }] : []),
            ...(portfolioData.certifications && portfolioData.certifications.length > 0 ? [{ id: 'certifications', label: String(t('navigation.certifications')), icon: 'fa-solid fa-certificate' }] : []),
            ...(portfolioData.testimonials && portfolioData.testimonials.length > 0 ? [{ id: 'testimonials', label: String(t('navigation.testimonials')), icon: 'fa-solid fa-quote-left' }] : []),
            ...(portfolioData.interests && portfolioData.interests.length > 0 ? [{ id: 'interests', label: String(t('navigation.interests')), icon: 'fa-solid fa-heart' }] : []),
            ...(portfolioData.awards && portfolioData.awards.length > 0 ? [{ id: 'awards', label: String(t('navigation.awards')), icon: 'fa-solid fa-trophy' }] : []),
          ]}
          activeId={activeSection}
          onNavigate={setActiveSection}
          showBackButton={true}
          onBackClick={() => setShowPortfolio(false)}
        />
        
        <div className={`portfolio-container ${isLanguageTransitioning ? 'language-transitioning' : ''}`}>
          {/* Experience Section */}
          <Suspense fallback={<SectionSkeleton />}>
            <Experience experiences={portfolioData.experience} id="experience" />
          </Suspense>
          
          {/* Education Section */}
          <Suspense fallback={<SectionSkeleton />}>
            <Education education={portfolioData.education} />
          </Suspense>
          
          {/* Skills Section */}
          <Suspense fallback={<SectionSkeleton />}>
            <Skills skills={portfolioData.skills} />
          </Suspense>
          
          {/* Projects Section */}
          {portfolioData.projects && portfolioData.projects.length > 0 && (
            <Suspense fallback={<SectionSkeleton />}>
              <Projects projects={portfolioData.projects} />
            </Suspense>
          )}
          
          {/* Certifications Section */}
          {portfolioData.certifications && portfolioData.certifications.length > 0 && (
            <Suspense fallback={<SectionSkeleton />}>
              <Certifications certifications={portfolioData.certifications} />
            </Suspense>
          )}
          
          {/* Testimonials Section */}
          {portfolioData.testimonials && portfolioData.testimonials.length > 0 && (
            <Suspense fallback={<SectionSkeleton />}>
              <Testimonials testimonials={portfolioData.testimonials} />
            </Suspense>
          )}
          
          {/* Interests Section */}
          {portfolioData.interests && portfolioData.interests.length > 0 && (
            <Suspense fallback={<SectionSkeleton />}>
              <Interests interests={portfolioData.interests} />
            </Suspense>
          )}
          
          {/* Awards Section */}
          {portfolioData.awards && portfolioData.awards.length > 0 && (
            <Suspense fallback={<SectionSkeleton />}>
              <Awards awards={portfolioData.awards} />
            </Suspense>
          )}
        </div>


        <FloatingActionButton />
      </>
    </ErrorBoundary>
  )
}
