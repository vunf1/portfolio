import type { ComponentChildren } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import { sendContactEmail } from '../../utils/emailSender'
import { lockScroll, unlockScroll } from '../../lib/scrollLock'
import { toast } from '../../lib/toast-store'
import { validateEmail, validateName, validatePhone } from '../../utils/validation'
import { cn } from '../../lib/utils'
import { Button } from './Button'
import { Icon } from './Icon'
import type { ContactFormData } from '../../types/n8n'
import type { ContactModalProps } from '../../types'

function ContactField({
  id,
  label,
  required = false,
  optionalLabel,
  error,
  hint,
  hintId,
  children
}: {
  id: string
  label: string
  required?: boolean
  optionalLabel?: string
  error?: string
  hint?: string
  hintId?: string
  children: ComponentChildren
}) {
  const errorId = `${id}-error`
  const resolvedHintId = hintId ?? `${id}-hint`
  return (
    <div className={cn('contact-field', error && 'is-error')}>
      <label htmlFor={id} className="contact-field__label">
        {label}
        {required ? <span className="contact-field__req" aria-hidden="true">·</span> : null}
        {optionalLabel ? <span className="contact-field__opt">{optionalLabel}</span> : null}
      </label>
      {children}
      {hint ? (
        <p id={resolvedHintId} className={cn('contact-field__hint', error && 'is-error')}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="contact-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/**
 * Contact Modal Component
 *
 * A modal form for users to submit contact information. Sends emails via
 * EmailJS to joaomaia@jmsit.cloud (HTTPS, TLS via provider).
 *
 * Features:
 * - Form validation (name, email, phone, message)
 * - Bilingual support (EN/PT)
 * - Loading states and error handling
 * - Accessibility compliant (WCAG 2.2 AA)
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
  
  const modalRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const STORAGE_KEY = 'contact-form-data'
  const MAX_WORDS = 1000

  // Save form data to sessionStorage
  const saveFormData = (data: ContactFormData) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      // Ignore storage errors (e.g., private browsing mode)
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('Failed to save form data to sessionStorage:', error)
      }
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
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('Failed to load form data from sessionStorage:', error)
      }
    }
    return null
  }

  // Clear form data from sessionStorage
  const clearFormData = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      // Ignore storage errors
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('Failed to clear form data from sessionStorage:', error)
      }
    }
  }

  // Count words in message
  const countWords = (text: string): number => {
    if (!text.trim()) {
      return 0
    }
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
    if (!isOpen) {
      return
    }

    const form = document.querySelector('form[name="contact-form"]') as HTMLFormElement
    if (!form) {
      return
    }

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
        if (isSyncing) {
          return
        }
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

  // Scroll lock only tracks isOpen (avoid unlock/relock when isSubmitting toggles)
  useEffect(() => {
    if (!isOpen) {
      return
    }
    lockScroll()
    return () => {
      unlockScroll()
    }
  }, [isOpen])

  // Escape key: separate effect so deps can include isSubmitting without touching scroll lock
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
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
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
      
      case 'message': {
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
      }
      
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
    if (nameError) {
      newErrors.name = nameError
    }
    
    const emailError = validateField('email', formData.email)
    if (emailError) {
      newErrors.email = emailError
    }
    
    const phoneError = validateField('phone', formData.phone || '')
    if (phoneError) {
      newErrors.phone = phoneError
    }
    
    const subjectError = validateField('subject', formData.subject || '')
    if (subjectError) {
      newErrors.subject = subjectError
    }
    
    const messageError = validateField('message', formData.message)
    if (messageError) {
      newErrors.message = messageError
    }
    
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

      // Send via EmailJS (HTTPS, TLS)
      await sendContactEmail(payload)
      
      setSubmitSuccess(true)
      setErrors({})
      toast.success(
        t('contact.success.title', 'Message sent'),
        t('contact.success.description', 'We will get back to you soon.')
      )

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
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Failed to submit contact form:', error)
      }
      
      let errorMessage = t('contact.errors.submitFailed', 'Failed to send message. Please try again.')

      const is422Recipient =
        (error instanceof Error && error.message.includes('EMAILJS_RECIPIENT_EMPTY')) ||
        (typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          (error as { status?: number }).status === 422 &&
          String((error as { text?: string }).text ?? '').toLowerCase().includes('recipient'))

      if (is422Recipient) {
        errorMessage = t(
          'contact.errors.emailjsRecipient',
          'Email configuration error: set the template "To Email" to {{to_email}} in the EmailJS dashboard (dashboard.emailjs.com).'
        )
      } else if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = t('contact.errors.timeout', 'Request timed out. Please check your connection and try again.')
        } else if (error.message.includes('network')) {
          errorMessage = t('contact.errors.networkError', 'Network error. Please check your connection and try again.')
        }
      }
      
      setSubmitError(errorMessage)
      setIsSubmitting(false)
      toast.error(
        t('contact.errors.submitFailed', 'Failed to send message. Please try again.'),
        errorMessage
      )
    }
  }

  const fieldClass = (invalid: boolean) =>
    cn('contact-field__control', invalid && 'is-invalid')

  if (!isOpen) {
    return null
  }

  return (
    <div
      id="contact-modal"
      className={cn('contact-modal-premium', className)}
      ref={modalRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div id="contact-modal-dialog" className="contact-modal-dialog">
        <div id="contact-modal-content" className="contact-modal-content contact-letter">
          <header className="contact-letter__mast">
            <h2 className="contact-letter__title" id="contact-modal-title">
              {t('contact.title', 'Contact Me')}
            </h2>
            <button
              type="button"
              className="contact-letter__close"
              onClick={() => {
                if (!isSubmitting) {
                  onClose()
                }
              }}
              disabled={isSubmitting}
              aria-label={t('contact.close', 'Close')}
            >
              <Icon name="x" size={18} aria-hidden />
            </button>
          </header>

          <form
            id="contact-form"
            name="contact-form"
            onSubmit={handleSubmit}
            data-form-type="contact"
            autoComplete="off"
            data-lpignore="true"
            role="form"
            aria-label={t('contact.title', 'Contact form')}
            data-state={isSubmitting ? 'loading' : submitSuccess ? 'success' : submitError ? 'error' : 'default'}
          >
            <input
              type="password"
              name="password-honeypot"
              autoComplete="new-password"
              tabIndex={-1}
              aria-hidden="true"
              className="contact-letter__honeypot"
            />

            <div className="contact-letter__body">
              {submitSuccess ? (
                <div className="contact-letter__sent" role="alert">
                  <p className="contact-letter__sent-line">{t('contact.success', 'Thank you! Your message has been sent successfully.')}</p>
                </div>
              ) : (
                <>
                  <p className="contact-letter__lede">{t('contact.lede', 'A short note is enough. I read every message and reply when I can take the work on.')}</p>

                  {submitError ? (
                    <div className="contact-letter__banner is-error" role="alert">
                      <Icon name="exclamation-circle" size={20} aria-hidden />
                      <p>{submitError}</p>
                    </div>
                  ) : null}

                  <div className="contact-letter__row">
                    <ContactField id="contact-name" label={t('contact.fields.name', 'Name')} required error={errors.name}>
                      <input
                        ref={nameInputRef}
                        type="text"
                        id="contact-name"
                        name="name"
                        autoComplete="name"
                        data-form-type="contact"
                        className={fieldClass(!!errors.name)}
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', (e.target as HTMLInputElement).value)}
                        onInput={(e) => handleInputChange('name', (e.target as HTMLInputElement).value)}
                        disabled={isSubmitting}
                        required
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      />
                    </ContactField>

                    <ContactField id="contact-email" label={t('contact.fields.email', 'Email')} required error={errors.email}>
                      <input
                        type="email"
                        id="contact-email"
                        name="email"
                        autoComplete="off"
                        data-form-type="contact"
                        className={fieldClass(!!errors.email)}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', (e.target as HTMLInputElement).value)}
                        onInput={(e) => handleInputChange('email', (e.target as HTMLInputElement).value)}
                        disabled={isSubmitting}
                        required
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      />
                    </ContactField>
                  </div>

                  <div className="contact-letter__row">
                    <ContactField
                      id="contact-phone"
                      label={t('contact.fields.phone', 'Phone')}
                      optionalLabel={t('contact.fields.optional', 'Optional')}
                      error={errors.phone}
                      hint={t('contact.fields.phoneExample', 'E.164 format')}
                      hintId="contact-phone-hint"
                    >
                      <input
                        type="tel"
                        id="contact-phone"
                        name="phone"
                        autoComplete="tel"
                        data-form-type="contact"
                        className={fieldClass(!!errors.phone)}
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', (e.target as HTMLInputElement).value)}
                        onInput={(e) => handleInputChange('phone', (e.target as HTMLInputElement).value)}
                        disabled={isSubmitting}
                        placeholder={t('contact.fields.phonePlaceholder')}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'contact-phone-error' : 'contact-phone-hint'}
                      />
                    </ContactField>

                    <ContactField id="contact-subject" label={t('contact.fields.subject', 'Subject')} required error={errors.subject}>
                      <input
                        type="text"
                        id="contact-subject"
                        name="subject"
                        autoComplete="off"
                        className={fieldClass(!!errors.subject)}
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
                    </ContactField>
                  </div>

                  <p className="contact-letter__chapter">{t('contact.organisation', 'Organisation')}</p>

                  <div className="contact-letter__row">
                    <ContactField
                      id="contact-company-name"
                      label={t('contact.fields.companyName', 'Company Name')}
                      optionalLabel={t('contact.fields.optional', 'Optional')}
                    >
                      <input
                        type="text"
                        id="contact-company-name"
                        name="companyName"
                        autoComplete="organization"
                        className="contact-field__control"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', (e.target as HTMLInputElement).value)}
                        onInput={(e) => handleInputChange('companyName', (e.target as HTMLInputElement).value)}
                        disabled={isSubmitting}
                        placeholder={t('contact.fields.companyNamePlaceholder', 'Your company name')}
                      />
                    </ContactField>

                    <ContactField
                      id="contact-company-identifier"
                      label={t('contact.fields.companyIdentifier', 'Company ID')}
                      optionalLabel={t('contact.fields.optional', 'Optional')}
                      hint={t('contact.fields.companyIdentifierHint', 'VAT or tax ID')}
                      hintId="contact-company-identifier-hint"
                    >
                      <input
                        type="text"
                        id="contact-company-identifier"
                        name="companyIdentifier"
                        autoComplete="off"
                        className="contact-field__control"
                        value={formData.companyIdentifier}
                        onChange={(e) => handleInputChange('companyIdentifier', (e.target as HTMLInputElement).value)}
                        onInput={(e) => handleInputChange('companyIdentifier', (e.target as HTMLInputElement).value)}
                        disabled={isSubmitting}
                        placeholder={t('contact.fields.companyIdentifierPlaceholder', 'VAT/Tax ID')}
                        aria-describedby="contact-company-identifier-hint"
                      />
                    </ContactField>
                  </div>

                  <ContactField
                    id="contact-message"
                    label={t('contact.fields.message', 'Message')}
                    required
                    error={errors.message}
                    hint={t('contact.fields.wordCount', '{{count}} / {{max}} words')
                      .replace('{{count}}', String(wordCount))
                      .replace('{{max}}', String(MAX_WORDS))}
                    hintId="contact-message-hint"
                  >
                    <textarea
                      id="contact-message"
                      name="message"
                      autoComplete="off"
                      className={cn(
                        'contact-field__control contact-field__control--area',
                        (errors.message || wordCount > MAX_WORDS) && 'is-invalid'
                      )}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', (e.target as HTMLTextAreaElement).value)}
                      onInput={(e) => handleInputChange('message', (e.target as HTMLTextAreaElement).value)}
                      disabled={isSubmitting}
                      required
                      rows={5}
                      aria-required="true"
                      aria-invalid={!!errors.message || wordCount > MAX_WORDS}
                      aria-describedby={errors.message ? 'contact-message-error' : 'contact-message-hint'}
                    />
                  </ContactField>
                </>
              )}
            </div>

            {!submitSuccess ? (
              <div className="contact-letter__sign">
                <Button
                  type="submit"
                  form="contact-form"
                  variant="ghost"
                  size="md"
                  className="contact-letter__send"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  aria-label={t('contact.submit', 'Send Message')}
                >
                  {isSubmitting ? t('contact.submitting', 'Sending...') : t('contact.submit', 'Send Message')}
                </Button>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  )
}

