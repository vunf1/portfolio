import { useState, useEffect } from 'preact/hooks'

export function usePortfolioData() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/src/data/portfolio-data.json')
        
        if (!response.ok) {
          throw new Error(`Failed to load portfolio data: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Validate data structure
        if (!data.personal || !data.social || !data.experience || !data.education || !data.skills) {
          throw new Error('Portfolio data is missing required sections')
        }
        
        setPortfolioData(data)
      } catch (err) {
        console.error('Error loading portfolio data:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    loadPortfolioData()
  }, [])

  return { portfolioData, loading, error }
}




