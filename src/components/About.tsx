import type { AboutProps } from '../types'

export function About({ personal, social }: AboutProps) {
  return (
    <section className="resume-section" id="about">
      <div className="resume-section-content">
        <div className="about-container">
          <div className="about-profile">
            <div className="profile-image-container">
              <picture className="profile-image-picture">
                <source 
                  type="image/avif" 
                  srcSet="./img/optimized/profile-xs.avif 150w, ./img/optimized/profile-sm.avif 300w, ./img/optimized/profile-md.avif 600w, ./img/optimized/profile-lg.avif 1200w"
                />
                <source 
                  type="image/webp" 
                  srcSet="./img/optimized/profile-xs.webp 150w, ./img/optimized/profile-sm.webp 300w, ./img/optimized/profile-md.webp 600w, ./img/optimized/profile-lg.webp 1200w"
                />
                <img 
                  className="profile-image" 
                  src="./img/optimized/profile-md.jpeg" 
                  srcSet="./img/optimized/profile-xs.jpeg 150w, ./img/optimized/profile-sm.jpeg 300w, ./img/optimized/profile-md.jpeg 600w, ./img/optimized/profile-lg.jpeg 1200w"
                  alt={`${personal.name} Profile`}
                  loading="eager"
                  decoding="async"
                  sizes="(max-width: 480px) 150px, (max-width: 768px) 300px, (max-width: 1024px) 600px, 1200px"
                />
              </picture>
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




