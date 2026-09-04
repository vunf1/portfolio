/**
 * Follow an in-app href via the SPA when the user is doing a normal left-click.
 * Modifier-clicks and middle-click keep the real URL (open in new tab).
 */
export function shouldUseInAppNavigation(event: MouseEvent): boolean {
  if (event.defaultPrevented) {
    return false
  }
  if (event.button !== 0) {
    return false
  }
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false
  }
  return true
}

export function handleInternalPathClick(event: MouseEvent, navigate: () => void): void {
  if (!shouldUseInAppNavigation(event)) {
    return
  }
  event.preventDefault()
  navigate()
}
