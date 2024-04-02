import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name: 'dtl40ser2',
    api_key: '899187148257927',
    api_secret: '5RUCBDjd9L5PKcL-volH7Bf1y1U'
});





const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = async (imageUrl) => {
    try {
        // Extract the public ID from the image URL
        const publicId = await imageUrl.split('/').pop().split('.')[0];
        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId);

    } catch (error) {
        // Handle any errors
        console.error('Error deleting image from Cloudinary:', error);
    }
};


export { uploadOnCloudinary, deleteFromCloudinary }