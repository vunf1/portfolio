import { useState, useEffect } from 'preact/hooks'
import { useTranslation } from '../contexts/TranslationContext'
import { useTheme } from '../hooks/useTheme'
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
  const [isLanguageChanging, setIsLanguageChanging] = useState(false)
  const { t, changeLanguage, currentLanguage } = useTranslation()
  const { isDarkMode, toggleTheme } = useTheme()

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

  const handleLanguageChange = async (lang: 'en' | 'pt-PT') => {
    if (lang === currentLanguage) return
    
    setIsLanguageChanging(true)
    
    try {
      // Add a small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 100))
      changeLanguage(lang)
    } finally {
      // Reset the loading state after a short delay
      setTimeout(() => setIsLanguageChanging(false), 200)
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navHeight = 80
      const offset = 20
      const elementTop = element.offsetTop - navHeight - offset
      
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      })
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

        {/* Theme and Language Toggles */}
        <div className="nav-controls">
          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
          >
            <div className="theme-btn">
              <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </div>
          </button>

          {/* Language Toggle */}
          <button
            className={`language-toggle ${isLanguageChanging ? 'changing' : ''}`}
            onClick={() => handleLanguageChange(currentLanguage === 'en' ? 'pt-PT' : 'en')}
            aria-label={`Switch to ${currentLanguage === 'en' ? 'Portuguese' : 'English'}`}
            disabled={isLanguageChanging}
          >
            <div className="language-btn">
              <span className={`flag-emoji ${isLanguageChanging ? 'spinning' : ''}`}>
                {currentLanguage === 'en' ? '🇵🇹' : '🇬🇧'}
              </span>
            </div>
          </button>

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
      </div>
    </nav>
  )
}
