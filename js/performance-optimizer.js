/* ===== PERFORMANCE OPTIMIZER ===== */

class PerformanceOptimizer {
    constructor() {
        this.imageObserver = null;
        this.performanceMetrics = {};
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.optimizeImages();
        this.setupPerformanceMonitoring();
        this.optimizeCSSDelivery();
        this.setupServiceWorker();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.imageObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                this.imageObserver.observe(img);
            });
        }
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            // Create a new image to preload
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                
                // Add fade-in effect
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    img.style.opacity = '1';
                }, 50);
            };
            tempImg.src = src;
        }
    }

    optimizeImages() {
        // Disable WebP conversion to prevent 404 errors
        // if (this.supportsWebP()) {
        //     this.convertImagesToWebP();
        // }

        // Optimize existing images
        this.optimizeImageSizes();
        
        // Add loading="lazy" to images
        document.querySelectorAll('img:not([loading])').forEach(img => {
            if (!img.classList.contains('critical')) {
                img.loading = 'lazy';
            }
        });
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    async convertImagesToWebP() {
        // Check if WebP files actually exist before trying to use them
        const imageMap = {
            'img/profile.jpg': 'img/profile.webp',
            'img/background.jpeg': 'img/background.webp',
            'img/certificates/Certi_Apps4Good.png': 'img/certificates/Certi_Apps4Good.webp',
            'img/certificates/Certi_before_Uny.png': 'img/certificates/Certi_before_Uny.webp',
            'img/certificates/Certi_before_Uny2.png': 'img/certificates/Certi_before_Uny2.webp',
            'img/certificates/Certi_essential_NodeJs.png': 'img/certificates/Certi_essential_NodeJs.webp'
        };

        for (const [originalSrc, webpSrc] of Object.entries(imageMap)) {
            try {
                // Check if WebP file exists
                const response = await fetch(webpSrc, { method: 'HEAD' });
                if (response.ok) {
                    const img = document.querySelector(`img[src="${originalSrc}"]`);
                    if (img) {
                        // Create picture element for WebP support
                        const picture = document.createElement('picture');
                        const webpSource = document.createElement('source');
                        webpSource.srcset = webpSrc;
                        webpSource.type = 'image/webp';
                        
                        picture.appendChild(webpSource);
                        picture.appendChild(img.cloneNode(true));
                        
                        img.parentNode.replaceChild(picture, img);
                    }
                }
            } catch (error) {
                // WebP file doesn't exist, skip conversion
                console.log(`WebP file not found: ${webpSrc}, skipping conversion`);
            }
        }
    }

    optimizeImageSizes() {
        // Optimize profile image size
        const profileImg = document.getElementById('profileIMG');
        if (profileImg) {
            profileImg.style.maxWidth = '150px';
            profileImg.style.maxHeight = '150px';
            profileImg.style.width = '150px';
            profileImg.style.height = '150px';
        }

        // Add responsive image sizes
        document.querySelectorAll('img').forEach(img => {
            if (!img.sizes) {
                img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
            }
        });
    }

    setupPerformanceMonitoring() {
        if ('performance' in window) {
            // Monitor Core Web Vitals
            this.observeCoreWebVitals();
            
            // Monitor resource loading
            this.monitorResourceLoading();
            
            // Monitor user interactions
            this.monitorUserInteractions();
        }
    }

    observeCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.performanceMetrics.lcp = lastEntry.startTime;
                
                if (lastEntry.startTime > 2500) {
                    console.warn('LCP is slow:', lastEntry.startTime, 'ms');
                }
            });
            
            try {
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP observer not supported');
            }

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.performanceMetrics.fid = entry.processingStart - entry.startTime;
                    
                    if (entry.processingStart - entry.startTime > 100) {
                        console.warn('FID is slow:', entry.processingStart - entry.startTime, 'ms');
                    }
                });
            });
            
            try {
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.warn('FID observer not supported');
            }
        }
    }

    monitorResourceLoading() {
        const resourceObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.initiatorType === 'img' && entry.duration > 1000) {
                    console.warn('Slow image load:', entry.name, entry.duration, 'ms');
                }
            });
        });
        
        try {
            resourceObserver.observe({ entryTypes: ['resource'] });
        } catch (e) {
            console.warn('Resource observer not supported');
        }
    }

    monitorUserInteractions() {
        let interactionCount = 0;
        let lastInteractionTime = Date.now();
        
        const interactionEvents = ['click', 'scroll', 'keydown', 'touchstart'];
        
        interactionEvents.forEach(eventType => {
            document.addEventListener(eventType, () => {
                interactionCount++;
                lastInteractionTime = Date.now();
                
                // Track interaction patterns
                if (interactionCount % 10 === 0) {
                    this.performanceMetrics.interactionCount = interactionCount;
                    this.performanceMetrics.lastInteraction = lastInteractionTime;
                }
            }, { passive: true });
        });
    }

    optimizeCSSDelivery() {
        // Critical CSS inlining
        this.inlineCriticalCSS();
        
        // Defer non-critical CSS
        this.deferNonCriticalCSS();
    }

    inlineCriticalCSS() {
        // Inline critical CSS for above-the-fold content
        const criticalCSS = `
            body { font-family: 'Open Sans', sans-serif; }
            .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; }
            .resume-section { padding: 3rem 0; }
            h1, h2, h3 { font-family: 'Saira Extra Condensed', serif; }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        style.setAttribute('data-critical', 'true');
        document.head.insertBefore(style, document.head.firstChild);
    }

    deferNonCriticalCSS() {
        // Defer loading of non-critical CSS
        const nonCriticalCSS = [
            'css/mobile-optimizations.css',
            'css/premium-components.css'
        ];
        
        nonCriticalCSS.forEach(cssFile => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssFile;
            link.media = 'print';
            link.onload = () => {
                link.media = 'all';
            };
            document.head.appendChild(link);
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            // Register service worker for caching
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    // Performance optimization methods
    optimizeAnimations() {
        // Use will-change for elements that will animate
        document.querySelectorAll('.fade-in, .slide-in-left').forEach(element => {
            element.style.willChange = 'transform, opacity';
        });
        
        // Use transform3d for hardware acceleration
        document.querySelectorAll('.resume-content').forEach(element => {
            element.style.transform = 'translateZ(0)';
        });
    }

    optimizeScrolling() {
        // Use passive event listeners for scroll events
        document.addEventListener('scroll', () => {
            // Scroll handling logic
        }, { passive: true });
        
        // Optimize scroll performance
        document.querySelectorAll('.resume-section').forEach(section => {
            section.style.willChange = 'transform';
        });
    }

    // Memory management
    cleanup() {
        // Clean up observers
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
        
        // Remove event listeners
        document.removeEventListener('scroll', this.handleScroll);
        
        // Clear performance metrics
        this.performanceMetrics = {};
    }

    // Get performance report
    getPerformanceReport() {
        return {
            ...this.performanceMetrics,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : 'Not supported'
        };
    }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
    
    // Optimize after initial load
    setTimeout(() => {
        window.performanceOptimizer.optimizeAnimations();
        window.performanceOptimizer.optimizeScrolling();
    }, 1000);
});

// Export for global access
window.PerformanceOptimizer = PerformanceOptimizer;
