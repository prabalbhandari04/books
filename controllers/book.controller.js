const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Book } = require('../models/book.model'); 
const config = require('../config/config');
const sendNotif = require('../utils/sendNotif');
const { User } = require('../models/user.model'); 

const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();

    // Retrieve all retail users' emails from the User model
    const users = await User.find();
    const userEmails = users.map(user => user.email);

    // Define book details for the email template
    const { title, price, quantity } = req.body;

    // Send bulk emails with a limit of 100 emails per minute
    const emailsPerMinute = 100;
    const delayBetweenEmails = 60000 / emailsPerMinute;

    const authorIds = book.authors; 
    const author = await User.findById(authorIds);
    const authorEmail = author.email;

    for (const userEmail of userEmails) {
      sendNotif(userEmail, title, price, authorEmail);
      await new Promise(resolve => setTimeout(resolve, delayBetweenEmails));
    }
   
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = createBook;


const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ isDeleted: false });
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getBookById = async (req, res) => {
    try {
      const id = req.body.bookId;
      const book = await Book.findOne({ _id: req.params.id, isDeleted: false });
  
      if (!book) {
        return res.status(404).json({ error: 'Book not found or has been deleted' });
      }
  
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

const updateBookById = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['bookId', 'authors', 'sellCount', 'title', 'description', 'price'];
  
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates!' });
    }
  
    try {
      const book = await Book.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!book) {
        return res.status(404).json({ error: 'Book not found or has been deleted' });
      }
  
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Internal Server Error' });
    }
  };
  

const deleteBookById = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json({ message: 'Book deleted successfully', book });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};
