import { describe, expect, it, vi } from 'vitest'
import { handleInternalPathClick, shouldUseInAppNavigation } from '../openInternalPath'

function click(overrides: Partial<MouseEvent> = {}): MouseEvent {
  return {
    defaultPrevented: false,
    button: 0,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    preventDefault: vi.fn(),
    ...overrides
  } as MouseEvent
}

describe('openInternalPath', () => {
  it('uses in-app navigation for a plain left click', () => {
    const event = click()
    expect(shouldUseInAppNavigation(event)).toBe(true)
    const navigate = vi.fn()
    handleInternalPathClick(event, navigate)
    expect(event.preventDefault).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledTimes(1)
  })

  it('leaves the real href for new-tab and modified clicks', () => {
    expect(shouldUseInAppNavigation(click({ ctrlKey: true }))).toBe(false)
    expect(shouldUseInAppNavigation(click({ metaKey: true }))).toBe(false)
    expect(shouldUseInAppNavigation(click({ button: 1 }))).toBe(false)
    const navigate = vi.fn()
    const event = click({ ctrlKey: true })
    handleInternalPathClick(event, navigate)
    expect(navigate).not.toHaveBeenCalled()
    expect(event.preventDefault).not.toHaveBeenCalled()
  })
})
