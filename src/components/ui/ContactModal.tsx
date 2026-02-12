import { useState, useEffect, useRef } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import { sendContactEmail } from '../../utils/emailSender'
import { toast } from '../../lib/toast-store'
import { validateEmail, validateName, validatePhone } from '../../utils/validation'
import { cn } from '../../lib/utils'
import { Button } from './Button'
import { Icon } from './Icon'
import type { ContactFormData } from '../../types/n8n'
import type { ContactModalProps } from '../../types'

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
      // Prevent body scroll when modal is open using CSS class
      document.body.classList.add('modal-open')
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.classList.remove('modal-open')
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

  const renderActionButtons = () => (
    <Button
      type="submit"
      variant="ghost"
      size="md"
      className="min-w-[120px] no-underline bg-transparent border-0 shadow-none text-white hover:opacity-80 hover:scale-100"
      disabled={isSubmitting}
      loading={isSubmitting}
      aria-label={t('contact.submit', 'Send Message')}
    >
      {isSubmitting ? t('contact.submitting', 'Sending...') : t('contact.submit', 'Send Message')}
    </Button>
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
        <div className="contact-modal-content flex flex-col max-w-2xl">
          <div className="modal-header flex items-center justify-between gap-4 px-6 py-5 rounded-t-2xl">
            <h2 className="modal-title text-xl font-semibold text-white text-left" id="contact-modal-title">
              {t('contact.title', 'Contact Me')}
            </h2>
            {!submitSuccess && (
              <div className="modal-header-actions flex items-center gap-2 shrink-0">
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
            <div className="modal-body px-6 py-6 space-y-5 overflow-y-auto">
              {submitSuccess ? (
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4 text-emerald-800" role="alert">
                  <Icon name="check-circle" size={24} className="shrink-0 text-emerald-600" aria-hidden />
                  <p className="text-base font-medium">{t('contact.success', 'Thank you! Your message has been sent successfully.')}</p>
                </div>
              ) : (
                <>
                  {submitError && (
                    <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-red-800" role="alert">
                      <Icon name="exclamation-circle" size={24} className="shrink-0 text-red-600" aria-hidden />
                      <p className="text-sm font-medium">{submitError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">
                        {t('contact.fields.name', 'Name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={nameInputRef}
                        type="text"
                        id="contact-name"
                        name="name"
                        autoComplete="name"
                        data-form-type="contact"
                        className={cn(
                          'w-full rounded-lg border px-4 py-3 text-base transition-colors',
                          'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                          errors.name ? 'border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300 bg-white'
                        )}
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
                        <p id="contact-name-error" className="text-sm text-red-600 font-medium" role="alert">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
                        {t('contact.fields.email', 'Email')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        name="email"
                        autoComplete="off"
                        data-form-type="contact"
                        className={cn(
                          'w-full rounded-lg border px-4 py-3 text-base transition-colors',
                          'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                          errors.email ? 'border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300 bg-white'
                        )}
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
                        <p id="contact-email-error" className="text-sm text-red-600 font-medium" role="alert">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700">
                        {t('contact.fields.phone', 'Phone')} <span className="text-gray-500 font-normal">({t('contact.fields.phoneHint', 'Optional')})</span>
                      </label>
                      <input
                        type="tel"
                        id="contact-phone"
                        name="phone"
                        autoComplete="tel"
                        data-form-type="contact"
                        className={cn(
                          'w-full rounded-lg border px-4 py-3 text-base transition-colors',
                          'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                          errors.phone ? 'border-red-500 bg-red-50/50' : 'border-gray-300 bg-white'
                        )}
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', (e.target as HTMLInputElement).value)}
                        onInput={(e) => handleInputChange('phone', (e.target as HTMLInputElement).value)}
                        disabled={isSubmitting}
                        placeholder={t('contact.fields.phonePlaceholder')}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'contact-phone-error' : 'contact-phone-hint'}
                      />
                      {errors.phone ? (
                        <p id="contact-phone-error" className="text-sm text-red-600 font-medium" role="alert">{errors.phone}</p>
                      ) : (
                        <p id="contact-phone-hint" className="text-xs text-gray-500">{t('contact.fields.phoneExample', 'E.164 format')}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700">
                        {t('contact.fields.subject', 'Subject')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact-subject"
                        name="subject"
                        autoComplete="off"
                        className={cn(
                          'w-full rounded-lg border px-4 py-3 text-base transition-colors',
                          'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                          errors.subject ? 'border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300 bg-white'
                        )}
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
                        <p id="contact-subject-error" className="text-sm text-red-600 font-medium" role="alert">{errors.subject}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-company-name" className="block text-sm font-medium text-gray-700">
                        {t('contact.fields.companyName', 'Company Name')} <span className="text-gray-500 font-normal">({t('contact.fields.optional', 'Optional')})</span>
                      </label>
                      <input
                        type="text"
                        id="contact-company-name"
                        name="companyName"
                        autoComplete="organization"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', (e.target as HTMLInputElement).value)}
                        onInput={(e) => handleInputChange('companyName', (e.target as HTMLInputElement).value)}
                        disabled={isSubmitting}
                        placeholder={t('contact.fields.companyNamePlaceholder', 'Your company name')}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-company-identifier" className="block text-sm font-medium text-gray-700">
                        {t('contact.fields.companyIdentifier', 'Company ID')} <span className="text-gray-500 font-normal">({t('contact.fields.optional', 'Optional')})</span>
                      </label>
                      <input
                        type="text"
                        id="contact-company-identifier"
                        name="companyIdentifier"
                        autoComplete="off"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                        value={formData.companyIdentifier}
                        onChange={(e) => handleInputChange('companyIdentifier', (e.target as HTMLInputElement).value)}
                        onInput={(e) => handleInputChange('companyIdentifier', (e.target as HTMLInputElement).value)}
                        disabled={isSubmitting}
                        placeholder={t('contact.fields.companyIdentifierPlaceholder', 'VAT/Tax ID')}
                        aria-describedby="contact-company-identifier-hint"
                      />
                      <p id="contact-company-identifier-hint" className="text-xs text-gray-500">{t('contact.fields.companyIdentifierHint', 'VAT or tax ID')}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700">
                      {t('contact.fields.message', 'Message')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      autoComplete="off"
                      className={cn(
                        'w-full rounded-lg border px-4 py-3 text-base resize-y min-h-[120px] transition-colors',
                        'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                        'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                        (errors.message || wordCount > MAX_WORDS) ? 'border-red-500 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300 bg-white'
                      )}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', (e.target as HTMLTextAreaElement).value)}
                      onInput={(e) => handleInputChange('message', (e.target as HTMLTextAreaElement).value)}
                      disabled={isSubmitting}
                      required
                      rows={4}
                      aria-required="true"
                      aria-invalid={!!errors.message || wordCount > MAX_WORDS}
                      aria-describedby={errors.message ? 'contact-message-error' : 'contact-message-hint'}
                    />
                    <div className="flex items-center justify-between">
                      <p id="contact-message-hint" className={cn('text-xs', wordCount > MAX_WORDS ? 'text-red-600 font-medium' : 'text-gray-500')}>
                        {t('contact.fields.wordCount', '{{count}} / {{max}} words').replace('{{count}}', String(wordCount)).replace('{{max}}', String(MAX_WORDS))}
                      </p>
                    </div>
                    {errors.message && (
                      <p id="contact-message-error" className="text-sm text-red-600 font-medium" role="alert">{errors.message}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

