import { useTranslation } from '../contexts/TranslationContext'
import { Section, Icon } from './ui'
import type { InterestsProps } from '../types'

export function Interests({ interests }: InterestsProps) {
  const { t } = useTranslation()

  return (
    <Section
      id="interests"
      data-section="interests"
      title={String(t('interests.title'))}
      subtitle={String(t('interests.subtitle'))}
    >
      <div id="interests-content" className="cv-card-grid cv-card-grid--compact">
        {interests.map((interest, index) => (
          <article key={index} className="cv-panel cv-panel--interest">
            <header className="cv-panel__head cv-panel__head--row">
              <span className="cv-panel__icon" aria-hidden>
                <Icon name="heart" size={18} />
              </span>
              <h3 className="cv-panel__title">{interest.category}</h3>
            </header>
            <p className="cv-panel__text">{interest.description}</p>
            {interest.items && interest.items.length > 0 ? (
              <div className="cv-tags cv-tags--compact">
                <div className="cv-tags__list">
                  {interest.items.map((item, itemIndex) => (
                    <span key={itemIndex} className="cv-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  )
}
