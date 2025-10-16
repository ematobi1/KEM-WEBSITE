/**
 * Admin Dashboard JavaScript
 */

'use strict';

// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    displayUserName();
});

// Check if user is logged in
function checkAuthentication() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userEmail = sessionStorage.getItem('userEmail');

    if (!isLoggedIn || !userEmail) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }

    // Optional: Check if admin user
    if (userEmail !== 'admin@kemlogistics.com') {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'index.html';
    }
}

// Display user name
function displayUserName() {
    const userName = sessionStorage.getItem('userName') || 'User';
    const userNameElement = document.getElementById('adminUserName');

    if (userNameElement) {
        userNameElement.textContent = userName;
    }
}

// Logout function
function adminLogout() {
    if (confirm('Are you sure you want to log out?')) {
        // Clear session storage
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userName');

        // Redirect to home page
        window.location.href = 'index.html';
    }
}

// Show section function
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    const activeNavItem = document.querySelector(`.nav-item[onclick*="${sectionId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }

    // Update URL hash
    window.location.hash = sectionId;
}

// Handle initial hash on page load
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    }
});

// Real-time data update simulation (in production, this would fetch from backend)
function updateDashboardData() {
    // This would typically fetch real data from an API
    console.log('Dashboard data updated');
}

// Update dashboard every 30 seconds
setInterval(updateDashboardData, 30000);

// Prevent back button after logout
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        checkAuthentication();
    }
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Admin dashboard error:', e.error);
});
