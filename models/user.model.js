const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
    userType: { type: String, enum: ['Author', 'Admin', 'Retail_User'], required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    revenue: [{
        amount: { type: Number, default: 0 },
        date: { type: Date, default: Date.now }
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User
};
