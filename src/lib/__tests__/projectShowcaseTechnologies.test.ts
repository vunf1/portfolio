import { describe, expect, it } from 'vitest'
import {
  getShowcaseTechnologyDisplay,
  isProgrammingLanguage,
  orderShowcaseTechnologies,
  techTagClassName,
} from '../projectShowcaseTechnologies'

describe('isProgrammingLanguage', () => {
  it('recognises common programming languages', () => {
    expect(isProgrammingLanguage('TypeScript')).toBe(true)
    expect(isProgrammingLanguage('Python')).toBe(true)
    expect(isProgrammingLanguage('Rust')).toBe(true)
    expect(isProgrammingLanguage('PHP')).toBe(true)
    expect(isProgrammingLanguage('Bash / Shell')).toBe(true)
  })

  it('does not treat frameworks or infra as languages', () => {
    expect(isProgrammingLanguage('React')).toBe(false)
    expect(isProgrammingLanguage('Docker')).toBe(false)
    expect(isProgrammingLanguage('MongoDB')).toBe(false)
  })
})

describe('techTagClassName', () => {
  it('marks programming languages and leaves other stack items unmarked', () => {
    expect(techTagClassName('TypeScript')).toBe('cv-tag cv-tag--lang')
    expect(techTagClassName('React')).toBe('cv-tag')
  })
})

describe('orderShowcaseTechnologies', () => {
  it('places languages before other stack items while preserving order', () => {
    const ordered = orderShowcaseTechnologies([
      'React',
      'TypeScript',
      'Vite',
      'Node.js',
      'WebSocket',
      'PHP',
      'REST',
      'Docker',
      'Nginx',
    ])

    expect(ordered).toEqual([
      'TypeScript',
      'Node.js',
      'PHP',
      'React',
      'Vite',
      'WebSocket',
      'REST',
      'Docker',
      'Nginx',
    ])
  })
})

describe('getShowcaseTechnologyDisplay', () => {
  it('shows languages first and counts remaining items in overflow', () => {
    const { visible, overflow } = getShowcaseTechnologyDisplay(
      ['React', 'TypeScript', 'Vite', 'Node.js', 'WebSocket', 'PHP', 'REST', 'Docker', 'Nginx'],
      5
    )

    expect(visible).toEqual(['TypeScript', 'Node.js', 'PHP', 'React', 'Vite'])
    expect(overflow).toBe(4)
  })
})
