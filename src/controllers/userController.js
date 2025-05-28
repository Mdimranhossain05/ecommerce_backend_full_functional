const { successResponse, errorResponse } = require('./responseController');
const { manageUserServices, findUsersService, findUserByIdService, deleteUserByIdService, updateUserByIdService, updateUserPasswordService, forgetPasswordService, verifyForgetPasswordService, processRegisterService, verifyUserService } = require("../services/userServices");


//getting all users without admins
const handleGetUsers = async (req, res, next) => {
    try {
        //searching user if we get search query
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        //getting all users by findUsersService
        const { users, pagination } = await findUsersService(limit, page, search);

        //sending response
        successResponse(res, {
            statusCode: 200,
            message: "Users were returned successfully",
            payload: {
                users,
                pagination
            }
        });

    } catch (error) {
        next(error);
    }
};

//getting single user by ID
const handleGetUserbyID = async (req, res, next) => {
    try {
        //getting id from request params
        const id = req.params.id;

        //creating options for hiding passwod=rd
        const options = { password: 0 };

        //finding user from DB by findUserByIdService
        const user = await findUserByIdService(id, options);

        //sending response
        successResponse(res, {
            statusCode: 200,
            message: "Successfully got the user",
            payload: {
                user
            }
        });
    } catch (error) {
        next(error);
    }
}

//delete single user
const handleDeleteUserID = async (req, res, next) => {
    try {
        //getting id from request params
        const id = req.params.id;

        //delete the user with deleteWithID function
        const deletedUser = await deleteUserByIdService(id);

        //sending response
        successResponse(res, {
            statusCode: 200,
            message: `User ${deletedUser.name} deleted successfully`,
        });
    } catch (error) {
        next(error);
    }
}

//start process to register an user
const handleProcessRegister = async (req, res, next) => {
    try {

        const token = await processRegisterService(req);

        //sending response
        successResponse(res, {
            statusCode: 200,
            message: `Please go to your email ${req.body.email} for registration`,
            payload: {
                token
            }
        });

    } catch (error) {
        next(error);
    }
}

//verify the user by email 
const handleVerifyUser = async (req, res, next) => {
    try {
        const token = req.body.token;

        const createdUser = await verifyUserService(token);

        successResponse(res, {
            statusCode: 200,
            message: `User successfully registered`,
            payload: createdUser
        });

    } catch (error) {
        next(error);
    }
}

//updating user by ID
const handleUpdateUserByID = async (req, res, next) => {
    try {
        //getting id from req params
        const userId = req.params.id;

        //updating user through updateUserByIdService
        const updatedUser = await updateUserByIdService(userId, req, res);

        //sending response
        successResponse(res, {
            statusCode: 200,
            message: `User ${updatedUser.name} was updated successfully`,
            payload: updatedUser
        });

    } catch (error) {
        next(error);
    }
}

//ban or unban a user by ID (Manage user status)
const handleManageUserByID = async (req, res, next) => {
    try {
        //getting userId and action(ban/unban) from request
        const userId = req.params.id;
        const action = req.body.action?.toLowerCase().trim();

        //updating user from manageUserServices and getting updatedUser and getting ban/unban message
        const { updatedUser, banUnban } = await manageUserServices(userId, action);

        //sending response
        successResponse(res, {
            statusCode: 200,
            message: `User ${updatedUser.name} is ${banUnban} successfully`,
            payload: updatedUser
        });
    } catch (error) {
        next(error);
    }
}

//updating user password by ID
const handleUpdatePassword = async (req, res, next) => {
    try {
        //getting email, oldPassword, newPassword, confirmPassword from request and ID from params
        const { email, oldPassword, newPassword, confirmPassword } = req.body;
        const id = req.params.id;

        //updating password from updateUserPasswordService 
        const updatedUser = await updateUserPasswordService(email, oldPassword, newPassword, confirmPassword, id)

        //sending response
        successResponse(res, {
            statusCode: 200,
            message: `User ${updatedUser.name}'s password updated successfully`,
            payload: updatedUser
        });

    } catch (error) {
        next(error);
    }
}

//sending forgte password mail
const handleForgetPassword = async (req, res, next) => {
    try {
        //getting email from request body
        const email = req.body.email;

        //
        const token = await forgetPasswordService(email);

        //sending response
        successResponse(res, {
            statusCode: 200,
            message: `Please got to your email ${email} to reset your password.`,
            payload: { token }
        });

    } catch (error) {
        next(error);
    }
}

//verify forget password
const handleVerifyForgetPassword = async (req, res, next) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;

        const updatedUser = await verifyForgetPasswordService(token, newPassword, confirmPassword);

        //sending response
        successResponse(res, {
            statusCode: 200,
            message: `User ${updatedUser.name} successfully set new password`,
            payload: updatedUser
        });

    } catch (error) {
        next(error);
    }
}



module.exports = {
    handleGetUsers, handleGetUserbyID, handleDeleteUserID, handleProcessRegister,
    handleVerifyUser, handleUpdateUserByID, handleManageUserByID, handleUpdatePassword,
    handleForgetPassword, handleVerifyForgetPassword
};