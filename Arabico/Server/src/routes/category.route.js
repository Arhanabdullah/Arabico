const route = require('express').Router();
const categoryController = require('../controllers/category.controller');
const authenticate = require('../middlewares/auth.middleware');
const {  categoryValidationRules } = require('../validators/category.validation')
const { validateResults } = require('../validators/user.validation')
const { authorize } = require('../middlewares/role.middleware');

route.post('/', categoryValidationRules, validateResults, authenticate, authorize('cashier'), categoryController.create);
route.get('/', authenticate, categoryController.getAll);
route.get('/:id', authenticate, categoryController.getById);
route.put('/:id', categoryValidationRules, validateResults, authenticate, authorize('cashier'), categoryController.update);
route.delete('/:id', authenticate, authorize('cashier'), categoryController.deleteCategory);

module.exports = route;