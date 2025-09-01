import type { CertificationsProps } from '../types'

export function Certifications({ certifications }: CertificationsProps) {
  return (
    <section className="resume-section" id="certifications">
      <div className="resume-section-content">
        <h2 className="mb-4">Certifications</h2>
        <div id="certifications-content">
          {certifications.map((cert, index) => (
            <div key={index} className="certification-item mb-4">
              <div className="certification-content">
                <h3 className="mb-0">{cert.name}</h3>
                <div className="subheading mb-3">
                  {cert.issuer}
                  {cert.credentialId && <span className="text-muted"> • ID: {cert.credentialId}</span>}
                </div>
                <div className="text-muted mb-2">{cert.issueDate}</div>
                {cert.expiryDate && <div className="text-muted mb-2">Expires: {cert.expiryDate}</div>}
                {cert.description && <p className="mb-3">{cert.description}</p>}
                
                {cert.skills && cert.skills.length > 0 && (
                  <div>
                    <strong>Skills Covered:</strong>
                    <div className="mt-2">
                      {cert.skills.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex} 
                          className="badge bg-success me-2 mb-2"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {cert.verificationUrl && (
                  <div className="mt-3">
                    <a 
                      href={cert.verificationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline-secondary btn-sm"
                    >
                      <i className="fa-solid fa-external-link me-1"></i>
                      Verify Certificate
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
