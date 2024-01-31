const { PurchaseHistory } = require('../models/purchase.model');
const { Book } = require('../models/book.model');
const { User } = require('../models/user.model');

exports.createPurchase = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { userId, quantity } = req.body;

    // Create a new purchase instance
    const purchase = new PurchaseHistory({
      bookId: bookId,
      userId,
      quantity,
    });

    // Save the purchase document to the database
    await purchase.save();

    // Update the sell count for the corresponding book
    await Book.findByIdAndUpdate(bookId, { $inc: { sellCount: 1 } });

    // Update the revenue for all corresponding authors
    const book = await Book.findById(bookId).populate('authors');
    const authorIds = book.authors; // Assuming there can be multiple authors

    // Calculate revenue and add to each author's revenue array
    const revenueAmount = book.price * quantity;
    purchase.totalAmount = revenueAmount
    await purchase.save()

    // Update revenue for each author
    for (const authorId of authorIds) {
      const author = await User.findById(authorId);
      if (author) {
        author.revenue.push({ amount: revenueAmount, date: purchase.purchaseDate });
        await author.save();
      }
    }

    // Respond with the created purchase document
    res.status(201).json(purchase);
  } catch (error) {
    // Handle any errors during the creation process
    res.status(500).json({ error: error.message });
  }
};


exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await PurchaseHistory.find({ isDeleted: { $ne: true } });
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get purchase by ID
exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await PurchaseHistory.findOne({ _id: req.params.id, isDeleted: { $ne: true } });

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete purchase by ID
exports.deletePurchase = async (req, res) => {
  try {
    const purchase = await PurchaseHistory.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    res.json({ message: 'Purchase deleted successfully', purchase });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
