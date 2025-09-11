import { useState, useRef, useEffect, useCallback } from 'preact/hooks'
import { useTheme } from '../hooks/useTheme'
import { useTranslation } from '../contexts/TranslationContext'

interface FloatingActionButtonProps {
  className?: string
}

interface FABItem {
  id: string
  icon: string
  label: string
  onClick: () => void
  ariaLabel: string
}

export function FloatingActionButton({ className = '' }: FloatingActionButtonProps) {
  const { isDarkMode, toggleTheme } = useTheme()
  const { currentLanguage, changeLanguage, t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 }) // Default bottom-right (right, bottom)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  // const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })
  const [isPointerDown, setIsPointerDown] = useState(false)
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null)
  const [isLongPressing, setIsLongPressing] = useState(false)
  
  const fabRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Initialize position from localStorage
  useEffect(() => {
    try {
      const savedPosition = localStorage.getItem('fab-position')
      if (savedPosition) {
        const { x, y } = JSON.parse(savedPosition)
        // Check if position is reasonable (not way off screen)
        if (x > window.innerWidth || y > window.innerHeight || x < 0 || y < 0) {
          // Reset to default position if saved position is invalid
          // console.warn('Invalid FAB position detected, resetting to default')
          localStorage.removeItem('fab-position')
          setPosition({ x: 20, y: 20 })
        } else {
          // Ensure position is within bounds
          const constrainedX = Math.max(20, Math.min(window.innerWidth - 20, x))
          const constrainedY = Math.max(20, Math.min(window.innerHeight - 20, y))
          setPosition({ x: constrainedX, y: constrainedY })
        }
      }
    } catch (error) {
      // console.warn('Failed to load FAB position from localStorage:', error)
      setPosition({ x: 20, y: 20 })
    }
  }, [])

  // Save position to localStorage
  const savePosition = useCallback((newPosition: { x: number; y: number }) => {
    try {
      localStorage.setItem('fab-position', JSON.stringify(newPosition))
    } catch (error) {
      // console.warn('Failed to save FAB position to localStorage:', error)
    }
  }, [])

  // Handle language toggle
  const handleLanguageToggle = useCallback(() => {
    const newLanguage = currentLanguage === 'en' ? 'pt-PT' : 'en'
    changeLanguage(newLanguage)
    // Don't close menu - let user close it manually
  }, [currentLanguage, changeLanguage])

  // FAB items configuration
  const fabItems: FABItem[] = [
    {
      id: 'theme',
      icon: isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon',
      label: isDarkMode ? t('fab.lightMode', 'Light Mode') : t('fab.darkMode', 'Dark Mode'),
      onClick: () => {
        toggleTheme()
        // Don't close menu - let user close it manually
      },
      ariaLabel: isDarkMode ? t('fab.switchToLight', 'Switch to light mode') : t('fab.switchToDark', 'Switch to dark mode')
    },
    {
      id: 'language',
      icon: 'flag-emoji', // Special case for flag emoji
      label: currentLanguage === 'en' ? 'Português' : 'English',
      onClick: handleLanguageToggle,
      ariaLabel: currentLanguage === 'en' ? t('fab.switchToPortuguese', 'Switch to Portuguese') : t('fab.switchToEnglish', 'Switch to English')
    }
  ]

  // Long press and drag handlers
  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (isExpanded) {
      return
    }
    
    e.preventDefault()
    e.stopPropagation()
    
    setIsPointerDown(true)
    setIsLongPressing(true)
    
    // Store initial position for drag detection
    // setDragStartPos({ x: e.clientX, y: e.clientY })
    
    // Store event data for later use in timeout
    const eventData = {
      clientX: e.clientX,
      clientY: e.clientY,
      target: e.target as HTMLElement
    }
    
    // Start long press timer (500ms)
    const timer = setTimeout(() => {
      // Calculate offset from pointer to FAB center only when dragging starts
      const rect = eventData.target.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      setDragOffset({
        x: eventData.clientX - centerX,
        y: eventData.clientY - centerY
      })
      
      setIsDragging(true)
      setIsLongPressing(false)
    }, 500)
    
    setLongPressTimer(timer as unknown as number)
  }, [isExpanded])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    // Only handle movement if pointer is down and we're dragging
    if (!isPointerDown || !isDragging) {
      return
    }

    // Calculate new position (from bottom-right corner)
    // x = distance from right edge, y = distance from bottom edge
    const fabSize = 72 // FAB button size
    const newX = Math.max(20, Math.min(window.innerWidth - fabSize - 20, window.innerWidth - e.clientX + dragOffset.x))
    const newY = Math.max(20, Math.min(window.innerHeight - fabSize - 20, window.innerHeight - e.clientY + dragOffset.y))

    setPosition({ x: newX, y: newY })
  }, [isPointerDown, isDragging, dragOffset])

  const handlePointerUp = useCallback(() => {
    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
    
    setIsPointerDown(false)
    setIsLongPressing(false)
    
    if (isDragging) {
      setIsDragging(false)
      savePosition(position)
    }
  }, [isDragging, position, savePosition, longPressTimer])

  // Global event listeners
  useEffect(() => {
    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)

    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
      
      // Cleanup timer on unmount
      if (longPressTimer) {
        clearTimeout(longPressTimer)
      }
    }
  }, [handlePointerMove, handlePointerUp, longPressTimer])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isExpanded])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isExpanded])

  // Handle window resize to keep FAB within bounds
  useEffect(() => {
    const handleResize = () => {
      const fabSize = 72
      setPosition(prev => ({
        x: Math.max(20, Math.min(window.innerWidth - fabSize - 20, prev.x)),
        y: Math.max(20, Math.min(window.innerHeight - fabSize - 20, prev.y))
      }))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Reset FAB position function
  const resetFabPosition = useCallback(() => {
    setPosition({ x: 20, y: 20 })
    localStorage.removeItem('fab-position')
  }, [])

  const toggleExpanded = useCallback((e?: Event) => {
    // Prevent expansion if we're dragging or if pointer is down (long press in progress)
    if (isDragging || isPointerDown) {
      e?.preventDefault()
      e?.stopPropagation()
      return
    }
    setIsExpanded(prev => !prev)
  }, [isDragging, isPointerDown])

  // Handle double-click to reset position
  const handleDoubleClick = useCallback((e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    resetFabPosition()
  }, [resetFabPosition])

  return (
    <div
      ref={fabRef}
      className={`fab-container ${isDragging ? 'fab-dragging' : ''} ${className}`}
      style={{
        '--fab-x': `${position.x}px`,
        '--fab-y': `${position.y}px`
      }}
      data-position={`x:${position.x}, y:${position.y}`}
    >
      {/* FAB Items */}
      <div className={`fab-items ${isExpanded ? 'fab-items-expanded' : ''}`}>
        {fabItems.map((item, index) => (
          <button
            key={item.id}
            className={`fab-item fab-item-${item.id}`}
            onClick={item.onClick}
            aria-label={item.ariaLabel}
            style={{
              '--item-delay': `${index * 50}ms`
            }}
          >
            {item.icon === 'flag-emoji' ? (
              <span className="flag-emoji" aria-hidden="true">
                {currentLanguage === 'en' ? '🇵🇹' : '🇬🇧'}
              </span>
            ) : (
              <i className={item.icon} aria-hidden="true"></i>
            )}
            <span className="fab-item-label">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main FAB Button */}
      <button
        ref={buttonRef}
        className={`fab-main ${isExpanded ? 'fab-main-expanded' : ''} ${isDragging ? 'fab-main-dragging' : ''} ${isLongPressing ? 'fab-main-longpressing' : ''}`}
        onClick={toggleExpanded}
        onPointerDown={handlePointerDown}
        onDblClick={handleDoubleClick}
        aria-label={isExpanded ? t('fab.closeMenu', 'Close menu') : t('fab.openMenu', 'Open menu')}
        aria-expanded={isExpanded}
        aria-haspopup="menu"
        title="Click to open menu, double-click to reset position"
      >
        {isExpanded ? (
          <svg 
            className="fab-close-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path 
              d="M18 6L6 18M6 6L18 18" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <i className="fa-solid fa-cog" aria-hidden="true"></i>
        )}
      </button>
    </div>
  )
}
