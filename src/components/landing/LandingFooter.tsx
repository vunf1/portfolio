import { useTranslation } from '../../contexts/TranslationContext'
import type { Personal, Social } from '../../types/portfolio'

interface LandingFooterProps {
  personal: Personal
  social: Social[]
  className?: string
}

export function LandingFooter({ personal, social, className = '' }: LandingFooterProps) {
  const { currentLanguage } = useTranslation()

  return (
    <footer className={`landing-footer landing-section ${className}`}>
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-title">{personal.name}</h3>
            <p className="footer-subtitle">{personal.title}</p>
            <p className="footer-description">
              {personal.tagline}
            </p>
            
            <div className="footer-contact">
              {personal.location && (
                <div className="footer-contact-item">
                  <i className="fa-solid fa-map-marker-alt"></i>
                  <span>{personal.location}</span>
                </div>
              )}
              {personal.availability && (
                <div className="footer-contact-item">
                  <i className="fa-solid fa-clock"></i>
                  <span>{personal.availability}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h4 className="footer-section-title">
                {currentLanguage === 'pt-PT' ? 'Navegação' : 'Navigation'}
              </h4>
              <ul className="footer-list">
                <li>
                  <a href="#about" onClick={(e) => { 
                    e.preventDefault(); 
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); 
                  }}>
                    {currentLanguage === 'pt-PT' ? 'Sobre' : 'About'}
                  </a>
                </li>
                <li>
                  <a href="#features" onClick={(e) => { 
                    e.preventDefault(); 
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); 
                  }}>
                    {currentLanguage === 'pt-PT' ? 'Serviços' : 'Services'}
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { 
                    e.preventDefault(); 
                    window.dispatchEvent(new CustomEvent('navigateToPortfolio')); 
                  }}>
                    {currentLanguage === 'pt-PT' ? 'Experiência' : 'Experience'}
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { 
                    e.preventDefault(); 
                    window.dispatchEvent(new CustomEvent('navigateToPortfolio')); 
                  }}>
                    {currentLanguage === 'pt-PT' ? 'Projetos' : 'Projects'}
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-section-title">
                {currentLanguage === 'pt-PT' ? 'Especialidades' : 'Expertise'}
              </h4>
              <ul className="footer-list">
                <li><a href="#features">{currentLanguage === 'pt-PT' ? 'IA e Automação' : 'AI & Automation'}</a></li>
                <li><a href="#features">{currentLanguage === 'pt-PT' ? 'Desenvolvimento Full Stack' : 'Full Stack Development'}</a></li>
                <li><a href="#features">{currentLanguage === 'pt-PT' ? 'Aplicações Web' : 'Web Applications'}</a></li>
                <li><a href="#features">{currentLanguage === 'pt-PT' ? 'Soluções Cloud' : 'Cloud Solutions'}</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-section-title">
                {currentLanguage === 'pt-PT' ? 'Contacto' : 'Contact'}
              </h4>
              <ul className="footer-list">
                {social.map((socialItem) => (
                  <li key={socialItem.name}>
                    <a 
                      href={socialItem.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {socialItem.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {new Date().getFullYear()} {personal.name}. {currentLanguage === 'pt-PT' ? 'Todos os direitos reservados.' : 'All rights reserved.'}</p>
          </div>
          
          <div className="footer-tech">
            <span className="tech-label">{currentLanguage === 'pt-PT' ? 'Desenvolvido com:' : 'Built with:'}</span>
            <div className="tech-stack">
              <span className="tech-item">Preact</span>
              <span className="tech-item">TypeScript</span>
              <span className="tech-item">Vite</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
