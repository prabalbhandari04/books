const mongoose = require('mongoose');

const purchaseHistorySchema = new mongoose.Schema({
    // Automatically generated purchaseId
    purchaseId: { type: String, unique: true },
    bookId: { type: String, ref: 'Book', required: true },
    userId: { type: String, ref: 'User', required: true },
    purchaseDate: { type: Date, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 }
});

// Auto-generate purchaseId before saving the document
purchaseHistorySchema.pre('save', function (next) {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const numericIncrement = this.constructor.increment;

    // Generate the purchaseId in the format: {{YEAR}}-{{MONTH}}-{{numeric increment id}}
    this.purchaseId = `${year}-${month}-${numericIncrement}`;
    
    // Increment the numeric increment for the next purchase
    this.constructor.increment++;

    next();
});

// Initialize the numeric increment to 1
purchaseHistorySchema.statics.increment = 1;

const PurchaseHistory = mongoose.model('PurchaseHistory', purchaseHistorySchema);

module.exports = {
    PurchaseHistory
};
