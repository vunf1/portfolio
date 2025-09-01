import { useState, useEffect } from 'preact/hooks'
import { Hero } from './components/Hero.jsx'
import { Navigation } from './components/Navigation.jsx'
import { About } from './components/About.jsx'
import { Contact } from './components/Contact.jsx'
import { Experience } from './components/Experience.jsx'
import { Education } from './components/Education.jsx'
import { Skills } from './components/Skills.jsx'
import { Projects } from './components/Projects.jsx'
import { Certifications } from './components/Certifications.jsx'
import { Interests } from './components/Interests.jsx'
import { Awards } from './components/Awards.jsx'
import { Testimonials } from './components/Testimonials.jsx'
import { ContactModal } from './components/ContactModal.jsx'
import { usePortfolioData } from './hooks/usePortfolioData.js'
import { useTheme } from './hooks/useTheme.js'

export function App() {
  const { portfolioData, loading, error } = usePortfolioData()
  const { isDarkMode, toggleTheme } = useTheme()
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactUnlocked, setContactUnlocked] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const handleContactUnlock = (formData) => {
    // Here you would typically send the data to your backend
    console.log('Contact unlocked with:', formData)
    setContactUnlocked(true)
    setShowContactModal(false)
  }

  const handleScrollDown = () => {
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Intersection Observer for active section tracking
  useEffect(() => {
    if (!portfolioData) return

    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-20% 0px -20% 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    // Observe all sections
    const sections = document.querySelectorAll('section[id]')
    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [portfolioData])

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error">
        <div className="error-content">
                           <i className="fa-solid fa-exclamation-triangle fa-3x mb-4"></i>
          <h2>Error Loading Portfolio</h2>
          <p>{error.message}</p>
          <button 
            className="btn-premium mt-4"
            onClick={() => window.location.reload()}
          >
                               <i className="fa-solid fa-refresh me-2"></i>
                   Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!portfolioData) {
    return (
      <div className="error">
        <div className="error-content">
                           <i className="fa-solid fa-info-circle fa-3x mb-4"></i>
          <h2>No Portfolio Data</h2>
          <p>Portfolio data is not available. Please check your data file.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navigation 
        personal={portfolioData.personal}
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
        activeSection={activeSection}
      />
      
      {/* Hero Section */}
      <Hero 
        personal={portfolioData.personal}
        social={portfolioData.social}
        onScrollDown={handleScrollDown}
      />
      
      <div className="portfolio-container">
        {/* About Section */}
        <section className="portfolio-section" id="about">
          <div className="section-header">
            <h2 className="section-title">About Me</h2>
            <p className="section-subtitle">Get to know me better</p>
          </div>
          <About personal={portfolioData.personal} social={portfolioData.social} />
        </section>
        
        {/* Experience Section */}
        <section className="portfolio-section" id="experience">
          <div className="section-header">
            <h2 className="section-title">Professional Experience</h2>
            <p className="section-subtitle">My journey in software development</p>
          </div>
          <Experience experience={portfolioData.experience} />
        </section>
        
        {/* Education Section */}
        <section className="portfolio-section" id="education">
          <div className="section-header">
            <h2 className="section-title">Education & Training</h2>
            <p className="section-subtitle">Academic background and continuous learning</p>
          </div>
          <Education education={portfolioData.education} />
        </section>
        
        {/* Skills Section */}
        <section className="portfolio-section" id="skills">
          <div className="section-header">
            <h2 className="section-title">Technical Skills</h2>
            <p className="section-subtitle">Technologies and competencies I master</p>
          </div>
          <Skills skills={portfolioData.skills} />
        </section>
        
        {/* Projects Section */}
        <section className="portfolio-section" id="projects">
          <div className="section-header">
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">Showcase of my best work</p>
          </div>
          <Projects projects={portfolioData.projects} />
        </section>
        
        {/* Certifications Section */}
        <section className="portfolio-section" id="certifications">
          <div className="section-header">
            <h2 className="section-title">Certifications</h2>
            <p className="section-subtitle">Professional qualifications and achievements</p>
          </div>
          <Certifications certifications={portfolioData.certifications} />
        </section>
        
        {/* Testimonials Section */}
        {portfolioData.testimonials && (
          <section className="portfolio-section" id="testimonials">
            <div className="section-header">
              <h2 className="section-title">Client Testimonials</h2>
              <p className="section-subtitle">What others say about my work</p>
            </div>
            <Testimonials testimonials={portfolioData.testimonials} />
          </section>
        )}
        
        {/* Interests Section */}
        <section className="portfolio-section" id="interests">
          <div className="section-header">
            <h2 className="section-title">Personal Interests</h2>
            <p className="section-subtitle">Beyond the code - what drives me</p>
          </div>
          <Interests interests={portfolioData.interests} />
        </section>
        
        {/* Awards Section */}
        <section className="portfolio-section" id="awards">
          <div className="section-header">
            <h2 className="section-title">Awards & Recognition</h2>
            <p className="section-subtitle">Achievements and honors</p>
          </div>
          <Awards awards={portfolioData.awards} />
        </section>
        
        {/* Contact Section */}
        <section className="portfolio-section" id="contact">
          <div className="section-header">
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-subtitle">Let's discuss your next project</p>
          </div>
          <Contact 
            personal={portfolioData.personal}
            isUnlocked={contactUnlocked}
            onUnlock={() => setShowContactModal(true)}
          />
        </section>
      </div>

      <ContactModal 
        show={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSubmit={handleContactUnlock}
      />
    </>
  )
}
