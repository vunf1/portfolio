/**
 * Stack-based scroll lock for overlays (modals, sheets).
 * Uses `position: fixed` on `body` so the background does not scroll on mobile
 * (`overflow: hidden` on `body` is unreliable across WebKit/Android).
 *
 * **Layout shift (horizontal):** Vertical scroll lives on `html` (see `base.css`). Fixing `body`
 * removes overflow from the scroll root, so the classic scrollbar can disappear and the layout
 * viewport widens by ~15–17px — the page behind the modal would jump right without compensation.
 * We measure `innerWidth - documentElement.clientWidth` **before** fixing the body and apply matching
 * `padding-right` on `body` (in-flow content) plus `html[data-scroll-locked]` + `--scrollbar-compensation`
 * for `position: fixed` chrome (`#portfolio-nav` uses the viewport as CB, so it ignores body padding).
 * **Do not** combine this with `scrollbar-gutter: stable` on `html`: that already reserves gutter space,
 * so the same padding would double-inset and shift content left when a modal opens.
 *
 * **Restore contract:** `html { scroll-behavior: smooth }` (see `src/css/base.css`) applies to
 * user-driven navigation. Per CSSOM, `window.scrollTo({ behavior: 'auto' })` still consults that
 * property and may **animate** restoration — same “top then smooth scroll back” bug. Fix: temporarily
 * set `document.documentElement.style.scrollBehavior = 'auto'` around the programmatic `scrollTo`,
 * then restore the previous inline value (or remove the property) so nav/anchors keep smooth scroll.
 */
let lockCount = 0
let savedScrollY = 0
/** Inline `padding-right` on `body` before this lock session applied compensation; unset if w===0 */
let savedBodyPaddingRight: string | undefined

function clearScrollLockLayoutMarkers(): void {
  const html = document.documentElement
  html.removeAttribute('data-scroll-locked')
  html.style.removeProperty('--scrollbar-compensation')
}

export function lockScroll(): void {
  if (typeof document === 'undefined') {
    return
  }
  lockCount += 1
  if (lockCount !== 1) {
    return
  }
  savedScrollY = window.scrollY || document.documentElement.scrollTop
  const { body } = document
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  if (scrollbarWidth > 0) {
    savedBodyPaddingRight = body.style.paddingRight
    body.style.paddingRight = `${scrollbarWidth}px`
    const html = document.documentElement
    html.setAttribute('data-scroll-locked', '')
    html.style.setProperty('--scrollbar-compensation', `${scrollbarWidth}px`)
  } else {
    savedBodyPaddingRight = undefined
  }
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
  const html = document.documentElement
  const previousInlineScrollBehavior = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'
  try {
    window.scrollTo({ left: 0, top: savedScrollY, behavior: 'auto' })
  } catch {
    /* JSDOM and some test envs do not implement scrollTo */
  } finally {
    if (previousInlineScrollBehavior) {
      html.style.scrollBehavior = previousInlineScrollBehavior
    } else {
      html.style.removeProperty('scroll-behavior')
    }
  }
  /* After scroll restoration: drop compensation so width matches the restored scrollbar state */
  if (savedBodyPaddingRight !== undefined) {
    const prevPadding = savedBodyPaddingRight
    savedBodyPaddingRight = undefined
    if (prevPadding === '') {
      body.style.removeProperty('padding-right')
    } else {
      body.style.paddingRight = prevPadding
    }
    clearScrollLockLayoutMarkers()
  }
}

/** Clears lock counter and body inline styles. Use in test `beforeEach` / `afterEach`. */
export function resetScrollLockForTests(): void {
  if (typeof document === 'undefined') {
    return
  }
  lockCount = 0
  savedScrollY = 0
  savedBodyPaddingRight = undefined
  clearScrollLockLayoutMarkers()
  const { body } = document
  body.style.position = ''
  body.style.top = ''
  body.style.left = ''
  body.style.right = ''
  body.style.width = ''
  body.style.removeProperty('padding-right')
}
