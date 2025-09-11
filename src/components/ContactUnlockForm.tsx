import { useState } from 'preact/hooks'
import { useContactPrivacyGate, type ContactUnlockForm } from '../hooks/useContactPrivacyGate'
import { useTranslation } from '../contexts/TranslationContext'

interface ContactUnlockFormProps {
  onUnlock?: (formData: any) => void
  onCancel?: () => void
}

export function ContactUnlockForm({ onUnlock, onCancel }: ContactUnlockFormProps) {
  const { t } = useTranslation()
  const { unlockContact, isLoading, error } = useContactPrivacyGate()
  
  const [formData, setFormData] = useState<ContactUnlockForm>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    reason: ''
  })

  const [formErrors, setFormErrors] = useState<Partial<ContactUnlockForm>>({})

  const handleInputChange = (field: keyof ContactUnlockForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    
    // Clear previous errors
    setFormErrors({})
    
    // Basic validation
    const errors: Partial<ContactUnlockForm> = {}
    
    if (!formData.fullName.trim()) {
      errors.fullName = t('contact.form.fullName') + ' is required'
    }
    
    if (!formData.email.trim()) {
      errors.email = t('contact.form.email') + ' is required'
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    }
    
    if (!formData.reason.trim()) {
      errors.reason = 'Reason for contact is required'
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    const success = await unlockContact(formData)
    if (success) {
      onUnlock?.(formData)
    }
  }

  return (
    <div class="enterprise-modal-overlay">
      <div class="enterprise-modal-compact">
        <div class="enterprise-modal-header-compact">
          <div class="modal-icon-compact">
            <i class="fa-solid fa-lock-open"></i>
          </div>
          <div class="modal-title-section-compact">
            <h2 class="modal-title-compact">
              {t('contact.form.title')}
            </h2>
            <p class="modal-subtitle-compact">
              {t('contact.unlockInfo')}
            </p>
          </div>
          <button
            onClick={onCancel}
            class="modal-close-btn-compact"
            disabled={isLoading}
          >
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        
        <div class="enterprise-modal-body-compact">
          
          {error && (
            <div class="enterprise-error-message">
              <i class="fa-solid fa-exclamation-triangle"></i>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} class="enterprise-form-compact">
            <div class="form-row-compact">
              <div class="form-group-compact">
                <label class="form-label-compact">
                  {t('contact.form.fullName')} <span class="required-compact">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onInput={(e) => handleInputChange('fullName', (e.target as HTMLInputElement).value)}
                  class="form-input-compact"
                  placeholder={t('contact.form.fullNamePlaceholder')}
                  disabled={isLoading}
                  required
                />
                {formErrors.fullName && (
                  <p class="form-error-compact">{formErrors.fullName}</p>
                )}
              </div>
              
              <div class="form-group-compact">
                <label class="form-label-compact">
                  {t('contact.form.email')} <span class="required-compact">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onInput={(e) => handleInputChange('email', (e.target as HTMLInputElement).value)}
                  class="form-input-compact"
                  placeholder={t('contact.form.emailPlaceholder')}
                  disabled={isLoading}
                  required
                />
                {formErrors.email && (
                  <p class="form-error-compact">{formErrors.email}</p>
                )}
              </div>
            </div>
            
            <div class="form-row-compact">
              <div class="form-group-compact">
                <label class="form-label-compact">
                  Phone Number <span class="required-compact">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onInput={(e) => handleInputChange('phone', (e.target as HTMLInputElement).value)}
                  class="form-input-compact"
                  placeholder="+351 934 330 807"
                  disabled={isLoading}
                  required
                />
                {formErrors.phone && (
                  <p class="form-error-compact">{formErrors.phone}</p>
                )}
                <p class="form-help-compact">Include country code (e.g., +351)</p>
              </div>
              
              <div class="form-group-compact">
                <label class="form-label-compact">
                  Company <span class="optional-compact">({t('contact.form.optional')})</span>
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onInput={(e) => handleInputChange('company', (e.target as HTMLInputElement).value)}
                  class="form-input-compact"
                  placeholder={t('contact.form.companyPlaceholder')}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div class="form-group-compact">
              <label class="form-label-compact">
                Reason for Contact <span class="required-compact">*</span>
              </label>
              <select
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', (e.target as HTMLSelectElement).value)}
                class="form-input-compact"
                disabled={isLoading}
                required
              >
                <option value="">{t('contact.form.reasonPlaceholder')}</option>
                <option value="jobOpportunity">{t('contact.form.reasonOptions.jobOpportunity')}</option>
                <option value="projectCollaboration">{t('contact.form.reasonOptions.projectCollaboration')}</option>
                <option value="consulting">{t('contact.form.reasonOptions.consulting')}</option>
                <option value="networking">{t('contact.form.reasonOptions.networking')}</option>
                <option value="other">{t('contact.form.reasonOptions.other')}</option>
              </select>
              {formErrors.reason && (
                <p class="form-error-compact">{formErrors.reason}</p>
              )}
            </div>
            
            <div class="form-actions-compact">
              <button
                type="submit"
                disabled={isLoading}
                class="enterprise-submit-btn-compact"
              >
                <i class="fa-solid fa-unlock"></i>
                <span>{isLoading ? t('contact.form.submitting') : t('contact.form.submit')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
