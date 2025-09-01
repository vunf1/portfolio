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

async function translateText(text, targetLang = 'PT-PT', retries = 3) {
  if (!DEEPL_API_KEY) {
    console.warn('⚠️  DEEPL_API_KEY not found. Using fallback translation.')
    return text
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(DEEPL_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: [text],
          target_lang: targetLang
        })
      })

      if (response.status === 429 && attempt < retries) {
        console.log(`⏳ Rate limited, waiting ${attempt * 2}s before retry ${attempt}/${retries}...`)
        await new Promise(resolve => setTimeout(resolve, attempt * 2000))
        continue
      }

      if (!response.ok) {
        throw new Error(`DeepL API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.translations[0].text
    } catch (error) {
      if (attempt === retries) {
        console.error('Translation error:', error)
        return text // Fallback to original
      }
      console.log(`⚠️  Attempt ${attempt} failed, retrying...`)
    }
  }
  
  return text // Fallback
}

async function translateObject(obj, targetLang) {
  const translated = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      translated[key] = await translateText(value, targetLang)
      // Add delay to respect API rate limits (increased to 500ms to avoid 429 errors)
      await new Promise(resolve => setTimeout(resolve, 500))
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, targetLang)
    } else {
      translated[key] = value
    }
  }
  
  return translated
}

async function generateConsolidatedTranslations() {
  try {
    console.log('🔄 Starting consolidated translation process...')
    
    // Read English source
    const enPath = path.join(__dirname, '../data/portfolio-en.json')
    const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'))
    
    console.log('📖 Reading English consolidated source file...')
    
    // Create Portuguese version with same structure
    const ptContent = {
      portfolio: enContent.portfolio, // Keep portfolio data as is (already translated)
      ui: {} // Will translate UI text
    }
    
    // Translate UI section to Portuguese
    console.log('🔄 Translating UI text to Portuguese (PT-PT)...')
    ptContent.ui = await translateObject(enContent.ui, 'PT-PT')
    
    // Save Portuguese consolidated file
    const ptPath = path.join(__dirname, '../data/portfolio-pt-PT.json')
    fs.writeFileSync(ptPath, JSON.stringify(ptContent, null, 2))
    
    console.log('✅ Consolidated translations generated successfully!')
    console.log(`📁 Portuguese file saved to: ${ptPath}`)
    
  } catch (error) {
    console.error('❌ Error generating translations:', error)
    process.exit(1)
  }
}

async function generateUITranslations() {
  try {
    console.log('🔄 Starting UI-only translation process...')
    
    // Read English source
    const enPath = path.join(__dirname, '../data/portfolio-en.json')
    const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'))
    
    console.log('📖 Reading English UI source...')
    
    // Translate only UI section
    console.log('🔄 Translating UI text to Portuguese (PT-PT)...')
    const ptUI = await translateObject(enContent.ui, 'PT-PT')
    
    // Save only UI translation (for reference)
    const ptUIPath = path.join(__dirname, '../data/ui-pt-PT.json')
    fs.writeFileSync(ptUIPath, JSON.stringify(ptUI, null, 2))
    
    console.log('✅ UI translations generated successfully!')
    console.log(`📁 UI file saved to: ${ptUIPath}`)
    
  } catch (error) {
    console.error('❌ Error generating UI translations:', error)
    process.exit(1)
  }
}

async function updateConsolidatedFile() {
  try {
    console.log('🔄 Starting consolidated file update...')
    
    // Read English source
    const enPath = path.join(__dirname, '../data/portfolio-en.json')
    const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'))
    
    // Read existing Portuguese file
    const ptPath = path.join(__dirname, '../data/portfolio-pt-PT.json')
    let ptContent = {}
    
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
    console.log('🔄 Translating UI text to Portuguese (PT-PT)...')
    ptContent.ui = await translateObject(enContent.ui, 'PT-PT')
    
    // Save updated Portuguese file
    fs.writeFileSync(ptPath, JSON.stringify(ptContent, null, 2))
    
    console.log('✅ Consolidated file updated successfully!')
    console.log(`📁 Portuguese file saved to: ${ptPath}`)
    
  } catch (error) {
    console.error('❌ Error updating consolidated file:', error)
    process.exit(1)
  }
}

// Get command line argument for translation mode
const mode = process.argv[2] || 'update'

switch (mode) {
  case 'full':
    await generateConsolidatedTranslations()
    break
  case 'ui':
    await generateUITranslations()
    break
  case 'update':
  default:
    await updateConsolidatedFile()
    break
}
