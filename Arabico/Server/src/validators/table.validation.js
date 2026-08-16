const { body } = require('express-validator')
const { validateResults } = require('./user.validation')

const createTableValidationRules=[
    body('tableNumber')
        .notEmpty()
        .withMessage('Table number is required')
        .isInt({ min: 1 })
        .withMessage('Table number must be a positive integer'),
    body('capacity')
        .notEmpty()
        .withMessage('Table capacity is required')
        .isInt({ min: 1 })
        .withMessage('Table capacity must be a positive integer'),
    validateResults,
]

module.exports = { createTableValidationRules }