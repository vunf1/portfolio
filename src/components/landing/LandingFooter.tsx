import { useTranslation } from '../../contexts/TranslationContext'

interface LandingFooterProps {
  className?: string
}

export function LandingFooter({ className = '' }: LandingFooterProps) {
  const { t } = useTranslation()

  return (
    <footer className={`landing-footer ${className}`}>
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-title">João Maia</h3>
            <p className="footer-subtitle">Full Stack Engineer</p>
            <p className="footer-description">
              Specializing in Generative AI and automation solutions that drive innovation and efficiency.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h4 className="footer-section-title">Portfolio</h4>
              <ul className="footer-list">
                <li><a href="#about">About</a></li>
                <li><a href="#features">Services</a></li>
                <li><a href="#about">Experience</a></li>
                <li><a href="#about">Projects</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-section-title">Expertise</h4>
              <ul className="footer-list">
                <li><a href="#features">AI Integration</a></li>
                <li><a href="#features">Full Stack Development</a></li>
                <li><a href="#features">Process Automation</a></li>
                <li><a href="#features">Cloud Solutions</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-section-title">Connect</h4>
              <ul className="footer-list">
                <li><a href="https://github.com/vunf1" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="https://linkedin.com/in/joaomaia" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a href="mailto:joaomaia.trabalho@gmail.com">Email</a></li>
                <li><a href="#about">Portfolio</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2024 João Maia. All rights reserved.</p>
            <p>Built with modern web technologies and AI-powered development practices.</p>
          </div>
          
          <div className="footer-tech">
            <span className="tech-label">Powered by:</span>
            <div className="tech-stack">
              <span className="tech-item">React</span>
              <span className="tech-item">TypeScript</span>
              <span className="tech-item">Vite</span>
              <span className="tech-item">AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
