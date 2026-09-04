import { useTranslation } from '../contexts/TranslationContext'
import { Section } from './ui'
import type { EducationProps } from '../types/components'

export function Education({ education, className = '', id }: EducationProps) {
  const { t } = useTranslation()

  if (!education || education.length === 0) {
    return null
  }

  return (
    <Section
      id={id || 'education'}
      data-section="education"
      className={className}
      title={String(t('education.title'))}
      subtitle={String(t('education.subtitle'))}
    >
      <div className="cv-card-grid">
        {education.map((edu) => (
          <article key={`edu-${edu.institution}`} className="cv-panel cv-panel--education">
            <header className="cv-panel__head">
              <h3 className="cv-panel__title">{edu.degree}</h3>
              <p className="cv-panel__meta">
                <span className="cv-panel__company">{edu.institution}</span>
              </p>
            </header>
            {edu.description ? <p className="cv-panel__text">{edu.description}</p> : null}
          </article>
        ))}
      </div>
    </Section>
  )
}
