const jwt = require('jsonwebtoken');
const Product = require('../models/productModel');
const User = require('../models/userModel');

const verify = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(400).json({message : "Login first"});
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(decoded.id).select("-password");
        if(!user) return res.status(400).json({message : "User not found"});
        req.user = user;
        req.role = decoded.role;
        next();
    }catch(err){
        return res.status(500).json({message : "Invalid or expired token"});
    }
}

const verifySeller = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(400).json({message : "Access denied. Token not found"});
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        if(req.user.role !== "seller") return res.status(400).json({message : "Access denied. Only for sellers."});
        if(req.params.id){
            const product = await Product.findById(req.params.id);
            if(!product) return res.status(400).json({message : "Product not found"});
            if(product.sellerId.toString() !== req.user.id) return res.status(400).json({message : "Not your product"});
        }
        next();
    } catch(err){
        res.status(500).json({message : "Invalid or expired token"})
    }
}

const verifyUser = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(400).json({message : "Access denied. Token not found"});
    
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        if(req.user.role !== "user") res.status(400).json({message : "Cart is available only for Customers"});
        next();
    } catch(err){
        res.status(500).json({message : "Invalid or expired token"});
    }
}

module.exports = {verify, verifySeller, verifyUser};