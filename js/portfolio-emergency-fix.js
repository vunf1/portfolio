/**
 * Emergency Fix for Portfolio Content Visibility
 * This script ensures that portfolio content is always visible
 * PRESERVING ORIGINAL DESIGN
 */

(function() {
    'use strict';
    
    console.log('Emergency portfolio fix loaded - preserving original design');
    
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
            console.log('Original loadPage function found and working');
        } else {
            console.warn('Original loadPage function not found - portfolio may not work properly');
        }
        
        // Ensure original navigation works
        const loadDivElements = document.querySelectorAll('.loadDiv');
        loadDivElements.forEach(element => {
            element.style.cursor = 'pointer';
            element.style.pointerEvents = 'auto';
        });
        
        console.log('Emergency fix applied - content should be visible with original design');
        console.log('- Content elements processed:', allContent.length);
        console.log('- Contact elements gated:', contactElements.length);
        console.log('- Navigation elements enabled:', loadDivElements.length);
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
            
            console.log('Profile image size fixed - forced to 150x150px');
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
