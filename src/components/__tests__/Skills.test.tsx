import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/preact'
import { Skills } from '../Skills'
import type { Skills as SkillsData } from '../../types/portfolio'

vi.mock('../../contexts/TranslationContext', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => {
      const map: Record<string, string> = {
        'skills.title': 'Skills',
        'skills.subtitle': 'Technical range',
        'skills.proficiencyLevels': 'Proficiency Levels',
        'skills.soft': 'Soft skills',
        'skills.levelNames.Foundational': 'Foundational',
        'skills.levelNames.Proficient': 'Proficient',
        'skills.levelNames.Advanced': 'Advanced',
        'skills.levelNames.Expert': 'Expert'
      }
      return map[key] || defaultValue || key
    },
    currentLanguage: 'en',
    changeLanguage: vi.fn(),
    isEnglish: true,
    isPortuguese: false,
    supportedLanguages: ['en', 'pt-PT']
  }),
  preloadTranslations: vi.fn().mockResolvedValue(undefined)
}))

const skillsFixture = (): SkillsData => ({
  proficiencyLevels: {
    Foundational: 'Working knowledge',
    Proficient: 'Independent delivery',
    Advanced: 'Leads complex work',
    Expert: 'Sets the standard'
  },
  technical: [
    {
      category: 'Programming Languages',
      skills: [
        {
          name: 'TypeScript',
          level: 'Expert',
          description: 'Primary application language'
        }
      ]
    }
  ],
  soft: [
    {
      name: 'Communication',
      level: 'Advanced',
      description: 'Clear written and spoken updates'
    }
  ]
})

describe('Skills', () => {
  it('keeps proficiency levels in a left rail beside the skill catalogue', () => {
    const { container } = render(<Skills skills={skillsFixture()} />)

    const rail = container.querySelector('.cv-skills-rail')
    const main = container.querySelector('#skills-content.cv-skills-main')
    const shell = container.querySelector('.cv-skills-shell')

    expect(rail).not.toBeNull()
    expect(main).not.toBeNull()
    expect(shell?.firstElementChild).toBe(rail)
    expect(rail?.nextElementSibling).toBe(main)
    expect(screen.getByRole('complementary', { name: 'Proficiency Levels' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Proficiency Levels' })).toBeTruthy()
    expect(screen.getByText('TypeScript')).toBeTruthy()
    expect(screen.getByText('Communication')).toBeTruthy()
  })

  it('encodes proficiency on catalogue rows without repeating level labels', () => {
    const { container } = render(<Skills skills={skillsFixture()} />)
    const catalogue = container.querySelector('#skills-content')

    expect(catalogue?.querySelector('.key-competency-badge')).toBeNull()
    expect(catalogue?.querySelector('.cv-skill-row.skill-proficiency-expert')).not.toBeNull()
    expect(catalogue?.querySelector('.cv-skill-row.skill-proficiency-advanced')).not.toBeNull()
    expect(screen.getByLabelText('TypeScript, Expert')).toBeTruthy()
    expect(screen.getByLabelText('Communication, Advanced')).toBeTruthy()
    expect(catalogue?.textContent).not.toMatch(/\bExpert\b/)
    expect(catalogue?.textContent).not.toMatch(/\bAdvanced\b/)
  })
})
