import { useTranslation } from '../contexts/TranslationContext'
import type { HeroProps } from '../types'

export function Hero({ personal }: HeroProps) {
  const { t } = useTranslation()

  return (
    <section className="portfolio-hero" id="hero">
      <div className="hero-profile">
        {/* Profile Avatar */}
        <img 
          src={personal.profileImage} 
          alt={personal.title ? `${personal.name} - ${personal.title}` : personal.name}
          className="hero-avatar"
          loading="lazy"
          decoding="async"
        />
        
        {/* Hero Content */}
        <h1 className="hero-name text-gradient">
          {personal.name} <span className="brand-name"></span>
        </h1>
        
        <h2 className="hero-title">
          {t('hero.title')}
        </h2>
        
        <p className="hero-subtitle">
          {t('hero.subtitle')}
        </p>
        
        <p className="hero-summary">
          {personal.longSummary || personal.summary}
        </p>
        
        {/* Core Values */}
        {personal.coreValues && (
          <div className="hero-values animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <div className="values-grid">
              {personal.coreValues.map((value, index) => (
                <span 
                  key={index} 
                  className="value-tag"
                  style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="hero-bg-elements" aria-hidden="true">
        <span className="floating-shape shape-1">◆</span>
        <span className="floating-shape shape-2">●</span>
        <span className="floating-shape shape-3">▲</span>
        <span className="floating-shape shape-4">■</span>
        <span className="floating-shape shape-5">✦</span>
        <span className="data-stream data-stream-1"></span>
        <span className="data-stream data-stream-2"></span>
      </div>
    </section>
  )
}
