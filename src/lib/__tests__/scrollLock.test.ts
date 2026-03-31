import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { lockScroll, unlockScroll, resetScrollLockForTests } from '../scrollLock'

describe('scrollLock', () => {
  beforeEach(() => {
    resetScrollLockForTests()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    resetScrollLockForTests()
  })

  it('applies fixed body and restores on unlock', () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(120)
    lockScroll()
    expect(document.body.style.position).toBe('fixed')
    expect(document.body.style.top).toBe('-120px')
    expect(document.body.style.width).toBe('100%')
    unlockScroll()
    expect(document.body.style.position).toBe('')
    expect(window.scrollTo).toHaveBeenCalledWith(0, 120)
  })

  it('nests: unlock only restores after outermost unlock', () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(50)
    lockScroll()
    lockScroll()
    unlockScroll()
    expect(document.body.style.position).toBe('fixed')
    unlockScroll()
    expect(document.body.style.position).toBe('')
  })

  it('unlock when lockCount is 0 is a no-op', () => {
    unlockScroll()
    expect(document.body.style.position).toBe('')
    expect(window.scrollTo).not.toHaveBeenCalled()
  })
})
