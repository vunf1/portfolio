# Translation Script

This script translates UI text from English to Portuguese using the DeepL API and works with the new consolidated data structure.

## Setup

1. **Install dependencies:**
   ```bash
   npm install dotenv
   ```

2. **Create a `.env` file** in the project root with your DeepL API key:
   ```
   DEEPL_API_KEY=your_deepl_api_key_here
   ```

3. **Get a DeepL API key:**
   - Sign up at [DeepL API](https://www.deepl.com/pro-api)
   - Copy your API key to the `.env` file

## Usage

The script supports three modes:

### 1. Update Mode (Default)
Updates the existing Portuguese file with translated UI text while preserving portfolio data:

```bash
node src/scripts/translate.js
# or
node src/scripts/translate.js update
```

### 2. Full Mode
Creates a complete Portuguese file from scratch (copies portfolio data and translates UI):

```bash
node src/scripts/translate.js full
```

### 3. UI-Only Mode
Translates only the UI section and saves it as a separate file for reference:

```bash
node src/scripts/translate.js ui
```

## How It Works

1. **Reads** the English consolidated file (`src/data/portfolio-en.json`)
2. **Translates** only the `ui` section to Portuguese
3. **Preserves** the `portfolio` section (which should already be manually translated)
4. **Saves** the result to `src/data/portfolio-pt-PT.json`

## File Structure

```
src/data/
├── portfolio-en.json      # English source (portfolio + ui)
├── portfolio-pt-PT.json   # Portuguese target (portfolio + translated ui)
└── ui-pt-PT.json          # UI-only translation (when using 'ui' mode)
```

## Important Notes

- **Portfolio Data**: The script assumes portfolio data is already manually translated
- **UI Text**: Only UI text (navigation, buttons, labels) is automatically translated
- **Rate Limiting**: Includes 500ms delays between API calls and automatic retry with exponential backoff
- **Fallback**: If no API key is provided, text remains unchanged
- **Error Handling**: Continues translation even if individual texts fail, with 3 retry attempts for rate limiting

## Example Output

```bash
🔄 Starting consolidated file update...
📖 Found existing Portuguese file, updating UI section...
🔄 Translating UI text to Portuguese (PT-PT)...
✅ Consolidated file updated successfully!
📁 Portuguese file saved to: src/data/portfolio-pt-PT.json
```

## Troubleshooting

- **API Key Missing**: Script will warn and use original text
- **Network Errors**: Individual translations will fall back to original text
- **File Not Found**: Script will create new Portuguese file
- **Rate Limiting**: Built-in delays and retry mechanism should handle most rate limit issues
- **429 Errors**: Script automatically retries with exponential backoff (2s, 4s, 6s delays)
