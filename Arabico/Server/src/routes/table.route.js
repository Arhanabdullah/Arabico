const route = require('express').Router();
const tableController = require('../controllers/table.controller');
const authenticate = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { createTableValidationRules } = require('../validators/table.validation');

route.post('/',authenticate,authorize('admin'),createTableValidationRules, tableController.createTable);
route.get('/', authenticate, authorize('admin'), tableController.getAllTables);
route.get('/:id', authenticate, authorize('admin'), tableController.getTableById);
route.patch('/:id', authenticate, authorize('admin'), tableController.updateTable);
route.delete('/:id', authenticate, authorize('admin'), tableController.deleteTable);

module.exports = route;