import { cva, type VariantProps } from 'class-variance-authority'
import type { CardProps as BaseCardProps } from '../../types/components'
import { cn } from '../../lib/utils'

const cardVariants = cva(
  'rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm',
  {
    variants: {
      variant: {
        default: 'border-gray-200',
        elevated: 'shadow-md border-0',
        outlined: 'border-2 border-gray-300'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

type CardProps = BaseCardProps & VariantProps<typeof cardVariants>

export function Card({
  children,
  className = '',
  id,
  title,
  subtitle,
  variant = 'default',
  hover = true
}: CardProps) {
  return (
    <div
      className={cn(
        cardVariants({ variant }),
        hover && 'transition-shadow hover:shadow-md',
        className
      )}
      id={id}
    >
      {(title || subtitle) && (
        <div className="border-b border-gray-200 px-6 py-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}
