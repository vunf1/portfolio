import { useTranslation } from '../contexts/TranslationContext'
import { Section, Badge, Button, Icon } from './ui'
import type { CertificationsProps } from '../types/components'

export function Certifications({ certifications, className = '', id }: CertificationsProps) {
  const { t } = useTranslation()

  if (!certifications || certifications.length === 0) {
    return null
  }

  return (
    <Section
      id={id || 'certifications'}
      data-section="certifications"
      className={className}
      title={String(t('certifications.title'))}
      subtitle={String(t('certifications.subtitle'))}
    >
      <div className="cv-card-grid">
        {certifications.map((cert) => (
          <article key={cert.id || `cert-${cert.name}`} className="cv-panel cv-panel--cert">
            <header className="cv-panel__head">
              <h3 className="cv-panel__title">{cert.name}</h3>
              <p className="cv-panel__meta">
                <span className="cv-panel__company">{cert.issuer}</span>
              </p>
            </header>

            <dl className="cv-meta-list">
              <div>
                <dt>{String(t('certifications.issued'))}</dt>
                <dd>{cert.issueDate}</dd>
              </div>
              {cert.expiryDate ? (
                <div>
                  <dt>{String(t('certifications.expires'))}</dt>
                  <dd>{cert.expiryDate}</dd>
                </div>
              ) : null}
              {cert.credentialId ? (
                <div>
                  <dt>ID</dt>
                  <dd>{cert.credentialId}</dd>
                </div>
              ) : null}
            </dl>

            {cert.description ? <p className="cv-panel__text">{cert.description}</p> : null}

            {cert.skills && cert.skills.length > 0 ? (
              <div className="cv-tags">
                <p className="cv-tags__label">{String(t('certifications.skills'))}</p>
                <div className="cv-tags__list">
                  {cert.skills.map((skill, index) => (
                    <Badge key={index} variant="primary" size="sm" className="cv-tag cv-tag--badge">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {cert.verificationUrl ? (
              <div className="cv-panel__actions">
                <Button href={cert.verificationUrl} variant="outline" size="sm">
                  <Icon name="external-link" size={16} className="mr-2" />
                  {String(t('certifications.verify'))}
                </Button>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  )
}
