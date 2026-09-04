import { describe, expect, it } from 'vitest'
import {
  LANGUAGE_TRANSITION_MS,
  MOTION_INSTANT_MS,
  MOTION_STAGGER_MAX_STEPS,
  MOTION_STAGGER_MS,
  PAGE_BREATH_MS,
  PAGE_FADEIN_DURATION_MS,
  PAGE_FADEOUT_MS
} from '../pageTransitions'

describe('pageTransitions', () => {
  it('keeps landing-to-portfolio motion short and inbound slower than outbound', () => {
    expect(PAGE_FADEOUT_MS).toBe(280)
    expect(PAGE_BREATH_MS).toBe(80)
    expect(PAGE_FADEIN_DURATION_MS).toBe(520)
    expect(PAGE_FADEIN_DURATION_MS).toBeGreaterThan(PAGE_FADEOUT_MS)
    expect(LANGUAGE_TRANSITION_MS).toBeGreaterThan(0)
  })

  it('keeps list stagger short and capped', () => {
    expect(MOTION_INSTANT_MS).toBe(120)
    expect(MOTION_STAGGER_MS).toBe(40)
    expect(MOTION_STAGGER_MAX_STEPS).toBe(8)
    expect(MOTION_STAGGER_MS * MOTION_STAGGER_MAX_STEPS).toBeLessThan(PAGE_FADEIN_DURATION_MS)
  })
})
