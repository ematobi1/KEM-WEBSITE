/**
 * Database Configuration
 */

const mongoose = require('mongoose');

// Fail immediately instead of buffering for 10s when DB is not connected
mongoose.set('bufferCommands', false);

const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        console.error('Server will continue without database - email functionality still works.');
    }
};

module.exports = connectDatabase;
