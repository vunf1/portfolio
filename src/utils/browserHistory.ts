/**
 * Path-based browser history for preact-router.
 * Uses HTML5 History API: / (landing), /portfolio, /portfolio/experience.
 */

import type { CustomHistory, Location } from 'preact-router'
import {
  isValidRoute,
  ROUTE_404,
  ROUTE_LANDING
} from '../config/routes'

function getBase(): string {
  const base = (typeof import.meta !== 'undefined' && (import.meta.env?.BASE_URL as string)) || '/'
  return base.endsWith('/') ? base : base + '/'
}

/** Get current route from pathname (pathname relative to base). */
function pathnameToRoute(pathname: string): string {
  const base = getBase()
  const pathNorm = (pathname || '/').replace(/\/+/g, '/').replace(/\/$/, '') || '/'
  const baseNorm = base.replace(/\/+/g, '/').replace(/\/$/, '') || ''
  if (!baseNorm || baseNorm === '/') {
    return pathNorm || ROUTE_LANDING
  }
  const basePrefix = '/' + baseNorm
  if (pathNorm === basePrefix || pathNorm === basePrefix + '/') {
    return ROUTE_LANDING
  }
  if (pathNorm.startsWith(basePrefix + '/')) {
    const route = pathNorm.slice(basePrefix.length) || '/'
    return route.startsWith('/') ? route : '/' + route
  }
  return pathNorm || ROUTE_LANDING
}

/** Convert route to full pathname for URL. */
function routeToPathname(route: string): string {
  const base = getBase()
  const r = route.replace(/^\/+/, '').replace(/\/+$/, '') || ''
  const baseClean = base.replace(/\/+$/, '') || ''
  if (!baseClean || baseClean === '/') {
    return r ? '/' + r : '/'
  }
  return baseClean + (r ? '/' + r : '')
}

/** Replace current URL with /404 path (no hash). */
function replaceWith404(): void {
  if (typeof window === 'undefined') {return}
  const base = getBase()
  const path = base.replace(/\/+$/, '') || '/'
  const url = path === '/' ? '/404' : path + '/404'
  window.history.replaceState(null, '', window.location.origin + url)
}

export function getPathFromLocation(): string {
  if (typeof window === 'undefined') {return ROUTE_LANDING}
  const pathname = window.location.pathname || '/'
  const route = pathnameToRoute(pathname)
  if (route === '/404') {return ROUTE_404}
  if (!isValidRoute(route)) {
    replaceWith404()
    return ROUTE_404
  }
  return route
}

function parseLocation(): Location {
  const pathname = getPathFromLocation()
  const searchIdx = pathname.indexOf('?')
  if (searchIdx >= 0) {
    return { pathname: pathname.slice(0, searchIdx), search: pathname.slice(searchIdx) }
  }
  return { pathname, search: '' }
}

export function createBrowserHistory(): CustomHistory {
  const listeners: Array<(loc: Location) => void> = []

  function notify(): void {
    listeners.forEach((cb) => cb(parseLocation()))
  }

  function listen(callback: (location: Location) => void): () => void {
    listeners.push(callback)
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', notify)
    }
    return () => {
      const idx = listeners.indexOf(callback)
      if (idx >= 0) {listeners.splice(idx, 1)}
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', notify)
      }
    }
  }

  function push(path: string): void {
    if (typeof window === 'undefined') {return}
    if (path === ROUTE_404 || !isValidRoute(path)) {
      replaceWith404()
      notify()
      return
    }
    const pathname = routeToPathname(path)
    window.history.pushState(null, '', window.location.origin + pathname)
    notify()
  }

  function replace(path: string): void {
    if (typeof window === 'undefined') {return}
    if (path === ROUTE_404 || !isValidRoute(path)) {
      replaceWith404()
      notify()
      return
    }
    const pathname = routeToPathname(path)
    window.history.replaceState(null, '', window.location.origin + pathname)
    notify()
  }

  return {
    listen,
    get location(): Location {
      return parseLocation()
    },
    push,
    replace
  }
}
