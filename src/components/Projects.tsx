import type { ProjectsProps } from '../types'

export function Projects({ projects }: ProjectsProps) {
  return (
    <section className="resume-section" id="projects">
      <div className="resume-section-content">
        <h2 className="mb-4">Projects</h2>
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
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i className="fa fa-code me-1"></i>
                        Code
                      </a>
                      {project.demo && (
                        <a 
                          href={project.demo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-outline-success btn-sm"
                        >
                          <i className="fa fa-external-link-alt me-1"></i>
                          Demo
                        </a>
                      )}
                    </div>
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




