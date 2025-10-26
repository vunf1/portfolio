import { useEffect, useState } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'

interface LandingHeroProps {
  className?: string
}

export function LandingHero({ className = '' }: LandingHeroProps) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className={`landing-hero ${className}`}>
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-particles"></div>
      </div>
      
      <div className="hero-content">
        <div className={`hero-text ${isVisible ? 'hero-text-visible' : ''}`}>
          <h1 className="hero-title">
            <span className="hero-title-line">Full Stack Engineer</span>
            <span className="hero-title-line hero-title-accent">Generative AI & Automation</span>
          </h1>
          
          <p className="hero-subtitle">
            Building intelligent systems that bridge the gap between human creativity and artificial intelligence. 
            Specialized in end-to-end development with cutting-edge AI integration.
          </p>
          
          <div className="hero-actions">
            <button 
              className="btn-hero-primary"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>Explore Portfolio</span>
              <i className="fas fa-arrow-right"></i>
            </button>
            
            <button 
              className="btn-hero-secondary"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <i className="fas fa-play"></i>
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
        
        <div className={`hero-visual ${isVisible ? 'hero-visual-visible' : ''}`}>
          <div className="hero-card">
            <div className="hero-card-content">
              <div className="hero-card-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h3>AI-Powered Solutions</h3>
              <p>Intelligent automation and generative AI integration</p>
            </div>
          </div>
          
          <div className="hero-card hero-card-secondary">
            <div className="hero-card-content">
              <div className="hero-card-icon">
                <i className="fas fa-code"></i>
              </div>
              <h3>Full Stack Development</h3>
              <p>End-to-end application development with modern technologies</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-scroll-indicator">
        <div className="scroll-line"></div>
        <span>Scroll to explore</span>
      </div>
    </section>
  )
}
