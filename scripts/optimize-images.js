const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  inputDir: 'src/img',
  outputDir: 'public/img/optimized',
  quality: 80,
  formats: ['webp', 'avif', 'jpeg'],
  sizes: {
    profile: [
      { width: 150, height: 150, suffix: 'xs' },
      { width: 300, height: 300, suffix: 'sm' },
      { width: 600, height: 600, suffix: 'md' },
      { width: 1200, height: 1200, suffix: 'lg' }
    ],
    background: [
      { width: 480, height: 320, suffix: 'xs' },
      { width: 768, height: 512, suffix: 'sm' },
      { width: 1024, height: 683, suffix: 'md' },
      { width: 1920, height: 1280, suffix: 'lg' },
      { width: 2560, height: 1707, suffix: 'xl' }
    ]
  }
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Image optimization functions
async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const image = sharp(inputPath);
    
    // Apply transformations
    if (options.width && options.height) {
      image.resize(options.width, options.height, {
        fit: 'cover',
        position: 'center'
      });
    }
    
    // Apply quality settings
    if (options.format === 'webp') {
      await image.webp({ quality: options.quality || config.quality }).toFile(outputPath);
    } else if (options.format === 'avif') {
      await image.avif({ quality: options.quality || config.quality }).toFile(outputPath);
    } else if (options.format === 'jpeg') {
      await image.jpeg({ 
        quality: options.quality || config.quality,
        progressive: true,
        mozjpeg: true
      }).toFile(outputPath);
    }
    
    console.log(`✅ Optimized: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

// Generate responsive images for profile
async function optimizeProfile() {
  const inputPath = path.join(config.inputDir, 'profile.jpg');
  const baseName = 'profile';
  
  console.log('\n🖼️  Optimizing profile image...');
  
  for (const format of config.formats) {
    for (const size of config.sizes.profile) {
      const outputPath = path.join(
        config.outputDir, 
        `${baseName}-${size.suffix}.${format}`
      );
      
      await optimizeImage(inputPath, outputPath, {
        format,
        width: size.width,
        height: size.height,
        quality: format === 'webp' ? 85 : 80
      });
    }
  }
}

// Generate responsive images for background
async function optimizeBackground() {
  const inputPath = path.join(config.inputDir, 'background.jpeg');
  const baseName = 'background';
  
  console.log('\n🖼️  Optimizing background image...');
  
  for (const format of config.formats) {
    for (const size of config.sizes.background) {
      const outputPath = path.join(
        config.outputDir, 
        `${baseName}-${size.suffix}.${format}`
      );
      
      await optimizeImage(inputPath, outputPath, {
        format,
        width: size.width,
        height: size.height,
        quality: format === 'webp' ? 75 : 70 // Lower quality for background
      });
    }
  }
}

// Generate srcset strings for HTML
function generateSrcset(baseName, format) {
  const sizes = baseName === 'profile' ? config.sizes.profile : config.sizes.background;
  const srcset = sizes.map(size => {
    const fileName = `${baseName}-${size.suffix}.${format}`;
    const path = `./img/optimized/${fileName}`;
    return `${path} ${size.width}w`;
  }).join(', ');
  
  return srcset;
}

// Generate HTML picture element
function generatePictureElement(baseName, alt, className = '') {
  const webpSrcset = generateSrcset(baseName, 'webp');
  const avifSrcset = generateSrcset(baseName, 'avif');
  const jpegSrcset = generateSrcset(baseName, 'jpeg');
  
  const defaultSrc = `./img/optimized/${baseName}-md.jpeg`;
  
  return `<picture class="${className}">
  <source type="image/avif" srcset="${avifSrcset}">
  <source type="image/webp" srcset="${webpSrcset}">
  <img src="${defaultSrc}" srcset="${jpegSrcset}" alt="${alt}" loading="lazy">
</picture>`;
}

// Generate optimization report
function generateReport() {
  console.log('\n📊 Image Optimization Report');
  console.log('============================');
  
  console.log('\n🖼️  Profile Image:');
  console.log('  - Original: 80KB (JPEG)');
  console.log('  - Optimized: Multiple formats and sizes');
  console.log('  - Formats: WebP, AVIF, JPEG');
  console.log('  - Sizes: 150x150, 300x300, 600x600, 1200x1200');
  
  console.log('\n🖼️  Background Image:');
  console.log('  - Original: 1.3MB (JPEG)');
  console.log('  - Optimized: Multiple formats and sizes');
  console.log('  - Formats: WebP, AVIF, JPEG');
  console.log('  - Sizes: 480x320, 768x512, 1024x683, 1920x1280, 2560x1707');
  
  console.log('\n📱 Responsive Loading:');
  console.log('  - WebP: Best compression, modern browsers');
  console.log('  - AVIF: Best compression, newer browsers');
  console.log('  - JPEG: Fallback for older browsers');
  
  console.log('\n💾 Expected Size Reduction:');
  console.log('  - Profile: ~60-70% smaller');
  console.log('  - Background: ~70-80% smaller');
  console.log('  - Total: ~1MB+ reduction');
}

// Main execution
async function main() {
  console.log('🚀 Starting Image Optimization...');
  console.log('================================');
  
  try {
    // Optimize images
    await optimizeProfile();
    await optimizeBackground();
    
    // Generate report
    generateReport();
    
    // Generate HTML examples
    console.log('\n📝 HTML Usage Examples:');
    console.log('========================');
    
    console.log('\nProfile Image:');
    console.log(generatePictureElement('profile', 'João Maia - Software Developer', 'profile-image'));
    
    console.log('\nBackground Image:');
    console.log(generatePictureElement('background', 'Technology background', 'hero-background'));
    
    console.log('\n🎉 Image optimization complete!');
    console.log('📁 Check the "public/img/optimized" directory for optimized images.');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  optimizeProfile,
  optimizeBackground,
  generatePictureElement,
  generateSrcset
};
