import type { SkillsProps, SkillLevel } from '../types'

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

  const { technical = [], soft = [], proficiencyLevels = {} } = skills

  const getProficiencyIcon = (level: SkillLevel): string => {
    switch (level) {
      case 'Foundational':
        return 'fa-solid fa-seedling'
      case 'Proficient':
        return 'fa-solid fa-leaf'
      case 'Advanced':
        return 'fa-solid fa-tree'
      case 'Expert':
        return 'fa-solid fa-crown'
      default:
        return 'fa-solid fa-circle'
    }
  }

  const getLanguageIcon = (languageName: string, categoryName?: string): string => {
    const language = languageName.toLowerCase()
    
    // Return no icons for specific categories
    if (categoryName === 'Key Competencies' || categoryName === 'Tooling & Platforms') {
      return ''
    }

    // Programming Languages
    if (language.includes('python')) {return 'devicon-python-plain colored'}
    if (language.includes('typescript')) {return 'devicon-typescript-plain colored'}
    if (language.includes('javascript')) {return 'devicon-javascript-plain colored'}
    if (language.includes('java')) {return 'devicon-java-plain colored'}
    if (language.includes('c#')) {return 'devicon-csharp-plain colored'}
    if (language.includes('c++')) {return 'devicon-cplusplus-plain colored'}
    if (language === 'c') {return 'devicon-c-plain colored'}
    if (language.includes('visual basic') || language.includes('vb.net') || language.includes('vba')) {return 'devicon-visualbasic-plain colored'}
    if (language.includes('php')) {return 'devicon-php-plain colored'}
    if (language.includes('lua')) {return 'devicon-lua-plain colored'}
    if (language.includes('powershell')) {return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/powershell/powershell-original.svg'}
    if (language.includes('bash') || language.includes('shell')) {return 'devicon-bash-plain colored'}
    if (language.includes('nosql')) {return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg'}
    if (language.includes('sql')) {return 'devicon-mysql-plain colored'}

    // AI & ML
    if (language.includes('llm') || language.includes('rag') || language.includes('ai')) {return ''}
    if (language.includes('embedding') || language.includes('vector')) {return ''}
    if (language.includes('prompt')) {return ''}

    // Cybersecurity
    if (language.includes('firewall') || language.includes('ids') || language.includes('security')) {return ''}
    if (language.includes('encryption') || language.includes('aes') || language.includes('rsa')) {return ''}
    if (language.includes('threat') || language.includes('hunting')) {return ''}
    if (language.includes('zero trust')) {return ''}

    // Tooling & Platforms
    if (language.includes('linux')) {return 'devicon-linux-plain colored'}
    if (language.includes('windows')) {return 'devicon-windows8-plain colored'}
    if (language.includes('docker')) {return 'devicon-docker-plain colored'}
    if (language.includes('ci/cd') || language.includes('git')) {return 'devicon-git-plain colored'}
    if (language.includes('obs') || language.includes('streaming')) {return 'devicon-vuejs-plain colored'}

    // Software Engineering
    if (language.includes('design pattern') || language.includes('oop') || language.includes('mvc')) {return ''}
    if (language.includes('api') || language.includes('rest')) {return ''}

    // Default icon for other skills
    return ''
  }

  // Type assertion for proficiencyLevels
  const typedProficiencyLevels = proficiencyLevels as Record<SkillLevel, string>

  return (
    <section className="resume-section" id="skills">
      <div className="resume-section-content">

        {/* Proficiency Legend */}
        <div className="proficiency-legend">
          <h4 className="legend-title">Proficiency Levels</h4>
          <div className="legend-grid">
            {(['Foundational', 'Proficient', 'Advanced', 'Expert'] as SkillLevel[]).map((level) => (
              <div key={level} className="legend-item">
                <div className="legend-icon">
                  <i className={getProficiencyIcon(level)}></i>
                </div>
                <div className="legend-content">
                  <div className="legend-level">{level}</div>
                  <div className="legend-description">{typedProficiencyLevels[level] || ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="skills-content">
          {/* Technical Skills */}
          {technical.map((skillGroup, index) => (
            <div key={index} className="skills-category">
              <h3 className="skills-category-title">{skillGroup.category}</h3>
              <div className="skills-compact-grid">
                {skillGroup.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-compact-card">
                    <div className="skill-compact-header">
                      <div className="skill-compact-name">
                        {getLanguageIcon(skill.name, skillGroup.category) && getLanguageIcon(skill.name, skillGroup.category).startsWith('http') ? (
                          <img
                            src={getLanguageIcon(skill.name, skillGroup.category)}
                            alt={`${skill.name} icon`}
                            className="skill-language-icon"
                            style={{ width: '16px', height: '16px' }}
                          />
                        ) : getLanguageIcon(skill.name, skillGroup.category) ? (
                          <i className={`${getLanguageIcon(skill.name, skillGroup.category)} skill-language-icon`}></i>
                        ) : null}
                        <span>{skill.name}</span>
                      </div>
                      <div className="skill-compact-level skill-proficiency">
                        <i className={getProficiencyIcon(skill.level)}></i>
                        <span>{skill.level}</span>
                      </div>
                    </div>
                    <div className="skill-compact-details">
                      {skill.experience && (
                        <div className="skill-compact-experience">
                          <i className="fa-solid fa-clock"></i>
                          <span>{skill.experience}</span>
                        </div>
                      )}
                      {skill.projects && (
                        <div className="skill-compact-projects">
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
              <div className="skills-compact-grid">
                {soft.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-compact-card">
                    <div className="skill-compact-header">
                      <div className="skill-compact-name">
                        {getLanguageIcon(skill.name, 'Soft Skills') && getLanguageIcon(skill.name, 'Soft Skills').startsWith('http') ? (
                          <img
                            src={getLanguageIcon(skill.name, 'Soft Skills')}
                            alt={`${skill.name} icon`}
                          />
                        ) : getLanguageIcon(skill.name, 'Soft Skills') ? (
                          <i className={`${getLanguageIcon(skill.name, 'Soft Skills')} skill-language-icon`}></i>
                        ) : null}
                        <span>{skill.name}</span>
                      </div>
                      <div className="skill-compact-level skill-proficiency">
                        <i className={getProficiencyIcon(skill.level)}></i>
                        <span>{skill.level}</span>
                      </div>
                    </div>
                    {skill.description && (
                      <div className="skill-compact-description">
                        {skill.description}
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




