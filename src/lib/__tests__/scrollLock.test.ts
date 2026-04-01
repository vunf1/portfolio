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
    expect(window.scrollTo).toHaveBeenCalledWith({ left: 0, top: 120, behavior: 'auto' })
  })

  it('nests: unlock only restores after outermost unlock', () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(50)
    lockScroll()
    lockScroll()
    unlockScroll()
    expect(document.body.style.position).toBe('fixed')
    unlockScroll()
    expect(document.body.style.position).toBe('')
    expect(window.scrollTo).toHaveBeenCalledWith({ left: 0, top: 50, behavior: 'auto' })
  })

  it('unlock when lockCount is 0 is a no-op', () => {
    unlockScroll()
    expect(document.body.style.position).toBe('')
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('reserves layout when classic scrollbar width is detected (body + html markers)', () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0)
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024)
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1009)
    lockScroll()
    expect(document.body.style.paddingRight).toBe('15px')
    expect(document.documentElement.getAttribute('data-scroll-locked')).toBe('')
    expect(document.documentElement.style.getPropertyValue('--scrollbar-compensation')).toBe('15px')
    unlockScroll()
    expect(document.body.style.paddingRight).toBe('')
    expect(document.documentElement.hasAttribute('data-scroll-locked')).toBe(false)
    expect(document.documentElement.style.getPropertyValue('--scrollbar-compensation')).toBe('')
  })

  it('nested locks keep compensation until outermost unlock', () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0)
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024)
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1009)
    lockScroll()
    lockScroll()
    expect(document.body.style.paddingRight).toBe('15px')
    unlockScroll()
    expect(document.body.style.paddingRight).toBe('15px')
    expect(document.documentElement.getAttribute('data-scroll-locked')).toBe('')
    unlockScroll()
    expect(document.body.style.paddingRight).toBe('')
    expect(document.documentElement.hasAttribute('data-scroll-locked')).toBe(false)
  })

  it('restores prior inline body padding-right after unlock when compensation was applied', () => {
    document.body.style.paddingRight = '8px'
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0)
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024)
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1009)
    lockScroll()
    expect(document.body.style.paddingRight).toBe('15px')
    unlockScroll()
    expect(document.body.style.paddingRight).toBe('8px')
  })
})
