import { useEffect, useState } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import type { Personal } from '../../types/portfolio'
import logoUrl from '@/img/logo.png'

interface LandingHeroProps {
  personal: Personal
  className?: string
}

export function LandingHero({ personal, className = '' }: LandingHeroProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { t, currentLanguage } = useTranslation()

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
            <span>
              {currentLanguage === 'pt-PT' ? 'Serviços de TI & Tecnologia' : 'IT & Technology Services'}
            </span>
          </div>
          
          <h1 className="hero-title">
            <span className="hero-title-main">{personal.name}</span>
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
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>{currentLanguage === 'pt-PT' ? 'Saber Mais' : 'Learn More'}</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
            
            <button 
              className="btn-hero-secondary"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <i className="fa-solid fa-briefcase"></i>
              <span>{currentLanguage === 'pt-PT' ? 'Serviços' : 'Services'}</span>
            </button>
          </div>
        </div>
        
        <div className={`hero-visual ${isVisible ? 'hero-visual-visible' : ''}`}>
          <div className="hero-image-container">
            <div className="hero-logo-wrapper">
              <img 
                src={logoUrl} 
                alt={`${personal.name} - Portfolio Logo`}
                className="hero-logo-image"
              />
              <div className="hero-image-border"></div>
            </div>
            <p className="hero-logo-subtitle">
              {currentLanguage === 'pt-PT' 
                ? 'Segurança | Inteligência | Tecnologia'
                : 'Security | Intelligence | Technology'}
            </p>
          </div>
          
          <div className="hero-highlights">
            <div className="hero-highlight-item">
              <div className="highlight-icon">
                <i className="fa-solid fa-code"></i>
              </div>
              <div className="highlight-text">
                <h4>{currentLanguage === 'pt-PT' ? 'Engenharia Full-Stack' : 'Full-Stack Engineering'}</h4>
                <p>{currentLanguage === 'pt-PT' ? 'Soluções completas' : 'End-to-end solutions'}</p>
              </div>
            </div>
            
            <div className="hero-highlight-item">
              <div className="highlight-icon">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div className="highlight-text">
                <h4>{currentLanguage === 'pt-PT' ? 'IA e Automação' : 'AI & Automation'}</h4>
                <p>{currentLanguage === 'pt-PT' ? 'Fluxos de trabalho inteligentes' : 'Intelligent workflows'}</p>
              </div>
            </div>
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
