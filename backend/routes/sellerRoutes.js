const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {verifySeller} = require('../middleware/authMiddleware');

router.post('/addProduct', verifySeller, async (req, res)=>{
    try{
        const {name, price, count} = req.body;
        const existingProduct = await Product.findOne({name, sellerId:req.user.id});
        if(existingProduct){
            existingProduct.count += count;
            existingProduct.price = price;
            await existingProduct.save();
            return res.json({message : "Product alredy exists, previous count is incremented by current count", product : existingProduct});
        }
        const newProduct = new Product({name, price, count, sellerId:req.user.id});
        await newProduct.save();
        res.json({message : "Product added successfully"});
    } catch(err){
        res.status(400).json({message  : err});
    }
})

router.delete('/deleteProduct/', verifySeller, async (req, res) => {
    try{
        const { id } = req.body;
        await Product.findByIdAndDelete(id);
        res.json({message : "Product deleted successfully"});
    } catch(err){
        res.json({message : err});
    }
})

router.put('/editProduct', verifySeller, async (req, res)=>{
    try{
        const {id, updates} = req.body;
        const updated = await Product.findByIdAndUpdate(id, updates, {new:true});
        if(!updated) return res.status(400).json({message : "Product not found"});
        res.json({message : "Product updated successfully"});
    } catch(err){
        res.json({message : err});
    }
})

router.get('/myProducts', verifySeller, async (req, res)=>{
    try{
        const products = await Product.find({sellerId:req.user.id}).select("_id name price count");
        res.json(products);
    } catch(err){
        res.status(400).json({message : err.message});
    }
})

module.exports = router;