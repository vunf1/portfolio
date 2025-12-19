/**
 * SEO Management Utility
 * 
 * Handles dynamic meta tags, structured data (JSON-LD), hreflang tags,
 * canonical URLs, and HTML attributes for optimal SEO performance.
 */

import type {
  PersonSchema,
  ProfessionalServiceSchema,
  WebSiteSchema,
  OrganizationSchema,
  StructuredData,
  SupportedLocale
} from '../types/seo'
import type { Personal, Social, PortfolioData } from '../types/portfolio'

// Constants
const BRAND_NAME = 'JMSIT'
const DEFAULT_BASE_URL = 'https://jmsit.cloud'
const LOCALE_MAP: Record<SupportedLocale, string> = {
  'en': 'en_US',
  'pt-PT': 'pt_PT'
}

/**
 * Get base URL from environment or use default
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // In browser, use current origin
    return window.location.origin
  }
  // Fallback to default
  return import.meta.env.VITE_APP_URL || DEFAULT_BASE_URL
}

/**
 * Get locale-specific URL with language parameter
 */
function getLocaleUrl(baseUrl: string, locale: SupportedLocale): string {
  if (locale === 'en') {
    return baseUrl
  }
  return `${baseUrl}?lang=${locale}`
}

/**
 * Update or create a meta tag
 */
function setMetaTag(name: string, content: string, property = false): void {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
  let meta = document.querySelector(selector) as HTMLMetaElement

  if (!meta) {
    meta = document.createElement('meta')
    if (property) {
      meta.setAttribute('property', name)
    } else {
      meta.setAttribute('name', name)
    }
    document.head.appendChild(meta)
  }

  meta.setAttribute('content', content)
}


/**
 * Update or create a link tag
 */
function setLinkTag(rel: string, href: string, hreflang?: string): void {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`
  let link = document.querySelector(selector) as HTMLLinkElement

  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    if (hreflang) {
      link.setAttribute('hreflang', hreflang)
    }
    document.head.appendChild(link)
  }

  link.setAttribute('href', href)
}


/**
 * Update document title
 */
export function updateDocumentTitle(_locale: SupportedLocale, personal: Personal, meta: { title: string }): void {
  document.title = meta?.title || `${personal?.name || ''} (${BRAND_NAME}) - ${personal?.title || ''}`
}

/**
 * Update HTML lang and dir attributes
 */
export function updateHTMLAttributes(locale: SupportedLocale): void {
  const html = document.documentElement
  html.setAttribute('lang', locale === 'pt-PT' ? 'pt-PT' : 'en')
  html.setAttribute('dir', 'ltr')
}

/**
 * Update all SEO meta tags
 */
export function updateSEOMetaTags(
  locale: SupportedLocale,
  personal: Personal,
  meta: { title: string; description: string; keywords: string[]; ogImage: string }
): void {
  const baseUrl = getBaseUrl()
  const ogImage = meta?.ogImage?.startsWith('http') ? meta.ogImage : `${baseUrl}${(meta?.ogImage || '').replace(/^\./, '')}`

  // Basic meta tags
  setMetaTag('description', meta?.description || '')
  setMetaTag('keywords', (meta?.keywords || []).join(', '))
  setMetaTag('author', personal?.name || '')

  // Open Graph tags
  setMetaTag('og:title', meta?.title || '', true)
  setMetaTag('og:description', meta?.description || '', true)
  setMetaTag('og:type', 'website', true)
  setMetaTag('og:url', baseUrl, true)
  setMetaTag('og:image', ogImage, true)
  setMetaTag('og:locale', LOCALE_MAP[locale], true)
  setMetaTag('og:site_name', `${BRAND_NAME} - ${personal?.name || ''} Portfolio`, true)
  setMetaTag('og:image:width', '1200', true)
  setMetaTag('og:image:height', '630', true)
  setMetaTag('og:image:alt', `${BRAND_NAME} - ${personal?.name || ''} Portfolio | Full-Stack Developer & Network Engineer`, true)

  // Twitter Card tags
  setMetaTag('twitter:card', 'summary_large_image')
  setMetaTag('twitter:title', meta?.title || '')
  setMetaTag('twitter:description', meta?.description || '')
  setMetaTag('twitter:image', ogImage)
  setMetaTag('twitter:image:alt', `${BRAND_NAME} - ${personal?.name || ''} Portfolio | Full-Stack Developer & Network Engineer`)
}

/**
 * Create Person schema with jmsit branding
 */
function createPersonSchema(
  locale: SupportedLocale,
  personal: Personal,
  social: Social[],
  skills?: string[]
): PersonSchema {
  const baseUrl = getBaseUrl()
  const profileImage = (personal?.profileImage || '').startsWith('http')
    ? (personal?.profileImage || '')
    : `${baseUrl}${(personal?.profileImage || '').replace(/^\./, '')}`

  const [city, country] = (personal?.location || '').split(', ').map(s => s.trim())
  const sameAs = (social || []).map(s => s.url).filter(url => url && !url.includes('jmsit.cloud'))

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personal?.name || '',
    alternateName: BRAND_NAME,
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME
    },
    jobTitle: personal?.title || '',
    url: baseUrl,
    sameAs,
    image: profileImage,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city || 'Porto',
      addressCountry: country || 'PT'
    },
    knowsAbout: skills || [
      'Full-Stack Development',
      'Network Engineering',
      'AI Solutions',
      'Generative AI',
      'Automation',
      'Cybersecurity',
      'DevOps',
      'Cloud Solutions',
      'Software Architecture',
      'Object-Oriented Programming'
    ],
    worksFor: {
      '@id': `${baseUrl}#organization`
    },
    inLanguage: locale === 'pt-PT' ? 'pt-PT' : 'en'
  }
}

/**
 * Create ProfessionalService schema
 */
function createProfessionalServiceSchema(
  _locale: SupportedLocale,
  personal: Personal
): ProfessionalServiceSchema {
  const baseUrl = getBaseUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: BRAND_NAME,
    alternateName: 'JMSIT.cloud',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PT',
      addressCountryName: 'Portugal'
    },
    provider: {
      '@type': 'Person',
      name: personal?.name || '',
      alternateName: BRAND_NAME
    },
    serviceType: [
      'Full-Stack Software Development',
      'Network Engineering & Infrastructure',
      'AI Solutions & Generative AI',
      'Automation & Workflow Optimization',
      'Cybersecurity & Network Security',
      'DevOps & CI/CD',
      'Cloud Solutions & Architecture',
      'Software Consulting & IT Solutions'
    ],
    areaServed: 'Worldwide',
    url: baseUrl,
    inLanguage: _locale === 'pt-PT' ? 'pt-PT' : 'en'
  }
}

/**
 * Create WebSite schema
 */
function createWebSiteSchema(
  _locale: SupportedLocale,
  personal: Personal
): WebSiteSchema {
  const baseUrl = getBaseUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${BRAND_NAME} - ${personal?.name || ''} Portfolio`,
    alternateName: 'JMSIT.cloud',
    url: baseUrl,
    author: {
      '@type': 'Person',
      name: personal?.name || '',
      alternateName: BRAND_NAME
    },
    inLanguage: ['en', 'pt-PT']
  }
}

/**
 * Create Organization schema
 */
function createOrganizationSchema(
  personal: Personal
): OrganizationSchema {
  const baseUrl = getBaseUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}#organization`,
    name: BRAND_NAME,
    legalName: BRAND_NAME,
    url: baseUrl,
    alternateName: 'JMSIT.cloud',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PT',
      addressCountryName: 'Portugal'
    },
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/img/logo.png`
    },
    founder: {
      '@type': 'Person',
      name: personal?.name || ''
    },
    foundingDate: '2010',
    description: `${BRAND_NAME} provides professional technology services including full-stack software development, network engineering, AI solutions, automation, cybersecurity, DevOps, and cloud architecture. Expert IT consulting and solutions based in Porto, Portugal.`,
    sameAs: [baseUrl]
  }
}

/**
 * Inject or update JSON-LD structured data
 */
function injectStructuredData(structuredData: StructuredData): void {
  // Remove existing structured data scripts
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]')
  existingScripts.forEach(script => script.remove())

  // Inject Person schema
  const personScript = document.createElement('script')
  personScript.type = 'application/ld+json'
  personScript.textContent = JSON.stringify(structuredData.person, null, 2)
  personScript.id = 'schema-person'
  document.head.appendChild(personScript)

  // Inject ProfessionalService schema
  const serviceScript = document.createElement('script')
  serviceScript.type = 'application/ld+json'
  serviceScript.textContent = JSON.stringify(structuredData.professionalService, null, 2)
  serviceScript.id = 'schema-professional-service'
  document.head.appendChild(serviceScript)

  // Inject WebSite schema
  const websiteScript = document.createElement('script')
  websiteScript.type = 'application/ld+json'
  websiteScript.textContent = JSON.stringify(structuredData.website, null, 2)
  websiteScript.id = 'schema-website'
  document.head.appendChild(websiteScript)

  // Inject Organization schema
  const organizationScript = document.createElement('script')
  organizationScript.type = 'application/ld+json'
  organizationScript.textContent = JSON.stringify(structuredData.organization, null, 2)
  organizationScript.id = 'schema-organization'
  document.head.appendChild(organizationScript)
}

/**
 * Update structured data (JSON-LD)
 */
export function updateStructuredData(
  locale: SupportedLocale,
  personal: Personal,
  social: Social[],
  portfolioData?: Partial<PortfolioData>
): void {
  // Extract skill names from all technical skill groups
  const skills = portfolioData?.skills?.technical
    ?.flatMap(group => group.skills.map(skill => skill.name))
    || undefined

  const structuredData: StructuredData = {
    person: createPersonSchema(locale, personal, social, skills),
    professionalService: createProfessionalServiceSchema(locale, personal),
    website: createWebSiteSchema(locale, personal),
    organization: createOrganizationSchema(personal)
  }

  injectStructuredData(structuredData)
}

/**
 * Update hreflang tags for bilingual SEO
 */
export function updateHreflangTags(baseUrl: string): void {
  // Remove existing hreflang tags
  const existingHreflang = document.querySelectorAll('link[rel="alternate"][hreflang]')
  existingHreflang.forEach(link => link.remove())

  // Add hreflang tags (improved for better SEO)
  setLinkTag('alternate', baseUrl, 'en')
  setLinkTag('alternate', getLocaleUrl(baseUrl, 'pt-PT'), 'pt-PT')
  setLinkTag('alternate', baseUrl, 'x-default') // Default to English
}

/**
 * Update canonical URL
 */
export function updateCanonicalUrl(baseUrl: string, locale: SupportedLocale): void {
  const canonicalUrl = locale === 'en' ? baseUrl : getLocaleUrl(baseUrl, locale)
  setLinkTag('canonical', canonicalUrl)
}

/**
 * Initialize SEO - full setup
 */
export function initializeSEO(
  locale: SupportedLocale,
  personal: Personal,
  meta: { title: string; description: string; keywords: string[]; ogImage: string },
  social: Social[],
  portfolioData?: Partial<PortfolioData>
): void {
  const baseUrl = getBaseUrl()

  // Update HTML attributes
  updateHTMLAttributes(locale)

  // Update document title
  updateDocumentTitle(locale, personal, meta)

  // Update meta tags
  updateSEOMetaTags(locale, personal, meta)

  // Update structured data
  updateStructuredData(locale, personal, social, portfolioData)

  // Update hreflang tags
  updateHreflangTags(baseUrl)

  // Update canonical URL
  updateCanonicalUrl(baseUrl, locale)
}

/**
 * Update SEO when language changes
 */
export function updateSEOOnLanguageChange(
  locale: SupportedLocale,
  personal: Personal,
  meta: { title: string; description: string; keywords: string[]; ogImage: string },
  social: Social[],
  portfolioData?: Partial<PortfolioData>
): void {
  const baseUrl = getBaseUrl()

  // Update HTML lang attribute
  updateHTMLAttributes(locale)

  // Update document title
  updateDocumentTitle(locale, personal, meta)

  // Update meta tags
  updateSEOMetaTags(locale, personal, meta)

  // Update structured data with new locale
  updateStructuredData(locale, personal, social, portfolioData)

  // Update hreflang tags (they remain the same, but ensure they're present)
  updateHreflangTags(baseUrl)

  // Update canonical URL for new locale
  updateCanonicalUrl(baseUrl, locale)
}



