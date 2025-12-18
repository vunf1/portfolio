import { useState, useEffect, useRef } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import { N8nClient } from '../../utils/n8nClient'
import { validateEmail, validateName, validatePhone } from '../../utils/validation'
import type { ContactFormData } from '../../types/n8n'
import type { ContactModalProps } from '../../types'

/**
 * Contact Modal Component
 * 
 * A modal form for users to submit contact information that will be sent
 * to an n8n webhook for processing.
 * 
 * Features:
 * - Form validation (name, email, phone, message)
 * - Bilingual support (EN/PT)
 * - Loading states and error handling
 * - Accessibility compliant (WCAG 2.2 AA)
 * - Integration with n8n webhook via N8nClient
 */
export function ContactModal({
  isOpen,
  onClose,
  onSuccess,
  className = ''
}: ContactModalProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    companyIdentifier: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  const modalRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const n8nClientRef = useRef<N8nClient | null>(null)
  const STORAGE_KEY = 'contact-form-data'
  const MAX_WORDS = 1000

  // Initialize n8n client
  useEffect(() => {
    if (!n8nClientRef.current) {
      n8nClientRef.current = new N8nClient()
    }
  }, [])

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1025)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Save form data to sessionStorage
  const saveFormData = (data: ContactFormData) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      // Ignore storage errors (e.g., private browsing mode)
      console.warn('Failed to save form data to sessionStorage:', error)
    }
  }

  // Load form data from sessionStorage
  const loadFormData = (): ContactFormData | null => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved) as ContactFormData
      }
    } catch (error) {
      // Ignore storage errors
      console.warn('Failed to load form data from sessionStorage:', error)
    }
    return null
  }

  // Clear form data from sessionStorage
  const clearFormData = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      // Ignore storage errors
      console.warn('Failed to clear form data from sessionStorage:', error)
    }
  }

  // Count words in message
  const countWords = (text: string): number => {
    if (!text.trim()) return 0
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  // Update word count when message changes
  useEffect(() => {
    setWordCount(countWords(formData.message))
  }, [formData.message])

  // Load saved form data when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedData = loadFormData()
      if (savedData) {
        setFormData(savedData)
        setWordCount(countWords(savedData.message))
      }
      // Focus first input
      setTimeout(() => {
        nameInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Detect autofill using best practices for password manager compatibility
  useEffect(() => {
    if (!isOpen) return

    const form = document.querySelector('form[name="contact-form"]') as HTMLFormElement
    if (!form) return

    let syncTimeout: ReturnType<typeof setTimeout> | null = null
    let isSyncing = false
    let inputEventCount = 0
    let lastInputTime = 0

    // Debounced sync function - waits for autofill to complete before syncing
    // This prevents interference with password manager fills
    const syncFormDataFromDOM = (delay = 300) => {
      // Clear any pending sync
      if (syncTimeout) {
        clearTimeout(syncTimeout)
        syncTimeout = null
      }

      syncTimeout = setTimeout(() => {
        if (isSyncing) return
        isSyncing = true

        const formDataFromDOM: ContactFormData = {
          name: (form.querySelector('[name="name"]') as HTMLInputElement)?.value || '',
          email: (form.querySelector('[name="email"]') as HTMLInputElement)?.value || '',
          phone: (form.querySelector('[name="phone"]') as HTMLInputElement)?.value || '',
          companyName: (form.querySelector('[name="companyName"]') as HTMLInputElement)?.value || '',
          companyIdentifier: (form.querySelector('[name="companyIdentifier"]') as HTMLInputElement)?.value || '',
          subject: (form.querySelector('[name="subject"]') as HTMLInputElement)?.value || '',
          message: (form.querySelector('[name="message"]') as HTMLTextAreaElement)?.value || ''
        }

        setFormData(prevData => {
          // Check if any values changed
          const hasChanges = Object.keys(formDataFromDOM).some(
            key => formDataFromDOM[key as keyof ContactFormData] !== prevData[key as keyof ContactFormData]
          )

          if (hasChanges) {
            saveFormData(formDataFromDOM)
            setWordCount(countWords(formDataFromDOM.message))
            
            // Clear errors for fields that have values
            setErrors(prevErrors => {
              const newErrors = { ...prevErrors }
              Object.keys(formDataFromDOM).forEach(key => {
                if (formDataFromDOM[key as keyof ContactFormData]) {
                  delete newErrors[key as keyof ContactFormData]
                }
              })
              return newErrors
            })
            
            setSubmitError(null)
            
            isSyncing = false
            return formDataFromDOM
          }
          isSyncing = false
          return prevData
        })
      }, delay)
    }

    // Method 1: Listen for animationstart event (browser autofill)
    const handleAnimationStart = (e: AnimationEvent) => {
      if (e.animationName === 'onAutoFillStart' || e.animationName === 'onAutoFillCancel') {
        // Wait for browser to finish filling
        syncFormDataFromDOM(100)
      }
    }

    // Method 2: Listen for input events (works for both browser and password managers)
    // Detect password manager fills by tracking multiple rapid input events
    const handleInput = (e: Event) => {
      const now = Date.now()
      
      // Detect if this might be a password manager fill
      // Password managers often fill multiple fields rapidly without user interaction
      // Check if event is not trusted (programmatic) or multiple fields filling rapidly
      const isProgrammatic = !e.isTrusted
      const isRapidFill = now - lastInputTime < 150
      
      if (isRapidFill) {
        inputEventCount++
      } else {
        inputEventCount = 1
      }
      lastInputTime = now

      // If multiple fields are being filled rapidly or programmatically, it's likely autofill
      // Use longer debounce to allow all fields to be filled
      const isLikelyAutofill = isProgrammatic || inputEventCount > 1
      const delay = isLikelyAutofill ? 500 : 0 // Immediate for user input, debounced for autofill
      
      syncFormDataFromDOM(delay)
    }

    // Method 3: Listen for change events (fallback for password managers)
    const handleChange = () => {
      // Change events usually indicate autofill completion
      syncFormDataFromDOM(200)
    }

    // Observe all form inputs
    const inputs = form.querySelectorAll('input, textarea')
    inputs.forEach((input) => {
      // Browser autofill detection (animation events)
      input.addEventListener('animationstart', handleAnimationStart as EventListener)
      // Password manager detection - input events are most reliable
      // Password managers trigger input events when filling fields
      input.addEventListener('input', handleInput, { passive: true })
      // Change events as fallback
      input.addEventListener('change', handleChange, { passive: true })
    })

    // Method 4: Watch for focus events (password managers often fill on focus)
    const handleFocus = () => {
      // Check after a delay to allow password manager to fill
      syncFormDataFromDOM(200)
    }

    form.addEventListener('focusin', handleFocus, true)

    return () => {
      if (syncTimeout) {
        clearTimeout(syncTimeout)
      }
      inputs.forEach((input) => {
        input.removeEventListener('animationstart', handleAnimationStart as EventListener)
        input.removeEventListener('input', handleInput)
        input.removeEventListener('change', handleChange)
      })
      form.removeEventListener('focusin', handleFocus, true)
    }
  }, [isOpen])

  // Handle escape key - preserve form data
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isSubmitting) {
        // Don't clear form data when closing via ESC
        // Data is already saved in sessionStorage via handleInputChange
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, isSubmitting])

  // Reset form state (but not data) when modal closes
  useEffect(() => {
    if (!isOpen) {
      setErrors({})
      setSubmitError(null)
      setSubmitSuccess(false)
      setIsSubmitting(false)
    }
  }, [isOpen])

  // Handle click outside modal
  const handleOverlayClick = (event: MouseEvent) => {
    if (event.target === modalRef.current && !isSubmitting) {
      onClose()
    }
  }

  // Validate form fields
  const validateField = (name: keyof ContactFormData, value: string): string | null => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return t('contact.errors.nameRequired', 'Name is required')
        }
        if (!validateName(value)) {
          return t('contact.errors.nameInvalid', 'Please enter a valid name (at least 2 characters, letters only)')
        }
        return null
      
      case 'email':
        if (!value.trim()) {
          return t('contact.errors.emailRequired', 'Email is required')
        }
        if (!validateEmail(value)) {
          return t('contact.errors.emailInvalid', 'Please enter a valid email address')
        }
        return null
      
      case 'phone':
        if (value.trim() && !validatePhone(value)) {
          return t('contact.errors.phoneInvalid', 'Please enter a valid phone number in E.164 format (e.g., +351912345678)')
        }
        return null
      
      case 'subject':
        if (!value.trim()) {
          return t('contact.errors.subjectRequired', 'Subject is required')
        }
        if (value.trim().length < 3) {
          return t('contact.errors.subjectTooShort', 'Subject must be at least 3 characters')
        }
        return null
      
      case 'message':
        if (!value.trim()) {
          return t('contact.errors.messageRequired', 'Message is required')
        }
        if (value.trim().length < 10) {
          return t('contact.errors.messageTooShort', 'Message must be at least 10 characters')
        }
        const words = countWords(value)
        if (words > MAX_WORDS) {
          return t('contact.errors.messageTooLong', `Message must not exceed ${MAX_WORDS} words. Current: ${words} words.`).replace('{{max}}', String(MAX_WORDS)).replace('{{current}}', String(words))
        }
        return null
      
      default:
        return null
    }
  }

  // Handle input change - for direct user input
  const handleInputChange = (name: keyof ContactFormData, value: string) => {
    // Update state immediately for user input (not autofill)
    setFormData(prevData => {
      const updatedData = { ...prevData, [name]: value }
      // Save to sessionStorage
      saveFormData(updatedData)
      return updatedData
    })
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError(null)
    }
  }


  // Handle form submission
  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {}
    
    const nameError = validateField('name', formData.name)
    if (nameError) newErrors.name = nameError
    
    const emailError = validateField('email', formData.email)
    if (emailError) newErrors.email = emailError
    
    const phoneError = validateField('phone', formData.phone || '')
    if (phoneError) newErrors.phone = phoneError
    
    const subjectError = validateField('subject', formData.subject || '')
    if (subjectError) newErrors.subject = subjectError
    
    const messageError = validateField('message', formData.message)
    if (messageError) newErrors.message = messageError
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Focus first error field
      const firstErrorField = Object.keys(newErrors)[0] as keyof ContactFormData
      if (firstErrorField === 'name' && nameInputRef.current) {
        nameInputRef.current.focus()
      }
      return
    }
    
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Prepare payload (remove empty optional fields)
      const payload: ContactFormData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        ...(formData.phone?.trim() && { phone: formData.phone.trim() }),
        ...(formData.companyName?.trim() && { companyName: formData.companyName.trim() }),
        ...(formData.companyIdentifier?.trim() && { companyIdentifier: formData.companyIdentifier.trim() })
      }
      
      // Send to n8n webhook
      await n8nClientRef.current!.sendToWebhook(payload)
      
      setSubmitSuccess(true)
      setErrors({})
      
      // Clear form data and sessionStorage after successful submission
      const emptyFormData: ContactFormData = {
        name: '',
        email: '',
        phone: '',
        companyName: '',
        companyIdentifier: '',
        subject: '',
        message: ''
      }
      setFormData(emptyFormData)
      clearFormData()
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(payload)
      }
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Failed to submit contact form:', error)
      
      let errorMessage = t('contact.errors.submitFailed', 'Failed to send message. Please try again.')
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = t('contact.errors.timeout', 'Request timed out. Please check your connection and try again.')
        } else if (error.message.includes('network')) {
          errorMessage = t('contact.errors.networkError', 'Network error. Please check your connection and try again.')
        } else {
          errorMessage = t('contact.errors.submitFailed', 'Failed to send message. Please try again.')
        }
      }
      
      setSubmitError(errorMessage)
      setIsSubmitting(false)
    }
  }

  // Handle cancel button - clear form data
  const handleCancel = () => {
    const emptyFormData: ContactFormData = {
      name: '',
      email: '',
      phone: '',
      companyName: '',
      companyIdentifier: '',
      subject: '',
      message: ''
    }
    setFormData(emptyFormData)
    clearFormData()
    setErrors({})
    setSubmitError(null)
    onClose()
  }

  // Render action buttons (reusable for header and footer)
  const renderActionButtons = () => (
    <>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={handleCancel}
        disabled={isSubmitting}
        aria-label={t('contact.cancel', 'Cancel')}
      >
        <i className="fa-solid fa-times me-2"></i>
        {t('contact.cancel', 'Cancel')}
      </button>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting}
        aria-label={t('contact.submit', 'Send Message')}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {t('contact.submitting', 'Sending...')}
          </>
        ) : (
          <>
            <i className="fa-solid fa-paper-plane me-2"></i>
            {t('contact.submit', 'Send Message')}
          </>
        )}
      </button>
    </>
  )

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={`contact-modal-premium fade show d-block ${className}`}
      ref={modalRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className="contact-modal-dialog modal-mobile">
        <div className="contact-modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="contact-modal-title">
                      {t('contact.title', 'Contact Me')}
                    </h5>
                    {isMobile && !submitSuccess && (
                      <div className="modal-header-actions">
                        {renderActionButtons()}
                      </div>
                    )}
                  </div>

          <form 
            name="contact-form" 
            onSubmit={handleSubmit}
            data-form-type="contact"
            autoComplete="off"
            data-lpignore="true"
            role="form"
            aria-label={t('contact.title', 'Contact form')}
          >
            {/* Hidden honeypot password field to prevent password manager interference */}
            <input
              type="password"
              name="password-honeypot"
              autoComplete="new-password"
              tabIndex={-1}
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
            />
            <div className="modal-body">
              {submitSuccess ? (
                <div className="alert alert-success" role="alert">
                  <i className="fa-solid fa-check-circle me-2"></i>
                  {t('contact.success', 'Thank you! Your message has been sent successfully.')}
                </div>
              ) : (
                <>
                  {submitError && (
                    <div className="alert alert-danger" role="alert">
                      <i className="fa-solid fa-exclamation-circle me-2"></i>
                      {submitError}
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-group form-group-half">
                      <label htmlFor="contact-name" className="form-label">
                        {t('contact.fields.name', 'Name')} <span className="text-danger">*</span>
                      </label>
                      <input
                        ref={nameInputRef}
                        type="text"
                        id="contact-name"
                        name="name"
                        autoComplete="name"
                        data-form-type="contact"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', (e.target as HTMLInputElement).value)}
                        onInput={(e) => handleInputChange('name', (e.target as HTMLInputElement).value)}
                        disabled={isSubmitting}
                        required
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      />
                      {errors.name && (
                        <div id="contact-name-error" className="invalid-feedback" role="alert">
                          {errors.name}
                        </div>
                      )}
                    </div>

                    <div className="form-group form-group-half">
                      <label htmlFor="contact-email" className="form-label">
                        {t('contact.fields.email', 'Email')} <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        name="email"
                        autoComplete="off"
                        data-form-type="contact"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', (e.target as HTMLInputElement).value)}
                        onInput={(e) => handleInputChange('email', (e.target as HTMLInputElement).value)}
                        disabled={isSubmitting}
                        required
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      />
                      {errors.email && (
                        <div id="contact-email-error" className="invalid-feedback" role="alert">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group form-group-half">
                      <label htmlFor="contact-phone" className="form-label">
                        {t('contact.fields.phone', 'Phone')} <span className="text-muted">({t('contact.fields.phoneHint', 'Optional')})</span>
                      </label>
                      <input
                        type="tel"
                        id="contact-phone"
                        name="phone"
                        autoComplete="tel"
                        data-form-type="contact"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', (e.target as HTMLInputElement).value)}
                        onInput={(e) => handleInputChange('phone', (e.target as HTMLInputElement).value)}
                        disabled={isSubmitting}
                        placeholder="+351912345678"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'contact-phone-error' : 'contact-phone-hint'}
                      />
                      {errors.phone && (
                        <div id="contact-phone-error" className="invalid-feedback" role="alert">
                          {errors.phone}
                        </div>
                      )}
                      {!errors.phone && (
                        <small id="contact-phone-hint" className="form-text text-muted">
                          {t('contact.fields.phoneExample', 'E.164 format')}
                        </small>
                      )}
                    </div>

                    <div className="form-group form-group-half">
                      <label htmlFor="contact-subject" className="form-label">
                        {t('contact.fields.subject', 'Subject')} <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact-subject"
                        name="subject"
                        autoComplete="off"
                        className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', (e.target as HTMLInputElement).value)}
                        onInput={(e) => handleInputChange('subject', (e.target as HTMLInputElement).value)}
                        disabled={isSubmitting}
                        required
                        aria-required="true"
                        aria-invalid={!!errors.subject}
                        aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                        placeholder={t('contact.fields.subjectPlaceholder', 'What is this regarding?')}
                      />
                      {errors.subject && (
                        <div id="contact-subject-error" className="invalid-feedback" role="alert">
                          {errors.subject}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group form-group-half">
                      <label htmlFor="contact-company-name" className="form-label">
                        {t('contact.fields.companyName', 'Company Name')} <span className="text-muted">({t('contact.fields.optional', 'Optional')})</span>
                      </label>
                      <input
                        type="text"
                        id="contact-company-name"
                        name="companyName"
                        autoComplete="organization"
                        className="form-control"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', (e.target as HTMLInputElement).value)}
                        onInput={(e) => handleInputChange('companyName', (e.target as HTMLInputElement).value)}
                        disabled={isSubmitting}
                        placeholder={t('contact.fields.companyNamePlaceholder', 'Your company name')}
                      />
                    </div>

                    <div className="form-group form-group-half">
                      <label htmlFor="contact-company-identifier" className="form-label">
                        {t('contact.fields.companyIdentifier', 'Company ID')} <span className="text-muted">({t('contact.fields.optional', 'Optional')})</span>
                      </label>
                      <input
                        type="text"
                        id="contact-company-identifier"
                        name="companyIdentifier"
                        autoComplete="off"
                        className="form-control"
                        value={formData.companyIdentifier}
                        onChange={(e) => handleInputChange('companyIdentifier', (e.target as HTMLInputElement).value)}
                        onInput={(e) => handleInputChange('companyIdentifier', (e.target as HTMLInputElement).value)}
                        disabled={isSubmitting}
                        placeholder={t('contact.fields.companyIdentifierPlaceholder', 'VAT/Tax ID')}
                        aria-describedby="contact-company-identifier-hint"
                      />
                      <small id="contact-company-identifier-hint" className="form-text text-muted">
                        {t('contact.fields.companyIdentifierHint', 'VAT or tax ID')}
                      </small>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message" className="form-label">
                      {t('contact.fields.message', 'Message')} <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      autoComplete="off"
                      className={`form-control ${errors.message ? 'is-invalid' : ''} ${wordCount > MAX_WORDS ? 'is-invalid' : ''}`}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', (e.target as HTMLTextAreaElement).value)}
                      onInput={(e) => handleInputChange('message', (e.target as HTMLTextAreaElement).value)}
                      disabled={isSubmitting}
                      required
                      rows={2}
                      aria-required="true"
                      aria-invalid={!!errors.message || wordCount > MAX_WORDS}
                      aria-describedby={errors.message ? 'contact-message-error' : 'contact-message-hint'}
                    />
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <small 
                        id="contact-message-hint" 
                        className={`form-text ${wordCount > MAX_WORDS ? 'text-danger' : 'text-muted'}`}
                      >
                        {t('contact.fields.wordCount', '{{count}} / {{max}} words').replace('{{count}}', String(wordCount)).replace('{{max}}', String(MAX_WORDS))}
                      </small>
                    </div>
                    {errors.message && (
                      <div id="contact-message-error" className="invalid-feedback" role="alert">
                        {errors.message}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {!submitSuccess && (
              <div className="modal-footer">
                {renderActionButtons()}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

