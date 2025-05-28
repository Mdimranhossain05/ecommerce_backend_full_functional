const {Schema, model} = require('mongoose');

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        unique: true,
        min: [3, "Product name should at least of 3 characters"],
        max: [31, "Product name should not be more than 31 characters"],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        trim: true,
        min: [8, "Product description should at least of 8 characters"],
        max: [150, "Product name should not be more than 31 characters"],
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        trim: true,
        validate: {
            validator: (v) => v > 0,
            message: (props) => 
                `${props} is not a valid price. Price must be greater than 0.`
        }
    },
    quantity: {
        type: Number,
        required: [true, "Product quantity is required"],
        trim: true,
        validate: {
            validator: (v) => v > 0,
            message: (props) => 
                `${props} is not a valid quantity. Quantity must be greater than 0.`
        }
    },
    sold: {
        type: Number,
        required: [true, "Sold quantity is required"],
        trim: true,
        default: 0,
        validate: {
            validator: (v) => v > 0,
            message: (props) => 
                `${props} is not a valid sold quantity. Sold quantity must be greater than 0.`
        }
    },
    shipping: {
        type: Number,
        trim: true,
        default: 0,
    },
    image: {
        type: String,
        default: "public/images/products/product_default.jpg",
    },
    category: {
        type:Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, {timestamps: true});

const productModel = model("Product", productSchema);


module.exports = productModel;