const jwt = require("jsonwebtoken");
var createError = require('http-errors');
const { errorResponse } = require("../controllers/responseController");

const createJsonWebToken = (payload, secretKey, expiresIn = '2m') => {
    try {
        if (typeof payload != 'object' || Object.keys(payload).length === 0) {
            throw new Error("Payload key must be non empty object");
        }
        if (typeof secretKey != 'string' || secretKey == "") {
            throw new Error("Secret key must be non empty string");
        }

        const token = jwt.sign(payload, secretKey, { expiresIn });
        return token;
    } catch (error) {
        console.log("Failed to create token ", error.message);
        throw error;
    }
}

const decodeJsonWebToken = (token, secretKey) => {
    try {
        if (!token) {
            throw createError(404, "Token not found");
        }

        let decodedToken;
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    throw createError(403, "Token Expired");
                }
            }
            else {
                decodedToken = decoded;
            }
        });
        return decodedToken;
    } catch (error) {
        console.log("Failed to decode token: ", error.message);
        throw error;
    }
}

module.exports = { createJsonWebToken, decodeJsonWebToken }