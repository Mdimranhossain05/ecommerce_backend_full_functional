const { body } = require("express-validator");

const validateCreateProduct = [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required.")
    .isLength({min: 3, max: 31})
    .withMessage("Category name should be 3-31 character"),

    body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required.")
    .isLength({min: 8, max: 350})
    .withMessage("Product description should be 8-350 character"),

    body("price")
    .trim()
    .notEmpty()
    .withMessage("Product price is required."),

    body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Product quantity is required."),

    body("sold")
    .trim(),

    body("shipping")
    .trim(),

    body("category")
    .trim()
    .notEmpty()
    .withMessage("Product category is required."),

    // body("image")
    // .custom((value, {req}) => {
    //     if(!req.file || !req.file.buffer){
    //         throw new Error("User image is required");
    //     }
    //     return true;
    // }).withMessage("User image is required")

    body("image")
    .optional().isString()
    .withMessage("Image path should b a valid string")
];

module.exports = {validateCreateProduct}