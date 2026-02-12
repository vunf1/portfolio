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
        <div id="interests-content" className="interests-grid">
          {interests.map((interest, index) => (
            <div key={index} className="interest-item">
              <div className="interest-content">
                <div className="interest-header">
                  <div className="interest-icon">
                    <Icon name="heart" size={18} />
                  </div>
                  <h3 className="interest-title">{interest.category}</h3>
                </div>
                
                <p className="interest-description">{interest.description}</p>
                
                {interest.items && interest.items.length > 0 && (
                  <div className="interest-items">
                    <strong>Specific Interests:</strong>
                    <div className="interest-tags">
                      {interest.items.map((item, itemIndex) => (
                        <span key={itemIndex} className="interest-tag">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
    </Section>
  )
}




