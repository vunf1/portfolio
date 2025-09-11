import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage with English as default
const localStorageMock = {
  getItem: vi.fn((key: string) => {
    // Always return English for tests unless specifically testing language switching
    if (key === 'i18nextLng') return 'en'
    return null
  }),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock window.location
delete (window as any).location
window.location = {
  ...window.location,
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
}

// Mock fetch for translation data
global.fetch = vi.fn()

// Mock translation data
const mockTranslationData = {
  portfolio: {
    personal: {
      name: 'João Maia',
      title: 'Full-Stack Developer',
      subtitle: 'Back-end Ops • Network • OOP',
      summary: 'Experienced full-stack developer specializing in React, Node.js, and cloud technologies',
      coreValues: ['Innovation', 'Quality', 'Collaboration'],
      profileImage: '/img/profile.jpg'
    },
    social: [
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/joaomaia',
        icon: 'fa-linkedin',
        color: '#0077B5'
      },
      {
        name: 'GitHub',
        url: 'https://github.com/joaomaia',
        icon: 'fa-github',
        color: '#333'
      }
    ]
  },
  ui: {
    hero: {
      title: 'Full-Stack Developer',
      subtitle: 'Back-end Ops • Network • OOP',
      cta: 'Get In Touch',
      tagline: 'Always learning. Building with purpose.'
    },
    navigation: {
      brand: 'João Maia',
      about: 'About',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      projects: 'View Projects',
      contact: 'Contact'
    }
  }
}

// Mock fetch implementation
;(global.fetch as any).mockImplementation((url: string) => {
  if (url.includes('portfolio-en.json') || url.includes('portfolio-pt-PT.json')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockTranslationData)
    })
  }
  return Promise.reject(new Error('Unmocked fetch call'))
})