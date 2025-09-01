import { useState, useEffect } from 'preact/hooks'
import { useI18n } from '../hooks/useI18n'
import type { HeroProps } from '../types'

export function Hero({ personal, social, onScrollDown }: HeroProps) {
  const [_isVisible, setIsVisible] = useState(false)
  const [currentSocialIndex, setCurrentSocialIndex] = useState(0)
  const { t } = useI18n()

  useEffect(() => {
    setIsVisible(true)
    
    // Auto-rotate social icons
    const interval = setInterval(() => {
      setCurrentSocialIndex((prev) => (prev + 1) % social.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [social.length])

  const handleScrollDown = () => {
    if (onScrollDown) {
      onScrollDown()
    } else {
      // Default scroll behavior
      const aboutSection = document.getElementById('about')
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  // Map social icons to proper FontAwesome classes
  const getSocialIcon = (socialItem: any) => {
    const iconMap: { [key: string]: string } = {
      'fa-linkedin': 'fa-brands fa-linkedin',
      'fa-github': 'fa-brands fa-github',
      'fa-graduation-cap': 'fa-solid fa-graduation-cap',
      'fa-globe': 'fa-solid fa-globe',
      'fa-envelope': 'fa-solid fa-envelope',
      'fa-phone': 'fa-solid fa-phone'
    }
    return iconMap[socialItem.icon] || socialItem.icon
  }

  return (
    <section className="portfolio-hero" id="hero">
      <div className="hero-profile">
        {/* Profile Avatar */}
        <img 
          src={personal.profileImage} 
          alt={`${personal.name} Profile`}
          className="hero-avatar hover-scale"
          loading="lazy"
          decoding="async"
        />
        
        {/* Hero Content */}
        <h1 className="hero-name text-gradient">
          {personal.name}
        </h1>
        
        <h2 className="hero-title">
          {t('hero.title')}
        </h2>
        
        <p className="hero-summary">
          {personal.longSummary || personal.summary}
        </p>
        
        {/* Core Values */}
        {personal.coreValues && (
          <div className="hero-values animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <div className="values-grid">
              {personal.coreValues.map((value, index) => (
                <span 
                  key={index} 
                  className="value-tag"
                  style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Hero Actions */}
        <div className="hero-actions">
          <a 
            href="#contact" 
            className="btn-premium hover-lift"
            onClick={(e) => {
              e.preventDefault()
              const contactSection = document.getElementById('contact')
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            <i className="fa-solid fa-envelope me-2"></i>
            {t('hero.cta')}
          </a>
          
          <a 
            href="#projects" 
            className="btn-premium btn-outline hover-lift"
            onClick={(e) => {
              e.preventDefault()
              const projectsSection = document.getElementById('projects')
              if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            <i className="fa-solid fa-code me-2"></i>
            {t('navigation.projects')}
          </a>
        </div>
        
        {/* Social Links */}
        <div className="hero-social animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
          <div className="social-grid">
            {social.map((socialItem, index) => (
              <a
                key={index}
                href={socialItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`social-link ${index === currentSocialIndex ? 'active' : ''}`}
                style={{ 
                  '--social-color': socialItem.color,
                  animationDelay: `${1.6 + index * 0.1}s`
                }}
                aria-label={socialItem.name}
              >
                <i className={getSocialIcon(socialItem)}></i>
                <span className="social-tooltip">{socialItem.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      
      {/* Premium Scroll Indicator */}
      <div className="premium-scroll-indicator">
        <button 
          onClick={handleScrollDown}
          className="premium-scroll-btn"
          aria-label="Scroll down to explore"
        >
          <div className="scroll-btn-content">
            <div className="scroll-icon-container">
              <i className="fa-solid fa-chevron-down scroll-icon"></i>
            </div>
          </div>
        </button>
      </div>
      
      {/* Background Elements */}
      <div className="hero-bg-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>
    </section>
  )
}
