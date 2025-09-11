import { useState, useEffect } from 'preact/hooks'
import { useTranslation } from '../contexts/TranslationContext'
import { useContactPrivacyGate } from '../hooks/useContactPrivacyGate'
import { ContactUnlockForm } from './ContactUnlockForm'
import type { Contact } from '../types/portfolio'
import type { JSX } from 'preact'

interface ContactPrivacyGateProps {
  contact: Contact
  children?: (contact: Contact) => JSX.Element
}

export function ContactPrivacyGate({ contact, children }: ContactPrivacyGateProps) {
  const { t } = useTranslation()
  const { isUnlocked, lockContact, deleteUnlockData } = useContactPrivacyGate()
  const [showUnlockForm, setShowUnlockForm] = useState(false)
  const [localUnlocked, setLocalUnlocked] = useState(false)

  // Sync local state with hook state and close form when unlock state changes
  useEffect(() => {
    // Sync local state with hook state
    if (isUnlocked !== localUnlocked) {
      setLocalUnlocked(isUnlocked)
    }
    
    if (isUnlocked && showUnlockForm) {
      setShowUnlockForm(false)
    }
  }, [isUnlocked, showUnlockForm, localUnlocked])

  const handleUnlockClick = () => {
    setShowUnlockForm(true)
  }

  const handleUnlockSuccess = () => {
    setShowUnlockForm(false)
    setLocalUnlocked(true)
    // Force a re-render by updating local state
    // This ensures the component re-renders with the new unlock state
  }

  const handleUnlockCancel = () => {
    setShowUnlockForm(false)
  }

  const handleLockContact = () => {
    lockContact()
    setLocalUnlocked(false)
  }

  const handleDeleteUnlockData = () => {
    deleteUnlockData()
    setLocalUnlocked(false)
  }

  // If unlocked, show the actual contact information
  if (isUnlocked || localUnlocked) {
    return (
      <div class="enterprise-unlocked-container" key={`unlocked-${isUnlocked}-${localUnlocked}`}>
        {children ? children(contact) : (
          <div class="enterprise-unlocked-content">
            <div class="unlocked-header">
              <h3 class="unlocked-title">
                {t('contact.title')}
              </h3>
              <p class="locked-subtitle">
                {t('contact.unlockedSubtitle')}
              </p>
            </div>
            
            <div class="unlocked-success-indicator">
              Contact information successfully unlocked
            </div>
            
            <div class="unlocked-info-grid">
              <div class="unlocked-info-item">
                <div class="unlocked-info-label">Email</div>
                <div class="unlocked-info-value">{contact.email}</div>
              </div>
              <div class="unlocked-info-item">
                <div class="unlocked-info-label">Phone</div>
                <div class="unlocked-info-value">{contact.phone}</div>
              </div>
              <div class="unlocked-info-item">
                <div class="unlocked-info-label">Location</div>
                <div class="unlocked-info-value">{contact.location}</div>
              </div>
              <div class="unlocked-info-item">
                <div class="unlocked-info-label">Availability</div>
                <div class="unlocked-info-value">{contact.availability}</div>
              </div>
            </div>
            
            <div class="unlocked-actions">
              <button onClick={handleLockContact} class="enterprise-lock-btn">
                <i class="fa-solid fa-lock"></i>
                <span>Lock Contact</span>
              </button>
              <button onClick={handleDeleteUnlockData} class="enterprise-delete-btn">
                <i class="fa-solid fa-trash"></i>
                <span>Delete Data</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // If locked, show blurred contact information with unlock button
  return (
    <div class="enterprise-locked-container" key={`locked-${isUnlocked}-${localUnlocked}`}>
      <div class="enterprise-locked-content">
        <div class="locked-header">
          <h3 class="locked-title">
            {t('contact.title')}
          </h3>
          <p class="locked-subtitle">
            {t('contact.lockedSubtitle')}
          </p>
        </div>
        
        <div class="enterprise-contact-grid">
          <div class="contact-card enterprise-card blurred-card">
            <div class="card-header">
              <div class="card-icon">
                <i class="fa-solid fa-envelope"></i>
              </div>
              <h4 class="card-title">{t('contact.email')}</h4>
            </div>
            <div class="card-content">
              <div class="blurred-content">
                <span class="blur-text">••••••••@••••••••.com</span>
                <div class="blur-overlay"></div>
              </div>
            </div>
          </div>
          
          <div class="contact-card enterprise-card blurred-card">
            <div class="card-header">
              <div class="card-icon">
                <i class="fa-solid fa-phone"></i>
              </div>
              <h4 class="card-title">{t('contact.phone')}</h4>
            </div>
            <div class="card-content">
              <div class="blurred-content">
                <span class="blur-text">+••• ••• ••• •••</span>
                <div class="blur-overlay"></div>
              </div>
            </div>
          </div>
          
          <div class="contact-card enterprise-card">
            <div class="card-header">
              <div class="card-icon">
                <i class="fa-solid fa-map-marker-alt"></i>
              </div>
              <h4 class="card-title">{t('contact.location')}</h4>
            </div>
            <div class="card-content">
              <span class="enterprise-text">{contact.location}</span>
            </div>
          </div>
          
          <div class="contact-card enterprise-card">
            <div class="card-header">
              <div class="card-icon">
                <i class="fa-solid fa-briefcase"></i>
              </div>
              <h4 class="card-title">{t('contact.availability')}</h4>
            </div>
            <div class="card-content">
              <span class="enterprise-text">{contact.availability}</span>
            </div>
          </div>
          
          <div class="contact-card enterprise-card">
            <div class="card-header">
              <div class="card-icon">
                <i class="fa-solid fa-clock"></i>
              </div>
              <h4 class="card-title">{t('contact.responseTime')}</h4>
            </div>
            <div class="card-content">
              <span class="enterprise-text">{contact.responseTime}</span>
            </div>
          </div>
          
          <div class="contact-card enterprise-card">
            <div class="card-header">
              <div class="card-icon">
                <i class="fa-solid fa-handshake"></i>
              </div>
              <h4 class="card-title">{t('contact.preferredContact')}</h4>
            </div>
            <div class="card-content">
              <span class="enterprise-text">{contact.preferredContact}</span>
            </div>
          </div>
        </div>
        
        <div class="enterprise-unlock-section">
          <div class="unlock-content">
            <div class="unlock-icon">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div class="unlock-text-section">
              <h4 class="unlock-title">Access Protected Content</h4>
              <p class="unlock-description">Verify your identity to unlock contact details</p>
            </div>
            <button onClick={handleUnlockClick} class="enterprise-unlock-btn">
              <i class="fa-solid fa-key"></i>
              <span>Unlock Access</span>
            </button>
          </div>
        </div>
      </div>
      
      {showUnlockForm && (
        <ContactUnlockForm onUnlock={handleUnlockSuccess} onCancel={handleUnlockCancel} />
      )}
    </div>
  )
}
