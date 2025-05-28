const categoryModel = require("../models/categoryModel");
const createError = require('http-errors');
const slugify = require("slugify");


const createCategoryService = async (categoryName) => {
    try {
        
        const newCategory = await categoryModel.create({
            name: categoryName,
            slug:slugify(categoryName),
        });

        if(!newCategory){
            throw createError(401, "Category was not created");
        }

        return newCategory;

    } catch (error) {
        throw error;
    }
}

const getAllCategoriesService = async () => {
    try {
        
        const allCategories = await categoryModel.find().select('name slug').lean();

        if(!allCategories){
            throw createError(400, "Categories are empty");
        }

        return allCategories;

    } catch (error) {
        throw error;
    }
}

const getCategoryBySlugService = async (slug) => {
    try {
        
        const category = await categoryModel.findOne({slug: slug}).select('name slug').lean();

        if(!category){
            throw createError(400, "Category was not found");
        }

        return category;

    } catch (error) {
        throw error;
    }
}

const updateCategoryBySlugService = async (slug, categoryName) => {
    try {
        
        const updatedCategory = await categoryModel.findOneAndUpdate({ slug }, 
            {$set:{name: categoryName, slug: slugify(categoryName)}}, {new: true}).select('name slug').lean();

        if(!updatedCategory){
            throw createError(400, "Category was not updated");
        }

        return updatedCategory;

    } catch (error) {
        throw error;
    }
}

const deleteCategoryBySlugService = async (slug) => {
    try {
        
        const deletedCategory = await categoryModel.findOneAndDelete({ slug }).select('name slug').lean();

        if(!deletedCategory){
            throw createError(400, "Category was not deleted");
        }

        return deletedCategory;

    } catch (error) {
        throw error;
    }
}

module.exports = { createCategoryService, getAllCategoriesService, getCategoryBySlugService, 
    updateCategoryBySlugService, deleteCategoryBySlugService }