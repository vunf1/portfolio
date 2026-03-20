import type { Ref } from 'preact'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonProps as BaseButtonProps } from '../../types/components'
import { useDebugId } from '../../lib/useDebugId'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-tight no-underline transition-[transform,box-shadow,background-color,border-color,color,filter] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-b from-primary to-primary-dark text-white shadow-button hover:shadow-button-hover hover:brightness-[1.03]',
        secondary:
          'bg-transparent text-gray-800 shadow-sm',
        outline:
          'bg-transparent text-primary shadow-button-outline border border-primary/20 hover:border-primary/35 hover:bg-primary/[0.04]',
        ghost:
          'bg-transparent text-gray-700 hover:text-gray-900',
        destructive:
          'bg-gradient-to-b from-danger to-red-800 text-white shadow-button-danger hover:shadow-button-danger-hover hover:brightness-[1.03]',
        link:
          'text-primary bg-transparent shadow-none underline underline-offset-4 active:scale-100 font-medium hover:brightness-110',
        primaryElevated:
          'rounded-xl border border-white/15 bg-gradient-to-b from-primary to-primary-dark text-white shadow-button-elevated hover:shadow-button-elevated-hover hover:brightness-[1.03]',
        outlineElevated:
          'rounded-xl border border-primary/25 bg-white/75 text-primary shadow-sm backdrop-blur-sm hover:border-primary/40 hover:bg-white/90 hover:shadow-md'
      },
      size: {
        sm: 'h-8 px-4 text-sm rounded-md',
        md: 'h-10 px-5 text-sm rounded-lg',
        lg: 'h-12 px-6 text-base rounded-xl'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

type ButtonProps = BaseButtonProps & VariantProps<typeof buttonVariants> & { ref?: Ref<HTMLButtonElement> }

export function Button({
  children,
  className = '',
  id,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  onMouseEnter,
  onFocus,
  onTouchStart,
  type = 'button',
  form,
  href,
  target,
  rel,
  ref,
  ...rest
}: ButtonProps) {
  const btnId = useDebugId('ui-button', id)
  const handleClick = (event: MouseEvent) => {
    if (disabled || loading) {
      return
    }
    onClick?.(event)
  }

  const classes = cn(
    buttonVariants({ variant, size }),
    (disabled || loading) && 'opacity-50 cursor-not-allowed',
    className
  )

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={classes}
        id={btnId}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        onTouchStart={onTouchStart}
        {...rest}
      >
        {loading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
        {children}
      </a>
    )
  }

  return (
    <button
      ref={ref}
      type={type}
      form={form}
      className={classes}
      id={btnId}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      onTouchStart={onTouchStart}
      {...rest}
    >
      {loading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  )
}
