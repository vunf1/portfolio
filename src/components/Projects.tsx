import { useState, useMemo, useRef, useEffect } from 'preact/hooks'
import { useTranslation } from '../contexts/TranslationContext'
import { Section } from './ui'
import { ProjectCaseStudyModal } from './ProjectCaseStudyModal'
import { cn } from '../lib/utils'
import { projectInitials } from '../lib/projectInitials'
import { getShowcaseTechnologyDisplay, techTagClassName } from '../lib/projectShowcaseTechnologies'
import { getProjectShowcaseTitle } from '../lib/projectShowcaseTitle'
import { publicAssetUrl } from '../utils/getDataUrl'
import type { ProjectsProps } from '../types'
import type { Project } from '../types/portfolio'

const SHOWCASE_TECH_LIMIT = 5

function ProjectShowcaseTechnologies({
  technologies,
  label,
}: {
  technologies: string[]
  label: string
}) {
  if (!technologies.length) {
    return null
  }

  const { visible, overflow } = getShowcaseTechnologyDisplay(technologies, SHOWCASE_TECH_LIMIT)

  return (
    <span className="cv-tags cv-tags--compact" aria-label={label}>
      {visible.map((tech, index) => (
        <span key={`${tech}-${index}`} className={techTagClassName(tech)}>
          {tech}
        </span>
      ))}
      {overflow > 0 ? (
        <span className="cv-tag cv-tag--more">
          +{overflow}
        </span>
      ) : null}
    </span>
  )
}

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
      <div id="projects-content" className="cv-project-grid">
        {projects.map((project, index) => (
          <button
            key={project.id || index}
            type="button"
            className={cn('cv-project-card', 'text-left')}
            onClick={(e) => openCaseStudy(project, e.currentTarget)}
            aria-haspopup="dialog"
            aria-expanded={openId === project.id}
            aria-label={String(
              t('projects.viewCaseAria', 'Open case study: {{name}}', {
                name: getProjectShowcaseTitle(project.name)
              })
            )}
          >
            <span className="cv-project-card__inner">
              <span className="cv-project-card__media">
                {project.image ? (
                  <img
                    src={publicAssetUrl(project.image)}
                    alt=""
                    className="cv-project-card__img"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="cv-project-card__initials" aria-hidden>
                    {projectInitials(getProjectShowcaseTitle(project.name))}
                  </span>
                )}
              </span>

              <span className="cv-project-card__body">
                <span className="cv-project-card__title">{getProjectShowcaseTitle(project.name)}</span>
                <span className="cv-project-card__meta">
                  <span className="cv-project-card__period">{project.period}</span>
                  {project.role ? <span className="cv-project-card__role">{project.role}</span> : null}
                </span>
                {project.description ? (
                  <span className="cv-project-card__excerpt">{project.description}</span>
                ) : null}
                <ProjectShowcaseTechnologies
                  technologies={project.technologies ?? []}
                  label={String(t('projects.technologies'))}
                />
                <span className="cv-project-card__cta" aria-hidden>
                  {t('projects.viewCase', 'View case')}
                </span>
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
