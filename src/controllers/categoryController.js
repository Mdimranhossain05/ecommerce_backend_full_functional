const { createCategoryService, getAllCategoriesService, getCategoryBySlugService, updateCategoryBySlugService, deleteCategoryBySlugService } = require("../services/categoryService");
const { successResponse } = require("./responseController");


const handleCreateCategory = async (req, res, next) => {
    try {
        const name = req.body.name;

        const newCategory = await createCategoryService(name);

        return successResponse(res, {
            statusCode: 200,
            message: `Successfully ${newCategory.name} category added`,
            payload: newCategory
        });
    } catch (error) {
        next(error);
    }
    
}

const handleGetAllCategories = async (req, res, next) => {
    try {

        const allCategories = await getAllCategoriesService();

        return successResponse(res, {
            statusCode: 200,
            message: "Successfully got all categories",
            payload: allCategories
        });
    } catch (error) {
        next(error);
    }
    
}

const handleGetCategoryBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;

        const category = await getCategoryBySlugService(slug);

        return successResponse(res, {
            statusCode: 200,
            message: "Successfully got the category",
            payload: category
        });
    } catch (error) {
        next(error);
    }
    
}

const handleUpdateCategoryBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;

        const {name} = req.body;

        const updatedCategory = await updateCategoryBySlugService(slug, name);

        return successResponse(res, {
            statusCode: 200,
            message: "Successfully updated the category",
            payload: updatedCategory
        });
    } catch (error) {
        next(error);
    }
    
}

const handleDeleteCategoryBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;

        const deletedCategory = await deleteCategoryBySlugService(slug);

        return successResponse(res, {
            statusCode: 200,
            message: "Category deleted successfully",
            payload: deletedCategory
        });
    } catch (error) {
        next(error);
    }
    
}


module.exports = { handleCreateCategory, handleGetAllCategories, handleGetCategoryBySlug,
     handleUpdateCategoryBySlug, handleDeleteCategoryBySlug}