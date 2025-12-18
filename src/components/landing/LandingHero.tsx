import { useEffect, useState } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import type { Personal } from '../../types/portfolio'
import logoUrl from '@/img/logo.png'

interface LandingHeroProps {
  personal: Personal
  className?: string
  onContactClick?: () => void
}

export function LandingHero({ personal, className = '', onContactClick }: LandingHeroProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { currentLanguage } = useTranslation()

  useEffect(() => {
    setIsVisible(true)
    
    // #region agent log
    // Debug: Measure subtitle dimensions and container constraints
    const measureSubtitle = () => {
      const subtitle = document.querySelector('.hero-logo-subtitle') as HTMLElement
      const container = document.querySelector('.hero-image-container') as HTMLElement
      const visual = document.querySelector('.hero-visual') as HTMLElement
      const content = document.querySelector('.hero-content') as HTMLElement
      
      if (subtitle && container && visual && content) {
        const subStyle = window.getComputedStyle(subtitle)
        const contStyle = window.getComputedStyle(container)
        const visStyle = window.getComputedStyle(visual)
        const contGridStyle = window.getComputedStyle(content)
        
        const data = {
          viewportWidth: window.innerWidth,
          subtitle: {
            fontSize: subStyle.fontSize,
            width: subStyle.width,
            maxWidth: subStyle.maxWidth,
            minWidth: subStyle.minWidth,
            computedWidth: subtitle.offsetWidth,
            scrollWidth: subtitle.scrollWidth,
            clientWidth: subtitle.clientWidth,
            isClipped: subtitle.scrollWidth > subtitle.clientWidth,
            paddingLeft: subStyle.paddingLeft,
            paddingRight: subStyle.paddingRight
          },
          container: {
            width: contStyle.width,
            maxWidth: contStyle.maxWidth,
            computedWidth: container.offsetWidth,
            overflowX: contStyle.overflowX
          },
          visual: {
            width: visStyle.width,
            maxWidth: visStyle.maxWidth,
            computedWidth: visual.offsetWidth,
            overflowX: visStyle.overflowX
          },
          content: {
            width: contGridStyle.width,
            maxWidth: contGridStyle.maxWidth,
            computedWidth: content.offsetWidth,
            gridColumns: contGridStyle.gridTemplateColumns,
            overflowX: contGridStyle.overflowX
          }
        }
        
        fetch('http://127.0.0.1:7242/ingest/d49a13b0-00e3-4e4a-b9ad-aed46ce54a17', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'LandingHero.tsx:measureSubtitle',
            message: 'Subtitle dimensions and container constraints',
            data,
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'A,B,C,D,E'
          })
        }).catch(() => {})
      }
    }
    
    // Measure after animation completes
    setTimeout(measureSubtitle, 1000)
    window.addEventListener('resize', measureSubtitle)
    return () => window.removeEventListener('resize', measureSubtitle)
    // #endregion
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
            <span>
              {currentLanguage === 'pt-PT' ? 'JMSIT — Serviços de TI & Tecnologia' : 'JMSIT — IT & Technology Services'}
            </span>
          </div>
          
          <h1 className="hero-title">
            <span className="hero-title-main">{personal.name} <span className="brand-name"></span></span>
            <span className="hero-title-subtitle">{personal.title}</span>
          </h1>
          
          <p className="hero-tagline">{personal.tagline}</p>
          
          <p className="hero-summary">
            {currentLanguage === 'pt-PT'
              ? 'Especialista em desenvolvimento de software, automação e soluções tecnológicas. Ofereço serviços completos desde desenvolvimento full-stack e integração de IA até reparação de computadores, instalação de racks de servidores e consultoria em TI. Trabalho com empresas e particulares para criar soluções práticas que resolvem problemas reais e melhoram a eficiência operacional.'
              : 'Specialist in software development, automation, and technology solutions. I offer comprehensive services from full-stack development and AI integration to computer repair, server rack installation, and IT consulting. I work with businesses and individuals to create practical solutions that solve real problems and improve operational efficiency.'}
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
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onContactClick?.()
              }}
            >
              <span>{currentLanguage === 'pt-PT' ? 'Contacto' : 'Contact'}</span>
              <i className="fa-solid fa-comment-dots"></i>
            </button>
            
            <button 
              className="btn-hero-secondary"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <i className="fa-solid fa-briefcase"></i>
              <span>{currentLanguage === 'pt-PT' ? 'Serviços' : 'Services'}</span>
            </button>
            
            <button 
              className="btn-hero-secondary"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <i className="fa-solid fa-user"></i>
              <span>{currentLanguage === 'pt-PT' ? 'Sobre' : 'About'}</span>
            </button>
          </div>
        </div>
        
        <div className={`hero-visual ${isVisible ? 'hero-visual-visible' : ''}`}>
          <div className="hero-image-container">
            <div className="hero-logo-wrapper">
              <img 
                src={logoUrl} 
                alt={`${personal.name}  - Portfolio Logo`}
                className="hero-logo-image"
              />
              <div className="hero-image-border"></div>
            </div>
            <p className="hero-logo-subtitle">
              {(currentLanguage === 'pt-PT' 
                ? 'Segurança | Inteligência | Tecnologia'
                : 'Security | Intelligence | Technology')
                .split(' | ')
                .map((word, index, array) => (
                  <span key={index}>
                    <span className="hero-logo-subtitle-word">{word}</span>
                    {index < array.length - 1 && (
                      <span className="hero-logo-subtitle-separator"> | </span>
                    )}
                  </span>
                ))}
            </p>
          </div>
        </div>
      </div>
      
      <div className="hero-scroll-indicator">
        <div className="scroll-line"></div>
        <span>{currentLanguage === 'pt-PT' ? 'Deslize para explorar' : 'Scroll to explore'}</span>
      </div>
    </section>
  )
}
