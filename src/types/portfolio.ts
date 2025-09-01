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
  id: string
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
}

export interface Education {
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
}

export interface Skill {
  name: string
  level: number
  experience: string
  projects: number
}

export interface SkillGroup {
  category: string
  skills: Skill[]
}

export interface SoftSkill {
  name: string
  level: number
  description: string
}

export interface Skills {
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

export interface Contact {
  availability: string
  responseTime: string
  preferredContact: string
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
  contact: Contact
  meta: {
    lastUpdated: string
    version: string
    seo: {
      title: string
      description: string
      keywords: string[]
      ogImage: string
    }
  }
}
