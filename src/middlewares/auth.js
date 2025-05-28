const { successResponse } = require("../controllers/responseController");
const createError = require("http-errors");
const { decodeJsonWebToken } = require("../helper/jsonWebToken");
const { jwtAccessKey } = require("../secret");
const { findById } = require("../models/userModel");

const isLoggedIn = (req, res, next) => {
    try {
        //getting token from req
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            throw createError(401, "Access token not found. Please login.");
        }

        //decoding token
        const decoded = decodeJsonWebToken(accessToken, jwtAccessKey);
        if (!decoded) {
            throw createError(401, "Invalid access token, Please login.");
        };

        //setting userId in req
        req.user = decoded.user;

        //moving to next middleware
        next();

    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

const isLoggedOut = (req, res, next) => {
    try {
        //getting token from req
        const accessToken = req.cookies.accessToken;
        if (accessToken) {
            try {
                const decoded = decodeJsonWebToken(accessToken, jwtAccessKey);
                if (decoded) {
                    throw createError(400, "User should logout first.");
                };
            } catch (error) {
                throw error;
            }
        }

        //moving to next middleware
        next();

    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

const isAdmin = (req, res, next) => {
    try {
        if(!req.user?.isAdmin){
            throw createError(403, "Forbidden, You must be an admin to access this resource.");
        }

        //moving to next middleware
        next();

    } catch (error) {
        console.log(error.message);
        next(error);
    }
}

module.exports = { isLoggedIn, isLoggedOut, isAdmin };