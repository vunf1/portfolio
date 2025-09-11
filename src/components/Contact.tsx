import { useState, useEffect } from 'preact/hooks'
import { useTranslation } from '../contexts/TranslationContext'
import { Section } from './ui'
import { ContactUnlockForm } from './ContactUnlockForm'
import type { ContactProps } from '../types'

interface ContactData {
  email: string
  phone: string
  phoneSecondary: string
  linkedin: string
  github: string
  website: string
  location: string
  availability: string
  responseTime: string
  preferredContact: string
}

export function Contact({ personal, contact }: ContactProps) {
  const { currentLanguage } = useTranslation()
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showUnlockForm, setShowUnlockForm] = useState(false)
  const [contactData, setContactData] = useState<ContactData | null>(null)

  // Check if contact is unlocked on mount
  useEffect(() => {
    try {
      const unlocked = localStorage.getItem('contact_unlocked')
      const timestamp = localStorage.getItem('contact_unlock_timestamp')
      const userData = localStorage.getItem('contact_user_data')
      
      if (unlocked === 'true' && timestamp && userData) {
        const unlockTime = parseInt(timestamp, 10)
        const now = Date.now()
        const UNLOCK_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days
        
        if (now - unlockTime < UNLOCK_DURATION) {
          setIsUnlocked(true)
          // Load contact data only when unlocked
          setContactData({
            email: personal.email,
            phone: personal.phone,
            phoneSecondary: personal.phoneSecondary,
            website: personal.website,
            location: personal.location,
            linkedin: contact.linkedin || '',
            github: contact.github || '',
            ...contact
          })
        } else {
          // Unlock expired, clean up
          localStorage.removeItem('contact_unlocked')
          localStorage.removeItem('contact_unlock_timestamp')
          localStorage.removeItem('contact_user_data')
        }
      }
    } catch (err) {
      // console.warn('Failed to check contact unlock status:', err)
    }
  }, [contact])

  // Update contact data when contact prop changes and we're unlocked
  useEffect(() => {
    if (isUnlocked && contact) {
      setContactData({
        email: personal.email,
        phone: personal.phone,
        phoneSecondary: personal.phoneSecondary,
        website: personal.website,
        location: personal.location,
        linkedin: contact.linkedin || '',
        github: contact.github || '',
        ...contact
      })
    }
  }, [isUnlocked, contact, personal])

  // Force re-render when unlock state changes by updating a counter
  const [renderKey, setRenderKey] = useState(0)
  useEffect(() => {
    if (isUnlocked) {
      setRenderKey(prev => prev + 1)
    }
  }, [isUnlocked])

  const handleUnlockClick = () => {
    setShowUnlockForm(true)
  }

  const handleUnlockSuccess = async (formData: Record<string, string>) => {
    try {
      setIsLoading(true)
      
      // Simulate API call with validation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store unlock state
      const now = Date.now()
      localStorage.setItem('contact_unlocked', 'true')
      localStorage.setItem('contact_unlock_timestamp', now.toString())
      localStorage.setItem('contact_user_data', JSON.stringify(formData))
      
      setIsUnlocked(true)
      setContactData({
        email: personal.email,
        phone: personal.phone,
        phoneSecondary: personal.phoneSecondary,
        website: personal.website,
        location: personal.location,
        linkedin: contact.linkedin || '',
        github: contact.github || '',
        ...contact
      })
      setShowUnlockForm(false)
      setRenderKey(prev => prev + 1)
    } catch (err) {
      // console.error('❌ Failed to unlock contact:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnlockCancel = () => {
    setShowUnlockForm(false)
  }

  const handleLockContact = () => {
    localStorage.removeItem('contact_unlocked')
    localStorage.removeItem('contact_unlock_timestamp')
    localStorage.removeItem('contact_user_data')
    setIsUnlocked(false)
    setContactData(null)
  }

  const isPortuguese = currentLanguage === 'pt-PT'

  return (
    <Section 
      id="contact" 
      data-section="contact"
      title={isPortuguese ? 'Contacto' : 'Contact'} 
      subtitle={isPortuguese ? 'Vamos trabalhar juntos' : "Let's work together"}
    >
      <div className="contact-container">
        {/* Locked State - No contact data exposed */}
        {!isUnlocked && (
          <div className="contact-locked-state">
            <div className="contact-locked-content">
              <div className="contact-locked-header">
                <div className="contact-locked-icon">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <h3 className="contact-locked-title">
                  {isPortuguese ? 'Informações de Contacto Protegidas' : 'Protected Contact Information'}
                </h3>
                <p className="contact-locked-subtitle">
                  {isPortuguese 
                    ? 'Para aceder às minhas informações de contacto, por favor forneça os seus dados abaixo.'
                    : 'To access my contact information, please provide your details below.'
                  }
                </p>
              </div>

              <div className="contact-locked-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div className="feature-content">
                    <h4>{isPortuguese ? 'Privacidade Garantida' : 'Privacy Guaranteed'}</h4>
                    <p>{isPortuguese 
                      ? 'Os seus dados são processados localmente e nunca partilhados com terceiros.'
                      : 'Your data is processed locally and never shared with third parties.'
                    }</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <div className="feature-content">
                    <h4>{isPortuguese ? 'Acesso Temporário' : 'Temporary Access'}</h4>
                    <p>{isPortuguese 
                      ? 'O acesso expira automaticamente após 30 dias para sua segurança.'
                      : 'Access automatically expires after 30 days for your security.'
                    }</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fa-solid fa-user-check"></i>
                  </div>
                  <div className="feature-content">
                    <h4>{isPortuguese ? 'Verificação de Identidade' : 'Identity Verification'}</h4>
                    <p>{isPortuguese 
                      ? 'Apenas visitantes legítimos podem aceder às informações de contacto.'
                      : 'Only legitimate visitors can access contact information.'
                    }</p>
                  </div>
                </div>
              </div>

              <div className="contact-unlock-cta">
                <button
                  onClick={handleUnlockClick}
                  className="contact-unlock-button"
                  disabled={isLoading}
                >
                  <i className="fa-solid fa-unlock"></i>
                  <span>
                    {isLoading 
                      ? (isPortuguese ? 'A processar...' : 'Processing...')
                      : (isPortuguese ? 'Desbloquear Contacto' : 'Unlock Contact')
                    }
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Unlocked State - Full contact data visible */}
        {isUnlocked && contactData && (
          <div className="contact-unlocked-state" key={`unlocked-${isUnlocked}-${renderKey}`}>
            <div className="contact-unlocked-header">
              <div className="contact-unlocked-title-section">
                <h3 className="contact-unlocked-title">
                  {isPortuguese ? 'Informações de Contacto' : 'Contact Information'}
                </h3>
                <p className="contact-unlocked-subtitle">
                  {isPortuguese 
                    ? 'Obrigado pela sua confiança. Aqui estão as minhas informações de contacto.'
                    : 'Thank you for your trust. Here are my contact details.'
                  }
                </p>
              </div>
              <div className="contact-unlocked-actions">
                <button
                  onClick={handleLockContact}
                  className="contact-lock-button"
                  title={isPortuguese ? 'Bloquear informações' : 'Lock information'}
                >
                  <i className="fa-solid fa-lock"></i>
                  <span>{isPortuguese ? 'Bloquear' : 'Lock'}</span>
                </button>
              </div>
            </div>

            <div className="contact-unlocked-content">
              <div className="contact-info-grid">
                <div className="contact-info-card">
                  <div className="contact-info-header">
                    <div className="contact-info-icon">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <h4 className="contact-info-title">
                      {isPortuguese ? 'Email' : 'Email'}
                    </h4>
                  </div>
                  <div className="contact-info-content">
                    <a 
                      href={`mailto:${contactData.email}`}
                      className="contact-info-link"
                    >
                      {contactData.email}
                    </a>
                    <div className="contact-info-meta">
                      <span className="contact-info-meta-text">
                        {isPortuguese ? 'Resposta em' : 'Response within'}: {contactData.responseTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-info-header">
                    <div className="contact-info-icon">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <h4 className="contact-info-title">
                      {isPortuguese ? 'Telefone' : 'Phone'}
                    </h4>
                  </div>
                  <div className="contact-info-content">
                    <a 
                      href={`tel:${contactData.phone}`}
                      className="contact-info-link"
                    >
                      {contactData.phone}
                    </a>
                    {contactData.phoneSecondary && (
                      <a 
                        href={`tel:${contactData.phoneSecondary}`}
                        className="contact-info-link-secondary"
                      >
                        {contactData.phoneSecondary}
                      </a>
                    )}
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-info-header">
                    <div className="contact-info-icon">
                      <i className="fa-solid fa-map-marker-alt"></i>
                    </div>
                    <h4 className="contact-info-title">
                      {isPortuguese ? 'Localização' : 'Location'}
                    </h4>
                  </div>
                  <div className="contact-info-content">
                    <span className="contact-info-text">{contactData.location}</span>
                    <div className="contact-info-badges">
                      {personal.remote && (
                        <span className="contact-info-badge remote-badge">
                          {isPortuguese ? 'Trabalho Remoto' : 'Remote Work'}
                        </span>
                      )}
                      {personal.relocation && (
                        <span className="contact-info-badge relocation-badge">
                          {isPortuguese ? 'Trabalho Híbrido' : 'Hybrid Work'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {contactData.website && contactData.website !== '#' && (
                  <div className="contact-info-card">
                    <div className="contact-info-header">
                      <div className="contact-info-icon">
                        <i className="fa-solid fa-globe"></i>
                      </div>
                      <h4 className="contact-info-title">
                        {isPortuguese ? 'Website' : 'Website'}
                      </h4>
                    </div>
                    <div className="contact-info-content">
                      <a 
                        href={contactData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-info-link"
                      >
                        {contactData.website}
                      </a>
                    </div>
                  </div>
                )}

                <div className="contact-info-card social-card">
                  <div className="contact-info-header">
                    <div className="contact-info-icon">
                      <i className="fa-solid fa-share-nodes"></i>
                    </div>
                    <h4 className="contact-info-title">
                      {isPortuguese ? 'Redes Sociais' : 'Social Media'}
                    </h4>
                  </div>
                  <div className="contact-info-content">
                    <div className="contact-social-buttons">
                      <a
                        href={contactData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-social-button linkedin-button"
                      >
                        <i className="fa-brands fa-linkedin"></i>
                        <span>LinkedIn</span>
                      </a>
                      <a
                        href={contactData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-social-button github-button"
                      >
                        <i className="fa-brands fa-github"></i>
                        <span>GitHub</span>
                      </a>
                    </div>
                  </div>
                </div>

                {contactData.preferredContact && (
                  <div className="contact-info-card">
                    <div className="contact-info-header">
                      <div className="contact-info-icon">
                        <i className="fa-solid fa-handshake"></i>
                      </div>
                      <h4 className="contact-info-title">
                        {isPortuguese ? 'Método Preferido' : 'Preferred Method'}
                      </h4>
                    </div>
                    <div className="contact-info-content">
                      <span className="contact-info-text">{contactData.preferredContact}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="contact-cta-section">
                <div className="contact-cta-content">
                  <h3 className="contact-cta-title">
                    {isPortuguese ? 'Pronto para trabalhar juntos?' : 'Ready to work together?'}
                  </h3>
                  <p className="contact-cta-subtitle">
                    {isPortuguese 
                      ? 'Vamos discutir o seu projeto e explorar oportunidades de colaboração.'
                      : "Let's discuss your project and explore collaboration opportunities."
                    }
                  </p>
                  <a 
                    href={`mailto:${contactData.email}?subject=${isPortuguese ? 'Vamos Conectar' : 'Let\'s Connect'}&body=${isPortuguese ? 'Olá,\n\nEncontrei o seu portfólio e gostaria de conectar sobre oportunidades potenciais.\n\nCumprimentos,' : 'Hello,\n\nI came across your portfolio and would like to connect regarding potential opportunities.\n\nBest regards,'}`}
                    className="contact-cta-button"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                    <span>{isPortuguese ? 'Enviar Mensagem' : 'Send Message'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Unlock Form Modal */}
        {showUnlockForm && (
          <ContactUnlockForm
            onUnlock={handleUnlockSuccess}
            onCancel={handleUnlockCancel}
          />
        )}
      </div>
    </Section>
  )
}