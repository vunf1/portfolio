import type { SectionProps } from '../../types/components'
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
  return (
    <section
      className={cn(
        'py-16',
        variant === 'alternate' && 'bg-gray-50',
        variant === 'highlighted' && 'bg-primary/5',
        className
      )}
      id={id}
      data-section={dataSection}
    >
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>}
          {subtitle && <p className="section-subtitle text-center text-lg text-gray-600 max-w-[600px] mx-auto">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  )
}
