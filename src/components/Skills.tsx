import type { SkillsProps } from '../types'

export function Skills({ skills }: SkillsProps) {
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
            <div key={index} className="skills-category">
              <h3 className="skills-category-title">{skillGroup.category}</h3>
              <div className="skills-grid">
                {skillGroup.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-item">
                    <div className="skill-header">
                      <div className="skill-name">{skill.name}</div>
                      <div className="skill-percentage">{skill.level}%</div>
                    </div>
                    <div className="skill-level">
                      <div className="progress">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${skill.level}%` }}
                          aria-valuenow={skill.level}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                    </div>
                    <div className="skill-details">
                      {skill.experience && (
                        <div className="skill-experience">
                          <i className="fa-solid fa-clock"></i>
                          <span>{skill.experience}</span>
                        </div>
                      )}
                      {skill.projects && (
                        <div className="skill-projects">
                          <i className="fa-solid fa-folder"></i>
                          <span>{skill.projects} projects</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Soft Skills */}
          {soft.length > 0 && (
            <div className="skills-category">
              <h3 className="skills-category-title">Soft Skills</h3>
              <div className="skills-grid">
                {soft.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-item">
                    <div className="skill-header">
                      <div className="skill-name">{skill.name}</div>
                      <div className="skill-percentage">{skill.level}%</div>
                    </div>
                    <div className="skill-level">
                      <div className="progress">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${skill.level}%` }}
                          aria-valuenow={skill.level}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                    </div>
                    {skill.description && (
                      <div className="skill-description">
                        <i className="fa-solid fa-info-circle"></i>
                        <span>{skill.description}</span>
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




