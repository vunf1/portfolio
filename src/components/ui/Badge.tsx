import type { BadgeProps } from '../../types/components'

export function Badge({ 
  children, 
  className = '', 
  id, 
  variant = 'primary',
  size = 'md'
}: BadgeProps) {
  const badgeClasses = [
    'badge',
    `badge-${variant}`,
    size !== 'md' && `badge-${size}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <span className={badgeClasses} id={id}>
      {children}
    </span>
  )
}

