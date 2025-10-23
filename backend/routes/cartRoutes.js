const express = require('express');
const router = express.Router();
const {verifyUser} = require('../middleware/authMiddleware');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

router.post('/add', verifyUser, async (req, res)=>{
    try{
        const {productId, count} = req.body;
        
        const product = await Product.findById(productId);
        if(!product) return res.status(400).json({message : "Product doesn't exist"});

        let cart = await Cart.findOne({user : req.user.id});
        if(!cart) cart = new Cart({user : req.user.id, items : []});
        
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if(itemIndex > -1) cart.items[itemIndex].count += count;
        else cart.items.push({productId, count});

        await cart.save();
        res.json(cart);
    } catch(err){
        res.json({message : err.message});
    }
})

router.get('/', verifyUser, async (req, res)=>{
    try{
        const cart = await Cart.findOne({user : req.user.id}).populate('items.productId', '_id name price');
        if(!cart || cart.items.length === 0) return res.json({message : "Your cart is empty"});
        const validItems = cart.items.filter(item => item.productId !== null);      // to remove some items if they were removed by seller
        let invalidCount = 0;
        if(validItems.length !== cart.items.length){
            invalidCount = cart.items.length - validItems.length;
            cart.items = validItems;
            await cart.save();
        }
        const cartDetails = cart.items.map(item => ({
            _id : item.productId._id,
            userId : req.user.id,
            name : item.productId.name,
            price : item.productId.price,
            count : item.count
        }))
        res.json({
            items : cartDetails,
            removedItems : invalidCount
        });
    } catch(err){
        res.status(500).json({message : err.message});
    }
})

router.patch('/update', verifyUser, async (req, res)=>{
    try{
        const {productId, count} = req.body;
        let cart = await Cart.findOne({user : req.user.id});
        if(!cart) res.status(500).json({message : "Cart not found"});
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if(itemIndex > -1) cart.items[itemIndex].count = count;
        else return res.status(500).json({message : "Product not found"});

        await cart.save();
        res.json({message : "Count updated successfully"});
    } catch(err){
        res.status(500).json({message : err.message});
    }
})

router.delete('/remove', verifyUser, async (req, res)=>{
    try{
        const {productId} = req.body;
        let cart = await Cart.findOne({user : req.user.id});
        if(!cart) return res.status(404).json({message : "Cart not found"});
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if(itemIndex === -1) return res.status(404).json({message : "Item not found"});
        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.json(cart);
    } catch(err){
        res.status(400).json({message : err.message});
    }
})

router.delete('/clearAll', verifyUser, async (req, res) => {
    try{
        let cart = await Cart.findOne({user : req.user.id});
        cart.items = [];
        await cart.save();
        res.json({message : "All items removed from cart"});
    } catch(err){
        res.status(400).json({message : err.message});
    }
})

router.get('/total', verifyUser, async (req, res) => {
    try{
        let cart = await Cart.findOne({user : req.user.id}).populate('items.productId');
        if(!cart) return res.status(400).json({message : "Cart is empty"});
        let total = 0;
        cart.items.forEach(item => {
            total += item.count * item.productId.price;
        })
        res.json({total});
    } catch(err){
        res.status(400).json({message : err.message});
    }
})

module.exports = router;