export function Interests({ interests }) {
  return (
    <section className="resume-section" id="interests">
      <div className="resume-section-content">
        <h2 className="mb-4">Interests</h2>
        <div id="interests-content">
          {interests.map((interest, index) => (
            <div key={index} className="interest-item mb-4">
              <h3 className="mb-3">{interest.category}</h3>
              <p className="mb-3">{interest.description}</p>
              
              {interest.items && interest.items.length > 0 && (
                <div>
                  <strong>Specific Interests:</strong>
                  <ul className="mt-2 mb-0">
                    {interest.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}




