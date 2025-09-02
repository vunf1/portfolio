# GitHub Pages Deployment Script for Windows
# Run this script to deploy your portfolio to GitHub Pages

Write-Host "🚀 Starting GitHub Pages Deployment..." -ForegroundColor Green

# Check if gh-pages is installed
if (-not (Get-Command gh-pages -ErrorAction SilentlyContinue)) {
    Write-Host "❌ gh-pages not found. Installing..." -ForegroundColor Yellow
    npm install -g gh-pages
}

# Clean previous build
Write-Host "🧹 Cleaning previous build..." -ForegroundColor Blue
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

# Build for production
Write-Host "🔨 Building for production..." -ForegroundColor Blue
npm run build:gh-pages

# Check if build was successful
if (-not (Test-Path "dist")) {
    Write-Host "❌ Build failed! Check for errors above." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Deploy to GitHub Pages
Write-Host "🚀 Deploying to GitHub Pages..." -ForegroundColor Blue
gh-pages -d dist

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your site will be available at: https://vunf1.github.io/portfolio/" -ForegroundColor Cyan
    Write-Host "⏱️  It may take a few minutes for changes to appear." -ForegroundColor Yellow
} else {
    Write-Host "❌ Deployment failed! Check the error above." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Go to your repository Settings → Pages" -ForegroundColor White
Write-Host "   2. Ensure source is set to 'Deploy from a branch'" -ForegroundColor White
Write-Host "   3. Branch should be 'gh-pages' and folder '/ (root)'" -ForegroundColor White
Write-Host "   4. Replace 'vunf1' in the URL above with your actual GitHub vunf1" -ForegroundColor White
