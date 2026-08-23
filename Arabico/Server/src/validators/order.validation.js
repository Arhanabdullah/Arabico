const { body } = require('express-validator');
const { validateResults } = require('./user.validation');

const createOrderValidationRules = [

    // Order type
    body('orderType')
        .notEmpty()
        .withMessage('Order type is required')
        .isIn(['dine_in', 'takeaway', 'delivery'])
        .withMessage('Invalid order type'),

    // Dine-in table
    body('table')
        .if(body('orderType').equals('dine_in'))
        .notEmpty()
        .withMessage('Table is required for dine-in orders')
        .isMongoId()
        .withMessage('Invalid table ID'),

    // Customer name
    body('customerName')
        .if(body('orderType').isIn(['takeaway', 'delivery']))
        .trim()
        .notEmpty()
        .withMessage('Customer name is required'),

    // Customer phone
    body('customerPhone')
        .if(body('orderType').isIn(['takeaway', 'delivery']))
        .trim()
        .notEmpty()
        .withMessage('Customer phone is required')
        .isMobilePhone('any')
        .withMessage('Invalid customer phone number'),

    // Delivery address
    body('deliveryAddress')
        .if(body('orderType').equals('delivery'))
        .trim()
        .notEmpty()
        .withMessage('Delivery address is required'),

    // Order items
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),

    // Menu ID inside each item
    body('items.*.menu')
        .isMongoId()
        .withMessage('Invalid menu ID'),

    // Quantity inside each item
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),

    validateResults
];

module.exports = { createOrderValidationRules };