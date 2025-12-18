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
                <li><a href="#features">{currentLanguage === 'pt-PT' ? 'Engenharia de Software Full-Stack' : 'Full-Stack Software Engineering'}</a></li>
                <li><a href="#features">{currentLanguage === 'pt-PT' ? 'Integração de IA e Automação' : 'AI Integration & Process Automation'}</a></li>
                <li><a href="#features">{currentLanguage === 'pt-PT' ? 'Aplicações Web Empresariais' : 'Enterprise Web Applications'}</a></li>
                <li><a href="#features">{currentLanguage === 'pt-PT' ? 'Infraestrutura Cloud' : 'Cloud Infrastructure & Solutions'}</a></li>
                <li><a href="#features">{currentLanguage === 'pt-PT' ? 'Transmissão em Direto e Overlays' : 'Live Streaming & Overlays'}</a></li>
                <li><a href="#features">{currentLanguage === 'pt-PT' ? 'Reparação e Manutenção de Computadores' : 'Computer Repair & Maintenance'}</a></li>
                <li><a href="#features">{currentLanguage === 'pt-PT' ? 'Consultoria em TI' : 'IT Consulting'}</a></li>
                <li><a href="#features">{currentLanguage === 'pt-PT' ? 'Instalação e Manutenção de Racks de Servidores' : 'Server Rack Installation & Maintenance'}</a></li>
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
            {/* TODO: Replace "JMSIT" with your brand name */}
            <p>&copy; {new Date().getFullYear()} JMSIT - {personal.name}. {currentLanguage === 'pt-PT' ? 'Todos os direitos reservados.' : 'All rights reserved.'}</p>
            <div className="footer-badges">
              <span className="footer-badge" title={currentLanguage === 'pt-PT' ? 'Conformidade WCAG 2.2 AA' : 'WCAG 2.2 AA Compliant'}>
                <i className="fa-solid fa-universal-access"></i>
                <span>WCAG 2.2 AA</span>
              </span>
              <span className="footer-badge" title={currentLanguage === 'pt-PT' ? 'Conformidade GDPR' : 'GDPR Compliant'}>
                <i className="fa-solid fa-shield-halved"></i>
                <span>GDPR</span>
              </span>
              <span className="footer-badge" title={currentLanguage === 'pt-PT' ? 'Otimizado para Core Web Vitals' : 'Core Web Vitals Optimized'}>
                <i className="fa-solid fa-gauge-high"></i>
                <span>Performance</span>
              </span>
            </div>
          </div>
          
          <div className="footer-tech-section">
          <div className="footer-tech">
            <span className="tech-label">{currentLanguage === 'pt-PT' ? 'Desenvolvido com:' : 'Built with:'}</span>
            <div className="tech-stack">
                <span className="tech-item" title="Preact - Fast 3kB alternative to React">Preact</span>
                <span className="tech-item" title="TypeScript - Typed JavaScript">TypeScript</span>
                <span className="tech-item" title="Vite - Next generation frontend tooling">Vite</span>
                <span className="tech-item" title="Vitest - Fast unit test framework">Vitest</span>
                <span className="tech-item" title="ESLint - Code quality tool">ESLint</span>
                <span className="tech-item" title="PostCSS - CSS processing tool">PostCSS</span>
              </div>
            </div>
            <div className="footer-project-info">
              <a 
                href="https://github.com/vunf1/portfolio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-github-link"
                title={currentLanguage === 'pt-PT' ? 'Ver código fonte no GitHub' : 'View source code on GitHub'}
              >
                <i className="fa-brands fa-github"></i>
                <span>{currentLanguage === 'pt-PT' ? 'Código Fonte' : 'Source Code'}</span>
              </a>
              <span className="footer-license">
                <i className="fa-solid fa-scale-balanced"></i>
                <span>MIT License</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
