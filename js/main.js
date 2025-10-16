/**
 * KEM Logistics - Main JavaScript
 * Modern ES6+ JavaScript with best practices
 */

'use strict';

// ===================================
// Mobile Navigation Toggle
// ===================================

const initMobileMenu = () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!mobileMenuToggle || !navLinks) return;

    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';

        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinkItems = navLinks.querySelectorAll('a');
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!mobileMenuToggle.contains(event.target) && !navLinks.contains(event.target)) {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });
};

// ===================================
// Smooth Scrolling for Anchor Links
// ===================================

const initSmoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#' || href === '#login') return;

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();

                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ===================================
// Tracking Form Functionality
// ===================================

const initTrackingForm = () => {
    const trackingForm = document.querySelector('.tracking-form');
    const trackingInput = document.getElementById('tracking-input');
    const trackingResult = document.querySelector('.tracking-result');

    if (!trackingForm || !trackingInput || !trackingResult) return;

    trackingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const trackingNumber = trackingInput.value.trim();

        if (!trackingNumber) {
            showError(trackingResult, 'Please enter a tracking number');
            return;
        }

        // Validate tracking number format (basic validation)
        if (trackingNumber.length < 8) {
            showError(trackingResult, 'Invalid tracking number format. Please check and try again.');
            return;
        }

        // Show loading state
        showLoading(trackingResult);

        // Call backend API
        handleTrackingRequest(trackingResult, trackingNumber);
    });
};

const showLoading = (container) => {
    container.innerHTML = `
        <div class="tracking-card">
            <div style="text-align: center; padding: 2rem;">
                <div class="loading"></div>
                <p style="margin-top: 1rem; color: var(--text-medium);">Retrieving shipment information...</p>
            </div>
        </div>
    `;
    container.classList.add('active');
};

const showError = (container, message) => {
    container.innerHTML = `
        <div class="tracking-card" style="border-left: 4px solid var(--error-color);">
            <p style="color: var(--error-color); font-weight: 600;">${message}</p>
        </div>
    `;
    container.classList.add('active');
};

// Handle tracking API request
const handleTrackingRequest = async (container, trackingNumber) => {
    try {
        const response = await API.tracking.trackShipment(trackingNumber);

        if (response.success && response.shipment) {
            displayTrackingResult(container, response.shipment);
        } else {
            showError(container, 'Shipment not found. Please check your tracking number and try again.');
        }
    } catch (error) {
        console.error('Tracking error:', error);
        showError(container, 'Unable to retrieve tracking information. Please try again later.');
    }
};

const displayTrackingResult = (container, shipment) => {
    // Format status text
    const statusTextMap = {
        'pending': 'Pending Pickup',
        'picked_up': 'Picked Up',
        'in_transit': 'In Transit',
        'out_for_delivery': 'Out for Delivery',
        'delivered': 'Delivered',
        'delayed': 'Delayed',
        'cancelled': 'Cancelled'
    };

    const statusText = statusTextMap[shipment.status] || shipment.status;

    // Format dates
    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const trackingData = {
        number: shipment.trackingNumber,
        status: shipment.status,
        statusText: statusText,
        origin: `${shipment.origin.city}, ${shipment.origin.state}`,
        destination: `${shipment.destination.city}, ${shipment.destination.state}`,
        estimatedDelivery: formatDate(shipment.estimatedDelivery),
        timeline: shipment.timeline.map(item => ({
            date: formatDate(item.timestamp),
            location: item.location,
            description: item.status,
            completed: true
        }))
    };

    const timelineHTML = trackingData.timeline.map(item => `
        <div class="timeline-item ${item.completed ? 'completed' : ''}">
            <div class="timeline-date">${item.date}</div>
            <div class="timeline-location">${item.location}</div>
            <div style="color: var(--text-medium); margin-top: 4px;">${item.description}</div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="tracking-card">
            <div class="tracking-header">
                <div>
                    <div style="color: var(--text-medium); font-size: 0.875rem; margin-bottom: 4px;">Tracking Number</div>
                    <div class="tracking-number">${trackingData.number}</div>
                </div>
                <span class="tracking-status ${trackingData.status}">${trackingData.statusText}</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                    <div style="font-weight: 600; margin-bottom: 4px;">Origin</div>
                    <div style="color: var(--text-medium);">${trackingData.origin}</div>
                </div>
                <div>
                    <div style="font-weight: 600; margin-bottom: 4px;">Destination</div>
                    <div style="color: var(--text-medium);">${trackingData.destination}</div>
                </div>
                <div>
                    <div style="font-weight: 600; margin-bottom: 4px;">Est. Delivery</div>
                    <div style="color: var(--success-color); font-weight: 600;">${trackingData.estimatedDelivery}</div>
                </div>
            </div>

            <div class="tracking-timeline">
                <h4 style="margin-bottom: 1rem;">Tracking History</h4>
                ${timelineHTML}
            </div>
        </div>
    `;

    container.classList.add('active');
};

// ===================================
// Quote Form Functionality
// ===================================

const initQuoteForm = () => {
    const quoteForm = document.querySelector('.quote-form');
    const quoteResult = document.querySelector('.quote-result');

    if (!quoteForm || !quoteResult) return;

    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(quoteForm);
        const data = Object.fromEntries(formData.entries());

        // Validate required fields
        const requiredFields = ['name', 'email', 'phone', 'origin', 'destination', 'service', 'weight'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            showQuoteError(quoteResult, 'Please fill in all required fields');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showQuoteError(quoteResult, 'Please enter a valid email address');
            return;
        }

        // Show loading state
        showQuoteLoading(quoteResult);

        // Call backend API
        handleQuoteRequest(quoteResult, data, quoteForm);
    });
};

const showQuoteLoading = (container) => {
    container.innerHTML = `
        <div class="quote-result-card">
            <div style="text-align: center; padding: 2rem;">
                <div class="loading"></div>
                <p style="margin-top: 1rem; color: var(--text-medium);">Calculating your quote...</p>
            </div>
        </div>
    `;
    container.classList.add('active');
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

const showQuoteError = (container, message) => {
    container.innerHTML = `
        <div class="quote-result-card" style="border-left: 4px solid var(--error-color);">
            <p style="color: var(--error-color); font-weight: 600;">${message}</p>
        </div>
    `;
    container.classList.add('active');
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

// Handle quote API request
const handleQuoteRequest = async (container, formData, form) => {
    try {
        // Map form data to API format
        const quoteData = {
            customerInfo: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                company: formData.company || ''
            },
            serviceType: formData.service.toUpperCase(),
            origin: {
                city: formData.origin.split(',')[0].trim(),
                state: formData.origin.split(',')[1]?.trim() || 'GA',
                zipCode: '00000'
            },
            destination: {
                city: formData.destination.split(',')[0].trim(),
                state: formData.destination.split(',')[1]?.trim() || 'GA',
                zipCode: '00000'
            },
            cargo: {
                weight: parseFloat(formData.weight),
                description: formData.cargo || 'General cargo'
            },
            notes: formData.notes || ''
        };

        const response = await API.quotes.createQuote(quoteData);

        if (response.success && response.quote) {
            displayQuoteResult(container, response.quote);
            form.reset();
        } else {
            showQuoteError(container, 'Unable to generate quote. Please try again.');
        }
    } catch (error) {
        console.error('Quote error:', error);
        showQuoteError(container, error.message || 'Unable to generate quote. Please try again later.');
    }
};

const displayQuoteResult = (container, quote) => {
    const estimatedCost = quote.estimatedPrice ? quote.estimatedPrice.total : 0;

    container.innerHTML = `
        <div class="quote-result-card">
            <h3 style="color: var(--success-color); margin-bottom: 1rem;">Quote Generated Successfully!</h3>

            <div style="background: var(--background-light); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                <div style="color: var(--text-medium); margin-bottom: 0.5rem;">Quote Number</div>
                <div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">${quote.quoteNumber}</div>

                <div style="color: var(--text-medium); margin-bottom: 0.5rem;">Estimated Cost</div>
                <div class="quote-price">$${estimatedCost.toLocaleString()}</div>
                <div style="color: var(--text-medium); font-size: 0.875rem;">*Final price may vary based on actual dimensions and additional services</div>
            </div>

            <div style="display: grid; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: 0.5rem;">
                    <strong>Service Type:</strong>
                    <span>${quote.serviceType}</span>
                </div>
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: 0.5rem;">
                    <strong>Route:</strong>
                    <span>${quote.origin.city}, ${quote.origin.state} → ${quote.destination.city}, ${quote.destination.state}</span>
                </div>
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: 0.5rem;">
                    <strong>Weight:</strong>
                    <span>${quote.cargo.weight} lbs</span>
                </div>
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: 0.5rem;">
                    <strong>Contact:</strong>
                    <span>${quote.customerInfo.name} (${quote.customerInfo.email})</span>
                </div>
            </div>

            <div style="background: #e3f2fd; padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1rem;">
                <strong style="color: #1565c0;">What's Next?</strong>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem; color: var(--text-medium);">
                    <li>Our team will review your quote within 2 hours</li>
                    <li>You'll receive a detailed proposal via email</li>
                    <li>A dedicated account manager will contact you</li>
                </ul>
            </div>

            <p style="text-align: center; color: var(--text-medium);">
                Questions? Call us at <a href="tel:+14708363519" style="color: var(--accent-color); font-weight: 600;">1-470-836-3519</a>
            </p>
        </div>
    `;

    container.classList.add('active');
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

// ===================================
// Contact Form Functionality
// ===================================

const initContactForm = () => {
    const contactForm = document.querySelector('.contact-form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Validate required fields
        if (!data.name || !data.email || !data.subject || !data.message) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Call backend API
        handleContactSubmission(contactForm, data);
    });
};

// Handle contact form API request
const handleContactSubmission = async (form, data) => {
    try {
        const contactData = {
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            company: data.company || '',
            subject: data.subject,
            message: data.message
        };

        const response = await API.contact.submitContact(contactData);

        if (response.success) {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.style.cssText = `
                background-color: var(--success-color);
                color: white;
                padding: 1rem;
                border-radius: var(--radius-sm);
                margin-top: 1rem;
                text-align: center;
                font-weight: 600;
            `;
            successMessage.textContent = response.message || 'Thank you for contacting us! We\'ll respond within 24 hours.';

            form.insertAdjacentElement('afterend', successMessage);
            form.reset();

            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        } else {
            alert('Unable to send message. Please try again.');
        }
    } catch (error) {
        console.error('Contact error:', error);
        alert(error.message || 'Unable to send message. Please try again later.');
    }
};

// ===================================
// Scroll Animations
// ===================================

const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .stat-item');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
};

// ===================================
// Header Scroll Effect
// ===================================

const initHeaderScroll = () => {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = 'var(--shadow-lg)';
        } else {
            header.style.boxShadow = 'var(--shadow-md)';
        }

        lastScroll = currentScroll;
    });
};

// ===================================
// Form Input Enhancements
// ===================================

const initFormEnhancements = () => {
    // Auto-format phone numbers
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }

            e.target.value = value;
        });
    });

    // Add floating label effect
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');

        if (input) {
            input.addEventListener('focus', () => {
                group.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    group.classList.remove('focused');
                }
            });
        }
    });
};

// ===================================
// Initialize All Features
// ===================================

const init = () => {
    // Check if DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
};

const initializeApp = () => {
    console.log('KEM Logistics website initialized');

    // Initialize all modules
    initMobileMenu();
    initSmoothScroll();
    initTrackingForm();
    initQuoteForm();
    initContactForm();
    initScrollAnimations();
    initHeaderScroll();
    initFormEnhancements();
};

// Start the application
init();

// ===================================
// Utility Functions
// ===================================

// Debounce function for performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        debounce
    };
}
