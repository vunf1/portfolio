# Portfolio Data Structure

## Overview

This portfolio uses a consolidated data structure where each language has a single JSON file containing both portfolio content and UI translations. This approach simplifies data management and ensures consistency between content and translations.

## File Structure

```
src/data/
├── portfolio-en.json      # English data + UI translations
└── portfolio-pt-PT.json   # Portuguese data + UI translations
```

## Data Structure

Each language file contains two main sections:

### 1. Portfolio Data (`portfolio`)
Contains all the portfolio content:
- Personal information
- Experience
- Education
- Skills
- Projects
- Certifications
- Interests
- Awards
- Testimonials
- Contact information
- Meta data

### 2. UI Translations (`ui`)
Contains all UI text translations:
- Navigation labels
- Section titles and subtitles
- Form labels
- Button text
- Common UI elements

## Usage

### Using the Consolidated Hook

```typescript
import { useConsolidatedData } from '../hooks/usePortfolioData'

function MyComponent() {
  const { data, loading, error } = useConsolidatedData()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data available</div>
  
  // Access portfolio data
  const { personal, experience, skills } = data.portfolio
  
  // Access UI translations
  const { navigation, hero, about } = data.ui
  
  return (
    <div>
      <h1>{personal.name}</h1>
      <h2>{ui.hero.title}</h2>
    </div>
  )
}
```

### Using Separate Hooks

```typescript
import { usePortfolioData } from '../hooks/usePortfolioData'
import { useI18n } from '../hooks/useI18n'

function MyComponent() {
  const { portfolioData, loading, error } = usePortfolioData()
  const { t } = useI18n()
  
  if (loading) return <div>{t('common.loading')}</div>
  if (error) return <div>{t('common.error')}: {error.message}</div>
  if (!portfolioData) return <div>No data available</div>
  
  return (
    <div>
      <h1>{portfolioData.personal.name}</h1>
      <h2>{t('hero.title')}</h2>
    </div>
  )
}
```

## Benefits of Consolidated Structure

1. **Simplified Management**: One file per language instead of separate data and translation files
2. **Consistency**: Ensures content and translations are always in sync
3. **Easier Maintenance**: Single source of truth for each language
4. **Reduced Complexity**: Fewer files to manage and update
5. **Better Performance**: Single fetch per language instead of multiple requests

## Migration from Separate Files

If you're migrating from the old structure:

1. **Old Structure**:
   ```
   src/data/portfolio-data-en.json
   src/data/portfolio-data-pt-PT.json
   src/locales/en/translation.json
   src/locales/pt-PT/translation.json
   ```

2. **New Structure**:
   ```
   src/data/portfolio-en.json
   src/data/portfolio-pt-PT.json
   ```

3. **Update Hooks**: Use `useConsolidatedData()` for access to both data and UI translations, or continue using separate hooks with updated file paths.

## Adding New Languages

To add a new language (e.g., Spanish):

1. Create `src/data/portfolio-es.json`
2. Structure it with `portfolio` and `ui` sections
3. Update the hooks to include the new language code
4. Update the i18n configuration

## Best Practices

1. **Keep Structure Consistent**: Ensure both `portfolio` and `ui` sections exist in all language files
2. **Validate Data**: Always validate the data structure when loading
3. **Cache Efficiently**: Use the built-in caching mechanism for better performance
4. **Type Safety**: Use TypeScript interfaces to ensure data consistency
5. **Fallback Handling**: Always provide fallback to default language if data fails to load
