import { useTranslation } from '../contexts/TranslationContext'
import { Section, Card, Badge, Button, Icon } from './ui'
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
      <div className="certifications-grid">
        {certifications.map((cert) => (
          <Card 
            key={cert.id || `cert-${cert.name}`} 
            title={cert.name} 
            subtitle={cert.issuer} 
            className="certification-card"
          >
            <div className="certification-details">
              <div className="certification-date">
                <Icon name="calendar" size={16} className="mr-2" />
                {String(t('certifications.issued'))}: {cert.issueDate}
              </div>
              {cert.expiryDate && (
                <div className="certification-expiry">
                  <Icon name="clock" size={16} className="mr-2" />
                  {String(t('certifications.expires'))}: {cert.expiryDate}
                </div>
              )}
              {cert.credentialId && (
                <div className="certification-id">
                  <Icon name="id-card" size={16} className="mr-2" />
                  ID: {cert.credentialId}
                </div>
              )}
            </div>
            
            {cert.description && (
              <p className="certification-description">{cert.description}</p>
            )}
            
            {cert.skills && cert.skills.length > 0 && (
              <div className="certification-skills">
                <h4 className="skills-title">{String(t('certifications.skills'))}</h4>
                <div className="skills-tags">
                  {cert.skills.map((skill, index) => (
                    <Badge key={index} variant="primary" size="sm" className="skill-tag">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="certification-actions">
              {cert.verificationUrl && (
                <Button 
                  href={cert.verificationUrl} 
                  variant="outline" 
                  size="sm" 
                  className="verify-btn"
                >
                  <Icon name="external-link" size={16} className="mr-2" />
                  {String(t('certifications.verify'))}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
