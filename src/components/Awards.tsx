import { useTranslation } from '../contexts/TranslationContext'
import { Section, Icon, Button } from './ui'
import type { AwardsProps } from '../types'

export function Awards({ awards }: AwardsProps) {
  const { t } = useTranslation()
  
  return (
    <Section 
      id="awards" 
      data-section="awards"
      title={String(t('awards.title'))} 
      subtitle={String(t('awards.subtitle'))}
    >
        <div id="awards-content" className="awards-grid">
          {awards.map((award, index) => (
            <div key={index} className="award-item">
              <div className="award-content">
                <div className="award-header">
                  <div className="award-icon">
                    <Icon name="trophy" size={20} />
                  </div>
                  <h3 className="award-title">{award.title}</h3>
                </div>
                
                <div className="award-meta">
                  <span className="award-issuer">{award.issuer}</span>
                  {award.date && (
                    <span className="award-date">• {award.date}</span>
                  )}
                </div>
                
                {award.description && (
                  <p className="award-description">{award.description}</p>
                )}
                
                {award.criteria && (
                  <div className="award-criteria">
                    <strong>Criteria:</strong>
                    <p>{award.criteria}</p>
                  </div>
                )}
                
                {award.impact && (
                  <div className="award-impact">
                    <strong>Impact:</strong>
                    <p>{award.impact}</p>
                  </div>
                )}
                
                {award.certificateUrl && (
                  <div className="award-actions">
                    <Button
                      href={award.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      size="sm"
                    >
                      <Icon name="certificate" size={14} className="mr-1" />
                      View Certificate
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
    </Section>
  )
}
