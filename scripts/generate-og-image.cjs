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
  brand: 'JMSIT', // Uppercase
  title: 'Full-Stack Engineer',
  subtitle: 'AI & Automation',
  location: 'Porto, Portugal'
};

// Logo path
const logoPath = path.join(__dirname, '../public/img/logo.png');

// Escape XML entities
function escapeXML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Create SVG template for OG image (text on right side)
function createOGImageSVG() {
  const brand = escapeXML(personal.brand);
  const name = escapeXML(personal.name);
  const title = escapeXML(personal.title);
  const subtitle = escapeXML(personal.subtitle);
  const location = escapeXML(personal.location);
  
  // Layout: Logo on left (centered), text on right
  // Left side: 0-500px (logo area)
  // Right side: 500-1200px (text area)
  const leftSectionWidth = 500;
  const rightSectionStart = 500;
  const rightSectionPadding = 60;
  const textStartX = rightSectionStart + rightSectionPadding;
  
  // Vertical center for alignment
  const verticalCenter = config.height / 2;
  const textStartY = verticalCenter - 150; // Start text slightly above center
  
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
    <radialGradient id="cornerGlow1" cx="0%" cy="0%">
      <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:0.25" />
      <stop offset="100%" style="stop-color:#00d4ff;stop-opacity:0" />
    </radialGradient>
    <radialGradient id="cornerGlow2" cx="100%" cy="100%">
      <stop offset="0%" style="stop-color:#0099cc;stop-opacity:0.25" />
      <stop offset="100%" style="stop-color:#0099cc;stop-opacity:0" />
    </radialGradient>
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
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <pattern id="dotPattern" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1" fill="#00d4ff" opacity="0.2"/>
    </pattern>
  </defs>
  
  <!-- Base gradient background -->
  <rect width="100%" height="100%" fill="url(#bgGradient)"/>
  
  <!-- Subtle dot pattern (only in safe areas) -->
  <rect x="0" y="0" width="450" height="100" fill="url(#dotPattern)"/>
  <rect x="0" y="${config.height - 100}" width="450" height="100" fill="url(#dotPattern)"/>
  <rect x="1100" y="0" width="100" height="100" fill="url(#dotPattern)"/>
  <rect x="1100" y="${config.height - 100}" width="100" height="100" fill="url(#dotPattern)"/>
  
  <!-- Corner glow effects (top-left and bottom-right corners only) -->
  <ellipse cx="0" cy="0" rx="300" ry="300" fill="url(#cornerGlow1)" filter="url(#glow)"/>
  <ellipse cx="${config.width}" cy="${config.height}" rx="350" ry="350" fill="url(#cornerGlow2)" filter="url(#glow)"/>
  
  <!-- Tech accent lines (only in safe edge areas, away from content) -->
  <g opacity="0.3">
    <!-- Top edge line -->
    <line x1="0" y1="30" x2="${config.width}" y2="30" stroke="#00d4ff" stroke-width="1" stroke-dasharray="8,4"/>
    <!-- Bottom edge line -->
    <line x1="0" y1="${config.height - 30}" x2="${config.width}" y2="${config.height - 30}" stroke="#0099cc" stroke-width="1" stroke-dasharray="8,4"/>
    <!-- Left edge vertical accent -->
    <line x1="30" y1="0" x2="30" y2="${config.height}" stroke="#00d4ff" stroke-width="1" opacity="0.2"/>
    <!-- Right edge vertical accent -->
    <line x1="${config.width - 30}" y1="0" x2="${config.width - 30}" y2="${config.height}" stroke="#0099cc" stroke-width="1" opacity="0.2"/>
  </g>
  
  <!-- Tech nodes in corners only (away from content) -->
  <g opacity="0.5" filter="url(#glow)">
    <circle cx="50" cy="50" r="5" fill="#00d4ff"/>
    <circle cx="${config.width - 50}" cy="50" r="5" fill="#00d4ff"/>
    <circle cx="50" cy="${config.height - 50}" r="5" fill="#0099cc"/>
    <circle cx="${config.width - 50}" cy="${config.height - 50}" r="5" fill="#0099cc"/>
  </g>
  
  <!-- Subtle geometric shapes in safe corner areas -->
  <g opacity="0.15">
    <!-- Top-left corner hex -->
    <polygon points="80,80 100,70 120,80 120,100 100,110 80,100" fill="#00d4ff" filter="url(#glow)"/>
    <!-- Bottom-right corner hex -->
    <polygon points="${config.width - 80},${config.height - 80} ${config.width - 100},${config.height - 70} ${config.width - 120},${config.height - 80} ${config.width - 120},${config.height - 100} ${config.width - 100},${config.height - 110} ${config.width - 80},${config.height - 100}" fill="#0099cc" filter="url(#glow)"/>
  </g>
  
  <!-- Text content on right side -->
  <g transform="translate(${textStartX}, ${textStartY})">
    <!-- Brand badge -->
    <rect x="0" y="0" width="220" height="50" rx="25" fill="url(#accentGradient)" opacity="0.9"/>
    <text x="110" y="35" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle" filter="url(#textShadow)">${brand}</text>
    
    <!-- Name -->
    <text x="0" y="110" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#ffffff" filter="url(#textShadow)">${name}</text>
    
    <!-- Title -->
    <text x="0" y="180" font-family="Arial, sans-serif" font-size="48" font-weight="600" fill="#00d4ff" filter="url(#textShadow)">${title}</text>
    
    <!-- Subtitle -->
    <text x="0" y="240" font-family="Arial, sans-serif" font-size="36" font-weight="400" fill="#cccccc" filter="url(#textShadow)">${subtitle}</text>
    
    <!-- Location -->
    <g transform="translate(0, 300)">
      <circle cx="12" cy="12" r="8" fill="#00d4ff" opacity="0.8"/>
      <text x="30" y="18" font-family="Arial, sans-serif" font-size="28" font-weight="400" fill="#ffffff" opacity="0.9">${location}</text>
    </g>
  </g>
  
  <!-- Bottom accent line -->
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
    
    // Check if logo exists
    if (!fs.existsSync(logoPath)) {
      console.error(`❌ Logo not found at: ${logoPath}`);
      process.exit(1);
    }
    
    // Create SVG (text on right)
    const svg = createOGImageSVG();
    const svgBuffer = Buffer.from(svg);
    
    // Load and prepare logo (2x bigger: 800x800)
    const logo = await sharp(logoPath)
      .resize(800, 800, {
        fit: 'inside',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();
    
    // Create base image from SVG
    const baseImage = sharp(svgBuffer)
      .resize(config.width, config.height, {
        fit: 'fill',
        background: { r: 26, g: 26, b: 46, alpha: 1 }
      });
    
    // Composite logo on left side (centered vertically and horizontally in left section, aligned with text)
    const logoSize = 800;
    // Center logo in the left half of canvas (0-600px) to align with text on right
    const leftSectionCenter = 300; // Center of left section
    const logoX = leftSectionCenter - (logoSize / 2); // Center horizontally
    
    // Calculate text content center position to align logo with text
    // Text starts at textStartY (verticalCenter - 150) and extends down
    // Logo should be centered to match the text block center, moved down more
    const textStartY = (config.height / 2) - 150; // Same as in SVG
    const textBlockHeight = 350; // Approximate height of text content
    const textCenterY = textStartY + (textBlockHeight / 2);
    // Move logo down by adding offset to better align with text
    const verticalOffset = 120; // Additional offset to move logo down
    const logoY = textCenterY - (logoSize / 2) + verticalOffset; // Center logo with text block, moved down
    
    await baseImage
      .composite([{
        input: logo,
        left: logoX,
        top: logoY
      }])
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

