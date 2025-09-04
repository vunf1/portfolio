import type { SectionProps } from '../../types/components'

export function Section({ 
  children, 
  className = '', 
  id, 
  title, 
  subtitle, 
  variant = 'default' 
}: SectionProps) {
  const sectionClasses = [
    'section',
    variant !== 'default' && `section-${variant}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <section className={sectionClasses} id={id}>
      {(title || subtitle) && (
        <div className="section-header">
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  )
}

