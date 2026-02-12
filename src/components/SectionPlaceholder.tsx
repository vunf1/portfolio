/**
 * Minimal placeholder for Suspense fallback – no animation.
 * Reserves space while lazy chunks load; content fades in via page-fade-in.
 */
export function SectionPlaceholder() {
  return (
    <div className="section-placeholder" aria-hidden="true">
      <div className="section-placeholder-block" />
    </div>
  )
}
