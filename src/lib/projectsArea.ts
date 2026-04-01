import type { Project } from '../types/portfolio'

export function isProjectShownInProjectsArea(project: Project): boolean {
  return project.projectsArea !== 'off'
}

export function filterProjectsForProjectsArea(projects: Project[] | undefined): Project[] {
  if (!projects?.length) {
    return []
  }
  return projects.filter(isProjectShownInProjectsArea)
}
