/**
 * Contact Controller
 */

const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { name, email, phone, company, subject, message } = req.body;

        // Create contact entry
        const contact = await Contact.create({
            name,
            email,
            phone,
            company,
            subject,
            message
        });

        // Send confirmation email to customer
        try {
            await sendEmail({
                to: email,
                subject: 'We received your message - KEM Logistics',
                html: `
                    <h2>Thank you for contacting KEM Logistics!</h2>
                    <p>Dear ${name},</p>
                    <p>We have received your message and will get back to you within 24 hours.</p>
                    <p><strong>Your message:</strong></p>
                    <p>${message}</p>
                    <br>
                    <p>Best regards,<br>KEM Logistics Team</p>
                    <p>Phone: 1-470-836-3519<br>Email: kemlogistics23@gmail.com</p>
                `
            });

            // Send notification email to admin
            await sendEmail({
                to: process.env.EMAIL_USER,
                subject: `New Contact Form Submission - ${subject}`,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>From:</strong> ${name} (${email})</p>
                    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                    <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                `
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Continue even if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Thank you for your message. We will get back to you soon!',
            contact: {
                id: contact._id,
                name: contact.name,
                email: contact.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all contact submissions (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: contacts.length,
            contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Private/Admin
exports.updateContactStatus = async (req, res) => {
    try {
        const { status, responseMessage } = req.body;

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        contact.status = status || contact.status;

        if (responseMessage) {
            contact.response = {
                message: responseMessage,
                respondedBy: req.user.id,
                respondedAt: Date.now()
            };

            // Send response email to customer
            try {
                await sendEmail({
                    to: contact.email,
                    subject: `Re: ${contact.subject} - KEM Logistics`,
                    html: `
                        <h2>Response from KEM Logistics</h2>
                        <p>Dear ${contact.name},</p>
                        <p>${responseMessage}</p>
                        <br>
                        <p>Best regards,<br>KEM Logistics Team</p>
                        <p>Phone: 1-470-836-3519<br>Email: kemlogistics23@gmail.com</p>
                    `
                });
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
            }
        }

        await contact.save();

        res.status(200).json({
            success: true,
            contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
