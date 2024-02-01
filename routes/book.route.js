/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Create a new book
 *     description: Create a new book by providing required details
 *     tags: [Books]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookCreate'
 *     responses:
 *       200:
 *         description: Successful book creation
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: Get all books
 *     description: Get a list of all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Successful retrieval of books
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get book by ID
 *     description: Get details of a specific book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Book ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful retrieval of book
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/books/{id}:
 *   patch:
 *     summary: Update book by ID
 *     description: Update details of a specific book (admin only)
 *     tags: [Books]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Book ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookUpdate'
 *     responses:
 *       200:
 *         description: Successful update of book
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Delete book by ID
 *     description: Delete a specific book (admin only)
 *     tags: [Books]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Book ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful deletion of book
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  createBook,
  getBooks,
  getBookById,
  updateBookById,
  deleteBookById,
} = require('../controllers/book.controller');
const router = express.Router();

router.post('/', authenticateToken, createBook);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.patch('/:id', authenticateToken, updateBookById);
router.delete('/:id', authenticateToken, deleteBookById);

module.exports = router;
