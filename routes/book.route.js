const express = require('express');
const { authenticateToken  } = require('../middleware/auth');
const {
  createBook,
  getBooks,
  getBookById,
  updateBookById,
  deleteBookById,
} = require('../controllers/book.controller');
const router = express.Router();

router.post('/', authenticateToken,createBook);
router.get('/',getBooks);
router.get('/get-book/:id',getBookById);
router.patch('/:id', authenticateToken,updateBookById);
router.delete('/:id', authenticateToken,deleteBookById);


module.exports = router;
