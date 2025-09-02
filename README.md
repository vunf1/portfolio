# João Maia - Premium Portfolio Website

A modern, GDPR-compliant portfolio website built with Bootstrap, featuring privacy-gated content, cookie consent management, and premium user experience.

## 🚀 **Features**

### **GDPR Compliance & Privacy**
- ✅ **Cookie Consent Banner** - Full GDPR-compliant cookie management
- ✅ **Privacy Gate** - Sensitive content protection with user consent
- ✅ **Privacy Policy** - Comprehensive GDPR-compliant privacy policy
- ✅ **Data Processing Consent** - Explicit consent for personal data handling
- ✅ **Right to Withdraw** - Easy consent withdrawal and data deletion

### **Premium User Experience**
- 🎨 **Modern Design** - Clean, professional aesthetic with smooth animations
- 🌙 **Dark/Light Mode** - Toggle between themes
- 🌍 **Multi-language Support** - English and Portuguese
- 📱 **Responsive Design** - Optimized for all devices
- ⚡ **Performance Optimized** - Fast loading with modern techniques

### **Technical Features**
- 🔒 **Privacy-Gated Content** - Sensitive information protected until consent
- 🍪 **Smart Cookie Management** - Granular consent options
- 📊 **Performance Monitoring** - Built-in performance tracking
- ♿ **Accessibility** - WCAG compliant with proper ARIA labels
- 🔍 **SEO Optimized** - Structured data and meta tags

## 📁 **File Structure**

```
portfolio/
├── index.html                 # Main portfolio page
├── eng.html                  # English content
├── pt.html                   # Portuguese content
├── privacy-policy.html       # GDPR privacy policy
├── css/
│   ├── resume.min.css        # Base styles
│   ├── premium-components.css # Premium UI components
│   ├── cookie-consent.css    # Cookie banner styles
│   └── privacy-gate.css      # Privacy gate styles
├── js/
│   ├── portfolio-modern.js   # Main portfolio logic
│   ├── cookie-consent.js     # Cookie consent management
│   ├── privacy-gate.js       # Privacy gate functionality
│   ├── alertify1.0.10.js     # Notifications
│   └── modernizr2.8.2.js    # Feature detection
├── img/                      # Images and assets
└── vendor/                   # Third-party libraries
```

## 🛠️ **Installation & Setup**

### **1. Clone Repository**
```bash
git clone https://github.com/vunf1/portfolio.git
cd portfolio
```

### **2. Local Development**
- Open `index.html` in a web browser
- Or use a local server:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

### **3. Production Deployment**
- Upload all files to your web server
- Ensure HTTPS is enabled for GDPR compliance
- Test cookie consent and privacy gate functionality

## 🔧 **Configuration**

### **Cookie Consent Settings**
Edit `js/cookie-consent.js` to customize:
- Cookie categories (analytics, marketing, preferences)
- Consent banner appearance
- Default preferences

### **Privacy Gate Configuration**
Edit `js/privacy-gate.js` to modify:
- Required consent fields
- Data processing purposes
- Consent validation rules

### **Language Settings**
Update language files:
- `eng.html` - English content
- `pt.html` - Portuguese content

## 📱 **Usage**

### **For Visitors**
1. **First Visit**: Cookie consent banner appears
2. **Privacy Gate**: Complete consent form to access full content
3. **Language Switch**: Toggle between English/Portuguese
4. **Dark Mode**: Switch between light/dark themes
5. **Navigation**: Smooth scrolling between sections

### **For Developers**
1. **Content Updates**: Modify HTML files in respective language folders
2. **Styling**: Edit CSS files for visual changes
3. **Functionality**: Modify JavaScript files for behavior changes
4. **Privacy**: Update consent forms and privacy policy as needed

## 🔒 **GDPR Compliance Features**

### **Cookie Management**
- **Necessary Cookies**: Always enabled (functionality)
- **Analytics Cookies**: Optional, user-controlled
- **Marketing Cookies**: Optional, user-controlled
- **Preference Cookies**: Optional, user-controlled

### **Data Processing Consent**
- **Explicit Consent**: Required for all data processing
- **Purpose Limitation**: Clear purpose specification
- **Data Minimization**: Only collect necessary data
- **Right to Withdraw**: Easy consent withdrawal

### **Privacy Rights**
- **Right to Access**: View collected data
- **Right to Rectification**: Correct inaccurate data
- **Right to Erasure**: Delete personal data
- **Right to Portability**: Export data
- **Right to Object**: Object to processing

## 🎨 **Customization**

### **Colors & Branding**
Edit `css/premium-components.css`:
```css
:root {
    --primary-color: #009933;
    --secondary-color: #007a29;
    --accent-color: #68d391;
}
```

### **Animations & Effects**
Modify animation durations and effects in CSS:
```css
.transition-duration {
    transition: all 0.3s ease;
}
```

### **Content Sections**
Add new sections by:
1. Creating HTML content
2. Adding navigation links
3. Updating language files
4. Adding privacy gating if needed

## 📊 **Performance Optimization**

### **Current Optimizations**
- ✅ Resource preloading
- ✅ Lazy loading support
- ✅ Minified CSS/JS
- ✅ Optimized images
- ✅ Modern JavaScript (ES6+)

### **Further Optimizations**
- Compress images (WebP format)
- Implement service worker
- Add CDN for assets
- Enable HTTP/2
- Implement caching strategies

## 🔍 **SEO Features**

### **Meta Tags**
- Comprehensive meta descriptions
- Open Graph tags for social sharing
- Twitter Card support
- Structured data (JSON-LD)

### **Content Structure**
- Semantic HTML5 elements
- Proper heading hierarchy
- Alt text for images
- Internal linking structure

## 🧪 **Testing**

### **Browser Compatibility**
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### **Device Testing**
- ✅ Desktop (1920x1080+)
- ✅ Tablet (768px+)
- ✅ Mobile (320px+)

### **Accessibility Testing**
- ✅ Screen reader compatibility
- ✅ Keyboard navigation
- ✅ Color contrast compliance
- ✅ Focus management

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Privacy Gate Not Showing**
- Check browser console for errors
- Verify `privacy-gate.js` is loaded
- Clear localStorage and refresh

#### **Cookie Consent Not Working**
- Ensure `cookie-consent.js` is loaded
- Check for JavaScript errors
- Verify CSS files are loaded

#### **Content Not Loading**
- Check network requests
- Verify file paths
- Clear browser cache

### **Debug Mode**
Enable debug logging:
```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

## 📈 **Analytics & Monitoring**

### **Built-in Monitoring**
- Page load performance
- User interaction tracking
- Error logging
- Consent analytics

### **External Analytics**
To add Google Analytics:
1. Update cookie consent preferences
2. Add tracking code
3. Respect user consent choices

## 🔄 **Updates & Maintenance**

### **Regular Tasks**
- Update privacy policy annually
- Review consent mechanisms
- Test GDPR compliance
- Update dependencies
- Monitor performance

### **Security Updates**
- Keep libraries updated
- Monitor for vulnerabilities
- Regular security audits
- HTTPS enforcement

## 📞 **Support**

### **Technical Issues**
- Check browser console for errors
- Review file permissions
- Verify server configuration
- Test in different browsers

### **GDPR Questions**
- Review privacy policy
- Consult legal professionals
- Stay updated on regulations
- Document all changes

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Start Bootstrap** - Original template design
- **Bootstrap Team** - CSS framework
- **Font Awesome** - Icons
- **GDPR.eu** - Compliance guidance

## 📝 **Changelog**

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

**Built with ❤️ and GDPR compliance in mind**

