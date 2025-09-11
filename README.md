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

A modern, enterprise-grade portfolio website built with **Vite + Preact + TypeScript**, featuring privacy-gated content, GDPR compliance, and premium user experience optimized for Core Web Vitals and accessibility.

## 🚀 **Features**

### **Privacy & Security**
- 🔒 **Privacy Gate** - Blur-to-reveal sensitive content with E.164 phone validation
- 🛡️ **GDPR Compliance** - Full data protection with explicit consent mechanisms
- 🔐 **Secure Data Handling** - Ephemeral session data with strict retention policies
- 🚫 **Rate Limiting** - Built-in protection against abuse and spam
- 🍯 **Honeypot Protection** - Advanced anti-bot measures

### **Enterprise UX/UI**
- 🎨 **Premium Design System** - Enterprise-grade aesthetic with design tokens
- 🌙 **Theme Management** - Dark/light mode with system preference detection
- 🌍 **Bilingual Support** - English/Portuguese with smooth locale switching
- 📱 **Responsive Design** - Mobile-first approach with fluid grids
- ⚡ **Performance Optimized** - <60KB initial JS, lazy loading, code splitting

### **Technical Excellence**
- 🏗️ **Modern Architecture** - Vite + Preact + TypeScript with strict typing
- 🧪 **Comprehensive Testing** - Vitest + Testing Library with 90%+ coverage
- ♿ **Accessibility** - WCAG 2.2 AA compliant with keyboard navigation
- 🔍 **SEO Optimized** - Structured data, meta tags, and semantic HTML
- 🚀 **CI/CD Ready** - Automated testing, security audits, and deployment

## 📁 **Project Structure**

```
portfolio/
├── src/                      # Source code
│   ├── components/           # React/Preact components
│   │   ├── ui/              # Reusable UI components
│   │   ├── __tests__/       # Component tests
│   │   ├── About.tsx        # About section
│   │   ├── Contact.tsx      # Contact section
│   │   ├── ContactPrivacyGate.tsx  # Privacy gate component
│   │   ├── ContactUnlockForm.tsx   # Unlock form
│   │   └── ...              # Other sections
│   ├── hooks/               # Custom React hooks
│   │   ├── __tests__/       # Hook tests
│   │   ├── useContactPrivacyGate.ts
│   │   ├── useI18n.ts       # Internationalization
│   │   └── useTheme.ts      # Theme management
│   ├── types/               # TypeScript type definitions
│   │   ├── portfolio.ts     # Portfolio data types
│   │   ├── components.ts    # Component types
│   │   └── hooks.ts         # Hook types
│   ├── contexts/            # React contexts
│   │   └── TranslationContext.tsx
│   ├── css/                 # Styling
│   │   ├── tokens.css       # Design tokens
│   │   ├── premium.css      # Premium components
│   │   └── components.css   # Component styles
│   ├── utils/               # Utility functions
│   │   ├── __tests__/       # Utility tests
│   │   └── validation.ts    # Form validation
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
│   ├── fonts/               # Custom fonts
│   └── _headers             # Security headers
├── scripts/                 # Build and utility scripts
│   ├── copy-data.cjs        # Data copying script
│   └── optimize-images.cjs  # Image optimization
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── vitest.config.ts         # Test configuration
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
# Development settings
VITE_APP_TITLE="Your Name - Portfolio"
VITE_APP_DESCRIPTION="Software Developer Portfolio"
VITE_APP_URL="http://localhost:3000"

# Privacy Gate Settings
VITE_PRIVACY_GATE_ENABLED=true
VITE_UNLOCK_DURATION_DAYS=30
VITE_RATE_LIMIT_ATTEMPTS=5

# Security Settings
VITE_SECURITY_HEADERS=true
VITE_CSP_ENABLED=true
VITE_HSTS_ENABLED=true

# Performance Settings
VITE_COMPRESSION_ENABLED=true
VITE_CACHE_STRATEGY=aggressive
VITE_PRELOAD_CRITICAL=true

# Analytics (disabled by default)
VITE_ANALYTICS_ENABLED=false
VITE_ANALYTICS_ID=your-analytics-id-here

# CDN Configuration (optional)
VITE_CDN_URL=https://your-cdn-domain.com
VITE_ASSET_OPTIMIZATION=true
```

> **⚠️ Security Note**: Never commit `.env.local` or `.env` files to version control. The `.gitignore` file already excludes these files to prevent accidental commits of sensitive data.

### **Security Best Practices**
- **Environment Variables**: Use `.env.local` for local development, never commit to repository
- **API Keys**: Store sensitive keys in environment variables, not in code
- **Personal Data**: Replace real personal information with placeholders in examples
- **Secrets Management**: Use proper secrets management for production deployments

### **Personal Data Handling**
This portfolio contains personal information that should be customized for your own use:

**Files to Update with Your Information:**
- `public/data/en/personal.json` - Personal details (name, email, etc.)
- `public/data/pt-PT/personal.json` - Portuguese personal details
- `public/data/en/contact.json` - Contact information
- `public/data/pt-PT/contact.json` - Portuguese contact information
- `public/data/en/social.json` - Social media links
- `public/data/pt-PT/social.json` - Portuguese social media links
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

### **Privacy Gate Configuration**
Edit `src/hooks/useContactPrivacyGate.ts`:
- Validation rules for form fields
- Unlock duration and persistence
- Rate limiting and security measures

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
1. **Privacy Gate**: Complete identity verification to access contact details
2. **Language Switch**: Toggle between English/Portuguese seamlessly
3. **Theme Toggle**: Switch between light/dark modes with system preference detection
4. **Navigation**: Smooth scrolling between sections with keyboard support
5. **Accessibility**: Full keyboard navigation and screen reader support

### **For Developers**

#### **Adding New Components**
```bash
# Create new component with tests
npm run generate:component ComponentName

# Run component tests
npm run test:component ComponentName
```

#### **Content Management**
- **Portfolio Data**: Update JSON files in `public/data/`
- **Styling**: Modify CSS files in `src/css/`
- **Components**: Edit TypeScript files in `src/components/`
- **Privacy**: Update privacy gate logic in `src/hooks/`

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

### **Privacy Gate System**
- **Blur-to-Reveal**: Sensitive content protected by default
- **E.164 Validation**: Strict phone number format validation
- **Rate Limiting**: Protection against brute force attempts
- **Honeypot Protection**: Advanced anti-bot measures
- **Ephemeral Data**: 30-day auto-expiration of unlock data

### **GDPR Compliance**
- **Explicit Consent**: Required for all personal data processing
- **Data Minimization**: Only collect necessary information
- **Purpose Limitation**: Clear specification of data usage
- **Right to Withdraw**: Easy consent withdrawal and data deletion
- **Data Portability**: Export user data in standard format

### **Security Headers**
- **CSP**: Content Security Policy for XSS protection
- **HSTS**: HTTP Strict Transport Security
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME type sniffing protection

### **Data Protection**
- **Local Storage Only**: No server-side data collection
- **Encrypted Storage**: Sensitive data encrypted in localStorage
- **Auto-Cleanup**: Automatic data expiration and cleanup
- **No Tracking**: Zero analytics or tracking cookies

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
- **UI Components**: `src/css/components.css`
- **Premium Styles**: `src/css/premium.css`
- **Contact Styles**: `src/css/contact.css`

### **Adding New Sections**
1. Create component in `src/components/`
2. Add to `src/App.tsx`
3. Update navigation in `src/components/Navigation.tsx`
4. Add translations to `public/data/`

### **Theme Customization**
Modify theme logic in `src/hooks/useTheme.ts`:
```typescript
const themes = {
  light: { /* light theme tokens */ },
  dark: { /* dark theme tokens */ }
}
```

## 📊 **Performance & Testing**

### **Performance Optimizations**
- ✅ **Bundle Size**: <60KB initial JavaScript (gzipped)
- ✅ **Code Splitting**: Automatic route-based splitting
- ✅ **Tree Shaking**: Dead code elimination
- ✅ **Image Optimization**: WebP format with fallbacks
- ✅ **Lazy Loading**: Components and images loaded on demand
- ✅ **Caching**: Aggressive caching strategies

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
- **RTL Ready**: Right-to-left language support
- **Locale Detection**: Automatic language detection
- **SEO Friendly**: Proper hreflang implementation

## 🚀 **Deployment & CI/CD**

### **Deployment Options**
```bash
# GitHub Pages deployment
npm run deploy

# Production build
npm run build:production

# Staging build
npm run build:staging
```

### **CI/CD Pipeline**
- **Automated Testing**: Runs on every commit
- **Security Audits**: Dependency vulnerability scanning
- **Performance Budgets**: Lighthouse CI integration
- **Type Checking**: TypeScript compilation validation
- **Linting**: Code quality enforcement

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

#### **Privacy Gate Issues**
- Check browser console for validation errors
- Verify localStorage is enabled
- Clear browser data and refresh

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

### **v3.0.0 - Enterprise Portfolio Release**
- 🏗️ **Modern Architecture**: Complete migration to Vite + Preact + TypeScript
- 🔒 **Enhanced Security**: Improved privacy gate with E.164 validation
- 🧪 **Testing Suite**: Comprehensive testing with Vitest and Testing Library
- ⚡ **Performance**: <60KB initial JS bundle with code splitting
- ♿ **Accessibility**: WCAG 2.2 AA compliance with keyboard navigation
- 🚀 **CI/CD**: Automated testing, security audits, and deployment
- 📊 **Monitoring**: Performance budgets and Core Web Vitals tracking
- 🔐 **Security**: Environment variable templates and security best practices

### **v2.0.0 - Premium Portfolio Release**
- ✨ Complete GDPR compliance implementation
- 🎨 Premium UI/UX redesign
- 🔒 Privacy gate functionality
- 🍪 Advanced cookie management
- 📱 Enhanced mobile experience
- ⚡ Performance optimizations
- 🌍 Improved multi-language support
- 🌙 Dark/light theme toggle

### **v1.0.0 - Original Portfolio**
- Basic Bootstrap template
- Multi-language support
- Simple navigation
- Basic styling

---

**Built with ❤️ and enterprise-grade security in mind**

