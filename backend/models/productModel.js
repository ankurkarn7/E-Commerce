const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {type : String, required : true},
    price : {type : Number, required : true},
    count : {type : Number, required : true},
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;