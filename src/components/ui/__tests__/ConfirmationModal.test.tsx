import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/preact'
import { ConfirmationModal } from '../ConfirmationModal'
import type { ConfirmationModalProps } from '../../../types'

// Mock the TranslationContext
vi.mock('../../../contexts/TranslationContext', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'confirmation.title': 'Confirm Action',
        'confirmation.message': 'Are you sure you want to proceed?',
        'confirmation.confirm': 'Confirm',
        'confirmation.cancel': 'Cancel'
      }
      return translations[key] || key
    },
    currentLanguage: 'en',
    changeLanguage: vi.fn(),
    isEnglish: true,
    isPortuguese: false,
    supportedLanguages: ['en', 'pt-PT']
  }),
  preloadTranslations: vi.fn().mockResolvedValue(undefined)
}))

const defaultProps: ConfirmationModalProps = {
  isOpen: false,
  onClose: vi.fn(),
  onConfirm: vi.fn()
}

describe('ConfirmationModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render when isOpen is false', () => {
    render(<ConfirmationModal {...defaultProps} />)
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true', () => {
    const props = { ...defaultProps, isOpen: true }
    render(<ConfirmationModal {...props} />)
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Confirm Action')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument()
  })

  it('renders with custom title and message', () => {
    const props = {
      ...defaultProps,
      isOpen: true,
      title: 'Custom Title',
      message: 'Custom message content'
    }
    render(<ConfirmationModal {...props} />)
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom message content')).toBeInTheDocument()
  })

  it('renders with custom button text', () => {
    const props = {
      ...defaultProps,
      isOpen: true,
      confirmText: 'Yes, Delete',
      cancelText: 'No, Keep'
    }
    render(<ConfirmationModal {...props} />)
    
    expect(screen.getByText('Yes, Delete')).toBeInTheDocument()
    expect(screen.getByText('No, Keep')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    const mockOnConfirm = vi.fn()
    const props = { ...defaultProps, isOpen: true, onConfirm: mockOnConfirm }
    render(<ConfirmationModal {...props} />)
    
    const confirmButton = screen.getByText('Confirm')
    fireEvent.click(confirmButton)
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when cancel button is clicked', () => {
    const mockOnClose = vi.fn()
    const props = { ...defaultProps, isOpen: true, onClose: mockOnClose }
    render(<ConfirmationModal {...props} />)
    
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when escape key is pressed', () => {
    const mockOnClose = vi.fn()
    const props = { ...defaultProps, isOpen: true, onClose: mockOnClose }
    render(<ConfirmationModal {...props} />)
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('renders with danger variant', () => {
    const props = { ...defaultProps, isOpen: true, variant: 'danger' as const }
    render(<ConfirmationModal {...props} />)
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    expect(confirmButton).toBeInTheDocument()
    expect(confirmButton).toHaveClass('from-danger')
  })

  it('renders with warning variant', () => {
    const props = { ...defaultProps, isOpen: true, variant: 'warning' as const }
    render(<ConfirmationModal {...props} />)
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    expect(confirmButton).toBeInTheDocument()
    expect(confirmButton).toHaveClass('from-primary')
  })

  it('renders with info variant', () => {
    const props = { ...defaultProps, isOpen: true, variant: 'info' as const }
    render(<ConfirmationModal {...props} />)
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    expect(confirmButton).toBeInTheDocument()
    expect(confirmButton).toHaveClass('from-primary')
  })

  it('renders with custom icon', () => {
    const props = {
      ...defaultProps,
      isOpen: true,
      icon: 'fa-solid fa-custom-icon'
    }
    render(<ConfirmationModal {...props} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.querySelector('svg')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    const props = { ...defaultProps, isOpen: true }
    render(<ConfirmationModal {...props} />)
    
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('aria-modal', 'true')
    expect(modal).toHaveAttribute('aria-labelledby', 'confirmation-modal-title')
    
    const title = screen.getByText('Confirm Action')
    expect(title).toHaveAttribute('id', 'confirmation-modal-title')
  })
})
