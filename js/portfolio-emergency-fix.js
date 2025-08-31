// Emergency Portfolio Fix - Preserves Original Design
// This script ensures content visibility and fixes layout issues

(function() {
    'use strict';
    
    // Emergency portfolio fix loaded - preserving original design
    
    // Force content visibility immediately
    function forceContentVisible() {
        // Force all portfolio content to be visible
        const allContent = document.querySelectorAll('.resume-section, .resume-item, .skill-item, .certification-item, .profile-image, .navbar, .footer, .caixa');
        allContent.forEach(element => {
            element.style.filter = 'none';
            element.style.pointerEvents = 'auto';
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.display = 'block';
        });
        
        // Remove any privacy-gated classes from non-contact elements
        const nonContactElements = document.querySelectorAll('.resume-section, .resume-item, .skill-item, .certification-item, .profile-image, .navbar, .footer, .caixa');
        nonContactElements.forEach(element => {
            element.classList.remove('privacy-gated');
        });
        
        // Only apply privacy gating to actual contact information
        const contactElements = document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"], .phone-number, .email-address');
        contactElements.forEach(element => {
            element.classList.add('privacy-gated');
        });
        
        // Ensure original resume.js functionality is working
        if (window.loadPage && typeof window.loadPage === 'function') {
            // Original loadPage function found and working
        } else {
            // Original loadPage function not found - portfolio may not work properly
        }
        
        // Ensure original navigation works
        const loadDivElements = document.querySelectorAll('.loadDiv');
        loadDivElements.forEach(element => {
            element.style.cursor = 'pointer';
            element.style.pointerEvents = 'auto';
        });
        
        // Emergency fix applied - content should be visible with original design
        // - Content elements processed
        // - Contact elements gated
        // - Navigation elements enabled
    }
    
    // Apply fix immediately
    forceContentVisible();
    
    // Apply fix after DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceContentVisible);
    }
    
    // Apply fix after window loads
    window.addEventListener('load', forceContentVisible);
    
    // Apply fix every 5 seconds as a safety measure (reduced frequency)
    setInterval(forceContentVisible, 5000);
    
    // Make function globally available
    window.emergencyPortfolioFix = forceContentVisible;
    
    // Additional fix for mobile navigation
    function fixMobileNavigation() {
        const mobileNav = document.querySelector('.navbar-toggler');
        if (mobileNav) {
            // Only show navbar-toggler on mobile devices
            if (window.innerWidth < 992) { // Bootstrap lg breakpoint
                mobileNav.style.display = 'block';
                mobileNav.style.visibility = 'visible';
                mobileNav.style.opacity = '1';
            } else {
                // Hide on desktop
                mobileNav.style.display = 'none';
                mobileNav.style.visibility = 'hidden';
                mobileNav.style.opacity = '0';
            }
        }

        // Ensure mobile icons are visible only on mobile
        const mobileIcons = document.querySelectorAll('.d-block.d-lg-none .social-link');
        mobileIcons.forEach(icon => {
            if (window.innerWidth < 992) {
                icon.style.display = 'inline-block';
                icon.style.visibility = 'visible';
                icon.style.opacity = '1';
            } else {
                icon.style.display = 'none';
                icon.style.visibility = 'hidden';
                icon.style.opacity = '0';
            }
        });
    }

    // Fix profile image size - ensure it's not huge
    function fixProfileImageSize() {
        const profileImg = document.getElementById('profileIMG');
        if (profileImg) {
            // Force specific dimensions - nuclear option
            profileImg.style.width = '150px';
            profileImg.style.height = '150px';
            profileImg.style.maxWidth = '150px';
            profileImg.style.maxHeight = '150px';
            profileImg.style.minWidth = '150px';
            profileImg.style.minHeight = '150px';
            
            // Remove any inline styles that might be setting size
            profileImg.style.removeProperty('width');
            profileImg.style.removeProperty('height');
            profileImg.style.removeProperty('max-width');
            profileImg.style.removeProperty('max-height');
            profileImg.style.removeProperty('min-width');
            profileImg.style.removeProperty('min-height');
            
            // Force original size
            profileImg.style.transform = 'none';
            profileImg.style.transformOrigin = 'center';
            
            // Ensure Bootstrap classes work properly
            profileImg.classList.add('rounded-circle', 'mx-auto', 'mb-2');
            
            // Force dimensions again after removing properties
            profileImg.style.setProperty('width', '150px', 'important');
            profileImg.style.setProperty('height', '150px', 'important');
            profileImg.style.setProperty('max-width', '150px', 'important');
            profileImg.style.setProperty('max-height', '150px', 'important');
            
            // Profile image size fixed - forced to 150x150px
        }
    }

    // Apply mobile navigation fix
    fixMobileNavigation();
    
    // Apply profile image size fix
    fixProfileImageSize();

    // Apply mobile fix after DOM loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            fixMobileNavigation();
            fixProfileImageSize();
        });
    }

    // Apply mobile fix after window loads
    window.addEventListener('load', () => {
        fixMobileNavigation();
        fixProfileImageSize();
    });

    // Handle window resize to show/hide mobile elements
    window.addEventListener('resize', () => {
        fixMobileNavigation();
    });
    
})();

// Force navbar privacy section visibility
function ensureNavbarPrivacyVisibility() {
    const privacySection = document.querySelector('.navbar-nav .privacy-section');
    const creditText = document.querySelector('.navbar-nav .credit-text');
    const privacyLinks = document.querySelector('.navbar-nav .privacy-links');
    
    if (privacySection) {
        // Force visibility
        privacySection.style.setProperty('display', 'block', 'important');
        privacySection.style.setProperty('visibility', 'visible', 'important');
        privacySection.style.setProperty('opacity', '1', 'important');
        
        // Privacy section visibility forced
    }
    
    if (creditText) {
        creditText.style.setProperty('display', 'block', 'important');
        creditText.style.setProperty('visibility', 'visible', 'important');
        creditText.style.setProperty('opacity', '1', 'important');
    }
    
    if (privacyLinks) {
        privacyLinks.style.setProperty('display', 'flex', 'important');
        privacyLinks.style.setProperty('visibility', 'visible', 'important');
        privacyLinks.style.setProperty('opacity', '1', 'important');
    }
}

// Force apply dark theme to footer
function forceFooterDarkTheme() {
    const footer = document.querySelector('.footer-credit');
    const body = document.body;
    
    if (footer && body.classList.contains('dark-theme')) {
        // Force applying dark theme to footer
        footer.style.setProperty('background-color', 'rgba(255, 255, 255, 0.05)', 'important');
        footer.style.setProperty('border-top', '1px solid rgba(255, 255, 255, 0.1)', 'important');
        footer.style.setProperty('color', 'rgb(226, 232, 240)', 'important');
        
        const container = footer.querySelector('.container');
        if (container) {
            container.style.setProperty('color', 'rgb(226, 232, 240)', 'important');
        }
        
        const paragraph = footer.querySelector('p');
        if (paragraph) {
            paragraph.style.setProperty('color', 'rgb(226, 232, 240)', 'important');
        }
        
        // Dark theme forced to footer with background fix
    }
}

// Force add dark theme class to body if toggle is active
function ensureDarkThemeClass() {
    const darkModeToggle = document.getElementById('modernDarkModeToggle');
    const body = document.body;
    
    if (darkModeToggle && darkModeToggle.classList.contains('active')) {
        if (!body.classList.contains('dark-theme')) {
            // Dark mode toggle is active but body missing dark-theme class - adding it
            body.classList.add('dark-theme');
        }
    }
}

// Comprehensive dark theme state checker and fixer
function checkAndFixDarkTheme() {
    const body = document.body;
    const darkModeToggle = document.getElementById('modernDarkModeToggle');
    const footer = document.querySelector('.footer-credit');
    
    if (darkModeToggle && darkModeToggle.classList.contains('active') && !body.classList.contains('dark-theme')) {
        // Dark mode toggle is active but body missing dark-theme class - FIXING
        body.classList.add('dark-theme');
        
        // Force applying dark theme to footer after class fix
        if (footer) {
            footer.style.setProperty('background-color', 'rgba(255, 255, 255, 0.05)', 'important');
            footer.style.setProperty('border-top', '1px solid rgba(255, 255, 255, 0.1)', 'important');
            footer.style.setProperty('color', 'rgb(226, 232, 240)', 'important');
            
            const container = footer.querySelector('.container');
            if (container) {
                container.style.setProperty('color', 'rgb(226, 232, 240)', 'important');
            }
            
            const paragraph = footer.querySelector('p');
            if (paragraph) {
                paragraph.style.setProperty('color', 'rgb(226, 232, 240)', 'important');
            }
            
            // Dark theme forced to footer after class fix
        }
    } else if (darkModeToggle && darkModeToggle.classList.contains('active') && body.classList.contains('dark-theme')) {
        // Dark mode is properly active - applying footer styles
        if (footer) {
            forceFooterDarkTheme();
        }
    } else {
        // Dark mode is not active - no changes needed
    }
}

// Run footer dark theme fix
forceFooterDarkTheme();
ensureDarkThemeClass();

// Also run when dark mode is toggled
document.addEventListener('DOMContentLoaded', () => {
    // Watch for dark theme class changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (document.body.classList.contains('dark-theme')) {
                    setTimeout(forceFooterDarkTheme, 100);
                }
            }
        });
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Also check periodically
    setInterval(() => {
        if (document.body.classList.contains('dark-theme')) {
            forceFooterDarkTheme();
        }
    }, 2000);
});

// Run comprehensive check
checkAndFixDarkTheme();

// Also run periodically
setInterval(checkAndFixDarkTheme, 1000);

// Run navbar privacy visibility fix
ensureNavbarPrivacyVisibility();

// Also run when DOM is ready
document.addEventListener('DOMContentLoaded', ensureNavbarPrivacyVisibility);
