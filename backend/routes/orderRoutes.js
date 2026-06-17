const express = require('express');
const router = express.Router();
const { verifyUser, verifySeller, verify } = require('../middleware/authMiddleware');
const order = require('../controllers/orderController');

// Buyer
router.post('/orderOne', verifyUser, order.placeOrder);
router.get('/userOrders', verifyUser, order.getUserOrders);
router.get('/userPendingOrders', verifyUser, order.getUserOrdersByStatus('Pending'));
router.get('/userAcceptedOrders', verifyUser, order.getUserOrdersByStatus('Accepted'));
router.get('/userCancelledOrders', verifyUser, order.getUserOrdersByStatus('Cancelled'));

// Seller
router.get('/sellerOrders', verifySeller, order.getSellerOrders);
router.get('/sellerPendingOrders', verifySeller, order.getSellerOrdersByStatus('Pending'));
router.get('/sellerAcceptedOrders', verifySeller, order.getSellerOrdersByStatus('Accepted'));
router.get('/sellerCancelledOrders', verifySeller, order.getSellerOrdersByStatus('Cancelled'));

// Status changes
router.patch('/acceptOrder', verifySeller, order.acceptOrder);
router.patch('/cancelOrder', verify, order.cancelOrder);
router.patch('/deliverOrder', verifySeller, order.deliverOrder);

module.exports = router;
