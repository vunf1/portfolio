import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/preact'
import { ProjectCaseStudyModal } from '../ProjectCaseStudyModal'
import { resetScrollLockForTests } from '../../lib/scrollLock'
import type { Project } from '../../types/portfolio'

vi.mock('../../contexts/TranslationContext', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => {
      const map: Record<string, string> = {
        'projects.openSite': 'Open site',
        'projects.closeModal': 'Close',
        'projects.livePreview': 'Live preview',
        'projects.liveSiteHeading': 'Live site',
        'projects.previewNote': 'Preview note',
        'projects.openLiveExperience': 'Open in new window',
        'projects.previewOpenExternally': 'Open externally copy',
        'projects.framingProtectionLabel': 'Framing protection',
        'projects.previewUnavailable': 'No demo',
        'projects.previewUnavailableTitle': 'No live demo title',
        'projects.openImageFullSize': 'Open full image',
        'projects.viewFullImage': 'Full size',
        'projects.imagePreviewDialog': 'Image preview',
        'projects.overview': 'Overview',
        'projects.features': 'Features',
        'projects.technologies': 'Technologies',
        'projects.security': 'Security',
        'projects.challenges': 'Challenges',
        'projects.solutions': 'Solutions',
        'projects.highlights': 'Highlights',
        'projects.resizePanel': 'Resize panel'
      }
      return map[key] || defaultValue || key
    },
    currentLanguage: 'en',
    changeLanguage: vi.fn(),
    isEnglish: true,
    isPortuguese: false,
    supportedLanguages: ['en', 'pt-PT']
  }),
  preloadTranslations: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('../../utils/getDataUrl', () => ({
  publicAssetUrl: (p: string) => p
}))

const projectFixture = (over: Partial<Project> = {}): Project => ({
  id: 'p1',
  name: 'Sample Case Study',
  description: 'Short',
  longDescription: 'Long description for the modal body.',
  technologies: ['TypeScript'],
  features: ['Feature A'],
  url: 'https://example.com',
  demo: 'https://example.com',
  image: '',
  period: '2024',
  role: 'Lead',
  teamSize: 1,
  highlights: ['Shipped'],
  challenges: '',
  solutions: '',
  ...over
})

describe('ProjectCaseStudyModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetScrollLockForTests()
  })

  it('renders nothing when closed', () => {
    const { container } = render(
      <ProjectCaseStudyModal project={projectFixture()} isOpen={false} onClose={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('closes the case study dialog on Escape', () => {
    const onClose = vi.fn()
    render(<ProjectCaseStudyModal project={projectFixture()} isOpen onClose={onClose} />)

    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.getByText('Sample Case Study')).toBeTruthy()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders stacked layout with security label when embed is disabled', () => {
    render(
      <ProjectCaseStudyModal
        project={projectFixture({ embedInModal: false })}
        isOpen
        onClose={vi.fn()}
      />
    )
    expect(screen.getByText('Framing protection')).toBeTruthy()
    expect(screen.getByText('Open externally copy')).toBeTruthy()
    expect(screen.getByText(/example\.com/)).toBeTruthy()
    expect(document.querySelector('iframe')).toBeNull()
  })

  it('shows initials in header when there is no live URL and no image', () => {
    render(
      <ProjectCaseStudyModal
        project={projectFixture({ url: '', demo: '', image: '', name: 'Alpha Beta Gamma' })}
        isOpen
        onClose={vi.fn()}
      />
    )
    expect(screen.getByText('AB')).toBeTruthy()
    expect(screen.getByText('No demo')).toBeTruthy()
    expect(screen.getByText('No live demo title')).toBeTruthy()
  })

  it('shows project hero image when there is no live URL', () => {
    render(
      <ProjectCaseStudyModal
        project={projectFixture({
          url: '',
          demo: '',
          image: './img/projects/sample.png',
          name: 'With Image'
        })}
        isOpen
        onClose={vi.fn()}
      />
    )
    const img = document.querySelector('img[src="./img/projects/sample.png"]')
    expect(img).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Open full image' })).toBeTruthy()
  })
})
