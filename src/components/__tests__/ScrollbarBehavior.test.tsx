import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render } from '@testing-library/preact'
import { LandingPage } from '../landing/LandingPage'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import { useTranslation } from '../../contexts/TranslationContext'

// Mock hooks
vi.mock('../../hooks/usePortfolioData')
vi.mock('../../contexts/TranslationContext')

// Mock IntersectionObserver with more realistic behavior
class MockIntersectionObserver {
  root = null
  rootMargin = ''
  thresholds = []
  callback: IntersectionObserverCallback
  
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }
  
  observe() {
    // Simulate elements becoming visible
    setTimeout(() => {
      const mockEntry = {
        target: document.createElement('div'),
        isIntersecting: true,
        intersectionRatio: 1,
        boundingClientRect: {} as DOMRectReadOnly,
        rootBounds: null,
        intersectionRect: {} as DOMRectReadOnly,
        time: Date.now()
      }
      this.callback([mockEntry as IntersectionObserverEntry], this)
    }, 0)
  }
  
  disconnect() {}
  unobserve() {}
  takeRecords() { return [] }
}

global.IntersectionObserver = MockIntersectionObserver as typeof IntersectionObserver

describe('Scrollbar Behavior Tests', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''
    document.documentElement.innerHTML = '<head></head><body></body>'
    document.body.className = ''
    document.documentElement.className = ''
    
    // Reset styles
    document.documentElement.style.cssText = ''
    document.body.style.cssText = ''
    
    // Mock usePortfolioData with complete Personal interface
    ;(usePortfolioData as any).mockReturnValue({
      portfolioData: {
        personal: {
          name: 'João Maia',
          title: 'Full-Stack Developer',
          tagline: 'Test tagline',
          subtitle: 'Test subtitle',
          email: 'test@example.com',
          phone: '+351912345678',
          phoneSecondary: '+351912345679',
          location: 'Porto, Portugal',
          website: 'https://example.com',
          profileImage: './img/profile.jpg',
          summary: 'Test summary',
          longSummary: 'Test long summary',
          availability: 'Available',
          relocation: 'Open to relocation',
          remote: 'Remote available',
          languages: ['English', 'Portuguese'],
          coreValues: ['Innovation', 'Quality', 'Collaboration']
        },
        social: []
      },
      loading: false
    })
    
    // Mock useTranslation
    ;(useTranslation as any).mockReturnValue({
      currentLanguage: 'en',
      t: (key: string) => key
    })
  })
  
  afterEach(() => {
    // Cleanup
    document.body.innerHTML = ''
    document.documentElement.className = ''
    document.body.className = ''
  })
  
  describe('HTML element scrollbar behavior', () => {
    it('should set html height to auto when landing-page-active class is added', () => {
      const app = document.createElement('div')
      app.id = 'app'
      document.body.appendChild(app)
      
      render(
        <LandingPage 
          onNavigateToPortfolio={() => {}}
          onWarmPortfolio={() => {}}
        />,
        app
      )
      
      // Wait for useEffect to run
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const html = document.documentElement
          const computedStyle = window.getComputedStyle(html)
          
          // Check if landing-page-active class is applied
          expect(html.classList.contains('landing-page-active')).toBe(true)
          
          // Check height is auto (not 100%)
          expect(computedStyle.height).not.toBe('100%')
          expect(computedStyle.height).not.toBe('100vh')
          
          resolve()
        }, 100)
      })
    })
    
    it('should have overflow-y: auto on html element', () => {
      const app = document.createElement('div')
      app.id = 'app'
      document.body.appendChild(app)
      
      render(
        <LandingPage 
          onNavigateToPortfolio={() => {}}
          onWarmPortfolio={() => {}}
        />,
        app
      )
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const html = document.documentElement
          const computedStyle = window.getComputedStyle(html)
          
          // HTML should have overflow-y: auto (scrollable)
          expect(computedStyle.overflowY).toBe('auto')
          expect(computedStyle.overflowX).toBe('hidden')
          
          resolve()
        }, 100)
      })
    })
    
    it('should have body overflow visible (not creating scrollbar)', () => {
      const app = document.createElement('div')
      app.id = 'app'
      document.body.appendChild(app)
      
      render(
        <LandingPage 
          onNavigateToPortfolio={() => {}}
          onWarmPortfolio={() => {}}
        />,
        app
      )
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const body = document.body
          const computedStyle = window.getComputedStyle(body)
          
          // Body should have overflow: visible (not creating scrollbar)
          expect(computedStyle.overflow).toBe('visible')
          expect(computedStyle.overflowY).toBe('visible')
          expect(computedStyle.overflowX).toBe('hidden')
          
          resolve()
        }, 100)
      })
    })
    
    it('should have #app overflow visible (not creating scrollbar)', () => {
      const app = document.createElement('div')
      app.id = 'app'
      document.body.appendChild(app)
      
      render(
        <LandingPage 
          onNavigateToPortfolio={() => {}}
          onWarmPortfolio={() => {}}
        />,
        app
      )
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const appElement = document.getElementById('app')
          if (appElement) {
            const computedStyle = window.getComputedStyle(appElement)
            
            // #app should have overflow: visible
            expect(computedStyle.overflow).toBe('visible')
            expect(computedStyle.overflowY).toBe('visible')
            expect(computedStyle.overflowX).toBe('hidden')
          }
          
          resolve()
        }, 100)
      })
    })
  })
  
  describe('Height calculation consistency', () => {
    it('should maintain consistent html height after scroll', () => {
      const app = document.createElement('div')
      app.id = 'app'
      document.body.appendChild(app)
      
      render(
        <LandingPage 
          onNavigateToPortfolio={() => {}}
          onWarmPortfolio={() => {}}
        />,
        app
      )
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const html = document.documentElement
          const initialHeight = html.scrollHeight
          const initialClientHeight = html.clientHeight
          
          // Simulate scroll to bottom
          html.scrollTop = html.scrollHeight
          
          // Wait a bit
          setTimeout(() => {
            const afterScrollHeight = html.scrollHeight
            const afterClientHeight = html.clientHeight
            
            // Heights should remain consistent
            expect(afterScrollHeight).toBe(initialHeight)
            // Client height might change slightly, but shouldn't be drastically different
            expect(Math.abs(afterClientHeight - initialClientHeight)).toBeLessThan(100)
            
            resolve()
          }, 50)
        }, 100)
      })
    })
    
    it('should not have conflicting height rules between base.css and layout.css', () => {
      const app = document.createElement('div')
      app.id = 'app'
      document.body.appendChild(app)
      
      render(
        <LandingPage 
          onNavigateToPortfolio={() => {}}
          onWarmPortfolio={() => {}}
        />,
        app
      )
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const html = document.documentElement
          const computedStyle = window.getComputedStyle(html)
          
          // When landing-page-active is present, height should be auto (from layout.css)
          // Not 100% (from base.css)
          if (html.classList.contains('landing-page-active')) {
            expect(computedStyle.height).not.toBe('100%')
            expect(computedStyle.height).not.toBe('100vh')
          }
          
          resolve()
        }, 100)
      })
    })
  })
  
  describe('Scrollbar visibility detection', () => {
    it('should detect if scrollbar is present on html element', () => {
      const app = document.createElement('div')
      app.id = 'app'
      document.body.appendChild(app)
      
      // Create a tall page to force scrollbar
      const tallContent = document.createElement('div')
      tallContent.style.height = '2000px'
      app.appendChild(tallContent)
      
      render(
        <LandingPage 
          onNavigateToPortfolio={() => {}}
          onWarmPortfolio={() => {}}
        />,
        app
      )
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const html = document.documentElement
          const hasScrollbar = html.scrollHeight > html.clientHeight
          
          // If content is tall, scrollbar should be present
          expect(hasScrollbar).toBe(true)
          
          // Check that only html has scrollbar, not body or #app
          const body = document.body
          const appElement = document.getElementById('app')
          
          if (appElement) {
            const bodyHasScrollbar = body.scrollHeight > body.clientHeight
            const appHasScrollbar = appElement.scrollHeight > appElement.clientHeight
            
            // Body and app should not have scrollbars
            expect(bodyHasScrollbar).toBe(false)
            expect(appHasScrollbar).toBe(false)
          }
          
          resolve()
        }, 100)
      })
    })
    
    it('should not have double scrollbars (html and body both scrolling)', () => {
      const app = document.createElement('div')
      app.id = 'app'
      document.body.appendChild(app)
      
      // Create tall content
      const tallContent = document.createElement('div')
      tallContent.style.height = '2000px'
      app.appendChild(tallContent)
      
      render(
        <LandingPage 
          onNavigateToPortfolio={() => {}}
          onWarmPortfolio={() => {}}
        />,
        app
      )
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const html = document.documentElement
          const body = document.body
          
          const htmlHasScrollbar = html.scrollHeight > html.clientHeight
          const bodyHasScrollbar = body.scrollHeight > body.clientHeight
          
          // Only html should have scrollbar, not both
          if (htmlHasScrollbar) {
            expect(bodyHasScrollbar).toBe(false)
          }
          
          resolve()
        }, 100)
      })
    })
  })
  
  describe('Dynamic scrollbar behavior', () => {
    it('should maintain scrollbar state after scrolling to bottom', () => {
      const app = document.createElement('div')
      app.id = 'app'
      document.body.appendChild(app)
      
      // Create tall content
      const tallContent = document.createElement('div')
      tallContent.style.height = '2000px'
      app.appendChild(tallContent)
      
      render(
        <LandingPage 
          onNavigateToPortfolio={() => {}}
          onWarmPortfolio={() => {}}
        />,
        app
      )
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const html = document.documentElement
          
          // Initial state
          const initialScrollHeight = html.scrollHeight
          const initialClientHeight = html.clientHeight
          const initialHasScrollbar = initialScrollHeight > initialClientHeight
          
          // Scroll to bottom
          html.scrollTop = html.scrollHeight
          
          // Wait for any potential reflows
          setTimeout(() => {
            const afterScrollHeight = html.scrollHeight
            const afterClientHeight = html.clientHeight
            const afterHasScrollbar = afterScrollHeight > afterClientHeight
            
            // Scrollbar state should remain consistent
            expect(afterHasScrollbar).toBe(initialHasScrollbar)
            expect(afterScrollHeight).toBe(initialScrollHeight)
            
            resolve()
          }, 100)
        }, 100)
      })
    })
    
    it('should not change scrollbar visibility when sections become visible', () => {
      const app = document.createElement('div')
      app.id = 'app'
      document.body.appendChild(app)
      
      render(
        <LandingPage 
          onNavigateToPortfolio={() => {}}
          onWarmPortfolio={() => {}}
        />,
        app
      )
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const html = document.documentElement
          
          // Initial state
          const initialScrollHeight = html.scrollHeight
          const initialClientHeight = html.clientHeight
          
          // Simulate sections becoming visible (IntersectionObserver callback)
          const sections = document.querySelectorAll('.landing-section')
          sections.forEach(section => {
            section.classList.add('section-visible')
          })
          
          // Force reflow
          void html.offsetHeight
          
          setTimeout(() => {
            const afterScrollHeight = html.scrollHeight
            const afterClientHeight = html.clientHeight
            
            // Height should not change significantly when sections become visible
            // (sections should already be in DOM, just with opacity/transform)
            expect(Math.abs(afterScrollHeight - initialScrollHeight)).toBeLessThan(50)
            
            resolve()
          }, 100)
        }, 200)
      })
    })
  })
  
  describe('Cleanup on unmount', () => {
    it('should remove landing-page-active classes on unmount', () => {
      const app = document.createElement('div')
      app.id = 'app'
      document.body.appendChild(app)
      
      const { unmount } = render(
        <LandingPage 
          onNavigateToPortfolio={() => {}}
          onWarmPortfolio={() => {}}
        />,
        app
      )
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // Verify classes are added
          expect(document.documentElement.classList.contains('landing-page-active')).toBe(true)
          expect(document.body.classList.contains('landing-page-active')).toBe(true)
          
          // Unmount
          unmount()
          
          // Wait for cleanup
          setTimeout(() => {
            // Classes should be removed
            expect(document.documentElement.classList.contains('landing-page-active')).toBe(false)
            expect(document.body.classList.contains('landing-page-active')).toBe(false)
            
            resolve()
          }, 50)
        }, 100)
      })
    })
  })
})

