import { render, screen, waitFor } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AboutDescriptionSpoiler } from '../AboutDescriptionSpoiler'

function setMatchMedia(matches767: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: matches767 && String(query).includes('767'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function isAboutDescriptionParagraph(el: HTMLElement): boolean {
  return el.tagName === 'P' && el.className.includes('about-description')
}

describe('AboutDescriptionSpoiler', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders full description on desktop without a toggle', () => {
    setMatchMedia(false)
    const text = 'Full paragraph for desktop layout.'
    render(
      <AboutDescriptionSpoiler
        text={text}
        readMoreLabel="Read more"
        readLessLabel="Show less"
      />
    )
    expect(screen.getByText(text)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /read more/i })).not.toBeInTheDocument()
  })

  it('shows read more on mobile when clamped text overflows, then toggles', async () => {
    setMatchMedia(true)
    const user = userEvent.setup()

    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (this: HTMLElement) {
      if (isAboutDescriptionParagraph(this)) {
        return 400
      }
      return 32
    })
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (this: HTMLElement) {
      if (isAboutDescriptionParagraph(this)) {
        return 120
      }
      return 32
    })

    const text = 'Long copy that should overflow when line-clamped on small viewports.'
    render(
      <AboutDescriptionSpoiler
        text={text}
        readMoreLabel="Read more"
        readLessLabel="Show less"
      />
    )

    const btn = await waitFor(() => screen.getByRole('button', { name: /read more/i }))
    expect(btn).toHaveAttribute('aria-expanded', 'false')

    await user.click(btn)
    expect(screen.getByRole('button', { name: /show less/i })).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('button', { name: /show less/i }))
    expect(screen.getByRole('button', { name: /read more/i })).toHaveAttribute('aria-expanded', 'false')
  })

  it('hides toggle on mobile when text does not overflow the clamp', async () => {
    setMatchMedia(true)
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (this: HTMLElement) {
      if (isAboutDescriptionParagraph(this)) {
        return 100
      }
      return 32
    })
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (this: HTMLElement) {
      if (isAboutDescriptionParagraph(this)) {
        return 100
      }
      return 32
    })

    render(
      <AboutDescriptionSpoiler
        text="Short."
        readMoreLabel="Read more"
        readLessLabel="Show less"
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Short.')).toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: /read more/i })).not.toBeInTheDocument()
  })
})
