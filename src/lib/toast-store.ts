/**
 * Simple toast notification store.
 * Subscribe to changes; call toast.success/error to add items.
 */

export interface ToastItem {
  id: string
  title: string
  description?: string
  type: 'default' | 'success' | 'error' | 'warning'
}

const toasts: ToastItem[] = []
const listeners: Array<() => void> = []
let idCounter = 0

function notify(): void {
  listeners.forEach((fn) => fn())
}

function addToast(item: Omit<ToastItem, 'id'>): void {
  const id = `toast-${++idCounter}-${Date.now()}`
  toasts.push({ ...item, id })
  notify()
}

export function getToasts(): ToastItem[] {
  return [...toasts]
}

export function subscribe(fn: () => void): () => void {
  listeners.push(fn)
  return () => {
    const i = listeners.indexOf(fn)
    if (i >= 0) {listeners.splice(i, 1)}
  }
}

export const toast = {
  success(title: string, description?: string): void {
    addToast({ title, description, type: 'success' })
  },
  error(title: string, description?: string): void {
    addToast({ title, description, type: 'error' })
  },
  warning(title: string, description?: string): void {
    addToast({ title, description, type: 'warning' })
  },
  default(title: string, description?: string): void {
    addToast({ title, description, type: 'default' })
  }
}
