import { cva, type VariantProps } from 'class-variance-authority'
import type { BadgeProps as BaseBadgeProps } from '../../types/components'
import { useDebugId } from '../../lib/useDebugId'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white',
        secondary: 'bg-secondary text-white',
        outline:
          'border border-primary/25 bg-primary/[0.06] text-primary shadow-sm',
        success: 'bg-success text-white',
        warning: 'bg-warning text-gray-900',
        danger: 'bg-danger text-white'
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

type BadgeProps = BaseBadgeProps & VariantProps<typeof badgeVariants>

export function Badge({
  children,
  className = '',
  id,
  variant = 'primary',
  size = 'md'
}: BadgeProps) {
  const badgeId = useDebugId('ui-badge', id)
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} id={badgeId}>
      {children}
    </span>
  )
}
