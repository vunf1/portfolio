import { useTranslation } from '../contexts/TranslationContext'
import { Button } from './ui/Button'
import { FloatingActionButton } from './FloatingActionButton'
import { Icon } from './ui/Icon'

function getHomeHref(): string {
  if (typeof window === 'undefined') {return '/'}
  const path = window.location.pathname || '/'
  const segments = path.split('/').filter(Boolean)
  const base = segments.length > 1 ? '/' + segments.slice(0, -1).join('/') + '/' : '/'
  return window.location.origin + base
}

export function NotFoundView() {
  const { t } = useTranslation()
  const homeHref = getHomeHref()

  return (
    <div className="min-h-svh flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-[0_4px_6px_-1px_rgba(0,0,0,.1),0_2px_4px_-1px_rgba(0,0,0,.06)]">
        <div
          className="mb-4 text-6xl font-bold leading-none"
          style={{
            background: 'linear-gradient(135deg,#007bff,#0056b3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
          aria-hidden
        >
          404
        </div>
        <h1 className="mb-3 text-xl font-semibold text-gray-900">
          {t('errorPages.404.title', 'Page Not Found')}
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          {t('errorPages.404.description', 'This page is either off the grid or behind a security policy. Your request was logged. Try a different route or head back.')}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="outlineElevated"
            onClick={() => window.history.back()}
            className="min-h-[2.25rem] min-w-[2.25rem] rounded-lg p-0 transition-opacity duration-150 hover:scale-100 hover:translate-y-0 hover:opacity-90 active:opacity-80"
            aria-label={t('errorPages.404.goBack', 'Go Back')}
          >
            <Icon name="arrow-left" size={18} />
          </Button>
          <Button
            variant="primary"
            href={homeHref}
            className="min-h-[2.25rem] min-w-[2.25rem] rounded-lg p-0 transition-opacity duration-150 hover:scale-100 hover:translate-y-0 hover:opacity-90 active:opacity-80"
            aria-label={t('errorPages.404.goHome', 'Go Home')}
          >
            <Icon name="home" size={18} />
          </Button>
        </div>
        <footer className="mt-6 border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()}{' '}
            <a href={homeHref} className="font-medium text-primary hover:underline">
              {t('errorPages.portfolioLink', 'Portfolio')}
            </a>
          </p>
        </footer>
      </div>
      <FloatingActionButton hideContact />
    </div>
  )
}
