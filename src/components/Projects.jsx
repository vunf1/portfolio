export function Projects({ projects }) {
  return (
    <section className="resume-section" id="projects">
      <div className="resume-section-content">
        <h2 className="mb-4">Projects</h2>
        <div id="projects-content">
          {projects.map((project, index) => (
            <div key={index} className="project-item mb-4">
              <div className="project-content">
                <h3 className="mb-0">{project.title}</h3>
                <div className="subheading mb-3">
                  {project.period}
                  {project.role && <span className="text-muted"> • {project.role}</span>}
                </div>
                <p className="mb-3">{project.description}</p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-3">
                    <strong>Technologies Used:</strong>
                    <div className="mt-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex} 
                          className="badge bg-info me-2 mb-2"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {project.features && project.features.length > 0 && (
                  <div className="mb-3">
                    <strong>Key Features:</strong>
                    <ul className="mt-2 mb-0">
                      {project.features.map((feature, featureIndex) => (
                        <li key={featureIndex}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {project.links && project.links.length > 0 && (
                  <div>
                    <strong>Links:</strong>
                    <div className="mt-2">
                      {project.links.map((link, linkIndex) => (
                        <a 
                          key={linkIndex}
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm me-2 mb-2"
                        >
                          <i className={`fa ${link.icon} me-1`}></i>
                          {link.text}
                        </a>
                      ))}
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




