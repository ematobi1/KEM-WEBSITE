/**
 * Quote Model
 */

const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    quoteNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    customerInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        company: String
    },
    serviceType: {
        type: String,
        enum: ['FTL', 'LTL', 'Expedited', 'Same-Day', 'Specialized', 'Warehousing'],
        required: true
    },
    origin: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    destination: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    cargo: {
        description: String,
        weight: { type: Number, required: true },
        dimensions: {
            length: Number,
            width: Number,
            height: Number
        },
        quantity: Number,
        isHazmat: { type: Boolean, default: false },
        requiresRefrigeration: { type: Boolean, default: false }
    },
    preferredPickupDate: Date,
    preferredDeliveryDate: Date,
    estimatedPrice: {
        baseRate: Number,
        fuelSurcharge: Number,
        accessorialCharges: Number,
        total: Number
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'approved', 'rejected', 'converted'],
        default: 'pending'
    },
    notes: String,
    adminNotes: String,
    convertedToShipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: Date,
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Quote', quoteSchema);
