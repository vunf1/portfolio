import { useTranslation } from '../contexts/TranslationContext'
import { Section, Icon, Button } from './ui'
import type { ProjectsProps } from '../types'

export function Projects({ projects }: ProjectsProps) {
  const { t } = useTranslation()
  
  return (
    <Section 
      id="projects" 
      data-section="projects"
      title={String(t('projects.title'))} 
      subtitle={String(t('projects.subtitle'))}
    >
      <div id="projects-content" className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-item">
              <div className="project-content">
                <div className="project-header">
                  <h3 className="project-title">{project.name}</h3>
                  <div className="project-meta">
                    <span className="project-period">{project.period}</span>
                    {project.role && (
                      <span className="project-role">• {project.role}</span>
                    )}
                  </div>
                </div>
                
                <p className="project-description">{project.description}</p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="project-technologies">
                    <strong>Technologies Used:</strong>
                    <div className="tech-tags">
                      {project.technologies.map((tech, techIndex) => (
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
                
                {project.features && project.features.length > 0 && (
                  <div className="project-features">
                    <strong>Key Features:</strong>
                    <ul className="features-list">
                      {project.features.map((feature, featureIndex) => (
                        <li key={featureIndex}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {project.url && (
                  <div className="project-links">
                    <strong>Links:</strong>
                    <div className="link-buttons">
                      <Button
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline"
                        size="sm"
                      >
                        <Icon name="code" size={14} className="mr-1" />
                        Code
                      </Button>
                      {project.demo && (
                        <Button
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outline"
                          size="sm"
                        >
                          <Icon name="external-link" size={14} className="mr-1" />
                          Demo
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
    </Section>
  )
}




