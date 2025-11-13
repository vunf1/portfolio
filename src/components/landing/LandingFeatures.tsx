import { useEffect, useState } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
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

export function LandingFeatures({ personal, className = '' }: LandingFeaturesProps) {
  const { currentLanguage } = useTranslation()
  const [activeService, setActiveService] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const services: Service[] = [
    {
      id: 'full-stack',
      title: currentLanguage === 'pt-PT' ? 'Desenvolvimento Full Stack' : 'Full Stack Development',
      description: currentLanguage === 'pt-PT' 
        ? 'Desenvolvimento completo de aplicações desde o frontend até o backend, incluindo arquitetura de base de dados e integração de sistemas.'
        : 'Comprehensive application development from frontend to backend, including database architecture and system integration.',
      icon: 'fa-solid fa-code',
      color: '#3b82f6'
    },
    {
      id: 'ai-automation',
      title: currentLanguage === 'pt-PT' ? 'IA e Automação' : 'AI & Automation',
      description: currentLanguage === 'pt-PT'
        ? 'Integração de inteligência artificial e automação de processos para melhorar eficiência operacional e experiência do utilizador.'
        : 'Artificial intelligence integration and process automation to improve operational efficiency and user experience.',
      icon: 'fa-solid fa-robot',
      color: '#8b5cf6'
    },
    {
      id: 'web-applications',
      title: currentLanguage === 'pt-PT' ? 'Aplicações Web' : 'Web Applications',
      description: currentLanguage === 'pt-PT'
        ? 'Desenvolvimento de aplicações web modernas, responsivas e performantes utilizando tecnologias de ponta e melhores práticas.'
        : 'Development of modern, responsive, and performant web applications using cutting-edge technologies and best practices.',
      icon: 'fa-solid fa-globe',
      color: '#06b6d4'
    },
    {
      id: 'cloud-solutions',
      title: currentLanguage === 'pt-PT' ? 'Soluções Cloud' : 'Cloud Solutions',
      description: currentLanguage === 'pt-PT'
        ? 'Implementação de soluções em nuvem escaláveis e seguras para aplicações empresariais e sistemas distribuídos.'
        : 'Implementation of scalable and secure cloud solutions for enterprise applications and distributed systems.',
      icon: 'fa-solid fa-cloud',
      color: '#10b981'
    }
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
            <span className="features-title-main">
              {currentLanguage === 'pt-PT' ? 'Serviços e' : 'Services &'}
            </span>
            <span className="features-title-accent">
              {currentLanguage === 'pt-PT' ? 'Especialidades' : 'Expertise'}
            </span>
          </h2>
          <p className="features-subtitle">
            {currentLanguage === 'pt-PT'
              ? 'Soluções profissionais de desenvolvimento de software com foco em qualidade, eficiência e inovação'
              : 'Professional software development solutions focused on quality, efficiency, and innovation'}
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
                  <i className={service.icon}></i>
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
              <h3 className="approach-title">
                {currentLanguage === 'pt-PT' ? 'Abordagem Profissional' : 'Professional Approach'}
              </h3>
              <p className="approach-description">
                {personal.summary}
              </p>
              
              <div className="approach-highlights">
                <div className="approach-highlight">
                  <i className="fa-solid fa-check-circle"></i>
                  <span>
                    {currentLanguage === 'pt-PT' ? 'Desenvolvimento Orientado ao Utilizador' : 'User-Centered Development'}
                  </span>
                </div>
                <div className="approach-highlight">
                  <i className="fa-solid fa-check-circle"></i>
                  <span>
                    {currentLanguage === 'pt-PT' ? 'Qualidade e Segurança' : 'Quality & Security'}
                  </span>
                </div>
                <div className="approach-highlight">
                  <i className="fa-solid fa-check-circle"></i>
                  <span>
                    {currentLanguage === 'pt-PT' ? 'Inovação Contínua' : 'Continuous Innovation'}
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
                        <i className="fa-solid fa-code-branch"></i>
                      </div>
                      <div className="approach-stat-content">
                        <h4>
                          {currentLanguage === 'pt-PT' ? 'Desenvolvimento' : 'Development'}
                        </h4>
                        <p>
                          {currentLanguage === 'pt-PT' ? 'End-to-end' : 'End-to-end'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="approach-stat">
                      <div className="approach-stat-icon">
                        <i className="fa-solid fa-shield-halved"></i>
                      </div>
                      <div className="approach-stat-content">
                        <h4>
                          {currentLanguage === 'pt-PT' ? 'Segurança' : 'Security'}
                        </h4>
                        <p>
                          {currentLanguage === 'pt-PT' ? 'Prioritizada' : 'Prioritized'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="approach-stat">
                      <div className="approach-stat-icon">
                        <i className="fa-solid fa-rocket"></i>
                      </div>
                      <div className="approach-stat-content">
                        <h4>
                          {currentLanguage === 'pt-PT' ? 'Performance' : 'Performance'}
                        </h4>
                        <p>
                          {currentLanguage === 'pt-PT' ? 'Otimizada' : 'Optimized'}
                        </p>
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
