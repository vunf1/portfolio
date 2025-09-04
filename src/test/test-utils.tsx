import { render, RenderOptions } from '@testing-library/preact'
import { JSX } from 'preact/jsx-runtime'

// Custom render function that includes providers
const customRender = (
  ui: JSX.Element,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, {
    ...options,
  })
}

// Re-export everything
export * from '@testing-library/preact'

// Override render method
export { customRender as render }
