const express = require('express');
const router = express.Router();
const multer = require('multer');
const { audioStorage } = require('../config/cloudinary');
const audioController = require('../controllers/audioController');
const auth = require('../middleware/auth');

const upload = multer({ storage: audioStorage });

// Upload audio for speech recognition
router.post('/upload', auth, upload.single('audio'), audioController.uploadAudio);

// Process speech to text
router.post('/transcribe/:id', auth, audioController.transcribeAudio);

// Get audio recording
router.get('/:id', auth, audioController.getAudioRecording);

module.exports = router;