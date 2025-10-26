import { useTranslation } from '../contexts/TranslationContext'
import { useTheme } from '../hooks/useTheme'

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
  const { isDarkMode, toggleTheme } = useTheme()
  const { currentLanguage, changeLanguage, t } = useTranslation()

  const fabItems: FABItem[] = [
    {
      id: 'theme',
      icon: 'fas fa-moon',
      label: t(isDarkMode ? 'fab.themeLight' : 'fab.themeDark'),
      onClick: toggleTheme,
      ariaLabel: t('fab.themeAria')
    },
    {
      id: 'language',
      icon: 'flag-emoji',
      label: t('fab.language'),
      onClick: () => changeLanguage(currentLanguage === 'en' ? 'pt-PT' : 'en'),
      ariaLabel: t('fab.languageAria')
    }
  ]

  return (
    <div className={`fab-items-static ${className}`}>
      {fabItems.map((item) => (
        <button
          key={item.id}
          className={`fab-item-static fab-item-${item.id}`}
          onClick={item.onClick}
          aria-label={item.ariaLabel}
        >
          {item.icon === 'flag-emoji' ? (
            <span className="flag-emoji" aria-hidden="true">
              {currentLanguage === 'en' ? '🇵🇹' : '🇬🇧'}
            </span>
          ) : (
            <i className={isDarkMode ? 'fas fa-sun' : item.icon} aria-hidden="true"></i>
          )}
          <span className="fab-item-label">{item.label}</span>
        </button>
      ))}
    </div>
  )
}