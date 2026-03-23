import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import jwt from "jsonwebtoken";


const router = express.Router();

// Register/create user
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({message: "Please complete form"})
        }
        const userExists = await User.findOne({email});
        if (userExists){
            return res.status(400).json({message: "User already exists"});
        }

        const user = await User.create
        const token = generateToken(user._id);
        ({username, email, password});
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token,
        })
    }
    catch (err) {
        res.status(500).json({message:"Server error"})
    }
})

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password){
            return res
                .status(400)
                .json({ message: "Missing credentials" });
        }
        const user = await User.findOne({email});

        if (!user || !(await user.matchPassword(password))){
            return res
                .status(401)
                .json({ message: "Credentials do not match" });
        }
        const token = generateToken(user._id);
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token
        })
    }
    catch (err) {
        res.status(500).json({message:"Server error"})
    }
});

// Me (Needs protected)
router.get("/me", protect, async (req, res) => {
    res.status(200).json(req.user)
});

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"})
}

export default router;