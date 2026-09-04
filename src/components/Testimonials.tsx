import { useState, useEffect } from 'preact/hooks'
import { useTranslation } from '../contexts/TranslationContext'
import { Section, Icon } from './ui'
import type { TestimonialsProps } from '../types'

export function Testimonials({ testimonials }: TestimonialsProps) {
  const { t } = useTranslation()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) {
      return
    }

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  const active = testimonials[currentTestimonial]

  return (
    <Section
      id="testimonials"
      data-section="testimonials"
      className="cv-testimonials"
      title={String(t('testimonials.title'))}
      subtitle={String(t('testimonials.subtitle'))}
    >
      <div className="cv-testimonials__layout">
        <article className="cv-panel cv-panel--quote">
          <Icon name="quote-left" size={22} className="cv-panel__quote-icon" aria-hidden />
          <blockquote className="cv-panel__quote">"{active?.content}"</blockquote>
          <footer className="cv-panel__quote-footer">
            <div>
              <p className="cv-panel__title">{active?.name}</p>
              <p className="cv-panel__meta">
                {active?.position}
                {active?.company ? ` · ${active.company}` : ''}
              </p>
            </div>
            <div className="cv-testimonials__stars" aria-label={String(t('testimonials.rating'))}>
              {[...Array(active?.rating || 0)].map((_, index) => (
                <Icon key={index} name="star" size={16} className="text-warning" />
              ))}
            </div>
          </footer>
        </article>

        <div className="cv-testimonials__controls">
          <button type="button" className="cv-icon-btn" onClick={prevTestimonial} aria-label={String(t('testimonials.prevAria'))}>
            <Icon name="chevron-left" size={20} />
          </button>
          <div className="cv-testimonials__dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`cv-dot ${index === currentTestimonial ? 'cv-dot--active' : ''}`}
                onClick={() => goToTestimonial(index)}
                aria-label={String(t('testimonials.goToAria', undefined, { n: String(index + 1) }))}
                aria-current={index === currentTestimonial ? 'true' : undefined}
              />
            ))}
          </div>
          <button type="button" className="cv-icon-btn" onClick={nextTestimonial} aria-label={String(t('testimonials.nextAria'))}>
            <Icon name="chevron-right" size={20} />
          </button>
        </div>

        <div className="cv-testimonials__list">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              className={`cv-panel cv-panel--testimonial-pick ${index === currentTestimonial ? 'cv-panel--active' : ''}`}
              onClick={() => goToTestimonial(index)}
            >
              <p className="cv-panel__title">{testimonial.name}</p>
              <p className="cv-panel__meta">
                {testimonial.position} · {testimonial.company}
              </p>
              <p className="cv-panel__text cv-panel__text--clamp">"{testimonial.content}"</p>
            </button>
          ))}
        </div>
      </div>
    </Section>
  )
}
