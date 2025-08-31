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
        console.log('Portfolio initializing with original functionality...');
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
        if (window.cookieConsent) {
            console.log('Cookie consent initialized');
        }

        // Initialize privacy gate
        if (window.privacyGate) {
            console.log('Privacy gate initialized');
        }

        // Set initial language
        this.setLanguage(this.currentLanguage);
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
            if (window.privacyGate) {
                console.log('Privacy gate initialized for contact information only');
            }
            
        } catch (error) {
            console.error('Error during initial load:', error);
            this.showErrorMessage('Failed to load portfolio. Please refresh the page.');
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
        console.log('Loading original content for language:', language);
        
        // Use the original resume.js functionality
        if (window.loadPage) {
            window.loadPage(language);
        } else {
            // Fallback: manually trigger content loading
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
            console.error('Error switching language:', error);
            this.showNotification('Failed to switch language.', 'error');
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
            console.warn(`Section not found: ${sectionId}Title`);
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

    setupScrollAnimations() {
        // Enhanced scroll-triggered animations with better performance
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add staggered animation delay for better visual flow
                    const delay = Math.random() * 200; // Random delay up to 200ms
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, delay);
                }
            });
        }, observerOptions);

        // Observe elements for animation with better targeting
        const animatedElements = document.querySelectorAll('.resume-section, .resume-item, .skill-item, .certification-item');
        animatedElements.forEach((el, index) => {
            // Add initial state
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Stagger initial animations
            setTimeout(() => {
                observer.observe(el);
            }, index * 100); // Stagger observation by 100ms
        });
    }

    setupHoverEffects() {
        // Enhanced hover effects with better performance
        const interactiveElements = document.querySelectorAll('.resume-item, .skill-item, .certification-item, .social-link');
        
        interactiveElements.forEach(item => {
            // Add hover state management
            let hoverTimeout;
            
            item.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                item.classList.add('hover-effect');
                
                // Add subtle glow effect
                item.style.boxShadow = '0 10px 30px rgba(0, 153, 51, 0.15)';
            });
            
            item.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    item.classList.remove('hover-effect');
                    item.style.boxShadow = '';
                }, 100); // Small delay to prevent flickering
            });
        });
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

    ensureContentVisible() {
        // Force all portfolio content to be visible
        const allContent = document.querySelectorAll('.resume-section, .resume-item, .skill-item, .certification-item, .profile-image, .navbar, .footer');
        allContent.forEach(element => {
            element.style.filter = 'none';
            element.style.pointerEvents = 'auto';
            element.style.opacity = '1';
            element.style.visibility = 'visible';
        });
        
        // Only gate contact information
        const contactElements = document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"], .phone-number, .email-address');
        contactElements.forEach(element => {
            element.classList.add('privacy-gated');
        });
        
        // Debug: log what's visible
        console.log('Portfolio content visibility check:');
        console.log('- Total content elements:', allContent.length);
        console.log('- Contact elements gated:', contactElements.length);
        console.log('- Main content container:', document.querySelector('.caixa')?.innerHTML ? 'Has content' : 'No content');
    }

    // Debug method to check content state
    debugContentState() {
        const mainContainer = document.querySelector('.caixa');
        const privacyGate = document.getElementById('privacy-gate-overlay');
        const loadingScreen = document.getElementById('loading');
        
        console.log('=== Portfolio Debug Info ===');
        console.log('Main container exists:', !!mainContainer);
        console.log('Main container content length:', mainContainer?.innerHTML?.length || 0);
        console.log('Privacy gate visible:', !!privacyGate);
        console.log('Loading screen visible:', !!loadingScreen);
        console.log('Privacy gate instance:', !!window.privacyGate);
        console.log('Portfolio instance:', !!window.modernPortfolio);
        console.log('================================');
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing portfolio with original functionality...');
    window.modernPortfolio = new ModernPortfolio();
    
    // Restore dark mode preference
    restoreDarkModePreference();
    
    // Add global debug function
    window.debugPortfolio = () => {
        if (window.modernPortfolio) {
            window.modernPortfolio.debugContentState();
        } else {
            console.log('Portfolio not initialized yet');
        }
    };
    
    // Force content visibility after a delay as a safety measure
    setTimeout(() => {
        if (window.modernPortfolio) {
            window.modernPortfolio.ensureContentVisible();
        }
    }, 3000);
});

// Function to restore dark mode preference
function restoreDarkModePreference() {
    const savedTheme = localStorage.getItem('darkMode');
    const darkModeToggle = document.getElementById('modernDarkModeToggle');
    const darkModeBtn = document.getElementById('modernDarkModeBtn');
    
    if (savedTheme === 'dark' && darkModeToggle && darkModeBtn) {
        // Apply dark theme
        darkModeToggle.classList.add('active');
        darkModeBtn.textContent = 'ON';
        darkModeBtn.id = 'modernDarkModeBtn';
        document.body.classList.add('dark-theme');
        console.log('Dark mode preference restored');
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
  
  // Ensure language parameter is valid
  if (!language || (language !== 'pt' && language !== 'eng')) {
    console.warn('Invalid language parameter:', language, 'defaulting to eng');
    language = 'eng';
  }
  
  console.log('Switching language to:', language);
  
  if (window.modernPortfolio) {
    window.modernPortfolio.switchLanguage(language);
  } else {
    // Fallback if modernPortfolio is not available
    if (window.loadPage) {
      console.log('Using fallback loadPage for language:', language);
      window.loadPage(language);
    } else {
      console.warn('No language switching method available');
    }
  }
  
  // Return false to prevent any default behavior
  return false;
}

// Global function for dark mode toggle
function toggleDarkMode() {
  const darkModeToggle = document.getElementById('modernDarkModeToggle');
  const darkModeBtn = document.getElementById('modernDarkModeBtn');
  
  console.log('toggleDarkMode called');
  console.log('Current darkModeBtn id:', darkModeBtn?.id);
  console.log('Current darkModeToggle active class:', darkModeToggle?.classList.contains('active'));
  
  if (darkModeToggle && darkModeBtn) {
    const isDark = darkModeToggle.classList.contains('active');
    console.log('Current theme is dark:', isDark);
    
    if (isDark) {
      // Switch to light mode
      console.log('Switching to light mode');
      darkModeToggle.classList.remove('active');
      darkModeBtn.textContent = 'OFF';
      darkModeBtn.id = 'modernDarkModeBtn';
      document.body.classList.remove('dark-theme');
      
      // Show notification
      if (window.alertify) {
        alertify.success('Light Mode Activated');
      }
      
      console.log('Switched to Light Mode');
    } else {
      // Switch to dark mode
      console.log('Switching to dark mode');
      darkModeToggle.classList.add('active');
      darkModeBtn.textContent = 'ON';
      darkModeBtn.id = 'modernDarkModeBtn';
      document.body.classList.add('dark-theme');
      
      // Show notification
      if (window.alertify) {
        alertify.success('Dark Mode Activated');
      }
      
      console.log('Switched to Dark Mode');
    }
    
    // Store preference in localStorage
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('darkMode', newTheme);
    console.log('Theme preference saved:', newTheme);
    
    // Verify the change
    setTimeout(() => {
      console.log('Theme verification - body has dark-theme class:', document.body.classList.contains('dark-theme'));
      console.log('Toggle has active class:', darkModeToggle.classList.contains('active'));
      console.log('Button text:', darkModeBtn.textContent);
      console.log('Button id:', darkModeBtn.id);
    }, 100);
  } else {
    console.error('Dark mode elements not found:', {
      darkModeToggle: !!darkModeToggle,
      darkModeBtn: !!darkModeBtn
    });
  }
}
