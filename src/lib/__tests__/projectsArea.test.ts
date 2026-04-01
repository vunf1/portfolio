import { describe, it, expect } from 'vitest'
import { filterProjectsForProjectsArea, isProjectShownInProjectsArea } from '../projectsArea'
import type { Project } from '../../types/portfolio'

const base = {
  id: 'x',
  name: 'N',
  description: '',
  longDescription: '',
  technologies: [] as string[],
  features: [] as string[],
  url: '',
  demo: '',
  image: '',
  period: '',
  role: '',
  teamSize: 1,
  highlights: [] as string[],
  challenges: '',
  solutions: ''
} satisfies Project

describe('projectsArea', () => {
  it('treats omitted projectsArea as on', () => {
    expect(isProjectShownInProjectsArea(base)).toBe(true)
  })

  it('treats projectsArea on as visible', () => {
    expect(isProjectShownInProjectsArea({ ...base, projectsArea: 'on' })).toBe(true)
  })

  it('treats projectsArea off as hidden', () => {
    expect(isProjectShownInProjectsArea({ ...base, projectsArea: 'off' })).toBe(false)
  })

  it('filters lists', () => {
    expect(
      filterProjectsForProjectsArea([
        { ...base, id: 'a', projectsArea: 'on' },
        { ...base, id: 'b', projectsArea: 'off' },
        { ...base, id: 'c' }
      ]).map((p) => p.id)
    ).toEqual(['a', 'c'])
  })

  it('returns empty for undefined or empty input', () => {
    expect(filterProjectsForProjectsArea(undefined)).toEqual([])
    expect(filterProjectsForProjectsArea([])).toEqual([])
  })
})
