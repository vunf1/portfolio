/**
 * Modern Portfolio JavaScript
 * Enhanced version with GDPR compliance, privacy gate, and premium features
 * RESTORED ORIGINAL FUNCTIONALITY
 */

class ModernPortfolio {
    constructor() {
        this.currentLanguage = 'eng';
        this.isDarkMode = false;
        this.isLoading = true;
        this.init();
    }

    init() {
        // Portfolio initializing with original functionality...
        this.setupEventListeners();
        this.initializeComponents();
        this.handleInitialLoad();
    }

    setupEventListeners() {
        // Language switching - RESTORED ORIGINAL FUNCTIONALITY
        document.addEventListener('click', (e) => {
            if (e.target.id === 'pt' || e.target.id === 'eng') {
                this.switchLanguage(e.target.id);
            }
        });

        // Navigation clicks - RESTORED ORIGINAL FUNCTIONALITY
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('loadDiv')) {
                this.handleNavigationClick(e.target);
            }
        });

        // Dark mode toggle
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('darkModebtn')) {
                this.toggleDarkMode();
            }
        });

        // Scroll effects
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Privacy gate events
        document.addEventListener('privacyGateCompleted', () => {
            this.onPrivacyGateCompleted();
        });
    }

    initializeComponents() {
        // Initialize cookie consent
        if (window.CookieConsent) {
            this.cookieConsent = new window.CookieConsent();
            // Cookie consent initialized
        }

        // Initialize privacy gate
        if (window.PrivacyGate) {
            this.privacyGate = new window.PrivacyGate();
            // Privacy gate initialized
        }

        // Set initial language
        this.setLanguage(this.currentLanguage);
        
        // Setup premium animations
        this.setupPremiumAnimations();
    }

    async handleInitialLoad() {
        try {
            // Simulate loading time for premium feel
            await this.simulateLoading();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            // RESTORED: Load content using original method
            this.loadOriginalContent(this.currentLanguage);
            
            // Show all portfolio content - only contact information is gated
            this.revealAllContent();
            
            // Initialize privacy gate for contact information only
            if (window.PrivacyGate) {
                this.privacyGate = new window.PrivacyGate();
                // Privacy gate initialized for contact information only
            }
            
        } catch (error) {
            // Error during initial load
        }
    }

    async simulateLoading() {
        return new Promise(resolve => {
            // Reduced loading time for better UX - no more flickering
            setTimeout(resolve, 1500); // 1.5 second loading for premium feel
        });
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading');
        if (loadingScreen) {
            // Smooth fade out with scale effect
            loadingScreen.classList.add('hidden');
            // Wait for CSS transition to complete before hiding
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 800); // Match the CSS transition duration
        }
        this.isLoading = false;
    }

    // RESTORED ORIGINAL CONTENT LOADING METHOD
    loadOriginalContent(language) {
        // Loading original content for language: ${language}
        if (typeof window.loadPage === 'function') {
            window.loadPage(language);
        } else {
            // Fallback to direct content loading
            this.triggerContentLoad(language);
        }
    }

    // Fallback content loading method
    triggerContentLoad(language) {
        const contentContainer = document.querySelector('.caixa');
        if (contentContainer && contentContainer.innerHTML.trim() === '') {
            // If container is empty, load the appropriate language content
            if (language === 'pt') {
                this.loadPortugueseContent();
            } else {
                this.loadEnglishContent();
            }
        }
    }

    // Load Portuguese content (simplified version)
    loadPortugueseContent() {
        const contentContainer = document.querySelector('.caixa');
        if (contentContainer) {
            contentContainer.innerHTML = `
                <div class="resume-section" id="about">
                    <h2>About</h2>
                    <p>Conteúdo em Português será carregado aqui...</p>
                </div>
            `;
        }
    }

    // Load English content (simplified version)
    loadEnglishContent() {
        const contentContainer = document.querySelector('.caixa');
        if (contentContainer) {
            contentContainer.innerHTML = `
                <div class="resume-section" id="about">
                    <h2>About</h2>
                    <p>English content will be loaded here...</p>
                </div>
            `;
        }
    }

    async switchLanguage(language) {
        try {
            this.currentLanguage = language;
            this.setLanguage(language);
            
            // RESTORED: Use original language switching method
            this.loadOriginalContent(language);
            
            this.showLanguageNotification(language);
        } catch (error) {
            // Error switching language
        }
    }

    setLanguage(language) {
        const languageTexts = {
            pt: {
                portfolio: 'Portefólio',
                about: 'Sobre',
                experience: 'Experiência',
                education: 'Educação',
                skills: 'Habilidades',
                interests: 'Interesses',
                certifications: 'Certificações',
                projects: 'Projetos',
                designedBy: 'Desenhado por: '
            },
            eng: {
                portfolio: 'Portfolio',
                about: 'About',
                experience: 'Experience',
                education: 'Education',
                skills: 'Skills',
                interests: 'Interests',
                certifications: 'Certifications',
                projects: 'Projects',
                designedBy: 'Designed by: '
            }
        };

        const texts = languageTexts[language];
        
        // Update navigation text
        const navTitle = document.querySelector('.navTitleTXT');
        if (navTitle) navTitle.textContent = texts.portfolio;
        
        const aboutLink = document.getElementById('g_about');
        if (aboutLink) aboutLink.textContent = texts.about;
        
        const experienceLink = document.getElementById('g_experience');
        if (experienceLink) experienceLink.textContent = texts.experience;
        
        const educationLink = document.getElementById('g_education');
        if (educationLink) educationLink.textContent = texts.education;
        
        const skillsLink = document.getElementById('g_skills');
        if (skillsLink) skillsLink.textContent = texts.skills;
        
        const interestsLink = document.getElementById('g_interests');
        if (interestsLink) interestsLink.textContent = texts.interests;
        
        const awardsLink = document.getElementById('g_awards');
        if (awardsLink) awardsLink.textContent = texts.certifications;
        
        const projectLink = document.getElementById('g_project');
        if (projectLink) projectLink.textContent = texts.projects;
        
        const designText = document.getElementById('desigTXT');
        if (designText) designText.textContent = texts.designedBy;
    }

    handleNavigationClick(element) {
        const sectionId = element.id;
        const targetElement = document.getElementById(`${sectionId}Title`);
        
        if (targetElement) {
            this.scrollToSection(targetElement);
            this.highlightSection(sectionId);
        } else {
            // Section not found: ${sectionId}Title
        }
    }

    scrollToSection(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    highlightSection(sectionId) {
        // Remove previous highlights
        document.querySelectorAll('.section-highlighted').forEach(el => {
            el.classList.remove('section-highlighted');
        });
        
        // Add highlight to current section
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('section-highlighted');
            setTimeout(() => {
                section.classList.remove('section-highlighted');
            }, 2000);
        }
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        const darkModeBtn = document.querySelector('.darkModebtn');
        
        if (this.isDarkMode) {
            this.enableDarkMode();
            darkModeBtn.textContent = 'ON';
            darkModeBtn.id = 'ON';
        } else {
            this.disableDarkMode();
            darkModeBtn.textContent = 'OFF';
            darkModeBtn.id = 'OFF';
        }
    }

    enableDarkMode() {
        document.body.classList.add('dark-mode');
        const caixa = document.querySelector('.caixa');
        if (caixa) caixa.style.backgroundColor = '#2d3748';
        
        const navbar = document.querySelector('.navbarColor');
        if (navbar) {
            navbar.classList.remove('bg-primary');
            navbar.classList.add('bg-dark');
        }
        
        this.showNotification('Dark Mode - ON', 'success');
    }

    disableDarkMode() {
        document.body.classList.remove('dark-mode');
        const caixa = document.querySelector('.caixa');
        if (caixa) caixa.style.backgroundColor = 'white';
        
        const navbar = document.querySelector('.navbarColor');
        if (navbar) {
            navbar.classList.remove('bg-dark');
            navbar.classList.add('bg-primary');
        }
        
        this.showNotification('Dark Mode - OFF', 'info');
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    showPrivacyGate() {
        if (window.privacyGate) {
            window.privacyGate.showPrivacyGate();
        }
    }

    onPrivacyGateCompleted() {
        this.revealAllContent();
        this.showNotification('Welcome! Your portfolio is now fully accessible.', 'success');
    }

    revealAllContent() {
        // Only reveal contact information elements that were gated
        const gatedElements = document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"], .phone-number, .email-address');
        gatedElements.forEach(element => {
            element.classList.remove('privacy-gated');
            element.style.filter = 'none';
            element.style.pointerEvents = 'auto';
        });
    }

    addPrivacyGating() {
        // Only add privacy-gated class to contact information elements
        const sensitiveElements = document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"], .phone-number, .email-address');
        sensitiveElements.forEach(element => {
            element.classList.add('privacy-gated');
        });
    }

    // Premium Animation System
    setupPremiumAnimations() {
        // Setting up premium animations...
        
        // Intersection Observer for scroll animations
        this.setupScrollAnimations();
        
        // Premium hover effects
        this.setupPremiumHoverEffects();
        
        // Smooth scrolling
        this.setupSmoothScrolling();
        
        // Parallax effects
        this.setupParallaxEffects();
        
        // Typing animations
        this.setupTypingAnimations();
        
        // Particle effects
        this.setupParticleEffects();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('.resume-section, .resume-item, .skill-item').forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

    setupPremiumHoverEffects() {
        // Premium card hover effects
        document.querySelectorAll('.card, .resume-item').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createHoverEffect(e.target);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.removeHoverEffect(e.target);
            });
        });

        // Premium button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                this.createButtonHoverEffect(e.target);
            });
        });
    }

    createHoverEffect(element) {
        const rect = element.getBoundingClientRect();
        const glow = document.createElement('div');
        
        glow.className = 'hover-glow';
        glow.style.cssText = `
            position: absolute;
            top: ${rect.top}px;
            left: ${rect.left}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            background: radial-gradient(circle, rgba(0, 153, 51, 0.1) 0%, transparent 70%);
            pointer-events: none;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(glow);
        
        // Animate in
        requestAnimationFrame(() => {
            glow.style.opacity = '1';
        });
        
        element._hoverGlow = glow;
    }

    removeHoverEffect(element) {
        if (element._hoverGlow) {
            element._hoverGlow.style.opacity = '0';
            setTimeout(() => {
                if (element._hoverGlow && element._hoverGlow.parentNode) {
                    element._hoverGlow.parentNode.removeChild(element._hoverGlow);
                }
                element._hoverGlow = null;
            }, 300);
        }
    }

    createButtonHoverEffect(button) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    setupSmoothScrolling() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupParallaxEffects() {
        // Simple parallax for background elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    setupTypingAnimations() {
        // Typing effect for headings
        const typingElements = document.querySelectorAll('.typing-animation');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid #009933';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    element.style.borderRight = 'none';
                }
            };
            
            // Start typing when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        typeWriter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }

    setupParticleEffects() {
        // Create floating particles for premium feel
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        
        document.body.appendChild(particleContainer);
        
        // Create particles
        for (let i = 0; i < 20; i++) {
            this.createParticle(particleContainer);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const duration = Math.random() * 20 + 10;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(0, 153, 51, 0.3);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            animation: float ${duration}s infinite linear;
        `;
        
        container.appendChild(particle);
        
        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.createParticle(container);
            }
        }, duration * 1000);
    }

    showLanguageNotification(language) {
        const messages = {
            pt: 'Português Ativo',
            eng: 'English Activated'
        };
        
        this.showNotification(messages[language], 'success');
    }

    showNotification(message, type = 'info') {
        if (window.alertify) {
            switch (type) {
                case 'success':
                    alertify.success(message);
                    break;
                case 'error':
                    alertify.error(message);
                    break;
                case 'warning':
                    alertify.warning(message);
                    break;
                default:
                    alertify.log(message);
            }
        } else {
            // Fallback notification
            this.showFallbackNotification(message, type);
        }
    }

    showFallbackNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fallback-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }


}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // DOM loaded, initializing portfolio with original functionality...
    window.modernPortfolio = new ModernPortfolio();
    
    // Restore dark mode preference
    restoreDarkModePreference();
    

});

// Function to restore dark mode preference
function restoreDarkModePreference() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const darkModeToggle = document.getElementById('modernDarkModeToggle');
    const darkModeBtn = document.getElementById('modernDarkModeBtn');
    
    if (savedTheme === 'dark' && darkModeToggle && darkModeBtn) {
        // Apply dark theme
        darkModeToggle.classList.add('active');
        darkModeBtn.textContent = 'ON';
        darkModeBtn.id = 'modernDarkModeBtn';
        document.body.classList.add('dark-theme');
        // Dark mode preference restored
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernPortfolio;
}

// Global function for language switching (accessible from HTML)
function switchLanguage(language, event) {
  // Prevent default link behavior to avoid 404 errors
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  // Validate language parameter
  if (!language || !['eng', 'pt'].includes(language)) {
    // Invalid language parameter, defaulting to eng
    language = 'eng';
  }
  
  // Switch language
  try {
    // Switching language to: ${language}
    
    if (typeof window.loadPage === 'function') {
      window.loadPage(language);
    } else if (typeof this.loadOriginalContent === 'function') {
      this.loadOriginalContent(language);
    } else {
      // Using fallback loadPage for language: ${language}
      if (typeof window.loadPage === 'function') {
        window.loadPage(language);
      } else {
        // No language switching method available
      }
    }
    
    // Update language switcher UI
    this.updateLanguageSwitcher(language);
    
  } catch (error) {
    // Error switching language
  }
  
  // Return false to prevent any default behavior
  return false;
}

// Global function for dark mode toggle
function toggleDarkMode() {
  const darkModeToggle = document.getElementById('modernDarkModeToggle');
  const darkModeBtn = document.getElementById('modernDarkModeBtn');
  
  // toggleDarkMode called
  // Current darkModeBtn id
  // Current darkModeToggle active class
  
  const isDark = darkModeToggle.classList.contains('active');
  
  // Current theme is dark
  
  if (isDark) {
    // Switching to light mode
    darkModeToggle.classList.remove('active');
    darkModeBtn.textContent = 'OFF';
    document.body.classList.remove('dark-theme');
    
    // Save preference
    localStorage.setItem('portfolio-theme', 'light');
    
    // Switched to Light Mode
  } else {
    // Switching to dark mode
    darkModeToggle.classList.add('active');
    darkModeBtn.textContent = 'ON';
    document.body.classList.add('dark-theme');
    
    // Save preference
    localStorage.setItem('portfolio-theme', 'dark');
    
    // Switched to Dark Mode
  }
  
  // Save theme preference
  const newTheme = isDark ? 'light' : 'dark';
  localStorage.setItem('portfolio-theme', newTheme);
  
  // Theme preference saved
  
  // Verify theme application
  // Theme verification - body has dark-theme class
  // Toggle has active class
  // Button text
  // Button id
}
