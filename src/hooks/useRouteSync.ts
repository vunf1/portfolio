/**
 * Synchronizes app view state with the current route (path-based).
 * Handles direct links, browser back/forward, and programmatic navigation.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { getPathFromLocation } from '../utils/browserHistory'
import { isPortfolioPath, ROUTE_404 } from '../config/routes'

export interface UseRouteSyncOptions {
  /** Ignore route changes while a transition is in progress */
  isTransitioning?: boolean
}

export interface UseRouteSyncResult {
  showPortfolio: boolean
  setShowPortfolio: (value: boolean | ((prev: boolean) => boolean)) => void
  hasVisitedPortfolioRef: { current: boolean }
  initialPath: string
  is404: boolean
}

/**
 * Keeps showPortfolio in sync with the path-based route.
 * Handles direct links, browser back/forward, and ignores changes during transitions.
 */
export function useRouteSync(options: UseRouteSyncOptions = {}): UseRouteSyncResult {
  const { isTransitioning = false } = options
  const initialPath = useMemo(() => getPathFromLocation(), [])
  const initialOnPortfolio = useMemo(() => isPortfolioPath(initialPath), [initialPath])
  const initialIs404 = useMemo(() => initialPath === ROUTE_404, [initialPath])

  const [showPortfolio, setShowPortfolio] = useState(initialOnPortfolio)
  const [is404, setIs404] = useState(initialIs404)
  const hasVisitedPortfolioRef = useRef(initialOnPortfolio)

  const syncFromLocation = useCallback(() => {
    const path = getPathFromLocation()
    setIs404(path === ROUTE_404)
    if (path === ROUTE_404) {return}
    const onPortfolio = isPortfolioPath(path)
    setShowPortfolio((prev) => {
      if (prev === onPortfolio || isTransitioning) {return prev}
      if (onPortfolio) {hasVisitedPortfolioRef.current = true}
      return onPortfolio
    })
  }, [isTransitioning])

  useEffect(() => {
    window.addEventListener('popstate', syncFromLocation)
    return () => window.removeEventListener('popstate', syncFromLocation)
  }, [syncFromLocation])

  return {
    showPortfolio,
    setShowPortfolio,
    hasVisitedPortfolioRef,
    initialPath,
    is404
  }
}
