import { useEffect } from 'preact/hooks'
import { useTranslation } from '../contexts/TranslationContext'
import type { PortfolioErrorFallbackProps } from '../types'
import { Button } from './ui/Button'
import { FloatingActionButton } from './FloatingActionButton'
import { Icon } from './ui/Icon'

function focusFallbackPrimary(onTryAgain: boolean) {
  const selector = onTryAgain
    ? '[data-error-fallback="try-again"]'
    : '[data-error-fallback="refresh"]'
  const el = document.querySelector<HTMLElement>(selector)
  el?.focus()
}

/**
 * Full-page premium fallback for data errors and inner ErrorBoundary.
 * Does not catch errors itself.
 */
export function PortfolioErrorFallback({
  variant,
  title,
  message,
  onTryAgain,
  devErrorMessage,
  withFab = true
}: PortfolioErrorFallbackProps) {
  const { t } = useTranslation()

  useEffect(() => {
    const id = requestAnimationFrame(() => focusFallbackPrimary(Boolean(onTryAgain)))
    return () => cancelAnimationFrame(id)
  }, [onTryAgain])

  const iconName = variant === 'data' ? 'cloud' : 'exclamation-triangle'
  const showDevBlock = import.meta.env.DEV && Boolean(devErrorMessage?.trim())

  return (
    <>
      <main
        className="error-fallback"
        aria-labelledby="error-fallback-title"
      >
        <div className="error-fallback__inner">
          <div className="error-fallback__card">
            <div className="error-fallback__badge" aria-hidden>
              <Icon name={iconName} size={28} className="shrink-0 outline-none" />
            </div>
            <h1 id="error-fallback-title" className="error-fallback__title">
              {title}
            </h1>
            <div role="alert" aria-live="assertive">
              <p className="error-fallback__message">{message}</p>
            </div>
            <div className="error-fallback__actions">
              {onTryAgain ? (
                <Button
                  type="button"
                  variant="outlineElevated"
                  size="md"
                  data-error-fallback="try-again"
                  onClick={onTryAgain}
                >
                  {t('common.tryAgain', 'Try again')}
                </Button>
              ) : null}
              <Button
                type="button"
                variant="primary"
                size="md"
                data-error-fallback="refresh"
                onClick={() => window.location.reload()}
              >
                <Icon name="refresh" size={18} className="shrink-0 outline-none mr-2" />
                {t('common.refreshPage', 'Refresh Page')}
              </Button>
            </div>
            {showDevBlock ? (
              <div className="error-fallback__dev">
                <details>
                  <summary>{t('common.errorDevDetails', 'Technical details (development only)')}</summary>
                  <pre>{devErrorMessage}</pre>
                </details>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      {withFab ? <FloatingActionButton hideContact /> : null}
    </>
  )
}
