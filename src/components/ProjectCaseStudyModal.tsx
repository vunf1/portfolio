import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import type { JSX } from 'preact'
import type { Project } from '../types/portfolio'
import { useTranslation } from '../contexts/TranslationContext'
import { Button } from './ui/Button'
import { Icon } from './ui/Icon'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { Separator } from './ui/Separator'
import { lockScroll, unlockScroll } from '../lib/scrollLock'
import { cn } from '../lib/utils'
import { publicAssetUrl } from '../utils/getDataUrl'

function projectInitials(name: string): string {
  const parts = name.replace(/[\u2013\u2014\-:].*$/, '').trim().split(/\s+/).filter(Boolean)
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
/** Wider default when there is no iframe (more readable project description). */
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
 * Overlay starts below the fixed portfolio nav; keep `top` in sync with `--navbar-height` in `src/css/variables.css` and `NAV_HEIGHT` in `Navigation.tsx`.
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
    lockScroll()
    return () => {
      unlockScroll()
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
    ? String(t('projects.livePreviewIframeTitle', 'Live preview: {{host}}', { host: hostname }))
    : String(t('projects.livePreview', 'Live preview'))

  return (
    <div
      ref={modalRef}
      className="fixed inset-x-0 bottom-0 top-[var(--navbar-height)] z-[1060] flex items-stretch justify-center bg-black/55 p-0 pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 sm:pb-4"
      onClick={overlayClick}
      role="presentation"
    >
      <div
        className={cn(
          'flex w-full max-w-[min(100%,1400px)] flex-col bg-white text-gray-900 shadow-2xl',
          /* <lg: one scroll (dialog); lg+: centered card, details pane scrolls inside */
          'h-full min-h-0 overflow-y-auto overscroll-y-contain rounded-none border-0 border-gray-200/90',
          'sm:h-auto sm:max-h-[min(92vh,920px)] sm:rounded-2xl sm:border sm:border-gray-200/90',
          'lg:max-h-[min(92vh,920px)] lg:overflow-hidden'
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-case-study-title"
      >
        <div className="sticky top-0 z-10 shrink-0 bg-white/95 backdrop-blur-sm lg:static lg:bg-transparent lg:backdrop-blur-none">
          <header className="flex items-start gap-2 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:items-center sm:gap-3 sm:px-5 sm:pb-3 sm:pt-3">
            <div className="min-w-0 flex-1 pr-1">
              <h2
                id="project-case-study-title"
                className="text-base font-semibold leading-snug tracking-tight text-gray-900 sm:text-lg"
              >
                <span className="line-clamp-3 sm:line-clamp-2">{project.name}</span>
              </h2>
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 sm:text-sm">
                {project.period}
                {project.role ? ` · ${project.role}` : ''}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              {liveUrl ? (
                <Button
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="ghost"
                  size="sm"
                  aria-label={String(t('projects.openSite'))}
                  className={cn(
                    'h-11 min-w-[2.75rem] gap-1.5 px-2.5 text-primary shadow-none hover:bg-primary/[0.06] hover:text-primary-dark sm:h-9 sm:min-w-0 sm:px-3',
                    modalButtonMotion
                  )}
                >
                  <Icon name="external-link" size={16} className="shrink-0" aria-hidden />
                  <span className="hidden sm:inline">{t('projects.openSite')}</span>
                </Button>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label={String(t('projects.closeModal'))}
                className={cn(
                  'h-11 w-11 shrink-0 rounded-full p-0 text-gray-600 hover:bg-gray-100 hover:text-gray-900 sm:h-9 sm:w-9 sm:rounded-md',
                  modalButtonMotion
                )}
              >
                <Icon name="times" size={20} aria-hidden />
              </Button>
            </div>
          </header>

          <Separator className="bg-gray-200" />
        </div>

        <div className="flex w-full flex-col lg:min-h-0 lg:flex-1 lg:flex-row lg:overflow-hidden">
          <div className="flex w-full shrink-0 flex-col border-b border-gray-100 lg:min-h-0 lg:flex-1 lg:border-b-0 lg:border-r lg:border-gray-100">
            <div className="flex items-center justify-between gap-2 border-b border-gray-50 px-3 py-2 sm:px-4">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {liveUrl && !allowIframeEmbed
                  ? t('projects.liveSiteHeading', 'Live site')
                  : t('projects.livePreview')}
              </span>
            </div>
            <div
              className={cn(
                'relative flex items-stretch bg-gray-50 p-3 sm:p-6',
                liveUrl && allowIframeEmbed
                  ? 'min-h-[min(52vw,280px)] sm:min-h-[300px] lg:min-h-[420px]'
                  : 'min-h-[min(44vw,220px)] sm:min-h-[240px] lg:min-h-[280px]'
              )}
            >
              <Card variant="default" hover={false} className="flex min-h-0 w-full flex-col overflow-hidden border-gray-200/80 bg-white/95 shadow-sm lg:flex-1">
                <div className="flex min-h-0 flex-col sm:-m-6">
                  {liveUrl ? (
                    allowIframeEmbed ? (
                      <>
                        <div className="relative min-h-[min(48vw,240px)] w-full overflow-hidden bg-gray-100 sm:min-h-[280px] lg:min-h-[320px]">
                          <iframe
                            src={liveUrl}
                            title={iframeTitle}
                            className="absolute inset-0 h-full w-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                        <div className="flex flex-col items-center gap-3 border-t border-gray-100 px-4 py-4 text-center sm:px-6 sm:py-5">
                          <p className="max-w-md text-xs leading-relaxed text-gray-600 sm:text-sm">
                            {t(
                              'projects.previewNote',
                              'An embedded preview only appears when the live site allows framing. Many production sites block that on purpose to protect users. If the area above stays empty, open the project in a new window; the full site always loads there.'
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
                            'This site is configured not to appear inside other pages (a common security measure). It opens in its own window here so you see the same experience a visitor would, without bypassing that protection.'
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
            className="flex w-full flex-col border-gray-100 bg-white pb-[max(1rem,env(safe-area-inset-bottom,0px))] lg:min-h-0 lg:w-auto lg:shrink-0 lg:overflow-y-auto lg:border-l lg:pb-0"
            style={isLg ? { width: detailWidth, minWidth: DETAIL_MIN, maxWidth: DETAIL_MAX } : undefined}
          >
            <div className="space-y-5 px-4 pb-5 pt-1 sm:p-5 sm:pt-0">
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
