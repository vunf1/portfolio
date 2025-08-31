/* ===== ERROR HANDLER ===== */

// Global error handler
window.addEventListener('error', (event) => {
    console.warn('Error caught by global handler:', event.error);
    
    // Don't show errors to users in production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Error details:', {
            message: event.error?.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    }
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection:', event.reason);
    
    // Prevent the default browser handling
    event.preventDefault();
    
    // Log additional details in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Promise rejection details:', {
            reason: event.reason,
            promise: event.promise
        });
    }
});

// Console error interceptor
const originalConsoleError = console.error;
console.error = function(...args) {
    // Filter out common errors that we don't need to see
    const message = args.join(' ');
    
    // Ignore common WebP and service worker errors
    if (message.includes('Failed to load resource: the server responded with a status of 404') ||
        message.includes('InvalidAccessError: Failed to execute') ||
        message.includes('scrollspy is not a function') ||
        message.includes('net::ERR_ABORTED') ||
        message.includes('HEAD') ||
        message.includes('.webp')) {
        return; // Don't log these errors
    }
    
    // Call original console.error for other errors
    originalConsoleError.apply(console, args);
};

// Console warn interceptor
const originalConsoleWarn = console.warn;
console.warn = function(...args) {
    // Filter out common warnings
    const message = args.join(' ');
    
    // Ignore common preload warnings and service worker warnings
    if (message.includes('was preloaded using link preload but not used') ||
        message.includes('Service Worker registered') ||
        message.includes('Service Worker registration failed')) {
        return; // Don't log these warnings
    }
    
    // Call original console.warn for other warnings
    originalConsoleWarn.apply(console, args);
};

// Initialize error handler
document.addEventListener('DOMContentLoaded', () => {
    console.log('Error handler initialized');
    
    // Check for common issues
    setTimeout(() => {
        // Check if Bootstrap is loaded
        if (typeof bootstrap === 'undefined') {
            console.warn('Bootstrap not detected - some features may not work');
        }
        
        // Check if jQuery is loaded
        if (typeof $ === 'undefined') {
            console.warn('jQuery not detected - some features may not work');
        }
        
        // Check for missing images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', () => {
                console.warn('Image failed to load:', img.src);
                // Set a fallback image or hide the element
                img.style.display = 'none';
            });
        });
    }, 1000);
});

// Export for global access
window.ErrorHandler = {
    logError: (error, context = '') => {
        console.warn('Application error:', error, context);
    },
    
    handleAsyncError: (promise) => {
        return promise.catch(error => {
            console.warn('Async operation failed:', error);
            return null;
        });
    }
};
