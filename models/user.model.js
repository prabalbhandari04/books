const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userType: { type: Number, enum: [0, 1, 2], required: true }, // 0: Admin, 1: Author, 2: Retail User
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    revenue: {
        type: [{
            amount: { type: Number, default: 0 },
            date: { type: Date, default: Date.now }
        }],
        default: [],
        required: function () {
            return this.userType === 1; // Revenue is required only for userType 1 (Author)
        }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User
};
