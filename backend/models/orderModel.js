const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true},
    items : [{
        productId : {type : mongoose.Schema.Types.ObjectId, ref : 'Product', requried : true},
        name : {type : String, required : true},
        price : {type : Number, required : true},
        count : {type : Number, required : true},
        sellerId : {type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true}
    }],
    totalAmount : {type : Number, required : true},
    status : {type : String, enum:["Pending", "Processing", "Delivered", "Cancelled"], default : 'Pending'},
    createdAt : {type : Date, default : Date.now}
})

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;