/**
 * Scroll to a portfolio section by id.
 * Uses scrollIntoView + CSS scroll-margin on `.section` / `#experience` so alignment matches the sticky nav.
 * Falls back to manual math if scrollIntoView is unavailable.
 */
export function scrollToPortfolioSection(
  sectionId: string,
  options?: { navHeight?: number; offset?: number }
): boolean {
  const navHeight = options?.navHeight ?? 64
  const offset = options?.offset ?? 12

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const tryOnce = (): boolean => {
    let element = document.getElementById(sectionId)
    if (!element) {
      element = document.querySelector(`section[id="${sectionId}"]`)
    }
    if (!element) {
      element = document.querySelector(`[data-section="${sectionId}"]`)
    }
    if (!element) {
      const sections = document.querySelectorAll('section')
      for (const section of sections) {
        if (section.id === sectionId) {
          element = section
          break
        }
      }
    }

    if (element) {
      if (typeof element.scrollIntoView === 'function') {
        element.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        })
      } else {
        const top = element.getBoundingClientRect().top + window.scrollY - navHeight - offset
        window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      }
      return true
    }
    return false
  }

  if (tryOnce()) {
    return true
  }

  let attempts = 0
  const maxAttempts = 10
  const retry = () => {
    attempts++
    if (tryOnce()) {
      return
    }
    if (attempts >= maxAttempts) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setTimeout(retry, attempts * 100)
  }
  setTimeout(retry, 50)
  return false
}
