/**
 * Shipment Model
 */

const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    trackingNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'delayed', 'cancelled'],
        default: 'pending'
    },
    serviceType: {
        type: String,
        enum: ['FTL', 'LTL', 'Expedited', 'Same-Day', 'Specialized'],
        required: true
    },
    origin: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, default: 'USA' }
    },
    destination: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, default: 'USA' }
    },
    cargo: {
        description: String,
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
            unit: { type: String, default: 'inches' }
        },
        quantity: Number,
        value: Number
    },
    estimatedPickup: Date,
    estimatedDelivery: Date,
    actualPickup: Date,
    actualDelivery: Date,
    timeline: [{
        status: String,
        location: String,
        timestamp: { type: Date, default: Date.now },
        note: String
    }],
    price: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
shipmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);
