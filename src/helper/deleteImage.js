const fs = require('fs').promises;

const deleteImage = async (imgPath)=>{

    try {
        await fs.access(imgPath);
        await fs.unlink(imgPath);
    } catch (error) {
        console.log("Image was not deleted");
    }
};

module.exports = deleteImage;