const { body } = require("express-validator");

const validateCategory = [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({min: 3, max: 31})
    .withMessage("Category name should be 3-31 character")
];

module.exports = { validateCategory }