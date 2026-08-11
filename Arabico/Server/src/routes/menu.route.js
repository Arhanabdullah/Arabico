const route = require('express').Router();
const menuController = require('../controllers/menu.controller');
const authenticate = require('../middlewares/auth.middleware');
const { createMenuValidationRules, updateMenuValidationRules } = require('../validators/menu.validation');
const { validateResults } = require('../validators/user.validation');
const { authorize } = require('../middlewares/role.middleware');
const { upload } = require('../middlewares/multer.middleware');


route.post('/', authenticate, authorize('admin'), upload.single('image'), createMenuValidationRules, validateResults, menuController.createMenu);
route.get('/', menuController.getAllMenus);
route.get('/:id', menuController.getMenuById);
route.patch('/:id', authenticate, authorize('admin'), upload.single('image'), updateMenuValidationRules, validateResults, menuController.updateMenu);
route.delete('/:id', authenticate, authorize('admin'), menuController.deleteMenu);

module.exports = route;