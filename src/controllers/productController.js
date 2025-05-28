const { createProductService, findProductsService, findProductBySlugService, updateProductBySlugService, deleteProductBySlugService } = require("../services/productServices");
const { successResponse } = require("./responseController");

const handleCreateProduct = async (req, res, next) => {
    try {
        const productData = req.body;
        const image = req.file?.path;
        if(image){
            productData.image = image;
        }

        const createdProduct = await createProductService(productData);

        successResponse(res, {
            statusCode: 200,
            message: `Product added successfully`,
            payload: createdProduct
        });

    } catch (error) {
        next(error);
    }
}

const handleGetProducts = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 4;

        const {products, pagination} = await findProductsService(search, page, limit);

        successResponse(res, {
            statusCode: 200,
            message: "Successfully got products",
            payload: {products, pagination}
        });

    } catch (error) {
        next(error);
    }
}

const handleGetProductBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;

        const product = await findProductBySlugService(slug);

        successResponse(res, {
            statusCode: 200,
            message: "Successfully got the product",
            payload: product
        });

    } catch (error) {
        next(error);
    }
}

const handleUpdateProductBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;

        const updatedProduct = await updateProductBySlugService(req, slug);

        successResponse(res, {
            statusCode: 200,
            message: "Successfully updated the product",
            payload: updatedProduct
        });

    } catch (error) {
        next(error);
    }
}

const handleDeleteProductBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;

        const deletedProduct = deleteProductBySlugService(slug);

        successResponse(res, {
            statusCode: 200,
            message: "Successfully deleted the product",
            payload: deletedProduct
        });

    } catch (error) {
        next(error);
    }
}


module.exports = { handleCreateProduct, handleGetProducts, handleGetProductBySlug, handleUpdateProductBySlug,
    handleDeleteProductBySlug }