const cloudinary = require('cloudinary').v2;
const config = require('../config/config');
const fs = require('fs');

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
});

const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) {
            throw new Error('File path is required for uploading to Cloudinary.');
        }
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
            folder: 'uploads', // Optional: specify a folder in Cloudinary
        })
        return response
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Delete the file from local storage after upload
        }
    }
}
module.exports = { uploadOnCloudinary };
