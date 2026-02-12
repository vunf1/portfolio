/**
 * Single source of truth for page and language transition timings.
 * Values are mirrored as CSS variables in variables.css for page-transition.css.
 */

/** Landing fade-out duration (ms) – must complete before portfolio appears */
export const PAGE_FADEOUT_MS = 350

/** Brief pause after landing is fully gone before portfolio fades in (ms) */
export const PAGE_BREATH_MS = 100

/** Portfolio fade-in animation duration (ms) */
export const PAGE_FADEIN_DURATION_MS = 450

/** Duration for language-switch "transitioning" state (ms) */
export const LANGUAGE_TRANSITION_MS = 300
