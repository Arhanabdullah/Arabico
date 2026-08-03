const { body, validationResult } = require('express-validator')
const { validateResults } = require('./user.validation')

const categoryValidationRules = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required")
        .isString()
        .withMessage("Category name must be a string")
        .isLength({ min: 3, max: 20 })
        .withMessage("Category name must be between 3 and 20 characters"),

    body("description")
        .trim()

        .isString()
        .withMessage("Description must be a string")
        .isLength({ min: 10, max: 200 })
        .withMessage("Description must be between 10 and 200 characters"),

    body("isActive")
        .optional()
        .isBoolean(),

    validateResults,
];


module.exports = { categoryValidationRules }