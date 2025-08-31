/* ===== PORTFOLIO OPTIMIZED JAVASCRIPT ===== */

class OptimizedPortfolio {
    constructor() {
        this.currentLanguage = 'eng';
        this.isDarkMode = false;
        this.isMobile = window.innerWidth < 992;
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeIntersectionObserver();
        this.loadInitialContent();
        this.setupMobileOptimizations();
        this.restoreUserPreferences();
    }

    setupEventListeners() {
        // Language switching
        document.addEventListener('click', (e) => {
            if (e.target.closest('#pt')) {
                this.switchLanguage('pt', e);
            } else if (e.target.closest('#eng')) {
                this.switchLanguage('eng', e);
            }
        });

        // Dark mode toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('#modernDarkModeToggle')) {
                this.toggleDarkMode();
            }
        });

        // Mobile navigation
            document.addEventListener('click', (e) => {
            if (e.target.closest('.navbar-toggler')) {
                this.handleMobileNavToggle();
            }
        });

        // Smooth scrolling for navigation links
        document.addEventListener('click', (e) => {
            if (e.target.closest('.js-scroll-trigger')) {
                e.preventDefault();
                this.smoothScrollToSection(e.target.closest('.js-scroll-trigger').getAttribute('href'));
            }
        });

        // Window resize handling
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Scroll handling
        window.addEventListener('scroll', this.debounce(() => {
            this.handleScroll();
        }, 16));

        // Load content triggers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.loadDiv')) {
                this.handleContentLoad(e.target.closest('.loadDiv'));
            }
        });
    }

    initializeIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        this.observer.unobserve(entry.target);
                    }
                });
            }, this.observerOptions);

            // Observe all resume sections
            document.querySelectorAll('.resume-section').forEach(section => {
                this.observer.observe(section);
            });
        }
    }

    loadInitialContent() {
        // Use the original loadPage function if available
        if (typeof window.loadPage === 'function') {
            window.loadPage(this.currentLanguage);
        } else {
            this.loadContent(this.currentLanguage);
        }
    }

    async loadContent(language) {
        try {
            const response = await fetch(`${language}.html`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract main content
            const mainContent = doc.querySelector('.caixa') || doc.body;
            
            // Update the main content container
            const container = document.getElementById('main-content');
            if (container) {
                container.innerHTML = mainContent.innerHTML;
                
                // Reinitialize components
                this.initializeContentComponents();
                
                // Update active navigation
                this.updateActiveNavigation();
                
                // Trigger content animations
                this.triggerContentAnimations();
            }
        } catch (error) {
            console.error('Error loading content:', error);
            this.showErrorMessage('Failed to load content. Please try again.');
        }
    }

    initializeContentComponents() {
        // Initialize tooltips
        this.initializeTooltips();
        
        // Initialize modals
        this.initializeModals();
        
        // Setup content triggers
        this.setupContentTriggers();
        
        // Observe new content for animations
        if (this.observer) {
            document.querySelectorAll('.resume-section').forEach(section => {
                this.observer.observe(section);
            });
        }
    }

    initializeTooltips() {
        // Bootstrap 5 tooltip initialization
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    initializeModals() {
        // Bootstrap 5 modal initialization
        const modalTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="modal"]'));
        modalTriggerList.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const targetModal = document.querySelector(trigger.getAttribute('data-bs-target'));
                if (targetModal) {
                    const modal = new bootstrap.Modal(targetModal);
                    modal.show();
                }
            });
        });
    }

    setupContentTriggers() {
        // Setup clickable elements for content loading
        document.querySelectorAll('.loadDiv').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                this.handleContentLoad(trigger);
            });
        });

        // Setup certificate image triggers
        document.querySelectorAll('.triggerImage').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                this.handleCertificateClick(trigger);
            });
        });
    }

    handleContentLoad(trigger) {
        const targetId = trigger.getAttribute('id');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Toggle visibility with smooth animation
            if (targetSection.style.display === 'none' || !targetSection.style.display) {
                targetSection.style.display = 'block';
                targetSection.classList.add('fade-in');
                
                // Update trigger text/icon if needed
                const titleElement = document.getElementById(targetId + 'Title');
                if (titleElement) {
                    titleElement.classList.add('active');
                }
        } else {
                targetSection.style.display = 'none';
                targetSection.classList.remove('fade-in');
                
                const titleElement = document.getElementById(targetId + 'Title');
                if (titleElement) {
                    titleElement.classList.remove('active');
                }
            }
        }
    }

    handleCertificateClick(trigger) {
        const certificateId = trigger.getAttribute('id');
        const modal = document.getElementById('exampleModal');
        
        if (modal) {
            // Update modal content based on certificate
            const modalTitle = modal.querySelector('.modal-title');
            const modalBody = modal.querySelector('.modal-body');
            
            if (modalTitle) modalTitle.textContent = `Certificate: ${certificateId}`;
            if (modalBody) {
                modalBody.innerHTML = `<img src="img/certificates/${certificateId}.png" alt="${certificateId}" class="img-fluid">`;
            }
            
            // Show modal
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }
    }

    switchLanguage(language, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        this.currentLanguage = language;
        localStorage.setItem('portfolio-language', language);
        
        // Update active language indicator
        document.querySelectorAll('.language-switcher .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        event.target.closest('.nav-link').classList.add('active');
        
        // Load content in new language
        this.loadContent(language);
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('portfolio-theme', this.isDarkMode ? 'dark' : 'light');
        
        // Update theme
        document.documentElement.setAttribute('data-bs-theme', this.isDarkMode ? 'dark' : 'light');
        
        // Update toggle button
        const toggleBtn = document.getElementById('modernDarkModeBtn');
        if (toggleBtn) {
            toggleBtn.textContent = this.isDarkMode ? 'ON' : 'OFF';
        }
        
        // Update toggle container
        const toggleContainer = document.getElementById('modernDarkModeToggle');
        if (toggleContainer) {
            toggleContainer.classList.toggle('active', this.isDarkMode);
        }
    }

    setupMobileOptimizations() {
        if (this.isMobile) {
            // Add mobile-specific classes
            document.body.classList.add('mobile-view');
            
            // Setup mobile navigation
            this.setupMobileNavigation();
            
            // Add mobile social links
            this.addMobileSocialLinks();
            
            // Optimize touch interactions
            this.optimizeTouchInteractions();
        }
    }

    setupMobileNavigation() {
        // Create mobile bottom navigation
        const mobileNav = document.createElement('nav');
        mobileNav.className = 'mobile-bottom-nav';
        mobileNav.innerHTML = `
            <div class="mobile-nav-item" data-section="about">
                <i class="fa fa-user"></i>
                <span>About</span>
            </div>
            <div class="mobile-nav-item" data-section="experience">
                <i class="fa fa-briefcase"></i>
                <span>Experience</span>
            </div>
            <div class="mobile-nav-item" data-section="skills">
                <i class="fa fa-code"></i>
                <span>Skills</span>
            </div>
            <div class="mobile-nav-item" data-section="contact">
                <i class="fa fa-envelope"></i>
                <span>Contact</span>
            </div>
        `;
        
        document.body.appendChild(mobileNav);
        
        // Add mobile navigation event listeners
        mobileNav.addEventListener('click', (e) => {
            const navItem = e.target.closest('.mobile-nav-item');
            if (navItem) {
                this.handleMobileNavigation(navItem.dataset.section);
            }
        });
    }

    addMobileSocialLinks() {
        // Add mobile social links to navbar collapse
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse) {
            const mobileSocialLinks = document.createElement('div');
            mobileSocialLinks.className = 'mobile-social-links';
            mobileSocialLinks.innerHTML = `
                <a href="https://www.linkedin.com/in/joao-maia/" target="_blank" aria-label="LinkedIn">
                    <i class="fa fa-linkedin"></i>
                </a>
                <a href="https://github.com/vunf1/" target="_blank" aria-label="GitHub">
                    <i class="fa fa-github"></i>
                </a>
                <a href="mailto:jokass.workplace@gmail.com" aria-label="Email">
                    <i class="fa fa-envelope"></i>
                </a>
            `;
            
            navbarCollapse.appendChild(mobileSocialLinks);
        }
    }

    optimizeTouchInteractions() {
        // Add touch-friendly interactions
        document.querySelectorAll('.resume-item, .skill-item').forEach(item => {
            item.addEventListener('touchstart', () => {
                item.style.transform = 'scale(0.98)';
            });
            
            item.addEventListener('touchend', () => {
                item.style.transform = 'scale(1)';
            });
        });
    }

    handleMobileNavigation(section) {
        // Scroll to section
        const targetElement = document.getElementById(section);
        if (targetElement) {
            this.smoothScrollToElement(targetElement);
        }
        
        // Update active mobile nav item
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
    }

    smoothScrollToSection(href) {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            this.smoothScrollToElement(targetElement);
        }
    }

    smoothScrollToElement(element) {
        const offset = this.isMobile ? 80 : 0;
        const targetPosition = element.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 992;
        
        if (wasMobile !== this.isMobile) {
            // Handle breakpoint change
            this.setupMobileOptimizations();
        }
    }

    handleScroll() {
        // Handle navbar scroll effect
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
        } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Update active navigation based on scroll position
        this.updateActiveNavigation();
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('.resume-section');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    triggerContentAnimations() {
        // Trigger entrance animations for visible content
        const visibleElements = document.querySelectorAll('.resume-item, .skill-item, .list-social-icons a');
        
        visibleElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in');
            }, index * 100);
        });
    }

    restoreUserPreferences() {
        // Restore language preference
        const savedLanguage = localStorage.getItem('portfolio-language');
        if (savedLanguage && savedLanguage !== this.currentLanguage) {
            this.switchLanguage(savedLanguage);
        }
        
        // Restore theme preference
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme === 'dark') {
            this.toggleDarkMode();
        }
    }

    showErrorMessage(message) {
        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger alert-dismissible fade show';
        errorDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.getElementById('main-content');
        if (container) {
            container.insertBefore(errorDiv, container.firstChild);
        }
    }

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
}

// Performance optimization: Lazy load images
function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize optimized portfolio
    window.optimizedPortfolio = new OptimizedPortfolio();
    
    // Setup lazy loading
    setupLazyLoading();
    
    // Add loading performance metrics
    if ('performance' in window) {
            window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData && perfData.loadEventEnd && perfData.loadEventStart) {
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                if (loadTime > 0) {
                    console.log('Page Load Time:', loadTime, 'ms');
                }
            }
        });
    }
});

// Export for global access
window.OptimizedPortfolio = OptimizedPortfolio;
