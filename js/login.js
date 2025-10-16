/**
 * Login Page JavaScript
 */

'use strict';

// Initialize login form
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Validate inputs
        if (!email || !password) {
            showMessage('Please enter both email and password', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;

        // Call backend API
        handleLogin(email, password, rememberMe, submitBtn, originalText);
    });
}

// Handle login with API
async function handleLogin(email, password, rememberMe, submitBtn, originalText) {
    try {
        // Call API
        const response = await API.auth.login(email, password);

        if (response.success) {
            // Store auth token
            setAuthToken(response.token);

            // Store user info
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userEmail', response.user.email);
            sessionStorage.setItem('userName', response.user.name);
            sessionStorage.setItem('userRole', response.user.role);

            if (rememberMe) {
                localStorage.setItem('rememberEmail', email);
            }

            showMessage('Login successful! Redirecting...', 'success');

            // Redirect based on role
            setTimeout(() => {
                if (response.user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'customer-dashboard.html';
                }
            }, 1500);
        }
    } catch (error) {
        showMessage(error.message || 'Invalid email or password', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Show message function
function showMessage(message, type) {
    if (loginMessage) {
        loginMessage.textContent = message;
        loginMessage.className = `login-message ${type}`;
        loginMessage.style.display = 'block';

        // Auto-hide after 5 seconds if error
        if (type === 'error') {
            setTimeout(() => {
                loginMessage.style.display = 'none';
            }, 5000);
        }
    }
}

// Pre-fill email if remembered
window.addEventListener('DOMContentLoaded', () => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
        const emailInput = document.getElementById('login-email');
        if (emailInput) {
            emailInput.value = rememberedEmail;
            document.getElementById('remember-me').checked = true;
        }
    }
});

// Forgot password handler
document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Password reset functionality would be implemented here.\n\nIn production, this would send a password reset email to your registered email address.');
        });
    }
});
