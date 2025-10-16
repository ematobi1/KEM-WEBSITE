/**
 * Admin Controller
 */

const Shipment = require('../models/Shipment');
const Quote = require('../models/Quote');
const User = require('../models/User');
const Contact = require('../models/Contact');
const generateTrackingNumber = require('../utils/generateTrackingNumber');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    try {
        // Get statistics
        const totalShipments = await Shipment.countDocuments();
        const activeShipments = await Shipment.countDocuments({
            status: { $in: ['picked_up', 'in_transit', 'out_for_delivery'] }
        });
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const pendingQuotes = await Quote.countDocuments({ status: 'pending' });
        const newContacts = await Contact.countDocuments({ status: 'new' });

        // Calculate revenue (sum of all paid shipments)
        const revenueData = await Shipment.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // Get recent shipments
        const recentShipments = await Shipment.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email');

        // Get pending quotes
        const recentQuotes = await Quote.find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .limit(10);

        // Calculate on-time delivery percentage
        const deliveredShipments = await Shipment.countDocuments({ status: 'delivered' });
        const onTimeDeliveries = await Shipment.countDocuments({
            status: 'delivered',
            $expr: { $lte: ['$actualDelivery', '$estimatedDelivery'] }
        });
        const onTimePercentage = deliveredShipments > 0
            ? Math.round((onTimeDeliveries / deliveredShipments) * 100)
            : 0;

        res.status(200).json({
            success: true,
            stats: {
                totalShipments,
                activeShipments,
                totalCustomers,
                totalRevenue,
                pendingQuotes,
                newContacts,
                onTimePercentage
            },
            recentShipments,
            recentQuotes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all shipments (with filters)
// @route   GET /api/admin/shipments
// @access  Private/Admin
exports.getAllShipments = async (req, res) => {
    try {
        const { status, serviceType, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (serviceType) query.serviceType = serviceType;

        const shipments = await Shipment.find(query)
            .populate('user', 'name email company')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Shipment.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            shipments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new shipment
// @route   POST /api/admin/shipments
// @access  Private/Admin
exports.createShipment = async (req, res) => {
    try {
        const trackingNumber = generateTrackingNumber();

        const shipment = await Shipment.create({
            ...req.body,
            trackingNumber
        });

        res.status(201).json({
            success: true,
            shipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update shipment
// @route   PUT /api/admin/shipments/:id
// @access  Private/Admin
exports.updateShipment = async (req, res) => {
    try {
        let shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found'
            });
        }

        shipment = await Shipment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            shipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete shipment
// @route   DELETE /api/admin/shipments/:id
// @access  Private/Admin
exports.deleteShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found'
            });
        }

        await shipment.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Shipment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all quotes
// @route   GET /api/admin/quotes
// @access  Private/Admin
exports.getAllQuotes = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;

        const quotes = await Quote.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Quote.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            quotes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update quote status
// @route   PUT /api/admin/quotes/:id
// @access  Private/Admin
exports.updateQuote = async (req, res) => {
    try {
        let quote = await Quote.findById(req.params.id);

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
        }

        quote.status = req.body.status || quote.status;
        quote.adminNotes = req.body.adminNotes || quote.adminNotes;
        quote.reviewedBy = req.user.id;
        quote.reviewedAt = Date.now();

        await quote.save();

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

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
exports.getAllCustomers = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const customers = await User.find({ role: 'customer' })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await User.countDocuments({ role: 'customer' });

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            customers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update customer status
// @route   PUT /api/admin/customers/:id
// @access  Private/Admin
exports.updateCustomer = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        customer.isActive = req.body.isActive ?? customer.isActive;

        await customer.save();

        res.status(200).json({
            success: true,
            customer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
