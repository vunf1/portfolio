import type { GridProps } from '../../types/components'

export function Grid({ 
  children, 
  className = '', 
  id, 
  cols = 1,
  gap = 'md',
  responsive = true
}: GridProps) {
  const gridClasses = [
    'grid',
    `grid-cols-${cols}`,
    gap !== 'md' && `gap-${gap}`,
    responsive && 'grid-responsive',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={gridClasses} id={id}>
      {children}
    </div>
  )
}

