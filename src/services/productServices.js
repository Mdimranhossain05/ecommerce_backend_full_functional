const productModel = require("../models/productModel");
const slugify = require("slugify");
const createError = require('http-errors');
const { MAX_FILE_SIZE } = require("../config/configs");
const fs = require("fs/promises");
const cloudinary = require("../config/cloudinary");
const { deleteImageFromCloudinary } = require("../helper/cloudinaryHelper");


const createProductService = async (productData) => {
    try {
        productData.slug = slugify(productData.name);

        const isProductExist = await productModel.exists({ slug: productData.slug });
        if (isProductExist) {
            throw createError(403, "Product already exists");
        }

        if (productData.image?.size > MAX_FILE_SIZE) {
            throw createError(400, "Image file is oversized. The size should be maximum 2MB");
        }
        if(productData.image != "public/images/products/product_default.jpg"){
            const response = await cloudinary.uploader.upload(productData.image, {
                folder: "ecommerceMern/products"
            });
            productData.image = response.secure_url;
        }

        // productData = { name, slug, description, price, quantity, sold, shipping, category, image}

        const createdProduct = await productModel.create(productData);
        if (!createdProduct) {
            throw createError(402, "Product was not created");
        }

        return createdProduct;

    } catch (error) {
        throw error;
    }
}

const findProductsService = async (search, page, limit) => {
    try {
        const searchRegExp = new RegExp(".*" + search + ".*", "i");
        const filter = {
            $or: [
                { name: { $regex: searchRegExp } },
                { slug: { $regex: searchRegExp } },
            ]
        };

        const products = await productModel.find(filter).populate("category").limit(limit).skip((page - 1) * limit);
        //throwing error if products not found
        if (!products || products.length == 0) {
            throw createError(404, "Products not found. Try again with valid search");
        }

        const count = await productModel.find(filter).countDocuments();

        const pagination = {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            prevPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        }

        return { products, pagination };

    } catch (error) {
        throw error;
    }
}

const findProductBySlugService = async (slug) => {
    try {

        const product = await productModel.findOne({ slug });
        //throwing error if users not found
        if (!product) {
            throw createError(404, "Product not found. Try again with valid slug");
        }
        return product;

    } catch (error) {
        throw error;
    }
}

const updateProductBySlugService = async (req, slug) => {
    try {
        //checking id the ID is valid or not
        const product = await productModel.findOne({ slug });
        if (!product) {
            throw createError(404, "Product was not found by this slug");
        }

        //declaring options for update
        const updateOptions = { new: true, runValidators: true, context: "query" };

        //collecting updates data
        let updates = {};
        const reqBody = req.body;
        const acceptedFields = ["name", "description", "price", "quantity", "sold", "shipping", "category"];
        for (let key in reqBody) {
            if (acceptedFields.includes(key)) {
                updates[key] = reqBody[key];
            }
            if (key == "name") {
                updates["slug"] = slugify(reqBody[key]);
            }
        };
        const image = req.file?.path;
        if (image) {
            if (image.size > MAX_FILE_SIZE) {
                throw createError(400, "Image file is oversized. The size should be maximum 2MB");
            }

            //deleting previous image
            if (product.image != "public/images/products/product_default.jpg") {
                await deleteImageFromCloudinary("products", product.image, productModel);
            }

            //adding new image to updates
            const response = await cloudinary.uploader.upload(image, {
                folder: "ecommerceMern/products"
            });
            updates.image = response.secure_url;
        }

        //checking if there is nothing to update
        if (Object.keys(updates).length === 0) {
            throw createError(400, "Nothing to update");
        }

        //calling update method of mongoose
        const updatedProduct = await productModel.findOneAndUpdate({ slug }, updates, updateOptions);
        if (!updatedProduct) {
            throw createError(404, "User was not updated");
        }

        return updatedProduct;

    } catch (error) {
        throw error;
    }
}

const deleteProductBySlugService = async (slug) => {
    try {

        //checking id the ID is valid or not
        const isProductExist = await productModel.exists({ slug });
        if (!isProductExist) {
            throw createError(404, "Product was not found by this slug");
        }

        const deletedProduct = await productModel.findOneAndDelete({ slug });
        //throwing error if users not found
        if (!deletedProduct) {
            throw createError(404, "Product was not deleted. Try again with valid slug");
        }

        if (deletedProduct.image != "public/images/products/product_default.jpg") {
            // await fs.unlink(deletedProduct.image)
            await deleteImageFromCloudinary("products", deletedProduct.image, productModel);
        }

        return deletedProduct;

    } catch (error) {
        throw error;
    }
}

module.exports = {
    createProductService, findProductsService, findProductBySlugService, updateProductBySlugService,
    deleteProductBySlugService
}