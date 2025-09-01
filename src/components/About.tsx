import type { AboutProps } from '../types'

export function About({ personal, social }: AboutProps) {
  return (
    <section className="resume-section" id="about">
      <div className="resume-section-content">
        <div className="about-container">
          <div className="about-profile">
            <div className="profile-image-container">
              <img 
                className="profile-image" 
                src={personal.profileImage} 
                alt={`${personal.name} Profile`}
                loading="lazy"
                decoding="async"
              />
            </div>
            
            <div className="profile-info">
              <h1 className="profile-name">{personal.name}</h1>
              <h2 className="profile-title">{personal.title}</h2>
              <p className="profile-tagline">{personal.tagline}</p>
              <p className="profile-summary">{personal.summary}</p>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="social-links-container">
            <h3 className="social-title">Connect with me</h3>
            <div className="social-links-grid">
              {social.map((socialItem, index) => (
                <a 
                  key={index}
                  href={socialItem.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link-item"
                  aria-label={socialItem.name}
                  style={{ '--social-color': socialItem.color }}
                >
                  <i className={`fa ${socialItem.icon}`}></i>
                  <span className="social-name">{socialItem.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}




