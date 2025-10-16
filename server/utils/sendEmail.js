/**
 * Send Email Utility
 */

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransporter({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_FROM || `KEM Logistics <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent: %s', info.messageId);
    return info;
};

module.exports = sendEmail;
