import { useTranslation } from '../contexts/TranslationContext'

interface FloatingActionButtonProps {
  className?: string
  onContactClick?: () => void
}

interface FABItem {
  id: string
  icon: string
  onClick: () => void
  ariaLabel: string
}

export function FloatingActionButton({ className = '', onContactClick }: FloatingActionButtonProps) {
  const { currentLanguage, changeLanguage, t } = useTranslation()

  // Get the flag class for the language that will be switched TO
  const targetLanguage = currentLanguage === 'en' ? 'pt-PT' : 'en'
  const flagClass = targetLanguage === 'pt-PT' ? 'fi fi-pt' : 'fi fi-gb'

  const fabItems: FABItem[] = [
    {
      id: 'contact',
      icon: 'fa-solid fa-comment-dots',
      onClick: () => onContactClick?.(),
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
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              item.onClick()
            }}
            aria-label={item.ariaLabel}
            type="button"
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
    </>
  )
}