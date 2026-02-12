import { useState, useEffect, useCallback } from 'preact/hooks'

const STORAGE_KEY = 'portfolio-darkreader'
const DEFAULT_THEME = { brightness: 100, contrast: 90, sepia: 10 }

function getStored(): boolean {
  if (typeof window === 'undefined') {return false}
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

async function loadAndEnable(): Promise<void> {
  const { enable } = await import('darkreader')
  enable(DEFAULT_THEME)
}

async function loadAndDisable(): Promise<void> {
  const { disable } = await import('darkreader')
  disable()
}

export function useDarkReader(): { isDark: boolean; toggleDarkMode: () => void } {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {return}
    if (getStored()) {
      loadAndEnable().then(() => setIsDark(true))
    }
  }, [])

  const toggleDarkMode = useCallback(() => {
    if (typeof window === 'undefined') {return}
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      loadAndEnable()
        .then(() => {
          try {
            sessionStorage.setItem(STORAGE_KEY, 'true')
          } catch {
            // ignore
          }
        })
        .catch(() => setIsDark(false))
    } else {
      loadAndDisable()
        .then(() => {
          try {
            sessionStorage.removeItem(STORAGE_KEY)
          } catch {
            // ignore
          }
        })
        .catch(() => setIsDark(true))
    }
  }, [isDark])

  return { isDark, toggleDarkMode }
}
