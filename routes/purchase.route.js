/**
 * @swagger
 * tags:
 *   name: Purchases
 *   description: Purchase management
 */

/**
 * @swagger
 * /api/v1/purchases/{id}:
 *   post:
 *     summary: Create a new purchase
 *     description: Create a new purchase for a user
 *     tags: [Purchases]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchaseCreate'
 *     responses:
 *       200:
 *         description: Successful purchase creation
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/purchases:
 *   get:
 *     summary: Get all purchases
 *     description: Get a list of all purchases (admin only)
 *     tags: [Purchases]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful retrieval of purchases
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/purchases/{id}:
 *   get:
 *     summary: Get purchase by ID
 *     description: Get details of a specific purchase
 *     tags: [Purchases]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Purchase ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful retrieval of purchase
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/purchases/{id}:
 *   delete:
 *     summary: Delete purchase by ID
 *     description: Delete a specific purchase (admin only)
 *     tags: [Purchases]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Purchase ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful deletion of purchase
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/purchases/purchase-history/{id}:
 *   get:
 *     summary: Get user purchase history
 *     description: Get the purchase history of a user
 *     tags: [Purchases]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful retrieval of purchase history
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  deletePurchase,
  getUserPurchaseHistory,
} = require('../controllers/purchase.controller');

const router = express.Router();

router.post('/:id', authenticateToken, createPurchase);
router.get('/', authenticateToken, getAllPurchases);
router.get('/:id', authenticateToken, getPurchaseById);
router.delete('/:id', authenticateToken, deletePurchase);
router.get('/purchase-history/:id', authenticateToken, getUserPurchaseHistory);

module.exports = router;
