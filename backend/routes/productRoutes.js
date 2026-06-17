const express = require('express');
const router = express.Router();
const { getAllProducts, searchProducts } = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/search/:name', searchProducts);

module.exports = router;
