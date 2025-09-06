import { useState } from 'preact/hooks'
import { useTranslation } from '../contexts/TranslationContext'
import { Section, ConfirmationModal } from './ui'
import type { ContactProps } from '../types'

export function Contact({ personal, contact, isUnlocked, onUnlock, onLock }: ContactProps) {
  const { t } = useTranslation()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true)
  }

  const handleDeleteConfirm = () => {
    if (onLock) {
      onLock()
    }
    setShowDeleteConfirmation(false)
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false)
  }
  
  return (
    <Section 
      id="contact" 
      data-section="contact"
      title={String(t('contact.title'))} 
      subtitle={String(t('contact.subtitle'))}
    >
      <div className="contact-container position-relative">
        <div id="contact-content" className={isUnlocked ? '' : 'blur-content'}>
          {isUnlocked ? (
            <div className="contact-info">
              {/* Premium Contact Header */}
              <div className="contact-header text-center mb-6">
                <div className="contact-avatar">
                  <img 
                    src={personal.profileImage} 
                    alt={`${personal.name} - ${personal.title}`}
                    className="avatar-image"
                  />
                </div>
                <h3 className="contact-name">{personal.name}</h3>
                <p className="contact-title">{personal.title}</p>
                <p className="contact-availability">
                  <i className="fa-solid fa-circle text-success me-2"></i>
                  {personal.availability}
                </p>
                {/* Unlock Status Indicator */}
                <div className="unlock-status mt-3 d-flex align-items-center justify-content-center gap-2">
                  <span className="badge bg-success">
                    <i className="fa-solid fa-unlock me-1"></i>
                    {t('contact.unlocked', 'Contact Unlocked')}
                  </span>
                  {onLock && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleDeleteClick}
                      title={t('contact.deleteUnlock', 'Delete unlock data')}
                      aria-label={t('contact.deleteUnlock', 'Delete unlock data')}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Contact Information Grid */}
              <div className="contact-grid">
                <div className="contact-item premium-card">
                  <div className="contact-icon">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div className="contact-details">
                    <h5>{t('contact.labels.email', 'Email')}</h5>
                    <p><a href={`mailto:${personal.email}`} className="contact-link">{personal.email}</a></p>
                    <small className="text-muted">{t('contact.responseTime')}: {contact?.responseTime || 'Within 24 hours'}</small>
                  </div>
                </div>
                
                <div className="contact-item premium-card">
                  <div className="contact-icon">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div className="contact-details">
                    <h5>{t('contact.labels.phone', 'Phone')}</h5>
                    <p><a href={`tel:${personal.phone}`} className="contact-link">{personal.phone}</a></p>
                    {personal.phoneSecondary && (
                      <p><a href={`tel:${personal.phoneSecondary}`} className="contact-link">{personal.phoneSecondary}</a></p>
                    )}
                  </div>
                </div>
                
                <div className="contact-item premium-card">
                  <div className="contact-icon">
                    <i className="fa-solid fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-details">
                    <h5>{t('contact.labels.location', 'Location')}</h5>
                    <p>{personal.location}</p>
                    <small className="text-muted">
                      {personal.remote && <span className="badge badge-remote">{t('contact.badges.remoteAvailable', 'Remote Available')}</span>}
                      {personal.relocation && <span className="badge badge-relocation">{t('contact.badges.openToRelocation', 'Open to Relocation')}</span>}
                    </small>
                  </div>
                </div>
                
                {personal.website && (
                  <div className="contact-item premium-card">
                    <div className="contact-icon">
                      <i className="fa-solid fa-globe"></i>
                    </div>
                    <div className="contact-details">
                      <h5>{t('contact.labels.website', 'Website')}</h5>
                      <p><a href={personal.website} target="_blank" rel="noopener noreferrer" className="contact-link">{personal.website}</a></p>
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="contact-item premium-card social-links">
                  <div className="contact-icon">
                    <i className="fa-solid fa-share-nodes"></i>
                  </div>
                  <div className="contact-details">
                    <h5>{t('contact.labels.connect', 'Connect')}</h5>
                    <div className="social-buttons">
                      <a href={contact?.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="social-btn linkedin">
                        <i className="fa-brands fa-linkedin"></i>
                        <span>LinkedIn</span>
                      </a>
                      <a href={contact?.github || '#'} target="_blank" rel="noopener noreferrer" className="social-btn github">
                        <i className="fa-brands fa-github"></i>
                        <span>GitHub</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Preferred Contact Method */}
                {contact?.preferredContact && (
                  <div className="contact-item premium-card">
                    <div className="contact-icon">
                      <i className="fa-solid fa-handshake"></i>
                    </div>
                    <div className="contact-details">
                      <h5>{t('contact.preferredContact')}</h5>
                      <p>{contact.preferredContact}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Call to Action */}
              <div className="contact-cta text-center mt-6">
                <p className="cta-text">{t('contact.ctaText', 'Ready to work together?')}</p>
                <a href={`mailto:${personal.email}?subject=${encodeURIComponent('Let\'s Connect - ' + personal.name)}`} className="btn-premium btn-cta">
                  <i className="fa-solid fa-paper-plane me-2"></i>
                  {t('contact.sendMessage', 'Send Message')}
                </a>
              </div>
            </div>
          ) : (
            <div className="contact-placeholder">
              <div className="placeholder-content">
                <div className="placeholder-icon">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <p className="placeholder-text">{t('contact.placeholderText', 'Contact information will be displayed here after unlocking.')}</p>
              </div>
            </div>
          )}
        </div>
        
        {!isUnlocked && (
          <div className="blur-overlay">
            <div className="unlock-message text-center">
              <div className="unlock-icon">
                <i className="fa-solid fa-lock"></i>
              </div>
              <h4 className="unlock-title">{t('contact.unlockTitle', 'Click to unlock access to my information')}</h4>
              <p className="unlock-subtitle">{t('contact.unlockSubtitle', 'Get in touch with me')}</p>
              <button 
                className="btn-premium btn-unlock" 
                onClick={onUnlock}
              >
                <i className="fa-solid fa-unlock me-2"></i>
                {t('contact.unlockButton', 'Unlock Contact Info')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={t('contact.deleteConfirmation.title', 'Delete Unlock Data')}
        message={t('contact.deleteConfirmation.message', 'Are you sure you want to delete your unlock data? This will lock the contact information and you will need to unlock it again to view the details.')}
        confirmText={t('contact.deleteConfirmation.confirm', 'Delete')}
        cancelText={t('contact.deleteConfirmation.cancel', 'Cancel')}
        variant="danger"
        icon="fa-solid fa-trash-can"
      />
    </Section>
  )
}
