import { useState, useRef, useLayoutEffect } from 'preact/hooks'
import type { JSX } from 'preact'
import { useTranslation } from '../contexts/TranslationContext'
import { cn } from '../lib/utils'
import { Section, Icon, Button } from './ui'
import type { ExperienceProps } from '../types'

export function Experience({ experiences, className = '', id }: ExperienceProps) {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  if (!experiences || experiences.length === 0) {
    return null
  }

  const minSwipeDistance = 50
  const slideCount = experiences.length

  useLayoutEffect(() => {
    const measure = () => {
      const node = carouselRef.current
      if (!node) {
        return
      }
      const cs = getComputedStyle(node)
      const pl = Number.parseFloat(cs.paddingLeft) || 0
      const pr = Number.parseFloat(cs.paddingRight) || 0
      /* clientWidth includes padding; slides must match the *content* box only */
      const contentWidth = node.clientWidth - pl - pr
      setViewportWidth(Math.max(0, Math.round(contentWidth)))
    }

    measure()

    const node = carouselRef.current
    if (!node || typeof ResizeObserver === 'undefined') {
      return
    }

    const ro = new ResizeObserver(measure)
    ro.observe(node)
    return () => ro.disconnect()
  }, [slideCount])

  const onCarouselKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    if (slideCount <= 1) {
      return
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prevSlide()
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      nextSlide()
    }
  }

  const goToSlide = (index: number) => {
    setIsDragging(false)
    setDragOffset(0)
    setCurrentIndex(index)
  }

  const nextSlide = () => {
    setIsDragging(false)
    setDragOffset(0)
    setCurrentIndex((prev) => (prev + 1) % experiences.length)
  }

  const prevSlide = () => {
    setIsDragging(false)
    setDragOffset(0)
    setCurrentIndex((prev) => (prev - 1 + experiences.length) % experiences.length)
  }

  const onTouchStart = (e: JSX.TargetedTouchEvent<HTMLDivElement>) => {
    setTouchEnd(null)
    setTouchStart(e.touches[0].clientX)
    setIsDragging(true)
    setDragOffset(0)
  }

  const onTouchMove = (e: JSX.TargetedTouchEvent<HTMLDivElement>) => {
    if (!touchStart) {
      return
    }
    const currentX = e.touches[0].clientX
    setTouchEnd(currentX)
    setDragOffset(currentX - touchStart)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false)
      setDragOffset(0)
      return
    }

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    setDragOffset(0)
    setIsDragging(false)

    requestAnimationFrame(() => {
      if (isLeftSwipe) {
        nextSlide()
      }
      if (isRightSwipe) {
        prevSlide()
      }
    })
  }

  const trackTranslatePx =
    viewportWidth > 0 ? -currentIndex * viewportWidth + (isDragging ? dragOffset : 0) : 0
  const trackWidthPx = viewportWidth > 0 ? viewportWidth * slideCount : undefined

  const renderTechnologies = (technologies: string[]) => {
    if (!technologies || technologies.length === 0) {
      return null
    }

    return (
      <section className="experience-card__block card-technologies" aria-label={String(t('experience.technologies'))}>
        <h4 className="experience-card__block-label">{t('experience.technologies')}</h4>
        <div className="tech-tags">
          {technologies.map((tech, techIndex) => {
            if (tech.startsWith('---') && tech.endsWith('---')) {
              const title = tech.slice(3, -3).trim()
              return (
                <div key={techIndex} className="tech-section-title">
                  {title}
                </div>
              )
            }

            return (
              <span key={techIndex} className="tech-tag">
                {tech}
              </span>
            )
          })}
        </div>
      </section>
    )
  }

  const renderHighlights = (highlights: string[]) => {
    if (!highlights || highlights.length === 0) {
      return null
    }

    return (
      <section className="experience-card__block card-highlights" aria-label={String(t('experience.highlights'))}>
        <div className="highlights-header experience-card__block-head">
          <div className="highlights-icon-wrapper" aria-hidden>
            <Icon name="star" size={18} />
          </div>
          <h4 className="highlight-title experience-card__block-title">{t('experience.highlights')}</h4>
        </div>
        <ul className="highlights-list experience-card__list">
          {highlights.map((highlight, highlightIndex) => (
            <li key={highlightIndex} className="highlight-item">
              <Icon name="arrow-right" size={14} className="highlight-arrow" aria-hidden />
              <span className="highlight-text">{highlight}</span>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  const renderExperienceCard = (exp: (typeof experiences)[0], index: number) => {
    const titleId = `experience-card-title-${index}`
    return (
      <article
        className={cn('experience-card', 'premium-card', 'experience-card--structured')}
        aria-labelledby={titleId}
      >
        <header className="experience-card__header card-header">
          <div className="experience-card__meta">
            {exp.period ? (
              <span className="experience-card__period">{exp.period}</span>
            ) : null}
            {slideCount > 1 ? (
              <span className="experience-card__index" aria-hidden>
                {index + 1}/{slideCount}
              </span>
            ) : null}
          </div>
          <h3 id={titleId} className="card-title">
            {exp.title}
          </h3>
          <p className="experience-card__org">
            <span className="experience-card__company">{exp.company}</span>
            {exp.location ? (
              <span className="experience-card__location">
                <span className="experience-card__sep" aria-hidden>
                  {' '}
                  ·{' '}
                </span>
                {exp.location}
              </span>
            ) : null}
          </p>
        </header>

        <div className="experience-card__body card-body">
          <section className="experience-card__block experience-card__overview" aria-label={String(t('experience.overview'))}>
            <p className="card-description experience-card__description">{exp.description}</p>
          </section>

          {exp.impact ? (
            <section className="experience-card__block card-impact" aria-label={String(t('experience.impact'))}>
              <div className="impact-header experience-card__block-head">
                <div className="impact-icon-wrapper" aria-hidden>
                  <Icon name="chart-line" size={18} />
                </div>
                <h4 className="impact-title experience-card__block-title">{t('experience.impact')}</h4>
              </div>
              <p className="impact-text">{exp.impact}</p>
            </section>
          ) : null}

          {exp.highlights && exp.highlights.length > 0 ? renderHighlights(exp.highlights) : null}

          {exp.achievements && exp.achievements.length > 0 ? (
            <section className="experience-card__block card-achievements" aria-label={String(t('experience.achievements'))}>
              <div className="achievements-header experience-card__block-head">
                <div className="achievements-icon-wrapper" aria-hidden>
                  <Icon name="trophy" size={18} />
                </div>
                <h4 className="achievements-title experience-card__block-title">{t('experience.achievements')}</h4>
              </div>
              <ul className="achievements-list experience-card__list">
                {exp.achievements.map((achievement, achievementIndex) => (
                  <li key={achievementIndex} className="achievement-item">
                    <span className="achievement-icon" aria-hidden>
                      <Icon name="check" size={14} />
                    </span>
                    <span className="achievement-text">{achievement}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {exp.technologies && exp.technologies.length > 0 ? renderTechnologies(exp.technologies) : null}
        </div>
      </article>
    )
  }

  const progressLabel =
    slideCount > 1
      ? t('experience.slideProgress', undefined, {
          current: String(currentIndex + 1),
          total: String(slideCount)
        })
      : ''

  return (
    <Section
      id={id || 'experience'}
      data-section="experience"
      className={cn('experience-section', className)}
      title={String(t('experience.title'))}
      subtitle={String(t('experience.subtitle'))}
    >
      <div className="experience-section__inner">
        {slideCount > 1 ? (
          <div className="experience-toolbar">
            <p className="experience-toolbar__progress" aria-live="polite" aria-atomic="true">
              {progressLabel}
            </p>
            <p className="experience-toolbar__current">
              <span className="experience-toolbar__role-title">{experiences[currentIndex]?.title}</span>
            </p>
          </div>
        ) : null}

        <div className="experience-carousel-wrapper">
          <div className="experience-carousel-chrome">
            {slideCount > 1 ? (
              <>
                <div className="experience-carousel-nav-wrap experience-carousel-nav-wrap--prev">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="experience-carousel-nav-inner"
                    onClick={prevSlide}
                    aria-label={String(t('experience.prevAria'))}
                  >
                    <Icon name="chevron-left" size={18} aria-hidden />
                  </Button>
                </div>
                <div className="experience-carousel-nav-wrap experience-carousel-nav-wrap--next">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="experience-carousel-nav-inner"
                    onClick={nextSlide}
                    aria-label={String(t('experience.nextAria'))}
                  >
                    <Icon name="chevron-right" size={18} aria-hidden />
                  </Button>
                </div>
              </>
            ) : null}

            <div
              ref={carouselRef}
              className="experience-carousel-viewport"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onKeyDown={onCarouselKeyDown}
              tabIndex={0}
              role="region"
              aria-roledescription="carousel"
              aria-label={String(t('experience.carouselAria'))}
            >
              <div
                className={cn('experience-carousel-track', isDragging && 'no-transition')}
                style={
                  {
                    width: trackWidthPx !== undefined ? `${trackWidthPx}px` : undefined,
                    transform: `translateX(${trackTranslatePx}px)`
                  } as JSX.CSSProperties
                }
              >
                {experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="experience-carousel-slide"
                    style={
                      viewportWidth > 0
                        ? ({ width: `${viewportWidth}px`, flex: '0 0 auto' } as JSX.CSSProperties)
                        : undefined
                    }
                    aria-hidden={index !== currentIndex}
                  >
                    {renderExperienceCard(exp, index)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {slideCount > 1 ? (
            <div className="experience-carousel-dots">
              {experiences.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={cn('experience-carousel-dot', index === currentIndex && 'active')}
                  onClick={() => goToSlide(index)}
                  aria-label={String(t('experience.goToAria', undefined, { n: String(index + 1) }))}
                  aria-current={index === currentIndex ? 'true' : undefined}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  )
}
