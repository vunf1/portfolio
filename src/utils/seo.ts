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
 * Normalizes to non-www version to ensure consistent canonical URLs
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Normalize to non-www (remove www if present)
    const origin = window.location.origin
    // Always use non-www version for consistency
    const normalized = origin.replace(/^https?:\/\/(www\.)?/, 'https://')
    return normalized
  }
  // Fallback to default (non-www)
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
  setMetaTag('og:site_name', meta?.title || BRAND_NAME, true)
  setMetaTag('og:image:width', '1200', true)
  setMetaTag('og:image:height', '630', true)
  setMetaTag('og:image:alt', meta?.title || (personal?.title ? `${BRAND_NAME} - ${personal.title}` : BRAND_NAME), true)

  // Twitter Card tags
  setMetaTag('twitter:card', 'summary_large_image')
  setMetaTag('twitter:title', meta?.title || '')
  setMetaTag('twitter:description', meta?.description || '')
  setMetaTag('twitter:image', ogImage)
  setMetaTag('twitter:image:alt', meta?.title || (personal?.title ? `${BRAND_NAME} - ${personal.title}` : BRAND_NAME))
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
  personal: Personal,
  metaTitle?: string
): WebSiteSchema {
  const baseUrl = getBaseUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: metaTitle || (personal?.title ? `${BRAND_NAME} - ${personal.title}` : BRAND_NAME),
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
  portfolioData?: Partial<PortfolioData>,
  metaTitle?: string
): void {
  // Extract skill names from all technical skill groups
  const skills = portfolioData?.skills?.technical
    ?.flatMap(group => group.skills.map(skill => skill.name))
    || undefined

  const structuredData: StructuredData = {
    person: createPersonSchema(locale, personal, social, skills),
    professionalService: createProfessionalServiceSchema(locale, personal),
    website: createWebSiteSchema(locale, personal, metaTitle),
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
 * Always uses base URL (no query params) for all languages.
 * hreflang tags handle language versions, not canonical.
 * 
 * @param baseUrl - The base URL to use as canonical
 * @param _locale - Locale parameter (unused, kept for API consistency)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export function updateCanonicalUrl(baseUrl: string, _locale: SupportedLocale): void {
  // Remove existing canonical tags first to avoid duplicates
  const existingCanonical = document.querySelectorAll('link[rel="canonical"]')
  existingCanonical.forEach(link => link.remove())
  
  // Always use base URL as canonical (no query params) for all languages
  // hreflang tags handle language versions, not canonical
  const canonicalUrl = baseUrl // Always base URL, regardless of locale
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
  updateStructuredData(locale, personal, social, portfolioData, meta.title)

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
  updateStructuredData(locale, personal, social, portfolioData, meta.title)

  // Update hreflang tags (they remain the same, but ensure they're present)
  updateHreflangTags(baseUrl)

  // Update canonical URL for new locale
  updateCanonicalUrl(baseUrl, locale)
}



