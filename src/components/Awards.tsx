import { useTranslation } from '../contexts/TranslationContext'
import { Section, Icon, Button } from './ui'
import type { AwardsProps } from '../types'

export function Awards({ awards }: AwardsProps) {
  const { t } = useTranslation()

  return (
    <Section id="awards" data-section="awards" title={String(t('awards.title'))} subtitle={String(t('awards.subtitle'))}>
      <div id="awards-content" className="cv-card-grid">
        {awards.map((award, index) => (
          <article key={index} className="cv-panel cv-panel--award">
            <header className="cv-panel__head cv-panel__head--row">
              <span className="cv-panel__icon" aria-hidden>
                <Icon name="trophy" size={20} />
              </span>
              <div>
                <h3 className="cv-panel__title">{award.title}</h3>
                <p className="cv-panel__meta">
                  <span className="cv-panel__company">{award.issuer}</span>
                  {award.date ? <span className="cv-panel__location"> · {award.date}</span> : null}
                </p>
              </div>
            </header>

            {award.description ? <p className="cv-panel__text">{award.description}</p> : null}

            {award.criteria ? (
              <div className="cv-panel__block">
                <p className="cv-panel__block-label">Criteria</p>
                <p className="cv-panel__text">{award.criteria}</p>
              </div>
            ) : null}

            {award.impact ? (
              <div className="cv-panel__callout">
                <p className="cv-panel__callout-label">Impact</p>
                <p className="cv-panel__callout-text">{award.impact}</p>
              </div>
            ) : null}

            {award.certificateUrl ? (
              <div className="cv-panel__actions">
                <Button href={award.certificateUrl} target="_blank" rel="noopener noreferrer" variant="outline" size="sm">
                  <Icon name="certificate" size={14} className="mr-1" />
                  View Certificate
                </Button>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  )
}
