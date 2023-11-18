const mongoose = require('mongoose');
const DB = process.env.DATABASE;

const connectDB = async () => {
    try {
        await mongoose.connect(DB);
        console.log('DB connected');
    } catch (error) {
        console.error('DB connection error:', error.message);
    }
};

module.exports = connectDB;
