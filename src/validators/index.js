const {validationResult} = require("express-validator");
const { errorResponse } = require("../controllers/responseController");

const runValidation = (req, res, next)=>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            //throwing error from validations
            return errorResponse(res, {statusCode: 400, message: errors.array()[0].msg});
        }
        return next();
    } catch (error) {
        return next(error)
    }
}

module.exports = {runValidation};