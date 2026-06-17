const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// ---------- Buyer ----------

const placeOrder = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.productId');
        if (!cart) return res.status(400).json({ message: "Cart doesn't exist" });

        const selectedItem = cart.items.find(item => item.productId && item.productId._id.toString() === productId);
        if (!selectedItem) return res.status(400).json({ message: "Item not found in cart" });

        if (selectedItem.count > selectedItem.productId.count) {
            return res.status(400).json({ message: `Only ${selectedItem.productId.count} left in stock` });
        }

        const order = new Order({
            user: req.user.id,
            items: [{
                productId: selectedItem.productId._id,
                name: selectedItem.productId.name,
                price: selectedItem.productId.price,
                count: selectedItem.count,
                sellerId: selectedItem.productId.sellerId
            }],
            totalAmount: selectedItem.productId.price * selectedItem.count
        });
        await order.save();

        cart.items = cart.items.filter(item => item.productId._id.toString() !== productId);
        await cart.save();
        res.status(201).json({ message: "Your order is placed successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Generic finder used by all the buyer/seller list endpoints below.
const findOrders = (filter) => Order.find(filter).sort({ createdAt: -1 });

const getUserOrders = async (req, res) => {
    try { res.json(await findOrders({ user: req.user.id })); }
    catch (err) { res.status(500).json({ message: err.message }); }
};

const getUserOrdersByStatus = (status) => async (req, res) => {
    try { res.json(await findOrders({ user: req.user.id, status })); }
    catch (err) { res.status(500).json({ message: err.message }); }
};

// ---------- Seller ----------

const getSellerOrders = async (req, res) => {
    try { res.json(await findOrders({ 'items.sellerId': req.user.id })); }
    catch (err) { res.status(500).json({ message: err.message }); }
};

const getSellerOrdersByStatus = (status) => async (req, res) => {
    try { res.json(await findOrders({ 'items.sellerId': req.user.id, status })); }
    catch (err) { res.status(500).json({ message: err.message }); }
};

const acceptOrder = async (req, res) => {
    try {
        const { _id } = req.body;
        const order = await Order.findById(_id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const item = order.items[0];
        if (item.sellerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "This order is not for your product" });
        }
        if (order.status !== "Pending") {
            return res.status(400).json({ message: `Order is already ${order.status}` });
        }

        // Decrement stock only if enough is available. The conditional query
        // guards against two sellers accepting concurrently and overselling.
        const product = await Product.findOneAndUpdate(
            { _id: item.productId, count: { $gte: item.count } },
            { $inc: { count: -item.count } },
            { new: true }
        );
        if (!product) {
            return res.status(400).json({ message: "Not enough stock to accept this order" });
        }

        order.status = "Accepted";
        await order.save();
        res.status(200).json({ message: "Order accepted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { _id } = req.body;
        const order = await Order.findById(_id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const item = order.items[0];
        const isOwnerUser = order.user.toString() === req.user.id;
        const isOwnerSeller = item.sellerId.toString() === req.user.id;
        if (!isOwnerUser && !isOwnerSeller) {
            return res.status(403).json({ message: "You cannot cancel this order" });
        }
        if (order.status === "Cancelled") {
            return res.status(400).json({ message: "Order is already cancelled" });
        }
        if (order.status === "Delivered") {
            return res.status(400).json({ message: "Delivered orders cannot be cancelled" });
        }

        // If the order was accepted, stock was already taken — give it back.
        if (order.status === "Accepted") {
            await Product.findByIdAndUpdate(item.productId, { $inc: { count: item.count } });
        }

        order.status = "Cancelled";
        await order.save();
        res.status(200).json({ message: "Order cancelled" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deliverOrder = async (req, res) => {
    try {
        const { _id } = req.body;
        const order = await Order.findById(_id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const item = order.items[0];
        if (item.sellerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "This order is not for your product" });
        }
        if (order.status !== "Accepted") {
            return res.status(400).json({ message: "Only accepted orders can be marked delivered" });
        }

        order.status = "Delivered";
        await order.save();
        res.status(200).json({ message: "Order marked as delivered" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    placeOrder,
    getUserOrders,
    getUserOrdersByStatus,
    getSellerOrders,
    getSellerOrdersByStatus,
    acceptOrder,
    cancelOrder,
    deliverOrder
};
