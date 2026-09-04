/**
 * Single source of truth for page and language transition timings.
 * Values are mirrored as CSS variables in variables.css for page-transition.css.
 */

/** Landing fade-out duration (ms) – must complete before portfolio appears */
export const PAGE_FADEOUT_MS = 280

/** Brief pause after landing is fully gone before portfolio fades in (ms) */
export const PAGE_BREATH_MS = 80

/** Portfolio fade-in animation duration (ms) */
export const PAGE_FADEIN_DURATION_MS = 520

/** Duration for language-switch "transitioning" state (ms) */
export const LANGUAGE_TRANSITION_MS = 300

/** Immediate control feedback (ms): mirrors --motion-instant */
export const MOTION_INSTANT_MS = 120

/** Sibling stagger step for lists that appear as a list (ms): mirrors --motion-stagger */
export const MOTION_STAGGER_MS = 40

/** Cap sibling delays so a long catalogue does not feel like a parade */
export const MOTION_STAGGER_MAX_STEPS = 8
