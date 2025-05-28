const mongoose = require('mongoose');
const {mongoDbURL} = require("../secret");

const connectDatabase = async (options = {}) => {
    try {
        mongoose.connect(mongoDbURL, options)
        .then(()=> console.log("Connection Successfull"))
        .catch(err => console.log("error: "+err.message));
        
    } catch (error) {
        console.log(`Error: Could not connect to db`);
    }
}

module.exports = connectDatabase;