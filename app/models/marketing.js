const mongoose = require('mongoose');

const MarketingSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },
        company: { type: String, required: true },
        industry: { type: String, required: true },
    });

module.exports = mongoose.model('Marketing', MarketingSchema);