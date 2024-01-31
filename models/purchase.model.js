const mongoose = require('mongoose');

const purchaseHistorySchema = new mongoose.Schema({
    purchaseId: { type: String, unique: true },
    bookId: { type: String, ref: 'Book', required: true },
    userId: { type: String, ref: 'User', required: true },
    purchaseDate: { type: Date, default: Date.now, required: true },
    price: { type: Number},
    quantity: { type: Number, default: 1 },
    totalAmount: { type: Number },
    isDeleted: { type: Boolean, default: false }
});

purchaseHistorySchema.pre('save', async function (next) {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);

    if (!this.purchaseId) {
        this.purchaseId = await this.constructor.generatePurchaseId(year, month);
    }

    next();
});

purchaseHistorySchema.statics.generatePurchaseId = async function (year, month) {
    const lastPurchase = await this.findOne({}, {}, { sort: { purchaseId: -1 } });
    const lastId = lastPurchase ? parseInt(lastPurchase.purchaseId.split('-')[2]) : 0;
    const increment = lastId + 1;
    return `${year}-${month}-${increment}`;
};

const PurchaseHistory = mongoose.model('PurchaseHistory', purchaseHistorySchema);

module.exports = {
    PurchaseHistory
};
