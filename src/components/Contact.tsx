import { useTranslation } from '../contexts/TranslationContext'
import { Section } from './ui'
import type { ContactProps } from '../types'

export function Contact({ personal, isUnlocked, onUnlock }: ContactProps) {
  const { t } = useTranslation()
  
  return (
    <Section 
      id="contact" 
      title={String(t('contact.title'))} 
      subtitle={String(t('contact.subtitle'))}
    >
        <div className="contact-container position-relative">
          <div id="contact-content" className={isUnlocked ? '' : 'blur-content'}>
            {isUnlocked ? (
              <div className="contact-info">
                <div className="contact-grid">
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div className="contact-details">
                      <h5>Email</h5>
                      <p><a href={`mailto:${personal.email}`}>{personal.email}</a></p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div className="contact-details">
                      <h5>Phone</h5>
                      <p>{personal.phone}</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fa-solid fa-map-marker"></i>
                    </div>
                    <div className="contact-details">
                      <h5>Location</h5>
                      <p>{personal.location}</p>
                    </div>
                  </div>
                  
                  {personal.website && (
                    <div className="contact-item">
                      <div className="contact-icon">
                        <i className="fa-solid fa-globe"></i>
                      </div>
                      <div className="contact-details">
                        <h5>Website</h5>
                        <p><a href={personal.website} target="_blank" rel="noopener noreferrer">{personal.website}</a></p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="contact-placeholder">
                <p className="text-muted">Contact information will be displayed here after unlocking.</p>
              </div>
            )}
          </div>
          
          {!isUnlocked && (
            <div className="blur-overlay">
              <div className="unlock-message text-center">
                <i className="fa-solid fa-lock fa-3x text-primary mb-3"></i>
                <h4>Click to unlock access to my information</h4>
                <p className="text-muted">Get in touch with me</p>
                <button 
                  className="btn btn-primary btn-lg" 
                  onClick={onUnlock}
                >
                  <i className="fa-solid fa-unlock me-2"></i>Unlock Contact Info
                </button>
              </div>
            </div>
          )}
        </div>
    </Section>
  )
}
