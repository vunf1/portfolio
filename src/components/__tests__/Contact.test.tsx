import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/preact'
import { Contact } from '../Contact'
import type { ContactProps } from '../../types'

// Mock the TranslationContext
vi.mock('../../contexts/TranslationContext', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'contact.title': 'Contact',
        'contact.subtitle': 'Get in touch',
        'contact.unlocked': 'Contact Unlocked',
        'contact.deleteUnlock': 'Delete unlock data',
        'contact.labels.email': 'Email',
        'contact.labels.phone': 'Phone',
        'contact.labels.location': 'Location',
        'contact.labels.website': 'Website',
        'contact.labels.connect': 'Connect',
        'contact.responseTime': 'Response Time',
        'contact.badges.remoteAvailable': 'Remote Available',
        'contact.badges.openToRelocation': 'Open to Relocation',
        'contact.preferredContact': 'Preferred Contact',
        'contact.ctaText': 'Ready to work together?',
        'contact.sendMessage': 'Send Message',
        'contact.placeholderText': 'Contact information will be displayed here after unlocking.',
        'contact.unlockTitle': 'Click to unlock access to my information',
        'contact.unlockSubtitle': 'Get in touch with me',
        'contact.unlockButton': 'Unlock Contact Info',
        'contact.deleteConfirmation.title': 'Delete Unlock Data',
        'contact.deleteConfirmation.message': 'Are you sure you want to delete your unlock data? This will lock the contact information and you will need to unlock it again to view the details.',
        'contact.deleteConfirmation.confirm': 'Delete',
        'contact.deleteConfirmation.cancel': 'Cancel'
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

const mockPersonal = {
  name: 'João Maia',
  title: 'Full-Stack Developer',
  email: 'joao@example.com',
  phone: '+351 934 330 807',
  phoneSecondary: '+44 7393 557259',
  location: 'Porto, Portugal',
  website: 'https://example.com',
  profileImage: '/img/profile.jpg',
  availability: 'Open to new opportunities',
  remote: 'Open to remote work',
  relocation: 'Willing to relocate'
}

const mockContact = {
  availability: 'Open to new opportunities',
  responseTime: 'Within 24 hours',
  preferredContact: 'Email or LinkedIn',
  linkedin: 'https://linkedin.com/in/joaomaia',
  github: 'https://github.com/joaomaia'
}

const defaultProps: ContactProps = {
  personal: mockPersonal,
  contact: mockContact,
  isUnlocked: false,
  onUnlock: vi.fn()
}

describe('Contact Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders contact section with title and subtitle', () => {
    render(<Contact {...defaultProps} />)
    
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByText('Get in touch')).toBeInTheDocument()
  })

  it('shows unlock button when contact is locked', () => {
    render(<Contact {...defaultProps} />)
    
    expect(screen.getByText('Unlock Contact Info')).toBeInTheDocument()
    expect(screen.getByText('Click to unlock access to my information')).toBeInTheDocument()
  })

  it('shows contact information when unlocked', () => {
    const props = { ...defaultProps, isUnlocked: true }
    render(<Contact {...props} />)
    
    expect(screen.getByText('João Maia')).toBeInTheDocument()
    expect(screen.getByText('Full-Stack Developer')).toBeInTheDocument()
    expect(screen.getByText('Contact Unlocked')).toBeInTheDocument()
  })

  it('shows delete button when unlocked and onLock is provided', () => {
    const mockOnLock = vi.fn()
    const props = { ...defaultProps, isUnlocked: true, onLock: mockOnLock }
    render(<Contact {...props} />)
    
    const deleteButton = screen.getByTitle('Delete unlock data')
    expect(deleteButton).toBeInTheDocument()
    expect(deleteButton).toHaveClass('btn', 'btn-outline-danger', 'btn-sm')
  })

  it('shows confirmation modal when delete button is clicked', () => {
    const mockOnLock = vi.fn()
    const props = { ...defaultProps, isUnlocked: true, onLock: mockOnLock }
    render(<Contact {...props} />)
    
    const deleteButton = screen.getByTitle('Delete unlock data')
    fireEvent.click(deleteButton)
    
    // Should show confirmation modal, not call onLock directly
    expect(screen.getByText('Delete Unlock Data')).toBeInTheDocument()
    expect(mockOnLock).not.toHaveBeenCalled()
  })

  it('does not show delete button when onLock is not provided', () => {
    const props = { ...defaultProps, isUnlocked: true }
    render(<Contact {...props} />)
    
    expect(screen.queryByTitle('Delete unlock data')).not.toBeInTheDocument()
  })

  it('calls onUnlock when unlock button is clicked', () => {
    const mockOnUnlock = vi.fn()
    const props = { ...defaultProps, onUnlock: mockOnUnlock }
    render(<Contact {...props} />)
    
    const unlockButton = screen.getByText('Unlock Contact Info')
    fireEvent.click(unlockButton)
    
    expect(mockOnUnlock).toHaveBeenCalledTimes(1)
  })


  it('calls onLock when confirmation is confirmed', () => {
    const mockOnLock = vi.fn()
    const props = { ...defaultProps, isUnlocked: true, onLock: mockOnLock }
    render(<Contact {...props} />)
    
    // Click delete button to show confirmation modal
    const deleteButton = screen.getByTitle('Delete unlock data')
    fireEvent.click(deleteButton)
    
    // Click confirm button in modal
    const confirmButton = screen.getByText('Delete')
    fireEvent.click(confirmButton)
    
    expect(mockOnLock).toHaveBeenCalledTimes(1)
  })

  it('does not call onLock when confirmation is cancelled', () => {
    const mockOnLock = vi.fn()
    const props = { ...defaultProps, isUnlocked: true, onLock: mockOnLock }
    render(<Contact {...props} />)
    
    // Click delete button to show confirmation modal
    const deleteButton = screen.getByTitle('Delete unlock data')
    fireEvent.click(deleteButton)
    
    // Click cancel button in modal
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    expect(mockOnLock).not.toHaveBeenCalled()
  })

  it('closes confirmation modal when cancel is clicked', () => {
    const mockOnLock = vi.fn()
    const props = { ...defaultProps, isUnlocked: true, onLock: mockOnLock }
    render(<Contact {...props} />)
    
    // Click delete button to show confirmation modal
    const deleteButton = screen.getByTitle('Delete unlock data')
    fireEvent.click(deleteButton)
    
    // Verify modal is shown
    expect(screen.getByText('Delete Unlock Data')).toBeInTheDocument()
    
    // Click cancel button
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    // Verify modal is closed
    expect(screen.queryByText('Delete Unlock Data')).not.toBeInTheDocument()
  })
})
