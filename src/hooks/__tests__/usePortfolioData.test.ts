/* eslint-disable no-console */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/preact'
import { usePortfolioData, useConsolidatedData, dataCache } from '../usePortfolioData'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock useI18n hook
vi.mock('../useI18n', () => ({
  useI18n: () => ({
    currentLanguage: 'en'
  })
}))

// Mock console methods to avoid noise in tests
const originalConsoleLog = console.log
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

// Mock data for testing
const mockPersonalData = {
  name: "João Maia",
  title: "Full-Stack Developer",
  tagline: "Lifelong learner, shipping with creativity",
  subtitle: "Back-end operations, Network, and OOP-focused problem solver",
  email: "joaomaia.trabalho@gmail.com",
  phone: "+351 934 330 807",
  phoneSecondary: "+44 7393 557259",
  location: "Porto, Portugal",
  website: "https://vunf1.github.io/portfolio/",
  profileImage: "./img/profile.jpg",
  summary: "Full-stack developer based in Porto, passionate about learning and creative problem-solving.",
  longSummary: "Since 2010, I've been exploring programming methodologies, computer science, and network architectures.",
  availability: "Open to new opportunities",
  relocation: "Willing to relocate",
  remote: "Open to remote work",
  languages: ["Portuguese — C2 (speaking), C1 (writing), C2 (comprehension)"],
  coreValues: ["Continuous learning", "Creativity with purpose"]
}

const mockContactData = {
  availability: "Open to new opportunities",
  email: "joaomaia.trabalho@gmail.com",
  github: "https://github.com/vunf1",
  linkedin: "https://www.linkedin.com/in/joao-maia",
  location: "Porto, Portugal",
  phone: "+351 934 330 807",
  phoneSecondary: "+44 7393 557259",
  preferredContact: "Email or LinkedIn",
  responseTime: "Within 24 hours",
  website: "https://vunf1.github.io/portfolio/"
}

const mockSocialData = [
  {
    color: "#0077B5",
    description: "Professional profile",
    icon: "devicon-linkedin-plain",
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/joao-maia"
  }
]

const mockExperienceData = [
  {
    title: "Full-Stack Developer",
    company: "Test Company",
    location: "Porto, Portugal",
    period: "2020 - Present",
    duration: "3+ years",
    description: "Test description",
    impact: "Test impact",
    technologies: ["TypeScript", "React"],
    highlights: ["Test highlight"]
  }
]

const mockEducationData = [
  {
    degree: "Bachelor of Applied Science (BASc), Computer Science",
    description: "Undergraduate program in Computer Science.",
    institution: "Coventry University",
    location: "Coventry, United Kingdom"
  }
]

const mockSkillsData = {
  proficiencyLevels: {
    Foundational: "Test foundational",
    Proficient: "Test proficient",
    Advanced: "Test advanced",
    Expert: "Test expert"
  },
  soft: [
    {
      description: "Test description",
      level: "Advanced",
      name: "Test skill"
    }
  ],
  technical: [
    {
      category: "Test Category",
      skills: [
        { name: "Test Skill", level: "Advanced" }
      ]
    }
  ]
}

// const mockProjectsData = [
//   {
//     id: "1",
//     name: "Test Project",
//     description: "Test description",
//     longDescription: "Test long description",
//     technologies: ["TypeScript"],
//     features: ["Test feature"],
//     url: "https://test.com",
//     demo: "https://demo.test.com",
//     image: "test.jpg",
//     period: "2023",
//     role: "Developer",
//     teamSize: 1,
//     highlights: ["Test highlight"],
//     challenges: "Test challenge",
//     solutions: "Test solution"
//   }
// ]

// const mockCertificationsData = [
//   {
//     id: "1",
//     name: "Test Certification",
//     issuer: "Test Issuer",
//     issueDate: "2023-01-01",
//     expiryDate: "2024-01-01",
//     credentialId: "TEST123",
//     description: "Test description",
//     skills: ["Test skill"],
//     verificationUrl: "https://verify.test.com",
//     image: "cert.jpg"
//   }
// ]

// const mockInterestsData = [
//   {
//     category: "Technology",
//     description: "Test description",
//     items: ["Test interest"]
//   }
// ]

// const mockAwardsData = [
//   {
//     id: "1",
//     title: "Test Award",
//     issuer: "Test Issuer",
//     date: "2023-01-01",
//     description: "Test description",
//     criteria: "Test criteria",
//     impact: "Test impact",
//     certificateUrl: "https://cert.test.com"
//   }
// ]

// const mockTestimonialsData = [
//   {
//     id: "1",
//     name: "Test Person",
//     position: "Test Position",
//     company: "Test Company",
//     content: "Test testimonial",
//     rating: 5,
//     date: "2023-01-01"
//   }
// ]

const mockMetaData = {
  author: "João Maia",
  lastUpdated: "2025-01-01",
  seo: {
    description: "Test description",
    keywords: ["test", "keywords"],
    ogImage: "test.jpg",
    title: "Test Title"
  },
  version: "1.0.0"
}

const mockUIData = {
  navigation: {
    brand: "João Maia",
    about: "About",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certifications",
    interests: "Interests",
    awards: "Awards",
    testimonials: "Testimonials",
    contact: "Contact"
  },
  hero: {
    title: "Full-Stack Developer",
    subtitle: "Back-end Ops • Network • OOP",
    tagline: "Always learning. Building with purpose.",
    cta: "View Portfolio",
    scrollDown: "Scroll Down"
  }
}

describe('usePortfolioData Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockClear()
    console.log = vi.fn()
    console.error = vi.fn()
    console.warn = vi.fn()
    
    // Clear the data cache to ensure fresh state for each test
    dataCache.clear()
  })

  afterEach(() => {
    console.log = originalConsoleLog
    console.error = originalConsoleError
    console.warn = originalConsoleWarn
    vi.restoreAllMocks()
  })

  it('initializes with loading state', () => {
    const { result } = renderHook(() => usePortfolioData())
    
    expect(result.current.loading).toBe(true)
    expect(result.current.portfolioData).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('loads portfolio data successfully', async () => {
    // Mock successful responses for all required files
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockPersonalData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockContactData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSocialData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockExperienceData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockEducationData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSkillsData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockMetaData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // projects
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // certifications
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // interests
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // awards
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // testimonials
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockUIData) }) // ui
      // Repeat for pt-PT
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockPersonalData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockContactData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSocialData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockExperienceData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockEducationData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSkillsData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockMetaData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // projects
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // certifications
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // interests
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // awards
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // testimonials
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockUIData) }) // ui

    const { result } = renderHook(() => usePortfolioData())

    await act(async () => {
      // Wait for the hook to finish loading
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.portfolioData).toBeDefined()
    expect(result.current.portfolioData?.personal).toEqual(mockPersonalData)
    
    // Contact data should now be returned as-is (filtering handled by Contact component)
    expect(result.current.portfolioData?.contact).toEqual(mockContactData)
  })

  it('loads only critical sections initially', async () => {
    // Mock successful responses for all required files
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockPersonalData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockContactData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSocialData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockExperienceData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockEducationData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSkillsData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockMetaData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // projects
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // certifications
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // interests
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // awards
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // testimonials
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockUIData) }) // ui
      // Repeat for pt-PT
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockPersonalData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockContactData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSocialData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockExperienceData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockEducationData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSkillsData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockMetaData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // projects
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // certifications
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // interests
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // awards
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // testimonials
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockUIData) }) // ui

    const { result } = renderHook(() => usePortfolioData())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    // Should only have critical sections loaded initially, non-critical sections should be empty
    expect(result.current.portfolioData?.projects).toHaveLength(0)
    expect(result.current.portfolioData?.certifications).toHaveLength(0)
    expect(result.current.portfolioData?.interests).toHaveLength(0)
    expect(result.current.portfolioData?.awards).toHaveLength(0)
    expect(result.current.portfolioData?.testimonials).toHaveLength(0)
  })

  it('handles fetch errors gracefully', async () => {
    // Mock fetch to reject on all calls
    mockFetch.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => usePortfolioData())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(result.current.loading).toBe(false)
    // The error should be caught and handled, resulting in null data
    expect(result.current.portfolioData).toBe(null)
    // Error state should be set
    expect(result.current.error).toBeDefined()
  })

  it('handles invalid response data', async () => {
    // Mock responses that return invalid data
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // personal
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // contact
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // social
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // experience
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // education
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // skills
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // meta
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // projects
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // certifications
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // interests
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // awards
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // testimonials
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockUIData) }) // ui
      // Repeat for pt-PT
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockUIData) })

    const { result } = renderHook(() => usePortfolioData())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(result.current.loading).toBe(false)
    if (result.current.error) {
      expect(result.current.error).toBeInstanceOf(Error)
    }
  })

  it('provides loadSection function', () => {
    const { result } = renderHook(() => usePortfolioData())
    
    expect(typeof result.current.loadSection).toBe('function')
  })

  it('provides loadAllSections function', () => {
    const { result } = renderHook(() => usePortfolioData())
    
    expect(typeof result.current.loadAllSections).toBe('function')
  })

  it('provides isSectionLoaded function', () => {
    const { result } = renderHook(() => usePortfolioData())
    
    expect(typeof result.current.isSectionLoaded).toBe('function')
  })

  it('provides getSectionLoadingStatus function', () => {
    const { result } = renderHook(() => usePortfolioData())
    
    expect(typeof result.current.getSectionLoadingStatus).toBe('function')
  })

  it('returns loaded sections array', () => {
    const { result } = renderHook(() => usePortfolioData())
    
    expect(Array.isArray(result.current.loadedSections)).toBe(true)
  })

  it('checks if section is loaded correctly', () => {
    const { result } = renderHook(() => usePortfolioData())
    
    // Critical sections should be considered loaded initially
    expect(result.current.isSectionLoaded('personal')).toBe(true)
    expect(result.current.isSectionLoaded('contact')).toBe(true)
    expect(result.current.isSectionLoaded('social')).toBe(true)
    expect(result.current.isSectionLoaded('experience')).toBe(true)
    expect(result.current.isSectionLoaded('education')).toBe(true)
    expect(result.current.isSectionLoaded('skills')).toBe(true)
    expect(result.current.isSectionLoaded('meta')).toBe(true)
    
    // Non-critical sections should not be loaded initially
    expect(result.current.isSectionLoaded('projects')).toBe(false)
    expect(result.current.isSectionLoaded('certifications')).toBe(false)
  })

  it('returns correct loading status for sections', async () => {
    // Mock successful responses for all required files
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockPersonalData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockContactData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSocialData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockExperienceData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockEducationData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSkillsData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockMetaData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockUIData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // projects
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // certifications
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // interests
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // awards
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // testimonials
      // Repeat for pt-PT
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockPersonalData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockContactData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSocialData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockExperienceData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockEducationData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSkillsData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockMetaData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockUIData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // projects
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // certifications
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // interests
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // awards
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // testimonials

    const { result } = renderHook(() => usePortfolioData())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })
    
    // Critical sections should be marked as 'loaded' after loading
    expect(result.current.getSectionLoadingStatus('personal')).toBe('loaded')
    expect(result.current.getSectionLoadingStatus('contact')).toBe('loaded')
    expect(result.current.getSectionLoadingStatus('social')).toBe('loaded')
    expect(result.current.getSectionLoadingStatus('experience')).toBe('loaded')
    expect(result.current.getSectionLoadingStatus('education')).toBe('loaded')
    expect(result.current.getSectionLoadingStatus('skills')).toBe('loaded')
    expect(result.current.getSectionLoadingStatus('meta')).toBe('loaded')
    expect(result.current.getSectionLoadingStatus('ui')).toBe('loaded')
    
    // Non-critical sections should be marked as 'pending'
    expect(result.current.getSectionLoadingStatus('projects')).toBe('pending')
    expect(result.current.getSectionLoadingStatus('certifications')).toBe('pending')
  })
})

describe('useConsolidatedData Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockClear()
    console.log = vi.fn()
    console.error = vi.fn()
    console.warn = vi.fn()
    
    // Clear the data cache to ensure fresh state for each test
    dataCache.clear()
  })

  afterEach(() => {
    console.log = originalConsoleLog
    console.error = originalConsoleError
    console.warn = originalConsoleWarn
    vi.restoreAllMocks()
  })

  it('initializes with loading state', () => {
    const { result } = renderHook(() => useConsolidatedData())
    
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('loads consolidated data successfully', async () => {
    // Mock successful responses for all required files
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockPersonalData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockContactData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSocialData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockExperienceData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockEducationData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSkillsData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockMetaData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockUIData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // projects
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // certifications
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // interests
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // awards
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // testimonials

    const { result } = renderHook(() => useConsolidatedData())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.data).toBeDefined()
    expect(result.current.data?.portfolio.personal).toEqual(mockPersonalData)
    
    // Contact data should now be returned as-is (filtering handled by Contact component)
    expect(result.current.data?.portfolio.contact).toEqual(mockContactData)
    expect(result.current.data?.ui).toEqual(mockUIData)
  })

  it('handles fetch errors in consolidated data', async () => {
    // Mock fetch to reject on all calls
    mockFetch.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useConsolidatedData())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(result.current.loading).toBe(false)
    // The error should be caught and handled, resulting in null data
    expect(result.current.data).toBe(null)
    // Error state should be set
    expect(result.current.error).toBeDefined()
  })

  it('handles invalid response data in consolidated data', async () => {
    // Mock responses that return invalid data
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // personal
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // contact
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // social
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // experience
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // education
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // skills
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // meta
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(null) }) // ui
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // projects
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // certifications
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // interests
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // awards
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }) // testimonials

    const { result } = renderHook(() => useConsolidatedData())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(result.current.loading).toBe(false)
    if (result.current.error) {
      expect(result.current.error).toBeInstanceOf(Error)
    }
  })
})