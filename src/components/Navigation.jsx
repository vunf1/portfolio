import { useState, useEffect } from 'preact/hooks'

export function Navigation({ personal, isDarkMode, onThemeToggle, activeSection }) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true) // Start collapsed (closed)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      const nav = document.querySelector('.premium-nav')
      const toggle = document.querySelector('.nav-toggle')
      
      if (nav && toggle && !nav.contains(event.target) && !toggle.contains(event.target)) {
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
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
    { id: 'about', label: 'About', icon: 'fa-solid fa-user' },
    { id: 'experience', label: 'Experience', icon: 'fa-solid fa-briefcase' },
    { id: 'education', label: 'Education', icon: 'fa-solid fa-graduation-cap' },
    { id: 'skills', label: 'Skills', icon: 'fa-solid fa-code' },
    { id: 'projects', label: 'Projects', icon: 'fa-solid fa-folder' },
    { id: 'certifications', label: 'Certifications', icon: 'fa-solid fa-certificate' },
    { id: 'testimonials', label: 'Testimonials', icon: 'fa-solid fa-quote-left' },
    { id: 'interests', label: 'Interests', icon: 'fa-solid fa-heart' },
    { id: 'awards', label: 'Awards', icon: 'fa-solid fa-trophy' },
    { id: 'contact', label: 'Contact', icon: 'fa-solid fa-envelope' }
  ]

  return (
    <nav className={`premium-nav ${isScrolled ? 'scrolled' : ''}`} id="sideNav">
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
            <img 
              className="brand-avatar" 
              src={personal.profileImage} 
              alt={`${personal.name} Profile`}
            />
            <span className="brand-name">{personal.name}</span>
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
          </ul>
        </div>
      </div>
    </nav>
  )
}
