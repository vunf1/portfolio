import { useEffect, useState } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'

interface LandingAboutProps {
  className?: string
  onNavigateToPortfolio: () => void
}

export function LandingAbout({ className = '', onNavigateToPortfolio }: LandingAboutProps) {
  const { t } = useTranslation()
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
    <section id="about" className={`landing-about ${className}`}>
      <div className="about-container">
        <div className={`about-content ${isVisible ? 'about-content-visible' : ''}`}>
          <div className="about-text">
            <h2 className="about-title">
              <span className="about-title-main">Meet</span>
              <span className="about-title-accent">João Maia</span>
            </h2>
            
            <p className="about-description">
              A passionate Full Stack Engineer specializing in Generative AI and automation, 
              based in Porto, Portugal. With over a decade of experience in programming 
              methodologies and computer science fundamentals, I build intelligent systems 
              that bridge the gap between human creativity and artificial intelligence.
            </p>
            
            <div className="about-highlights">
              <div className="highlight-item">
                <div className="highlight-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="highlight-content">
                  <h4>AI Specialization</h4>
                  <p>Expert in prompt engineering and AI-powered feature development</p>
                </div>
              </div>
              
              <div className="highlight-item">
                <div className="highlight-icon">
                  <i className="fas fa-code"></i>
                </div>
                <div className="highlight-content">
                  <h4>Full Stack Expertise</h4>
                  <p>End-to-end development from backend services to frontend applications</p>
                </div>
              </div>
              
              <div className="highlight-item">
                <div className="highlight-icon">
                  <i className="fas fa-cloud"></i>
                </div>
                <div className="highlight-content">
                  <h4>Cloud Solutions</h4>
                  <p>Scalable and secure cloud-based applications and automation workflows</p>
                </div>
              </div>
            </div>
            
            <div className="about-actions">
              <button 
                className="btn-about-primary"
                onClick={onNavigateToPortfolio}
              >
                <span>View Full Portfolio</span>
                <i className="fas fa-arrow-right"></i>
              </button>
              
              <button 
                className="btn-about-secondary"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <i className="fas fa-info-circle"></i>
                <span>Learn More</span>
              </button>
            </div>
          </div>
          
          <div className="about-visual">
            <div className="about-image">
              <div className="image-placeholder">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="image-overlay">
                <div className="overlay-content">
                  <h4>Full Stack Engineer</h4>
                  <p>Generative AI & Automation</p>
                </div>
              </div>
            </div>
            
            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number">10+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Projects Completed</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="about-values">
          <h3 className="values-title">Core Values</h3>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">
                <i className="fas fa-users"></i>
              </div>
              <h4>User Impact First</h4>
              <p>Every solution is designed with the end user in mind, ensuring maximum value and usability.</p>
            </div>
            
            <div className="value-item">
              <div className="value-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h4>Security & Privacy</h4>
              <p>Security and privacy are built into every solution from the ground up, not added as an afterthought.</p>
            </div>
            
            <div className="value-item">
              <div className="value-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h4>Responsible AI</h4>
              <p>Transparent and ethical AI implementation that enhances human capabilities without replacing them.</p>
            </div>
            
            <div className="value-item">
              <div className="value-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h4>Continuous Learning</h4>
              <p>Ship in small, safe increments to learn faster and deliver value more effectively.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
