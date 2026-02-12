import { useEffect, useState } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import { Icon } from '../ui/Icon'
import type { Personal } from '../../types/portfolio'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

interface LandingFeaturesProps {
  personal: Personal
  className?: string
}

export function LandingFeatures({ className = '' }: LandingFeaturesProps) {
  const { t } = useTranslation()
  const [activeService, setActiveService] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const services: Service[] = [
    { id: 'full-stack', title: t('landing.features.expertiseItems.fullStackEng'), description: t('landing.features.expertiseItems.fullStackEngDesc'), icon: 'fa-solid fa-code', color: '#3b82f6' },
    { id: 'ai-automation', title: t('landing.features.expertiseItems.aiAutomation'), description: t('landing.features.expertiseItems.aiAutomationDesc'), icon: 'fa-solid fa-robot', color: '#8b5cf6' },
    { id: 'web-applications', title: t('landing.features.expertiseItems.enterpriseWeb'), description: t('landing.features.expertiseItems.enterpriseWebDesc'), icon: 'fa-solid fa-globe', color: '#06b6d4' },
    { id: 'cloud-solutions', title: t('landing.features.expertiseItems.cloudInfra'), description: t('landing.features.expertiseItems.cloudInfraDesc'), icon: 'fa-solid fa-cloud', color: '#10b981' },
    { id: 'live-streaming', title: t('landing.features.expertiseItems.liveStreaming'), description: t('landing.features.expertiseItems.liveStreamingDesc'), icon: 'fa-solid fa-video', color: '#ef4444' },
    { id: 'computer-repair', title: t('landing.features.expertiseItems.computerRepair'), description: t('landing.features.expertiseItems.computerRepairDesc'), icon: 'fa-solid fa-screwdriver-wrench', color: '#f59e0b' },
    { id: 'it-consulting', title: t('landing.features.expertiseItems.itConsulting'), description: t('landing.features.expertiseItems.itConsultingDesc'), icon: 'fa-solid fa-lightbulb', color: '#6366f1' },
    { id: 'server-rack', title: t('landing.features.expertiseItems.serverRack'), description: t('landing.features.expertiseItems.serverRackDesc'), icon: 'fa-solid fa-server', color: '#14b8a6' }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('features')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [services.length])

  return (
    <section id="features" className={`landing-features landing-section ${className}`}>
      <div className="features-container">
        <div className={`features-header ${isVisible ? 'features-header-visible' : ''}`}>
          <h2 className="features-title">
            <span className="features-title-main">{t('landing.features.servicesAnd')}</span>
            <span className="features-title-accent">{t('landing.features.expertise')}</span>
          </h2>
          <p className="features-subtitle">
            {t('landing.features.subtitle', undefined, { brand: t('landing.features.brandName') })}
          </p>
        </div>

        <div className="features-grid">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`feature-card ${activeService === index ? 'feature-card-active' : ''} ${isVisible ? 'feature-card-visible' : ''}`}
              style={{ '--delay': `${index * 0.15}s`, '--service-color': service.color }}
              onMouseEnter={() => setActiveService(index)}
              onFocus={() => setActiveService(index)}
            >
              <div className="feature-card-inner">
                <div className="feature-icon" style={{ '--feature-color': service.color }}>
                  <Icon name={service.icon} size={28} />
                </div>
                
                <div className="feature-content">
                  <h3 className="feature-title">{service.title}</h3>
                  <p className="feature-description">{service.description}</p>
                </div>
                
                <div className="feature-indicator">
                  <div className="indicator-line"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="features-approach">
          <div className={`approach-content ${isVisible ? 'approach-content-visible' : ''}`}>
            <div className="approach-text">
              <h3 className="approach-title">{t('landing.features.howIWork')}</h3>
              <p className="approach-description">{t('landing.features.approachDescription')}</p>
              
              <div className="approach-highlights">
                <div className="approach-highlight">
                  <Icon name="check-circle" size={20} />
                  <span>
                    {t('landing.features.approachHighlight1')}
                  </span>
                </div>
                <div className="approach-highlight">
                  <Icon name="check-circle" size={20} />
                  <span>
                    {t('landing.features.approachHighlight2')}
                  </span>
                </div>
                <div className="approach-highlight">
                  <Icon name="check-circle" size={20} />
                  <span>
                    {t('landing.features.approachHighlight3')}
                  </span>
                </div>
                <div className="approach-highlight">
                  <Icon name="check-circle" size={20} />
                  <span>
                    {t('landing.features.approachHighlight4')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="approach-visual">
              <div className="approach-card">
                <div className="approach-card-header">
                  <div className="approach-card-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="approach-card-body">
                  <div className="approach-stats">
                    <div className="approach-stat">
                      <div className="approach-stat-icon">
                        <Icon name="handshake" size={24} />
                      </div>
                      <div className="approach-stat-content">
                        <h4>
                          {t('landing.features.partnership')}
                        </h4>
                        <p>{t('landing.features.partnershipDesc')}</p>
                      </div>
                    </div>
                    
                    <div className="approach-stat">
                      <div className="approach-stat-icon">
                        <Icon name="clock" size={24} />
                      </div>
                      <div className="approach-stat-content">
                        <h4>
                          {t('landing.features.realisticTimelines')}
                        </h4>
                        <p>{t('landing.features.realisticTimelinesDesc')}</p>
                      </div>
                    </div>
                    
                    <div className="approach-stat">
                      <div className="approach-stat-icon">
                        <Icon name="heart" size={24} />
                      </div>
                      <div className="approach-stat-content">
                        <h4>
                          {t('landing.features.dedicatedSupport')}
                        </h4>
                        <p>{t('landing.features.dedicatedSupportDesc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
