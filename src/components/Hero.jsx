import { useState, useEffect } from 'preact/hooks'

export function Hero({ personal, social, onScrollDown }) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSocialIndex, setCurrentSocialIndex] = useState(0)

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

  return (
    <section className="portfolio-hero" id="hero">
      <div className="hero-profile">
        {/* Profile Avatar */}
        <img 
          src={personal.profileImage} 
          alt={`${personal.name} Profile`}
          className="hero-avatar hover-scale"
        />
        
        {/* Hero Content */}
        <h1 className="hero-name text-gradient">
          {personal.name}
        </h1>
        
        <h2 className="hero-title">
          {personal.title}
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
            Get In Touch
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
            View Projects
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
                <i className={`fa ${socialItem.icon}`}></i>
                <span className="social-tooltip">{socialItem.name}</span>
              </a>
            ))}
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator animate-fade-in-up" style={{ animationDelay: '2s' }}>
          <button 
            onClick={handleScrollDown}
            className="scroll-btn"
            aria-label="Scroll down to explore"
          >
            <i className="fa-solid fa-chevron-down"></i>
          </button>
        </div>
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
