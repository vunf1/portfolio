import { describe, it, expect } from 'vitest'
import { getProjectShowcaseTitle } from '../projectShowcaseTitle'

describe('getProjectShowcaseTitle', () => {
  it('removes trailing parenthetical stack labels', () => {
    expect(getProjectShowcaseTitle('License desktop manager (Python + MongoDB)')).toBe(
      'License desktop manager'
    )
    expect(getProjectShowcaseTitle('Image Database Manager (PyQt5)')).toBe('Image Database Manager')
    expect(
      getProjectShowcaseTitle('Security scripts · Incident response toolkit (Windows + Linux)')
    ).toBe('Security scripts · Incident response toolkit')
  })

  it('leaves names without trailing parentheses unchanged', () => {
    expect(getProjectShowcaseTitle('Effigy: Credit brokerage platform')).toBe(
      'Effigy: Credit brokerage platform'
    )
    expect(getProjectShowcaseTitle('Windows utilities · Info+ CLI')).toBe('Windows utilities · Info+ CLI')
  })
})
