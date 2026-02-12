import { useState, useEffect } from 'preact/hooks'
import { useTranslation } from '../contexts/TranslationContext'
import { useDarkReader } from '../hooks/useDarkReader'
import { Icon } from './ui/Icon'

interface FloatingActionButtonProps {
  className?: string
  onContactClick?: () => void
  /** Hide contact button (e.g. on error pages) */
  hideContact?: boolean
}

interface FABItem {
  id: string
  icon: string
  onClick: () => void
  ariaLabel: string
  visible?: boolean
}

const SCROLL_THRESHOLD = 300

export function FloatingActionButton({ className = '', onContactClick, hideContact = false }: FloatingActionButtonProps) {
  const { currentLanguage, changeLanguage, t } = useTranslation()
  const { isDark, toggleDarkMode } = useDarkReader()
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > SCROLL_THRESHOLD)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const languageFlag = currentLanguage === 'pt-PT' ? '🇵🇹' : '🇬🇧'

  const fabItems: FABItem[] = [
    ...(!hideContact
      ? [
          {
            id: 'contact',
            icon: 'message-circle',
            onClick: () => onContactClick?.(),
            ariaLabel: t('contact.title', 'Contact Me')
          }
        ]
      : []),
    {
      id: 'language',
      icon: 'globe',
      onClick: () => changeLanguage(currentLanguage === 'en' ? 'pt-PT' : 'en'),
      ariaLabel: t('common.language')
    },
    {
      id: 'darkmode',
      icon: isDark ? 'sun' : 'moon',
      onClick: toggleDarkMode,
      ariaLabel: t(isDark ? 'fab.switchToLight' : 'fab.switchToDark')
    },
    {
      id: 'scrolltop',
      icon: 'chevron-up',
      onClick: scrollToTop,
      ariaLabel: t('fab.scrollToTop'),
      visible: showScrollTop
    }
  ]

  return (
    <div className={`fab-items-static ${className}`}>
      {fabItems
        .filter((item) => item.visible !== false)
        .map((item) => (
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
            {item.id === 'language' ? (
              <span className="fab-flag-icon" aria-hidden="true" role="img">{languageFlag}</span>
            ) : (
              <Icon name={item.icon} size={22} />
            )}
          </button>
        </div>
      ))}

    </div>
  )
}