const { products, users } = require("../data");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel")

const seedUserController = async(req, res, next)=>{
    try {
        //deleting all previous users
        await userModel.deleteMany();

        //inserting users from data
        await userModel.insertMany(users)
        .then((data) =>  res.status(200).json(data))
        .catch((err)=> res.status(500).json({error: err.message}));
    } catch (error) {
        next(error);
    }
}

const seedProductsController = async (req, res, next) => {
    try {
        //deleting all previous products
        await productModel.deleteMany();

        //inserting products from data
        await productModel.insertMany(products)
        .then((data) =>  res.status(200).json(data))
        .catch((err)=> res.status(500).json({error: err.message}));
    } catch (error) {
        next(error);
    }
}

module.exports = {seedUserController, seedProductsController};