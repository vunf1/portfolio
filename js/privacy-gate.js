/**
 * Privacy Gate Component
 * Controls access to sensitive personal information based on user consent
 * Ensures GDPR compliance for data processing
 * Now only triggers when users attempt to access contact information
 */
class PrivacyGate {
    constructor() {
        this.consentKey = 'portfolio_data_consent';
        this.sensitiveContentClass = 'privacy-gated';
        this.consentFormId = 'privacy-consent-form';
        this.init();
    }

    init() {
        // Check if user has already given consent
        if (this.hasDataConsent()) {
            this.revealSensitiveContent();
        } else {
            // Hide sensitive content initially
            this.hideSensitiveContent();
            // Set up click listeners for contact information
            this.setupContactListeners();
        }

        // Listen for consent changes
        document.addEventListener('cookieConsentChanged', (event) => {
            if (event.detail.preferences.preferences) {
                this.enablePreferences();
            }
        });
    }

    setupContactListeners() {
        // Listen for clicks on contact information
        document.addEventListener('click', (e) => {
            // Check if clicking on email links
            if (e.target.matches('a[href^="mailto:"]') || e.target.closest('a[href^="mailto:"]')) {
                e.preventDefault();
                this.showPrivacyGate();
                return;
            }
            
            // Check if clicking on phone links
            if (e.target.matches('a[href^="tel:"]') || e.target.closest('a[href^="tel:"]')) {
                e.preventDefault();
                this.showPrivacyGate();
                return;
            }
            
            // Check if clicking on contact information elements
            if (e.target.matches('.phone-number, .email-address') || 
                e.target.closest('.phone-number, .email-address')) {
                e.preventDefault();
                this.showPrivacyGate();
                return;
            }
        });

        // Also listen for hover on contact information to show a hint
        document.addEventListener('mouseenter', (e) => {
            if (e.target && e.target.matches && e.target.matches('a[href^="mailto:"], a[href^="tel:"], .phone-number, .email-address') ||
                e.target && e.target.closest && e.target.closest('a[href^="mailto:"], a[href^="tel:"], .phone-number, .email-address')) {
                this.showContactHint(e.target);
            }
        }, true);
    }

    showContactHint(element) {
        // Remove existing hints
        document.querySelectorAll('.contact-hint').forEach(hint => hint.remove());
        
        // Create hint tooltip
        const hint = document.createElement('div');
        hint.className = 'contact-hint';
        hint.innerHTML = `
            <div class="hint-content">
                <span class="hint-icon">🔒</span>
                <span class="hint-text">Click to access contact information</span>
            </div>
        `;
        
        // Position hint near the element
        const rect = element.getBoundingClientRect();
        hint.style.position = 'fixed';
        hint.style.top = `${rect.bottom + 5}px`;
        hint.style.left = `${rect.left}px`;
        hint.style.zIndex = '1000';
        
        document.body.appendChild(hint);
        
        // Auto-remove hint after 3 seconds
        setTimeout(() => {
            if (hint.parentNode) {
                hint.remove();
            }
        }, 3000);
    }

    hasDataConsent() {
        return localStorage.getItem(this.consentKey) !== null;
    }

    showPrivacyGate() {
        // Hide any existing hints
        document.querySelectorAll('.contact-hint').forEach(hint => hint.remove());

        // Create privacy gate overlay
        const overlay = document.createElement('div');
        overlay.id = 'privacy-gate-overlay';
        overlay.className = 'privacy-gate-overlay';
        overlay.innerHTML = `
            <div class="privacy-gate-content">
                <div class="privacy-gate-header">
                    <div class="privacy-icon">🔒</div>
                    <h2>Privacy & Data Consent</h2>
                    <p>To access my contact information (email, phone), I need your consent to process your data in accordance with GDPR regulations.</p>
                </div>

                <form id="${this.consentFormId}" class="privacy-consent-form">
                    <div class="form-group">
                        <label for="user-name" class="form-label">Full Name *</label>
                        <input type="text" id="user-name" name="name" class="form-control" required 
                               placeholder="Enter your full name">
                        <div class="invalid-feedback">Please provide your full name.</div>
                    </div>

                    <div class="form-group">
                        <label for="user-email" class="form-label">Email Address *</label>
                        <input type="email" id="user-email" name="email" class="form-control" required 
                               placeholder="Enter your email address">
                        <div class="invalid-feedback">Please provide a valid email address.</div>
                    </div>

                    <div class="form-group">
                        <label for="user-phone" class="form-label">Phone Number (Optional)</label>
                        <input type="tel" id="user-phone" name="phone" class="form-control" 
                               placeholder="+1 (555) 123-4567">
                        <small class="form-text text-muted">E.164 format recommended for international calls</small>
                    </div>

                    <div class="form-group">
                        <label for="user-company" class="form-label">Company/Organization (Optional)</label>
                        <input type="text" id="user-company" name="company" class="form-control" 
                               placeholder="Your company or organization">
                    </div>

                    <div class="form-group">
                        <label for="consent-purpose" class="form-label">Purpose of Contact *</label>
                        <select id="consent-purpose" name="purpose" class="form-control" required>
                            <option value="">Select a purpose</option>
                            <option value="job-opportunity">Job Opportunity</option>
                            <option value="project-collaboration">Project Collaboration</option>
                            <option value="business-inquiry">Business Inquiry</option>
                            <option value="networking">Professional Networking</option>
                            <option value="other">Other</option>
                        </select>
                        <div class="invalid-feedback">Please select a purpose.</div>
                    </div>

                    <div class="form-group">
                        <div class="form-check">
                            <input type="checkbox" id="data-processing-consent" name="dataConsent" 
                                   class="form-check-input" required>
                            <label class="form-check-label" for="data-processing-consent">
                                I consent to the processing of my personal data for the purpose specified above. 
                                I understand that my data will be processed in accordance with the 
                                <a href="privacy-policy.html" target="_blank">Privacy Policy</a>.
                            </label>
                            <div class="invalid-feedback">You must consent to data processing to continue.</div>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="form-check">
                            <input type="checkbox" id="marketing-consent" name="marketingConsent" 
                                   class="form-check-input">
                            <label class="form-check-label" for="marketing-consent">
                                I agree to receive occasional updates about new projects, skills, or professional opportunities 
                                (you can unsubscribe at any time).
                            </label>
                        </div>
                    </div>

                    <div class="privacy-consent-actions">
                        <button type="submit" class="btn btn-primary btn-lg">
                            <span class="btn-text">Grant Access & View Contact Info</span>
                            <span class="btn-loading d-none">
                                <span class="spinner-border spinner-border-sm me-2"></span>
                                Processing...
                            </span>
                        </button>
                    </div>

                    <div class="privacy-notice">
                        <small class="text-muted">
                            <strong>Data Protection Notice:</strong> Your personal data will be processed securely and only 
                            used for the purposes you've consented to. You have the right to withdraw consent, access, 
                            rectify, or delete your data at any time. Contact details are provided in our 
                            <a href="privacy-policy.html" target="_blank">Privacy Policy</a>.
                        </small>
                    </div>
                </form>
            </div>
        `;

        // Add overlay to page
        document.body.appendChild(overlay);

        // Add form event listeners
        this.addFormEventListeners();
    }

    addFormEventListeners() {
        const form = document.getElementById(this.consentFormId);
        const inputs = form.querySelectorAll('input, select');

        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Form submission
        form.addEventListener('submit', (e) => this.handleFormSubmission(e));
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Remove existing error styling
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'This field is required.');
            isValid = false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address.');
                isValid = false;
            }
        }

        // Phone validation (if provided)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                this.showFieldError(field, 'Please enter a valid phone number.');
                isValid = false;
            }
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
        }
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = '';
        }
    }

    async handleFormSubmission(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Validate all fields
        const inputs = form.querySelectorAll('input, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }

        // Show loading state
        btnText.classList.add('d-none');
        btnLoading.classList.remove('d-none');
        submitBtn.disabled = true;

        try {
            // Collect form data
            const formData = new FormData(form);
            const userData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                company: formData.get('company'),
                purpose: formData.get('purpose'),
                dataConsent: formData.get('dataConsent') === 'on',
                marketingConsent: formData.get('marketingConsent') === 'on',
                timestamp: new Date().toISOString(),
                ipAddress: await this.getClientIP()
            };

            // Store consent and user data
            this.storeUserConsent(userData);

            // Hide privacy gate
            this.hidePrivacyGate();

            // Reveal sensitive content
            this.revealSensitiveContent();

            // Show success message
            this.showSuccessMessage(userData);

        } catch (error) {
            console.error('Error processing form:', error);
            this.showErrorMessage('An error occurred while processing your request. Please try again.');
        } finally {
            // Reset button state
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
            submitBtn.disabled = false;
        }
    }

    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'Unknown';
        }
    }

    storeUserConsent(userData) {
        // Store consent timestamp
        localStorage.setItem(this.consentKey, new Date().toISOString());
        
        // Store user data (encrypted in production)
        localStorage.setItem('portfolio_user_data', JSON.stringify(userData));
        
        // Store consent preferences
        const consentPreferences = {
            dataProcessing: userData.dataConsent,
            marketing: userData.marketingConsent,
            timestamp: userData.timestamp
        };
        localStorage.setItem('portfolio_consent_preferences', JSON.stringify(consentPreferences));
    }

    hidePrivacyGate() {
        const overlay = document.getElementById('privacy-gate-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }

    revealSensitiveContent() {
        // Only reveal contact information elements
        const gatedElements = document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"], .phone-number, .email-address');
        gatedElements.forEach(element => {
            element.classList.remove('privacy-gated');
            element.style.filter = 'none';
            element.style.pointerEvents = 'auto';
        });
    }

    hideSensitiveContent() {
        // Only hide contact information elements, not all portfolio content
        const gatedElements = document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"], .phone-number, .email-address');
        gatedElements.forEach(element => {
            element.classList.add('privacy-gated');
            element.style.filter = 'blur(10px)';
            element.style.pointerEvents = 'none';
        });
    }

    showSuccessMessage(userData) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'privacy-success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">✅</div>
                <div class="notification-text">
                    <h4>Access Granted!</h4>
                    <p>Thank you, ${userData.name}! Your portfolio is now fully accessible. 
                    Welcome to my professional showcase.</p>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    showErrorMessage(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'privacy-error-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">❌</div>
                <div class="notification-text">
                    <h4>Error</h4>
                    <p>${message}</p>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Method to withdraw consent
    withdrawConsent() {
        localStorage.removeItem(this.consentKey);
        localStorage.removeItem('portfolio_user_data');
        localStorage.removeItem('portfolio_consent_preferences');
        
        // Hide sensitive content
        this.hideSensitiveContent();
        
        // Show privacy gate again
        this.showPrivacyGate();
    }

    // Method to get current user data
    getUserData() {
        const userData = localStorage.getItem('portfolio_user_data');
        return userData ? JSON.parse(userData) : null;
    }

    // Method to check if user has specific consent
    hasConsent(consentType) {
        const preferences = localStorage.getItem('portfolio_consent_preferences');
        if (!preferences) return false;
        
        const consent = JSON.parse(preferences);
        return consent[consentType] || false;
    }
}

// Initialize privacy gate when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.privacyGate = new PrivacyGate();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrivacyGate;
}
