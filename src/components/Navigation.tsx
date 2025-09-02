import { useState, useEffect } from 'preact/hooks'
import { useI18n } from '../hooks/useI18n'
import type { NavigationProps } from '../types'

export function Navigation({ personal, portfolioData, isDarkMode, onThemeToggle, activeSection }: NavigationProps) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true) // Start collapsed (closed)
  const [isScrolled, setIsScrolled] = useState(false)
  const { t, changeLanguage, currentLanguage } = useI18n()

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
    setIsNavCollapsed(!isNavCollapsed) // Toggle between open/closed
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // Calculate the offset to stop at the section title
      const navHeight = 80 // Approximate navigation height
      const offset = 20 // Additional offset for better positioning
      const elementTop = element.offsetTop - navHeight - offset
      
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      })
    }
    // Close mobile nav on click
    if (window.innerWidth < 992) {
      setIsNavCollapsed(true) // Close menu (collapsed = true)
    }
  }

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsNavCollapsed(true) // Close menu on desktop
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItems = [
    { id: 'about', label: t('navigation.about'), icon: 'fa-solid fa-user' },
    { id: 'experience', label: t('navigation.experience'), icon: 'fa-solid fa-briefcase' },
    { id: 'education', label: t('navigation.education'), icon: 'fa-solid fa-graduation-cap' },
    { id: 'skills', label: t('navigation.skills'), icon: 'fa-solid fa-code' },
    // Only show sections that have data
    ...(portfolioData.projects && portfolioData.projects.length > 0 ? [{ id: 'projects', label: t('navigation.projects'), icon: 'fa-solid fa-folder' }] : []),
    ...(portfolioData.certifications && portfolioData.certifications.length > 0 ? [{ id: 'certifications', label: t('navigation.certifications'), icon: 'fa-solid fa-certificate' }] : []),
    ...(portfolioData.testimonials && portfolioData.testimonials.length > 0 ? [{ id: 'testimonials', label: t('navigation.testimonials'), icon: 'fa-solid fa-quote-left' }] : []),
    ...(portfolioData.interests && portfolioData.interests.length > 0 ? [{ id: 'interests', label: t('navigation.interests'), icon: 'fa-solid fa-heart' }] : []),
    ...(portfolioData.awards && portfolioData.awards.length > 0 ? [{ id: 'awards', label: t('navigation.awards'), icon: 'fa-solid fa-trophy' }] : []),
    { id: 'contact', label: t('navigation.contact'), icon: 'fa-solid fa-envelope' }
  ]

  return (
    <nav className={`premium-nav ${isScrolled ? 'scrolled' : ''}`} id="sideNav">
      <div className="nav-container">
        {/* Enhanced Brand */}
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
                src={personal.profileImage} 
                alt={`${personal.name} Profile`}
              />
              <div className="brand-avatar-glow"></div>
            </div>
            <div className="brand-text">
              <span className="brand-name">{personal.name}</span>
              <span className="brand-title">{personal.title}</span>
            </div>
          </div>
        </a>
        
        {/* Mobile Toggle */}
        <button 
          className="nav-toggle" 
          onClick={toggleNav}
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="toggle-icon">
            <i className="fa-solid fa-bars"></i>
          </span>
        </button>
        
        {/* Navigation Menu */}
        <div className={`nav-menu ${isNavCollapsed ? '' : 'show'}`}>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.id} className="nav-item">
                <a 
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(item.id)
                  }}
                >
                  <i className={`${item.icon} nav-icon`}></i>
                  <span className="nav-label">{item.label}</span>
                </a>
              </li>
            ))}
            
            {/* Theme Toggle */}
            <li className="nav-item theme-toggle">
              <button 
                className="theme-btn"
                onClick={onThemeToggle}
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
              >
                <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
            </li>
            
            {/* Language Toggle */}
            <li className="nav-item language-toggle">
              <button 
                className="language-btn"
                onClick={() => {
                  // Add a small delay to show the transition effect
                  document.documentElement.classList.add('language-changing')
                  setTimeout(() => {
                    changeLanguage(currentLanguage === 'en' ? 'pt-PT' : 'en')
                    document.documentElement.classList.remove('language-changing')
                  }, 150)
                }}
                aria-label={`Switch to ${currentLanguage === 'en' ? 'Portuguese' : 'English'}`}
              >
                <span className="flag-emoji">
                  {currentLanguage === 'en' ? '🇵🇹' : '🇺🇸'}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
