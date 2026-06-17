const Product = require('../models/productModel');

const addProduct = async (req, res) => {
    try {
        const { name, price, count } = req.body;
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: "Product name is required" });
        }
        if (!Number.isFinite(price) || price < 0) {
            return res.status(400).json({ message: "Price must be a non-negative number" });
        }
        if (!Number.isInteger(count) || count < 1) {
            return res.status(400).json({ message: "Quantity must be a positive whole number" });
        }

        const existingProduct = await Product.findOne({ name, sellerId: req.user.id });
        if (existingProduct) {
            existingProduct.count += count;
            existingProduct.price = price;
            await existingProduct.save();
            return res.json({ message: "Product already exists, previous count is incremented by current count", product: existingProduct });
        }

        await new Product({ name, price, count, sellerId: req.user.id }).save();
        res.json({ message: "Product added successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: "Product id is required" });

        const product = await Product.findById(id);
        if (!product) return res.status(400).json({ message: "Product not found" });
        if (product.sellerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not your product" });
        }

        await Product.findByIdAndDelete(id);
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const editProduct = async (req, res) => {
    try {
        const { id, updates } = req.body;
        if (!id || !updates || typeof updates !== 'object') {
            return res.status(400).json({ message: "Product id and updates are required" });
        }
        if ('name' in updates && (typeof updates.name !== 'string' || !updates.name.trim())) {
            return res.status(400).json({ message: "Product name cannot be empty" });
        }
        if ('price' in updates && (!Number.isFinite(updates.price) || updates.price < 0)) {
            return res.status(400).json({ message: "Price must be a non-negative number" });
        }
        if ('count' in updates && (!Number.isInteger(updates.count) || updates.count < 0)) {
            return res.status(400).json({ message: "Quantity must be a non-negative whole number" });
        }

        // Only the owning seller may edit their product.
        const product = await Product.findById(id);
        if (!product) return res.status(400).json({ message: "Product not found" });
        if (product.sellerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not your product" });
        }

        const updated = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        res.json({ message: "Product updated successfully", product: updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.user.id }).select("_id name price count");
        res.json(products);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { addProduct, deleteProduct, editProduct, getMyProducts };
