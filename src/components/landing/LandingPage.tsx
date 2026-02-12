import { useState, useEffect } from 'preact/hooks'
import { LandingHero } from './LandingHero'
import { LandingFeatures } from './LandingFeatures'
import { LandingAbout } from './LandingAbout'
import { LandingFooter } from './LandingFooter'
import { FloatingActionButton } from '../FloatingActionButton'
import { ContactModal } from '../ui/ContactModal'
import type { PortfolioData } from '../../types/portfolio'

interface LandingPageProps {
  portfolioData: PortfolioData
  onNavigateToPortfolio: () => void
  onWarmPortfolio?: () => void
  className?: string
}

export function LandingPage({ portfolioData, onNavigateToPortfolio, onWarmPortfolio, className = '' }: LandingPageProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  const handleContactClick = () => {
    setIsContactModalOpen(true)
  }

  useEffect(() => {
    // Add classes to body and html to prevent double scrollbars
    document.body.classList.add('landing-page-active')
    document.documentElement.classList.add('landing-page-active')
    
    // Listen for custom navigation events
    const handleNavigateToPortfolio = () => {
      onNavigateToPortfolio()
    }
    
    window.addEventListener('navigateToPortfolio', handleNavigateToPortfolio)
    
    // Setup scroll animations for sections
    const observerOptions = {
      threshold: [0.1, 0.3, 0.5],
      rootMargin: '-10% 0px -10% 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible')
        }
      })
    }, observerOptions)

    // Observe all landing sections
    const sections = document.querySelectorAll('.landing-section')
    sections.forEach(section => observer.observe(section))

    return () => {
      document.body.classList.remove('landing-page-active')
      document.documentElement.classList.remove('landing-page-active')
      window.removeEventListener('navigateToPortfolio', handleNavigateToPortfolio)
      observer.disconnect()
    }
  }, [onNavigateToPortfolio])

  const handleNavigateToPortfolio = () => {
    onWarmPortfolio?.()
    onNavigateToPortfolio()
  }

  // Parent (App) ensures portfolioData.personal exists before rendering
  const personal = portfolioData.personal
  if (!personal || typeof personal !== 'object') {
    return null
  }

  return (
    <div className={`landing-page ${className}`}>
      <LandingHero personal={personal} onContactClick={handleContactClick} />
      <LandingFeatures personal={personal} />
      <LandingAbout 
        personal={personal} 
        social={portfolioData.social || []}
        onNavigateToPortfolio={handleNavigateToPortfolio}
        onWarmPortfolio={onWarmPortfolio}
      />
      <LandingFooter personal={personal} social={portfolioData.social || []} />
      <FloatingActionButton onContactClick={handleContactClick} />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false)
        }}
      />
    </div>
  )
}
