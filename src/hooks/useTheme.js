import { useState, useEffect } from 'preact/hooks'

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    // Update document theme when state changes
    const html = document.documentElement
    const body = document.body
    
    if (isDarkMode) {
      html.setAttribute('data-bs-theme', 'dark')
      body.setAttribute('data-bs-theme', 'dark')
      body.classList.add('dark-theme')
      body.classList.remove('light-theme')
    } else {
      html.setAttribute('data-bs-theme', 'light')
      body.setAttribute('data-bs-theme', 'light')
      body.classList.add('light-theme')
      body.classList.remove('dark-theme')
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    
    // Debug logging
    console.log('Theme changed to:', isDarkMode ? 'dark' : 'light')
    console.log('HTML data-bs-theme:', html.getAttribute('data-bs-theme'))
    console.log('Body data-bs-theme:', body.getAttribute('data-bs-theme'))
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  return { isDarkMode, toggleTheme }
}




