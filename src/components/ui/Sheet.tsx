import { useEffect, useLayoutEffect } from 'preact/hooks'
import { createPortal } from 'preact/compat'
import type { ComponentChildren } from 'preact'
import { lockScroll, unlockScroll } from '../../lib/scrollLock'
import { useDebugId } from '../../lib/useDebugId'
import { cn } from '../../lib/utils'
import { Button } from './Button'
import { Icon } from './Icon'

export interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ComponentChildren
  side?: 'left' | 'right'
  className?: string
}

export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = 'right',
  className = ''
}: SheetProps) {
  const sheetBaseId = useDebugId('ui-sheet')
  const titleId = `${sheetBaseId}-title`

  /* useLayoutEffect: unlock runs in the same commit as close, before paint and before queued timeouts.
     useEffect cleanup can run after setTimeout(0), leaving body fixed while nav tries to scroll. */
  useLayoutEffect(() => {
    if (!open) {
      return
    }
    lockScroll()
    return () => {
      unlockScroll()
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }
    if (open) {
      window.addEventListener('keydown', onKey)
    }
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  if (!open || typeof document === 'undefined') {
    return null
  }

  /* Portal: escape page-transition overflow/transform contexts; z above FAB (~10k), below contact modal (~10002). */
  return createPortal(
    <div id={sheetBaseId} className={cn('fixed inset-0 z-[10001] flex', className)} data-scroll-lock-fixed>
      <button
        type="button"
        id={`${sheetBaseId}-backdrop`}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Close menu"
        onClick={() => onOpenChange(false)}
      />
      <div
        id={`${sheetBaseId}-panel`}
        className={cn(
          'relative flex h-full w-full max-w-sm flex-col bg-white shadow-xl outline-none',
          side === 'right' ? 'ml-auto border-l border-gray-200' : 'mr-auto border-r border-gray-200'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div
          id={`${sheetBaseId}-header`}
          className="flex items-center justify-between border-b border-gray-200 px-4 py-3"
        >
          <div className="min-w-0 pr-2">
            <h2 id={titleId} className="truncate text-lg font-semibold tracking-tight text-gray-900">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-sm text-gray-500">{description}</p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 w-9 shrink-0 rounded-md p-0 hover:bg-gray-100"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <Icon name="times" size={18} />
          </Button>
        </div>
        <div id={`${sheetBaseId}-body`} className="flex-1 overflow-y-auto overscroll-contain p-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
