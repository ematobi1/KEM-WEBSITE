/**
 * Admin Routes
 */

const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getAllShipments,
    createShipment,
    updateShipment,
    deleteShipment,
    getAllQuotes,
    updateQuote,
    getAllCustomers,
    updateCustomer
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin authorization
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Shipments
router.route('/shipments')
    .get(getAllShipments)
    .post(createShipment);

router.route('/shipments/:id')
    .put(updateShipment)
    .delete(deleteShipment);

// Quotes
router.get('/quotes', getAllQuotes);
router.put('/quotes/:id', updateQuote);

// Customers
router.get('/customers', getAllCustomers);
router.put('/customers/:id', updateCustomer);

module.exports = router;
