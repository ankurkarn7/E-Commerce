const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true},
    items : [{
        count : {type : Number, default : 1},
        productId : {type : mongoose.Schema.Types.ObjectId, ref : 'Product', required : true}
    }] 
})

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;