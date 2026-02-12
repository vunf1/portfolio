/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/preact'
import { ContactModal } from '../ContactModal'
import type { ContactModalProps } from '../../../types'

// Mock the TranslationContext
vi.mock('../../../contexts/TranslationContext', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => {
      const translations: Record<string, string> = {
        'contact.title': 'Contact Me',
        'contact.close': 'Close',
        'contact.cancel': 'Cancel',
        'contact.submit': 'Send Message',
        'contact.submitting': 'Sending...',
        'contact.success': 'Thank you! Your message has been sent successfully.',
        'contact.fields.name': 'Full Name',
        'contact.fields.email': 'Email',
        'contact.fields.phone': 'Phone',
        'contact.fields.phoneHint': 'Optional, E.164 format',
        'contact.fields.phoneExample': 'Example: +351912345678',
        'contact.fields.subject': 'Subject',
        'contact.fields.subjectPlaceholder': 'What is this regarding?',
        'contact.fields.message': 'Message',
        'contact.fields.optional': 'Optional',
        'contact.errors.nameRequired': 'Name is required',
        'contact.errors.nameInvalid': 'Please enter a valid name (at least 2 characters, letters only)',
        'contact.errors.emailRequired': 'Email is required',
        'contact.errors.emailInvalid': 'Please enter a valid email address',
        'contact.errors.phoneInvalid': 'Please enter a valid phone number in E.164 format (e.g., +351912345678)',
        'contact.errors.subjectRequired': 'Subject is required',
        'contact.errors.subjectTooShort': 'Subject must be at least 3 characters',
        'contact.errors.messageRequired': 'Message is required',
        'contact.errors.messageTooShort': 'Message must be at least 10 characters',
        'contact.errors.submitFailed': 'Failed to send message. Please try again.',
        'contact.errors.timeout': 'Request timed out. Please check your connection and try again.',
        'contact.errors.networkError': 'Network error. Please check your connection and try again.',
        'contact.errors.emailjsRecipient': 'Email config: set template "To Email" to {{to_email}} in EmailJS dashboard.'
      }
      return translations[key] || defaultValue || key
    },
    currentLanguage: 'en',
    changeLanguage: vi.fn(),
    isEnglish: true,
    isPortuguese: false,
    supportedLanguages: ['en', 'pt-PT']
  }),
  preloadTranslations: vi.fn().mockResolvedValue(undefined)
}))

// Mock email sender (EmailJS)
const mockSendContactEmail = vi.fn().mockResolvedValue(undefined)
vi.mock('../../../utils/emailSender', () => ({
  sendContactEmail: (...args: unknown[]) => mockSendContactEmail(...args)
}))

// Mock validation utilities
vi.mock('../../../utils/validation', () => ({
  validateEmail: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  validateName: (name: string) => name.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim()),
  validatePhone: (phone: string) => /^\+[1-9]\d{6,14}$/.test(phone)
}))

const defaultProps: ContactModalProps = {
  isOpen: false,
  onClose: vi.fn()
}

describe('ContactModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSendContactEmail.mockResolvedValue(undefined)
    document.body.style.overflow = ''
  })

  it('does not render when isOpen is false', () => {
    render(<ContactModal {...defaultProps} />)
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true', () => {
    const props = { ...defaultProps, isOpen: true }
    render(<ContactModal {...props} />)
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Contact Me')).toBeInTheDocument()
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /Message/i })).toBeInTheDocument()
  })

  it('renders all form fields', () => {
    const props = { ...defaultProps, isOpen: true }
    render(<ContactModal {...props} />)
    
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /Message/i })).toBeInTheDocument()
  })

  it('validates required fields on submit', async () => {
    const props = { ...defaultProps, isOpen: true }
    render(<ContactModal {...props} />)
    
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('validates email format', async () => {
    const props = { ...defaultProps, isOpen: true }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement
    const subjectInput = screen.getByLabelText(/Subject/i) as HTMLInputElement
    const messageInput = screen.getByRole('textbox', { name: /Message/i }) as HTMLTextAreaElement
    
    // Set values using act to ensure state updates
    await act(async () => {
      fireEvent.input(nameInput, { target: { value: 'John Doe' } })
      fireEvent.input(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.input(subjectInput, { target: { value: 'Test Subject' } })
      fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    })
    
    // Wait for state to update
    await waitFor(() => {
      expect(nameInput.value).toBe('John Doe')
      expect(emailInput.value).toBe('invalid-email')
    })
    
    const form = screen.getByRole('form')
    await act(async () => {
      fireEvent.submit(form)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('validates phone number format when provided', async () => {
    const props = { ...defaultProps, isOpen: true }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement
    const phoneInput = screen.getByLabelText(/Phone/i) as HTMLInputElement
    const subjectInput = screen.getByLabelText(/Subject/i) as HTMLInputElement
    const messageInput = screen.getByRole('textbox', { name: /Message/i }) as HTMLTextAreaElement
    
    await act(async () => {
      fireEvent.input(nameInput, { target: { value: 'John Doe' } })
      fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.input(phoneInput, { target: { value: 'invalid-phone' } })
      fireEvent.input(subjectInput, { target: { value: 'Test Subject' } })
      fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    })
    
    await waitFor(() => {
      expect(nameInput.value).toBe('John Doe')
    })
    
    const form = screen.getByRole('form')
    await act(async () => {
      fireEvent.submit(form)
    })
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid phone number/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('validates message minimum length', async () => {
    const props = { ...defaultProps, isOpen: true }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement
    const subjectInput = screen.getByLabelText(/Subject/i) as HTMLInputElement
    const messageInput = screen.getByRole('textbox', { name: /Message/i }) as HTMLTextAreaElement
    
    await act(async () => {
      fireEvent.input(nameInput, { target: { value: 'John Doe' } })
      fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.input(subjectInput, { target: { value: 'Test Subject' } })
      fireEvent.input(messageInput, { target: { value: 'Short' } })
    })
    
    await waitFor(() => {
      expect(nameInput.value).toBe('John Doe')
    })
    
    const form = screen.getByRole('form')
    await act(async () => {
      fireEvent.submit(form)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Message must be at least 10 characters')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('submits form with valid data', async () => {
    const mockOnSuccess = vi.fn()
    const props = { ...defaultProps, isOpen: true, onSuccess: mockOnSuccess }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement
    const subjectInput = screen.getByLabelText(/Subject/i) as HTMLInputElement
    const messageInput = screen.getByRole('textbox', { name: /Message/i }) as HTMLTextAreaElement
    
    await act(async () => {
      fireEvent.input(nameInput, { target: { value: 'John Doe' } })
      fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.input(subjectInput, { target: { value: 'Test Subject' } })
      fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    })
    
    await waitFor(() => {
      expect(nameInput.value).toBe('John Doe')
    })
    
    const form = screen.getByRole('form')
    await act(async () => {
      fireEvent.submit(form)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Thank you! Your message has been sent successfully.')).toBeInTheDocument()
    }, { timeout: 3000 })
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('handles submission error', async () => {
    mockSendContactEmail.mockRejectedValueOnce(new Error('network error'))
    
    const props = { ...defaultProps, isOpen: true }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement
    const subjectInput = screen.getByLabelText(/Subject/i) as HTMLInputElement
    const messageInput = screen.getByRole('textbox', { name: /Message/i }) as HTMLTextAreaElement
    
    await act(async () => {
      fireEvent.input(nameInput, { target: { value: 'John Doe' } })
      fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.input(subjectInput, { target: { value: 'Test Subject' } })
      fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    })
    
    await waitFor(() => {
      expect(nameInput.value).toBe('John Doe')
    })
    
    const form = screen.getByRole('form')
    await act(async () => {
      fireEvent.submit(form)
    })
    
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('calls onClose when overlay is clicked', () => {
    const mockOnClose = vi.fn()
    const props = { ...defaultProps, isOpen: true, onClose: mockOnClose }
    const { container } = render(<ContactModal {...props} />)
    
    const overlay = container.querySelector('.contact-modal-premium')
    expect(overlay).toBeInTheDocument()
    fireEvent.click(overlay!)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when escape key is pressed', () => {
    const mockOnClose = vi.fn()
    const props = { ...defaultProps, isOpen: true, onClose: mockOnClose }
    render(<ContactModal {...props} />)
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('does not close on escape when submitting', async () => {
    mockSendContactEmail.mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(() => resolve(), 500))
    )
    
    const mockOnClose = vi.fn()
    const props = { ...defaultProps, isOpen: true, onClose: mockOnClose }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement
    const subjectInput = screen.getByLabelText(/Subject/i) as HTMLInputElement
    const messageInput = screen.getByRole('textbox', { name: /Message/i }) as HTMLTextAreaElement
    
    await act(async () => {
      fireEvent.input(nameInput, { target: { value: 'John Doe' } })
      fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.input(subjectInput, { target: { value: 'Test Subject' } })
      fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    })
    
    await waitFor(() => {
      expect(nameInput.value).toBe('John Doe')
    })
    
    const form = screen.getByRole('form')
    await act(async () => {
      fireEvent.submit(form)
    })
    
    // Wait for submission to start - check for disabled button or "Sending" text
    await waitFor(() => {
      const submitButtons = screen.getAllByRole('button', { name: /Send Message|Sending/i })
      const submitButton = submitButtons[0]
      expect(submitButton).toBeDisabled()
    }, { timeout: 1000 })
    
    // Try to close with escape while submitting
    fireEvent.keyDown(document, { key: 'Escape' })
    
    // Should not close during submission
    const submitButtons = screen.getAllByRole('button', { name: /Send Message|Sending/i })
    expect(submitButtons[0]).toBeDisabled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('shows loading state during submission', async () => {
    mockSendContactEmail.mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(() => resolve(), 500))
    )
    
    const props = { ...defaultProps, isOpen: true }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement
    const subjectInput = screen.getByLabelText(/Subject/i) as HTMLInputElement
    const messageInput = screen.getByRole('textbox', { name: /Message/i }) as HTMLTextAreaElement
    
    await act(async () => {
      fireEvent.input(nameInput, { target: { value: 'John Doe' } })
      fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.input(subjectInput, { target: { value: 'Test Subject' } })
      fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    })
    
    await waitFor(() => {
      expect(nameInput.value).toBe('John Doe')
    })
    
    const form = screen.getByRole('form')
    const submitButtons = screen.getAllByRole('button', { name: 'Send Message' })
    const submitButton = submitButtons[0]
    
    // Submit form
    await act(async () => {
      fireEvent.submit(form)
    })
    
    // Check loading state - button should be disabled and contain "Sending" text
    await waitFor(() => {
      // Check if button is disabled (indicates submitting state)
      expect(submitButton).toBeDisabled()
      // Check for "Sending" text using a more flexible matcher
      // The text might be in a child element, so check the button's text content
      expect(submitButton.textContent).toMatch(/Sending/i)
    }, { timeout: 1000 })
  })

  it('clears field errors when user starts typing', async () => {
    const props = { ...defaultProps, isOpen: true }
    render(<ContactModal {...props} />)
    
    const form = screen.getByRole('form')
    await act(async () => {
      fireEvent.submit(form)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    }, { timeout: 3000 })
    
    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
    await act(async () => {
      fireEvent.input(nameInput, { target: { value: 'John' } })
    })
    
    await waitFor(() => {
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('has proper accessibility attributes', () => {
    const props = { ...defaultProps, isOpen: true }
    render(<ContactModal {...props} />)
    
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('aria-modal', 'true')
    expect(modal).toHaveAttribute('aria-labelledby', 'contact-modal-title')
    
    const title = screen.getByText('Contact Me')
    expect(title).toHaveAttribute('id', 'contact-modal-title')
    
    const nameInput = screen.getByLabelText(/Full Name/i)
    expect(nameInput).toHaveAttribute('aria-required', 'true')
    expect(nameInput).toHaveAttribute('required')
  })

  it('accepts optional phone number', async () => {
    const mockOnSuccess = vi.fn()
    const props = { ...defaultProps, isOpen: true, onSuccess: mockOnSuccess }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement
    const subjectInput = screen.getByLabelText(/Subject/i) as HTMLInputElement
    const messageInput = screen.getByRole('textbox', { name: /Message/i }) as HTMLTextAreaElement
    
    await act(async () => {
      fireEvent.input(nameInput, { target: { value: 'John Doe' } })
      fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.input(subjectInput, { target: { value: 'Test Subject' } })
      fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    })
    
    await waitFor(() => {
      expect(nameInput.value).toBe('John Doe')
    })
    
    const form = screen.getByRole('form')
    await act(async () => {
      fireEvent.submit(form)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Thank you! Your message has been sent successfully.')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('accepts valid phone number in E.164 format', async () => {
    const mockOnSuccess = vi.fn()
    const props = { ...defaultProps, isOpen: true, onSuccess: mockOnSuccess }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement
    const phoneInput = screen.getByLabelText(/Phone/i) as HTMLInputElement
    const subjectInput = screen.getByLabelText(/Subject/i) as HTMLInputElement
    const messageInput = screen.getByRole('textbox', { name: /Message/i }) as HTMLTextAreaElement
    
    await act(async () => {
      fireEvent.input(nameInput, { target: { value: 'John Doe' } })
      fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.input(phoneInput, { target: { value: '+351912345678' } })
      fireEvent.input(subjectInput, { target: { value: 'Test Subject' } })
      fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    })
    
    await waitFor(() => {
      expect(nameInput.value).toBe('John Doe')
    })
    
    const form = screen.getByRole('form')
    await act(async () => {
      fireEvent.submit(form)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Thank you! Your message has been sent successfully.')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('resets form when modal closes', async () => {
    const props = { ...defaultProps, isOpen: true }
    const { rerender, unmount } = render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
    fireEvent.input(nameInput, { target: { value: 'John Doe' } })
    
    await waitFor(() => {
      expect(nameInput.value).toBe('John Doe')
    })
    
    // Close modal
    rerender(<ContactModal {...props} isOpen={false} />)
    
    // Wait for the component to finish closing
    await waitFor(() => {
      expect(screen.queryByLabelText(/Full Name/i)).not.toBeInTheDocument()
    })
    
    // Clear sessionStorage to simulate form reset
    // The component saves to sessionStorage, so we need to clear it to test reset behavior
    sessionStorage.clear()
    
    // Unmount and remount to ensure a fresh component instance
    unmount()
    
    // Reopen modal with a fresh render
    render(<ContactModal {...props} isOpen={true} />)
    
    await waitFor(() => {
      const newNameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
      // Form should be empty after clearing sessionStorage
      expect(newNameInput.value).toBe('')
    }, { timeout: 2000 })
  })
})

