import { useState, useEffect } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import { LandingHero } from './LandingHero'
import { LandingFeatures } from './LandingFeatures'
import { LandingAbout } from './LandingAbout'
import { LandingFooter } from './LandingFooter'
import { FloatingActionButton } from '../FloatingActionButton'
import { SectionSkeleton } from '../SectionSkeleton'
import { ContactModal } from '../ui/ContactModal'

interface LandingPageProps {
  onNavigateToPortfolio: () => void
  onWarmPortfolio?: () => void
  className?: string
}

export function LandingPage({ onNavigateToPortfolio, onWarmPortfolio, className = '' }: LandingPageProps) {
  const { currentLanguage } = useTranslation()
  const { portfolioData, loading } = usePortfolioData(currentLanguage)
  const [isPortfolioVisible, setIsPortfolioVisible] = useState(false)
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
    setIsPortfolioVisible(true)
    onNavigateToPortfolio()
  }

  if (isPortfolioVisible) {
    return null // Portfolio will be rendered by parent
  }

  if (loading || !portfolioData) {
    return (
      <div className={`landing-page ${className}`}>
        <SectionSkeleton />
      </div>
    )
  }

  return (
    <div className={`landing-page ${className}`}>
      <LandingHero personal={portfolioData.personal} onContactClick={handleContactClick} />
      <LandingFeatures personal={portfolioData.personal} />
      <LandingAbout 
        personal={portfolioData.personal} 
        social={portfolioData.social}
        onNavigateToPortfolio={handleNavigateToPortfolio}
        onWarmPortfolio={onWarmPortfolio}
      />
      <LandingFooter personal={portfolioData.personal} social={portfolioData.social} />
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
