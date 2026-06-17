const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieOptions = require('../config/cookieOptions');

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }
        if (!["user", "seller"].includes(role)) {
            return res.status(400).json({ message: "Role must be either 'user' or 'seller'" });
        }
        const alreadyExist = await User.findOne({ email });
        if (alreadyExist) return res.status(409).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await new User({ name, email, password: hashedPassword, role }).save();
        res.json({ message: "User added successfully. Login now to continue to buy products." });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign(
            { email, role: user.role, id: user._id },
            process.env.JWT_SECRET
        );
        res.cookie("token", token, cookieOptions);
        res.json({
            message: `Welcome ${user.name}`,
            user: {     // used by AuthContext to toggle login/signup buttons
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const logout = (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.send("Logged out successfully");
};

const verifySession = (req, res) => {
    res.json({ user: req.user, role: req.role });
};

module.exports = { signup, login, logout, verifySession };
