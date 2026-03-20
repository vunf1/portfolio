import { useEffect, useState } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../ui/Card'
import { Icon } from '../ui/Icon'
import { Separator } from '../ui/Separator'
import type { Personal } from '../../types/portfolio'
import { cn } from '../../lib/utils'
import logoUrl from '@/img/logo.png'

interface LandingHeroProps {
  personal: Personal
  className?: string
  onContactClick?: () => void
}

export function LandingHero({ personal, className = '', onContactClick }: LandingHeroProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const showMeta = Boolean(personal?.location || personal?.availability)

  return (
    <section
      id="landing-hero"
      className={cn('landing-hero landing-section', className)}
      aria-labelledby="landing-hero-heading"
    >
      <div
        id="landing-hero-grid"
        className={cn(
          'hero-content relative z-[2] mx-auto box-border grid w-full max-w-[1280px] items-center gap-8 px-4 sm:px-6',
          'grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]',
          'lg:gap-x-[clamp(2rem,6vw,4rem)] lg:gap-y-0'
        )}
      >
        <div
          id="landing-hero-copy"
          className={cn(
            'landing-hero__copy order-2 flex min-w-0 flex-col lg:order-1',
            'motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.4,0,0.2,1)]',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          )}
        >
          <Card
            id="landing-hero-card-main"
            flush
            hover={false}
            variant="elevated"
            className={cn(
              'flex flex-col items-center',
              'border-0 bg-transparent shadow-none ring-0'
            )}
          >
            <CardHeader className="flex w-full items-center justify-center gap-4 text-center">
              <div className="flex w-full items-center justify-center">
                <Badge
                  id="landing-hero-badge"
                  variant="outline"
                  size="sm"
                  className="text-center font-semibold uppercase tracking-[0.12em]"
                >
                  {t('landing.hero.badge')}
                </Badge>
              </div>
              <div className="flex w-full min-w-0 flex-col items-center justify-center space-y-2 text-center">
                <CardTitle
                  as="h1"
                  id="landing-hero-heading"
                  className="w-full text-balance text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-[2.65rem] xl:text-[2.75rem] lg:leading-[1.08]"
                >
                  {personal?.name || 'Portfolio'}
                </CardTitle>
                {personal?.title ? (
                  <CardDescription
                    id="landing-hero-role"
                    as="p"
                    className="w-full text-center text-base font-medium text-primary sm:text-lg"
                  >
                    {personal.title}
                  </CardDescription>
                ) : null}
                {personal?.tagline ? (
                  <p
                    id="landing-hero-tagline"
                    className="hero-tagline w-full text-center text-lg font-medium leading-snug text-gray-700"
                  >
                    {personal.tagline}
                  </p>
                ) : null}
              </div>
            </CardHeader>

            <div className="w-full px-6">
              <Separator id="landing-hero-sep-after-header" className="bg-primary/15" />
            </div>

            <CardContent
              id="landing-hero-card-body"
              className="flex w-full flex-col gap-4 pt-4"
            >
              <p
                id="landing-hero-summary"
                className="hero-summary text-pretty text-base leading-relaxed text-gray-800 sm:text-justify"
              >
                {t('landing.hero.summary')}
              </p>
            </CardContent>

            {showMeta ? (
              <CardContent id="landing-hero-card-meta" className="w-full pt-4">
                <div
                  id="landing-hero-meta"
                  className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-medium text-gray-600"
                >
                  {personal?.location ? (
                    <span id="landing-hero-meta-location" className="inline-flex items-center gap-2">
                      <Icon
                        id="landing-hero-icon-location"
                        name="location-dot"
                        size={18}
                        className="shrink-0 text-primary"
                      />
                      {personal.location}
                    </span>
                  ) : null}
                  {personal?.location && personal?.availability ? (
                    <Separator
                      id="landing-hero-sep-meta-inline"
                      orientation="vertical"
                      className="hidden h-5 bg-gray-200 sm:block"
                    />
                  ) : null}
                  {personal?.availability ? (
                    <span id="landing-hero-meta-availability" className="inline-flex items-center gap-2">
                      <Icon
                        id="landing-hero-icon-availability"
                        name="user-tie"
                        size={18}
                        className="shrink-0 text-primary"
                      />
                      {personal.availability}
                    </span>
                  ) : null}
                </div>
              </CardContent>
            ) : null}

            <CardFooter
              id="landing-hero-card-footer"
              className="hero-actions w-full flex-col items-stretch gap-2.5 pt-4 pb-1 sm:flex-row sm:flex-wrap sm:gap-3 overflow-visible"
            >
              <div
                id="landing-hero-cta-group"
                className="flex w-full max-w-xl flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-3 overflow-visible min-h-0"
                role="group"
                aria-label={t('landing.hero.ctaGroupLabel')}
              >
                <Button
                  id="landing-hero-cta-contact"
                  variant="primaryElevated"
                  size="lg"
                  className="hero-cta-contact w-full min-h-12 min-w-0 rounded-full px-7 sm:w-auto sm:min-w-[10.5rem]"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onContactClick?.()
                  }}
                >
                  {t('landing.hero.ctaContact')}
                </Button>
                <Button
                  id="landing-hero-cta-services"
                  variant="outlineElevated"
                  size="lg"
                  className="hero-cta-services hero-cta-secondary w-full min-h-12 min-w-0 rounded-full px-7 sm:flex-1 sm:min-w-[9rem]"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('landing.hero.ctaServices')}
                </Button>
                <Button
                  id="landing-hero-cta-about"
                  variant="outlineElevated"
                  size="lg"
                  className="hero-cta-about hero-cta-secondary w-full min-h-12 min-w-0 rounded-full px-7 sm:flex-1 sm:min-w-[9rem]"
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('landing.hero.ctaAbout')}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div
          id="landing-hero-visual"
          className={cn(
            'hero-visual order-1 w-full min-w-0 max-w-full lg:order-2',
            isVisible && 'hero-visual-visible'
          )}
        >
          <Card
            id="landing-hero-card-visual"
            flush
            hover={false}
            variant="default"
            className={cn(
              'border-0 bg-transparent shadow-none ring-0'
            )}
          >
            <CardContent id="landing-hero-card-visual-body" className="p-0 sm:p-0">
              <div
                id="landing-hero-visual-inner"
                className="hero-image-container box-border flex w-full max-w-[min(100%,640px)] flex-col items-center justify-center gap-4 px-3 py-6 sm:mx-auto sm:px-6 sm:py-8"
              >
                <div
                  id="landing-hero-logo-wrap"
                  className="hero-logo-wrapper box-border flex w-full max-w-full shrink-0 justify-center overflow-hidden"
                >
                  <img
                    id="landing-hero-logo"
                    src={logoUrl}
                    alt={`${personal?.name || 'Portfolio'} - Portfolio Logo`}
                    className="hero-logo-image box-border mx-auto block h-auto w-auto max-h-[min(320px,40vh)] max-w-[min(100%,560px)] object-contain sm:max-h-[min(400px,48vh)] sm:max-w-[min(100%,560px)]"
                    width={560}
                    height={320}
                    decoding="async"
                  />
                </div>
                <p
                  id="landing-hero-logo-subtitle"
                  className="hero-logo-subtitle relative z-[2] m-0 flex w-full min-w-0 max-w-full flex-row flex-wrap items-center justify-center gap-0 text-center font-semibold uppercase leading-snug tracking-[0.08em] text-primary text-[clamp(0.75rem,2.5vw,1.125rem)] sm:text-[clamp(0.8125rem,1.4vw,1.25rem)]"
                >
                  {t('landing.hero.logoSubtitle')
                    .split(' | ')
                    .map((word, index, array) => (
                      <span key={index} className="inline-flex items-center justify-center whitespace-nowrap">
                        <span className="hero-logo-subtitle-word inline-block whitespace-nowrap">{word}</span>
                        {index < array.length - 1 ? (
                          <span className="hero-logo-subtitle-separator mx-[calc(0.5rem+0.4em)] inline-block opacity-60">
                            {' '}
                            |{' '}
                          </span>
                        ) : null}
                      </span>
                    ))}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
