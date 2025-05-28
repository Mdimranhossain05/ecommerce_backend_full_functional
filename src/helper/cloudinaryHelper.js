const path = require("path");
const cloudinary = require("../config/cloudinary");

const publicIdWithoutExtension = (imageURL) => {
    const segments = imageURL.split("/");
    const lastSegment = segments[segments.length - 1];
    const extName = path.extname(lastSegment);
    const publicID = lastSegment.replace(extName, "");
    return publicID;
}

const deleteImageFromCloudinary = async (folder, image, model) => {
    try {
        const publicID = publicIdWithoutExtension(image);
        const { result } = await cloudinary.uploader.destroy(`ecommerceMern/${folder}/${publicID}`);
        if (result != "ok") {
            throw new Error(`${model} image was not deleted from Cloudinary`);
        }
    } catch (error) {
        throw error;
    }
}

module.exports = { publicIdWithoutExtension, deleteImageFromCloudinary }