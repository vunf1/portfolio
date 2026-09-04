import { render } from '@testing-library/preact'
import { describe, it, expect } from 'vitest'
import { LanguageFlagIcon } from '../LanguageFlagIcon'

describe('LanguageFlagIcon', () => {
  it('renders official UK flag asset for English language', () => {
    const { container } = render(<LanguageFlagIcon language="en" />)

    const flag = container.querySelector('img.fab-flag-icon')
    expect(flag).toBeInTheDocument()
    expect(flag).toHaveAttribute('src', '/img/flags/united-kingdom.svg')
    expect(flag).toHaveAttribute('aria-hidden', 'true')
    expect(container.textContent).not.toMatch(/GB|PT/)
  })

  it('renders official Portugal flag asset for Portuguese', () => {
    const { container } = render(<LanguageFlagIcon language="pt-PT" />)

    const flag = container.querySelector('img.fab-flag-icon')
    expect(flag).toBeInTheDocument()
    expect(flag).toHaveAttribute('src', '/img/flags/portugal.svg')
    expect(flag).toHaveAttribute('aria-hidden', 'true')
    expect(container.textContent).not.toMatch(/GB|PT/)
  })
})
