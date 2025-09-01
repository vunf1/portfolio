export function Skills({ skills }) {
  // Handle the new skills data structure
  if (!skills || typeof skills !== 'object') {
    return (
      <section className="resume-section" id="skills">
        <div className="resume-section-content">
          <h2 className="mb-4">Skills</h2>
          <p>Skills data not available.</p>
        </div>
      </section>
    )
  }

  const { technical = [], soft = [] } = skills

  return (
    <section className="resume-section" id="skills">
      <div className="resume-section-content">
        <h2 className="mb-4">Skills</h2>
        <div id="skills-content">
          {/* Technical Skills */}
          {technical.map((skillGroup, index) => (
            <div key={index} className="mb-4">
              <h3 className="mb-3">{skillGroup.category}</h3>
              <div className="skills-grid">
                {skillGroup.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-item">
                    <div className="skill-name">{skill.name}</div>
                    <div className="skill-level">
                      <div className="progress">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${skill.level}%` }}
                          aria-valuenow={skill.level}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    {skill.experience && (
                      <div className="skill-experience">
                        <small className="text-muted">{skill.experience}</small>
                      </div>
                    )}
                    {skill.projects && (
                      <div className="skill-projects">
                        <small className="text-muted">{skill.projects} projects</small>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Soft Skills */}
          {soft.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-3">Soft Skills</h3>
              <div className="skills-grid">
                {soft.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-item">
                    <div className="skill-name">{skill.name}</div>
                    <div className="skill-level">
                      <div className="progress">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${skill.level}%` }}
                          aria-valuenow={skill.level}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    {skill.description && (
                      <div className="skill-description">
                        <small className="text-muted">{skill.description}</small>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}




