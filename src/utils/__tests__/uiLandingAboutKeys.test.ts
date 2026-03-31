import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/** Keys required by LandingAbout + AboutDescriptionSpoiler (landing.about.*) */
const REQUIRED_LANDING_ABOUT_KEYS = [
  'title',
  'subtitle',
  'description',
  'location',
  'availability',
  'remoteWork',
  'ctaSkills',
  'readMore',
  'readLess',
  'quickFacts',
  'coreValues',
  'connectWithMe',
] as const

function loadLandingAbout(lang: 'en' | 'pt-PT'): Record<string, unknown> {
  const root = resolve(process.cwd(), 'public', 'data', lang, 'ui.json')
  const raw = readFileSync(root, 'utf8')
  const data = JSON.parse(raw) as { landing?: { about?: Record<string, unknown> } }
  const about = data.landing?.about
  expect(about, `${lang} ui.json must define landing.about`).toBeTruthy()
  return about as Record<string, unknown>
}

describe('ui.json landing.about i18n', () => {
  it('en and pt-PT expose the same key set', () => {
    const en = loadLandingAbout('en')
    const pt = loadLandingAbout('pt-PT')
    const enKeys = Object.keys(en).sort()
    const ptKeys = Object.keys(pt).sort()
    expect(ptKeys).toEqual(enKeys)
  })

  it('includes all keys used by LandingAbout / spoiler', () => {
    const en = loadLandingAbout('en')
    for (const key of REQUIRED_LANDING_ABOUT_KEYS) {
      expect(typeof en[key], `landing.about.${key} must be a non-empty string`).toBe('string')
      expect((en[key] as string).length).toBeGreaterThan(0)
    }
  })
})
