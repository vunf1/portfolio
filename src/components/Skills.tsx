import { useTranslation } from '../contexts/TranslationContext'
import { Section, Icon } from './ui'
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
import rustIcon from 'devicon/icons/rust/rust-original.svg'
import githubActionsIcon from 'devicon/icons/githubactions/githubactions-original.svg'
import tensorflowIcon from 'devicon/icons/tensorflow/tensorflow-original.svg'
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
      case 'Foundational':
      case 'Fundacional':
        return 'seedling'
      case 'Proficient':
      case 'Proficiente':
        return 'leaf'
      case 'Advanced':
      case 'Avançado':
        return 'tree'
      case 'Expert':
      case 'Perito':
        return 'crown'
      default:
        return 'circle'
    }
  }

  /** Canonical class for proficiency level (used for distinct icon colors) */
  const getProficiencyLevelClass = (level: SkillLevel): string => {
    switch (level) {
      case 'Foundational':
      case 'Fundacional':
        return 'foundational'
      case 'Proficient':
      case 'Proficiente':
        return 'proficient'
      case 'Advanced':
      case 'Avançado':
        return 'advanced'
      case 'Expert':
      case 'Perito':
        return 'expert'
      default:
        return 'foundational'
    }
  }

  const getSkillIcon = (skillName: string, categoryName?: string): string | undefined => {
    const noIconCategories = ['Key Competencies', 'Competências-chave', 'AI & Machine Learning', 'IA e aprendizagem automática']
    if (categoryName && noIconCategories.includes(categoryName)) {
      return undefined
    }
    const name = skillName.toLowerCase()
    if (name.includes('zero trust')) return undefined
    if (name.includes('python')) return pythonIcon
    if (name.includes('typescript')) return typescriptIcon
    if (name.includes('javascript')) return javascriptIcon
    if (name.includes('rust')) return rustIcon
    if (name.includes('java')) return javaIcon
    if (name.includes('c#')) return csharpIcon
    if (name.includes('c++')) return cplusplusIcon
    if (name === 'c') return cIcon
    if (name.includes('visual basic') || name.includes('vb.net') || name.includes('vba')) return visualbasicIcon
    if (name.includes('php')) return phpIcon
    if (name.includes('lua')) return luaIcon
    if (name.includes('powershell')) return powershellIcon
    if (name.includes('bash') || name.includes('shell')) return bashIcon
    if (name.includes('nosql')) return mongodbIcon
    if (name.includes('sql')) return mysqlIcon
    if (name.includes('linux')) return linuxIcon
    if (name.includes('windows')) return windowsIcon
    if (name.includes('docker')) return dockerIcon
    if (name.includes('git')) return gitIcon
    if (name.includes('ci/cd') || name.includes('devops')) return githubActionsIcon
    if (name.includes('obs') || name.includes('streamstar') || name.includes('streaming')) return '/icons/obs-studio.svg'
    if (name.includes('llm') || name.includes('rag') || name.includes('embedding') || name.includes('agent') || name.includes('prompt') || name.includes('tensorflow') || name.includes('keras') || name.includes('pytorch') || name.includes('machine learning')) return tensorflowIcon
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
        title={altLabel ?? 'Skill'}
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
                <div className={`legend-icon skill-proficiency-icon skill-proficiency-${getProficiencyLevelClass(level)}`}>
                  <Icon name={getProficiencyIcon(level)} size={16} />
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
          {/* Technical Skills – premium card layout for all categories */}
          {technical.map((skillGroup, index) => (
            <div
              key={index}
              className={`skills-category ${skillGroup.category === 'Programming Languages' || skillGroup.category === 'Linguagens de Programação' || skillGroup.category === 'Linguagens de programação' ? 'skills-category--programming-languages' : ''}`}
            >
              <h3 className="skills-category-title">{skillGroup.category}</h3>
              <div className="key-competencies-premium">
                {skillGroup.skills.map((skill, skillIndex) => {
                  const iconSrc = getSkillIcon(skill.name, skillGroup.category)
                  const hasIcon = !!iconSrc
                  const badge = (
                    <span className={`key-competency-badge skill-proficiency-${getProficiencyLevelClass(skill.level)}`}>
                      <span className="key-competency-badge-icon">
                        <Icon name={getProficiencyIcon(skill.level)} size={14} />
                      </span>
                      <span className="key-competency-badge-label">{getTranslatedLevelName(skill.level)}</span>
                    </span>
                  )
                  return (
                  <article key={skillIndex} className={`key-competency-card skill-proficiency-${getProficiencyLevelClass(skill.level)} ${hasIcon ? 'key-competency-card--with-icon' : ''}`} title={skill.name}>
                    <div className="key-competency-header">
                      {hasIcon ? (
                        <div className="key-competency-icon-block">
                          {renderSkillIcon(iconSrc, skill.name)}
                          {badge}
                        </div>
                      ) : (
                        <>
                          <div className="key-competency-name-wrap">
                            <h4 className="key-competency-name">{skill.name}</h4>
                          </div>
                          {badge}
                        </>
                      )}
                    </div>
                    {skill.description && (
                      <p className="key-competency-description">{skill.description}</p>
                    )}
                    {(skill.frontend?.length ?? 0) > 0 && (
                      <div className="key-competency-tech">
                        <span className="key-competency-tech-label">{t('skills.frontend')}:</span>
                        <span className="key-competency-tech-list">{skill.frontend!.join(', ')}</span>
                      </div>
                    )}
                    {(skill.backend?.length ?? 0) > 0 && (
                      <div className="key-competency-tech">
                        <span className="key-competency-tech-label">{t('skills.backend')}:</span>
                        <span className="key-competency-tech-list">{skill.backend!.join(', ')}</span>
                      </div>
                    )}
                    {(skill.databases?.length ?? 0) > 0 && (
                      <div className="key-competency-tech">
                        <span className="key-competency-tech-label">{t('skills.databases')}:</span>
                        <span className="key-competency-tech-list">{skill.databases!.join(', ')}</span>
                      </div>
                    )}
                    {(skill.security?.length ?? 0) > 0 && (
                      <div className="key-competency-tech">
                        <span className="key-competency-tech-label">{t('skills.security')}:</span>
                        <span className="key-competency-tech-list">{skill.security!.join(', ')}</span>
                      </div>
                    )}
                    {(skill.experience || (skill.projects != null && skill.projects > 0)) && (
                      <div className="key-competency-meta">
                        {skill.experience && (
                          <span className="key-competency-meta-item">
                            <Icon name="clock" size={12} />
                            {skill.experience}
                          </span>
                        )}
                        {skill.projects != null && skill.projects > 0 && (
                          <span className="key-competency-meta-item">
                            <Icon name="folder" size={12} />
                            {skill.projects} {t(skill.projects === 1 ? 'skills.projectSingular' : 'skills.projectPlural')}
                          </span>
                        )}
                      </div>
                    )}
                  </article>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Soft Skills – same design as technical skills */}
          {soft.length > 0 && (
            <div className="skills-category">
              <h3 className="skills-category-title">{t('skills.soft')}</h3>
              <div className="key-competencies-premium">
                {soft.map((skill, skillIndex) => {
                  const badge = (
                    <span className={`key-competency-badge skill-proficiency-${getProficiencyLevelClass(skill.level)}`}>
                      <span className="key-competency-badge-icon">
                        <Icon name={getProficiencyIcon(skill.level)} size={14} />
                      </span>
                      <span className="key-competency-badge-label">{getTranslatedLevelName(skill.level)}</span>
                    </span>
                  )
                  return (
                    <article key={skillIndex} className={`key-competency-card skill-proficiency-${getProficiencyLevelClass(skill.level)}`} title={skill.name}>
                      <div className="key-competency-header">
                        <div className="key-competency-name-wrap">
                          <h4 className="key-competency-name">{skill.name}</h4>
                        </div>
                        {badge}
                      </div>
                      {skill.description && (
                        <p className="key-competency-description">{skill.description}</p>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>
          )}
        </div>
    </Section>
  )
}




