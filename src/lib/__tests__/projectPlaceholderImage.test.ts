import { describe, it, expect } from 'vitest'
import { isProjectPlaceholderAsset } from '../projectPlaceholderImage'

describe('isProjectPlaceholderAsset', () => {
  it('is true for local and absolute svg paths', () => {
    expect(isProjectPlaceholderAsset('./img/projects/x.svg')).toBe(true)
    expect(isProjectPlaceholderAsset('/img/x.SVG')).toBe(true)
    expect(isProjectPlaceholderAsset('https://cdn.example.com/icon.svg?v=1')).toBe(true)
  })

  it('is false for empty, png, or non-svg', () => {
    expect(isProjectPlaceholderAsset('')).toBe(false)
    expect(isProjectPlaceholderAsset('   ')).toBe(false)
    expect(isProjectPlaceholderAsset(undefined)).toBe(false)
    expect(isProjectPlaceholderAsset('./img/projects/logo.png')).toBe(false)
  })
})
