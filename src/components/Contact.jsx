export function Contact({ personal, isUnlocked, onUnlock }) {
  return (
    <section className="resume-section" id="contact">
      <div className="resume-section-content">
        <h2 className="mb-4">Contact</h2>
        <div className="contact-container position-relative">
          <div id="contact-content" className={isUnlocked ? '' : 'blur-content'}>
            {isUnlocked ? (
              <div className="contact-info">
                <div className="row">
                  <div className="col-md-6 mb-3">
                                             <h5><i className="fa-solid fa-envelope me-2"></i>Email</h5>
                    <p><a href={`mailto:${personal.email}`}>{personal.email}</a></p>
                  </div>
                  <div className="col-md-6 mb-3">
                                             <h5><i className="fa-solid fa-phone me-2"></i>Phone</h5>
                    <p>{personal.phone}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                                             <h5><i className="fa-solid fa-map-marker me-2"></i>Location</h5>
                    <p>{personal.location}</p>
                  </div>
                  {personal.website && (
                    <div className="col-md-6 mb-3">
                                               <h5><i className="fa-solid fa-globe me-2"></i>Website</h5>
                      <p><a href={personal.website} target="_blank" rel="noopener noreferrer">{personal.website}</a></p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="contact-placeholder">
                <p className="text-muted">Contact information will be displayed here after unlocking.</p>
              </div>
            )}
          </div>
          
          {!isUnlocked && (
            <div className="blur-overlay">
              <div className="unlock-message text-center">
                                     <i className="fa-solid fa-lock fa-3x text-primary mb-3"></i>
                <h4>Click to unlock access to my information</h4>
                <p className="text-muted">Get in touch with me</p>
                <button 
                  className="btn btn-primary btn-lg" 
                  onClick={onUnlock}
                >
                                       <i className="fa-solid fa-unlock me-2"></i>Unlock Contact Info
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
