const express = require('express');
const router = express.Router();
const { verifySeller } = require('../middleware/authMiddleware');
const { addProduct, deleteProduct, editProduct, getMyProducts } = require('../controllers/sellerController');

router.post('/addProduct', verifySeller, addProduct);
router.delete('/deleteProduct/', verifySeller, deleteProduct);
router.put('/editProduct', verifySeller, editProduct);
router.get('/myProducts', verifySeller, getMyProducts);

module.exports = router;
