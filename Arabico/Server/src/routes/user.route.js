const route = require('express').Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { updateUserRoleValidationRules, validateResults } = require('../validators/user.validation');
/** 
 * PUT /:userId/role
 * @description Update the role of a user. Only accessible by admin users.
 * @access Private (Admin only)
*/
route.put('/:userId/', authenticate, authorize('admin'), updateUserRoleValidationRules, validateResults, userController.updateUserRole);

module.exports = route;