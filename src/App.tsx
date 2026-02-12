import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'preact/compat'
import { usePortfolioData } from './hooks/usePortfolioData'
import { useTranslation } from './contexts/TranslationContext'
import { Navigation } from './components/Navigation'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Icon } from './components/ui/Icon'
import { Button } from './components/ui/Button'
import { Toaster } from './components/ui/Toaster'
import { PageLoader } from './components/ui/PageLoader'
import { SectionPlaceholder } from './components/SectionPlaceholder'
import { FloatingActionButton } from './components/FloatingActionButton'
import { LandingPage } from './components/landing/LandingPage'
import { preloadPortfolioChunks } from './utils/preloadPortfolioChunks'

/** Min time landing stays visible while fading out (ms) */
const LANDING_FADEOUT_MS = 250
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
  const [isExitingLanding, setIsExitingLanding] = useState(false)
  const [isExitingPortfolio, setIsExitingPortfolio] = useState(false)
  const [hideLanding, setHideLanding] = useState(true)
  const hasWarmedPortfolio = useRef(false)
  const hasVisitedPortfolio = useRef(false)

  const handleNavigateToPortfolio = useCallback(() => {
    if (isExitingLanding || showPortfolio) return
    setHideLanding(false)
    setIsExitingLanding(true)
  }, [isExitingLanding, showPortfolio])

  const handleBackToHome = useCallback(() => {
    if (isExitingPortfolio || !showPortfolio) return
    setHideLanding(false) /* keep landing mounted behind so it's visible when portfolio fades out */
    setIsExitingPortfolio(true)
  }, [isExitingPortfolio, showPortfolio])


  // Initialize SEO when portfolio data is available
  useEffect(() => {
    if (portfolioData && portfolioData.personal && portfolioData.meta && portfolioData.meta.seo && portfolioData.social) {
      // Verify meta.seo has required properties
      const seo = portfolioData.meta.seo
      if (seo && typeof seo === 'object' && seo.title && seo.description && Array.isArray(seo.keywords)) {
        try {
          initializeSEO(
            currentLanguage,
            portfolioData.personal,
            seo,
            portfolioData.social,
            portfolioData
          )
        } catch (error) {
          // Always log errors for debugging (even in production)
          // eslint-disable-next-line no-console
          console.error('Failed to initialize SEO:', error)
          if (error instanceof Error && error.stack) {
            // eslint-disable-next-line no-console
            console.error('Error stack:', error.stack)
          }
        }
      }
    }
  }, [portfolioData, currentLanguage])

  // Update SEO when language changes
  useEffect(() => {
    if (portfolioData && portfolioData.personal && portfolioData.meta && portfolioData.meta.seo && portfolioData.social) {
      // Verify meta.seo has required properties
      const seo = portfolioData.meta.seo
      if (seo && typeof seo === 'object' && seo.title && seo.description && Array.isArray(seo.keywords)) {
        try {
          updateSEOOnLanguageChange(
            currentLanguage,
            portfolioData.personal,
            seo,
            portfolioData.social,
            portfolioData
          )
        } catch (error) {
          // Always log errors for debugging (even in production)
          // eslint-disable-next-line no-console
          console.error('Failed to update SEO on language change:', error)
          if (error instanceof Error && error.stack) {
            // eslint-disable-next-line no-console
            console.error('Error stack:', error.stack)
          }
        }
      }
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
    let scrollTimeout: number | undefined
    const throttledScrollHandler = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      scrollTimeout = window.setTimeout(handleScroll, 100) as unknown as number
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

  /* After landing fades out: wait for portfolio chunks to load, then show portfolio so fade-in reveals full content */
  useEffect(() => {
    if (!isExitingLanding) return
    let cancelled = false
    let fallbackId: ReturnType<typeof setTimeout> | undefined
    const showPortfolioNow = () => {
      if (fallbackId) {
        clearTimeout(fallbackId)
        fallbackId = undefined
      }
      if (!cancelled) {
        hasVisitedPortfolio.current = true
        setIsExitingLanding(false)
        setShowPortfolio(true)
      }
    }
    const schedule = setTimeout(() => {
      fallbackId = setTimeout(showPortfolioNow, 3000)
      preloadPortfolioChunks().then(showPortfolioNow).catch(showPortfolioNow)
    }, LANDING_FADEOUT_MS)
    return () => {
      cancelled = true
      clearTimeout(schedule)
      if (fallbackId) clearTimeout(fallbackId)
    }
  }, [isExitingLanding])

  /* Unmount landing after portfolio fade-in completes (delay 0.1s + duration 0.4s ≈ 550ms) */
  useEffect(() => {
    if (!showPortfolio) return
    const timer = setTimeout(() => setHideLanding(true), 550)
    return () => clearTimeout(timer)
  }, [showPortfolio])

  /* Back to Home: fade out portfolio, then show landing */
  useEffect(() => {
    if (!isExitingPortfolio) return
    const timer = setTimeout(() => {
      setIsExitingPortfolio(false)
      setShowPortfolio(false)
      document.body.classList.add('landing-page-active')
      document.documentElement.classList.add('landing-page-active')
    }, LANDING_FADEOUT_MS)
    return () => clearTimeout(timer)
  }, [isExitingPortfolio])

  useEffect(() => {
    if (showPortfolio) {
      /* Switch to portfolio layout: remove landing scroll/overflow rules immediately */
      document.body.classList.remove('landing-page-active')
      document.documentElement.classList.remove('landing-page-active')

      void loadAllSections()
      /* Scroll to top already done in handleNavigateToPortfolio before fade-out; no scroll here to avoid visible jump during transition */
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

  // Show premium loading state
  if (loading) {
    return <PageLoader />
  }

  if (error) {
    return (
      <div className="error">
        <div className="error-content">
          <Icon name="exclamation-triangle" size={48} className="mb-4" />
          <h2>{t('common.error')}</h2>
          <p>{t('common.somethingWentWrong')}</p>
          <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
            <Icon name="refresh" size={18} className="mr-2" />
            {t('common.refresh')}
          </Button>
        </div>
      </div>
    )
  }

  if (!portfolioData) {
    return (
      <div className="error">
        <div className="error-content">
          <Icon name="info-circle" size={48} className="mb-4" />
          <h2>{t('common.error')}</h2>
          <p>{t('common.somethingWentWrong')}</p>
          <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
            <Icon name="refresh" size={18} className="mr-2" />
            {t('common.refresh')}
          </Button>
        </div>
      </div>
    )
  }

  const showLanding = !showPortfolio || !hideLanding

  return (
    <ErrorBoundary>
      <div className="page-transition-wrapper">
        {showLanding && (
          <div
            className={`page-transition page-transition-landing ${isExitingLanding ? 'page-fade-out' : ''} ${showPortfolio ? 'page-transition-behind' : ''} ${!showPortfolio && !isExitingLanding && !hasVisitedPortfolio.current ? 'page-fade-in' : ''}`}
            aria-hidden={showPortfolio}
          >
            <LandingPage
              portfolioData={portfolioData}
              onNavigateToPortfolio={handleNavigateToPortfolio}
              onWarmPortfolio={warmPortfolio}
            />
          </div>
        )}
        {showPortfolio && (
          <div className={`page-transition page-transition-portfolio ${isExitingPortfolio ? 'page-fade-out' : 'page-fade-in'}`}>
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
          onBackClick={handleBackToHome}
        />
        
        <div className={`portfolio-container ${isLanguageTransitioning ? 'language-transitioning' : ''}`}>
          {/* Experience Section */}
          <Suspense fallback={<SectionPlaceholder />}>
            <Experience experiences={portfolioData.experience} id="experience" />
          </Suspense>
          
          {/* Education Section */}
          <Suspense fallback={<SectionPlaceholder />}>
            <Education education={portfolioData.education} />
          </Suspense>
          
          {/* Skills Section */}
          <Suspense fallback={<SectionPlaceholder />}>
            <Skills skills={portfolioData.skills} />
          </Suspense>
          
          {/* Projects Section */}
          {portfolioData.projects && portfolioData.projects.length > 0 && (
            <Suspense fallback={<SectionPlaceholder />}>
              <Projects projects={portfolioData.projects} />
            </Suspense>
          )}
          
          {/* Certifications Section */}
          {portfolioData.certifications && portfolioData.certifications.length > 0 && (
            <Suspense fallback={<SectionPlaceholder />}>
              <Certifications certifications={portfolioData.certifications} />
            </Suspense>
          )}
          
          {/* Testimonials Section */}
          {portfolioData.testimonials && portfolioData.testimonials.length > 0 && (
            <Suspense fallback={<SectionPlaceholder />}>
              <Testimonials testimonials={portfolioData.testimonials} />
            </Suspense>
          )}
          
          {/* Interests Section */}
          {portfolioData.interests && portfolioData.interests.length > 0 && (
            <Suspense fallback={<SectionPlaceholder />}>
              <Interests interests={portfolioData.interests} />
            </Suspense>
          )}
          
          {/* Awards Section */}
          {portfolioData.awards && portfolioData.awards.length > 0 && (
            <Suspense fallback={<SectionPlaceholder />}>
              <Awards awards={portfolioData.awards} />
            </Suspense>
          )}
        </div>


        <FloatingActionButton />
          </div>
        )}
      </div>
      <Toaster />
    </ErrorBoundary>
  )
}
