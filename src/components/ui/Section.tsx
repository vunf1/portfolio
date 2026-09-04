import type { SectionProps } from '../../types/components'
import { useDebugId } from '../../lib/useDebugId'
import { cn } from '../../lib/utils'

export function Section({
  children,
  className = '',
  id,
  title,
  subtitle,
  variant = 'default',
  'data-section': dataSection
}: SectionProps) {
  const sectionId = useDebugId('ui-section', id)

  return (
    <section
      className={cn(
        'cv-section',
        variant === 'alternate' && 'cv-section--alt',
        variant === 'highlighted' && 'cv-section--accent',
        className
      )}
      id={sectionId}
      data-section={dataSection}
    >
      {(title || subtitle) && (
        <header className="cv-section__head">
          {title ? <h2 className="cv-section__title">{title}</h2> : null}
          {subtitle ? <p className="cv-section__subtitle">{subtitle}</p> : null}
        </header>
      )}
      <div className="cv-section__body">{children}</div>
    </section>
  )
}
