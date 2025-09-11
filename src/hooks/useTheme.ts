/* eslint-disable no-console */
import { useState, useEffect } from 'preact/hooks'
import type { UseThemeReturn } from '../types'

export function useTheme(): UseThemeReturn {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      // Check localStorage for saved preference
      const saved = localStorage.getItem('darkMode')
      return saved ? JSON.parse(saved) : false
    } catch (error) {
      // Handle localStorage errors gracefully
      console.warn('Failed to read theme preference from localStorage:', error)
      return false
    }
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
    try {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    } catch (error) {
      // Handle localStorage errors gracefully
      console.warn('Failed to save theme preference to localStorage:', error)
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode((prev: boolean) => !prev)
  }

  return { isDarkMode, toggleTheme }
}




