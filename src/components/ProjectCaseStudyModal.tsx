import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import type { JSX } from 'preact'
import type { Project } from '../types/portfolio'
import { useTranslation } from '../contexts/TranslationContext'
import { Icon } from './ui/Icon'
import { lockScroll, unlockScroll } from '../lib/scrollLock'
import { cn } from '../lib/utils'
import { publicAssetUrl } from '../utils/getDataUrl'
import { projectInitials } from '../lib/projectInitials'
import { getProjectShowcaseTitle } from '../lib/projectShowcaseTitle'
import { techTagClassName } from '../lib/projectShowcaseTechnologies'
import { isProjectPlaceholderAsset } from '../lib/projectPlaceholderImage'

const DETAIL_MIN = 260
const DETAIL_MAX = 600
const DETAIL_DEFAULT_WITH_EMBED = 340
const DETAIL_DEFAULT_EXPANDED = 500

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function CaseStudyDetailBody({ project }: { project: Project }) {
  const { t } = useTranslation()

  return (
    <div className="cv-project-modal__content">
      <section>
        <h3 className="cv-project-modal__section-title">{t('projects.overview')}</h3>
        <p className="cv-project-modal__text">{project.longDescription}</p>
      </section>

      {project.features && project.features.length > 0 ? (
        <section>
          <h3 className="cv-project-modal__section-title">{t('projects.features')}</h3>
          <ul className="cv-project-modal__list">
            {project.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.technologies && project.technologies.length > 0 ? (
        <section>
          <h3 className="cv-project-modal__section-title">{t('projects.technologies')}</h3>
          <div className="cv-project-modal__tags">
            {project.technologies.map((tech, index) => (
              <span key={index} className={techTagClassName(tech)}>
                {tech}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {project.security && project.security.length > 0 ? (
        <section>
          <h3 className="cv-project-modal__section-title">{t('projects.security')}</h3>
          <ul className="cv-project-modal__list cv-project-modal__security">
            {project.security.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.challenges ? (
        <section>
          <h3 className="cv-project-modal__section-title">{t('projects.challenges')}</h3>
          <p className="cv-project-modal__text">{project.challenges}</p>
        </section>
      ) : null}

      {project.solutions ? (
        <section>
          <h3 className="cv-project-modal__section-title">{t('projects.solutions')}</h3>
          <p className="cv-project-modal__text">{project.solutions}</p>
        </section>
      ) : null}

      {project.highlights && project.highlights.length > 0 ? (
        <section>
          <h3 className="cv-project-modal__section-title">{t('projects.highlights')}</h3>
          <ul className="cv-project-modal__list cv-project-modal__list--check">
            {project.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

interface ProjectCaseStudyModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectCaseStudyModal({ project, isOpen, onClose }: ProjectCaseStudyModalProps) {
  const { t } = useTranslation()
  const [detailWidth, setDetailWidth] = useState(DETAIL_DEFAULT_WITH_EMBED)
  const [imageLightboxOpen, setImageLightboxOpen] = useState(false)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(DETAIL_DEFAULT_WITH_EMBED)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
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
      setImageLightboxOpen(false)
      document.body.classList.remove('project-modal-open')
      return
    }
    document.body.classList.add('project-modal-open')
    lockScroll()
    return () => {
      document.body.classList.remove('project-modal-open')
      unlockScroll()
    }
  }, [isOpen])

  useEffect(() => {
    setImageLightboxOpen(false)
  }, [project?.id])

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus({ preventScroll: true })
    }
  }, [isOpen, project?.id])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        return
      }
      if (imageLightboxOpen) {
        e.preventDefault()
        setImageLightboxOpen(false)
        return
      }
      if (isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, imageLightboxOpen])

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
  const noPublicDemo = !liveUrl
  const externalPreviewOnly = Boolean(liveUrl && !allowIframeEmbed)
  const stackedCaseStudyLayout = noPublicDemo || externalPreviewOnly
  const resolvedImageSrc = project.image?.trim() ? publicAssetUrl(project.image.trim()) : ''
  const canOpenImageLightbox = Boolean(resolvedImageSrc)
  const placeholderImage = isProjectPlaceholderAsset(project.image)

  const overlayClick = (e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  const iframeTitle = hostname
    ? String(t('projects.livePreviewIframeTitle', 'Live preview: {{host}}', { host: hostname }))
    : String(t('projects.livePreview', 'Live preview'))

  const lightboxLabel = String(t('projects.imagePreviewDialog', 'Project image preview'))

  const showcaseTitle = getProjectShowcaseTitle(project.name)

  const renderThumb = () => {
    if (canOpenImageLightbox) {
      return (
        <button
          type="button"
          onClick={() => setImageLightboxOpen(true)}
          className="cv-project-modal__thumb cv-project-modal__thumb-btn"
          aria-label={String(t('projects.openImageFullSize', 'View project image full size'))}
        >
          <img src={resolvedImageSrc} alt="" loading="eager" decoding="async" />
        </button>
      )
    }

    return (
      <span className="cv-project-modal__thumb cv-project-modal__thumb--initials" aria-hidden>
        {projectInitials(showcaseTitle)}
      </span>
    )
  }

  return (
    <>
      <div
        ref={modalRef}
        className="cv-project-modal__backdrop"
        data-scroll-lock-fixed
        onClick={overlayClick}
        role="presentation"
      >
        <div
          className={cn(
            'cv-project-modal',
            stackedCaseStudyLayout ? 'cv-project-modal--stacked' : 'cv-project-modal--split'
          )}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-case-study-title"
        >
          {stackedCaseStudyLayout && canOpenImageLightbox ? (
            <div className="cv-project-modal__hero">{renderThumb()}</div>
          ) : null}

          <header className="cv-project-modal__header">
            <div className="cv-project-modal__brand">
              {stackedCaseStudyLayout && !canOpenImageLightbox ? renderThumb() : null}
              <div className="cv-project-modal__copy">
                <h2 id="project-case-study-title" className="cv-project-modal__title">
                  {showcaseTitle}
                </h2>
                <p className="cv-project-modal__meta">
                  <span className="cv-project-modal__period">{project.period}</span>
                  {project.role ? <span className="cv-project-modal__role">{project.role}</span> : null}
                </p>
              </div>
            </div>

            <div className="cv-project-modal__actions">
              {liveUrl ? (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cv-project-modal__action cv-project-modal__action--primary"
                  aria-label={String(t('projects.openSite'))}
                >
                  <Icon name="external-link" size={16} aria-hidden />
                  <span className="cv-project-modal__action-label">{t('projects.openSite')}</span>
                </a>
              ) : null}
              <button
                ref={closeRef}
                type="button"
                className="cv-project-modal__close"
                onClick={onClose}
                aria-label={String(t('projects.closeModal'))}
              >
                <Icon name="x" size={18} aria-hidden />
              </button>
            </div>
          </header>

          {stackedCaseStudyLayout ? (
            <div className="cv-project-modal__body cv-project-modal__stack">
              {externalPreviewOnly ? (
                <div className="cv-project-modal__framing" role="note">
                  <p className="cv-project-modal__framing-label">
                    <Icon name="shield" size={12} aria-hidden />
                    <span>{t('projects.framingProtectionLabel', 'Framing protection')}</span>
                    {hostname ? <span>· {hostname}</span> : null}
                  </p>
                  <p className="cv-project-modal__framing-text">
                    {t(
                      'projects.embedsBlockedShort',
                      'The live site blocks embedding. Open it in a new window.'
                    )}
                  </p>
                  <p className="sr-only">
                    {t(
                      'projects.previewOpenExternally',
                      'This site is configured not to appear inside other pages (a common security measure). It opens in its own window here so you see the same experience a visitor would, without bypassing that protection.'
                    )}
                  </p>
                </div>
              ) : null}

              {noPublicDemo ? (
                <div className="cv-project-modal__notice" role="status" aria-live="polite">
                  <p className="cv-project-modal__notice-title">
                    {t('projects.previewUnavailableTitle', 'No live demo for this project')}
                  </p>
                  <p className="cv-project-modal__notice-text">
                    {t('projects.previewUnavailable', 'No public demo link is available for this entry.')}
                  </p>
                </div>
              ) : null}

              <CaseStudyDetailBody project={project} />
            </div>
          ) : (
            <div className="cv-project-modal__body cv-project-modal__split">
              <div className="cv-project-modal__preview">
                <p className="cv-project-modal__preview-label">{t('projects.livePreview')}</p>
                <div className="cv-project-modal__preview-frame-wrap">
                  <div className="cv-project-modal__preview-card">
                    <iframe
                      src={liveUrl}
                      title={iframeTitle}
                      className="cv-project-modal__iframe"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="cv-project-modal__preview-foot">
                      <p className="cv-project-modal__preview-note">
                        {t(
                          'projects.previewNote',
                          'An embedded preview only appears when the live site allows framing. Many production sites block that on purpose to protect users. If the area above stays empty, open the project in a new window; the full site always loads there.'
                        )}
                      </p>
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cv-project-modal__action"
                      >
                        <Icon name="external-link" size={14} aria-hidden />
                        <span className="cv-project-modal__action-label">
                          {t('projects.openLiveExperience', 'Open in new window')}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="cv-project-modal__resize"
                aria-label={String(t('projects.resizePanel'))}
                onMouseDown={onResizeStart}
              />

              <aside
                className="cv-project-modal__details cv-project-modal__details--split"
                style={isLg ? { width: detailWidth, minWidth: DETAIL_MIN, maxWidth: DETAIL_MAX } : undefined}
              >
                <CaseStudyDetailBody project={project} />
              </aside>
            </div>
          )}
        </div>
      </div>

      {imageLightboxOpen && canOpenImageLightbox ? (
        <div
          className="cv-project-modal__lightbox"
          data-scroll-lock-fixed
          onClick={() => setImageLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxLabel}
        >
          <div className="cv-project-modal__lightbox-panel" onClick={(e) => e.stopPropagation()}>
            <img
              src={resolvedImageSrc}
              alt={showcaseTitle}
              loading="eager"
              decoding="sync"
              className={cn(
                'cv-project-modal__lightbox-img',
                placeholderImage && 'cv-project-modal__lightbox-img--placeholder'
              )}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
