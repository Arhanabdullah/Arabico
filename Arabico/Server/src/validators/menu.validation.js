const { body } = require('express-validator')
const { validateResults } = require('./user.validation')

const createMenuValidationRules = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string")
        .isLength({ max: 255 })
        .withMessage("Description must be less than 255 characters"),
    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isMongoId()
        .withMessage("Invalid category ID"),
    body("image")
        .optional()
        .isURL()
        .withMessage("Invalid image URL"),
    body("isAvailable")
        .optional()
        .isBoolean()
        .withMessage("isAvailable must be a boolean")
    ,
    validateResults,
]

module.exports = { createMenuValidationRules }