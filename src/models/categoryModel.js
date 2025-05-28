const {Schema, model} = require('mongoose');

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        trim: true,
        unique: true,
        min: [3, "Category name should at least of 3 characters"],
        max: [31, "Category name should not be more than 31 characters"],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },

}, {timestamps: true});

const categoryModel = model("Category", categorySchema);


module.exports = categoryModel;