/**
 * Quote Routes
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createQuote,
    getQuote
} = require('../controllers/quoteController');

// Validation rules
const quoteValidation = [
    body('customerInfo.name').notEmpty().withMessage('Name is required'),
    body('customerInfo.email').isEmail().withMessage('Valid email is required'),
    body('customerInfo.phone').notEmpty().withMessage('Phone is required'),
    body('serviceType').notEmpty().withMessage('Service type is required'),
    body('origin.city').notEmpty().withMessage('Origin city is required'),
    body('origin.state').notEmpty().withMessage('Origin state is required'),
    body('origin.zipCode').notEmpty().withMessage('Origin zip code is required'),
    body('destination.city').notEmpty().withMessage('Destination city is required'),
    body('destination.state').notEmpty().withMessage('Destination state is required'),
    body('destination.zipCode').notEmpty().withMessage('Destination zip code is required'),
    body('cargo.weight').isNumeric().withMessage('Weight must be a number')
];

// Routes
router.post('/', quoteValidation, createQuote);
router.get('/:quoteNumber', getQuote);

module.exports = router;
