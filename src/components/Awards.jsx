export function Awards({ awards }) {
  return (
    <section className="resume-section" id="awards">
      <div className="resume-section-content">
        <h2 className="mb-4">Awards</h2>
        <div id="awards-content">
          {awards.map((award, index) => (
            <div key={index} className="award-item mb-4">
              <div className="award-content">
                <h3 className="mb-0">{award.title}</h3>
                <div className="subheading mb-3">
                  {award.issuer}
                  {award.year && <span className="text-muted"> • {award.year}</span>}
                </div>
                {award.description && <p className="mb-3">{award.description}</p>}
                
                {award.criteria && (
                  <div className="mb-3">
                    <strong>Award Criteria:</strong>
                    <p className="mt-2 mb-0">{award.criteria}</p>
                  </div>
                )}
                
                {award.impact && (
                  <div className="mb-3">
                    <strong>Impact:</strong>
                    <p className="mt-2 mb-0">{award.impact}</p>
                  </div>
                )}
                
                {award.certificateUrl && (
                  <div className="mt-3">
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
