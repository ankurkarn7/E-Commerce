const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const { verifyUser, verifySeller, verify } = require('../middleware/authMiddleware');



// user routes

router.post('/orderOne', verifyUser, async(req, res) => {       // order all items in cart
    try{
        const { productId } = req.body;
        const cart = await Cart.findOne({ user : req.user.id}).populate('items.productId');
        if(!cart) res.status(400).json({message : "Cart doesn't exist"});
        const selectedItem = cart.items.find(item => item.productId._id.toString() === productId);
        if(!selectedItem) return res.status(400).json({message : "Item not found in cart"});
        
        const order = new Order({
            user : req.user.id,
            items : [{
                productId : selectedItem.productId._id,
                name : selectedItem.productId.name,
                price : selectedItem.productId.price,
                count : selectedItem.count,
                sellerId : selectedItem.productId.sellerId
            }],
            totalAmount : selectedItem.productId.price * selectedItem.count
        })
        await order.save();

        cart.items = cart.items.filter(item => item.productId._id.toString() !== productId);
        await cart.save();
        res.status(201).json({message : "Your order is placed successfully"});
    } catch(err){
        res.status(500).json({message : err.message});
    }
})

router.get('/userOrders', verifyUser, async(req, res) => {
    try{
        const orders = await Order.find({user : req.user.id}).sort({createdAt : -1});
        res.json(orders);
    }catch(err){
        res.status(500).json({message : err.message});
    }
})

router.get('/userPendingOrders', verifyUser, async(req, res) => {
    try{
        const pending = await Order.find({user : req.user.id, status : 'Pending'}).sort({createdAt : -1});
        res.json(pending);
    }catch(err){
        res.status(500).json({message : err.message});
    }
})

router.get('/userAcceptedOrders', verifyUser, async(req, res) => {
    try{
        const pending = await Order.find({user : req.user.id, 'status' : 'Accepted'}).sort({createdAt : -1});
        res.json(pending);
    }catch(err){
        res.status(500).json({message : err.message});
    }
})

router.get('/userCancelledOrders', verifyUser, async(req, res) => {
    try{
        const cancelled = await Order.find({user : req.user.id, 'status' : 'Cancelled'}).sort({createdAt : -1});
        res.json(cancelled);
    }catch(err){
        res.status(500).json({message : err.message});
    }
})




// seller routes

router.get('/sellerOrders', verifySeller, async (req, res) => {
    try{
        const orders = await Order.find({'items.sellerId' : req.user.id}).sort({createdAt : -1});
        res.json(orders);
    } catch(err){
        res.status(500).json({message : err.message});
    }
})

router.get('/sellerPendingOrders', verifySeller, async(req, res) => {
    try{
        const pending = await Order.find({'items.sellerId' : req.user.id, 'status' : 'Pending'}).sort({createdAt : -1});
        res.json(pending);
    }catch(err){
        res.status(500).json({message : err.message});
    }
})

router.get('/sellerAcceptedOrders', verifySeller, async(req, res) => {
    try{
        const pending = await Order.find({'items.sellerId' : req.user.id, 'status' : 'Accepted'}).sort({createdAt : -1});
        res.json(pending);
    }catch(err){
        res.status(500).json({message : err.message});
    }
})

router.get('/sellerCancelledOrders', verifySeller, async(req, res) => {
    try{
        const cancelled = await Order.find({'items.sellerId' : req.user.id, 'status' : 'Cancelled'}).sort({createdAt : -1});
        res.json(cancelled);
    }catch(err){
        res.status(500).json({message : err.message});
    }
})

router.patch('/acceptOrder', verifySeller, async(req, res) => {
    try{
        const { _id } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            _id,
            {status : "Accepted"},
            {new : true}
        );
        res.status(200).json({message : "Order accepted successfully"});
    }catch(err){
        res.status(500).json({message : err.message});
    }
})

router.patch('/cancelOrder', verify, async(req, res) => {
    try{
        const { _id } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            _id,
            {status : "Cancelled"},
            {new : true}
        );
        res.status(200).json({message : "Order cancelled"});
    }catch(err){
        res.status(500).json({message : err.message});
    }
})

module.exports = router;