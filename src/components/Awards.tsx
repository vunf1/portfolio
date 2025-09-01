import type { AwardsProps } from '../types'

export function Awards({ awards }: AwardsProps) {
  return (
    <section className="resume-section" id="awards">
      <div className="resume-section-content">
        <h2 className="mb-4">Awards</h2>
        <div id="awards-content" className="awards-grid">
          {awards.map((award, index) => (
            <div key={index} className="award-item">
              <div className="award-content">
                <div className="award-header">
                  <div className="award-icon">
                    <i className="fa-solid fa-trophy"></i>
                  </div>
                  <h3 className="award-title">{award.title}</h3>
                </div>
                
                <div className="award-meta">
                  <span className="award-issuer">{award.issuer}</span>
                  {award.date && (
                    <span className="award-date">• {award.date}</span>
                  )}
                </div>
                
                {award.description && (
                  <p className="award-description">{award.description}</p>
                )}
                
                {award.criteria && (
                  <div className="award-criteria">
                    <strong>Criteria:</strong>
                    <p>{award.criteria}</p>
                  </div>
                )}
                
                {award.impact && (
                  <div className="award-impact">
                    <strong>Impact:</strong>
                    <p>{award.impact}</p>
                  </div>
                )}
                
                {award.certificateUrl && (
                  <div className="award-actions">
                    <a 
                      href={award.certificateUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline-warning btn-sm"
                    >
                      <i className="fa-solid fa-certificate me-1"></i>
                      View Certificate
                    </a>
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
