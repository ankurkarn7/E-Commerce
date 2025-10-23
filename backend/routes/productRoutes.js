const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

router.get('/', async (req, res) => {
    try{
        const products = await Product.find();
        res.json(products);
    } catch(err){
        res.status(400).json({message : "Server error"});
    }
})

router.get('/search/:name', async (req, res)=>{
    try{
        const regex = new RegExp(req.params.name, 'i');
        const products = await Product.find({name : regex});
        res.json(products);
    } catch(err){
        res.status(500).json({message : "Server error"});
    }
})

module.exports = router;