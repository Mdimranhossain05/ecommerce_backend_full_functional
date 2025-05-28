const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');
const { defaultImagePath } = require("../secret");

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        min: [3, "Name should at least of 3 characters"],
        max: [31, "Name should not be more than 31 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: [true, "This mail already used"],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        min: [6, "Password should be more than 5 character"],
        set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
        // type: Buffer,
        // contentType: String,
        type: String,
        default: "public/images/users/user_default.jpg",

    },
    address: {
        type: String,
        required: [true, "Address is required"],
        min: [3, "Address should at least of 3 characters"],
        max: [31, "Address should not be more than 31 characters"],
    },
    phone: {
        type: String,
        required: [true, "phone is required"],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBanned: {
        type: Boolean,
        default: false,
    }

}, {timestamps: true});

const userModel = model("User", userSchema);


module.exports = userModel;