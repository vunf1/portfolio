import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// DeepL API configuration
const DEEPL_API_KEY = process.env.DEEPL_API_KEY
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate'

// DeepL API limits
const DEEPL_MAX_TEXTS_PER_REQUEST = 50
const DEEPL_MAX_CHARS_PER_REQUEST = 128 * 1024 // 128KB
const DEEPL_RATE_LIMIT_DELAY = 1000 // 1 second between requests
const DEEPL_RETRY_ATTEMPTS = 3

// Types
interface DeepLTranslationRequest {
  text: string[]
  target_lang: string
  source_lang?: string
}

interface DeepLTranslationResponse {
  translations: Array<{
    detected_source_language: string
    text: string
  }>
}

interface PortfolioData {
  portfolio: Record<string, unknown>
  ui: Record<string, unknown>
}

interface TranslationBatch {
  texts: string[]
  totalChars: number
}

/**
 * Sleep for a specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Calculate the character count of an array of strings
 */
function calculateCharCount(texts: string[]): number {
  return texts.reduce((total, text) => total + text.length, 0)
}

/**
 * Split texts into batches that respect DeepL API limits
 */
function createBatches(texts: string[]): TranslationBatch[] {
  const batches: TranslationBatch[] = []
  let currentBatch: string[] = []
  let currentCharCount = 0

  for (const text of texts) {
    const textLength = text.length

    // Check if adding this text would exceed limits
    if (
      currentBatch.length >= DEEPL_MAX_TEXTS_PER_REQUEST ||
      currentCharCount + textLength > DEEPL_MAX_CHARS_PER_REQUEST
    ) {
      // Save current batch and start a new one
      if (currentBatch.length > 0) {
        batches.push({
          texts: currentBatch,
          totalChars: currentCharCount
        })
        currentBatch = []
        currentCharCount = 0
      }
    }

    // Add text to current batch
    currentBatch.push(text)
    currentCharCount += textLength
  }

  // Add the last batch if it has content
  if (currentBatch.length > 0) {
    batches.push({
      texts: currentBatch,
      totalChars: currentCharCount
    })
  }

  return batches
}

/**
 * Translate a batch of texts using DeepL API
 */
async function translateBatch(
  texts: string[], 
  targetLang: string = 'PT-PT', 
  retries: number = DEEPL_RETRY_ATTEMPTS
): Promise<string[]> {
  if (!DEEPL_API_KEY) {
    console.warn('⚠️  DEEPL_API_KEY not found. Using fallback translation.')
    return texts
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const requestBody: DeepLTranslationRequest = {
        text: texts,
        target_lang: targetLang
      }

      console.log(`🔄 Translating batch of ${texts.length} texts (${calculateCharCount(texts)} chars) - Attempt ${attempt}/${retries}`)

      const response = await fetch(DEEPL_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (response.status === 429 && attempt < retries) {
        const waitTime = attempt * 2 * 1000
        console.log(`⏳ Rate limited, waiting ${waitTime / 1000}s before retry ${attempt}/${retries}...`)
        await sleep(waitTime)
        continue
      }

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`DeepL API error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data: DeepLTranslationResponse = await response.json()
      const translations = data.translations.map(t => t.text)
      
      console.log(`✅ Successfully translated batch of ${texts.length} texts`)
      return translations

    } catch (error) {
      if (attempt === retries) {
        console.error('❌ Translation error:', error)
        return texts // Fallback to original
      }
      console.log(`⚠️  Attempt ${attempt} failed, retrying...`)
      await sleep(1000 * attempt) // Progressive backoff
    }
  }
  
  return texts // Fallback
}

/**
 * Translate all texts in a batch with rate limiting
 */
async function translateTextsInBatches(texts: string[], targetLang: string = 'PT-PT'): Promise<string[]> {
  if (texts.length === 0) return []

  const batches = createBatches(texts)
  const results: string[] = []

  console.log(`📦 Created ${batches.length} batches for ${texts.length} texts`)

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    console.log(`🔄 Processing batch ${i + 1}/${batches.length} (${batch.texts.length} texts, ${batch.totalChars} chars)`)
    
    const translatedBatch = await translateBatch(batch.texts, targetLang)
    results.push(...translatedBatch)

    // Rate limiting between batches
    if (i < batches.length - 1) {
      console.log(`⏳ Waiting ${DEEPL_RATE_LIMIT_DELAY}ms before next batch...`)
      await sleep(DEEPL_RATE_LIMIT_DELAY)
    }
  }

  return results
}

/**
 * Extract all string values from an object recursively
 */
function extractStrings(obj: unknown, path: string = ''): Array<{ value: string; path: string }> {
  const strings: Array<{ value: string; path: string }> = []

  if (typeof obj === 'string') {
    strings.push({ value: obj, path })
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      strings.push(...extractStrings(item, `${path}[${index}]`))
    })
  } else if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      const newPath = path ? `${path}.${key}` : key
      strings.push(...extractStrings(value, newPath))
    })
  }

  return strings
}

/**
 * Reconstruct object with translated strings
 */
function reconstructWithTranslations(
  obj: unknown, 
  translations: Map<string, string>, 
  path: string = ''
): unknown {
  if (typeof obj === 'string') {
    return translations.get(path) || obj
  } else if (Array.isArray(obj)) {
    return obj.map((item, index) => 
      reconstructWithTranslations(item, translations, `${path}[${index}]`)
    )
  } else if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    Object.entries(obj).forEach(([key, value]) => {
      const newPath = path ? `${path}.${key}` : key
      result[key] = reconstructWithTranslations(value, translations, newPath)
    })
    return result
  }
  
  return obj
}

/**
 * Translate an object recursively
 */
async function translateObject(obj: unknown, targetLang: string = 'PT-PT'): Promise<unknown> {
  console.log('🔍 Extracting strings for translation...')
  const stringEntries = extractStrings(obj)
  
  if (stringEntries.length === 0) {
    console.log('ℹ️  No strings found to translate')
    return obj
  }

  console.log(`📝 Found ${stringEntries.length} strings to translate`)

  // Extract just the values for translation
  const textsToTranslate = stringEntries.map(entry => entry.value)
  
  // Translate in batches
  const translatedTexts = await translateTextsInBatches(textsToTranslate, targetLang)
  
  // Create a map of original path to translated text
  const translationMap = new Map<string, string>()
  stringEntries.forEach((entry, index) => {
    translationMap.set(entry.path, translatedTexts[index])
  })

  console.log('🔄 Reconstructing object with translations...')
  return reconstructWithTranslations(obj, translationMap)
}

/**
 * Generate Portuguese translation of the portfolio
 */
async function generatePortugueseTranslation(): Promise<void> {
  try {
    console.log('🔄 Starting Portuguese translation process...')
    
    // Read English source
    const enPath = path.join(__dirname, '../data/portfolio-en.json')
    const enContent: PortfolioData = JSON.parse(fs.readFileSync(enPath, 'utf8'))
    
    console.log('📖 Reading English portfolio source file...')
    
    // Translate the entire object
    console.log('🔄 Translating portfolio to Portuguese (PT-PT)...')
    const ptContent = await translateObject(enContent, 'PT-PT') as PortfolioData
    
    // Save Portuguese file
    const ptPath = path.join(__dirname, '../data/portfolio-pt-PT.json')
    fs.writeFileSync(ptPath, JSON.stringify(ptContent, null, 2), 'utf8')
    
    console.log('✅ Portuguese translation generated successfully!')
    console.log(`📁 Portuguese file saved to: ${ptPath}`)
    
    // Display statistics
    const enStrings = extractStrings(enContent)
    const ptStrings = extractStrings(ptContent)
    console.log(`📊 Translation statistics:`)
    console.log(`   - Original strings: ${enStrings.length}`)
    console.log(`   - Translated strings: ${ptStrings.length}`)
    
  } catch (error) {
    console.error('❌ Error generating Portuguese translation:', error)
    process.exit(1)
  }
}

/**
 * Update only the UI section of the Portuguese file
 */
async function updateUISection(): Promise<void> {
  try {
    console.log('🔄 Starting UI section update...')
    
    // Read English source
    const enPath = path.join(__dirname, '../data/portfolio-en.json')
    const enContent: PortfolioData = JSON.parse(fs.readFileSync(enPath, 'utf8'))
    
    // Read existing Portuguese file
    const ptPath = path.join(__dirname, '../data/portfolio-pt-PT.json')
    let ptContent: PortfolioData
    
    if (fs.existsSync(ptPath)) {
      ptContent = JSON.parse(fs.readFileSync(ptPath, 'utf8'))
      console.log('📖 Found existing Portuguese file, updating UI section...')
    } else {
      console.log('📖 Creating new Portuguese file...')
      ptContent = {
        portfolio: enContent.portfolio // Keep portfolio data as is
      }
    }
    
    // Translate only UI section
    console.log('🔄 Translating UI section to Portuguese (PT-PT)...')
    ptContent.ui = await translateObject(enContent.ui, 'PT-PT') as Record<string, unknown>
    
    // Save updated Portuguese file
    fs.writeFileSync(ptPath, JSON.stringify(ptContent, null, 2), 'utf8')
    
    console.log('✅ UI section updated successfully!')
    console.log(`📁 Portuguese file saved to: ${ptPath}`)
    
  } catch (error) {
    console.error('❌ Error updating UI section:', error)
    process.exit(1)
  }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  const mode = process.argv[2] || 'full'
  
  console.log(`🚀 Starting translation process in '${mode}' mode...`)
  
  switch (mode) {
    case 'ui':
      await updateUISection()
      break
    case 'full':
    default:
      await generatePortugueseTranslation()
      break
  }
  
  console.log('🎉 Translation process completed!')
}

// Execute the script
main().catch(error => {
  console.error('💥 Fatal error:', error)
  process.exit(1)
})
