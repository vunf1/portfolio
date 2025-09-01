import { useState, useEffect } from 'preact/hooks'

export function usePortfolioData() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/src/data/portfolio-data.json')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setPortfolioData(data)
        setError(null)
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




