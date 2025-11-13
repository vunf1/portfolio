#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying dist folder contents...\n');

const distPath = './dist';
const requiredFiles = {
  'index.html': 'Main entry point',
  '404.html': 'SPA routing support',
  'sitemap.xml': 'SEO sitemap',
  'robots.txt': 'SEO robots file',
  '_headers': 'Security headers'
};

const requiredFolders = {
  'assets': 'JavaScript, CSS, and font files',
  'img': 'Profile and background images',
  'data': 'Portfolio data (EN/PT)'
};

const requiredAssets = {
  'assets': ['*.js', '*.css', '*.woff', '*.ttf', '*.eot', '*.svg'],
  'img': ['*.jpg', '*.jpeg', '*.png'],
  'data': ['*.json']
};

let allGood = true;

// Check if dist folder exists
if (!fs.existsSync(distPath)) {
  console.log('❌ Dist folder not found! Run "npm run build:gh-pages" first.');
  process.exit(1);
}

console.log('📁 Checking root files...');
Object.entries(requiredFiles).forEach(([file, description]) => {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`  ✅ ${file} (${description}) - ${(stats.size / 1024).toFixed(1)} KB`);
  } else {
    console.log(`  ❌ ${file} (${description}) - MISSING`);
    allGood = false;
  }
});

console.log('\n📁 Checking required folders...');
Object.entries(requiredFolders).forEach(([folder, description]) => {
  const folderPath = path.join(distPath, folder);
  if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
    const files = fs.readdirSync(folderPath);
    console.log(`  ✅ ${folder}/ (${description}) - ${files.length} files`);
    
    // Check for specific file types
    if (requiredAssets[folder]) {
      const hasRequiredFiles = requiredAssets[folder].some(pattern => {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return files.some(file => regex.test(file));
      });
      
      if (hasRequiredFiles) {
        console.log(`    📦 Contains required asset types`);
      } else {
        console.log(`    ⚠️  Missing some required asset types`);
        allGood = false;
      }
    }
  } else {
    console.log(`  ❌ ${folder}/ (${description}) - MISSING`);
    allGood = false;
  }
});

console.log('\n📊 Summary:');
if (allGood) {
  console.log('🎉 All required files and folders are present!');
  console.log('🚀 Your portfolio is ready for deployment.');
  
  // Calculate total size
  const totalSize = calculateFolderSize(distPath);
  console.log(`📦 Total dist folder size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
  
  console.log('\n🌐 Next steps:');
  console.log('  1. Commit and push to trigger automatic deployment');
  console.log('  2. Or run manually: npm run deploy');
  console.log('  3. Check GitHub Actions for deployment status');
} else {
  console.log('❌ Some required files are missing!');
  console.log('🔧 Run "npm run build:gh-pages" to rebuild.');
  process.exit(1);
}

function calculateFolderSize(folderPath) {
  let totalSize = 0;
  
  if (fs.existsSync(folderPath)) {
    const items = fs.readdirSync(folderPath);
    
    items.forEach(item => {
      const itemPath = path.join(folderPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        totalSize += calculateFolderSize(itemPath);
      } else {
        totalSize += stats.size;
      }
    });
  }
  
  return totalSize;
}

