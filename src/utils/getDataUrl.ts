/**
 * Builds data URLs for fetch, respecting Vite base path.
 * Fixes JSON.parse errors when relative ./data paths resolve to 404 HTML instead of JSON.
 */

const BASE = (typeof import.meta !== 'undefined' && (import.meta.env?.BASE_URL as string)) || '/'
const BASE_NORM = BASE.endsWith('/') ? BASE : BASE + '/'

/** Returns URL for a data file (e.g. data/en/personal.json) */
export function getDataUrl(language: string, filename: string): string {
  const path = `data/${language}/${filename}`.replace(/\/+/g, '/')
  if (typeof window !== 'undefined') {
    return new URL(path, window.location.origin + BASE_NORM).href
  }
  return BASE_NORM + path
}
