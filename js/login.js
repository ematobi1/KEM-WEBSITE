/**
 * Login Page JavaScript
 */

'use strict';

const ADMIN_EMAIL = 'admin.info@kemlogisticsnsolutions.com';
const ADMIN_PASS  = 'KEM@2025';

const loginForm    = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email      = document.getElementById('login-email').value.trim();
        const password   = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        if (!email || !password) {
            showMessage('Please enter both email and password', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        const submitBtn  = loginForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled    = true;

        setTimeout(() => {
            if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userEmail',  email);
                sessionStorage.setItem('userRole',   'admin');

                if (rememberMe) {
                    localStorage.setItem('rememberEmail', email);
                }

                showMessage('Login successful! Redirecting...', 'success');
                setTimeout(() => { window.location.href = 'admin.html'; }, 1200);
            } else {
                showMessage('Invalid email or password. Please try again.', 'error');
                submitBtn.textContent = 'Sign In';
                submitBtn.disabled    = false;
            }
        }, 600);
    });
}

function showMessage(message, type) {
    if (loginMessage) {
        loginMessage.textContent  = message;
        loginMessage.className    = `login-message ${type}`;
        loginMessage.style.display = 'block';

        if (type === 'error') {
            setTimeout(() => { loginMessage.style.display = 'none'; }, 5000);
        }
    }
}

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

document.addEventListener('DOMContentLoaded', () => {
    const forgotLink = document.querySelector('.forgot-password');
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('To reset your password, please contact: kemlogistics23@gmail.com');
        });
    }
});
