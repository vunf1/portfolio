import { useEffect, useState } from 'preact/hooks'

interface Feature {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

interface LandingFeaturesProps {
  className?: string
}

export function LandingFeatures({ className = '' }: LandingFeaturesProps) {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const features: Feature[] = [
    {
      id: 'ai-integration',
      title: 'AI Integration',
      description: 'Seamlessly integrate generative AI and machine learning models into web applications, creating intelligent user experiences.',
      icon: 'fas fa-robot',
      color: 'var(--color-primary)'
    },
    {
      id: 'full-stack',
      title: 'Full Stack Development',
      description: 'Complete end-to-end development from database design to user interface, ensuring scalable and maintainable solutions.',
      icon: 'fas fa-layer-group',
      color: 'var(--color-secondary)'
    },
    {
      id: 'automation',
      title: 'Process Automation',
      description: 'Design and implement intelligent automation workflows that enhance efficiency and reduce manual intervention.',
      icon: 'fas fa-cogs',
      color: 'var(--color-accent)'
    },
    {
      id: 'cloud-solutions',
      title: 'Cloud Solutions',
      description: 'Deploy and manage applications on cloud platforms with focus on scalability, security, and performance optimization.',
      icon: 'fas fa-cloud',
      color: 'var(--color-success)'
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
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [features.length])

  return (
    <section id="features" className={`landing-features ${className}`}>
      <div className="features-container">
        <div className={`features-header ${isVisible ? 'features-header-visible' : ''}`}>
          <h2 className="features-title">
            <span className="features-title-main">Why Choose</span>
            <span className="features-title-accent">AI-Powered Development</span>
          </h2>
          <p className="features-subtitle">
            Experience the future of software development with intelligent automation and cutting-edge AI integration
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`feature-card ${activeFeature === index ? 'feature-card-active' : ''} ${isVisible ? 'feature-card-visible' : ''}`}
              style={{ '--delay': `${index * 0.1}s` }}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="feature-card-inner">
                <div 
                  className="feature-icon"
                  style={{ '--feature-color': feature.color }}
                >
                  <i className={feature.icon}></i>
                </div>
                
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
                
                <div className="feature-indicator">
                  <div className="indicator-dot"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="features-showcase">
          <div className={`showcase-content ${isVisible ? 'showcase-content-visible' : ''}`}>
            <div className="showcase-visual">
              <div className="showcase-card">
                <div className="showcase-header">
                  <div className="showcase-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="showcase-body">
                  <div className="showcase-code">
                    <div className="code-line">
                      <span className="code-keyword">const</span>
                      <span className="code-variable"> aiSolution</span>
                      <span className="code-operator"> =</span>
                      <span className="code-string"> 'Intelligent'</span>
                    </div>
                    <div className="code-line">
                      <span className="code-keyword">return</span>
                      <span className="code-function"> generateResponse</span>
                      <span className="code-punctuation">(</span>
                      <span className="code-variable">userInput</span>
                      <span className="code-punctuation">)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="showcase-text">
              <h3>Real-World AI Implementation</h3>
              <p>
                See how AI-powered features are integrated into modern web applications, 
                creating intelligent user experiences that adapt and learn.
              </p>
              <div className="showcase-stats">
                <div className="stat">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">Efficiency Gain</span>
                </div>
                <div className="stat">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Automation</span>
                </div>
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Scalable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
