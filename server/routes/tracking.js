/**
 * Tracking Routes
 */

const express = require('express');
const router = express.Router();
const {
    trackShipment,
    getMyShipments,
    getShipmentDetails
} = require('../controllers/trackingController');
const { protect } = require('../middleware/auth');

// Public route
router.get('/:trackingNumber', trackShipment);

// Protected routes
router.get('/my-shipments', protect, getMyShipments);
router.get('/shipment/:id', protect, getShipmentDetails);

module.exports = router;
