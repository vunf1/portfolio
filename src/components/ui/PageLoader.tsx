/**
 * Full-page loading. Single element with ::before spinner; no redundant DOM.
 */
import { useTranslation } from '../../contexts/TranslationContext'

export function PageLoader() {
  const { t } = useTranslation()

  return (
    <div
      className="page-loader"
      role="status"
      aria-live="polite"
      aria-label={t('common.loading')}
    />
  )
}
