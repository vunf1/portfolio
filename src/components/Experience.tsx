import type { ExperienceProps } from '../types'

export function Experience({ experience }: ExperienceProps) {
  const renderTechnologies = (technologies: string[]) => {
    if (!technologies || technologies.length === 0) return null

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
    if (!highlights || highlights.length === 0) return null

    return (
      <div className="card-highlights">
        <div className="highlights-header">
          <div className="highlights-icon-wrapper">
            <i className="fa-solid fa-star"></i>
          </div>
          <strong className="highlights-title">Key Highlights:</strong>
        </div>
        <div className="highlights-list">
          {highlights.map((highlight, highlightIndex) => (
            <div key={highlightIndex} className="highlight-item">
              <div className="highlight-icon">
                <i className="fa-solid fa-arrow-right"></i>
              </div>
              <span className="highlight-text">{highlight}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="resume-section" id="experience">
      <div className="resume-section-content">
        <div id="experience-content" className="experience-grid">
          {experience.map((exp, index) => {
            // Check if this is the "Autonomous — Self-Study" entry
            const isFullWidth = exp.title === "Autonomous — Self-Study"
            
            return (
              <div 
                key={index} 
                className={`experience-card premium-card ${isFullWidth ? 'experience-full-width' : ''}`}
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
          })}
        </div>
      </div>
    </section>
  )
}
