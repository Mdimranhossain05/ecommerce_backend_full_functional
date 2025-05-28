const multer = require("multer");
const { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, UPLOAD_USER_DIRECTORY, UPLOAD_PRODUCT_DIRECTORY } = require("../config/configs");
const path = require("path");

// const storage = multer.memoryStorage();
// const fileFilter = (req, file, cb)=>{
//   if(!file.mimetype.startsWith("image/")){
//     cb(new Error("Only image types are allowed"), false);
//   }
//   if(file.fileSize > MAX_FILE_SIZE){
//     cb(new Error("File size exceed maximum limit"), false);
//   }
//   if(!ALLOWED_FILE_TYPES.includes(file.mimetype)){
//     cb(new Error("File type is not acceptable."), false);
//   }
//   cb(null, true);
// };  
//   const upload = multer({ storage: storage, 
//     fileFilter : fileFilter
//    });

const userStorage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, UPLOAD_USER_DIRECTORY);
  // },
  filename: (req, file, cb) => {
    cb(null ,Date.now() + "-"+ file.originalname)
  }
});

const productStorage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, UPLOAD_PRODUCT_DIRECTORY);
  // },
  filename: (req, file, cb) => {
    cb(null ,Date.now() + "-"+ file.originalname)
  }
});

const filter = (req, file, cb) => {
  const extName = path.extname(file.originalname);
  if( !ALLOWED_FILE_TYPES.includes(extName.toLocaleLowerCase().substring(1))){
    return cb(new Error("File type not allowed"), false) ;
  }
  cb(null, true);
}

const userImageUpload = multer({storage : userStorage, limits: {fileSize: MAX_FILE_SIZE}, fileFilter: filter});
const productImageUpload = multer({storage : productStorage, limits: {fileSize: MAX_FILE_SIZE}, fileFilter: filter});

module.exports = {userImageUpload, productImageUpload};