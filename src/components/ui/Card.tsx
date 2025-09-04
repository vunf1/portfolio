import type { CardProps } from '../../types/components'

export function Card({ 
  children, 
  className = '', 
  id, 
  title, 
  subtitle, 
  variant = 'default',
  hover = true
}: CardProps) {
  const cardClasses = [
    'card',
    variant !== 'default' && `card-${variant}`,
    hover && 'card-hover',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClasses} id={id}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  )
}

