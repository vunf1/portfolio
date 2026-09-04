# Design — João Maia Portfolio

A locked design system for this site. Page work reads this file before changing visual language.

## Genre
modern-minimal (professional engineer portfolio; not atmospheric mesh, not playful)

## Macrostructure family
- Marketing / landing: Split studio (copy left, mark right on large screens; stacked on small)
- Portfolio / CV: Index-first sections (experience → skills → work), shared panel language
- Content / case study: modal overlay on the CV surface

## Theme
Existing product tokens stay authoritative. Named motion tokens:

- `--color-paper` → `--neutral-50` / landing `#f6f7f8`
- `--color-ink` → `--neutral-900`
- `--color-accent` → `--primary-600` / `--color-primary`
- `--ease-out-expo` `cubic-bezier(0.16, 1, 0.3, 1)`
- `--motion-fast` 180ms · `--motion-base` 320ms · `--motion-slow` 560ms

## Typography
- Display / UI: `--font-family-sans` (system stack already shipped)
- Body: same sans; serif only for feature descriptions already in CSS
- Headings: `font-style: normal`; tracking not below `-0.04em`

## Motion
- First viewport is visible on first paint (no hero opacity-0).
- Below-fold sections use distinct reveals (not the same translateY on every block).
- Page change: fade + 8px rise, expo ease. `prefers-reduced-motion` disables travel.
- Interactive lift ≤ 3px. No looping decorative motion.

## Constraints
- Bilingual EN / PT-PT. No invented metrics.
- Privacy gate and existing routes stay.
- WCAG 2.2 AA contrast and visible `:focus-visible`.
