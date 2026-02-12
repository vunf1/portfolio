/**
 * Determine initial UI language from URL, localStorage, or navigator.
 */

export type SupportedLanguage = 'en' | 'pt-PT'

const STORAGE_KEY = 'i18nextLng'

function fromNavigator(): SupportedLanguage {
  if (typeof navigator === 'undefined') {return 'en'}
  const lang = navigator.language?.toLowerCase() ?? ''
  if (lang.startsWith('pt')) {return 'pt-PT'}
  return 'en'
}

function fromUrl(): SupportedLanguage | null {
  if (typeof window === 'undefined') {return null}
  const params = new URLSearchParams(window.location.search)
  const lang = params.get('lang')?.toLowerCase()
  if (lang === 'pt' || lang === 'pt-pt') {return 'pt-PT'}
  if (lang === 'en') {return 'en'}
  return null
}

function fromStorage(): SupportedLanguage | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'pt-PT' || stored === 'pt') {return 'pt-PT'}
    if (stored === 'en') {return 'en'}
  } catch {
    // localStorage unavailable (SSR, private mode, etc.)
  }
  return null
}

/**
 * Returns the initial language for the app.
 * Order: URL ?lang= > localStorage i18nextLng > navigator.language > 'en'.
 */
export function getInitialLanguage(): SupportedLanguage {
  return fromUrl() ?? fromStorage() ?? fromNavigator()
}
