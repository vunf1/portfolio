import { useEffect, useState } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import type { Personal } from '../../types/portfolio'
import logoUrl from '@/img/logo.png'

interface LandingHeroProps {
  personal: Personal
  className?: string
  onContactClick?: () => void
}

export function LandingHero({ personal, className = '', onContactClick }: LandingHeroProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className={`landing-hero landing-section ${className}`}>
      <div className="hero-content">
        <div className={`hero-text ${isVisible ? 'hero-text-visible' : ''}`}>

          
          <h1 className="hero-title">          <div className="hero-badge">
            {/* TODO: Replace "JMSIT" with your brand name */}
            <span>{t('landing.hero.badge')}</span>
          </div>
            <span className="hero-title-main">{personal?.name || 'Portfolio'} <span className="brand-name"></span></span>
            <span className="hero-title-subtitle">{personal?.title || ''}</span>
          </h1>
          
          <p className="hero-tagline">{personal?.tagline || ''}</p>
          
          <p className="hero-summary">{t('landing.hero.summary')}</p>
          
          <div className="hero-meta">
            {personal?.location && (
              <div className="hero-meta-item">
                <Icon name="location-dot" size={18} />
                <span>{personal.location}</span>
              </div>
            )}
            {personal?.availability && (
              <div className="hero-meta-item">
                <Icon name="user-tie" size={18} />
                <span>{personal.availability}</span>
              </div>
            )}
          </div>
          
          <div className="hero-actions hero-actions-row flex flex-wrap gap-3">
            <Button
              variant="primaryElevated"
              size="lg"
              className="hero-cta-contact min-w-[140px]"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onContactClick?.()
              }}
            >
              {t('landing.hero.ctaContact')}
            </Button>
            <Button
              variant="outlineElevated"
              size="lg"
              className="hero-cta-services min-w-[140px]"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('landing.hero.ctaServices')}
            </Button>
            <Button
              variant="outlineElevated"
              size="lg"
              className="hero-cta-about min-w-[140px]"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('landing.hero.ctaAbout')}
            </Button>
          </div>
        </div>
        
        <div className={`hero-visual ${isVisible ? 'hero-visual-visible' : ''}`}>
          <div className="hero-image-container">
            <div className="hero-logo-wrapper">
              <img 
                src={logoUrl} 
                alt={`${personal?.name || 'Portfolio'} - Portfolio Logo`}
                className="hero-logo-image"
              />
              <div className="hero-image-border"></div>
            </div>
            <p className="hero-logo-subtitle">
              {t('landing.hero.logoSubtitle')
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
    </section>
  )
}
