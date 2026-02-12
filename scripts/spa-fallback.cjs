/**
 * Copies index.html to portfolio/ and portfolio/experience/ etc. for path-based
 * SPA routing on static hosts (GitHub Pages) that don't support server rewrites.
 */
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.warn('⚠️ index.html not found in dist, skipping SPA fallback copy');
  process.exit(0);
}

const indexContent = fs.readFileSync(indexPath, 'utf8');

const routes = ['portfolio', 'portfolio/experience', 'portfolio/education', 'portfolio/skills', 'portfolio/projects', 'portfolio/certifications', 'portfolio/testimonials', 'portfolio/interests', 'portfolio/awards'];

routes.forEach((route) => {
  const dir = path.join(distDir, route);
  fs.mkdirSync(dir, { recursive: true });
  const destPath = path.join(dir, 'index.html');
  fs.writeFileSync(destPath, indexContent);
  console.log(`Created ${route}/index.html for SPA fallback`);
});

console.log('SPA fallback routes created successfully');
