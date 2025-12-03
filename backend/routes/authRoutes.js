const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {verify} = require('../middleware/authMiddleware');


router.post('/signup', async (req, res)=>{
    try{
        const {name, email, password, role} = req.body;
        const alredyExist = await User.findOne({email});
        if(alredyExist) return res.json({message : "User alredy exists"});
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({name, email, password:hashedPassword, role});
        await newUser.save();
        res.json({message : "User added successfully. Login now to continue to buy products."});
    }catch(err){
        res.status(500).json({message : "Server error"});
    }
})


router.post('/login', async (req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message : "User not found"});
        bcrypt.compare(password, user.password, (err, result)=>{
            if(result){
                let token = jwt.sign({email, role:user.role, id:user._id}, process.env.JWT_SECRET);
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    path: "/",  
                });
                return res.json({
                    message : `Welcome ${user.name}`,
                    user : {            // used in useContext for removing login and signup button after successful login
                        id : user._id,
                        name : user.name,
                        email : user.email,
                        role : user.role
                    }
                })
            } else return res.status(400).json({message : "Incorrect password"});
        })
    }catch(err){
        res.status(500).json({message : "Server error"});
    }
})

router.post('/logout', (req, res)=>{
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    });

    res.send("Logged out successfully");
})

router.get('/verify', verify, (req, res)=>{
    res.json({user : req.user, role : req.role});
})

module.exports = router;