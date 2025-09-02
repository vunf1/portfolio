import type { InterestsProps } from '../types'

export function Interests({ interests }: InterestsProps) {
  return (
    <section className="resume-section" id="interests">
      <div className="resume-section-content">
        <div id="interests-content" className="interests-grid">
          {interests.map((interest, index) => (
            <div key={index} className="interest-item">
              <div className="interest-content">
                <div className="interest-header">
                  <div className="interest-icon">
                    <i className="fa-solid fa-heart"></i>
                  </div>
                  <h3 className="interest-title">{interest.category}</h3>
                </div>
                
                <p className="interest-description">{interest.description}</p>
                
                {interest.items && interest.items.length > 0 && (
                  <div className="interest-items">
                    <strong>Specific Interests:</strong>
                    <div className="interest-tags">
                      {interest.items.map((item, itemIndex) => (
                        <span key={itemIndex} className="interest-tag">
                          {item}
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




