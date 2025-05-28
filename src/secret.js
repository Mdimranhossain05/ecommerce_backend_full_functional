require('dotenv').config();

data = {}

data.serverPort = process.env.SERVER_PORT || 3050;
data.mongoDbURL = process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommerce";
data.defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/user_default.jpg'
data.jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "123";
data.jwtAccessKey = process.env.JWT_ACCESS_KEY || "123124";
data.jwtRefreshKey = process.env.JWT_REFRESH_KEY || "121245";
data.jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY || "152535";
data.smptUsername = process.env.SMTP_USERNAME || "";
data.smptPasssword = process.env.SMTP_PASSWORD || "";
data.clientURL = process.env.CLIENT_URL  || `http//:localhost:${data.serverPort}`;

module.exports = data;