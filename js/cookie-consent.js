/**
 * GDPR Cookie Consent Manager
 * Handles cookie consent, storage, and user preferences
 */
class CookieConsent {
    constructor() {
        this.consentKey = 'portfolio_cookie_consent';
        this.preferencesKey = 'portfolio_cookie_preferences';
        this.defaultPreferences = {
            necessary: true,      // Always required
            analytics: false,     // Analytics cookies
            marketing: false,     // Marketing cookies
            preferences: false    // Preference cookies
        };
        
        this.init();
    }

    init() {
        // Check if consent banner should be shown
        if (!this.hasConsent()) {
            this.showConsentBanner();
        } else {
            this.loadPreferences();
        }
    }

    hasConsent() {
        return localStorage.getItem(this.consentKey) !== null;
    }

    showConsentBanner() {
        // Create consent banner HTML
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-header">
                    <h4>🍪 Cookie Preferences</h4>
                    <p>We use cookies to enhance your browsing experience and analyze site traffic. 
                    By clicking "Accept All", you consent to our use of cookies. 
                    <a href="privacy-policy.html" target="_blank">Learn more</a></p>
                </div>
                
                <div class="cookie-consent-options">
                    <div class="cookie-option">
                        <label class="cookie-checkbox">
                            <input type="checkbox" checked disabled>
                            <span class="checkmark"></span>
                            <span class="cookie-label">
                                <strong>Necessary</strong> - Required for website functionality
                            </span>
                        </label>
                    </div>
                    
                    <div class="cookie-option">
                        <label class="cookie-checkbox">
                            <input type="checkbox" id="analytics-consent">
                            <span class="checkmark"></span>
                            <span class="cookie-label">
                                <strong>Analytics</strong> - Help us improve our website
                            </span>
                        </label>
                    </div>
                    
                    <div class="cookie-option">
                        <label class="cookie-checkbox">
                            <input type="checkbox" id="marketing-consent">
                            <span class="checkmark"></span>
                            <span class="cookie-label">
                                <strong>Marketing</strong> - Personalized content and ads
                            </span>
                        </label>
                    </div>
                    
                    <div class="cookie-option">
                        <label class="cookie-checkbox">
                            <input type="checkbox" id="preferences-consent">
                            <span class="checkmark"></span>
                            <span class="cookie-label">
                                <strong>Preferences</strong> - Remember your settings
                            </span>
                        </label>
                    </div>
                </div>
                
                <div class="cookie-consent-actions">
                    <button class="btn btn-outline-secondary btn-sm" id="reject-all">
                        Reject All
                    </button>
                    <button class="btn btn-primary btn-sm" id="accept-selected">
                        Accept Selected
                    </button>
                    <button class="btn btn-success btn-sm" id="accept-all">
                        Accept All
                    </button>
                </div>
            </div>
        `;

        // Add banner to page
        document.body.appendChild(banner);

        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        document.getElementById('accept-all').addEventListener('click', () => {
            this.acceptAll();
        });

        document.getElementById('accept-selected').addEventListener('click', () => {
            this.acceptSelected();
        });

        document.getElementById('reject-all').addEventListener('click', () => {
            this.rejectAll();
        });
    }

    acceptAll() {
        const preferences = { ...this.defaultPreferences };
        preferences.analytics = true;
        preferences.marketing = true;
        preferences.preferences = true;
        
        this.saveConsent(preferences);
        this.hideBanner();
    }

    acceptSelected() {
        const preferences = { ...this.defaultPreferences };
        preferences.analytics = document.getElementById('analytics-consent').checked;
        preferences.marketing = document.getElementById('marketing-consent').checked;
        preferences.preferences = document.getElementById('preferences-consent').checked;
        
        this.saveConsent(preferences);
        this.hideBanner();
    }

    rejectAll() {
        this.saveConsent(this.defaultPreferences);
        this.hideBanner();
    }

    saveConsent(preferences) {
        // Save consent timestamp
        localStorage.setItem(this.consentKey, new Date().toISOString());
        
        // Save preferences
        localStorage.setItem(this.preferencesKey, JSON.stringify(preferences));
        
        // Apply preferences
        this.applyPreferences(preferences);
        
        // Trigger consent event
        this.triggerConsentEvent(preferences);
    }

    applyPreferences(preferences) {
        // Apply analytics preferences
        if (preferences.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }

        // Apply marketing preferences
        if (preferences.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }

        // Apply preference cookies
        if (preferences.preferences) {
            this.enablePreferences();
        } else {
            this.disablePreferences();
        }
    }

    enableAnalytics() {
        // Enable Google Analytics or other analytics tools
        console.log('Analytics enabled');
        // Add your analytics code here
    }

    disableAnalytics() {
        // Disable analytics
        console.log('Analytics disabled');
        // Remove analytics code here
    }

    enableMarketing() {
        // Enable marketing tools
        console.log('Marketing enabled');
        // Add marketing tools here
    }

    disableMarketing() {
        // Disable marketing
        console.log('Marketing disabled');
        // Remove marketing tools here
    }

    enablePreferences() {
        // Enable preference storage
        console.log('Preferences enabled');
        // Enable preference storage here
    }

    disablePreferences() {
        // Disable preference storage
        console.log('Preferences disabled');
        // Disable preference storage here
    }

    triggerConsentEvent(preferences) {
        // Dispatch custom event for other components
        const event = new CustomEvent('cookieConsentChanged', {
            detail: { preferences }
        });
        document.dispatchEvent(event);
    }

    hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.opacity = '0';
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }

    loadPreferences() {
        const preferences = localStorage.getItem(this.preferencesKey);
        if (preferences) {
            this.applyPreferences(JSON.parse(preferences));
        }
    }

    // Method to update preferences later
    updatePreferences(newPreferences) {
        const currentPreferences = JSON.parse(localStorage.getItem(this.preferencesKey) || '{}');
        const updatedPreferences = { ...currentPreferences, ...newPreferences };
        
        this.saveConsent(updatedPreferences);
    }

    // Method to withdraw consent
    withdrawConsent() {
        localStorage.removeItem(this.consentKey);
        localStorage.removeItem(this.preferencesKey);
        
        // Reset to default state
        this.applyPreferences(this.defaultPreferences);
        
        // Show banner again
        this.showConsentBanner();
    }

    // Get current preferences
    getPreferences() {
        const preferences = localStorage.getItem(this.preferencesKey);
        return preferences ? JSON.parse(preferences) : this.defaultPreferences;
    }
}

// Initialize cookie consent when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cookieConsent = new CookieConsent();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookieConsent;
}
