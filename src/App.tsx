import { lazy, Suspense, useEffect, useState } from 'preact/compat'
import { usePortfolioData } from './hooks/usePortfolioData'
import { useTranslation } from './contexts/TranslationContext'
import { useTheme } from './hooks/useTheme'
import { Navigation } from './components/Navigation'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Hero } from './components/Hero'
import { SectionSkeleton } from './components/SectionSkeleton'
import { FloatingActionButton } from './components/FloatingActionButton'

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
  const { portfolioData, loading, error } = usePortfolioData(currentLanguage)
  useTheme() // Initialize theme system
  const [activeSection, setActiveSection] = useState('hero')
  const [isLanguageTransitioning, setIsLanguageTransitioning] = useState(false)

  // Debug: Add test message to see if component is rendering
  // console.log('🎯 App component rendering:', { 
  //   portfolioData: portfolioData ? 'Available' : 'Not Available',
  //   loading, 
  //   error: error?.message || 'None',
  //   currentLanguage: currentLanguage,
  //   aboutTranslation: t('navigation.about'),
  // })

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
      threshold: [0.1, 0.3, 0.5, 0.7, 0.9], // Multiple thresholds for better detection
      rootMargin: '-10% 0px -10% 0px' // Less restrictive margin
    }

    const observer = new IntersectionObserver((entries) => {
      // Find the section with the highest intersection ratio
      let mostVisibleSection = null
      let highestRatio = 0
      
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
          highestRatio = entry.intersectionRatio
          mostVisibleSection = entry.target.id
        }
      })
      
      if (mostVisibleSection) {
        setActiveSection(mostVisibleSection)
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

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
      clearTimeout(timeoutId)
    }
  }, [portfolioData])

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

  // Show debug info if no data
  if (!portfolioData) {
    // console.log('⚠️ Showing no data state')
    return (
      <div className="error">
        <div className="error-content">
          <i className="fa-solid fa-info-circle fa-3x mb-4"></i>
          <h2>Portfolio Data Not Available</h2>
          <p>Portfolio data is not available. Please check your data file.</p>
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h3>Debug Info:</h3>
            <p>Loading: {loading.toString()}</p>
            <p>Error: {error ? (error as Error).message : 'None'}</p>
            <p>Portfolio Data: {portfolioData ? 'Available' : 'Not Available'}</p>
            <p>Current Language: {currentLanguage}</p>
          </div>
        </div>
      </div>
    )
  }

  // console.log('✅ Portfolio data available, rendering main content')

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
        />
        
        {/* Hero Section */}
        <Hero 
          personal={portfolioData.personal}
        />
        
        <div className={`portfolio-container ${isLanguageTransitioning ? 'language-transitioning' : ''}`}>
          {/* Experience Section */}
          <Suspense fallback={<SectionSkeleton />}>
            <Experience experiences={portfolioData.experience} />
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
