import { useState, useEffect } from 'preact/hooks'
import type { TestimonialsProps } from '../types'

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) {return}

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index)
    setIsAutoPlaying(false)
    
    // Resume auto-play after 10 seconds of manual navigation
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

  return (
    <section id="testimonials" data-section="testimonials" className="testimonials-container">
      <div className="testimonials-carousel">
        {/* Main Testimonial Display */}
        <div className="testimonial-main">
          <div className="testimonial-card premium-card">
            <div className="testimonial-content">
              <div className="quote-icon">
                <i className="fa-solid fa-quote-left"></i>
              </div>
              
              <blockquote className="testimonial-text">
                "{testimonials[currentTestimonial]?.content}"
              </blockquote>
              
              <div className="testimonial-author">
                <div className="author-info">
                  <h4 className="author-name">
                    {testimonials[currentTestimonial]?.name}
                  </h4>
                  <p className="author-position">
                    {testimonials[currentTestimonial]?.position}
                  </p>
                  <p className="author-company">
                    {testimonials[currentTestimonial]?.company}
                  </p>
                </div>
                
                <div className="testimonial-rating">
                  {[...Array(testimonials[currentTestimonial]?.rating || 0)].map((_, index) => (
                    <i key={index} className="fa-solid fa-star text-warning"></i>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div className="testimonial-controls">
          <button 
            className="control-btn prev-btn"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          
          <div className="testimonial-indicators">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => goToTestimonial(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            className="control-btn next-btn"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
        
        {/* Testimonial List */}
        <div className="testimonials-list">
          <div className="list-header">
            <h3>What Clients Say</h3>
            <p>Real feedback from real projects</p>
          </div>
          
          <div className="testimonial-items">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`testimonial-item ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => goToTestimonial(index)}
              >
                <div className="item-content">
                  <div className="item-header">
                    <h4 className="item-name">{testimonial.name}</h4>
                    <div className="item-rating">
                      {[...Array(testimonial.rating)].map((_, starIndex) => (
                        <i key={starIndex} className="fa-solid fa-star text-warning"></i>
                      ))}
                    </div>
                  </div>
                  
                  <p className="item-position">
                    {testimonial.position} at {testimonial.company}
                  </p>
                  
                  <p className="item-excerpt">
                    "{testimonial.content.substring(0, 100)}..."
                  </p>
                  
                  <div className="item-date">
                    {new Date(testimonial.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
