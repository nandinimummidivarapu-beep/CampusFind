const express = require('express');
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  resolveItem
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getItems)
  .post(protect, createItem);

router
  .route('/:id')
  .get(getItem)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

router.patch('/:id/resolve', protect, resolveItem);

module.exports = router;
