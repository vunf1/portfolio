import { useEffect, useState } from 'preact/hooks'
import { useTranslation } from '../contexts/TranslationContext'
import { cn } from '../lib/utils'
import { BRAND_LOGO_SRC } from '../config/brand'
import { scrollToPortfolioSection } from '../lib/scrollToPortfolioSection'
import type { PortfolioHeaderItem, PortfolioHeaderProps } from '../types/components'
import { Button } from './ui/Button'
import { Icon } from './ui/Icon'
import { Separator } from './ui/Separator'
import { Sheet } from './ui/Sheet'

/** Keep in sync with `--navbar-height` in `src/css/variables.css` */
const HEADER_HEIGHT = 80

/** Calm header chrome: no Button scale nudge, short color-only transition */
const headerControlMotion =
  'motion-safe:hover:scale-100 active:scale-100 transition-colors duration-150 ease-out'

/** Focus ring: neutral gray (avoid primary/blue outline on section buttons) */
const headerFocusRing = 'focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400/45 focus-visible:ring-offset-0'

function HeaderBackButton({
  compact,
  label,
  onClick
}: {
  compact: boolean
  label: string
  onClick: () => void
}) {
  if (compact) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="shrink-0 p-2 sm:hidden"
        onClick={onClick}
        aria-label={label}
      >
        <Icon name="arrow-left" size={18} aria-hidden />
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn('hidden shrink-0 gap-2 border-0 shadow-none sm:inline-flex hover:bg-gray-100/90', headerControlMotion)}
      onClick={onClick}
    >
      <Icon name="arrow-left" size={16} aria-hidden />
      <span className="hidden md:inline">{label}</span>
    </Button>
  )
}

function HeaderIdentity({
  name,
  role,
  href,
  onActivate
}: {
  name: string
  role: string
  href: string
  onActivate: () => void
}) {
  return (
    <a
      href={href}
      className={cn(
        'flex min-w-0 max-w-[min(100%,15.5rem)] items-center gap-2 rounded-lg p-1 -m-1 text-left transition-colors duration-150 ease-out hover:bg-gray-100/90 sm:max-w-xs sm:gap-2.5',
        headerFocusRing
      )}
      aria-label={`${name}: ${role}`}
      onClick={(e) => {
        e.preventDefault()
        onActivate()
      }}
    >
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-transparent sm:h-12 sm:w-12">
        <img
          className="h-full w-full object-contain p-px sm:p-0.5"
          src={BRAND_LOGO_SRC}
          alt=""
          loading="lazy"
        />
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-xs font-semibold tracking-tight text-gray-900 sm:text-sm" title={name}>
          {name}
        </span>
        <span className="mt-0.5 block truncate text-[0.6875rem] text-gray-500 sm:text-xs" title={role}>
          {role}
        </span>
      </span>
    </a>
  )
}

function HeaderSectionLink({
  item,
  active,
  onSelect
}: {
  item: PortfolioHeaderItem
  active: boolean
  onSelect: (id: string) => void
}) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex max-w-[11rem] items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium transition-colors duration-150 ease-out',
        headerFocusRing,
        active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50/90 hover:text-gray-900'
      )}
      onClick={() => onSelect(item.id)}
    >
      {item.icon ? <Icon name={item.icon} size={16} aria-hidden /> : null}
      <span className="truncate">{item.label}</span>
    </button>
  )
}

function HeaderSectionNav({
  items,
  activeId,
  label,
  onSelect
}: {
  items: PortfolioHeaderItem[]
  activeId?: string
  label: string
  onSelect: (id: string) => void
}) {
  return (
    <nav className="hidden min-h-0 min-w-0 flex-1 justify-center lg:flex" aria-label={label}>
      <ul className="flex max-w-full flex-wrap items-center justify-center gap-0.5">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <HeaderSectionLink item={item} active={activeId === item.id} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

function HeaderMenuTrigger({
  expanded,
  label,
  onOpen
}: {
  expanded: boolean
  label: string
  onOpen: () => void
}) {
  return (
    <div className="ml-auto shrink-0 lg:hidden">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          'gap-2 border-0 shadow-none outline-none ring-offset-0 hover:bg-gray-100/90 focus-visible:ring-1 focus-visible:ring-gray-400/45 focus-visible:ring-offset-0',
          headerControlMotion
        )}
        aria-expanded={expanded}
        aria-haspopup="dialog"
        onClick={onOpen}
      >
        <Icon name="menu" size={18} aria-hidden />
        <span className="sr-only sm:not-sr-only">{label}</span>
      </Button>
    </div>
  )
}

function HeaderSectionMenu({
  open,
  items,
  activeId,
  title,
  description,
  sectionsLabel,
  backLabel,
  showBack,
  onOpenChange,
  onBack,
  onSelect
}: {
  open: boolean
  items: PortfolioHeaderItem[]
  activeId?: string
  title: string
  description: string
  sectionsLabel: string
  backLabel: string
  showBack: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onSelect: (id: string) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <nav className="flex flex-col gap-1" aria-label={sectionsLabel}>
        {showBack ? (
          <Button
            type="button"
            variant="ghost"
            className={cn(
              'mb-2 w-full justify-start gap-2 border-0 shadow-none hover:bg-gray-100 focus-visible:ring-1 focus-visible:ring-gray-400/45 focus-visible:ring-offset-0',
              headerControlMotion
            )}
            onClick={onBack}
          >
            <Icon name="arrow-left" size={18} aria-hidden />
            {backLabel}
          </Button>
        ) : null}
        {items.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant="ghost"
            className={cn(
              'h-auto w-full justify-start gap-3 py-3 text-left font-medium focus-visible:ring-1 focus-visible:ring-gray-400/45 focus-visible:ring-offset-0',
              headerControlMotion,
              activeId === item.id && 'bg-gray-100 text-gray-900 hover:bg-gray-100'
            )}
            onClick={() => onSelect(item.id)}
          >
            {item.icon ? <Icon name={item.icon} size={18} aria-hidden /> : null}
            <span className="truncate">{item.label}</span>
          </Button>
        ))}
      </nav>
    </Sheet>
  )
}

export function PortfolioHeader({
  items,
  activeId,
  onNavigate,
  className = '',
  id = 'portfolio-nav',
  showBackButton = false,
  onBackClick,
  brandName,
  brandRole
}: PortfolioHeaderProps) {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const identityName = brandName?.trim() || String(t('navigation.brand'))
  const identityRole = brandRole?.trim() || String(t('hero.title'))
  const backLabel = String(t('navigation.backToHome'))
  const identityTargetId = items[0]?.id ?? 'experience'

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goToSection = (sectionId: string) => {
    onNavigate?.(sectionId)
    const isNarrowViewport = window.innerWidth < 1024
    if (isNarrowViewport) {
      setMenuOpen(false)
    }
    const runScroll = () =>
      scrollToPortfolioSection(sectionId, { navHeight: HEADER_HEIGHT, offset: 20 })
    /*
     * Narrow menu: unlock runs in Sheet useLayoutEffect cleanup (same commit as close).
     * Double rAF waits until layout + scroll restoration are settled before scrolling (avoids wrong Y).
     */
    if (isNarrowViewport) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(runScroll)
      })
    } else {
      runScroll()
    }
  }

  const goToLanding = () => {
    setMenuOpen(false)
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
              <HeaderBackButton compact={false} label={backLabel} onClick={goToLanding} />
              <HeaderBackButton compact label={backLabel} onClick={goToLanding} />
              <Separator orientation="vertical" className="hidden h-6 sm:block" />
            </>
          ) : null}

          <HeaderIdentity
            name={identityName}
            role={identityRole}
            href={`#${identityTargetId}`}
            onActivate={() => goToSection(identityTargetId)}
          />

          <HeaderSectionNav
            items={items}
            activeId={activeId}
            label={String(t('navigation.sectionsNav'))}
            onSelect={goToSection}
          />

          <HeaderMenuTrigger
            expanded={menuOpen}
            label={String(t('navigation.menu'))}
            onOpen={() => setMenuOpen(true)}
          />
        </div>
      </header>

      <HeaderSectionMenu
        open={menuOpen}
        items={items}
        activeId={activeId}
        title={String(t('navigation.menu'))}
        description={String(t('navigation.menuDescription'))}
        sectionsLabel={String(t('navigation.sectionsNav'))}
        backLabel={backLabel}
        showBack={showBackButton}
        onOpenChange={setMenuOpen}
        onBack={goToLanding}
        onSelect={goToSection}
      />
    </>
  )
}

/** @deprecated Use `PortfolioHeader`. Same component; kept for existing imports. */
export const Navigation = PortfolioHeader
