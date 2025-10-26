const fs = require('fs');
const path = require('path');

// Ensure public/data directory exists
const publicDataDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

// Copy data files from src/data to public/data
const srcDataDir = path.join(__dirname, '..', 'src', 'data');
if (fs.existsSync(srcDataDir)) {
  const files = fs.readdirSync(srcDataDir);
  files.forEach(file => {
    if (file.endsWith('.json')) {
      const src = path.join(srcDataDir, file);
      const dest = path.join(publicDataDir, file);
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file} to public/data/`);
    }
  });
}

// Ensure public/img directory exists
const publicImgDir = path.join(__dirname, '..', 'public', 'img');
if (!fs.existsSync(publicImgDir)) {
  fs.mkdirSync(publicImgDir, { recursive: true });
}

// Copy image files from src/img to public/img
const srcImgDir = path.join(__dirname, '..', 'src', 'img');
if (fs.existsSync(srcImgDir)) {
  const files = fs.readdirSync(srcImgDir);
  files.forEach(file => {
    if (file.includes('.')) {
      const src = path.join(srcImgDir, file);
      const dest = path.join(publicImgDir, file);
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file} to public/img/`);
    }
  });
}

// Create .nojekyll file for GitHub Pages
const distDir = path.join(__dirname, '..', 'dist');
const nojekyllDest = path.join(distDir, '.nojekyll');
const nojekyllContent = '# This file tells GitHub Pages to not process files with Jekyll\n# It\'s needed for SPAs and other non-Jekyll sites\n';

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('Created dist directory');
}

// Copy HTML error pages from src to public
const srcHtmlDir = path.join(__dirname, '..', 'src');
const publicHtmlDir = path.join(__dirname, '..', 'public');

if (fs.existsSync(srcHtmlDir)) {
  const files = fs.readdirSync(srcHtmlDir);
  files.forEach(file => {
    if (file.endsWith('.html') && file !== 'index.html') {
      const src = path.join(srcHtmlDir, file);
      const dest = path.join(publicHtmlDir, file);
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file} to public/`);
    }
  });
}

// Always create the .nojekyll file directly
fs.writeFileSync(nojekyllDest, nojekyllContent);
console.log('Created .nojekyll in dist/');

console.log('Data, image, and HTML files copied successfully!');

