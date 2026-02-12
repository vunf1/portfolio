import { useEffect, useState } from 'preact/hooks'
import { useTranslation } from '../../contexts/TranslationContext'
import { getToasts, subscribe, type ToastItem } from '../../lib/toast-store'
import { cn } from '../../lib/utils'
import { Icon } from './Icon'

/**
 * Renders toast notifications (shadcn/Sonner-style).
 * Mount once in App; use toast.success(), toast.error(), toast() from anywhere.
 */
export function Toaster() {
  const { t } = useTranslation()
  const [items, setItems] = useState<ToastItem[]>(getToasts)

  useEffect(() => {
    const unsub = subscribe(() => setItems(getToasts()))
    return unsub
  }, [])

  if (items.length === 0) {
    return null
  }

  return (
    <div
      className="fixed bottom-0 right-0 z-[1080] flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-[420px]"
      role="region"
      aria-label={t('common.notifications')}
    >
      {items.map((item) => (
        <ToastCard key={item.id} item={item} />
      ))}
    </div>
  )
}

function ToastCard({ item }: { item: ToastItem }) {
  const typeStyles = {
    default: 'border-gray-200 bg-white text-gray-900 shadow-lg',
    success: 'border-green-200 bg-green-50 text-green-900 shadow-lg',
    error: 'border-red-200 bg-red-50 text-red-900 shadow-lg',
    warning: 'border-amber-200 bg-amber-50 text-amber-900 shadow-lg'
  }
  const iconMap = {
    default: null,
    success: 'check-circle' as const,
    error: 'exclamation-circle' as const,
    warning: 'info-circle' as const
  }
  const style = typeStyles[item.type as keyof typeof typeStyles] ?? typeStyles.default
  const icon = iconMap[item.type as keyof typeof iconMap]

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 transition-all duration-200',
        style
      )}
      role="status"
      aria-live="polite"
    >
      {icon && (
        <span className="shrink-0 pt-0.5">
          <Icon name={icon} size={18} aria-hidden />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-medium">{item.title}</p>
        {item.description && (
          <p className="mt-1 text-sm opacity-90">{item.description}</p>
        )}
      </div>
    </div>
  )
}
