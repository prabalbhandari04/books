const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
} = require('../controllers/purchase.controller');

const router = express.Router();

router.post('/:id', authenticateToken, createPurchase);
router.get('/', getAllPurchases);
router.get('/:id', getPurchaseById);
router.delete('/:id', authenticateToken, deletePurchase);

module.exports = router;
