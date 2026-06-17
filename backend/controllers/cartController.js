const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const addToCart = async (req, res) => {
    try {
        const { productId, count } = req.body;
        if (!productId) return res.status(400).json({ message: "Product id is required" });
        if (!Number.isInteger(count) || count === 0) {
            return res.status(400).json({ message: "Count must be a non-zero whole number" });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(400).json({ message: "Product doesn't exist" });
        if (product.count < 1) return res.status(400).json({ message: "Product is out of stock" });

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) cart = new Cart({ user: req.user.id, items: [] });

        let capped = false;
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            let newCount = cart.items[itemIndex].count + count;
            if (newCount < 1) newCount = 1;                 // never drop below 1 via +/- buttons
            if (newCount > product.count) { newCount = product.count; capped = true; }
            cart.items[itemIndex].count = newCount;
        } else if (count > 0) {
            let initial = count;
            if (initial > product.count) { initial = product.count; capped = true; }
            cart.items.push({ productId, count: initial });
        }

        await cart.save();
        res.json({ cart, capped, message: capped ? `Only ${product.count} in stock` : undefined });
    } catch (err) {
        res.json({ message: err.message });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.productId', '_id name price');
        if (!cart || cart.items.length === 0) return res.json({ message: "Your cart is empty" });

        // Drop items whose product was deleted by the seller.
        const validItems = cart.items.filter(item => item.productId !== null);
        let invalidCount = 0;
        if (validItems.length !== cart.items.length) {
            invalidCount = cart.items.length - validItems.length;
            cart.items = validItems;
            await cart.save();
        }

        const cartDetails = cart.items.map(item => ({
            _id: item.productId._id,
            userId: req.user.id,
            name: item.productId.name,
            price: item.productId.price,
            count: item.count
        }));
        res.json({ items: cartDetails, removedItems: invalidCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateCount = async (req, res) => {
    try {
        const { productId, count } = req.body;
        if (!Number.isInteger(count) || count < 1) {
            return res.status(400).json({ message: "Count must be a positive whole number" });
        }
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ message: "Product not found" });

        const capped = count > product.count;
        cart.items[itemIndex].count = capped ? product.count : count;

        await cart.save();
        res.json({ message: capped ? `Only ${product.count} in stock` : "Count updated successfully", capped });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const removeItem = async (req, res) => {
    try {
        const { productId } = req.body;
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ message: "Item not found" });
        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        cart.items = [];
        await cart.save();
        res.json({ message: "All items removed from cart" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getTotal = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.productId');
        if (!cart) return res.status(400).json({ message: "Cart is empty" });
        let total = 0;
        cart.items.forEach(item => { total += item.count * item.productId.price; });
        res.json({ total });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { addToCart, getCart, updateCount, removeItem, clearCart, getTotal };
