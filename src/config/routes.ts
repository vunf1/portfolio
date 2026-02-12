/**
 * Single source of truth for routing.
 * Path-based: / (landing), /portfolio, /portfolio/experience.
 */

/** Root route – landing page */
export const ROUTE_LANDING = '/' as const

/** Portfolio route – full CV/portfolio view */
export const ROUTE_PORTFOLIO = '/portfolio' as const

/** Portfolio section path prefix (e.g. /portfolio/experience) */
export const ROUTE_PORTFOLIO_SECTION = '/portfolio/' as const

/** preact-router catch-all path pattern */
export const ROUTE_MATCH_ALL = '/:rest*' as const

/** Internal 404 route – shown in-app, never redirects to .html */
export const ROUTE_404 = '/404' as const

/** Path segment for portfolio (no leading /) */
export const HASH_PORTFOLIO = 'portfolio' as const

export type AppRoute = typeof ROUTE_LANDING | typeof ROUTE_PORTFOLIO | `${typeof ROUTE_PORTFOLIO_SECTION}${string}`

/** Reject segments that are clearly invalid */
const INVALID_SEGMENTS = new Set(['undefined', 'null', ''])

/** Whether the hash segment (after #) represents a valid route */
export function isValidHashSegment(segment: string): boolean {
  const trimmed = segment.trim()
  if (!trimmed) return true
  const parts = trimmed.split('/').map((p) => p.trim())
  if (parts.some((p) => INVALID_SEGMENTS.has(p.toLowerCase()))) return false
  const path = hashSegmentToPath(trimmed)
  return isValidRoute(path)
}

/** Whether the path is valid (landing or portfolio[/section]) */
export function isValidRoute(path: string): boolean {
  const normalized = normalizePath(path)
  if (normalized === ROUTE_LANDING) return true
  if (normalized === ROUTE_PORTFOLIO) return true
  return normalized.startsWith(ROUTE_PORTFOLIO_SECTION)
}

/** Whether the given path denotes the portfolio view */
export function isPortfolioPath(path: string): boolean {
  const normalized = normalizePath(path)
  return normalized === ROUTE_PORTFOLIO || normalized.startsWith(ROUTE_PORTFOLIO_SECTION)
}

/** Normalize path: leading slash, collapse slashes */
export function normalizePath(path: string): string {
  if (path == null || typeof path !== 'string') return ROUTE_LANDING
  const trimmed = path.trim().replace(/\/+/g, '/').replace(/\/$/, '')
  if (!trimmed || trimmed === '/') return ROUTE_LANDING
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

/** Convert path to hash segment (no # or /) */
export function pathToHashSegment(path: string): string {
  const normalized = normalizePath(path)
  if (normalized === ROUTE_LANDING) return ''
  return normalized.startsWith('/') ? normalized.slice(1) : normalized
}

/** Parse hash segment to normalized path */
export function hashSegmentToPath(segment: string): string {
  if (segment == null || typeof segment !== 'string') return ROUTE_LANDING
  const trimmed = segment.trim()
  if (!trimmed) return ROUTE_LANDING
  return normalizePath(trimmed)
}

/** Build portfolio route */
export function toPortfolioRoute(section?: string): string {
  if (!section || !section.trim()) return ROUTE_PORTFOLIO
  const seg = section.trim().replace(/^\/+|\/+$/g, '')
  return seg ? `${ROUTE_PORTFOLIO}/${seg}` : ROUTE_PORTFOLIO
}

/** Build landing route */
export function toLandingRoute(): string {
  return ROUTE_LANDING
}

/** Build full pathname for a route (for href, respects base path). */
export function toFullPath(route: string): string {
  const base = (typeof import.meta !== 'undefined' && (import.meta.env?.BASE_URL as string)) || '/'
  const baseClean = base.replace(/^\/+|\/+$/g, '') || ''
  const r = (route || '/').replace(/^\/+/, '').replace(/\/+$/, '') || ''
  if (!baseClean || baseClean === '/') {
    return r ? '/' + r : '/'
  }
  return '/' + baseClean + (r ? '/' + r : '')
}

/** Whether the document pathname is valid for the app (/, /portfolio, /portfolio/* serve the app) */
export function isValidPathname(pathname: string): boolean {
  const base = (typeof import.meta !== 'undefined' && (import.meta.env?.BASE_URL as string)) || '/'
  const baseNorm = base.replace(/^\/+|\/+$/g, '') || ''
  const pathNorm = (pathname || '/').replace(/\/+/g, '/').replace(/\/$/, '') || '/'

  if (baseNorm === '' || baseNorm === '/') {
    if (pathNorm === '' || pathNorm === '/' || pathNorm === '/index.html') return true
    if (pathNorm === '/portfolio' || pathNorm.startsWith('/portfolio/')) return true
    return false
  }
  const basePrefix = '/' + baseNorm
  if (pathNorm === basePrefix || pathNorm === basePrefix + '/' || pathNorm === basePrefix + '/index.html') return true
  if (pathNorm === basePrefix + '/portfolio' || pathNorm.startsWith(basePrefix + '/portfolio/')) return true
  return false
}

/** Whether pathname is invalid (should show in-app 404, no redirect to .html). */
export function isPathnameInvalid(pathname?: string): boolean {
  if (typeof window === 'undefined') return false
  const p = pathname ?? window.location.pathname ?? '/'
  return !isValidPathname(p)
}
