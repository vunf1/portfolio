import { useTranslation } from '../../contexts/TranslationContext'
import { Icon } from '../ui/Icon'
import type { Personal, Social } from '../../types/portfolio'

interface LandingFooterProps {
  personal: Personal
  social: Social[]
  className?: string
}

export function LandingFooter({ personal, social, className = '' }: LandingFooterProps) {
  const { t } = useTranslation()

  return (
    <footer className={`landing-footer landing-section ${className}`}>
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-title">{personal?.name || ''}</h3>
            <p className="footer-subtitle">{personal?.title || ''}</p>
            <p className="footer-description">
              {personal?.tagline || ''}
            </p>
            
            <div className="footer-contact">
              {personal.location && (
                <div className="footer-contact-item">
                  <Icon name="map-marker-alt" size={18} />
                  <span>{personal.location}</span>
                </div>
              )}
              {personal.availability && (
                <div className="footer-contact-item">
                  <Icon name="clock" size={18} />
                  <span>{personal.availability}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h4 className="footer-section-title">{t('landing.footer.navigation')}</h4>
              <ul className="footer-list">
                <li>
                  <a href="#about" onClick={(e) => { 
                    e.preventDefault(); 
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); 
                  }}>
                    {t('landing.footer.about')}
                  </a>
                </li>
                <li>
                  <a href="#features" onClick={(e) => { 
                    e.preventDefault(); 
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); 
                  }}>
                    {t('landing.footer.services')}
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { 
                    e.preventDefault(); 
                    window.dispatchEvent(new CustomEvent('navigateToPortfolio')); 
                  }}>
                    {t('landing.footer.experience')}
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { 
                    e.preventDefault(); 
                    window.dispatchEvent(new CustomEvent('navigateToPortfolio')); 
                  }}>
                    {t('landing.footer.projects')}
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-section-title">
                {t('landing.footer.expertise')}
              </h4>
              <ul className="footer-list">
                <li><a href="#features">{t('landing.features.expertiseItems.fullStackEng')}</a></li>
                <li><a href="#features">{t('landing.features.expertiseItems.aiAutomation')}</a></li>
                <li><a href="#features">{t('landing.features.expertiseItems.enterpriseWeb')}</a></li>
                <li><a href="#features">{t('landing.features.expertiseItems.cloudInfra')}</a></li>
                <li><a href="#features">{t('landing.features.expertiseItems.liveStreaming')}</a></li>
                <li><a href="#features">{t('landing.features.expertiseItems.computerRepair')}</a></li>
                <li><a href="#features">{t('landing.features.expertiseItems.itConsulting')}</a></li>
                <li><a href="#features">{t('landing.features.expertiseItems.serverRack')}</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-section-title">
                {t('landing.footer.contact')}
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
            <p>&copy; {new Date().getFullYear()} JMSIT - {personal?.name || 'Portfolio'}. {t('landing.footer.copyright')}</p>
            <div className="footer-badges">
              <span className="footer-badge" title={t('landing.footer.wcagBadge')}>
                <Icon name="universal-access" size={20} />
                <span>WCAG 2.2 AA</span>
              </span>
              <span className="footer-badge" title={t('landing.footer.gdprBadge')}>
                <Icon name="shield-halved" size={20} />
                <span>GDPR</span>
              </span>
              <span className="footer-badge" title={t('landing.footer.perfBadge')}>
                <Icon name="gauge-high" size={20} />
                <span>Performance</span>
              </span>
            </div>
          </div>
          
          <div className="footer-tech-section">
          <div className="footer-tech">
            <span className="tech-label">{t('landing.footer.builtWith')}</span>
            <div className="tech-stack">
                <span className="tech-item" title={t('landing.footer.techPreact')}>Preact</span>
                <span className="tech-item" title={t('landing.footer.techTypescript')}>TypeScript</span>
                <span className="tech-item" title={t('landing.footer.techVite')}>Vite</span>
                <span className="tech-item" title={t('landing.footer.techTailwind')}>Tailwind</span>
              </div>
            </div>
            <div className="footer-project-info">
              <a 
                href="https://github.com/vunf1/portfolio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-github-link"
                title={t('landing.footer.viewSourceOnGitHub')}
              >
                <Icon name="github" size={20} />
                <span>{t('landing.footer.sourceCode')}</span>
              </a>
              <span className="footer-license">
                <Icon name="scale-balanced" size={20} />
                <span>{t('landing.footer.mitLicense')}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
