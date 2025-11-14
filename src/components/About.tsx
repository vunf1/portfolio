import { useTranslation } from '../contexts/TranslationContext'
import { Section } from './ui'
import type { AboutProps } from '../types/components'

export function About({ personal, social, className = '', id }: AboutProps) {
  const { t, currentLanguage } = useTranslation()

  return (
    <Section
      id={id || 'about'}
      className={className}
      title={String(t('about.title'))}
      subtitle={String(t('about.subtitle'))}
    >
      <div className="about-container">
        <div className="about-profile">
          <div className="profile-image-container">
            <picture className="profile-image-picture">
              <source srcSet="./img/optimized/profile-lg.avif" type="image/avif" />
              <source srcSet="./img/optimized/profile-lg.webp" type="image/webp" />
              <source srcSet="./img/optimized/profile-lg.jpeg" type="image/jpeg" />
              <img src={personal.profileImage} alt={`${personal.name} - ${personal.title}`} className="profile-image" />
            </picture>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{personal.name}</h1>
            <h2 className="profile-title">{personal.title}</h2>
            <p className="profile-tagline">{personal.tagline}</p>
            <p className="profile-summary">{personal.summary}</p>
          </div>
        </div>
        <div className="social-links-container">
          <h3 className="social-title">
            {currentLanguage === 'pt-PT' ? 'Conecte-se Comigo' : 'Connect with Me'}
          </h3>
          <div className="social-links-grid">
            {social.map((socialItem) => (
              <a 
                key={socialItem.name} 
                href={socialItem.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="social-link-item"
              >
                <i className={socialItem.icon} aria-hidden="true"></i>
                <span className="social-name">{socialItem.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}




