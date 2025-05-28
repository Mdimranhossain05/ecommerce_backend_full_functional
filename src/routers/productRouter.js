const express = require("express");
const { handleCreateProduct, handleGetProducts, handleGetProductBySlug, handleUpdateProductBySlug, handleDeleteProductBySlug } = require("../controllers/productController");
const { validateCreateProduct } = require("../validators/product");
const { runValidation } = require("../validators");
const productRouter = express.Router();
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const { productImageUpload } = require("../middlewares/fileUpload");


productRouter.post("/", productImageUpload.single("image"), isLoggedIn, isAdmin, validateCreateProduct, runValidation, handleCreateProduct)
productRouter.get("/",  handleGetProducts);
productRouter.get("/:slug",  handleGetProductBySlug);
productRouter.put("/:slug", productImageUpload.single("image"), isLoggedIn, isAdmin, handleUpdateProductBySlug);
productRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteProductBySlug);


module.exports = productRouter