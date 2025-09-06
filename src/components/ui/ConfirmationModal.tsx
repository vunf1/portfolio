import { useEffect, useRef } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import type { ConfirmationModalProps } from '../../types'

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'danger',
  icon
}: ConfirmationModalProps) {
  const { t } = useTranslation()
  const modalRef = useRef<HTMLDivElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Focus the confirm button when modal opens
      setTimeout(() => {
        confirmButtonRef.current?.focus()
      }, 100)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Handle click outside modal
  const handleOverlayClick = (event: MouseEvent) => {
    if (event.target === modalRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  const getVariantClasses = () => {
    switch (variant) {
      case 'danger':
        return {
          iconClass: 'text-danger',
          buttonClass: 'btn-danger',
          icon: icon || 'fa-solid fa-triangle-exclamation'
        }
      case 'warning':
        return {
          iconClass: 'text-warning',
          buttonClass: 'btn-warning',
          icon: icon || 'fa-solid fa-exclamation-triangle'
        }
      case 'info':
        return {
          iconClass: 'text-info',
          buttonClass: 'btn-info',
          icon: icon || 'fa-solid fa-info-circle'
        }
      default:
        return {
          iconClass: 'text-primary',
          buttonClass: 'btn-primary',
          icon: icon || 'fa-solid fa-question-circle'
        }
    }
  }

  const variantClasses = getVariantClasses()

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      ref={modalRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content premium-modal">
          <div className="modal-header border-0 pb-0">
            <div className="d-flex align-items-center w-100">
              <div className={`confirmation-icon ${variantClasses.iconClass} me-3`}>
                <i className={variantClasses.icon}></i>
              </div>
              <h5 className="modal-title" id="confirmation-modal-title">
                {title || t('confirmation.title', 'Confirm Action')}
              </h5>
            </div>
          </div>
          
          <div className="modal-body pt-3">
            <p className="confirmation-message mb-0">
              {message || t('confirmation.message', 'Are you sure you want to proceed?')}
            </p>
          </div>
          
          <div className="modal-footer border-0 pt-3">
            <div className="d-flex gap-2 w-100">
              <button
                type="button"
                className="btn btn-outline-secondary flex-fill"
                onClick={onClose}
                aria-label={cancelText || t('confirmation.cancel', 'Cancel')}
              >
                <i className="fa-solid fa-times me-2"></i>
                {cancelText || t('confirmation.cancel', 'Cancel')}
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                className={`btn ${variantClasses.buttonClass} flex-fill`}
                onClick={onConfirm}
                aria-label={confirmText || t('confirmation.confirm', 'Confirm')}
              >
                <i className="fa-solid fa-check me-2"></i>
                {confirmText || t('confirmation.confirm', 'Confirm')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
