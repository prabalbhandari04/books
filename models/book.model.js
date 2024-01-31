const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    sellCount: { type: Number, default: 0 },
    title: { type: String, unique: true, required: true },
    description: { type: String },
    price: { type: Number, min: 100, max: 1000, required: true }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = {
    Book
};
