/**
 * Tracking Controller
 */

const Shipment = require('../models/Shipment');

// @desc    Track shipment by tracking number
// @route   GET /api/tracking/:trackingNumber
// @access  Public
exports.trackShipment = async (req, res) => {
    try {
        const { trackingNumber } = req.params;

        const shipment = await Shipment.findOne({
            trackingNumber: trackingNumber.toUpperCase()
        }).select('-user');

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found with this tracking number'
            });
        }

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

// @desc    Get user's shipments
// @route   GET /api/tracking/my-shipments
// @access  Private
exports.getMyShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: shipments.length,
            shipments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get shipment details
// @route   GET /api/tracking/shipment/:id
// @access  Private
exports.getShipmentDetails = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found'
            });
        }

        // Make sure user owns shipment or is admin
        if (shipment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this shipment'
            });
        }

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
