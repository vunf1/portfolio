export function Education({ education }) {
  return (
    <section className="resume-section" id="education">
      <div className="resume-section-content">
        <h2 className="mb-4">Education</h2>
        <div id="education-content" className="education-grid">
          {education.map((edu, index) => (
            <div key={index} className="education-card premium-card">
              <div className="card-header">
                <h3 className="card-title">{edu.degree}</h3>
                <div className="card-institution">
                  {edu.institution}
                  {edu.location && <span className="text-muted"> • {edu.location}</span>}
                </div>
                <div className="card-period">{edu.period}</div>
                {edu.gpa && <div className="card-gpa">GPA: {edu.gpa}</div>}
              </div>
              
              <div className="card-body">
                {edu.description && <p className="card-description">{edu.description}</p>}
                
                {edu.courses && edu.courses.length > 0 && (
                  <div className="card-courses">
                    <strong>Relevant Courses:</strong>
                    <div className="course-tags">
                      {edu.courses.map((course, courseIndex) => (
                        <span 
                          key={courseIndex} 
                          className="course-tag"
                        >
                          {course}
                        </span>
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
