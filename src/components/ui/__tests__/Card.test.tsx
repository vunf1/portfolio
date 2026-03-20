import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/preact'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../Card'

describe('Card (shadcn-style primitives)', () => {
  it('renders composed flush card with semantic title tag', () => {
    render(
      <Card flush hover={false}>
        <CardHeader>
          <CardTitle as="h1" id="page-title">
            Hello
          </CardTitle>
          <CardDescription as="p">Subtitle</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )

    const heading = document.getElementById('page-title')
    expect(heading?.tagName.toLowerCase()).toBe('h1')
    expect(heading).toHaveTextContent('Hello')
    expect(screen.getByText('Subtitle')).toBeTruthy()
    expect(screen.getByText('Body')).toBeTruthy()
    expect(screen.getByText('Footer')).toBeTruthy()
  })

  it('defaults CardTitle to h3 and CardDescription to p', () => {
    render(
      <Card flush hover={false}>
        <CardHeader>
          <CardTitle>Default title</CardTitle>
          <CardDescription>Default desc</CardDescription>
        </CardHeader>
      </Card>
    )

    expect(screen.getByText('Default title').closest('h3')).toBeTruthy()
    expect(screen.getByText('Default desc').tagName.toLowerCase()).toBe('p')
  })
})
