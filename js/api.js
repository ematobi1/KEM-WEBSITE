/**
 * API Configuration and Helper Functions
 */

'use strict';

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from session storage
const getAuthToken = () => {
    return sessionStorage.getItem('authToken');
};

// Set auth token
const setAuthToken = (token) => {
    sessionStorage.setItem('authToken', token);
};

// Remove auth token
const removeAuthToken = () => {
    sessionStorage.removeItem('authToken');
};

// API Helper function
const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();

    const config = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    };

    if (options.body) {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// API Methods
const API = {
    // Authentication
    auth: {
        login: (email, password) =>
            apiRequest('/auth/login', {
                method: 'POST',
                body: { email, password }
            }),

        register: (userData) =>
            apiRequest('/auth/register', {
                method: 'POST',
                body: userData
            }),

        getMe: () =>
            apiRequest('/auth/me'),

        updateProfile: (userData) =>
            apiRequest('/auth/profile', {
                method: 'PUT',
                body: userData
            })
    },

    // Tracking
    tracking: {
        trackShipment: (trackingNumber) =>
            apiRequest(`/tracking/${trackingNumber}`),

        getMyShipments: () =>
            apiRequest('/tracking/my-shipments'),

        getShipmentDetails: (id) =>
            apiRequest(`/tracking/shipment/${id}`)
    },

    // Quotes
    quotes: {
        createQuote: (quoteData) =>
            apiRequest('/quotes', {
                method: 'POST',
                body: quoteData
            }),

        getQuote: (quoteNumber) =>
            apiRequest(`/quotes/${quoteNumber}`)
    },

    // Contact
    contact: {
        submitContact: (contactData) =>
            apiRequest('/contact', {
                method: 'POST',
                body: contactData
            }),

        getAllContacts: () =>
            apiRequest('/contact'),

        updateContactStatus: (id, statusData) =>
            apiRequest(`/contact/${id}`, {
                method: 'PUT',
                body: statusData
            })
    },

    // Admin
    admin: {
        getDashboard: () =>
            apiRequest('/admin/dashboard'),

        getAllShipments: (filters = {}) => {
            const params = new URLSearchParams(filters);
            return apiRequest(`/admin/shipments?${params}`);
        },

        createShipment: (shipmentData) =>
            apiRequest('/admin/shipments', {
                method: 'POST',
                body: shipmentData
            }),

        updateShipment: (id, shipmentData) =>
            apiRequest(`/admin/shipments/${id}`, {
                method: 'PUT',
                body: shipmentData
            }),

        deleteShipment: (id) =>
            apiRequest(`/admin/shipments/${id}`, {
                method: 'DELETE'
            }),

        getAllQuotes: (filters = {}) => {
            const params = new URLSearchParams(filters);
            return apiRequest(`/admin/quotes?${params}`);
        },

        updateQuote: (id, quoteData) =>
            apiRequest(`/admin/quotes/${id}`, {
                method: 'PUT',
                body: quoteData
            }),

        getAllCustomers: (filters = {}) => {
            const params = new URLSearchParams(filters);
            return apiRequest(`/admin/customers?${params}`);
        },

        updateCustomer: (id, customerData) =>
            apiRequest(`/admin/customers/${id}`, {
                method: 'PUT',
                body: customerData
            })
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API, getAuthToken, setAuthToken, removeAuthToken };
}
