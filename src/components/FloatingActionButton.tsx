import { useState } from 'preact/hooks'
import { useTranslation } from '../contexts/TranslationContext'
import { ContactModal } from './ui/ContactModal'

interface FloatingActionButtonProps {
  className?: string
}

interface FABItem {
  id: string
  icon: string
  onClick: () => void
  ariaLabel: string
}

export function FloatingActionButton({ className = '' }: FloatingActionButtonProps) {
  const { currentLanguage, changeLanguage, t } = useTranslation()
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  // Get the flag class for the language that will be switched TO
  const targetLanguage = currentLanguage === 'en' ? 'pt-PT' : 'en'
  const flagClass = targetLanguage === 'pt-PT' ? 'fi fi-pt' : 'fi fi-gb'

  const fabItems: FABItem[] = [
    {
      id: 'contact',
      icon: 'fa-solid fa-comment-dots',
      onClick: () => setIsContactModalOpen(true),
      ariaLabel: t('contact.title', 'Contact Me')
    },
    {
      id: 'language',
      icon: 'flag-icon',
      onClick: () => changeLanguage(currentLanguage === 'en' ? 'pt-PT' : 'en'),
      ariaLabel: t('common.language')
    }
  ]

  return (
    <>
      <div className={`fab-items-static ${className}`}>
        {fabItems.map((item) => (
          <div key={item.id} className="fab-item-wrapper">
            <button
              className={`fab-item-static fab-item-${item.id}`}
              onClick={item.onClick}
              aria-label={item.ariaLabel}
            >
              {item.icon === 'flag-icon' ? (
                <span className={`${flagClass} fab-flag-icon`} aria-hidden="true"></span>
              ) : (
                <i className={item.icon} aria-hidden="true"></i>
              )}
            </button>
          </div>
        ))}
      </div>
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  )
}