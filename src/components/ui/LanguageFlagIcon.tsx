import type { SupportedLanguage } from '../../lib/locale'

interface LanguageFlagIconProps {
  language: SupportedLanguage
  className?: string
}

const FLAG_SOURCES: Record<SupportedLanguage, string> = {
  en: '/img/flags/united-kingdom.svg',
  'pt-PT': '/img/flags/portugal.svg'
}

function FlagImage({ src, className }: { src: string; className?: string }) {
  return (
    <img
      src={src}
      alt=""
      className={className}
      aria-hidden="true"
      draggable={false}
      decoding="async"
    />
  )
}

export function LanguageFlagIcon({ language, className = '' }: LanguageFlagIconProps) {
  const classes = ['fab-flag-icon', className].filter(Boolean).join(' ')

  return <FlagImage src={FLAG_SOURCES[language]} className={classes} />
}
