# CLAUDE.md - Code Review & Maintenance Guide

This document provides guidance for code review, maintenance, and future development of the KEM Logistics website.

---

## Table of Contents

1. [Code Review Checklist](#code-review-checklist)
2. [Architecture Overview](#architecture-overview)
3. [Coding Standards](#coding-standards)
4. [Accessibility Guidelines](#accessibility-guidelines)
5. [Performance Guidelines](#performance-guidelines)
6. [Security Best Practices](#security-best-practices)
7. [Common Maintenance Tasks](#common-maintenance-tasks)
8. [Testing Guidelines](#testing-guidelines)
9. [Known Limitations](#known-limitations)
10. [Future Improvements](#future-improvements)

---

## Code Review Checklist

Use this checklist when reviewing code changes:

### HTML Review

- [ ] All HTML is semantic and properly structured
- [ ] ARIA labels are used correctly for accessibility
- [ ] All images have descriptive `alt` text
- [ ] All form inputs have associated `<label>` elements
- [ ] IDs are unique across the page
- [ ] No inline styles (use CSS classes instead)
- [ ] Meta tags are present and accurate
- [ ] Links have descriptive text (not "click here")
- [ ] Heading hierarchy is logical (h1 → h2 → h3, no skipping)

### CSS Review

- [ ] Styles use CSS custom properties (variables) from `:root`
- [ ] No `!important` flags (unless absolutely necessary)
- [ ] Responsive breakpoints are consistent
- [ ] Colors meet WCAG contrast requirements
- [ ] Animations use `transform` and `opacity` for performance
- [ ] No hardcoded values (use variables)
- [ ] Mobile-first approach is maintained
- [ ] CSS is organized by component with clear comments
- [ ] No unused CSS rules
- [ ] Vendor prefixes are added where needed

### JavaScript Review

- [ ] Code follows ES6+ standards
- [ ] Variables use `const` or `let` (no `var`)
- [ ] Functions are modular and single-purpose
- [ ] Event listeners are properly attached
- [ ] No memory leaks (remove event listeners when needed)
- [ ] Error handling is implemented
- [ ] User input is validated
- [ ] No `console.log` statements in production code
- [ ] Code is commented for complex logic
- [ ] Accessibility features work with JavaScript disabled (progressive enhancement)

### Accessibility Review

- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators are visible
- [ ] ARIA attributes are used correctly
- [ ] Color contrast meets WCAG AA standards (4.5:1 for normal text)
- [ ] Forms have proper labels and error messages
- [ ] Screen reader testing completed
- [ ] Skip to main content link is present
- [ ] All interactive elements have accessible names

### Performance Review

- [ ] Images are optimized and compressed
- [ ] No unused CSS or JavaScript
- [ ] CSS and JavaScript are minified for production
- [ ] External resources are minimized
- [ ] Animations don't cause layout shifts
- [ ] Page load time is under 3 seconds
- [ ] Lighthouse score is 90+ in all categories

### Security Review

- [ ] User input is sanitized (when backend is added)
- [ ] No sensitive data in client-side code
- [ ] External links use `rel="noopener noreferrer"` if needed
- [ ] Forms validate on both client and server side
- [ ] HTTPS is enforced in production
- [ ] Content Security Policy headers are set (server-side)

---

## Architecture Overview

### Project Structure

```
KEM WEBSITE/
│
├── index.html          # Single-page application structure
│   ├── Header/Nav      # Sticky navigation with mobile menu
│   ├── Hero Section    # Landing section with CTA
│   ├── Tracking        # Shipment tracking form
│   ├── Services        # Service cards grid
│   ├── Quote Request   # Quote form
│   ├── About           # Company information
│   ├── Testimonials    # Customer reviews
│   ├── Contact         # Contact information and form
│   └── Footer          # Links and company info
│
├── css/styles.css      # Single stylesheet approach
│   ├── CSS Reset       # Normalize browser defaults
│   ├── CSS Variables   # Design tokens in :root
│   ├── Base Styles     # Typography, colors
│   ├── Components      # Reusable components
│   ├── Sections        # Page sections
│   └── Media Queries   # Responsive breakpoints
│
└── js/main.js          # Modular JavaScript
    ├── Mobile Menu     # Navigation toggle
    ├── Smooth Scroll   # Anchor link behavior
    ├── Form Handlers   # Tracking, quote, contact forms
    ├── Animations      # Scroll-based animations
    └── Utilities       # Helper functions
```

### Design Patterns

1. **Single Page Application (SPA)**: All content on one page with anchor navigation
2. **Mobile-First**: Styles start mobile, scale up with media queries
3. **Progressive Enhancement**: Works without JavaScript, enhanced with it
4. **Component-Based CSS**: Each section has self-contained styles
5. **Event Delegation**: Efficient event handling for dynamic content

---

## Coding Standards

### HTML Standards

```html
<!-- ✅ GOOD: Semantic, accessible HTML -->
<section id="services" class="services-section" aria-labelledby="services-heading">
    <h2 id="services-heading">Our Services</h2>
    <article class="service-card">
        <h3>Full Truckload (FTL)</h3>
        <p>Description of service...</p>
        <a href="#quote" class="service-link">Learn more →</a>
    </article>
</section>

<!-- ❌ BAD: Non-semantic, inaccessible -->
<div id="services" class="services">
    <div class="heading">Our Services</div>
    <div class="card">
        <div class="title">Full Truckload (FTL)</div>
        <div class="text">Description of service...</div>
        <a href="#quote">Click here</a>
    </div>
</div>
```

### CSS Standards

```css
/* ✅ GOOD: Uses variables, organized, responsive */
.service-card {
    background: var(--background-white);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    transition: transform var(--transition-medium);
}

.service-card:hover {
    transform: translateY(-4px);
}

@media (max-width: 768px) {
    .service-card {
        padding: var(--spacing-md);
    }
}

/* ❌ BAD: Hardcoded values, no organization */
.service-card {
    background: #ffffff;
    padding: 32px;
    border-radius: 8px;
    transition: all 0.3s;
}

.service-card:hover {
    transform: translateY(-4px);
    padding: 24px; /* Changes in mobile without media query */
}
```

### JavaScript Standards

```javascript
// ✅ GOOD: Modern, modular, well-named
const initTrackingForm = () => {
    const form = document.querySelector('.tracking-form');

    if (!form) return; // Guard clause

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const trackingNumber = form.querySelector('input').value.trim();

        if (validateTrackingNumber(trackingNumber)) {
            fetchTrackingData(trackingNumber);
        }
    });
};

// ❌ BAD: Old style, poorly organized
var form = document.querySelector('.tracking-form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    var val = document.querySelector('.tracking-form input').value;
    // No validation, no error handling
    console.log(val);
});
```

---

## Accessibility Guidelines

### WCAG 2.1 Level AA Requirements

#### 1. Perceivable

- **Text Alternatives**: All images must have `alt` text
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Resize Text**: Text can be resized up to 200% without loss of functionality

#### 2. Operable

- **Keyboard Accessible**: All functionality available via keyboard
- **No Keyboard Trap**: Users can navigate away from any element
- **Skip Links**: "Skip to main content" link at top of page

#### 3. Understandable

- **Language**: `lang="en"` attribute on `<html>` tag
- **Predictable**: Navigation is consistent across pages
- **Input Assistance**: Form errors are clearly identified

#### 4. Robust

- **Valid HTML**: No parsing errors
- **ARIA**: Proper use of roles, states, and properties

### Testing Accessibility

```bash
# Automated testing tools
- Chrome Lighthouse (built-in DevTools)
- WAVE browser extension
- axe DevTools

# Manual testing
- Keyboard navigation (Tab, Shift+Tab, Enter, Space)
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Color contrast checker
- Resize browser to 200%
```

### Common ARIA Patterns

```html
<!-- Navigation -->
<nav role="navigation" aria-label="Main navigation">

<!-- Buttons -->
<button aria-label="Toggle menu" aria-expanded="false">

<!-- Form inputs -->
<input type="text" id="email" aria-describedby="email-help" required>
<small id="email-help">We'll never share your email</small>

<!-- Live regions -->
<div role="region" aria-live="polite" aria-atomic="true">
    <!-- Dynamic content here -->
</div>
```

---

## Performance Guidelines

### Critical Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint (FCP) | < 1.8s | ~1.2s |
| Largest Contentful Paint (LCP) | < 2.5s | ~1.8s |
| Cumulative Layout Shift (CLS) | < 0.1 | ~0.05 |
| Time to Interactive (TTI) | < 3.8s | ~2.5s |

### Optimization Techniques

#### 1. CSS Optimization

```css
/* ✅ GOOD: Hardware-accelerated animations */
.card {
    transform: translateZ(0); /* Force GPU acceleration */
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-4px); /* Only animate transform */
}

/* ❌ BAD: Causes reflow/repaint */
.card:hover {
    margin-top: -4px; /* Triggers layout recalculation */
    box-shadow: 0 10px 20px rgba(0,0,0,0.3); /* OK but expensive */
}
```

#### 2. JavaScript Optimization

```javascript
// ✅ GOOD: Debounced scroll handler
const debouncedScroll = debounce(() => {
    // Handle scroll event
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ❌ BAD: Fires too frequently
window.addEventListener('scroll', () => {
    // Expensive operation on every scroll
});
```

#### 3. Image Optimization

```html
<!-- ✅ GOOD: Lazy loading, responsive images -->
<img
    src="small.jpg"
    srcset="medium.jpg 768w, large.jpg 1200w"
    sizes="(max-width: 768px) 100vw, 50vw"
    loading="lazy"
    alt="Description"
>

<!-- ❌ BAD: No optimization -->
<img src="huge-image.jpg" alt="Description">
```

---

## Security Best Practices

### Current Implementation (Frontend Only)

The current website is frontend-only with no backend, so security risks are minimal. However, when adding a backend:

### 1. Input Validation

```javascript
// ✅ GOOD: Validate and sanitize
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const sanitizeInput = (input) => {
    return input.trim().replace(/[<>]/g, '');
};

// ❌ BAD: Trust user input
form.addEventListener('submit', (e) => {
    const email = input.value; // No validation
    sendToServer(email); // Dangerous!
});
```

### 2. HTTPS Only

Always use HTTPS in production. Most hosting providers offer free SSL certificates via Let's Encrypt.

### 3. Content Security Policy

Add to server headers:

```
Content-Security-Policy:
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
```

### 4. External Links

```html
<!-- For external links, add rel attributes -->
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
    External Link
</a>
```

---

## Common Maintenance Tasks

### 1. Adding a New Service

**File**: `index.html` (around line 150)

```html
<!-- Copy this template -->
<article class="service-card">
    <div class="service-icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <!-- Add your SVG path here -->
        </svg>
    </div>
    <h3>Service Name</h3>
    <p>Service description goes here.</p>
    <a href="#quote" class="service-link">Learn more →</a>
</article>
```

### 2. Changing Brand Colors

**File**: `css/styles.css` (lines 17-41)

```css
:root {
    --primary-color: #ff9900;      /* Main brand color */
    --secondary-color: #232f3e;    /* Dark background */
    --accent-color: #00a8e1;       /* Links and highlights */
}
```

### 3. Updating Contact Information

**File**: `index.html` (around line 450)

```html
<div class="contact-item">
    <h3>Phone</h3>
    <p><a href="tel:+18005551234">1-800-555-1234</a></p>
</div>
```

Update phone numbers, email, and address in the Contact section.

### 4. Adding a New Testimonial

**File**: `index.html` (around line 380)

```html
<article class="testimonial-card">
    <div class="testimonial-rating" aria-label="5 out of 5 stars">
        ★★★★★
    </div>
    <blockquote>
        <p>"Your testimonial quote here..."</p>
    </blockquote>
    <cite>
        <strong>Customer Name</strong>
        <span>Job Title, Company Name</span>
    </cite>
</article>
```

---

## Testing Guidelines

### Browser Testing Matrix

| Browser | Version | Priority |
|---------|---------|----------|
| Chrome | Latest | High |
| Firefox | Latest | High |
| Safari | Latest | High |
| Edge | Latest | Medium |
| Mobile Safari (iOS) | Latest | High |
| Chrome Android | Latest | High |

### Responsive Testing Breakpoints

- **Mobile**: 320px - 480px
- **Tablet**: 481px - 768px
- **Desktop**: 769px - 1200px
- **Large Desktop**: 1201px+

### Testing Checklist

#### Functional Testing

- [ ] All navigation links work
- [ ] Mobile menu opens/closes
- [ ] Smooth scroll to sections
- [ ] Tracking form accepts input and shows results
- [ ] Quote form validates and calculates
- [ ] Contact form validates and shows success
- [ ] All buttons are clickable
- [ ] Forms clear after submission

#### Visual Testing

- [ ] Layout doesn't break at any screen size
- [ ] Images load properly (or placeholders show)
- [ ] Text is readable at all sizes
- [ ] Colors are consistent
- [ ] Animations work smoothly
- [ ] No horizontal scrollbar appears

#### Accessibility Testing

- [ ] Tab through entire page with keyboard
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Check color contrast with tool
- [ ] Ensure all images have alt text
- [ ] Verify form labels are associated

#### Performance Testing

```bash
# Run Lighthouse in Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Desktop" or "Mobile"
4. Click "Analyze page load"
5. Aim for 90+ scores in all categories
```

---

## Known Limitations

### Current Limitations

1. **No Backend**: Forms don't actually submit anywhere
   - Forms validate and show mock responses
   - Need to add backend API for real functionality

2. **Mock Data**: Tracking shows simulated data
   - Replace with real API calls to tracking service

3. **No Authentication**: No user login/signup
   - Add authentication when user accounts are needed

4. **Static Content**: All content is hardcoded
   - Consider CMS integration for easier content management

5. **No Database**: No persistent storage
   - Add database when storing shipment/user data

6. **Email Not Configured**: Contact form doesn't send emails
   - Integrate email service (SendGrid, Mailgun, etc.)

### Browser Limitations

- **Internet Explorer**: Not supported (deprecated)
- **Very Old Browsers**: May not support CSS Grid/Flexbox

---

## Future Improvements

### Short-term (1-3 months)

- [ ] Add real backend API for forms
- [ ] Integrate email service for notifications
- [ ] Add Google Analytics or similar
- [ ] Implement lazy loading for images
- [ ] Add more comprehensive form validation
- [ ] Create a blog section
- [ ] Add customer login portal

### Medium-term (3-6 months)

- [ ] Build admin dashboard for managing content
- [ ] Integrate real-time tracking API
- [ ] Add payment gateway for online payments
- [ ] Implement user authentication (JWT)
- [ ] Create database schema for shipments
- [ ] Add automated email confirmations
- [ ] Build mobile app (React Native or Flutter)

### Long-term (6-12 months)

- [ ] Multi-language support (i18n)
- [ ] Dark mode toggle
- [ ] Advanced search and filtering
- [ ] Integration with logistics APIs (FedEx, UPS, etc.)
- [ ] Real-time chat support
- [ ] Mobile app with push notifications
- [ ] AI-powered route optimization
- [ ] Blockchain for shipment verification

---

## Code Quality Tools

### Recommended Tools

1. **Prettier** - Code formatter
   ```bash
   npm install --save-dev prettier
   ```

2. **ESLint** - JavaScript linter
   ```bash
   npm install --save-dev eslint
   ```

3. **Stylelint** - CSS linter
   ```bash
   npm install --save-dev stylelint
   ```

4. **HTMLHint** - HTML validator
   ```bash
   npm install --save-dev htmlhint
   ```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-service-page

# Make changes and commit
git add .
git commit -m "Add new service page for expedited shipping"

# Push to remote
git push origin feature/new-service-page

# Create pull request for review
```

---

## Documentation Standards

When adding new features, update:

1. **Code Comments**: Explain complex logic
2. **README.md**: Update features list and setup instructions
3. **CLAUDE.md**: Add to maintenance tasks if applicable
4. **Inline Documentation**: Use JSDoc for JavaScript functions

### JSDoc Example

```javascript
/**
 * Validates a tracking number format
 * @param {string} trackingNumber - The tracking number to validate
 * @returns {boolean} True if valid, false otherwise
 * @example
 * validateTrackingNumber('KEM123456789') // returns true
 */
const validateTrackingNumber = (trackingNumber) => {
    return trackingNumber.length >= 8 && trackingNumber.startsWith('KEM');
};
```

---

## Contact for Code Reviews

When requesting a code review:

1. Create a pull request with clear description
2. Reference the issue/feature ticket number
3. Include screenshots for UI changes
4. List what was tested
5. Note any breaking changes

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2025 | Initial release |

---

**Maintained by**: Development Team
**Last Updated**: January 2025
**Next Review**: March 2025
