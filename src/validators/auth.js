const { body } = require("express-validator");

const validateUserRegistration = [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required. Enter your name.")
    .isLength({min: 3, max: 31})
    .withMessage("Name should be 3-31 character"),

    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email.")
    .isEmail()
    .withMessage("Email feild should be a valid email address"),

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required. Enter a valid password.")
    .isLength({min: 6})
    .withMessage("Password should at least 6 character"),

    //.matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/)
    //.withMessage("Password should contain at least one upper case, one lower case, one digit and one special character."),

    body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required. Enter your password.")
    .isLength({min: 3, max:31})
    .withMessage("Address should be 3-31 character"),

    body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required. Enter your phone number."),

    // body("image")
    // .custom((value, {req}) => {
    //     if(!req.file || !req.file.buffer){
    //         throw new Error("User image is required");
    //     }
    //     return true;
    // }).withMessage("User image is required")

    body("image")
    .optional().isString()
    .withMessage("User image is optional")
];

const validateUserLogin = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email.")
    .isEmail()
    .withMessage("Email feild should be a valid email address"),

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required. Enter a valid password.")
    .isLength({min: 6})
    .withMessage("Password should at least 6 character"),

    //.matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/)
    //.withMessage("Password should contain at least one upper case, one lower case, one digit and one special character."),
];

const validateUserUpdatePassword = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email.")
    .isEmail()
    .withMessage("Email feild should be a valid email address"),

    body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old password is required. Enter a valid password.")
    .isLength({min: 6})
    .withMessage("Password should at least 6 character"),

    //.matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/)
    //.withMessage("Password should contain at least one upper case, one lower case, one digit and one special character."),

    body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required. Enter a valid password.")
    .isLength({min: 6})
    .withMessage("Password should at least 6 character"),

    //.matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/)
    //.withMessage("Password should contain at least one upper case, one lower case, one digit and one special character."),

    body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is required. Enter a valid password.")
    .isLength({min: 6})
    .withMessage("Password should at least 6 character"),

    //.matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/)
    //.withMessage("Password should contain at least one upper case, one lower case, one digit and one special character."),

];

const validateForgetPassword = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email.")
    .isEmail()
    .withMessage("Email feild should be a valid email address"),
];

const validateVerifyForgetPassword = [
    body("token")
    .trim()
    .notEmpty()
    .withMessage("Token should not be empty."),

    body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required. Enter a valid password.")
    .isLength({min: 6})
    .withMessage("Password should at least 6 character"),

    //.matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/)
    //.withMessage("Password should contain at least one upper case, one lower case, one digit and one special character."),

    body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is required. Enter a valid password.")
    .isLength({min: 6})
    .withMessage("Password should at least 6 character"),

    //.matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/)
    //.withMessage("Password should contain at least one upper case, one lower case, one digit and one special character."),

];

module.exports = { validateUserRegistration, validateUserLogin, validateUserUpdatePassword, validateForgetPassword, validateVerifyForgetPassword };