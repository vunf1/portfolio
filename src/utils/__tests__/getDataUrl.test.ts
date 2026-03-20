import { describe, it, expect } from 'vitest'
import { publicAssetUrl, getDataUrl } from '../getDataUrl'

describe('getDataUrl', () => {
  it('getDataUrl includes language path segment', () => {
    expect(getDataUrl('en', 'ui.json')).toContain('data/en/ui.json')
  })

  it('publicAssetUrl resolves to same-origin URL with path under img/', () => {
    expect(publicAssetUrl('/img/projects/x.svg')).toContain('img/projects/x.svg')
  })

  it('publicAssetUrl returns absolute http(s) URLs unchanged', () => {
    expect(publicAssetUrl('https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png')
  })
})
