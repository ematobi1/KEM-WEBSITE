/**
 * Contact Routes
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    submitContact,
    getAllContacts,
    updateContactStatus
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const contactValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required')
];

// Public route
router.post('/', contactValidation, submitContact);

// Admin routes
router.get('/', protect, authorize('admin'), getAllContacts);
router.put('/:id', protect, authorize('admin'), updateContactStatus);

module.exports = router;
