// Component Props Types
import type { Personal, Social, Experience, Education, Skills, Project, Certification, InterestCategory, Award, Testimonial } from './portfolio'

// Navigation Component Props
export interface NavigationProps {
  personal: Personal
  portfolioData: any // Add portfolio data to check for empty sections
  isDarkMode: boolean
  onThemeToggle: () => void
  activeSection: string
}

// Hero Component Props
export interface HeroProps {
  personal: Personal
  social: Social[]
  onScrollDown: () => void
}

// About Component Props
export interface AboutProps {
  personal: Personal
  social: Social[]
}

// Experience Component Props
export interface ExperienceProps {
  experience: Experience[]
}

// Education Component Props
export interface EducationProps {
  education: Education[]
}

// Skills Component Props
export interface SkillsProps {
  skills: Skills
}

// Projects Component Props
export interface ProjectsProps {
  projects: Project[]
}

// Certifications Component Props
export interface CertificationsProps {
  certifications: Certification[]
}

// Interests Component Props
export interface InterestsProps {
  interests: InterestCategory[]
}

// Awards Component Props
export interface AwardsProps {
  awards: Award[]
}

// Testimonials Component Props
export interface TestimonialsProps {
  testimonials: Testimonial[]
}

// Contact Component Props
export interface ContactProps {
  personal: Personal
  isUnlocked: boolean
  onUnlock: () => void
}

// Contact Modal Props
export interface ContactModalProps {
  show: boolean
  onClose: () => void
  onSubmit: (formData: ContactFormData) => void
}

// Contact Form Data
export interface ContactFormData {
  visitorName: string
  visitorEmail: string
  visitorCompany: string
  contactReason: string
}

// Error Boundary Props
export interface ErrorBoundaryProps {
  children: any
}

// Error Boundary State
export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}
