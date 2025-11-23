const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  width: 1200,
  height: 630,
  outputPath: path.join(__dirname, '../public/img/og-image.jpg'),
  quality: 90
};

// Personal information
const personal = {
  name: 'João Maia',
  brand: 'jmsit',
  title: 'Full-Stack Developer',
  subtitle: 'AI & Automation Specialist',
  location: 'Porto, Portugal'
};

// Escape XML entities
function escapeXML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Create SVG template for OG image
function createOGImageSVG() {
  const brand = escapeXML(personal.brand);
  const name = escapeXML(personal.name);
  const title = escapeXML(personal.title);
  const subtitle = escapeXML(personal.subtitle);
  const location = escapeXML(personal.location);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#16213e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f3460;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0099cc;stop-opacity:1" />
    </linearGradient>
    <filter id="textShadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
      <feOffset dx="2" dy="2" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bgGradient)"/>
  <circle cx="100" cy="100" r="80" fill="#00d4ff" opacity="0.1"/>
  <circle cx="${config.width - 100}" cy="${config.height - 100}" r="120" fill="#0099cc" opacity="0.1"/>
  <rect x="${config.width - 300}" y="0" width="200" height="200" fill="url(#accentGradient)" opacity="0.1" transform="rotate(45 ${config.width - 200} 100)"/>
  <g transform="translate(80, 120)">
    <rect x="0" y="0" width="200" height="50" rx="25" fill="url(#accentGradient)" opacity="0.9"/>
    <text x="100" y="35" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle" filter="url(#textShadow)">${brand}</text>
    <text x="0" y="120" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#ffffff" filter="url(#textShadow)">${name}</text>
    <text x="0" y="200" font-family="Arial, sans-serif" font-size="48" font-weight="600" fill="#00d4ff" filter="url(#textShadow)">${title}</text>
    <text x="0" y="260" font-family="Arial, sans-serif" font-size="36" font-weight="400" fill="#cccccc" filter="url(#textShadow)">${subtitle}</text>
    <g transform="translate(0, 320)">
      <circle cx="12" cy="12" r="8" fill="#00d4ff" opacity="0.8"/>
      <text x="30" y="18" font-family="Arial, sans-serif" font-size="28" font-weight="400" fill="#ffffff" opacity="0.9">${location}</text>
    </g>
  </g>
  <rect x="0" y="${config.height - 8}" width="100%" height="8" fill="url(#accentGradient)"/>
</svg>`;
}

// Generate OG image
async function generateOGImage() {
  try {
    console.log('🎨 Generating OG Image...');
    console.log('========================');
    
    // Ensure output directory exists
    const outputDir = path.dirname(config.outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`✅ Created directory: ${outputDir}`);
    }
    
    // Create SVG
    const svg = createOGImageSVG();
    const svgBuffer = Buffer.from(svg);
    
    // Convert SVG to JPG using sharp
    await sharp(svgBuffer)
      .resize(config.width, config.height, {
        fit: 'fill',
        background: { r: 26, g: 26, b: 46, alpha: 1 }
      })
      .jpeg({
        quality: config.quality,
        progressive: true,
        mozjpeg: true
      })
      .toFile(config.outputPath);
    
    // Get file size
    const stats = fs.statSync(config.outputPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    
    console.log(`✅ OG image generated successfully!`);
    console.log(`📁 Location: ${config.outputPath}`);
    console.log(`📏 Dimensions: ${config.width}x${config.height}px`);
    console.log(`💾 File size: ${fileSizeKB} KB`);
    console.log(`\n🎉 Ready for use!`);
    console.log(`\n📝 Next steps:`);
    console.log(`   1. Review the image at: ${config.outputPath}`);
    console.log(`   2. Test with Facebook Sharing Debugger`);
    console.log(`   3. Deploy to production`);
    
  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateOGImage();
}

module.exports = { generateOGImage };

