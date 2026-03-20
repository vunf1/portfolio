import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import type { JSX } from 'preact'
import type { Project } from '../types/portfolio'
import { useTranslation } from '../contexts/TranslationContext'
import { Button } from './ui/Button'
import { Icon } from './ui/Icon'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { Separator } from './ui/Separator'
import { cn } from '../lib/utils'
import { publicAssetUrl } from '../utils/getDataUrl'

function projectInitials(name: string): string {
  const parts = name.replace(/[—–-].*$/, '').trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

/** Calmer than default Button: no hover scale, shorter transitions, primary keeps base shadow on hover. */
const modalButtonMotion =
  'motion-safe:hover:scale-100 active:scale-100 transition-[color,background-color,border-color,box-shadow,filter] duration-150 ease-out'
const modalButtonPrimaryHover = 'hover:brightness-100 hover:shadow-button'

const DETAIL_MIN = 260
const DETAIL_MAX = 600
/** Default width when an iframe preview is shown (more room for the embed). */
const DETAIL_DEFAULT_WITH_EMBED = 340
/** Wider default when there is no iframe—more readable project description. */
const DETAIL_DEFAULT_EXPANDED = 500

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

interface ProjectCaseStudyModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

/**
 * Case-study dialog (shadcn-style: Card, Button, Badge, Separator).
 * Live preview uses an iframe when `embedInModal !== false`. Set `embedInModal: false` in data for sites that block framing (avoids blank areas / browser security interstitials).
 * Overlay starts below the fixed portfolio nav — keep `top` in sync with `--navbar-height` in `src/css/variables.css` and `NAV_HEIGHT` in `Navigation.tsx`.
 */
export function ProjectCaseStudyModal({ project, isOpen, onClose }: ProjectCaseStudyModalProps) {
  const { t } = useTranslation()
  const [detailWidth, setDetailWidth] = useState(DETAIL_DEFAULT_WITH_EMBED)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(DETAIL_DEFAULT_WITH_EMBED)
  const modalRef = useRef<HTMLDivElement>(null)
  const [isLg, setIsLg] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }
    const mq = window.matchMedia('(min-width: 1024px)')
    const apply = () => setIsLg(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const liveUrl = project ? project.demo || project.url : ''
  const hostname = liveUrl ? safeHostname(liveUrl) : ''

  useEffect(() => {
    if (!isOpen || !project) {
      return
    }
    const allowEmbed = project.embedInModal !== false
    const hasLiveUrl = Boolean(project.demo || project.url)
    const useExpandedDetails = !hasLiveUrl || !allowEmbed
    const next = useExpandedDetails ? DETAIL_DEFAULT_EXPANDED : DETAIL_DEFAULT_WITH_EMBED
    setDetailWidth(next)
    startWidth.current = next
  }, [isOpen, project?.id, project?.demo, project?.url, project?.embedInModal])

  useEffect(() => {
    if (!isOpen) {
      return
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const onResizeStart = useCallback(
    (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      dragging.current = true
      startX.current = e.clientX
      startWidth.current = detailWidth
    },
    [detailWidth]
  )

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) {
        return
      }
      const delta = startX.current - e.clientX
      setDetailWidth(() => Math.min(DETAIL_MAX, Math.max(DETAIL_MIN, startWidth.current + delta)))
    }
    const onUp = () => {
      dragging.current = false
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  if (!isOpen || !project) {
    return null
  }

  const allowIframeEmbed = project.embedInModal !== false

  const overlayClick = (e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  const iframeTitle = hostname
    ? String(t('projects.livePreviewIframeTitle', 'Live preview — {{host}}', { host: hostname }))
    : String(t('projects.livePreview', 'Live preview'))

  return (
    <div
      ref={modalRef}
      className="fixed inset-x-0 bottom-0 top-[var(--navbar-height)] z-[1060] flex items-center justify-center bg-black/55 p-2 sm:p-4"
      onClick={overlayClick}
      role="presentation"
    >
      <div
        className="flex max-h-[min(92vh,920px)] w-full max-w-[min(100%,1400px)] flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white text-gray-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-case-study-title"
      >
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="min-w-0 flex-1">
            <h2 id="project-case-study-title" className="truncate text-lg font-semibold tracking-tight text-gray-900">
              {project.name}
            </h2>
            <p className="truncate text-xs text-gray-500 sm:text-sm">
              {project.period}
              {project.role ? ` · ${project.role}` : ''}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {liveUrl ? (
              <Button
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                size="sm"
                className={cn(
                  'gap-1.5 text-primary shadow-none hover:bg-primary/[0.06] hover:text-primary-dark',
                  modalButtonMotion
                )}
              >
                <Icon name="external-link" size={14} aria-hidden />
                {t('projects.openSite')}
              </Button>
            ) : null}
          </div>
        </header>

        <Separator className="bg-gray-200" />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col border-b border-gray-100 lg:border-b-0 lg:border-r lg:border-gray-100">
            <div className="flex items-center justify-between gap-2 border-b border-gray-50 px-3 py-2 sm:px-4">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {liveUrl && !allowIframeEmbed
                  ? t('projects.liveSiteHeading', 'Live site')
                  : t('projects.livePreview')}
              </span>
            </div>
            <div
              className={`relative flex flex-1 items-stretch bg-gray-50 p-4 sm:p-6 ${
                liveUrl && allowIframeEmbed
                  ? 'min-h-[240px] sm:min-h-[300px] lg:min-h-[420px]'
                  : 'min-h-[200px] sm:min-h-[240px] lg:min-h-[280px]'
              }`}
            >
              <Card variant="default" hover={false} className="flex min-h-0 w-full flex-1 flex-col overflow-hidden border-gray-200/80 bg-white/95 shadow-sm">
                <div className="-m-6 flex min-h-0 flex-1 flex-col">
                  {liveUrl ? (
                    allowIframeEmbed ? (
                      <>
                        <div className="relative min-h-[220px] w-full flex-1 overflow-hidden bg-gray-100 sm:min-h-[280px] lg:min-h-[320px]">
                          <iframe
                            src={liveUrl}
                            title={iframeTitle}
                            className="absolute inset-0 h-full w-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                        <div className="flex flex-col items-center gap-3 border-t border-gray-100 px-6 py-5 text-center">
                          <p className="max-w-md text-xs leading-relaxed text-gray-600 sm:text-sm">
                            {t(
                              'projects.previewNote',
                              'An embedded preview only appears when the live site allows framing. Many production sites block that on purpose to protect users. If the area above stays empty, open the project in a new window—the full site always loads there.'
                            )}
                          </p>
                          <Button
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outline"
                            size="sm"
                            className={cn('gap-1.5', modalButtonMotion)}
                          >
                            <Icon name="external-link" size={14} aria-hidden />
                            {t('projects.openLiveExperience', 'Open in new window')}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex min-h-[180px] flex-1 flex-col items-center justify-center gap-4 px-6 py-8 text-center sm:min-h-[220px] lg:min-h-[240px]">
                        {project.image ? (
                          <div className="flex max-h-28 w-full max-w-xs items-center justify-center">
                            <img
                              src={publicAssetUrl(project.image)}
                              alt=""
                              className="max-h-28 w-auto max-w-full object-contain object-center"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <span
                            className="flex h-14 min-w-[3.5rem] items-center justify-center rounded-lg bg-primary/5 px-3 text-sm font-bold tracking-tight text-primary-dark"
                            aria-hidden
                          >
                            {projectInitials(project.name)}
                          </span>
                        )}
                        {hostname ? (
                          <p className="text-sm font-medium text-gray-900">{hostname}</p>
                        ) : null}
                        <p className="max-w-md text-sm leading-relaxed text-gray-600">
                          {t(
                            'projects.previewOpenExternally',
                            'This site is configured not to appear inside other pages—a common security measure. It opens in its own window here so you see the same experience a visitor would, without bypassing that protection.'
                          )}
                        </p>
                        <Button
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="primary"
                          size="md"
                          className={cn('gap-2', modalButtonMotion, modalButtonPrimaryHover)}
                        >
                          <Icon name="external-link" size={16} aria-hidden />
                          {t('projects.openLiveExperience', 'Open in new window')}
                        </Button>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                      <p className="text-sm text-gray-600">
                        {t('projects.previewUnavailable', 'No public demo link is available for this entry.')}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          <button
            type="button"
            className="hidden w-2 shrink-0 cursor-col-resize border-0 bg-gray-100 px-0 hover:bg-gray-200 lg:block"
            aria-label={String(t('projects.resizePanel'))}
            onMouseDown={onResizeStart}
          />

          <aside
            className="flex max-h-[45vh] min-h-0 w-full flex-col overflow-y-auto border-gray-100 bg-white lg:max-h-none lg:w-auto lg:shrink-0 lg:border-l"
            style={isLg ? { width: detailWidth, minWidth: DETAIL_MIN, maxWidth: DETAIL_MAX } : undefined}
          >
            <div className="space-y-5 p-4 sm:p-5">
              <section>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{t('projects.overview')}</h3>
                <p className="text-sm leading-relaxed text-gray-700">{project.longDescription}</p>
              </section>

              {project.features && project.features.length > 0 ? (
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{t('projects.features')}</h3>
                  <ul className="list-inside list-disc space-y-1.5 text-sm text-gray-700">
                    {project.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {project.technologies && project.technologies.length > 0 ? (
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{t('projects.technologies')}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, i) => (
                      <Badge
                        key={i}
                        variant="primary"
                        size="sm"
                        className="border border-primary/20 bg-primary/5 font-medium text-primary"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </section>
              ) : null}

              {project.security && project.security.length > 0 ? (
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{t('projects.security')}</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {project.security.map((s, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {project.challenges ? (
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{t('projects.challenges')}</h3>
                  <p className="text-sm leading-relaxed text-gray-700">{project.challenges}</p>
                </section>
              ) : null}

              {project.solutions ? (
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{t('projects.solutions')}</h3>
                  <p className="text-sm leading-relaxed text-gray-700">{project.solutions}</p>
                </section>
              ) : null}

              {project.highlights && project.highlights.length > 0 ? (
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{t('projects.highlights')}</h3>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex gap-2">
                        <Icon name="check" size={14} className="mt-0.5 shrink-0 text-primary" aria-hidden />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
