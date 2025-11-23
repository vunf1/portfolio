// SEO-related TypeScript types

export type SupportedLocale = 'en' | 'pt-PT'

export interface SEOConfig {
  baseUrl: string
  locale: SupportedLocale
  personal: {
    name: string
    title: string
    location: string
    profileImage: string
    summary?: string
  }
  meta: {
    title: string
    description: string
    keywords: string[]
    ogImage: string
  }
  social: Array<{
    name: string
    url: string
  }>
  skills?: string[]
}

export interface PersonSchema {
  '@context': string
  '@type': 'Person'
  name: string
  alternateName: string
  brand: {
    '@type': 'Brand'
    name: string
  }
  jobTitle: string
  url: string
  sameAs: string[]
  image: string
  address: {
    '@type': 'PostalAddress'
    addressLocality: string
    addressCountry: string
  }
  knowsAbout?: string[]
  worksFor: {
    '@type': 'Organization'
    name: string
  }
  inLanguage?: string
}

export interface ProfessionalServiceSchema {
  '@context': string
  '@type': 'ProfessionalService'
  name: string
  alternateName: string
  provider: {
    '@type': 'Person'
    name: string
    alternateName: string
  }
  serviceType: string[]
  areaServed: string
  url: string
  inLanguage?: string
}

export interface WebSiteSchema {
  '@context': string
  '@type': 'WebSite'
  name: string
  alternateName: string
  url: string
  author: {
    '@type': 'Person'
    name: string
    alternateName: string
  }
  inLanguage: string[]
}

export interface StructuredData {
  person: PersonSchema
  professionalService: ProfessionalServiceSchema
  website: WebSiteSchema
}



