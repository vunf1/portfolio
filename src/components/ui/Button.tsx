import type { Ref } from 'preact'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonProps as BaseButtonProps } from '../../types/components'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-tight underline underline-offset-4 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline-none focus-visible:brightness-110 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98] select-none hover:scale-[1.02]',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-b from-primary to-primary-dark text-white shadow-button hover:shadow-button-hover hover:brightness-110',
        secondary:
          'bg-transparent text-gray-800 shadow-sm',
        outline:
          'bg-transparent text-primary shadow-button-outline',
        ghost:
          'bg-transparent text-gray-700 hover:text-gray-900',
        destructive:
          'bg-gradient-to-b from-danger to-red-800 text-white shadow-button-danger hover:shadow-button-danger-hover hover:brightness-110',
        link:
          'text-primary bg-transparent shadow-none active:scale-100 font-medium hover:scale-100',
        primaryElevated:
          'rounded-xl bg-gradient-to-b from-primary to-primary-dark text-white shadow-button-elevated hover:shadow-button-elevated-hover hover:-translate-y-0.5 hover:brightness-110 hover:scale-[1.02]',
        outlineElevated:
          'rounded-xl bg-transparent text-primary shadow-button-elevated hover:shadow-button-elevated-hover hover:-translate-y-0.5 hover:brightness-110 hover:scale-[1.02]'
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
  href,
  target,
  rel,
  ref
}: ButtonProps) {
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
        id={id}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        onTouchStart={onTouchStart}
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
      className={classes}
      id={id}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      onTouchStart={onTouchStart}
    >
      {loading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  )
}
