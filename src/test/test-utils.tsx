import { render, RenderOptions } from '@testing-library/preact'
import { JSX } from 'preact/jsx-runtime'
import { preloadTranslations } from '../contexts/TranslationContext'

// Custom render function that includes providers and preloads translations
const customRender = async (
  ui: JSX.Element,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  // Preload translations before rendering
  await preloadTranslations('en')
  
  return render(ui, {
    ...options,
  })
}

// Re-export everything
export * from '@testing-library/preact'

// Override render method
export { customRender as render }
