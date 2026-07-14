const route = require('express').Router();
const authController = require('../controllers/auth.controller');
const authenticate = require('../middlewares/auth.middleware');
const { validateResults, registerUserValidationRules } = require('../validators/user.validation')
const { authorize } = require('../middlewares/role.middleware');

route.post('/register', registerUserValidationRules, validateResults,  authController.register);
route.post('/login', registerUserValidationRules, validateResults, authController.login);
route.post('/logout', authenticate,  authController.logout);


module.exports = route;