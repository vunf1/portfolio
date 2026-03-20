import { useId } from 'preact/hooks'

/**
 * Stable DOM id for debugging / DevTools. Returns `explicitId` when non-empty;
 * otherwise `${prefix}-${useId()}` (unique per component instance).
 */
export function useDebugId(prefix: string, explicitId?: string | undefined): string {
  const uid = useId()
  if (explicitId !== undefined && explicitId !== '') {
    return explicitId
  }
  return `${prefix}-${uid}`
}
