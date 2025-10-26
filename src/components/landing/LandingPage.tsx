import { useState } from 'preact/hooks'
import { LandingHero } from './LandingHero'
import { LandingFeatures } from './LandingFeatures'
import { LandingAbout } from './LandingAbout'
import { LandingFooter } from './LandingFooter'
import { FloatingActionButton } from '../FloatingActionButton'

interface LandingPageProps {
  onNavigateToPortfolio: () => void
  className?: string
}

export function LandingPage({ onNavigateToPortfolio, className = '' }: LandingPageProps) {
  const [isPortfolioVisible, setIsPortfolioVisible] = useState(false)

  const handleNavigateToPortfolio = () => {
    setIsPortfolioVisible(true)
    onNavigateToPortfolio()
  }

  if (isPortfolioVisible) {
    return null // Portfolio will be rendered by parent
  }

  return (
    <div className={`landing-page ${className}`}>
      <LandingHero />
      <LandingFeatures />
      <LandingAbout onNavigateToPortfolio={handleNavigateToPortfolio} />
      <LandingFooter />
      <FloatingActionButton />
    </div>
  )
}
