const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middleware/authMiddleware');
const { addToCart, getCart, updateCount, removeItem, clearCart, getTotal } = require('../controllers/cartController');

router.post('/add', verifyUser, addToCart);
router.get('/', verifyUser, getCart);
router.patch('/update', verifyUser, updateCount);
router.delete('/remove', verifyUser, removeItem);
router.delete('/clearAll', verifyUser, clearCart);
router.get('/total', verifyUser, getTotal);

module.exports = router;
