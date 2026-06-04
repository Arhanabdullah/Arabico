const route = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');


route.post('/register', authController.register);


module.exports = route;