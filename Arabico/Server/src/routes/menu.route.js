const route = require('express').Router();
const menuController = require('../controllers/menu.controller');
const authenticate = require('../middlewares/auth.middleware');
const { createMenuValidationRules } = require('../validators/menu.validation');
const { validateResults } = require('../validators/user.validation');
const { authorize } = require('../middlewares/role.middleware');


route.post('/', createMenuValidationRules, validateResults, authenticate, authorize('admin'), menuController.createMenu);

module.exports = route;