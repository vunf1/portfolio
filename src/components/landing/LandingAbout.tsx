import { useEffect, useState } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import type { Personal, Social } from '../../types/portfolio'

interface LandingAboutProps {
  personal: Personal
  social: Social[]
  className?: string
  onNavigateToPortfolio: () => void
}

export function LandingAbout({ personal, social, className = '', onNavigateToPortfolio }: LandingAboutProps) {
  const { t, currentLanguage } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('about')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className={`landing-about landing-section ${className}`}>
      <div className="about-container">
        <div className={`about-header ${isVisible ? 'about-header-visible' : ''}`}>
          <h2 className="about-title">
            <span className="about-title-main">{currentLanguage === 'pt-PT' ? 'Sobre' : 'About'}</span>
          </h2>
          <p className="about-subtitle">{personal.subtitle}</p>
        </div>
        
        <div className={`about-content ${isVisible ? 'about-content-visible' : ''}`}>
          <div className="about-text">
            <div className="about-profile-section">
              <picture className="about-profile-picture">
                <source srcSet="./img/optimized/profile-lg.avif" type="image/avif" />
                <source srcSet="./img/optimized/profile-lg.webp" type="image/webp" />
                <source srcSet="./img/optimized/profile-lg.jpeg" type="image/jpeg" />
                <img 
                  src={personal.profileImage} 
                  alt={`${personal.name} - ${personal.title}`}
                  className="about-profile-image"
                />
              </picture>
              
              <div className="about-profile-info">
                <h3 className="about-profile-name">{personal.name}</h3>
                <p className="about-profile-title">{personal.title}</p>
                <p className="about-profile-tagline">{personal.tagline}</p>
              </div>
            </div>
            
            <p className="about-description">
              {personal.longSummary || personal.summary}
            </p>
            
            <div className="about-details">
              <div className="about-detail-item">
                <i className="fa-solid fa-map-marker-alt"></i>
                <div>
                  <strong>{currentLanguage === 'pt-PT' ? 'Localização' : 'Location'}</strong>
                  <p>{personal.location}</p>
                </div>
              </div>
              
              <div className="about-detail-item">
                <i className="fa-solid fa-clock"></i>
                <div>
                  <strong>{currentLanguage === 'pt-PT' ? 'Disponibilidade' : 'Availability'}</strong>
                  <p>{personal.availability}</p>
                </div>
              </div>
              
              {personal.remote && (
                <div className="about-detail-item">
                  <i className="fa-solid fa-laptop"></i>
                  <div>
                    <strong>{currentLanguage === 'pt-PT' ? 'Trabalho Remoto' : 'Remote Work'}</strong>
                    <p>{personal.remote}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="about-actions">
              <button
                className="btn-about-primary"
                onClick={onNavigateToPortfolio}
              >
                <i className="fa-solid fa-arrow-right"></i>
                <span>{currentLanguage === 'pt-PT' ? 'Ver Portfolio Completo' : 'View Full Portfolio'}</span>
              </button>
            </div>
          </div>
          
          <div className="about-sidebar">
            <div className="about-core-values">
              <h3 className="core-values-title">
                {currentLanguage === 'pt-PT' ? 'Valores Fundamentais' : 'Core Values'}
              </h3>
              <ul className="core-values-list">
                {personal.coreValues.map((value, index) => (
                  <li key={index} className="core-value-item">
                    <i className="fa-solid fa-check-circle"></i>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="about-social">
              <h3 className="social-title">
                {currentLanguage === 'pt-PT' ? 'Conecte-se Comigo' : 'Connect with Me'}
              </h3>
              <div className="social-links-grid">
                {social.map((socialItem) => (
                  <a 
                    key={socialItem.name} 
                    href={socialItem.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link-item"
                    style={{ '--social-color': socialItem.color || '#3b82f6' }}
                  >
                    <i className={`fa ${socialItem.icon}`}></i>
                    <span className="social-name">{socialItem.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
