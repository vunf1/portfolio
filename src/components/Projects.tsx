import { useState, useMemo } from 'preact/hooks'
import { useTranslation } from '../contexts/TranslationContext'
import { Section, Icon } from './ui'
import { ProjectCaseStudyModal } from './ProjectCaseStudyModal'
import { cn } from '../lib/utils'
import type { ProjectsProps } from '../types'
import type { Project } from '../types/portfolio'

function projectInitials(name: string): string {
  const parts = name.replace(/[\u2013\u2014\-:].*$/, '').trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export function Projects({ projects }: ProjectsProps) {
  const { t } = useTranslation()
  const [openId, setOpenId] = useState<string | null>(null)

  const selected = useMemo(
    () => (openId ? projects.find((p) => p.id === openId) ?? null : null),
    [openId, projects]
  )

  const openCaseStudy = (p: Project) => {
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
            className={cn('project-showcase-card', 'group text-left')}
            onClick={() => openCaseStudy(project)}
            aria-haspopup="dialog"
            aria-expanded={openId === project.id}
          >
            <span className="project-showcase-card__inner">
              <span className="project-showcase-card__accent" aria-hidden />

              <span className="project-showcase-mark">
                {project.image ? (
                  <img src={project.image} alt="" className="project-showcase-mark__img" loading="lazy" />
                ) : (
                  <span className="project-showcase-mark__initials" aria-hidden>
                    {projectInitials(project.name)}
                  </span>
                )}
              </span>

              <span className="project-showcase-body">
                <span className="project-showcase-title">{project.name}</span>
                <span className="project-showcase-desc">{project.description}</span>
                <span className="project-showcase-meta">
                  <span className="project-showcase-period">{project.period}</span>
                  {project.role ? <span className="project-showcase-role"> · {project.role}</span> : null}
                </span>
              </span>

              <span className="project-showcase-cta" aria-hidden>
                <Icon name="arrow-right" size={18} className="project-showcase-cta__icon" />
              </span>

              <span className="project-showcase-indicator" aria-hidden>
                <span className="project-showcase-indicator__line" />
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
