export function About({ personal, social }) {
  return (
    <section className="resume-section" id="about">
      <div className="resume-section-content">
        <div className="profile-section text-center mb-4">
          <img 
            className="img-profile rounded-circle mx-auto mb-2" 
            id="profile-image" 
            src={personal.profileImage} 
            alt={`${personal.name} Profile`}
          />
          <h1 className="mb-0" id="profile-name">{personal.name}</h1>
          <div className="subheading mb-3" id="profile-title">{personal.title}</div>
          <p className="lead mb-3" id="profile-tagline">{personal.tagline}</p>
          <p className="mb-4" id="profile-summary">{personal.summary}</p>
          
          {/* Social Links */}
          <ul className="list-social-icons" id="social-links">
            {social.map((socialItem, index) => (
              <li key={index}>
                <a 
                  href={socialItem.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={socialItem.name} 
                  style={{ background: socialItem.color }}
                >
                  <i className={`fa ${socialItem.icon}`}></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}




