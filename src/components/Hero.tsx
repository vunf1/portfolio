import { useState, useEffect, useRef } from 'preact/hooks'
import { useI18n } from '../hooks/useI18n'
import type { HeroProps } from '../types'

// Device capability detection - simplified for consistent performance
const isLowEndDevice = () => {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  
  // Check for very low-end device indicators
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true
  
  // Check for very low memory devices
  if ('deviceMemory' in navigator && (navigator as any).deviceMemory <= 2) return true
  
  return false
}

export function Hero({ personal, social, onScrollDown }: HeroProps) {
  const [currentSocialIndex, setCurrentSocialIndex] = useState(0)
  const [isLowEnd, setIsLowEnd] = useState(false)
  const { t } = useI18n()
  const heroRef = useRef<HTMLElement>(null)
  


  useEffect(() => {
    // Check device capabilities on mount for potential future optimizations
    const lowEnd = isLowEndDevice()
    setIsLowEnd(lowEnd)
  }, [])

  useEffect(() => {
    if (!isLowEnd) return
    
    // Auto-rotate social icons
    const interval = setInterval(() => {
      setCurrentSocialIndex((prev) => (prev + 1) % social.length)
    }, 3000)

    // Set random positions for floating icons on load
    const setRandomPositions = () => {
      if (!heroRef.current) {return}
      
      const shapes = heroRef.current.querySelectorAll('.floating-shape') as NodeListOf<HTMLElement>
      
      // Array of available animations
      const animations = [
        'float-1', 'float-2', 'float-3', 'float-4', 'float-5', 'float-6', 'float-7', 'float-8',
        'pulse-1', 'pulse-2', 'pulse-3',
        'bounce-1', 'bounce-2',
        'spin-1', 'spin-2',
        'wave-1', 'wave-2',
        'zigzag-1', 'zigzag-2'
      ]
      
      // Array of animation durations (in seconds)
      const durations = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      
      shapes.forEach((shape) => {
        const randomX = Math.random() * 80 + 10 // 10% to 90% of width
        const randomY = Math.random() * 80 + 10 // 10% to 90% of height
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)]
        const randomDuration = durations[Math.floor(Math.random() * durations.length)]
        const randomDelay = Math.random() * 5 // 0 to 5 seconds delay
        
        shape.style.left = `${randomX}%`
        shape.style.top = `${randomY}%`
        shape.style.animation = `${randomAnimation} ${randomDuration}s ease-in-out infinite`
        shape.style.animationDelay = `${randomDelay}s`
      })
    }

    // Set random positions on load
    setRandomPositions()

    return () => {
      clearInterval(interval)
    }
  }, [social.length, isLowEnd])

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

  // Map social icons to Devicon classes (with fallbacks for legacy FontAwesome)
  const getSocialIcon = (socialItem: { icon: string }) => {
    const iconMap: { [key: string]: string } = {
      'fa-linkedin': 'devicon-linkedin-plain',
      'fa-github': 'devicon-github-original',
      'fa-graduation-cap': 'devicon-graduation-cap',
      'fa-globe': 'devicon-firefox-plain',
      'fa-envelope': 'devicon-envelope',
      'fa-phone': 'devicon-phone'
    }
    return iconMap[socialItem.icon] || socialItem.icon
  }

  return (
    <section className="portfolio-hero" id="hero" ref={heroRef}>
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
        <h1 className="hero-name text-gradient" data-text={personal.name}>
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
            {social && social.length > 0 ? (
              social.map((socialItem, index) => (
                                <a
                  key={index}
                  href={socialItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-link ${index === currentSocialIndex ? 'active' : ''}`}
                  style={{ 
                    '--social-color': socialItem.color || '#0077B5',
                    animationDelay: `${1.6 + index * 0.1}s`
                  }}
                  aria-label={socialItem.name}
                  data-debug-icon={socialItem.icon}
                  data-debug-mapped={getSocialIcon(socialItem)}
                >
                  <i className={getSocialIcon(socialItem)}></i>
                  <span className="social-tooltip">{socialItem.name}</span>
                </a>
              ))
            ) : (
              <div>No social links available</div>
            )}
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
      
      {/* Background Elements - Show reduced animations on all devices for better performance */}
      <div className="hero-bg-elements mobile-optimized">
        {/* Optimized floating shapes for all devices */}
        <div className="floating-shape shape-1 mobile-shape">
          <i className="fa-solid fa-microchip"></i>
        </div>
        <div className="floating-shape shape-2 mobile-shape">
          <i className="fa-solid fa-code"></i>
        </div>
        <div className="floating-shape shape-3 mobile-shape">
          <i className="fa-solid fa-database"></i>
        </div>
        <div className="floating-shape shape-4 mobile-shape">
          <i className="fa-solid fa-server"></i>
        </div>
        <div className="floating-shape shape-5 mobile-shape">
          <i className="fa-solid fa-cloud"></i>
        </div>
        
        {/* Simple data streams for all devices */}
        <div className="data-stream data-stream-1 mobile-stream"></div>
        <div className="data-stream data-stream-2 mobile-stream"></div>
      </div>
    </section>
  )
}
