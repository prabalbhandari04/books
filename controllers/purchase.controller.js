const { PurchaseHistory } = require('../models/purchase.model');
const { Book } = require('../models/book.model');
const { User } = require('../models/user.model');
const sendEmail = require('../utils/sendMail');
const sendAuthorEmail = require('../utils/sendAuthorEmail');

exports.createPurchase = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.userId;
    const { quantity } = req.body;

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity cannot be less than 1.' });
    }

    // Create a new purchase instance
    const purchase = new PurchaseHistory({
      bookId,
      userId,
      quantity,
    });

    // Save the purchase document to the database
    await purchase.save();

    // Update the sell count for the corresponding book by adding quantity
    await Book.findByIdAndUpdate(bookId, { $inc: { sellCount: quantity } });

    // Update the revenue for all corresponding authors
    const book = await Book.findById(bookId).populate('authors');
    const authorIds = book.authors; // Assuming there can be multiple authors

    // Calculate revenue and add to each author's revenue array
    const revenueAmount = book.price * quantity;
    purchase.totalAmount = revenueAmount;
    await purchase.save();

    // Update revenue for each author
    for (const authorId of authorIds) {
      const author = await User.findById(authorId);
      if (author) {
        author.revenue.push({ amount: revenueAmount, date: purchase.purchaseDate });
        await author.save();
      }
      
      // Retrieve book details for the email
      const bookDetails = await Book.findById(bookId);

      // Send purchase details email to the user
      const authorEmail = author.email;
      const user = await User.findById(req.user.userId);
      const userEmail = user.email;  
      sendEmail(userEmail, bookDetails.title, bookDetails.price, purchase.quantity, purchase.totalAmount);
      sendAuthorEmail(authorEmail,userEmail, bookDetails.title, bookDetails.price, purchase.quantity, purchase.totalAmount);
    }

    // Respond with the created purchase document
    res.status(201).json({  purchase });
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

exports.getUserPurchaseHistory = async (req, res) => {
  try {
    const userId = req.params.id;
    const userPurchases = await PurchaseHistory.find({ userId, isDeleted: { $ne: true } });

    res.status(200).json(userPurchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
