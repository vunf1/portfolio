let preloadPromise: Promise<void> | null = null

export function preloadPortfolioChunks(): Promise<void> {
  if (preloadPromise) {
    return preloadPromise
  }

  const imports = [
    import('../components/Experience'),
    import('../components/Education'),
    import('../components/Skills'),
    import('../components/Projects'),
    import('../components/Certifications'),
    import('../components/Interests'),
    import('../components/Awards'),
    import('../components/Testimonials')
  ]

  preloadPromise = Promise.all(imports)
    .then(() => undefined)
    .catch((error) => {
      preloadPromise = null
      throw error
    })

  return preloadPromise
}

