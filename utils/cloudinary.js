import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: 'dtl40ser2',
  api_key: '899187148257927',
  api_secret: '5RUCBDjd9L5PKcL-volH7Bf1y1U'
});

const uploadOnCloudinary = async (fileBuffer) => {
    try {
      if (!fileBuffer) return null;
  
      // Return a Promise to properly handle the asynchronous operation
      return new Promise((resolve, reject) => {
        // Upload the file buffer to Cloudinary
        cloudinary.uploader.upload_stream({ resource_type: "auto" }, async (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            reject('something wrong');
            return;
          }
          // File has been uploaded successfully
        //   console.log("File uploaded on Cloudinary:", result.url);
          resolve(result.url); // Resolve the Promise with the uploaded URL
        }).end(fileBuffer);
      });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return 'something wrong';
    }
  };
  

const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Extract the public ID from the image URL
    const publicId = imageUrl.split('/').pop().split('.')[0];

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(publicId);
    console.log("Image deleted from Cloudinary");
  } catch (error) {
    // Handle any errors
    console.error('Error deleting image from Cloudinary:', error);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
