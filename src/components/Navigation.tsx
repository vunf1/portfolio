import { useState, useEffect } from 'preact/hooks'
import { useTranslation } from '../contexts/TranslationContext'
import type { NavigationProps } from '../types/components'

export function Navigation({ 
  items, 
  activeId, 
  onNavigate, 
  variant = 'horizontal',
  className = '',
  id 
}: NavigationProps) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    // Close mobile menu when clicking outside
    const handleClickOutside = (event: Event) => {
      const target = event.target as Element
      const nav = document.querySelector('.premium-nav')
      const toggle = document.querySelector('.nav-toggle')
      
      if (nav && toggle && !nav.contains(target) && !toggle.contains(target)) {
        setIsNavCollapsed(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('click', handleClickOutside)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const toggleNav = () => {
    setIsNavCollapsed(!isNavCollapsed)
  }

  const scrollToSection = (sectionId: string) => {
    // Alternative approach: Use a more reliable method to find and scroll to sections
    const scrollToElement = () => {
      // Method 1: Try getElementById first (fastest)
      let element = document.getElementById(sectionId)
      
      // Method 2: If not found, try querySelector with more specific selector
      if (!element) {
        element = document.querySelector(`section[id="${sectionId}"]`)
      }
      
      // Method 3: If still not found, try finding by data attribute or class
      if (!element) {
        element = document.querySelector(`[data-section="${sectionId}"]`)
      }
      
      // Method 4: Last resort - find by section class and check if it contains the ID
      if (!element) {
        const sections = document.querySelectorAll('section')
        for (const section of sections) {
          if (section.id === sectionId) {
            element = section
            break
          }
        }
      }
      
      if (element) {
        // Calculate the scroll position accounting for fixed navbar
        const navHeight = 80
        const offset = 20
        const elementRect = element.getBoundingClientRect()
        const elementTop = elementRect.top + window.pageYOffset - navHeight - offset
        
        // Smooth scroll to the calculated position
        window.scrollTo({
          top: elementTop,
          behavior: 'smooth'
        })
        
        return true
      }
      
      return false
    }
    
    // Try to scroll immediately
    if (!scrollToElement()) {
      // If not found, use a more aggressive approach with multiple attempts
      let attempts = 0
      const maxAttempts = 10
      
      const retryScroll = () => {
        attempts++
        
        if (scrollToElement()) {
          return // Success!
        }
        
        if (attempts < maxAttempts) {
          // Try again with increasing delay
          const delay = attempts * 100 // 100ms, 200ms, 300ms, etc.
          setTimeout(retryScroll, delay)
        } else {
          // Final fallback: scroll to top
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }
      }
      
      // Start retry process
      setTimeout(retryScroll, 50) // Small initial delay
    }
    
    if (window.innerWidth < 992) {
      setIsNavCollapsed(true)
    }
    
    onNavigate?.(sectionId)
  }

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsNavCollapsed(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navClasses = [
    'premium-nav',
    variant !== 'horizontal' && `nav-${variant}`,
    isScrolled && 'scrolled',
    className
  ].filter(Boolean).join(' ')

  return (
    <nav className={navClasses} id={id || 'sideNav'}>
      <div className="nav-container">
        {/* Brand */}
        <a 
          className="nav-brand" 
          href="#hero" 
          onClick={(e) => {
            e.preventDefault()
            scrollToSection('hero')
          }}
        >
          <div className="brand-content">
            <div className="brand-avatar-container">
              <img 
                className="brand-avatar" 
                src="/img/optimized/profile-sm.jpeg"
                alt="Profile"
                loading="lazy"
              />
            </div>
            <div className="brand-text">
              <span className="brand-name">{t('navigation.brand')}</span>
              <span className="brand-title">{t('hero.title')}</span>
            </div>
          </div>
        </a>

        {/* Navigation Items */}
        <div className={`nav-menu ${isNavCollapsed ? 'collapsed' : ''}`}>
          <ul className="nav-list">
            {items.map((item) => (
              <li key={item.id} className="nav-item">
                <a
                  href={`#${item.id}`}
                  className={`nav-link ${activeId === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(item.id)
                  }}
                >
                  {item.icon && <i className={item.icon}></i>}
                  <span className="nav-text">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Toggle */}
        <button
          className="nav-toggle"
          onClick={toggleNav}
          aria-label="Toggle navigation menu"
          aria-expanded={!isNavCollapsed}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
    </nav>
  )
}
