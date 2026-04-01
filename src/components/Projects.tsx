import { useState, useMemo, useRef, useEffect } from 'preact/hooks'
import { useTranslation } from '../contexts/TranslationContext'
import { Section } from './ui'
import { ProjectCaseStudyModal } from './ProjectCaseStudyModal'
import { cn } from '../lib/utils'
import { projectInitials } from '../lib/projectInitials'
import { publicAssetUrl } from '../utils/getDataUrl'
import type { ProjectsProps } from '../types'
import type { Project } from '../types/portfolio'

export function Projects({ projects }: ProjectsProps) {
  const { t } = useTranslation()
  const [openId, setOpenId] = useState<string | null>(null)
  const returnFocusRef = useRef<HTMLButtonElement | null>(null)
  const prevOpenIdRef = useRef<string | null>(null)

  const selected = useMemo(
    () => (openId ? projects.find((p) => p.id === openId) ?? null : null),
    [openId, projects]
  )

  useEffect(() => {
    if (prevOpenIdRef.current !== null && openId === null) {
      returnFocusRef.current?.focus({ preventScroll: true })
    }
    prevOpenIdRef.current = openId
  }, [openId])

  const openCaseStudy = (p: Project, trigger: HTMLButtonElement) => {
    returnFocusRef.current = trigger
    setOpenId(p.id)
  }

  return (
    <Section
      id="projects"
      data-section="projects"
      title={String(t('projects.title'))}
      subtitle={String(t('projects.subtitle'))}
    >
      <div id="projects-content" className="projects-showcase-grid">
        {projects.map((project, index) => (
          <button
            key={project.id || index}
            type="button"
            className={cn('project-showcase-card', 'text-left')}
            onClick={(e) => openCaseStudy(project, e.currentTarget)}
            aria-haspopup="dialog"
            aria-expanded={openId === project.id}
          >
            <span className="project-showcase-card__inner">
              <span className="project-showcase-media">
                {project.image ? (
                  <img
                    src={publicAssetUrl(project.image)}
                    alt=""
                    className="project-showcase-media__img"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="project-showcase-media__initials" aria-hidden>
                    {projectInitials(project.name)}
                  </span>
                )}
              </span>

              <span className="project-showcase-body">
                <span className="project-showcase-title">{project.name}</span>
                <span className="project-showcase-meta">
                  <span className="project-showcase-period">{project.period}</span>
                  {project.role ? <span className="project-showcase-role"> · {project.role}</span> : null}
                </span>
                <span className="project-showcase-desc">{project.description}</span>
              </span>
            </span>
          </button>
        ))}
      </div>

      <ProjectCaseStudyModal
        project={selected}
        isOpen={Boolean(openId && selected)}
        onClose={() => setOpenId(null)}
      />
    </Section>
  )
}
