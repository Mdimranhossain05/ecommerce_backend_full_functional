const { MAX_FILE_SIZE } = require("../config/configs");
const userModel = require("../models/userModel");
const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const { createJsonWebToken, decodeJsonWebToken } = require("../helper/jsonWebToken");
const sendEmailWithNodeMailer = require("../helper/email");
const { jwtActivationKey, jwtResetPasswordKey, clientURL, jwtAccessKey, jwtRefreshKey } = require("../secret");
const fs = require("fs/promises");
const { setAccessToken, setRefreshToken } = require("../helper/cookie");
const cloudinary = require("../config/cloudinary");
const { publicIdWithoutExtension, deleteImageFromCloudinary } = require("../helper/cloudinaryHelper");


const processRegisterService = async (req) => {
    try {
        
        //getting name, email, password, address, phone from request body
        const { name, email, password, address, phone } = req.body;

        //checking if the user already have account by the email
        const isUserExists = await userModel.exists({ email: email });

        //creating error if user is already exist
        if (isUserExists) {
            throw createError(403, "User already exists, Please sign in");
        }

        //getting the image from request file
        const image = req.file?.path;

        if (image?.size > MAX_FILE_SIZE) {
            throw createError(400, "Image file is oversized. The size should be maximum 2MB");
        }

        //encoding image with base64 method
        // const imageBufferString = image.buffer.toString("base64");

        const tokenPayload = { name, email, password, address, phone};
        
        if(image){
            tokenPayload.image = image;
        }

        //creating JSON Web Token
        const token = createJsonWebToken(tokenPayload, jwtActivationKey, '10m');

        //prepare emai
        const emailData = {
            email,
            subject: "Account activation mail for ecommerce",
            html: `<h2>Hello ${name}</h2>
            <p>Click this <a href="${clientURL}/api/users/verify/${token}" target="_blank">link</a> to activate your account</p>`
        }

        // sending mail for activate account with nodemailer
        try {
            await sendEmailWithNodeMailer(emailData);
        } catch (err) {
            return next(createError(500, `Failed to send varification email ${err.message}`));
        }

        return token;

    } catch (error) {
        throw error;
    }
}

const verifyUserService = async (token) => {
    try {
         //decoding the token
         const decodedToken = decodeJsonWebToken(token, jwtActivationKey);
         if (!decodedToken) {
             throw createError(401, "Unable to verify user");
         }
 
         const image = decodedToken.image;
         if(image){
             const response = await cloudinary.uploader.upload(image, {
                 folder: "ecommerceMern/users"
             });
             decodedToken.image = response.secure_url;
         }
 
         //registering user to database
         const createdUser = await userModel.create(decodedToken);

         return createdUser;
    } catch (error) {
        throw error;
    }
}

const manageUserServices = async (userId, action) => {
    //declaring options for update
    const updateOptions = { new: true, runValidators: true, context: "query" };

    //collecting updates data
    let updates = {};
    let banUnban = "";

    if (action == "ban") {
        updates = { isBanned: true };
        banUnban = "banned"
    } else if (action == "unban") {
        updates = { isBanned: false };
        banUnban = "unbanned"
    } else {
        throw createError(400, "Invalid action. Enter action between ban & unban.");
    }

    //updating user with status update
    const updatedUser = await userModel.findByIdAndUpdate(userId, updates, updateOptions).select("-password");
    if (!updatedUser) {
        throw createError(400, `User was not ${banUnban}`);
    }

    return { updatedUser, banUnban };
}

const findUsersService = async (limit, page, search) => {
    try {
        //creating regex for searching
        const searchRegExp = new RegExp(".*" + search + ".*", "i");

        //creating filter from regex fo searching on name, email & password, isAdmin will not deliver during search
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { name: { $regex: searchRegExp } },
                { email: { $regex: searchRegExp } },
                { phone: { $regex: searchRegExp } },
            ]
        };

        //creating option for hiding password
        const options = {
            password: 0
        }

        //searching users with filter, options and search query if available from request
        const users = await userModel.find(filter, options).limit(limit).skip((page - 1) * limit);

        //throwing error if users not found
        if (!users || users.length == 0) {
            throw createError(404, "Users not found. Try again with valid search");
        }

        //counting all documents for checking if next page is available
        const count = await userModel.find(filter, options).countDocuments();

        //creating pagination
        const pagination = {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            prevPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        }

        return { users, pagination };
    } catch (err) {
        throw err;
    }
}

const findUserByIdService = async (id, options = {}) => {
    try {
        const user = await userModel.findById(id, options);

        if (!user) {
            throw createError(404, `User was not found`);
        }
        return user;

    } catch (error) {
        throw error;
    }
}

const deleteUserByIdService = async (id) => {
    try {
        const deletedUser = await userModel.findOneAndDelete({ _id: id, isAdmin: false });

        if (!deletedUser) {
            throw createError(404, `User was not deleted. Please try again.`);
        }
        if(deletedUser.image != "public/images/users/user_default.jpg"){
            // await fs.unlink(deletedUser.image);
            await deleteImageFromCloudinary("users", deletedUser.image, userModel);
        }
        return deletedUser;

    } catch (error) {
        throw error;
    }
}

const updateUserByIdService = async (id, req, res) => {
    try {
        //checking id the ID is valid or not
        const user = await findUserByIdService(id, { password: 0 });

        //declaring options for update
        const updateOptions = { new: true, runValidators: true, context: "query" };

        //collecting updates data
        let updates = {};
        const reqBody = req.body;
        for (let key in reqBody) {
            if (["name", "password", "phone", "address"].includes(key)) {
                updates[key] = reqBody[key];
            }
            else if (["email"].includes(key)) {
                throw createError(400, "Email can not updated");
            }
        };
        const image = req.file?.path;
        if (image) {
            if (image.size > MAX_FILE_SIZE) {
                throw createError(400, "Image file is oversized. The size should be maximum 2MB");
            }
            if(user.image != "public/images/users/user_default.jpg"){
                await deleteImageFromCloudinary("users", user.image, userModel);
            }
            //adding new image to updates
            const response = await cloudinary.uploader.upload(image, {
                folder: "ecommerceMern/users"
            });
            updates.image = response.secure_url;
        }

        //checking if there is nothing to update
        if (Object.keys(updates).length === 0) {
            throw createError(400, "Nothing to update");
        }

        //calling update method of mongoose
        const updatedUser = await userModel.findByIdAndUpdate(id, updates, updateOptions).select("-password");
        if (!updatedUser) {
            throw createError(404, "User was not updated");
        }

        //creating access token
        const accessToken = createJsonWebToken({ user : updatedUser }, jwtAccessKey, '5m');
        setAccessToken(res, accessToken);

        //creating refresh token
        const refreshToken = createJsonWebToken({ user : updatedUser }, jwtRefreshKey, '7d');
        setRefreshToken(res, refreshToken);
        
        return updatedUser;

    } catch (error) {
        throw error;
    }
}

const updateUserPasswordService = async (email, oldPassword, newPassword, confirmPassword, id) => {
    try {
        const user = await findUserByIdService(id, { paswsword: 0 });

        if (!user) {
            throw createError(400, "User was not found");
        }

        const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
        if (user.email != email || !isPasswordMatched) {
            throw createError(400, "wrong email or passowrd");
        }

        if (newPassword != confirmPassword) {
            throw createError(400, "New password and confirm password did not match.");
        }

        //calling update method of mongoose
        const updatedUser = await userModel.findByIdAndUpdate(id, { password: newPassword }, { new: true }).select("-password");
        if (!updatedUser) {
            throw createError(404, "User was not updated");
        }
        return updatedUser;
    } catch (error) {
        throw error;
    }
}

const forgetPasswordService = async (email) => {
    try {
        const userData = await userModel.findOne({ email: email });

        if (!userData) {
            throw createError(404, "Email is incorrect or you have not activate your accout.");
        }

        //creating JSON Web Token
        const token = createJsonWebToken({email : email}, jwtResetPasswordKey, '10m');

        //prepare emai
        const emailData = {
            email: email,
            subject: "Reset password mail for ecommerce",
            html: `<h2>Hello ${userData.name}</h2>
            <p>Click this <a href="${clientURL}/api/users/verifyForgetPassword/${token}" target="_blank">link</a> to reset your password</p>`
        }

        //sending mail for activate account with nodemailer
        try {
            await sendEmailWithNodeMailer(emailData);
        } catch (err) {
            throw createError(500, `Failed to send varification email ${err.message}`);
        }

        return token;
    } catch (error) {
        throw error;
    }
}

const verifyForgetPasswordService = async(token, newPassword, confirmPassword) => {
    try {
         //decoding the token
         const decodedToken = decodeJsonWebToken(token, jwtResetPasswordKey);
         if (!decodedToken) {
             throw createError(401, "Unable to verify user");
         }
 
         if(newPassword != confirmPassword){
             throw createError(400, "New Password and confirm password did not match.")
         }
 
         const updatedUser = await userModel.findOneAndUpdate({email: decodedToken.email}, { password: newPassword }, { new: true }).select("-password");
         if(!updatedUser){
             throw createError(401, "User is not available");
         }
         return updatedUser;
    } catch (error) {
        throw error;
    }
}

module.exports = { processRegisterService, verifyUserService,  manageUserServices, findUsersService, findUserByIdService, 
    deleteUserByIdService, updateUserByIdService, updateUserPasswordService, forgetPasswordService, 
    verifyForgetPasswordService }