import type { BaseComponentProps } from '../../types/components'
import { useDebugId } from '../../lib/useDebugId'
import { cn } from '../../lib/utils'

interface SeparatorProps extends BaseComponentProps {
  orientation?: 'horizontal' | 'vertical'
}

export function Separator({
  orientation = 'horizontal',
  className = '',
  id
}: SeparatorProps) {
  const sepId = useDebugId('ui-separator', id)
  return (
    <div
      id={sepId}
      role="separator"
      aria-orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
      className={cn(
        'shrink-0 bg-gray-200',
        orientation === 'vertical' ? 'mx-2 h-6 w-px' : 'my-2 h-px w-full',
        className
      )}
    />
  )
}
