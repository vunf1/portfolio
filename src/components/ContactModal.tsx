import { useState, useCallback, useRef } from 'preact/hooks'
import type { ContactModalProps, ContactFormData, FormErrors } from '../types'

// Security constants
const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION = 5 * 60 * 1000 // 5 minutes
const RATE_LIMIT_DELAY = 2000 // 2 seconds between submissions

// Input sanitization function
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .substring(0, 500) // Limit length
}

// Enhanced validation with security checks
const validateForm = (formData: ContactFormData): FormErrors => {
  const errors: FormErrors = {}
  
  // Name validation
  const name = formData.visitorName.trim()
  if (!name) {
    errors.visitorName = 'Full name is required'
  } else if (name.length < 2) {
    errors.visitorName = 'Name must be at least 2 characters'
  } else if (name.length > 100) {
    errors.visitorName = 'Name must be less than 100 characters'
  } else if (!/^[a-zA-Z\s\-'\.]+$/.test(name)) {
    errors.visitorName = 'Name contains invalid characters'
  }
  
  // Email validation with stricter regex
  const email = formData.visitorEmail.trim()
  if (!email) {
    errors.visitorEmail = 'Email address is required'
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    errors.visitorEmail = 'Please enter a valid email address'
  } else if (email.length > 254) {
    errors.visitorEmail = 'Email address is too long'
  }
  
  // Company validation (optional but validate if provided)
  if (formData.visitorCompany.trim()) {
    const company = formData.visitorCompany.trim()
    if (company.length > 100) {
      errors.visitorCompany = 'Company name must be less than 100 characters'
    } else if (!/^[a-zA-Z0-9\s\-'\.&,]+$/.test(company)) {
      errors.visitorCompany = 'Company name contains invalid characters'
    }
  }
  
  // Reason validation (optional but validate if provided)
  if (formData.contactReason && !['job-opportunity', 'project-collaboration', 'consulting', 'networking', 'other'].includes(formData.contactReason)) {
    errors.contactReason = 'Invalid reason selected'
  }
  
  return errors
}

export function ContactModal({ show, onClose, onSubmit }: ContactModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    visitorName: '',
    visitorEmail: '',
    visitorCompany: '',
    contactReason: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockoutUntil, setLockoutUntil] = useState(0)
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0)
  
  const formRef = useRef<HTMLFormElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  const handleInputChange = useCallback((e: Event) => {
    const target = e.target as HTMLInputElement
    const { name, value } = target
    
    // Sanitize input before setting state
    const sanitizedValue = sanitizeInput(value)
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }, [errors])

  const handleSubmit = useCallback(async (e: Event) => {
    e.preventDefault()
    
    // Check lockout
    if (Date.now() < lockoutUntil) {
      const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 1000)
      alert(`Too many failed attempts. Please wait ${remainingTime} seconds before trying again.`)
      return
    }
    
    // Check rate limiting
    const now = Date.now()
    if (now - lastSubmissionTime < RATE_LIMIT_DELAY) {
      alert('Please wait a moment before submitting again.')
      return
    }
    
    // Validate form
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setAttempts(prev => prev + 1)
      
      // Check if we should lock out
      if (attempts + 1 >= MAX_ATTEMPTS) {
        setLockoutUntil(Date.now() + LOCKOUT_DURATION)
        setAttempts(0)
        alert('Too many failed attempts. Form is temporarily locked for 5 minutes.')
      }
      return
    }
    
    try {
      setIsSubmitting(true)
      setLastSubmissionTime(now)
      
      // Disable submit button to prevent double submission
      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = true
      }
      
      // Submit form
      await onSubmit(formData)
      
      // Reset form and state on success
      setFormData({
        visitorName: '',
        visitorEmail: '',
        visitorCompany: '',
        contactReason: ''
      })
      setErrors({})
      setAttempts(0)
      
      // Close modal
      onClose()
      
    } catch (error) {
      console.error('Form submission error:', error)
      alert('An error occurred while submitting the form. Please try again.')
    } finally {
      setIsSubmitting(false)
      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = false
      }
    }
  }, [formData, errors, attempts, lockoutUntil, lastSubmissionTime, onSubmit, onClose])

  // Reset attempts when modal opens
  if (show && attempts > 0) {
    setAttempts(0)
  }

  if (!show) return null

  const isLockedOut = Date.now() < lockoutUntil
  const remainingLockoutTime = Math.ceil((lockoutUntil - Date.now()) / 1000)

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered modal-mobile">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Unlock Contact Information</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
              disabled={isSubmitting}
            ></button>
          </div>
          
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Security Status */}
              {isLockedOut && (
                <div className="alert alert-warning">
                  <i className="fa-solid fa-shield-alt me-2"></i>
                  Form temporarily locked. Please wait {remainingLockoutTime} seconds.
                </div>
              )}
              
              {attempts > 0 && !isLockedOut && (
                <div className="alert alert-info">
                  <i className="fa-solid fa-info-circle me-2"></i>
                  Attempts: {attempts}/{MAX_ATTEMPTS}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="visitorName" className="form-label">
                  Full Name * <span className="text-muted">(2-100 characters)</span>
                </label>
                <input 
                  type="text" 
                  className={`form-control ${errors.visitorName ? 'is-invalid' : ''}`}
                  id="visitorName" 
                  name="visitorName"
                  value={formData.visitorName}
                  onChange={handleInputChange}
                  required
                  disabled={isLockedOut || isSubmitting}
                  placeholder="Enter your full name"
                  maxLength={100}
                  pattern="[a-zA-Z\s\-'\.]+"
                  title="Only letters, spaces, hyphens, apostrophes, and periods allowed"
                />
                {errors.visitorName && (
                  <div className="invalid-feedback">{errors.visitorName}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="visitorEmail" className="form-label">
                  Email Address * <span className="text-muted">(max 254 characters)</span>
                </label>
                <input 
                  type="email" 
                  className={`form-control ${errors.visitorEmail ? 'is-invalid' : ''}`}
                  id="visitorEmail" 
                  name="visitorEmail"
                  value={formData.visitorEmail}
                  onChange={handleInputChange}
                  required
                  disabled={isLockedOut || isSubmitting}
                  placeholder="Enter your email address"
                  maxLength={254}
                />
                {errors.visitorEmail && (
                  <div className="invalid-feedback">{errors.visitorEmail}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="visitorCompany" className="form-label">
                  Company <span className="text-muted">(Optional, max 100 characters)</span>
                </label>
                <input 
                  type="text" 
                  className={`form-control ${errors.visitorCompany ? 'is-invalid' : ''}`}
                  id="visitorCompany" 
                  name="visitorCompany"
                  value={formData.visitorCompany}
                  onChange={handleInputChange}
                  disabled={isLockedOut || isSubmitting}
                  placeholder="Enter your company name"
                  maxLength={100}
                  pattern="[a-zA-Z0-9\s\-'\.&,]+"
                  title="Only letters, numbers, spaces, hyphens, apostrophes, periods, ampersands, and commas allowed"
                />
                {errors.visitorCompany && (
                  <div className="invalid-feedback">{errors.visitorCompany}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="contactReason" className="form-label">Reason for Contact</label>
                <select 
                  className={`form-select ${errors.contactReason ? 'is-invalid' : ''}`}
                  id="contactReason" 
                  name="contactReason"
                  value={formData.contactReason}
                  onChange={handleInputChange}
                  disabled={isLockedOut || isSubmitting}
                >
                  <option value="">Select a reason...</option>
                  <option value="job-opportunity">Job Opportunity</option>
                  <option value="project-collaboration">Project Collaboration</option>
                  <option value="consulting">Consulting</option>
                  <option value="networking">Networking</option>
                  <option value="other">Other</option>
                </select>
                {errors.contactReason && (
                  <div className="invalid-feedback">{errors.contactReason}</div>
                )}
              </div>
              
              {/* Security Notice */}
              <div className="alert alert-info small">
                <i className="fa-solid fa-shield-alt me-2"></i>
                <strong>Security:</strong> This form is protected against spam and abuse. 
                Your information is processed securely and will not be shared.
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                ref={submitButtonRef}
                type="submit" 
                className="btn btn-primary"
                disabled={isLockedOut || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-unlock me-2"></i>
                    Unlock Information
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Modal backdrop */}
      <div className="modal-backdrop fade show" onClick={isSubmitting ? undefined : onClose}></div>
    </div>
  )
}




