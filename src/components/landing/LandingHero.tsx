import { useEffect, useState } from 'preact/hooks'
import type { Personal } from '../../types/portfolio'

interface LandingHeroProps {
  personal: Personal
  className?: string
}

export function LandingHero({ personal, className = '' }: LandingHeroProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className={`landing-hero landing-section ${className}`}>
      <div className="hero-background-corporate">
        <div className="hero-pattern"></div>
        <div className="hero-gradient-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className={`hero-text ${isVisible ? 'hero-text-visible' : ''}`}>
          <div className="hero-badge">
            <span>Professional Portfolio</span>
          </div>
          
          <h1 className="hero-title">
            <span className="hero-title-main">{personal.name}</span>
            <span className="hero-title-subtitle">{personal.title}</span>
          </h1>
          
          <p className="hero-tagline">{personal.tagline}</p>
          
          <p className="hero-summary">
            {personal.summary}
          </p>
          
          <div className="hero-meta">
            <div className="hero-meta-item">
              <i className="fa-solid fa-location-dot"></i>
              <span>{personal.location}</span>
            </div>
            <div className="hero-meta-item">
              <i className="fa-solid fa-user-tie"></i>
              <span>{personal.availability}</span>
            </div>
          </div>
          
          <div className="hero-actions">
            <button 
              className="btn-hero-primary"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>Learn More</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
            
            <button 
              className="btn-hero-secondary"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <i className="fa-solid fa-briefcase"></i>
              <span>Services</span>
            </button>
          </div>
        </div>
        
        <div className={`hero-visual ${isVisible ? 'hero-visual-visible' : ''}`}>
          <div className="hero-image-container">
            <img 
              src="./img/full-logo.png" 
              alt={`${personal.name} - Portfolio Logo`}
              className="hero-logo-image"
            />
            <div className="hero-image-border"></div>
          </div>
          
          <div className="hero-highlights">
            <div className="hero-highlight-item">
              <div className="highlight-icon">
                <i className="fa-solid fa-code"></i>
              </div>
              <div className="highlight-text">
                <h4>Full Stack</h4>
                <p>End-to-end solutions</p>
              </div>
            </div>
            
            <div className="hero-highlight-item">
              <div className="highlight-icon">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div className="highlight-text">
                <h4>AI & Automation</h4>
                <p>Intelligent workflows</p>
              </div>
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
