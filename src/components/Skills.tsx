import { useTranslation } from '../contexts/TranslationContext'
import { Section } from './ui'
import type { SkillsProps } from '../types/components'
import type { SkillLevel } from '../types/portfolio'
import pythonIcon from 'devicon/icons/python/python-original.svg'
import typescriptIcon from 'devicon/icons/typescript/typescript-original.svg'
import javascriptIcon from 'devicon/icons/javascript/javascript-original.svg'
import javaIcon from 'devicon/icons/java/java-original.svg'
import csharpIcon from 'devicon/icons/csharp/csharp-original.svg'
import cplusplusIcon from 'devicon/icons/cplusplus/cplusplus-original.svg'
import cIcon from 'devicon/icons/c/c-original.svg'
import visualbasicIcon from 'devicon/icons/visualbasic/visualbasic-original.svg'
import phpIcon from 'devicon/icons/php/php-original.svg'
import luaIcon from 'devicon/icons/lua/lua-original.svg'
import powershellIcon from 'devicon/icons/powershell/powershell-original.svg'
import bashIcon from 'devicon/icons/bash/bash-original.svg'
import mysqlIcon from 'devicon/icons/mysql/mysql-original.svg'
import mongodbIcon from 'devicon/icons/mongodb/mongodb-original.svg'
import linuxIcon from 'devicon/icons/linux/linux-original.svg'
import windowsIcon from 'devicon/icons/windows8/windows8-original.svg'
import dockerIcon from 'devicon/icons/docker/docker-original.svg'
import gitIcon from 'devicon/icons/git/git-original.svg'
import vueIcon from 'devicon/icons/vuejs/vuejs-original.svg'

export function Skills({ skills }: SkillsProps) {
  const { t } = useTranslation()
  
  // Handle the new skills data structure
  if (!skills || typeof skills !== 'object') {
    return (
      <Section 
        id="skills" 
        data-section="skills"
        title={String(t('skills.title'))} 
        subtitle={String(t('skills.subtitle'))}
      >
        <p>Skills data not available.</p>
      </Section>
    )
  }

  const { technical = [], soft = [], proficiencyLevels = {} } = skills

  const getProficiencyIcon = (level: SkillLevel): string => {
    switch (level) {
      // English level names
      case 'Foundational':
        return 'fa-solid fa-seedling'
      case 'Proficient':
        return 'fa-solid fa-leaf'
      case 'Advanced':
        return 'fa-solid fa-tree'
      case 'Expert':
        return 'fa-solid fa-crown'
      // Portuguese level names
      case 'Fundacional':
        return 'fa-solid fa-seedling'
      case 'Proficiente':
        return 'fa-solid fa-leaf'
      case 'Avançado':
        return 'fa-solid fa-tree'
      case 'Perito':
        return 'fa-solid fa-crown'
      default:
        return 'fa-solid fa-circle'
    }
  }

  const getLanguageIcon = (languageName: string, categoryName?: string): string | undefined => {
    const language = languageName.toLowerCase()
    
    if (categoryName === 'Key Competencies' || categoryName === 'Tooling & Platforms') {
      return undefined
    }

    if (language.includes('python')) {return pythonIcon}
    if (language.includes('typescript')) {return typescriptIcon}
    if (language.includes('javascript')) {return javascriptIcon}
    if (language.includes('java')) {return javaIcon}
    if (language.includes('c#')) {return csharpIcon}
    if (language.includes('c++')) {return cplusplusIcon}
    if (language === 'c') {return cIcon}
    if (language.includes('visual basic') || language.includes('vb.net') || language.includes('vba')) {return visualbasicIcon}
    if (language.includes('php')) {return phpIcon}
    if (language.includes('lua')) {return luaIcon}
    if (language.includes('powershell')) {return powershellIcon}
    if (language.includes('bash') || language.includes('shell')) {return bashIcon}
    if (language.includes('nosql')) {return mongodbIcon}
    if (language.includes('sql')) {return mysqlIcon}
    if (language.includes('linux')) {return linuxIcon}
    if (language.includes('windows')) {return windowsIcon}
    if (language.includes('docker')) {return dockerIcon}
    if (language.includes('ci/cd') || language.includes('git')) {return gitIcon}
    if (language.includes('obs') || language.includes('streaming')) {return vueIcon}

    return undefined
  }

  const renderSkillIcon = (iconSrc?: string, altLabel?: string) => {
    if (!iconSrc) {
      return null
    }

    return (
      <img
        src={iconSrc}
        alt={`${altLabel ?? 'Skill'} icon`}
        className="skill-language-icon"
        loading="lazy"
        decoding="async"
      />
    )
  }

  // Type assertion for proficiencyLevels
  const typedProficiencyLevels = proficiencyLevels as Record<SkillLevel, string>
  
  // Get translated level names - handles both English and Portuguese level names
  const getTranslatedLevelName = (level: SkillLevel): string => {
    // First try to translate using the level as a key
    const translated = t(`skills.levelNames.${level}`)
    if (translated && translated !== `skills.levelNames.${level}`) {
      return translated
    }
    
    // If that fails, it might be a Portuguese level name, so return it as-is
    return level
  }

  return (
    <Section 
      id="skills" 
      data-section="skills"
      title={String(t('skills.title'))} 
      subtitle={String(t('skills.subtitle'))}
    >

        {/* Proficiency Legend */}
        <div className="proficiency-legend">
          <h4 className="legend-title">{t('skills.proficiencyLevels')}</h4>
          <div className="legend-grid">
            {(['Foundational', 'Proficient', 'Advanced', 'Expert'] as SkillLevel[]).map((level) => (
              <div key={level} className="legend-item">
                <div className="legend-icon">
                  <i className={getProficiencyIcon(level)}></i>
                </div>
                <div className="legend-content">
                  <div className="legend-level">{getTranslatedLevelName(level)}</div>
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
                      {renderSkillIcon(getLanguageIcon(skill.name, skillGroup.category), skill.name)}
                        <span>{skill.name}</span>
                      </div>
                      <div className="skill-compact-level skill-proficiency">
                        <i className={getProficiencyIcon(skill.level)}></i>
                        <span>{getTranslatedLevelName(skill.level)}</span>
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
              <h3 className="skills-category-title">{t('skills.soft')}</h3>
              <div className="skills-compact-grid">
                {soft.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-compact-card">
                    <div className="skill-compact-header">
                      <div className="skill-compact-name">
                        {renderSkillIcon(getLanguageIcon(skill.name, 'Soft Skills'), skill.name)}
                        <span>{skill.name}</span>
                      </div>
                      <div className="skill-compact-level skill-proficiency">
                        <i className={getProficiencyIcon(skill.level)}></i>
                        <span>{getTranslatedLevelName(skill.level)}</span>
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
    </Section>
  )
}




