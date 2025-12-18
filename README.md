# João Maia - Enterprise Portfolio Website

[![CI/CD](https://img.shields.io/badge/CI%2FCD-Ready-blue?logo=github-actions&logoColor=white)](https://github.com/vunf1/portfolio/actions)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://vunf1.github.io/portfolio/)
[![Vite](https://img.shields.io/badge/Vite-5.1.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Preact](https://img.shields.io/badge/Preact-10.19.6-673AB8?logo=preact&logoColor=white)](https://preactjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-1.3.1-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security](https://img.shields.io/badge/Security-GDPR%20Compliant-green)](https://gdpr.eu/)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-blue)](https://www.w3.org/TR/WCAG22/)

A modern, enterprise-grade portfolio website built with **Vite + Preact + TypeScript**, featuring GDPR-compliant contact forms, bilingual support, and premium user experience optimized for Core Web Vitals and accessibility. The project implements a sophisticated single scroll container architecture, centralized state management, and comprehensive testing coverage.

## 🚀 **Features**

### **Privacy & Security**
- 🛡️ **GDPR Compliance** - Full data protection with explicit consent mechanisms
- 🔐 **Secure Data Handling** - Secure form submission with validation
- 🔗 **n8n Integration** - Automated contact form processing with webhook support
- ✅ **Form Validation** - E.164 phone validation, email validation, and name validation

### **Enterprise UX/UI**
- 🎨 **Premium Design System** - Enterprise-grade aesthetic with design tokens
- 🌍 **Bilingual Support** - English/Portuguese with smooth locale switching
- 📱 **Responsive Design** - Mobile-first approach with fluid grids
- ⚡ **Performance Optimized** - <60KB initial JS, lazy loading, code splitting
- 🎯 **Scrollbar Management** - Single scroll container architecture preventing double scrollbars
- 🎭 **Smooth Animations** - Intersection Observer-based scroll animations with reduced motion support
- 💬 **Centralized Modal State** - Efficient contact modal management with CSS-based scroll lock

### **Technical Excellence**
- 🏗️ **Modern Architecture** - Vite + Preact + TypeScript with strict typing
- 🧪 **Comprehensive Testing** - Vitest + Testing Library with 90%+ coverage including scrollbar behavior tests
- ♿ **Accessibility** - WCAG 2.2 AA compliant with keyboard navigation
- 🔍 **SEO Optimized** - Structured data, meta tags, and semantic HTML
- 🚀 **CI/CD Ready** - Automated testing, security audits, and deployment
- 🎨 **Modular CSS Architecture** - Organized CSS with design tokens and component-specific styles
- 🔧 **Type-Safe Components** - Full TypeScript coverage with strict type checking

## 📁 **Project Structure**

```
portfolio/
├── src/                      # Source code
│   ├── components/           # React/Preact components
│   │   ├── ui/              # Reusable UI components
│   │   ├── landing/         # Landing page components
│   │   │   ├── LandingPage.tsx      # Main landing page
│   │   │   ├── LandingHero.tsx     # Hero section
│   │   │   ├── LandingFeatures.tsx  # Features section
│   │   │   ├── LandingAbout.tsx     # About section
│   │   │   ├── LandingFooter.tsx     # Footer section
│   │   │   └── VideoBackground.tsx   # Video background component
│   │   ├── __tests__/       # Component tests
│   │   ├── About.tsx        # About section
│   │   ├── FloatingActionButton.tsx  # FAB component
│   │   └── ...              # Other sections
│   ├── hooks/               # Custom React hooks
│   │   ├── __tests__/       # Hook tests
│   │   ├── useI18n.ts       # Internationalization
│   │   ├── usePortfolioData.ts  # Portfolio data fetching
│   │   └── useModularPortfolioData.ts  # Modular data loading
│   ├── types/               # TypeScript type definitions
│   │   ├── portfolio.ts     # Portfolio data types
│   │   ├── components.ts    # Component types
│   │   ├── hooks.ts         # Hook types
│   │   ├── n8n.ts           # n8n integration types
│   │   └── seo.ts           # SEO and metadata types
│   ├── contexts/            # React contexts
│   │   └── TranslationContext.tsx
│   ├── css/                 # Styling
│   │   ├── tokens.css       # Design tokens
│   │   ├── variables.css    # CSS variables
│   │   ├── base.css         # Base layout styles
│   │   ├── modal.css        # Modal components
│   │   ├── navigation.css   # Navigation styles
│   │   ├── grid.css         # Grid system
│   │   ├── responsive.css   # Responsive styles
│   │   ├── performance.css  # Performance optimizations
│   │   ├── landing.css      # Landing page styles (entry point)
│   │   ├── landing/         # Landing page modular CSS
│   │   │   ├── _variables.css    # Landing color variables
│   │   │   ├── _layout.css       # Landing layout & critical overrides
│   │   │   ├── _animations.css   # Scroll animations
│   │   │   ├── _hero.css         # Hero section styles
│   │   │   ├── _features.css     # Features section styles
│   │   │   ├── _about.css        # About section styles
│   │   │   ├── _footer.css       # Footer section styles
│   │   │   ├── _responsive.css   # Responsive design rules
│   │   │   └── _accessibility.css # Accessibility features
│   │   └── components/      # Component-specific styles
│   │       ├── about.css    # About component styles
│   │       ├── contact-modal-premium.css  # Contact modal styles
│   │       ├── hero.css     # Hero component styles
│   │       └── ...          # Other component-specific styles
│   ├── utils/               # Utility functions
│   │   ├── __tests__/       # Utility tests
│   │   ├── validation.ts    # Form validation (E.164, email, name)
│   │   ├── n8nClient.ts     # n8n webhook integration client
│   │   ├── seo.ts           # SEO utilities and structured data
│   │   └── preloadPortfolioChunks.ts  # Performance optimization
│   ├── test/                # Test utilities
│   │   ├── setup.ts         # Test setup
│   │   └── test-utils.tsx   # Testing utilities
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Application entry point
│   └── i18n.ts              # i18n configuration
├── public/                   # Static assets
│   ├── data/                # JSON data files
│   │   ├── en/              # English content
│   │   └── pt-PT/           # Portuguese content
│   ├── img/                 # Images and assets
│   └── _headers             # Security headers
├── scripts/                 # Build and utility scripts
│   ├── copy-data.cjs        # Data copying script
│   ├── optimize-images.cjs  # Image optimization
│   └── verify-dist.js       # Build verification script
├── .github/                 # GitHub configuration
│   └── workflows/           # GitHub Actions workflows
│       ├── ci.yml          # CI/CD pipeline
│       ├── quality.yml     # Quality assurance
│       └── security.yml    # Security & dependencies
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── vitest.config.ts         # Test configuration
├── postcss.config.cjs       # PostCSS configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## 🛠️ **Installation & Setup**

### **Prerequisites**
- **Node.js** 18+ (LTS recommended)
- **npm** 9+ or **yarn** 1.22+
- **Git** for version control

### **1. Clone Repository**
```bash
git clone https://github.com/vunf1/portfolio.git
cd portfolio
```

### **2. Install Dependencies**
```bash
npm install
# or
yarn install
```

### **3. Development Server**
```bash
# Start development server with hot reload
npm run dev

# Fast development (skip data copying)
npm run dev:fast

# Development with bundle analysis
npm run dev:analyze
```

### **4. Production Build**
```bash
# Build for production
npm run build

# Build with analysis
npm run build:analyze

# Build for GitHub Pages
npm run build:gh-pages
```

### **5. Preview Production Build**
```bash
npm run preview
```

## 🔧 **Configuration**

### **Environment Variables**
Create `.env.local` for local development:
```bash
# Application URL (optional, defaults to current origin)
VITE_APP_URL="http://localhost:3000"

# n8n Webhook Integration
# REQUIRED: These environment variables are mandatory for the contact form to work
# Copy .env.example to .env.local and fill in your actual values
VITE_N8N_WEBHOOK_URL=https://n8n.<your.domain>/webhook-test/your-webhook-id
# Authentication token for webhook (sent as custom header, default header name: 'X-API-Key')
# Supports both VITE_N8N_AUTH_TOKEN (new) and VITE_N8N_JWT_TOKEN (legacy) for backward compatibility
VITE_N8N_AUTH_TOKEN=your-auth-token-here
```

**Note:** Only the n8n webhook variables are actually used in the codebase. Other environment variables mentioned in examples are placeholders for future features.

> **⚠️ CRITICAL SECURITY WARNING**: 
> - **NEVER commit `.env.local`, `.env.production`, or any `.env*` files with real values to version control**
> - The `.gitignore` file already excludes these files to prevent accidental commits
> - **In production builds, these environment variables are REQUIRED** - the build will fail if they are missing
> - For GitHub Actions CI/CD, configure these as GitHub Secrets (see CI/CD section below)
> - Use `.env.example` as a template only - it contains placeholders, not real values

### **n8n Webhook Integration**

The portfolio includes a contact form that sends submissions to an n8n webhook for processing. The integration is handled by the `N8nClient` class located in `src/utils/n8nClient.ts`.

**Configuration:**

**REQUIRED Environment Variables:**
- `VITE_N8N_WEBHOOK_URL`: Your n8n webhook URL (REQUIRED in production)
- `VITE_N8N_AUTH_TOKEN`: Your n8n authentication token (REQUIRED in production)

**Setup Instructions:**
1. Copy `.env.example` to `.env.local`
2. Fill in your actual n8n webhook URL and authentication token
3. For production builds, create `.env.production` with production values
4. For GitHub Actions, configure GitHub Secrets (see CI/CD section)

**Important Notes:**
- These environment variables are **REQUIRED** in production - builds will fail if missing
- In development, the app will warn if variables are missing but may still run (for testing)
- Never commit `.env.local` or `.env.production` files with real values
- The webhook receives contact form data in JSON format with the following structure:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+351912345678",
    "companyName": "Company Inc.",
    "companyIdentifier": "PT123456789",
    "subject": "Project Inquiry",
    "message": "Hello, I'm interested in...",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

**Authentication Methods (n8n Compatible):**

The `N8nClient` supports three authentication methods compatible with n8n webhook authentication:

1. **Header Auth** (default): Custom header with token value
   ```typescript
   const client = new N8nClient({
     webhookUrl: 'https://n8n.<your.domain>/webhook-test/...',
     authToken: 'your-token',
     authMethod: 'header',
     authHeaderName: 'X-API-Key' // Default: 'X-API-Key' (or 'Authorization', 'X-Auth-Token', etc.)
   })
   ```
   Sends: `X-API-Key: <token>` (default) or custom header name

2. **Bearer Auth**: Standard Bearer token authentication
   ```typescript
   const client = new N8nClient({
     webhookUrl: 'https://n8n.<your.domain>/webhook-test/...',
     authToken: 'your-token',
     authMethod: 'bearer'
   })
   ```
   Sends: `Authorization: Bearer <token>`

3. **Custom Auth**: Multiple custom headers
   ```typescript
   const client = new N8nClient({
     webhookUrl: 'https://n8n.<your.domain>/webhook-test/...',
     authMethod: 'custom',
     headers: {
       'X-API-Key': 'api-key-value',
       'X-Auth-Token': 'auth-token-value',
       'X-Custom-Header': 'custom-value'
     }
   })
   ```
   Sends: All custom headers specified

**Features:**
- Automatic timestamp generation
- Request timeout handling (default: 10 seconds)
- Optional retry logic with exponential backoff
- Comprehensive error handling (network errors, HTTP errors, timeouts)
- TypeScript type safety
- Full n8n authentication compatibility (Bearer, Header, Custom Auth)

**Usage:**
The contact form modal can be triggered from:
- Floating Action Button (FAB) - always visible
- Landing Hero section - primary CTA button

**Testing:**
Run the test suite to verify the integration:
```bash
npm test src/utils/__tests__/n8nClient.test.ts
npm test src/components/ui/__tests__/ContactModal.test.tsx
```

### **Security Best Practices**
- **Environment Variables**: Use `.env.local` for local development, never commit to repository
- **API Keys**: Store sensitive keys in environment variables, not in code
- **Webhook URLs**: Keep webhook URLs secure and consider implementing authentication if needed
- **Personal Data**: Replace real personal information with placeholders in examples
- **Secrets Management**: Use proper secrets management for production deployments

### **Personal Data Handling**
This portfolio contains personal information that should be customized for your own use:

**Files to Update with Your Information:**
- `public/data/en/personal.json` - Personal details (name, email, etc.)
- `public/data/pt-PT/personal.json` - Portuguese personal details
- `public/data/en/social.json` - Social media links
- `public/data/pt-PT/social.json` - Portuguese social media links
- `public/data/en/meta.json` - SEO metadata and Open Graph tags
- `public/data/pt-PT/meta.json` - Portuguese SEO metadata
- `index.html` - Meta tags and page title
- `vite.config.ts` - Application title

**Example Personal Data Structure:**
```json
{
  "name": "Your Full Name",
  "title": "Your Professional Title",
  "email": "your.email@example.com",
  "phone": "+1234567890",
  "location": "Your City, Country",
  "website": "https://your-website.com"
}
```

### **Scrollbar Management**
The project implements a single scroll container architecture:
- Only `html` element scrolls (vertical scrolling)
- `body`, `#app`, and `.landing-page` have `overflow: hidden` to prevent double scrollbars
- Horizontal overflow is prevented with `overflow-x: hidden` and `max-width: 100%` constraints
- FAB and animated sections use `overflow: visible` to prevent scroll container creation
- Comprehensive tests in `src/components/__tests__/ScrollbarBehavior.test.tsx`

### **Internationalization**
Update language files in `public/data/`:
- `en/` - English content (JSON format)
- `pt-PT/` - Portuguese content (JSON format)

### **Design System**
Customize design tokens in `src/css/tokens.css`:
```css
:root {
  --color-primary: #009933;
  --color-secondary: #007a29;
  --spacing-unit: 8px;
  --border-radius: 4px;
}
```

## 📱 **Usage**

### **For Visitors**
1. **Landing Page**: Modern, premium landing experience with scroll animations
2. **Language Switch**: Toggle between English/Portuguese seamlessly
3. **Navigation**: Smooth scrolling between sections with keyboard support
4. **Contact Modal**: Accessible contact form with n8n webhook integration
5. **Accessibility**: Full keyboard navigation and screen reader support
6. **Performance**: Fast loading with optimized bundle size and lazy loading

### **For Developers**

#### **Adding New Components**
```bash
# Create component files manually following the existing structure
# Component files should be in src/components/ with corresponding tests in __tests__/

# Run component tests
npm run test -- ComponentName

# Test scrollbar behavior
npm run test -- ScrollbarBehavior
```

#### **Content Management**
- **Portfolio Data**: Update JSON files in `public/data/`
- **Styling**: Modify CSS files in `src/css/`
- **Components**: Edit TypeScript files in `src/components/`
- **Validation**: Update form validation logic in `src/utils/validation.ts`

#### **Development Workflow**
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm run test

# Build verification
npm run verify-dist
```

## 🔒 **Privacy & Security Features**

### **Form Validation & Security**
- **E.164 Validation**: Strict phone number format validation (E.164 standard)
- **Email Validation**: Comprehensive email format validation
- **Name Validation**: Name format validation with length checks
- **Client-Side Validation**: Real-time validation feedback
- **Secure Submission**: All form data sent securely to n8n webhook

### **GDPR Compliance**
- **Data Minimization**: Only collect necessary information for contact form
- **Purpose Limitation**: Clear specification of data usage (contact form submissions)
- **Secure Transmission**: All data transmitted via HTTPS
- **No Tracking**: Zero analytics or tracking cookies

### **Security Headers**
- **CSP**: Content Security Policy for XSS protection (configured in `public/_headers`)
- **HSTS**: HTTP Strict Transport Security
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME type sniffing protection

### **Data Protection**
- **No Server-Side Storage**: All data sent directly to n8n webhook
- **No Local Storage**: Contact form data not stored locally
- **No Tracking**: Zero analytics or tracking cookies
- **Secure Headers**: Comprehensive security headers configured

## 🎨 **Customization**

### **Design System**
Edit `src/css/tokens.css` for design tokens:
```css
:root {
  --color-primary: #009933;
  --color-secondary: #007a29;
  --color-accent: #68d391;
  --spacing-unit: 8px;
  --border-radius: 4px;
  --font-family-primary: 'Inter', sans-serif;
}
```

### **Component Styling**
- **Component Styles**: Individual CSS files in `src/css/components/`:
  - `contact-modal-premium.css` - Contact modal styles
  - `about.css`, `hero.css`, `skills.css`, etc. - Component-specific styles
- **Premium Styles**: Refactored into modular CSS files:
  - `src/css/variables.css` - CSS variables
  - `src/css/base.css` - Base layout with scrollbar management
  - `src/css/index.css` - Global styles and overrides
  - `src/css/modal.css` - Modal components
  - `src/css/navigation.css` - Navigation
  - `src/css/grid.css` - Grid system
  - `src/css/fab.css` - Floating Action Button styles
  - `src/css/components/*.css` - Component-specific styles
  - `src/css/landing/*.css` - Landing page modular styles
- **Contact Styles**: `src/css/components/contact-modal-premium.css`

### **Adding New Sections**
1. Create component in `src/components/`
2. Add to `src/App.tsx`
3. Update navigation in `src/components/Navigation.tsx`
4. Add translations to `public/data/`

### **Styling Customization**
The design system uses CSS variables and design tokens. Customize styling by modifying:
- `src/css/tokens.css` - Design tokens and color variables
- `src/css/variables.css` - CSS custom properties and gradients
- `src/css/landing/_variables.css` - Landing page specific variables
- Component-specific CSS files for component styling

## 📊 **Performance & Testing**

### **Performance Optimizations**
- ✅ **Bundle Size**: <60KB initial JavaScript (gzipped)
- ✅ **Code Splitting**: Automatic route-based splitting
- ✅ **Tree Shaking**: Dead code elimination
- ✅ **Image Optimization**: WebP format with fallbacks
- ✅ **Lazy Loading**: Components and images loaded on demand
- ✅ **Caching**: Aggressive caching strategies
- ✅ **Scrollbar Optimization**: Single scroll container prevents layout shifts
- ✅ **CSS Architecture**: Modular CSS with minimal redundancy
- ✅ **Component Optimization**: Centralized state management reduces re-renders

### **Testing Suite**
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### **Test Coverage**
- **Unit Tests**: Component and hook testing with Vitest
- **Integration Tests**: Component interaction testing
- **Accessibility Tests**: WCAG 2.2 AA compliance
- **Performance Tests**: Core Web Vitals monitoring
- **Scrollbar Behavior Tests**: Comprehensive scrollbar architecture validation
- **Modal Tests**: Contact modal state management and accessibility
- **Form Validation Tests**: E.164 phone, email, and name validation

### **Quality Assurance**
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Security audit
npm run security:audit

# Performance budget
npm run performance:budget
```

## 🔍 **SEO & Accessibility**

### **SEO Optimization**
- **Structured Data**: JSON-LD schema markup
- **Meta Tags**: Comprehensive meta descriptions and Open Graph
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Performance**: Core Web Vitals optimization
- **Mobile-First**: Responsive design with mobile optimization

### **Accessibility (WCAG 2.2 AA)**
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: ARIA labels and live regions
- **Color Contrast**: WCAG AA compliant color ratios
- **Focus Management**: Visible focus indicators
- **Alternative Text**: Descriptive alt text for images

### **Internationalization**
- **Bilingual Support**: English and Portuguese (PT-PT)
- **Locale Detection**: Automatic language detection from browser or localStorage
- **SEO Friendly**: Proper hreflang implementation and locale-specific meta tags
- **Smooth Switching**: Language changes without page reload

## 🚀 **Deployment & CI/CD**

### **GitHub Pages Deployment**

The project uses GitHub Actions for automated deployment to GitHub Pages:

- **Automatic**: Deploys automatically on push to `main` or `master` branch
- **Method**: GitHub Pages Actions (`actions/deploy-pages@v4`)
- **Build**: Uses `npm run build:gh-pages` to create production build with correct base path
- **Base Path**: Automatically set to `/portfolio/` (or your repository name) for GitHub Pages
- **Artifact**: Uploads `./dist` folder as deployment artifact
- **No gh-pages branch**: Uses GitHub Pages Actions workflow, not branch-based deployment
- **404 Handling**: Includes `404.html` for SPA routing support
- **Jekyll Disabled**: Automatically creates `.nojekyll` file in `dist` folder

> **⚠️ CRITICAL CONFIGURATION REQUIRED**: 
> 
> **You MUST configure GitHub Pages to use "GitHub Actions" as the source:**
> 
> 1. Go to your repository: **Settings** > **Pages**
> 2. Under **"Build and deployment"** section:
>    - **Source**: Select **"GitHub Actions"** (NOT "Deploy from a branch")
> 3. Save the settings
> 
> **Why this is critical:**
> - If set to "Deploy from a branch", GitHub will use a default Jekyll build workflow
> - This will build to `./_site` instead of `./dist` and upload source code instead of built files
> - Your custom Vite workflow (`ci.yml`) will NOT be used
> - The site will fail to load because it's trying to serve source files instead of built assets
> 
> **After changing to "GitHub Actions":**
> - Our custom workflow (`ci.yml`) will be used automatically
> - Vite will build to `./dist` folder correctly
> - Base path will be set to `/portfolio/` automatically
> - Only built files will be deployed
> - The site will load correctly

**Important**: The base path is automatically configured based on your repository name. If your repository is named differently, the base path will adjust accordingly. For custom domains, set `VITE_APP_URL` environment variable.

**Manual Deployment:**
```bash
# Build for GitHub Pages
npm run build:gh-pages

# Or use the deploy script (requires gh-pages CLI)
npm run deploy
```

**Other Build Options:**
```bash
# Production build
npm run build:production

# Staging build
npm run build:staging

# Build with bundle analysis
npm run build:analyze
```

### **GitHub Secrets Configuration**

**REQUIRED for Production Builds:**

The CI/CD pipeline requires environment variables for the n8n webhook integration. Configure these as GitHub Secrets:

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add the following secrets:
   - **Name**: `VITE_N8N_WEBHOOK_URL`
     - **Value**: Your n8n webhook URL (e.g., `https://n8n.<your.domain>/webhook-test/your-webhook-id`)
   - **Name**: `VITE_N8N_AUTH_TOKEN`
     - **Value**: Your n8n authentication token

**Important:**
- These secrets are used during the build process in GitHub Actions
- They are injected as environment variables during `npm run build:gh-pages`
- The build will fail if these secrets are not configured
- Secrets are encrypted and never exposed in logs or build artifacts

### **CI/CD Pipeline**

The project includes three GitHub Actions workflows for automated CI/CD:

- **Automated Testing**: Runs on every commit and pull request
- **Security Audits**: Dependency vulnerability scanning
- **Type Checking**: TypeScript compilation validation
- **Linting**: Code quality enforcement
- **Quality Assurance**: Component validation and bundle analysis on PRs
- **Automated Deployment**: Automatic deployment to GitHub Pages on main/master branch

### **GitHub Actions Workflows**

The project uses three GitHub Actions workflows for continuous integration and deployment:

#### **CI/CD Pipeline** (`.github/workflows/ci.yml`)
- **Triggers**: 
  - Push to `main` or `master` branch
  - Pull requests to `main` or `master`
  - Manual workflow dispatch
- **Jobs**:
  - `test`: Type checking, linting, test execution with coverage, security audit
  - `build`: Production build for GitHub Pages (main/master only)
    - Builds with Vite using `npm run build:gh-pages`
    - Sets `VITE_BASE_PATH` to `/repository-name/` automatically
    - Verifies `dist` folder exists and contains built files
    - Verifies base path is correctly applied in `index.html`
    - Copies `404.html` to `dist` folder
    - Creates `.nojekyll` file to disable Jekyll processing
    - Uploads `dist` folder as GitHub Pages artifact
  - `deploy`: Deploy to GitHub Pages using `actions/deploy-pages@v4` (main/master only)
    - Deploys the artifact uploaded by the `build` job
    - Shows detailed deployment status with URL and commit info
- **Permissions**: `contents: read`, `pages: write`, `id-token: write`
- **Concurrency**: Single deployment per branch (does not cancel in-progress)
- **Base Path Configuration**: 
  - Automatically sets `VITE_BASE_PATH=/repository-name/` during build
  - Ensures all asset paths use the correct base path for GitHub Pages
  - Works with any repository name without manual configuration

#### **Quality Assurance** (`.github/workflows/quality.yml`)
- **Triggers**: 
  - Pull requests to `main` or `master`
  - Manual workflow dispatch
- **Jobs**:
  - `quality`: Component structure validation, bundle size analysis, PR comments with quality metrics
- **Features**:
  - Validates UI component structure
  - Checks design system files (tokens, component CSS)
  - Analyzes bundle sizes
  - Posts quality report as PR comment

#### **Security & Dependencies** (`.github/workflows/security.yml`)
- **Triggers**: 
  - Weekly schedule (Mondays at 9 AM UTC)
  - Pull requests to any branch
  - Manual workflow dispatch
- **Jobs**:
  - `security`: Security audit, dependency check, component security validation
- **Features**:
  - Runs `npm audit` for vulnerability scanning
  - Checks for outdated packages
  - Validates component security
  - Generates dependency report artifact
  - Posts security report as PR comment

**Workflow Configuration:**
- All workflows use Node.js 18 (LTS)
- Dependencies installed with `npm ci` for reproducible builds
- Cache enabled for faster builds

### **Browser Support**
- ✅ **Chrome** 90+ (ES2020 support)
- ✅ **Firefox** 88+ (ES2020 support)
- ✅ **Safari** 14+ (ES2020 support)
- ✅ **Edge** 90+ (ES2020 support)

### **Device Testing**
- ✅ **Desktop**: 1920x1080+ with high DPI support
- ✅ **Tablet**: 768px+ with touch optimization
- ✅ **Mobile**: 320px+ with mobile-first design

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Development Server Issues**
```bash
# Clear cache and reinstall
npm run clean:all && npm install

# Check for port conflicts
npm run dev -- --port 3001
```

#### **Build Issues**
```bash
# Type checking errors
npm run type-check

# Linting errors
npm run lint:fix

# Build verification
npm run verify-dist
```

#### **Contact Form Issues**
- Check browser console for validation errors
- Verify n8n webhook URL and auth token are set in environment variables
- Check network tab for webhook request failures
- Verify form validation messages are displayed correctly

#### **Scrollbar Issues**
- Verify only one vertical scrollbar appears (on `html` element)
- Check that `body` and `#app` have `overflow: hidden`
- Ensure landing page sections have proper `max-width: 100%` constraints
- Test on various viewport sizes (320px to 1920px+)

#### **GitHub Pages Deployment Issues**

**Problem: Site shows blank page or tries to load `/src/main.tsx`**
- **Cause**: GitHub Pages is using default Jekyll build instead of custom workflow
- **Solution**: 
  1. Go to **Settings** > **Pages**
  2. Change **Source** from "Deploy from a branch" to **"GitHub Actions"**
  3. Save and wait for the next deployment
- **Verification**: Check GitHub Actions logs - should see `npm run build:gh-pages`, not `actions/jekyll-build-pages@v1`

**Problem: Deployment fails with "Multiple artifacts named 'github-pages' found"**
- **Cause**: Artifacts from previous workflow runs are still present, or multiple workflows running simultaneously
- **Error Message**: `Error: Multiple artifacts named "github-pages" were unexpectedly found for this workflow run. Artifact count is 2.`
- **Solutions**: 
  1. **If re-running an old workflow**: Re-running uses the old workflow file. Push a new commit to use the latest workflow with artifact cleanup.
  2. **If GitHub Pages source is wrong**: 
     - Go to **Settings** > **Pages**
     - Change **Source** from "Deploy from a branch" to **"GitHub Actions"**
     - This disables the default Jekyll workflow
  3. **Manual cleanup** (if automated cleanup fails):
     - Go to **Actions** > **Artifacts** in your repository
     - Delete old `github-pages` artifacts manually
     - Re-run the workflow
- **Why this happens**: 
  - When re-running a job, GitHub uses the workflow file from the original commit (not the latest)
  - Old artifacts from previous runs may still exist
  - The `deploy-pages` action finds artifacts from multiple runs
  - Our workflow now automatically cleans up old artifacts before deployment

**Problem: Assets not loading (404 errors)**
- **Cause**: Base path not set correctly
- **Solution**: 
  - Verify `VITE_BASE_PATH` is set in GitHub Actions workflow
  - Check that built `index.html` contains `/portfolio/assets/` paths (not `/assets/`)
  - Ensure repository name matches the base path

**Problem: Build succeeds but wrong files deployed**
- **Cause**: Wrong artifact path or Jekyll build being used
- **Solution**:
  - Verify workflow uploads from `dist` folder (not `./_site`)
  - Check that `.nojekyll` file exists in `dist` folder
  - Ensure GitHub Pages source is set to "GitHub Actions"

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=true npm run dev

# Verbose build output
npm run build -- --debug
```

## 📈 **Monitoring & Analytics**

### **Performance Monitoring**
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Bundle Analysis**: Automated bundle size monitoring
- **Lighthouse CI**: Performance budget enforcement
- **Error Tracking**: Client-side error logging

### **Privacy-First Analytics**
- **No Tracking**: Zero third-party analytics
- **Local Metrics**: Performance data stored locally
- **GDPR Compliant**: No personal data collection
- **User Control**: Full privacy control for users

## 🔄 **Maintenance & Updates**

### **Recent Improvements**
- ✅ **Scrollbar Architecture**: Implemented single scroll container preventing double scrollbars
- ✅ **CSS Refactoring**: Modular CSS architecture with proper overflow management
- ✅ **Modal State Management**: Centralized contact modal state in LandingPage component
- ✅ **Test Coverage**: Added comprehensive scrollbar behavior and modal tests
- ✅ **Responsive Fixes**: Resolved horizontal scrollbar issues across all breakpoints
- ✅ **Performance**: Optimized FAB and animation components to prevent scroll container creation

### **Regular Maintenance**
```bash
# Update dependencies
npm update

# Security audit
npm run security:audit

# Performance check
npm run performance:budget

# Full test suite
npm run test:coverage

# Verify scrollbar behavior
npm run test -- ScrollbarBehavior
```

### **Security Updates**
- **Dependency Scanning**: Automated vulnerability detection
- **Security Headers**: Regular security header updates
- **Privacy Compliance**: Annual GDPR compliance review
- **HTTPS Enforcement**: SSL/TLS configuration maintenance

### **Performance Monitoring**
- **Bundle Size**: Monitor JavaScript bundle growth
- **Core Web Vitals**: Track performance metrics
- **Accessibility**: Regular a11y compliance checks
- **Browser Support**: Update browser compatibility matrix

## 📞 **Support & Documentation**

### **Technical Support**
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Comprehensive inline documentation
- **TypeScript**: Full type definitions for IDE support
- **Testing**: Extensive test coverage for reliability

### **Development Resources**
- **Vite Documentation**: [vitejs.dev](https://vitejs.dev)
- **Preact Documentation**: [preactjs.com](https://preactjs.com)
- **TypeScript Handbook**: [typescriptlang.org](https://typescriptlang.org)
- **WCAG Guidelines**: [w3.org/WAI/WCAG21](https://w3.org/WAI/WCAG21)

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Start Bootstrap** - Original template design
- **Bootstrap Team** - CSS framework
- **Font Awesome** - Icons
- **GDPR.eu** - Compliance guidance

## 📝 **Changelog**

### **v3.1.0 - Scrollbar & Architecture Improvements** (Latest)
- 🎯 **Scrollbar Fixes**: Single scroll container architecture preventing double scrollbars
- 🎨 **CSS Refactoring**: Modular CSS architecture with proper overflow management
- 🔧 **Modal Refactoring**: Centralized contact modal state management in LandingPage
- 🧪 **Test Enhancements**: Added comprehensive scrollbar behavior tests
- 🎭 **Animation Improvements**: Optimized scroll animations with proper overflow handling
- 📱 **Responsive Fixes**: Fixed horizontal scrollbar issues on mobile devices
- 🎨 **FAB Optimization**: Prevented scrollbar creation in floating action buttons
- 🧹 **Code Cleanup**: Removed inline scrollbar fixes in favor of CSS-based solutions
- 🚀 **GitHub Pages Fixes**: 
  - Fixed base path configuration for GitHub Pages deployment
  - Added automatic base path detection from repository name
  - Enhanced workflow with dist folder verification and .nojekyll creation
  - Fixed environment variable reading from process.env for GitHub Actions
  - Improved error handling and deployment verification

### **v3.0.0 - Enterprise Portfolio Release**
- 🏗️ **Modern Architecture**: Complete migration to Vite + Preact + TypeScript
- 🔒 **Enhanced Security**: Form validation with E.164 phone validation
- 🧪 **Testing Suite**: Comprehensive testing with Vitest and Testing Library
- ⚡ **Performance**: <60KB initial JS bundle with code splitting
- ♿ **Accessibility**: WCAG 2.2 AA compliance with keyboard navigation
- 🚀 **CI/CD**: Automated testing, security audits, and deployment
- 📊 **Monitoring**: Performance budgets and Core Web Vitals tracking
- 🔐 **Security**: Environment variable templates and security best practices
- 🔗 **n8n Integration**: Contact form webhook integration with authentication support

### **v2.0.0 - Premium Portfolio Release**
- ✨ Complete GDPR compliance implementation
- 🎨 Premium UI/UX redesign
- 📱 Enhanced mobile experience
- ⚡ Performance optimizations
- 🌍 Improved multi-language support

### **v1.0.0 - Original Portfolio**
- Basic Bootstrap template
- Multi-language support
- Simple navigation
- Basic styling

---

**Built with ❤️ and enterprise-grade security in mind**

