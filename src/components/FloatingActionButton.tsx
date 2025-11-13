import { useTranslation } from '../contexts/TranslationContext'

interface FloatingActionButtonProps {
  className?: string
}

interface FABItem {
  id: string
  icon: string
  label: string
  onClick: () => void
  ariaLabel: string
}

export function FloatingActionButton({ className = '' }: FloatingActionButtonProps) {
  const { currentLanguage, changeLanguage, t } = useTranslation()

  const fabItems: FABItem[] = [
    {
      id: 'language',
      icon: 'flag-emoji',
      label: t(currentLanguage === 'en' ? 'fab.switchToPortuguese' : 'fab.switchToEnglish'),
      onClick: () => changeLanguage(currentLanguage === 'en' ? 'pt-PT' : 'en'),
      ariaLabel: t('common.language')
    }
  ]

  return (
    <div className={`fab-items-static ${className}`}>
      {fabItems.map((item) => (
        <div key={item.id} className="fab-item-wrapper">
          <button
            className={`fab-item-static fab-item-${item.id}`}
            onClick={item.onClick}
            aria-label={item.ariaLabel}
          >
            {item.icon === 'flag-emoji' ? (
              <span className="flag-emoji" aria-hidden="true">
                {currentLanguage === 'en' ? '🇵🇹' : '🇬🇧'}
              </span>
            ) : (
              <i className={item.icon} aria-hidden="true"></i>
            )}
          </button>
          <span className="fab-item-label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}