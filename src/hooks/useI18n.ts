import { useTranslation } from 'react-i18next'
import { useCallback } from 'preact/hooks'

export function useI18n() {
  const { t, i18n } = useTranslation()
  
  const changeLanguage = useCallback((lang: 'en' | 'pt-PT') => {
    i18n.changeLanguage(lang)
    localStorage.setItem('i18nextLng', lang)
  }, [i18n])
  
  // Ensure default language is English if not set
  const currentLanguage = i18n.language || 'en'
  
  return {
    t,
    currentLanguage,
    changeLanguage,
    isEnglish: currentLanguage === 'en',
    isPortuguese: currentLanguage === 'pt-PT',
    supportedLanguages: ['en', 'pt-PT'] as const
  }
}
