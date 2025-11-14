import { useState, useRef } from 'preact/hooks'
import type { JSX } from 'preact'
import { useTranslation } from '../contexts/TranslationContext'
import { Section } from './ui'
import type { ExperienceProps } from '../types'

export function Experience({ experiences, className = '', id }: ExperienceProps) {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Safety check: if no experiences data, return null
  if (!experiences || experiences.length === 0) {
    return null
  }

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const goToSlide = (index: number) => {
    // Ensure drag state is reset before transition
    setIsDragging(false)
    setDragOffset(0)
    setCurrentIndex(index)
  }

  const nextSlide = () => {
    // Ensure drag state is reset before transition
    setIsDragging(false)
    setDragOffset(0)
    setCurrentIndex((prev) => (prev + 1) % experiences.length)
  }

  const prevSlide = () => {
    // Ensure drag state is reset before transition
    setIsDragging(false)
    setDragOffset(0)
    setCurrentIndex((prev) => (prev - 1 + experiences.length) % experiences.length)
  }

  // Touch handlers for swipe gestures with visual feedback
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
    const offset = currentX - touchStart
    setDragOffset(offset)
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

    // Reset drag state first
    setDragOffset(0)
    setIsDragging(false)

    // Use requestAnimationFrame to ensure smooth transition after drag
    requestAnimationFrame(() => {
      if (isLeftSwipe) {
        nextSlide()
      }
      if (isRightSwipe) {
        prevSlide()
      }
    })
  }

  const renderTechnologies = (technologies: string[]) => {
    if (!technologies || technologies.length === 0) {
      return null
    }

    return (
      <div className="card-technologies">
        <strong>Technologies:</strong>
        <div className="tech-tags">
          {technologies.map((tech, techIndex) => {
            // Check if this is a section title (starts and ends with "---")
            if (tech.startsWith('---') && tech.endsWith('---')) {
              const title = tech.slice(3, -3).trim() // Remove the "---" and trim
              return (
                <div key={techIndex} className="tech-section-title">
                  {title}
                </div>
              )
            }
            
            // Regular technology tag
            return (
              <span 
                key={techIndex} 
                className="tech-tag"
              >
                {tech}
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  const renderHighlights = (highlights: string[]) => {
    if (!highlights || highlights.length === 0) {
      return null
    }

    return (
      <div className="card-highlights">
        <div className="highlights-header">
          <div className="highlights-icon-wrapper">
            <i className="fa-solid fa-star"></i>
          </div>
          <strong className="highlight-title">Key Highlights:</strong>
        </div>
        <div className="highlights-list">
          {highlights.map((highlight, highlightIndex) => (
            <div key={highlightIndex} className="highlight-item">
              <i className="fa-solid fa-arrow-right highlight-arrow"></i>
              <div className="highlight-text-container">
                <span className="highlight-text">{highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderExperienceCard = (exp: typeof experiences[0], index: number) => (
    <div 
      key={index} 
      className="experience-card premium-card"
    >
                <div className="card-header">
                  <h3 className="card-title">{exp.title}</h3>
                  <div className="card-company">
                    {exp.company}
                    {exp.location && <span className="text-muted"> • {exp.location}</span>}
                  </div>
                  <div className="card-period">{exp.period}</div>
                </div>
                
                <div className="card-body">
                  <p className="card-description">{exp.description}</p>
                  
                  {exp.technologies && exp.technologies.length > 0 && renderTechnologies(exp.technologies)}
                  
                  {exp.impact && (
                    <div className="card-impact">
                      <div className="impact-header">
                        <div className="impact-icon-wrapper">
                          <i className="fa-solid fa-chart-line"></i>
                        </div>
                        <strong className="impact-title">Impact:</strong>
                      </div>
                      <p className="impact-text">{exp.impact}</p>
                    </div>
                  )}
                  
                  {exp.highlights && exp.highlights.length > 0 && renderHighlights(exp.highlights)}
                  
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="card-achievements">
                      <div className="achievements-header">
                        <div className="achievements-icon-wrapper">
                          <i className="fa-solid fa-trophy"></i>
                        </div>
                        <strong className="achievements-title">Key Achievements:</strong>
                      </div>
                      <div className="achievements-list">
                        {exp.achievements.map((achievement, achievementIndex) => (
                          <div key={achievementIndex} className="achievement-item">
                            <div className="achievement-icon">
                              <i className="fa-solid fa-check"></i>
                            </div>
                            <span className="achievement-text">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div> 
                  )}
                </div>
    </div>
  )

  return (
    <Section 
      id={id || 'experience'} 
      data-section="experience"
      className={className} 
      title={String(t('experience.title'))} 
      subtitle={String(t('experience.subtitle'))}
    >
      {/* Carousel - Works on all screen sizes */}
      <div className="experience-carousel-wrapper">
        <div 
          className="experience-carousel-container"
          ref={carouselRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          tabIndex={0}
          role="region"
          aria-label="Experience carousel"
        >
          <div 
            className={`experience-carousel-track ${isDragging ? 'no-transition' : ''}`}
            style={{ 
              transform: `translateX(calc(-${currentIndex * 100}% + ${currentIndex * 128}px + ${isDragging ? dragOffset : 0}px))`
            }}
          >
            {experiences.map((exp, index) => (
              <div key={index} className="experience-carousel-slide">
                {renderExperienceCard(exp, index)}
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows - Hidden on mobile */}
          {experiences.length > 1 && (
            <>
              <button
                className="experience-carousel-nav experience-carousel-prev"
                onClick={prevSlide}
                aria-label="Previous experience"
                type="button"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                className="experience-carousel-nav experience-carousel-next"
                onClick={nextSlide}
                aria-label="Next experience"
                type="button"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </>
          )}
        </div>
        
        {/* Navigation Dots */}
        {experiences.length > 1 && (
          <div className="experience-carousel-dots">
            {experiences.map((_, index) => (
              <button
                key={index}
                className={`experience-carousel-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to experience ${index + 1}`}
                type="button"
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
