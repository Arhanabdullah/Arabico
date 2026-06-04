const userModel = require('../models/user.model');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const hashedPassword = await crypto.createHash('sha256').update(password).digest('hex');
        const newUser = await userModel.create({ username, email, password: hashedPassword });
        const token = jwt.sign({ userId: newUser._id },
            config.jwtSecretKey,
            { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
        return res.status(201).json({
            message: 'User registered successfully',
            user: { id: newUser._id, username: newUser.username, email: newUser.email }
        });


    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = { register };