import { useEffect, useRef } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import { Button } from './Button'
import { Icon } from './Icon'
import { cn } from '../../lib/utils'
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
  icon: iconClass
}: ConfirmationModalProps) {
  const { t } = useTranslation()
  const modalRef = useRef<HTMLDivElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      setTimeout(() => {
        const el = confirmButtonRef.current
        if (el && typeof (el as HTMLButtonElement).focus === 'function') {
          (el as HTMLButtonElement).focus()
        }
      }, 100)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleOverlayClick = (event: MouseEvent) => {
    if (event.target === modalRef.current) {
      onClose()
    }
  }

  if (!isOpen) {
    return null
  }

  const variantConfig = {
    danger: { iconClass: 'text-danger', buttonVariant: 'destructive' as const, icon: iconClass || 'fa-solid fa-triangle-exclamation' },
    warning: { iconClass: 'text-warning', buttonVariant: 'primary' as const, icon: iconClass || 'fa-solid fa-exclamation-triangle' },
    info: { iconClass: 'text-info', buttonVariant: 'primary' as const, icon: iconClass || 'fa-solid fa-info-circle' },
    primary: { iconClass: 'text-primary', buttonVariant: 'primary' as const, icon: iconClass || 'fa-solid fa-question-circle' }
  }
  const config = variantConfig[variant] ?? variantConfig.primary

  return (
    <div
      className="fixed inset-0 z-[1050] flex items-center justify-center bg-black/50"
      ref={modalRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div className="mx-4 w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 pb-3">
          <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', config.iconClass)}>
            <Icon name={config.icon} size={20} />
          </div>
          <h5 className="text-lg font-semibold" id="confirmation-modal-title">
            {title || t('confirmation.title', 'Confirm Action')}
          </h5>
        </div>
        <p className="pb-4 text-gray-600">
          {message || t('confirmation.message', 'Are you sure you want to proceed?')}
        </p>
        <div className="modal-footer flex flex-1 flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <Button
            type="button"
            variant="outlineElevated"
            size="md"
            className="min-w-[100px] rounded-lg"
            onClick={onClose}
            aria-label={cancelText || t('confirmation.cancel', 'Cancel')}
          >
            {cancelText || t('confirmation.cancel', 'Cancel')}
          </Button>
          <Button
            ref={confirmButtonRef}
            type="button"
            variant={config.buttonVariant}
            size="md"
            className="min-w-[100px] rounded-lg shadow-md hover:shadow-lg"
            onClick={onConfirm}
            aria-label={confirmText || t('confirmation.confirm', 'Confirm')}
          >
            {confirmText || t('confirmation.confirm', 'Confirm')}
          </Button>
        </div>
      </div>
    </div>
  )
}
