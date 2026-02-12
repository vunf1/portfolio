import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  isValidPathname,
  isPathnameInvalid,
  isValidRoute,
  isValidHashSegment,
} from '../routes'

describe('routes', () => {
  describe('isValidPathname', () => {
    const originalBaseUrl = import.meta.env.BASE_URL

    afterEach(() => {
      ;(import.meta.env as { BASE_URL?: string }).BASE_URL = originalBaseUrl
    })

    it('accepts / with base /', () => {
      ;(import.meta.env as { BASE_URL?: string }).BASE_URL = '/'
      expect(isValidPathname('/')).toBe(true)
      expect(isValidPathname('')).toBe(true)
      expect(isValidPathname('/index.html')).toBe(true)
    })

    it('rejects /p/ with base /', () => {
      ;(import.meta.env as { BASE_URL?: string }).BASE_URL = '/'
      expect(isValidPathname('/p/')).toBe(false)
      expect(isValidPathname('/p')).toBe(false)
      expect(isValidPathname('/foo')).toBe(false)
      expect(isValidPathname('/foo/bar')).toBe(false)
    })

    it('accepts /portfolio and /portfolio/* with base /', () => {
      ;(import.meta.env as { BASE_URL?: string }).BASE_URL = '/'
      expect(isValidPathname('/portfolio')).toBe(true)
      expect(isValidPathname('/portfolio/')).toBe(true)
      expect(isValidPathname('/portfolio/experience')).toBe(true)
    })

    it('accepts /portfolio with base /portfolio/', () => {
      ;(import.meta.env as { BASE_URL?: string }).BASE_URL = '/portfolio/'
      expect(isValidPathname('/portfolio')).toBe(true)
      expect(isValidPathname('/portfolio/')).toBe(true)
      expect(isValidPathname('/portfolio/index.html')).toBe(true)
    })

    it('rejects /portfolio/p/ with base /portfolio/', () => {
      ;(import.meta.env as { BASE_URL?: string }).BASE_URL = '/portfolio/'
      expect(isValidPathname('/portfolio/p')).toBe(false)
      expect(isValidPathname('/portfolio/p/')).toBe(false)
      expect(isValidPathname('/portfolio/xyz')).toBe(false)
    })
  })

  describe('isPathnameInvalid', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/', origin: 'http://localhost:3000' },
        writable: true,
      })
    })

    it('returns false when pathname is valid', () => {
      ;(import.meta.env as { BASE_URL?: string }).BASE_URL = '/'
      ;(window as { location?: { pathname: string } }).location!.pathname = '/'
      expect(isPathnameInvalid()).toBe(false)
    })

    it('returns true when pathname is invalid', () => {
      ;(import.meta.env as { BASE_URL?: string }).BASE_URL = '/'
      ;(window as { location?: { pathname: string } }).location!.pathname = '/p/'
      expect(isPathnameInvalid()).toBe(true)
    })

    it('accepts pathname argument', () => {
      expect(isPathnameInvalid('/')).toBe(false)
      expect(isPathnameInvalid('/p')).toBe(true)
    })
  })

  describe('isValidRoute', () => {
    it('accepts landing and portfolio paths', () => {
      expect(isValidRoute('/')).toBe(true)
      expect(isValidRoute('/portfolio')).toBe(true)
      expect(isValidRoute('/portfolio/experience')).toBe(true)
    })

    it('rejects invalid paths', () => {
      expect(isValidRoute('/p')).toBe(false)
      expect(isValidRoute('/foo')).toBe(false)
    })
  })

  describe('isValidHashSegment', () => {
    it('rejects invalid segments', () => {
      expect(isValidHashSegment('undefined')).toBe(false)
      expect(isValidHashSegment('null')).toBe(false)
      expect(isValidHashSegment('p')).toBe(false)
    })

    it('accepts valid segments', () => {
      expect(isValidHashSegment('')).toBe(true)
      expect(isValidHashSegment('portfolio')).toBe(true)
      expect(isValidHashSegment('portfolio/experience')).toBe(true)
    })
  })
})
