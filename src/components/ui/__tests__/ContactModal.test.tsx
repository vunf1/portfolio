import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/preact'
import { ContactModal } from '../ContactModal'
import type { ContactModalProps } from '../../../types'
import { N8nClient } from '../../../utils/n8nClient'

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
        'contact.errors.messageRequired': 'Message is required',
        'contact.errors.messageTooShort': 'Message must be at least 10 characters',
        'contact.errors.submitFailed': 'Failed to send message. Please try again.',
        'contact.errors.timeout': 'Request timed out. Please check your connection and try again.',
        'contact.errors.networkError': 'Network error. Please check your connection and try again.'
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

// Mock N8nClient
vi.mock('../../../utils/n8nClient', () => ({
  N8nClient: vi.fn().mockImplementation(() => ({
    sendToWebhook: vi.fn().mockResolvedValue({ success: true, data: {} })
  }))
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
    // Reset document.body.overflow
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
    
    const nameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const messageInput = screen.getByRole('textbox', { name: /Message/i })
    
    fireEvent.input(nameInput, { target: { value: 'John Doe' } })
    fireEvent.input(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    
    const submitButtons = screen.getAllByRole('button', { name: 'Send Message' })
    const submitButton = submitButtons[0]
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    })
  })

  it('validates phone number format when provided', async () => {
    const props = { ...defaultProps, isOpen: true }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const phoneInput = screen.getByLabelText(/Phone/i)
    const messageInput = screen.getByRole('textbox', { name: /Message/i })
    
    fireEvent.input(nameInput, { target: { value: 'John Doe' } })
    fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.input(phoneInput, { target: { value: 'invalid-phone' } })
    fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    
    const submitButtons = screen.getAllByRole('button', { name: 'Send Message' })
    const submitButton = submitButtons[0]
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid phone number/i)).toBeInTheDocument()
    })
  })

  it('validates message minimum length', async () => {
    const props = { ...defaultProps, isOpen: true }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const messageInput = screen.getByRole('textbox', { name: /Message/i })
    
    fireEvent.input(nameInput, { target: { value: 'John Doe' } })
    fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.input(messageInput, { target: { value: 'Short' } })
    
    const submitButtons = screen.getAllByRole('button', { name: 'Send Message' })
    const submitButton = submitButtons[0]
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Message must be at least 10 characters')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockOnSuccess = vi.fn()
    const props = { ...defaultProps, isOpen: true, onSuccess: mockOnSuccess }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const messageInput = screen.getByRole('textbox', { name: /Message/i })
    
    fireEvent.input(nameInput, { target: { value: 'John Doe' } })
    fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    
    const submitButtons = screen.getAllByRole('button', { name: 'Send Message' })
    const submitButton = submitButtons[0]
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Thank you! Your message has been sent successfully.')).toBeInTheDocument()
    })
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('handles submission error', async () => {
    const mockSendToWebhook = vi.fn().mockRejectedValue(new Error('Network error'))
    ;(N8nClient as any).mockImplementation(() => ({
      sendToWebhook: mockSendToWebhook
    }))
    
    const props = { ...defaultProps, isOpen: true }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const messageInput = screen.getByRole('textbox', { name: /Message/i })
    
    fireEvent.input(nameInput, { target: { value: 'John Doe' } })
    fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    
    const submitButtons = screen.getAllByRole('button', { name: 'Send Message' })
    const submitButton = submitButtons[0]
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument()
    })
  })

  it('calls onClose when cancel button is clicked', () => {
    const mockOnClose = vi.fn()
    const props = { ...defaultProps, isOpen: true, onClose: mockOnClose }
    render(<ContactModal {...props} />)
    
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when escape key is pressed', () => {
    const mockOnClose = vi.fn()
    const props = { ...defaultProps, isOpen: true, onClose: mockOnClose }
    render(<ContactModal {...props} />)
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('does not close on escape when submitting', () => {
    const mockOnClose = vi.fn()
    const props = { ...defaultProps, isOpen: true, onClose: mockOnClose }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const messageInput = screen.getByRole('textbox', { name: /Message/i })
    
    fireEvent.input(nameInput, { target: { value: 'John Doe' } })
    fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    
    const submitButtons = screen.getAllByRole('button', { name: 'Send Message' })
    const submitButton = submitButtons[0]
    fireEvent.click(submitButton)
    
    // Try to close with escape while submitting
    fireEvent.keyDown(document, { key: 'Escape' })
    
    // Should not close during submission
    expect(screen.getByText('Sending...')).toBeInTheDocument()
  })

  it('shows loading state during submission', async () => {
    const mockSendToWebhook = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    )
    ;(N8nClient as any).mockImplementation(() => ({
      sendToWebhook: mockSendToWebhook
    }))
    
    const props = { ...defaultProps, isOpen: true }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const messageInput = screen.getByRole('textbox', { name: /Message/i })
    
    fireEvent.input(nameInput, { target: { value: 'John Doe' } })
    fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    
    const submitButtons = screen.getAllByRole('button', { name: 'Send Message' })
    const submitButton = submitButtons[0]
    fireEvent.click(submitButton)
    
    expect(screen.getByText('Sending...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('clears field errors when user starts typing', async () => {
    const props = { ...defaultProps, isOpen: true }
    render(<ContactModal {...props} />)
    
    const submitButtons = screen.getAllByRole('button', { name: 'Send Message' })
    const submitButton = submitButtons[0]
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })
    
    const nameInput = screen.getByLabelText(/Full Name/i)
    fireEvent.input(nameInput, { target: { value: 'John' } })
    
    await waitFor(() => {
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
    })
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
    
    const nameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const messageInput = screen.getByRole('textbox', { name: /Message/i })
    
    fireEvent.input(nameInput, { target: { value: 'John Doe' } })
    fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    
    const submitButtons = screen.getAllByRole('button', { name: 'Send Message' })
    const submitButton = submitButtons[0]
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Thank you! Your message has been sent successfully.')).toBeInTheDocument()
    })
  })

  it('accepts valid phone number in E.164 format', async () => {
    const mockOnSuccess = vi.fn()
    const props = { ...defaultProps, isOpen: true, onSuccess: mockOnSuccess }
    render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const phoneInput = screen.getByLabelText(/Phone/i)
    const messageInput = screen.getByRole('textbox', { name: /Message/i })
    
    fireEvent.input(nameInput, { target: { value: 'John Doe' } })
    fireEvent.input(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.input(phoneInput, { target: { value: '+351912345678' } })
    fireEvent.input(messageInput, { target: { value: 'This is a test message with enough characters' } })
    
    const submitButtons = screen.getAllByRole('button', { name: 'Send Message' })
    const submitButton = submitButtons[0]
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Thank you! Your message has been sent successfully.')).toBeInTheDocument()
    })
  })

  it('resets form when modal closes', () => {
    const props = { ...defaultProps, isOpen: true }
    const { rerender } = render(<ContactModal {...props} />)
    
    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
    fireEvent.input(nameInput, { target: { value: 'John Doe' } })
    
    expect(nameInput.value).toBe('John Doe')
    
    // Close modal
    rerender(<ContactModal {...props} isOpen={false} />)
    
    // Reopen modal
    rerender(<ContactModal {...props} isOpen={true} />)
    
    const newNameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement
    expect(newNameInput.value).toBe('')
  })
})

