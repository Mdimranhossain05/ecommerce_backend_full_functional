const express = require("express");
const seedRouter = express.Router();
const {seedUserController, seedProductsController} = require("../controllers/seedUserController");
const { userImageUpload, productImageUpload } = require("../middlewares/fileUpload");


seedRouter.post("/users", userImageUpload.single("image"), seedUserController);
seedRouter.post("/products", productImageUpload.single("image"), seedProductsController);

module.exports = seedRouter;