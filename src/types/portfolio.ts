// Portfolio Data Types
export interface Personal {
  name: string
  title: string
  tagline: string
  subtitle: string
  email: string
  phone: string
  phoneSecondary: string
  location: string
  website: string
  profileImage: string
  summary: string
  longSummary: string
  availability: string
  relocation: string
  remote: string
  languages: string[]
  coreValues: string[]
}

export interface Social {
  name: string
  url: string
  icon: string
  color: string
  description: string
}

export interface Experience {
  title: string
  company: string
  location: string
  period: string
  duration: string
  description: string
  impact: string
  technologies: string[]
  achievements?: string[]
  highlights: string[]
}

export interface Education {
  degree: string
  institution: string
  location?: string
  description?: string
}

// Skill Proficiency Bands - supports both English and Portuguese level names
export type SkillLevel = 'Foundational' | 'Proficient' | 'Advanced' | 'Expert' | 'Fundacional' | 'Proficiente' | 'Avançado' | 'Perito'

export interface Skill {
  name: string
  level: SkillLevel
  experience: string
  projects: number
}

export interface SkillGroup {
  category: string
  skills: Skill[]
}

export interface SoftSkill {
  name: string
  level: SkillLevel
  description: string
}

export interface Skills {
  proficiencyLevels: {
    Foundational: string
    Proficient: string
    Advanced: string
    Expert: string
  }
  technical: SkillGroup[]
  soft: SoftSkill[]
}

export interface Project {
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
}

export interface Certification {
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
}

export interface Interest {
  name: string
  description: string
  icon: string
}

export interface InterestCategory {
  category: string
  description: string
  items: string[]
}

export interface Award {
  id: string
  title: string
  issuer: string
  date: string
  description: string
  criteria: string
  impact: string
  certificateUrl: string
}

export interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  content: string
  rating: number
  date: string
}


export interface PortfolioData {
  personal: Personal
  social: Social[]
  experience: Experience[]
  education: Education[]
  skills: Skills
  projects: Project[]
  certifications: Certification[]
  interests: InterestCategory[]
  awards: Award[]
  testimonials: Testimonial[]
  meta: {
    lastUpdated: string
    version: string
    author: string
    seo: {
      title: string
      description: string
      keywords: string[]
      ogImage: string
    }
  }
}

export interface UI {
  navigation: {
    brand: string
    about: string
    experience: string
    education: string
    skills: string
    projects: string
    certifications: string
    interests: string
    awards: string
    testimonials: string
  }
  hero: {
    title: string
    subtitle: string
    tagline: string
    cta: string
    scrollDown: string
  }
  about: {
    title: string
    subtitle: string
    summary: string
    location: string
    availability: string
    relocation: string
    remote: string
    languages: string
    coreValues: string
  }
  experience: {
    title: string
    subtitle: string
    duration: string
    location: string
    technologies: string
    achievements: string
    highlights: string
    impact: string
  }
  education: {
    title: string
    subtitle: string
    institution: string
    degree: string
    period: string
    gpa: string
    status: string
    courses: string
    projects: string
    achievements: string
  }
  skills: {
    title: string
    subtitle: string
    technical: string
    soft: string
    level: string
    experience: string
    projects: string
    description: string
  }
  projects: {
    title: string
    subtitle: string
    technologies: string
    features: string
    links: string
    code: string
    demo: string
    role: string
    teamSize: string
    highlights: string
    challenges: string
    solutions: string
  }
  certifications: {
    title: string
    subtitle: string
    issuer: string
    issueDate: string
    expiryDate: string
    credentialId: string
    skills: string
    verificationUrl: string
    description: string
  }
  interests: {
    title: string
    subtitle: string
    technology: string
    personalDevelopment: string
    lifestyle: string
    specificInterests: string
  }
  awards: {
    title: string
    subtitle: string
    issuer: string
    date: string
    criteria: string
    impact: string
    certificateUrl: string
    description: string
  }
  testimonials: {
    title: string
    subtitle: string
    position: string
    company: string
    rating: string
    date: string
  }
  common: {
    loading: string
    error: string
    refresh: string
    somethingWentWrong: string
    tryRefreshing: string
    language: string
    theme: string
    darkMode: string
    lightMode: string
  }
}
