import { useTranslation } from '../contexts/TranslationContext'
import { Section, Card } from './ui'
import type { EducationProps } from '../types/components'

export function Education({ education, className = '', id }: EducationProps) {
  const { t } = useTranslation()
  
  if (!education || education.length === 0) {
    return null
  }

  return (
    <Section 
      id={id || 'education'} 
      className={className} 
      title={String(t('education.title'))} 
      subtitle={String(t('education.subtitle'))}
    >
      <div className="education-grid">
        {education.map((edu) => (
          <Card 
            key={edu.id || `edu-${edu.institution}`} 
            title={edu.degree} 
            subtitle={edu.institution} 
            className="education-card"
          >
            {edu.description && (
              <p className="education-description">{edu.description}</p>
            )}
          </Card>
        ))}
      </div>
    </Section>
  )
}
