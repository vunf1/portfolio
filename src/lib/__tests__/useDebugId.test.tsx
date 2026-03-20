import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/preact'
import { useDebugId } from '../useDebugId'

function Probe({ explicit }: { explicit?: string }) {
  const id = useDebugId('probe', explicit)
  return <span data-testid="probe" id={id} />
}

describe('useDebugId', () => {
  it('uses explicit id when provided', () => {
    render(<Probe explicit="my-stable-id" />)
    expect(screen.getByTestId('probe')).toHaveAttribute('id', 'my-stable-id')
  })

  it('generates prefixed id when explicit is omitted', () => {
    render(<Probe />)
    const id = screen.getByTestId('probe').getAttribute('id')
    expect(id).toMatch(/^probe-P\d+-\d+$/)
  })
})
