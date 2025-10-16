/**
 * Quote Controller
 */

const Quote = require('../models/Quote');
const generateQuoteNumber = require('../utils/generateQuoteNumber');
const { validationResult } = require('express-validator');

// @desc    Request a quote
// @route   POST /api/quotes
// @access  Public
exports.createQuote = async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const {
            customerInfo,
            serviceType,
            origin,
            destination,
            cargo,
            preferredPickupDate,
            preferredDeliveryDate,
            notes
        } = req.body;

        // Generate quote number
        const quoteNumber = generateQuoteNumber();

        // Calculate estimated price
        const estimatedPrice = calculateQuotePrice(serviceType, cargo, origin, destination);

        // Create quote
        const quote = await Quote.create({
            quoteNumber,
            customerInfo,
            serviceType,
            origin,
            destination,
            cargo,
            preferredPickupDate,
            preferredDeliveryDate,
            estimatedPrice,
            notes
        });

        res.status(201).json({
            success: true,
            quote
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get quote by quote number
// @route   GET /api/quotes/:quoteNumber
// @access  Public
exports.getQuote = async (req, res) => {
    try {
        const { quoteNumber } = req.params;

        const quote = await Quote.findOne({
            quoteNumber: quoteNumber.toUpperCase()
        });

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote not found with this quote number'
            });
        }

        res.status(200).json({
            success: true,
            quote
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Helper function to calculate quote price
function calculateQuotePrice(serviceType, cargo, origin, destination) {
    let baseRate = 0;

    // Base rates by service type
    const serviceRates = {
        'FTL': 2.50,
        'LTL': 1.80,
        'Expedited': 3.50,
        'Same-Day': 5.00,
        'Specialized': 4.00,
        'Warehousing': 1.50
    };

    baseRate = (serviceRates[serviceType] || 2.00) * cargo.weight;

    // Add fuel surcharge (15%)
    const fuelSurcharge = baseRate * 0.15;

    // Accessorial charges
    let accessorialCharges = 0;
    if (cargo.isHazmat) accessorialCharges += 150;
    if (cargo.requiresRefrigeration) accessorialCharges += 200;

    // Calculate total
    const total = baseRate + fuelSurcharge + accessorialCharges;

    return {
        baseRate: Math.round(baseRate * 100) / 100,
        fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
        accessorialCharges: Math.round(accessorialCharges * 100) / 100,
        total: Math.round(total * 100) / 100
    };
}
