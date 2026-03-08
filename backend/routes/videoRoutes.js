const express = require('express');
const router = express.Router();
const multer = require('multer');
const { videoStorage } = require('../config/cloudinary');
const videoController = require('../controllers/videoController');
const auth = require('../middleware/auth');

const upload = multer({ storage: videoStorage });

// Upload video for sign language
router.post('/upload', auth, upload.single('video'), videoController.uploadVideo);

// Process sign language video
router.post('/process/:id', auth, videoController.processSignLanguage);

// Get video recording
router.get('/:id', auth, videoController.getVideoRecording);

module.exports = router;