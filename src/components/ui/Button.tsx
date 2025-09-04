import type { ButtonProps } from '../../types/components'

export function Button({ 
  children, 
  className = '', 
  id, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  href,
  target,
  rel
}: ButtonProps) {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    size !== 'md' && `btn-${size}`,
    disabled && 'btn-disabled',
    loading && 'btn-loading',
    className
  ].filter(Boolean).join(' ')

  const handleClick = (event: MouseEvent) => {
    if (disabled || loading) {
      return
    }
    onClick?.(event)
  }

  if (href) {
    return (
      <a 
        href={href}
        target={target}
        rel={rel}
        className={buttonClasses}
        id={id}
        onClick={handleClick}
      >
        {loading && <span className="btn-spinner" />}
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      id={id}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading && <span className="btn-spinner" />}
      {children}
    </button>
  )
}

