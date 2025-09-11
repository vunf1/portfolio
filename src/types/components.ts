// Component Props Types
import type { ComponentChildren } from 'preact'

// Base Component Props
export interface BaseComponentProps {
  children?: ComponentChildren
  className?: string
  id?: string
}

// Section Component Props
export interface SectionProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  variant?: 'default' | 'alternate' | 'highlighted'
  'data-section'?: string
}

// Card Component Props
export interface CardProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  variant?: 'default' | 'elevated' | 'outlined'
  hover?: boolean
}

// Button Component Props
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: (event: MouseEvent) => void
  type?: 'button' | 'submit' | 'reset'
  href?: string
  target?: string
  rel?: string
}

// Badge Component Props
export interface BadgeProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

// Grid Component Props
export interface GridProps extends BaseComponentProps {
  cols?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  responsive?: boolean
}

// Icon Component Props
export interface IconProps extends BaseComponentProps {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
}

// Avatar Component Props
export interface AvatarProps extends BaseComponentProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
}

// Modal Component Props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

// Confirmation Modal Props
export interface ConfirmationModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info' | 'primary'
  icon?: string
}

// Form Component Props
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  disabled?: boolean
  required?: boolean
  error?: string
  label?: string
  helperText?: string
}

export interface TextareaProps extends BaseComponentProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  disabled?: boolean
  required?: boolean
  error?: string
  label?: string
  helperText?: string
  rows?: number
  maxLength?: number
}

export interface SelectProps extends BaseComponentProps {
  options: Array<{ value: string; label: string; disabled?: boolean }>
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  disabled?: boolean
  required?: boolean
  error?: string
  label?: string
  helperText?: string
  placeholder?: string
}

// Layout Component Props
export interface ContainerProps extends BaseComponentProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export interface FlexProps extends BaseComponentProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

// Animation Component Props
export interface AnimateProps extends BaseComponentProps {
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'bounce'
  duration?: 'fast' | 'normal' | 'slow'
  delay?: number
  trigger?: 'onMount' | 'onScroll' | 'onHover' | 'onClick'
}

// Privacy Gate Component Props
export interface PrivacyGateProps extends BaseComponentProps {
  isUnlocked: boolean
  onUnlock: (data: { fullName: string; email: string; phone: string }) => void
  onClose?: () => void
}

// Navigation Component Props
export interface NavigationProps extends BaseComponentProps {
  items: Array<{
    id: string
    label: string
    icon?: string
  }>
  activeId?: string
  onNavigate?: (id: string) => void
  variant?: 'horizontal' | 'vertical' | 'mobile'
}

// Hero Component Props
export interface HeroProps extends BaseComponentProps {
  personal: {
    name: string
    title: string
    tagline: string
    summary: string
    longSummary?: string
    profileImage: string
    coreValues?: string[]
  }
}

// About Component Props
export interface AboutProps extends BaseComponentProps {
  personal: {
    name: string
    title: string
    tagline: string
    summary: string
    profileImage: string
  }
  social: Array<{
    name: string
    url: string
    icon: string
    color: string
  }>
}

// Experience Component Props
export interface ExperienceProps extends BaseComponentProps {
  experiences: Array<{
    title: string
    company: string
    location: string
    period: string
    duration: string
    description: string
    impact: string
    technologies: string[]
    achievements: string[]
    highlights: string[]
  }>
}

// Skills Component Props
export interface SkillsProps extends BaseComponentProps {
  skills: {
    proficiencyLevels: Record<string, string>
    technical: Array<{
      category: string
      skills: Array<{
        name: string
        level: import('./portfolio').SkillLevel
        experience: string
        projects: number
      }>
    }>
    soft: Array<{
      name: string
      level: import('./portfolio').SkillLevel
      description: string
    }>
  }
}

// Projects Component Props
export interface ProjectsProps extends BaseComponentProps {
  projects: Array<{
    id: string
    name: string
    description: string
    longDescription: string
    technologies: string[]
    features: string[]
    url: string
    demo: string
    image: string
    period: string
    role: string
    teamSize: number
    highlights: string[]
    challenges: string
    solutions: string
  }>
}

// Education Component Props
export interface EducationProps extends BaseComponentProps {
  education: Array<{
    id: string
    degree: string
    institution: string
    location: string
    period: string
    status: string
    gpa: string
    description: string
    courses: string[]
    projects: string[]
    achievements: string[]
  }>
}

// Certifications Component Props
export interface CertificationsProps extends BaseComponentProps {
  certifications: Array<{
    id: string
    name: string
    issuer: string
    issueDate: string
    expiryDate: string
    credentialId: string
    description: string
    skills: string[]
    verificationUrl: string
    image: string
  }>
}

// Awards Component Props
export interface AwardsProps extends BaseComponentProps {
  awards: Array<{
    id: string
    title: string
    issuer: string
    date: string
    description: string
    criteria: string
    impact: string
    certificateUrl: string
  }>
}

// Testimonials Component Props
export interface TestimonialsProps extends BaseComponentProps {
  testimonials: Array<{
    id: string
    name: string
    position: string
    company: string
    content: string
    rating: number
    date: string
  }>
}

// Interests Component Props
export interface InterestsProps extends BaseComponentProps {
  interests: Array<{
    category: string
    description: string
    items: string[]
  }>
}

// Contact Component Props
export interface ContactProps extends BaseComponentProps {
  contact: {
    availability: string
    responseTime: string
    preferredContact: string
    linkedin?: string
    github?: string
  }
  personal: {
    name: string
    title: string
    email: string
    phone: string
    phoneSecondary: string
    location: string
    website: string
    profileImage: string
    availability: string
    remote?: string
    relocation?: string
  }
}



// Error Boundary Props
export interface ErrorBoundaryProps {
  children: ComponentChildren
}

// Error Boundary State
export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}
