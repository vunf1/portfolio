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

// Copy .nojekyll file for GitHub Pages
const nojekyllSrc = path.join(__dirname, '..', 'public', '.nojekyll');
const nojekyllDest = path.join(__dirname, '..', 'dist', '.nojekyll');

if (fs.existsSync(nojekyllSrc)) {
  fs.copyFileSync(nojekyllSrc, nojekyllDest);
  console.log('Copied .nojekyll to dist/');
} else {
  // Create .nojekyll file if it doesn't exist
  fs.writeFileSync(nojekyllDest, '');
  console.log('Created .nojekyll in dist/');
}

console.log('Data and image files copied successfully!');

