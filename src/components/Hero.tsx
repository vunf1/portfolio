import { useState, useEffect, useRef } from 'preact/hooks'
import { useI18n } from '../hooks/useI18n'
import type { HeroProps } from '../types'

export function Hero({ personal, social, onScrollDown }: HeroProps) {
  const [currentSocialIndex, setCurrentSocialIndex] = useState(0)
  const { t } = useI18n()
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    
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
  const getSocialIcon = (socialItem: { icon: string }) => {
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
        <div className="floating-shape shape-1">
          <i className="fa-solid fa-microchip"></i>
        </div>
        <div className="floating-shape shape-2">
          <i className="fa-solid fa-code"></i>
        </div>
        <div className="floating-shape shape-3">
          <i className="fa-solid fa-database"></i>
        </div>
        <div className="floating-shape shape-4">
          <i className="fa-solid fa-server"></i>
        </div>
        <div className="floating-shape shape-5">
          <i className="fa-solid fa-network-wired"></i>
        </div>
        <div className="floating-shape shape-6">
          <i className="fa-solid fa-cloud"></i>
        </div>
        <div className="floating-shape shape-7">
          <i className="fa-solid fa-shield-halved"></i>
        </div>
        <div className="floating-shape shape-8">
          <i className="fa-solid fa-robot"></i>
        </div>
        <div className="floating-shape shape-9">
          <i className="fa-solid fa-brain"></i>
        </div>
        <div className="floating-shape shape-10">
          <i className="fa-solid fa-rocket"></i>
        </div>
        <div className="floating-shape shape-11">
          <i className="fa-solid fa-satellite"></i>
        </div>
        <div className="floating-shape shape-12">
          <i className="fa-solid fa-cube"></i>
        </div>
        <div className="floating-shape shape-13">
          <i className="fa-solid fa-mobile-screen"></i>
        </div>
        <div className="floating-shape shape-14">
          <i className="fa-solid fa-laptop-code"></i>
        </div>
        <div className="floating-shape shape-15">
          <i className="fa-solid fa-wifi"></i>
        </div>
        <div className="floating-shape shape-16">
          <i className="fa-solid fa-bolt"></i>
        </div>
        <div className="floating-shape shape-17">
          <i className="fa-solid fa-gear"></i>
        </div>
        <div className="floating-shape shape-18">
          <i className="fa-solid fa-chart-line"></i>
        </div>
        <div className="floating-shape shape-19">
          <i className="fa-solid fa-key"></i>
        </div>
        <div className="floating-shape shape-20">
          <i className="fa-solid fa-eye"></i>
        </div>
        <div className="floating-shape shape-21">
          <i className="fa-solid fa-fingerprint"></i>
        </div>
        <div className="floating-shape shape-22">
          <i className="fa-solid fa-qrcode"></i>
        </div>
        <div className="floating-shape shape-23">
          <i className="fa-solid fa-memory"></i>
        </div>
        <div className="floating-shape shape-24">
          <i className="fa-solid fa-microchip"></i>
        </div>
        <div className="floating-shape shape-25">
          <i className="fa-solid fa-terminal"></i>
        </div>
        <div className="floating-shape shape-26">
          <i className="fa-solid fa-cogs"></i>
        </div>
        <div className="floating-shape shape-27">
          <i className="fa-solid fa-sitemap"></i>
        </div>
        <div className="floating-shape shape-28">
          <i className="fa-solid fa-project-diagram"></i>
        </div>
        <div className="floating-shape shape-29">
          <i className="fa-solid fa-chart-bar"></i>
        </div>
        <div className="floating-shape shape-30">
          <i className="fa-solid fa-tablet-alt"></i>
        </div>
        <div className="floating-shape shape-31">
          <i className="fa-solid fa-desktop"></i>
        </div>
        <div className="floating-shape shape-32">
          <i className="fa-solid fa-hdd"></i>
        </div>
        <div className="floating-shape shape-33">
          <i className="fa-solid fa-memory"></i>
        </div>
        <div className="floating-shape shape-34">
          <i className="fa-solid fa-microchip"></i>
        </div>
        <div className="floating-shape shape-35">
          <i className="fa-solid fa-satellite-dish"></i>
        </div>
        <div className="floating-shape shape-36">
          <i className="fa-solid fa-broadcast-tower"></i>
        </div>
        <div className="floating-shape shape-37">
          <i className="fa-solid fa-wifi"></i>
        </div>
        <div className="floating-shape shape-38">
          <i className="fa-solid fa-signal"></i>
        </div>
        <div className="floating-shape shape-39">
          <i className="fa-solid fa-antenna"></i>
        </div>
        <div className="floating-shape shape-40">
          <i className="fa-solid fa-satellite"></i>
        </div>
        <div className="floating-shape shape-41">
          <i className="fa-solid fa-rocket"></i>
        </div>
        <div className="floating-shape shape-42">
          <i className="fa-solid fa-space-shuttle"></i>
        </div>
        <div className="floating-shape shape-43">
          <i className="fa-solid fa-meteor"></i>
        </div>
        <div className="floating-shape shape-44">
          <i className="fa-solid fa-atom"></i>
        </div>
        <div className="floating-shape shape-45">
          <i className="fa-solid fa-dna"></i>
        </div>
        <div className="floating-shape shape-46">
          <i className="fa-solid fa-flask"></i>
        </div>
        <div className="floating-shape shape-47">
          <i className="fa-solid fa-vial"></i>
        </div>
        <div className="floating-shape shape-48">
          <i className="fa-solid fa-microscope"></i>
        </div>
        
        {/* Data Stream Lines */}
        <div className="data-stream data-stream-1"></div>
        <div className="data-stream data-stream-2"></div>
        <div className="data-stream data-stream-3"></div>
        <div className="data-stream data-stream-4"></div>
        <div className="data-stream data-stream-5"></div>
        <div className="data-stream data-stream-6"></div>
        <div className="data-stream data-stream-7"></div>
        <div className="data-stream data-stream-8"></div>
        
        {/* Tech Grid Overlay */}
        <div className="tech-grid"></div>
      </div>
    </section>
  )
}
