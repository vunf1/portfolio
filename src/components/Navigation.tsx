import { useEffect, useState } from 'preact/hooks'
import { useTranslation } from '../contexts/TranslationContext'
import { cn } from '../lib/utils'
import { scrollToPortfolioSection } from '../lib/scrollToPortfolioSection'
import type { NavigationProps } from '../types/components'
import { Button } from './ui/Button'
import { Icon } from './ui/Icon'
import { Separator } from './ui/Separator'
import { Sheet } from './ui/Sheet'

/** Keep in sync with `--navbar-height` in `src/css/variables.css` */
const NAV_HEIGHT = 80

/** Calm nav chrome: no Button scale nudge, short color-only transition */
const navControlMotion =
  'motion-safe:hover:scale-100 active:scale-100 transition-colors duration-150 ease-out'

/** Focus ring: neutral gray (avoid primary/blue outline on section buttons) */
const navFocusRing = 'focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400/45 focus-visible:ring-offset-0'

export function Navigation({
  items,
  activeId,
  onNavigate,
  className = '',
  id = 'portfolio-nav',
  showBackButton = false,
  onBackClick
}: NavigationProps) {
  const { t } = useTranslation()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const brandTargetId = items[0]?.id ?? 'experience'

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navigateTo = (sectionId: string) => {
    scrollToPortfolioSection(sectionId, { navHeight: NAV_HEIGHT, offset: 20 })
    onNavigate?.(sectionId)
    if (window.innerWidth < 1024) {
      setSheetOpen(false)
    }
  }

  const handleBack = () => {
    setSheetOpen(false)
    onBackClick?.()
  }

  return (
    <>
      <header
        id={id}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200/90 bg-white/90 backdrop-blur-md transition-shadow duration-150 ease-out',
          isScrolled && 'shadow-sm shadow-gray-900/5',
          className
        )}
      >
        <div className="mx-auto flex h-20 min-h-[var(--navbar-height)] max-w-[1200px] items-center gap-2 px-4 sm:gap-3 sm:px-6">
          {showBackButton ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn('hidden shrink-0 gap-2 border-0 shadow-none sm:inline-flex hover:bg-gray-100/90', navControlMotion)}
                onClick={handleBack}
              >
                <Icon name="arrow-left" size={16} aria-hidden />
                <span className="hidden md:inline">{t('navigation.backToHome')}</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="shrink-0 p-2 sm:hidden"
                onClick={handleBack}
                aria-label={t('navigation.backToLanding')}
              >
                <Icon name="arrow-left" size={18} aria-hidden />
              </Button>
              <Separator orientation="vertical" className="hidden h-6 sm:block" />
            </>
          ) : null}

          <a
            href={`#${brandTargetId}`}
            className={cn(
              'flex min-w-0 max-w-[min(100%,15.5rem)] items-center gap-2 rounded-lg p-1 -m-1 text-left transition-colors duration-150 ease-out hover:bg-gray-100/90 sm:max-w-xs sm:gap-2.5',
              navFocusRing
            )}
            onClick={(e) => {
              e.preventDefault()
              navigateTo(brandTargetId)
            }}
          >
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-transparent sm:h-12 sm:w-12">
              <img
                className="h-full w-full object-contain p-px sm:p-0.5"
                src="./img/logo.png"
                alt=""
                loading="lazy"
              />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-xs font-semibold tracking-tight text-gray-900 sm:text-sm">
                {t('navigation.brand')}
              </span>
              <span className="mt-0.5 block truncate text-[0.6875rem] text-gray-500 sm:text-xs">
                {t('hero.title')}
              </span>
            </span>
          </a>

          <nav
            className="hidden min-h-0 min-w-0 flex-1 justify-center lg:flex"
            aria-label={t('navigation.sectionsNav')}
          >
            <ul className="flex max-w-full flex-wrap items-center justify-center gap-0.5">
              {items.map((item) => (
                <li key={item.id} className="shrink-0">
                  <button
                    type="button"
                    className={cn(
                      'inline-flex max-w-[11rem] items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium transition-colors duration-150 ease-out',
                      navFocusRing,
                      activeId === item.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50/90 hover:text-gray-900'
                    )}
                    onClick={() => navigateTo(item.id)}
                  >
                    {item.icon ? <Icon name={item.icon} size={16} aria-hidden /> : null}
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto shrink-0 lg:hidden">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                'gap-2 border-0 shadow-none outline-none ring-offset-0 hover:bg-gray-100/90 focus-visible:ring-1 focus-visible:ring-gray-400/45 focus-visible:ring-offset-0',
                navControlMotion
              )}
              aria-expanded={sheetOpen}
              aria-haspopup="dialog"
              onClick={() => setSheetOpen(true)}
            >
              <Icon name="menu" size={18} aria-hidden />
              <span className="sr-only sm:not-sr-only">{t('navigation.menu')}</span>
            </Button>
          </div>
        </div>
      </header>

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={t('navigation.menu')}
        description={t('navigation.menuDescription')}
      >
        <nav className="flex flex-col gap-1" aria-label={t('navigation.sectionsNav')}>
          {showBackButton ? (
            <Button
              type="button"
              variant="ghost"
              className={cn(
                'mb-2 w-full justify-start gap-2 border-0 shadow-none hover:bg-gray-100 focus-visible:ring-1 focus-visible:ring-gray-400/45 focus-visible:ring-offset-0',
                navControlMotion
              )}
              onClick={handleBack}
            >
              <Icon name="arrow-left" size={18} aria-hidden />
              {t('navigation.backToHome')}
            </Button>
          ) : null}
          {items.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              className={cn(
                'h-auto w-full justify-start gap-3 py-3 text-left font-medium focus-visible:ring-1 focus-visible:ring-gray-400/45 focus-visible:ring-offset-0',
                navControlMotion,
                activeId === item.id && 'bg-gray-100 text-gray-900 hover:bg-gray-100'
              )}
              onClick={() => navigateTo(item.id)}
            >
              {item.icon ? <Icon name={item.icon} size={18} aria-hidden /> : null}
              <span className="truncate">{item.label}</span>
            </Button>
          ))}
        </nav>
      </Sheet>
    </>
  )
}
