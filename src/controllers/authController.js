const { setAccessToken, setRefreshToken } = require("../helper/cookie");
const { createJsonWebToken, decodeJsonWebToken } = require("../helper/jsonWebToken");
const userModel = require("../models/userModel");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");
const { successResponse } = require("./responseController");
const bcrypt = require('bcryptjs');
const createError = require('http-errors');

//handle login
const handleLogin = async (req, res, next) => {
    try {
        //taking the email and password from request body
        const email = req.body.email;
        const password = req.body.password;

        //checking if the user existed by the email. using lean method to access deleete operation on user obj
        const user = await userModel.findOne({ email }).lean();
        if (!user) {
            throw new Error("Email is not registered. Please register first.");
        }

        //checking if the password is correct for the email user
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            throw new Error("Email and Password did not match");
        }

        //checking if the user is banned
        if(user.isBanned){
            throw new Error("You are banned. Please contact authority.");
        }

        //creating access token
        const accessToken = createJsonWebToken({ user }, jwtAccessKey, '5m');
        setAccessToken(res, accessToken);

        //creating refresh token
        const refreshToken = createJsonWebToken({ user }, jwtRefreshKey, '7d');
        setRefreshToken(res, refreshToken);

        //deleting password from user to hide from user
        delete user.password;

        //sending response
        successResponse(res, {
            statusCode: 200,
            message: "Login successfull",
            payload: {accessToken, refreshToken, user}
        });
    } catch (error) {
        console.log(`${error.message}`);
        next(error);
    }
}

//handle logout
const handleLogout = async (req, res, next) => {
    try {
        //clearing cookie from response
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        //sending response
        successResponse(res, {
            statusCode: 200,
            message: "User log out successfull",
        });
    } catch (error) {
        console.log(`${error.message}`);
        next(error)
    }
}

//refresh token
const handleRefreshToken = async(req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        const decodedToken = decodeJsonWebToken(refreshToken, jwtRefreshKey);
        if(!decodedToken){
            throw createError(401, "Invalid refresh token. Please login again.");
        }

        //creating login token
        const accessToken = createJsonWebToken({user: decodedToken.user}, jwtAccessKey, '5m');
        setAccessToken(res, accessToken);

        //sending response
        successResponse(res, {
            statusCode: 200,
            message: `User refresh token successfull`,
            // payload: updatedUser
        });

    } catch (error) {
        next(error);
    }
}

//refresh token
const handleProtectedRoute = async(req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        const decodedToken = decodeJsonWebToken(accessToken, jwtAccessKey);
        if(!decodedToken){
            throw createError(401, "Invalid access token. Please login first.");
        }

        delete decodedToken.password;

        //sending response
        successResponse(res, {
            statusCode: 200,
            message: `User protected route hitted successfully`,
            payload: decodedToken
        });

    } catch (error) {
        throw error;
    }
}

//if I need, then we will set this up
//get profile
const handleGetProfile = async (req, res, next) => {
    try {
        //taking the email from request body
        const email = req.body.email;

        //checking if the user existed by the email. using lean method to access deleete operation on user obj
        const user = await userModel.findOne({ email }).lean();
        if (!user) {
            throw new Error("Email is not registered. Please register first.");
        }

        //checking if the user is banned
        if(user.isBanned){
            throw new Error("You are banned. Please contact authority.");
        }

        //deleting password from user to hide from user
        delete user.password;

        //sending response
        successResponse(res, {
            statusCode: 200,
            message: "Logined user profile got successfully",
            payload: {user}
        });
    } catch (error) {
        console.log(`${error.message}`);
        next(error);
    }
}



module.exports = { handleLogin, handleLogout, handleRefreshToken, handleProtectedRoute, handleGetProfile }