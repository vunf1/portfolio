export function Experience({ experience }) {
  return (
    <section className="resume-section" id="experience">
      <div className="resume-section-content">
        <h2 className="mb-4">Experience</h2>
        <div id="experience-content" className="experience-grid">
          {experience.map((exp, index) => (
            <div key={index} className="experience-card premium-card">
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
                
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="card-technologies">
                    <strong>Technologies:</strong>
                    <div className="tech-tags">
                      {exp.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex} 
                          className="tech-tag"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="card-achievements">
                    <strong>Key Achievements:</strong>
                    <ul className="achievements-list">
                      {exp.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
