/* ===== PORTFOLIO CONSOLIDATED JAVASCRIPT - DYNAMIC JSON-BASED ===== */

class PortfolioManager {
    constructor() {
        this.portfolioData = null;
        this.isDarkMode = false;
        this.isMobile = window.innerWidth < 992;
        
        this.init();
    }

    async init() {
        console.log('PortfolioManager: Initializing...');
        try {
            await this.loadPortfolioData();
            this.setupEventListeners();
            this.initializeThemeToggle();
            this.populatePortfolio();
            this.initializeAnimations();
            this.setupMobileNavigation();
        } catch (error) {
            console.error('Failed to initialize portfolio:', error);
            this.showError('Failed to load portfolio data. Please refresh the page.');
        }
    }

    async loadPortfolioData() {
        try {
            const response = await fetch('data/portfolio-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.portfolioData = await response.json();
            console.log('Portfolio data loaded successfully:', this.portfolioData);
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            throw error;
        }
    }

    populatePortfolio() {
        if (!this.portfolioData) return;

        // Populate navbar
        this.populateNavbar();
        
        // Populate all sections
        this.populateAbout();
        this.populateExperience();
        this.populateEducation();
        this.populateSkills();
        this.populateProjects();
        this.populateCertifications();
        this.populateInterests();
        this.populateAwards();
        this.populateContact();
    }

    populateNavbar() {
        const { personal } = this.portfolioData;
        
        // Update navbar name and profile image
        const navbarName = document.getElementById('navbar-name');
        const navbarProfileImg = document.getElementById('navbar-profile-img');
        
        if (navbarName) navbarName.textContent = personal.name;
        if (navbarProfileImg) {
            navbarProfileImg.src = personal.profileImage;
            navbarProfileImg.alt = `${personal.name} Profile`;
        }
    }

    populateAbout() {
        const { personal, social } = this.portfolioData;
        
        // Update profile section
        const profileImage = document.getElementById('profile-image');
        const profileName = document.getElementById('profile-name');
        const profileTitle = document.getElementById('profile-title');
        const profileTagline = document.getElementById('profile-tagline');
        const profileSummary = document.getElementById('profile-summary');
        const socialLinks = document.getElementById('social-links');
        
        if (profileImage) {
            profileImage.src = personal.profileImage;
            profileImage.alt = `${personal.name} Profile`;
        }
        if (profileName) profileName.textContent = personal.name;
        if (profileTitle) profileTitle.textContent = personal.title;
        if (profileTagline) profileTagline.textContent = personal.tagline;
        if (profileSummary) profileSummary.textContent = personal.summary;
        
        // Populate social links
        if (socialLinks) {
            socialLinks.innerHTML = social.map(socialItem => `
                <li>
                    <a href="${socialItem.url}" target="_blank" aria-label="${socialItem.name}" 
                       style="background: ${socialItem.color}">
                        <i class="${socialItem.icon}"></i>
                    </a>
                </li>
            `).join('');
        }
    }

    populateExperience() {
        const { experience } = this.portfolioData;
        const experienceContent = document.getElementById('experience-content');
        
        if (experienceContent) {
            experienceContent.innerHTML = experience.map(exp => `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <h3 class="timeline-title">${exp.title}</h3>
                        <p class="timeline-subtitle">${exp.company} - ${exp.location}</p>
                        <p class="timeline-date">${exp.period}</p>
                        <p class="timeline-description">${exp.description}</p>
                        
                        ${exp.technologies ? `
                            <div class="mb-3">
                                <strong>Technologies:</strong>
                                <span class="badge bg-primary me-1">${exp.technologies.join('</span><span class="badge bg-primary me-1">')}</span>
                            </div>
                        ` : ''}
                        
                        ${exp.achievements ? `
                            <div class="achievements">
                                <strong>Key Achievements:</strong>
                                <ul class="mt-2">
                                    ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        }
    }

    populateEducation() {
        const { education } = this.portfolioData;
        const educationContent = document.getElementById('education-content');
        
        if (educationContent) {
            educationContent.innerHTML = education.map(edu => `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <h3 class="timeline-title">${edu.degree}</h3>
                        <p class="timeline-subtitle">${edu.school} - ${edu.location}</p>
                        <p class="timeline-date">${edu.period} (GPA: ${edu.gpa})</p>
                        <p class="timeline-description">${edu.description}</p>
                        
                        ${edu.relevantCourses ? `
                            <div class="mt-3">
                                <strong>Relevant Courses:</strong>
                                <p class="mb-0">${edu.relevantCourses.join(', ')}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        }
    }

    populateSkills() {
        const { skills } = this.portfolioData;
        const skillsContent = document.getElementById('skills-content');
        
        if (skillsContent) {
            skillsContent.innerHTML = skills.map(skillCategory => `
                <div class="skill-category mb-4">
                    <h3 class="h4 mb-3">${skillCategory.category}</h3>
                    <div class="row">
                        ${skillCategory.items.map(skill => `
                            <div class="col-md-6 col-lg-4 mb-3">
                                <div class="skill-item">
                                    <h4 class="skill-name">${skill.name}</h4>
                                    <p class="skill-level">${skill.level}%</p>
                                    <div class="skill-progress" style="--skill-level: ${skill.level}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }
    }

    populateProjects() {
        const { projects } = this.portfolioData;
        const projectsContent = document.getElementById('projects-content');
        
        if (projectsContent) {
            projectsContent.innerHTML = `
                <div class="row">
                    ${projects.map(project => `
                        <div class="col-lg-4 col-md-6 mb-4">
                            <div class="resume-card project-card">
                                <div class="card-header">
                                    <h3 class="card-title">${project.name}</h3>
                                </div>
                                <div class="card-content">
                                    <p class="mb-3">${project.description}</p>
                                    
                                    <div class="mb-3">
                                        <strong>Technologies:</strong>
                                        <span class="badge bg-primary me-1">${project.technologies.join('</span><span class="badge bg-primary me-1">')}</span>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <strong>Highlights:</strong>
                                        <ul class="mt-2">
                                            ${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                                        </ul>
                                    </div>
                                    
                                    <a href="${project.url}" target="_blank" class="btn btn-primary btn-sm">
                                        <i class="fa fa-external-link me-2"></i>View Project
                                    </a>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    populateCertifications() {
        const { certifications } = this.portfolioData;
        const certificationsContent = document.getElementById('certifications-content');
        
        if (certificationsContent) {
            certificationsContent.innerHTML = `
                <div class="row">
                    ${certifications.map(cert => `
                        <div class="col-lg-6 col-md-6 mb-4">
                            <div class="certification-item">
                                <h4 class="certification-title">${cert.name}</h4>
                                <p class="certification-issuer">${cert.issuer}</p>
                                <p class="certification-date">${cert.date}</p>
                                <p class="mb-3">${cert.description}</p>
                                <a href="${cert.url}" target="_blank" class="btn btn-outline-primary btn-sm">
                                    <i class="fa fa-external-link me-2"></i>Learn More
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    populateInterests() {
        const { interests } = this.portfolioData;
        const interestsContent = document.getElementById('interests-content');
        
        if (interestsContent) {
            interestsContent.innerHTML = `
                <div class="row">
                    ${interests.map(interest => `
                        <div class="col-md-6 col-lg-4 mb-3">
                            <div class="interest-item text-center p-3">
                                <i class="fa fa-heart fa-2x text-primary mb-2"></i>
                                <h4>${interest}</h4>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    populateAwards() {
        const { awards } = this.portfolioData;
        const awardsContent = document.getElementById('awards-content');
        
        if (awardsContent) {
            awardsContent.innerHTML = `
                <div class="row">
                    ${awards.map(award => `
                        <div class="col-lg-6 col-md-6 mb-4">
                            <div class="award-item text-center p-4">
                                <i class="fa fa-trophy fa-3x text-warning mb-3"></i>
                                <h4 class="mb-2">${award.title}</h4>
                                <p class="text-primary mb-2"><strong>${award.issuer}</strong></p>
                                <p class="text-muted mb-2">${award.date}</p>
                                <p class="mb-0">${award.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    populateContact() {
        const { contact } = this.portfolioData;
        const contactContent = document.getElementById('contact-content');
        
        if (contactContent) {
            contactContent.innerHTML = `
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="contact-info text-center">
                            <div class="row">
                                <div class="col-md-6 mb-4">
                                    <div class="contact-item">
                                        <i class="fa fa-envelope fa-2x text-primary mb-3"></i>
                                        <h5>Email</h5>
                                        <p><a href="mailto:${contact.email}">${contact.email}</a></p>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-4">
                                    <div class="contact-item">
                                        <i class="fa fa-phone fa-2x text-primary mb-3"></i>
                                        <h5>Phone</h5>
                                        <p><a href="tel:${contact.phone}">${contact.phone}</a></p>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-4">
                                    <div class="contact-item">
                                        <i class="fa fa-map-marker fa-2x text-primary mb-3"></i>
                                        <h5>Location</h5>
                                        <p>${contact.location}</p>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-4">
                                    <div class="contact-item">
                                        <i class="fa fa-globe fa-2x text-primary mb-3"></i>
                                        <h5>Website</h5>
                                        <p><a href="${contact.website}" target="_blank">${contact.website}</a></p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="social-links mt-4">
                                <h5 class="mb-3">Connect With Me</h5>
                                <div class="list-social-icons">
                                    ${this.portfolioData.social.map(socialItem => `
                                        <li>
                                            <a href="${socialItem.url}" target="_blank" aria-label="${socialItem.name}" 
                                               style="background: ${socialItem.color}">
                                                <i class="${socialItem.icon}"></i>
                                            </a>
                                        </li>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    initializeThemeToggle() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            // Load saved theme
            const savedTheme = localStorage.getItem('theme') || 'light';
            this.applyTheme(savedTheme);
            
            darkModeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }
    }

    applyTheme(theme) {
        this.isDarkMode = theme === 'dark';
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeToggleButton();
    }

    toggleDarkMode() {
        const newTheme = this.isDarkMode ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    updateThemeToggleButton() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('i');
            if (this.isDarkMode) {
                icon.className = 'fa fa-sun-o';
                darkModeToggle.title = 'Switch to Light Mode';
            } else {
                icon.className = 'fa fa-moon-o';
                darkModeToggle.title = 'Switch to Dark Mode';
            }
        }
    }

    initializeAnimations() {
        // Add fade-in animation to elements
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-element', 'visible');
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('.resume-section').forEach(section => {
            observer.observe(section);
        });
    }

    setupMobileNavigation() {
        // Close mobile menu when clicking on links
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger m-3';
        errorDiv.innerHTML = `
            <i class="fa fa-exclamation-triangle me-2"></i>
            ${message}
        `;
        document.body.insertBefore(errorDiv, document.body.firstChild);
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioManager();
});
