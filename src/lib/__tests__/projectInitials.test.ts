import { describe, it, expect } from 'vitest'
import { projectInitials } from '../projectInitials'

describe('projectInitials', () => {
  it('uses first two letter words for product names', () => {
    expect(projectInitials('Apito Final')).toBe('AF')
  })

  it('uses first two words before colon subtitle', () => {
    expect(projectInitials('Alpha Beta: production')).toBe('AB')
  })

  it('strips subtitle after colon then takes two words', () => {
    expect(projectInitials('LicenseHub Pro: PHP + Preact')).toBe('LP')
  })

  it('uses first two letters when only one word remains', () => {
    expect(projectInitials('Licensebridge')).toBe('LI')
  })

  it('handles Portuguese letters in words', () => {
    expect(projectInitials('João Maia')).toBe('JM')
  })
})
