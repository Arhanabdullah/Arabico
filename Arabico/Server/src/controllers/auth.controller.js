const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const generateToken = require('../utils/generateToken');
const setTokenCookie = require('../utils/setTokenCookie');

async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists'
            });
        }

        const hashedPassword = await bcrypt.hashSync(password, 10);
        const newUser = await userModel.create({ username, email, password: hashedPassword });
        const token =  generateToken(newUser._id);
        setTokenCookie(res, token);
        return res.status(201).json({
            message: 'User registered successfully',
            user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
        return res.status(400).json({ message: 'No User found!' });
    }
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    try {
        const token =  generateToken(existingUser._id);

        setTokenCookie(res, token);
        return res.status(200).json({
            message: 'User logged in successfully',
            user: { id: existingUser._id, username: existingUser.username, email: existingUser.email, role: existingUser.role }
        });
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}

async function logout(req, res) {
    res.clearCookie('token');
    return res.status(200).json({ message: 'User logged out successfully' });
}

module.exports = { register, login, logout };