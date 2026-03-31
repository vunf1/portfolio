/**
 * Stack-based scroll lock for overlays (modals, sheets).
 * Uses `position: fixed` on `body` so the background does not scroll on mobile
 * (`overflow: hidden` on `body` is unreliable across WebKit/Android).
 */
let lockCount = 0
let savedScrollY = 0

export function lockScroll(): void {
  if (typeof document === 'undefined') {
    return
  }
  lockCount += 1
  if (lockCount !== 1) {
    return
  }
  savedScrollY = window.scrollY
  const { body } = document
  body.style.position = 'fixed'
  body.style.top = `-${savedScrollY}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.width = '100%'
}

export function unlockScroll(): void {
  if (typeof document === 'undefined') {
    return
  }
  if (lockCount === 0) {
    return
  }
  lockCount -= 1
  if (lockCount !== 0) {
    return
  }
  const { body } = document
  body.style.position = ''
  body.style.top = ''
  body.style.left = ''
  body.style.right = ''
  body.style.width = ''
  try {
    window.scrollTo(0, savedScrollY)
  } catch {
    /* JSDOM and some test envs do not implement scrollTo */
  }
}

/** Clears lock counter and body inline styles. Use in test `beforeEach` / `afterEach`. */
export function resetScrollLockForTests(): void {
  if (typeof document === 'undefined') {
    return
  }
  lockCount = 0
  savedScrollY = 0
  const { body } = document
  body.style.position = ''
  body.style.top = ''
  body.style.left = ''
  body.style.right = ''
  body.style.width = ''
}
