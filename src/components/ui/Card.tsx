import { cva, type VariantProps } from 'class-variance-authority'
import type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps as BaseCardProps,
  CardTitleProps
} from '../../types/components'
import { useDebugId } from '../../lib/useDebugId'
import { cn } from '../../lib/utils'

const cardVariants = cva(
  'rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm',
  {
    variants: {
      variant: {
        default: 'border-gray-200',
        elevated: 'border-gray-200/80 shadow-lg',
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
  hover = true,
  flush = false
}: CardProps) {
  const rootId = useDebugId('ui-card', id)
  return (
    <div
      className={cn(
        cardVariants({ variant }),
        hover && 'transition-shadow hover:shadow-md',
        className
      )}
      id={rootId}
    >
      {(title || subtitle) && (
        <div className="border-b border-gray-200 px-6 py-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      {flush ? children : <div className="p-6">{children}</div>}
    </div>
  )
}

/**
 * shadcn/ui-style card layout primitives (Preact; no Radix Slot — use `as` on title/description when needed).
 */
export function CardHeader({ className = '', id, children }: CardHeaderProps) {
  const headerId = useDebugId('ui-card-header', id)
  return (
    <div
      id={headerId}
      className={cn(
        'flex w-full flex-col items-center justify-center gap-1.5 p-6 text-center',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardTitle({ as, className = '', id, children }: CardTitleProps) {
  const Tag = as ?? 'h3'
  const titleId = useDebugId('ui-card-title', id)
  return (
    <Tag
      id={titleId}
      className={cn('text-2xl font-semibold leading-none tracking-tight text-gray-900', className)}
    >
      {children}
    </Tag>
  )
}

export function CardDescription({ as, className = '', id, children }: CardDescriptionProps) {
  const Tag = as ?? 'p'
  const descId = useDebugId('ui-card-description', id)
  return (
    <Tag id={descId} className={cn('text-sm text-gray-500', className)}>
      {children}
    </Tag>
  )
}

export function CardContent({ className = '', id, children }: CardContentProps) {
  const contentId = useDebugId('ui-card-content', id)
  return (
    <div id={contentId} className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ className = '', id, children }: CardFooterProps) {
  const footerId = useDebugId('ui-card-footer', id)
  return (
    <div id={footerId} className={cn('flex items-center p-6 pt-0', className)}>
      {children}
    </div>
  )
}
