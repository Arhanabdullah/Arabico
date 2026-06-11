const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authControllerMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                message: 'Unauthorized' 
            });
        }
        const decoded = jwt.verify(token, config.jwtSecretKey);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ 
                message: 'Unauthorized' 
            });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            message: 'Unauthorized', 
            error: error.message 
        });
    }
}

module.exports = { authControllerMiddleware };