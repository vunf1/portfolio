import { useState, useEffect } from 'preact/hooks'
import { lazy, Suspense } from 'preact/compat'
import { Hero } from './components/Hero'
import { Navigation } from './components/Navigation'
import { Contact } from './components/Contact'
import { ContactModal } from './components/ContactModal'
import { ErrorBoundary } from './components/ErrorBoundary'
import { usePortfolioData } from './hooks/usePortfolioData'
import { useTheme } from './hooks/useTheme'
import { useI18n } from './hooks/useI18n'

// Lazy load non-critical components
const About = lazy(() => import('./components/About').then(module => ({ default: module.About })))
const Experience = lazy(() => import('./components/Experience').then(module => ({ default: module.Experience })))
const Education = lazy(() => import('./components/Education').then(module => ({ default: module.Education })))
const Skills = lazy(() => import('./components/Skills').then(module => ({ default: module.Skills })))
const Projects = lazy(() => import('./components/Projects').then(module => ({ default: module.Projects })))
const Certifications = lazy(() => import('./components/Certifications').then(module => ({ default: module.Certifications })))
const Interests = lazy(() => import('./components/Interests').then(module => ({ default: module.Interests })))
const Awards = lazy(() => import('./components/Awards').then(module => ({ default: module.Awards })))
const Testimonials = lazy(() => import('./components/Testimonials').then(module => ({ default: module.Testimonials })))

// Loading skeleton component for better UX
const SectionSkeleton = () => (
  <div className="section-skeleton">
    <div className="skeleton-header">
      <div className="skeleton-title"></div>
      <div className="skeleton-subtitle"></div>
    </div>
    <div className="skeleton-content">
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
    </div>
  </div>
)

export function App() {
  const { portfolioData, loading, error } = usePortfolioData()
  const { isDarkMode, toggleTheme } = useTheme()
  const { t } = useI18n()
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactUnlocked, setContactUnlocked] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [isLanguageTransitioning, setIsLanguageTransitioning] = useState(false)

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

  const handleContactUnlock = () => {
    // Here you would typically send the data to your backend
    setContactUnlocked(true)
    setShowContactModal(false)
  }

  const handleScrollDown = () => {
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Intersection Observer for active section tracking
  useEffect(() => {
    if (!portfolioData) {return}

    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-20% 0px -20% 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    // Observe all sections
    const sections = document.querySelectorAll('section[id]')
    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [portfolioData])

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error">
        <div className="error-content">
                           <i className="fa-solid fa-exclamation-triangle fa-3x mb-4"></i>
          <h2>Error Loading Portfolio</h2>
          <p>{error.message}</p>
          <button 
            className="btn-premium mt-4"
            onClick={() => window.location.reload()}
          >
                               <i className="fa-solid fa-refresh me-2"></i>
                   Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!portfolioData) {
    return (
      <div className="error">
        <div className="error-content">
                           <i className="fa-solid fa-info-circle fa-3x mb-4"></i>
          <h2>No Portfolio Data</h2>
          <p>Portfolio data is not available. Please check your data file.</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <>
        <Navigation 
          personal={portfolioData.personal}
          portfolioData={portfolioData}
          isDarkMode={isDarkMode}
          onThemeToggle={toggleTheme}
          activeSection={activeSection}
        />
        
        {/* Hero Section */}
        <Hero 
          personal={portfolioData.personal}
          social={portfolioData.social}
          onScrollDown={handleScrollDown}
        />
        
        <div className={`portfolio-container ${isLanguageTransitioning ? 'language-transitioning' : ''}`}>
          {/* About Section */}
          <section className={`portfolio-section ${isLanguageTransitioning ? 'language-transitioning' : ''}`} id="about">
            <div className="section-header">
              <h2 className="section-title">{t('about.title')}</h2>
              <p className="section-subtitle">{t('about.subtitle')}</p>
            </div>
            <Suspense fallback={<SectionSkeleton />}>
              <About personal={portfolioData.personal} social={portfolioData.social} />
            </Suspense>
          </section>
          
          {/* Experience Section */}
          <section className={`portfolio-section ${isLanguageTransitioning ? 'language-transitioning' : ''}`} id="experience">
            <div className="section-header">
              <h2 className="section-title">{t('experience.title')}</h2>
              <p className="section-subtitle">{t('experience.subtitle')}</p>
            </div>
            <Suspense fallback={<SectionSkeleton />}>
              <Experience experience={portfolioData.experience} />
            </Suspense>
          </section>
          
          {/* Education Section */}
          <section className={`portfolio-section ${isLanguageTransitioning ? 'language-transitioning' : ''}`} id="education">
            <div className="section-header">
              <h2 className="section-title">{t('education.title')}</h2>
              <p className="section-subtitle">{t('education.subtitle')}</p>
            </div>
            <Suspense fallback={<SectionSkeleton />}>
              <Education education={portfolioData.education} />
            </Suspense>
          </section>
          
          {/* Skills Section */}
          <section className={`portfolio-section ${isLanguageTransitioning ? 'language-transitioning' : ''}`} id="skills">
            <div className="section-header">
              <h2 className="section-title">{t('skills.title')}</h2>
              <p className="section-subtitle">{t('skills.subtitle')}</p>
            </div>
            <Suspense fallback={<SectionSkeleton />}>
              <Skills skills={portfolioData.skills} />
            </Suspense>
          </section>
          
          {/* Projects Section */}
          {portfolioData.projects && portfolioData.projects.length > 0 && (
            <section className={`portfolio-section ${isLanguageTransitioning ? 'language-transitioning' : ''}`} id="projects">
              <div className="section-header">
                <h2 className="section-title">{t('projects.title')}</h2>
                <p className="section-subtitle">{t('projects.subtitle')}</p>
              </div>
              <Suspense fallback={<SectionSkeleton />}>
                <Projects projects={portfolioData.projects} />
              </Suspense>
            </section>
          )}
          
          {/* Certifications Section */}
          {portfolioData.certifications && portfolioData.certifications.length > 0 && (
            <section className={`portfolio-section ${isLanguageTransitioning ? 'language-transitioning' : ''}`} id="certifications">
              <div className="section-header">
                <h2 className="section-title">{t('certifications.title')}</h2>
                <p className="section-subtitle">{t('certifications.subtitle')}</p>
              </div>
              <Suspense fallback={<SectionSkeleton />}>
                <Certifications certifications={portfolioData.certifications} />
              </Suspense>
            </section>
          )}
          
          {/* Testimonials Section */}
          {portfolioData.testimonials && portfolioData.testimonials.length > 0 && (
            <section className={`portfolio-section ${isLanguageTransitioning ? 'language-transitioning' : ''}`} id="testimonials">
              <div className="section-header">
                <h2 className="section-title">{t('testimonials.title')}</h2>
                <p className="section-subtitle">{t('testimonials.subtitle')}</p>
              </div>
              <Suspense fallback={<SectionSkeleton />}>
                <Testimonials testimonials={portfolioData.testimonials} />
              </Suspense>
            </section>
          )}
          
          {/* Interests Section */}
          {portfolioData.interests && portfolioData.interests.length > 0 && (
            <section className={`portfolio-section ${isLanguageTransitioning ? 'language-transitioning' : ''}`} id="interests">
              <div className="section-header">
                <h2 className="section-title">{t('interests.title')}</h2>
                <p className="section-subtitle">{t('interests.subtitle')}</p>
              </div>
              <Suspense fallback={<SectionSkeleton />}>
                <Interests interests={portfolioData.interests} />
              </Suspense>
            </section>
          )}
          
          {/* Awards Section */}
          {portfolioData.awards && portfolioData.awards.length > 0 && (
            <section className={`portfolio-section ${isLanguageTransitioning ? 'language-transitioning' : ''}`} id="awards">
              <div className="section-header">
                <h2 className="section-title">{t('awards.title')}</h2>
                <p className="section-subtitle">{t('awards.subtitle')}</p>
              </div>
              <Suspense fallback={<SectionSkeleton />}>
                <Awards awards={portfolioData.awards} />
              </Suspense>
            </section>
          )}
          
          {/* Contact Section */}
          <section className={`portfolio-section ${isLanguageTransitioning ? 'language-transitioning' : ''}`} id="contact">
            <div className="section-header">
              <h2 className="section-title">{t('contact.title')}</h2>
              <p className="section-subtitle">{t('contact.subtitle')}</p>
            </div>
            <Contact 
              personal={portfolioData.personal}
              isUnlocked={contactUnlocked}
              onUnlock={() => setShowContactModal(true)}
            />
          </section>
        </div>

        <ContactModal 
          show={showContactModal}
          onClose={() => setShowContactModal(false)}
          onSubmit={handleContactUnlock}
        />
      </>
    </ErrorBoundary>
  )
}
