import { useState, useRef, useLayoutEffect } from 'preact/hooks'
import type { JSX } from 'preact'
import { useTranslation } from '../contexts/TranslationContext'
import { cn } from '../lib/utils'
import { techTagClassName } from '../lib/projectShowcaseTechnologies'
import { Section, Icon } from './ui'
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

  const slideCount = experiences.length
  const minSwipeDistance = 50

  useLayoutEffect(() => {
    const measure = () => {
      const node = carouselRef.current
      if (!node) {
        return
      }
      const cs = getComputedStyle(node)
      const pl = Number.parseFloat(cs.paddingLeft) || 0
      const pr = Number.parseFloat(cs.paddingRight) || 0
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

  const goToSlide = (index: number) => {
    setIsDragging(false)
    setDragOffset(0)
    setCurrentIndex(index)
  }

  const nextSlide = () => {
    setIsDragging(false)
    setDragOffset(0)
    setCurrentIndex((prev) => (prev + 1) % slideCount)
  }

  const prevSlide = () => {
    setIsDragging(false)
    setDragOffset(0)
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount)
  }

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
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      prevSlide()
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      nextSlide()
    }
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
    setDragOffset(0)
    setIsDragging(false)

    requestAnimationFrame(() => {
      if (distance > minSwipeDistance) {
        nextSlide()
      } else if (distance < -minSwipeDistance) {
        prevSlide()
      }
    })
  }

  const trackTranslatePx =
    viewportWidth > 0 ? -currentIndex * viewportWidth + (isDragging ? dragOffset : 0) : 0
  const trackWidthPx = viewportWidth > 0 ? viewportWidth * slideCount : undefined

  const progressLabel =
    slideCount > 1
      ? t('experience.slideProgress', undefined, {
          current: String(currentIndex + 1),
          total: String(slideCount),
        })
      : ''

  const renderTechnologies = (technologies: string[]) => {
    if (!technologies?.length) {
      return null
    }

    return (
      <div className="cv-tags" aria-label={String(t('experience.technologies'))}>
        <p className="cv-tags__label">{t('experience.technologies')}</p>
        <div className="cv-tags__list">
          {technologies.map((tech, techIndex) => {
            if (tech.startsWith('---') && tech.endsWith('---')) {
              return (
                <span key={techIndex} className="cv-tags__group">
                  {tech.slice(3, -3).trim()}
                </span>
              )
            }
            return (
              <span key={techIndex} className={techTagClassName(tech)}>
                {tech}
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  const renderExperienceCard = (exp: (typeof experiences)[0], index: number) => {
    const titleId = `experience-${index}-title`

    return (
      <article className="cv-panel cv-panel--experience" aria-labelledby={titleId}>
        <header className="cv-panel__head">
          {exp.period ? <span className="cv-panel__badge">{exp.period}</span> : null}
          <h3 id={titleId} className="cv-panel__title">
            {exp.title}
          </h3>
          <p className="cv-panel__meta">
            <span className="cv-panel__company">{exp.company}</span>
            {exp.location ? <span className="cv-panel__location"> · {exp.location}</span> : null}
          </p>
        </header>

        <div className="cv-panel__body">
          <p className="cv-panel__text">{exp.description}</p>

          {exp.impact ? (
            <div className="cv-panel__callout">
              <p className="cv-panel__callout-label">
                <Icon name="chart-line" size={16} aria-hidden />
                {t('experience.impact')}
              </p>
              <p className="cv-panel__callout-text">{exp.impact}</p>
            </div>
          ) : null}

          {exp.highlights && exp.highlights.length > 0 ? (
            <div className="cv-panel__block">
              <p className="cv-panel__block-label">{t('experience.highlights')}</p>
              <ul className="cv-list">
                {exp.highlights.map((highlight, highlightIndex) => (
                  <li key={highlightIndex}>{highlight}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {exp.achievements && exp.achievements.length > 0 ? (
            <div className="cv-panel__block">
              <p className="cv-panel__block-label">{t('experience.achievements')}</p>
              <ul className="cv-list cv-list--check">
                {exp.achievements.map((achievement, achievementIndex) => (
                  <li key={achievementIndex}>{achievement}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {exp.technologies?.length ? renderTechnologies(exp.technologies) : null}
        </div>
      </article>
    )
  }

  return (
    <Section
      id={id || 'experience'}
      data-section="experience"
      className={cn('cv-experience', className)}
      title={String(t('experience.title'))}
      subtitle={String(t('experience.subtitle'))}
    >
      {slideCount > 1 ? (
        <p className="cv-experience__progress" aria-live="polite" aria-atomic="true">
          {progressLabel}
          <span className="cv-experience__progress-role"> · {experiences[currentIndex]?.title}</span>
        </p>
      ) : null}

      <div className="cv-experience-shell">
        {slideCount > 1 ? (
          <nav className="cv-experience-rail" aria-label={String(t('experience.carouselAria'))}>
            <ol className="cv-experience-rail__list">
              {experiences.map((exp, index) => (
                <li key={`${exp.title}-${index}`} className="cv-experience-rail__item">
                  <button
                    type="button"
                    className={cn(
                      'cv-experience-rail__dot',
                      index === currentIndex && 'cv-experience-rail__dot--active'
                    )}
                    onClick={() => goToSlide(index)}
                    aria-label={String(
                      t('experience.goToAria', undefined, { n: String(index + 1) })
                    )}
                    aria-current={index === currentIndex ? 'step' : undefined}
                  >
                    <span className="cv-experience-rail__dot-core" aria-hidden />
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div
          ref={carouselRef}
          className="cv-experience-stage"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onKeyDown={onCarouselKeyDown}
          tabIndex={slideCount > 1 ? 0 : undefined}
          role="region"
          aria-roledescription="carousel"
          aria-label={String(t('experience.carouselAria'))}
        >
          <div
            className={cn('cv-experience-track', isDragging && 'cv-experience-track--dragging')}
            style={
              {
                width: trackWidthPx !== undefined ? `${trackWidthPx}px` : undefined,
                transform: `translateX(${trackTranslatePx}px)`,
              } as JSX.CSSProperties
            }
          >
            {experiences.map((exp, index) => (
              <div
                key={`${exp.title}-${exp.company}-${index}`}
                className="cv-experience-slide"
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
    </Section>
  )
}
