const { body, validationResult } = require('express-validator')

async function validateResults(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}
const registerUserValidationRules = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isString()
        .withMessage("Username must be a string")
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email must be a valid email address"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    validateResults,
];

const loginUserValidationRules = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email must be a valid email address"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    validateResults,
];

const updateUserRoleValidationRules = [
    body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isString()
        .withMessage("Role must be a string")
        .isIn(["admin", "manager", "cashier", "kitchen"])
        .withMessage("Role must be either 'admin', 'manager', 'cashier', or 'kitchen'"),
    validateResults,
];

module.exports = { registerUserValidationRules, loginUserValidationRules, updateUserRoleValidationRules, validateResults }