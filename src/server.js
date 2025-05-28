const app = require("./app.js");
const connectDatabase = require("./config/db.js");
const {serverPort} = require("./secret.js");


app.listen(serverPort,async (err)=>{
    if(!err){
        console.log(`Server started successfully at port: ${serverPort}`);
        await connectDatabase();
    }else{
        console.log("Something went wrong at server starting");
    }
});
