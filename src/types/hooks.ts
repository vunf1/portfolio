// Hook Return Types
import type { PortfolioData } from './portfolio'

// usePortfolioData Hook Return Type
export interface UsePortfolioDataReturn {
  portfolioData: PortfolioData | null
  loading: boolean
  error: Error | null
  loadSection: (section: string) => Promise<void>
  loadAllSections: () => Promise<void>
  loadedSections: string[]
  isSectionLoaded: (section: string) => boolean
  getSectionLoadingStatus: (section: string) => 'loaded' | 'critical' | 'pending'
}

// useTheme Hook Return Type
export interface UseThemeReturn {
  isDarkMode: boolean
  toggleTheme: () => void
}

// Form Error Type
export interface FormErrors {
  visitorName?: string
  visitorEmail?: string
  visitorCompany?: string
  contactReason?: string
}

// Form Data Type
export interface FormData {
  [key: string]: string
}
