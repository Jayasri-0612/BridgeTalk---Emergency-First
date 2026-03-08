const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bridgetalk/videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'webm']
    }
});

const audioStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bridgetalk/audio',
        resource_type: 'raw',
        allowed_formats: ['mp3', 'wav', 'ogg']
    }
});

module.exports = { cloudinary, videoStorage, audioStorage };