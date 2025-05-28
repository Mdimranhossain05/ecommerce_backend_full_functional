const express = require("express");
const userRouter = express.Router();
const { handleManageUserByID, handleUpdatePassword, handleForgetPassword, handleVerifyForgetPassword, handleGetUsers, handleProcessRegister, handleVerifyUser, handleGetUserbyID, handleDeleteUserID, handleUpdateUserByID } = require("../controllers/userController");
const { userImageUpload } = require("../middlewares/fileUpload");
const { validateUserRegistration, validateUserUpdatePassword, validateForgetPassword, validateVerifyForgetPassword } = require("../validators/auth");
const { runValidation } = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");



userRouter.get("/", isLoggedIn, isAdmin, handleGetUsers);

userRouter.post("/process-register",
    userImageUpload.single("image"),
    isLoggedOut,
    validateUserRegistration,
    runValidation,
    handleProcessRegister);

userRouter.post("/verify", isLoggedOut, handleVerifyUser);
userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, handleGetUserbyID);
userRouter.delete("/:id([0-9a-fA-F]{24})", isLoggedIn, handleDeleteUserID);
userRouter.put("/:id([0-9a-fA-F]{24})", userImageUpload.single("image"), isLoggedIn, handleUpdateUserByID);
userRouter.put("/manage-user/:id([0-9a-fA-F]{24})", isLoggedIn, isAdmin, handleManageUserByID);
userRouter.put("/update-password/:id([0-9a-fA-F]{24})", isLoggedIn,
    validateUserUpdatePassword, runValidation, handleUpdatePassword);
userRouter.post("/forget-password",
    validateForgetPassword, runValidation, handleForgetPassword);
userRouter.put("/verifyForgetPassword", isLoggedOut,
    validateVerifyForgetPassword, runValidation, handleVerifyForgetPassword);

module.exports = userRouter;