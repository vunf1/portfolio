# OG Image Requirement

## Overview
An Open Graph (OG) image is required for optimal social media sharing and SEO. The image should be created and placed at:

**Path:** `public/img/og-image.jpg`

## Specifications

### Dimensions
- **Width:** 1200px
- **Height:** 630px
- **Aspect Ratio:** 1.91:1 (standard OG image ratio)

### Content Requirements
The image should include:
- **Brand name:** "jmsit" prominently displayed
- **Name:** "João Maia"
- **Title:** "Full-Stack Developer" or similar
- **Visual branding:** Consistent with portfolio design
- **High quality:** Professional appearance suitable for social sharing

### Format
- **File format:** JPG or PNG
- **File size:** Optimized (ideally < 200KB)
- **Color space:** RGB

### Usage
The image is referenced in:
- `public/data/en/meta.json` - `ogImage: "https://jmsit.cloud/img/og-image.jpg"`
- `public/data/pt-PT/meta.json` - `ogImage: "https://jmsit.cloud/img/og-image.jpg"`
- `index.html` - OG meta tags
- SEO utility (`src/utils/seo.ts`) - Dynamic meta tag updates

### Current Status
✅ **COMPLETED:** OG image has been generated at `public/img/og-image.jpg`

The image was automatically generated using `npm run generate:og-image` script.

## Tools for Creation
- Canva (OG image templates available)
- Figma
- Adobe Photoshop/Illustrator
- Online OG image generators

## Testing
After creating the image, test it using:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)



