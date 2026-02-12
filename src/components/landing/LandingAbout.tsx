import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Icon } from '../ui/Icon'
import type { Personal, Social } from '../../types/portfolio'
import profileUrl from '@/img/profile.jpg'

interface LandingAboutProps {
  personal: Personal
  social: Social[]
  className?: string
  onNavigateToPortfolio: () => void
  onWarmPortfolio?: () => void
}

export function LandingAbout({ personal, social, className = '', onNavigateToPortfolio, onWarmPortfolio }: LandingAboutProps) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const ctaRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('about')
    if (element) {
      sectionObserver.observe(element)
    }

    return () => sectionObserver.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!onWarmPortfolio || typeof IntersectionObserver === 'undefined') {
      return
    }

    const el = ctaRef.current
    if (!el || !(el instanceof Element)) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            onWarmPortfolio()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [onWarmPortfolio])

  const handleWarmIntent = () => {
    onWarmPortfolio?.()
  }

  return (
    <section id="about" className={`landing-about landing-section ${className}`}>
      <div className="about-container">
        <div className={`about-header ${isVisible ? 'about-header-visible' : ''}`}>
          <h2 className="about-title">
            <span className="about-title-main">{t('landing.about.title')}</span>
          </h2>
          <p className="about-subtitle">{t('landing.about.subtitle')}</p>
        </div>
        
        <div className={`about-content ${isVisible ? 'about-content-visible' : ''}`}>
          <div className="about-text">
            <div className="about-profile-section">
              <picture className="about-profile-picture">
                <img 
                  src={profileUrl} 
                  alt={`${personal?.name || 'Portfolio'} - ${personal?.title || ''}`}
                  className="about-profile-image"
                />
              </picture>
              
              <div className="about-profile-info">
                <h3 className="about-profile-name">{personal?.name || ''}</h3>
                <p className="about-profile-title">{personal?.title || ''}</p>
                <p className="about-profile-tagline">{personal?.tagline || ''}</p>
              </div>
            </div>
            
            <p className="about-description">{t('landing.about.description')}</p>
            
            <Card variant="default" hover={false} className="about-details-card">
              <div className="about-details">
                <div className="about-detail-item">
                  <Icon name="map-marker-alt" size={18} />
                  <div>
                    <strong>{t('landing.about.location')}</strong>
                    <p>{personal?.location || ''}</p>
                  </div>
                </div>
                
                <div className="about-detail-item">
                  <Icon name="clock" size={18} />
                  <div>
                    <strong>{t('landing.about.availability')}</strong>
                    <p>{personal?.availability || ''}</p>
                  </div>
                </div>
                
                {personal.remote && (
                  <div className="about-detail-item">
                    <Icon name="laptop" size={18} />
                    <div>
                      <strong>{t('landing.about.remoteWork')}</strong>
                      <p>{personal.remote}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            
            <div className="about-actions">
              <Button
                ref={ctaRef}
                variant="primaryElevated"
                size="lg"
                className="about-cta-primary"
                onClick={onNavigateToPortfolio}
                onMouseEnter={handleWarmIntent}
                onFocus={handleWarmIntent}
                onTouchStart={handleWarmIntent}
              >
                {t('landing.about.ctaSkills')}
              </Button>
            </div>
          </div>
          
          <div className="about-sidebar">
            <Card 
              variant="default" 
              title={t('landing.about.coreValues')} 
              hover={false}
              className="about-core-values-card"
            >
              <ul className="core-values-list">
                {personal.coreValues.map((value, index) => (
                  <li key={index} className="core-value-item">
                    <Icon name="check-circle" size={18} />
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </Card>
            
            <Card 
              variant="default" 
              title={t('landing.about.connectWithMe')} 
              hover={false}
              className="about-social-card"
            >
              <div className="social-links-grid">
                {social
                  .filter((socialItem) => socialItem.name !== 'Portfolio' && socialItem.name !== 'Carteira')
                  .map((socialItem) => (
                    <a 
                      key={socialItem.name} 
                      href={socialItem.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link-item"
                      style={{ '--social-color': socialItem.color || '#3b82f6' }}
                      title={socialItem.description}
                    >
                      <Icon name={socialItem.icon} size={16} aria-hidden />
                      <span className="social-name">{socialItem.name}</span>
                    </a>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
