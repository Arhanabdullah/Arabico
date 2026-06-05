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
            secure: config.secureCookie
        });
        return res.status(201).json({
            message: 'User registered successfully',
            user: { id: newUser._id, username: newUser.username, email: newUser.email }
        });


    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function login(req,res){
    const { email, password } = req.body;
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    if(!token){
        return res.status(401).json({ message: 'Session not found' });
    }
    try {        const decoded = jwt.verify(token, config.jwtSecretKey);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (user.password !== hashedPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const newToken = jwt.sign({ userId: user._id },
            config.jwtSecretKey,
            { expiresIn: '1h' });
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: config.secureCookie
        });
        return res.status(200).json({
            message: 'Login successful',
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }


}

module.exports = { register, login };