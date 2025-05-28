const express = require('express');
const categoryRouter = express.Router();
const { handleCreateCategory, handleGetAllCategories, handleGetCategoryBySlug, handleUpdateCategoryBySlug, handleDeleteCategoryBySlug, handleCategorySeed } = require('../controllers/categoryController');
const { validateCategory } = require('../validators/category');
const { runValidation } = require('../validators');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');




categoryRouter.post("/", validateCategory, runValidation, isLoggedIn, isAdmin, handleCreateCategory);
categoryRouter.get("/", handleGetAllCategories);
categoryRouter.get("/:slug", handleGetCategoryBySlug);
categoryRouter.put("/:slug", isLoggedIn, isAdmin, handleUpdateCategoryBySlug);
categoryRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteCategoryBySlug);



module.exports = categoryRouter;