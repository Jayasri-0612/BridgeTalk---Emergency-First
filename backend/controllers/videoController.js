const VideoRecording = require('../models/VideoRecording');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const signLanguageAI = require('../services/signLanguageAI');
const fs = require('fs');

// @desc    Upload video for sign language
// @route   POST /api/video/upload
// @access  Private
exports.uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        const videoData = {
            patientId: req.userId,
            videoUrl: req.file.path,
            publicId: req.file.filename,
            status: 'processing'
        };

        const video = new VideoRecording(videoData);
        await video.save();

        res.status(201).json({
            success: true,
            videoId: video._id,
            videoUrl: video.videoUrl,
            message: 'Video uploaded successfully'
        });
    } catch (error) {
        console.error('Video upload error:', error);
        res.status(500).json({ message: 'Server error during video upload' });
    }
};

// @desc    Process sign language video
// @route   POST /api/video/process/:id
// @access  Private
exports.processSignLanguage = async (req, res) => {
    try {
        const video = await VideoRecording.findById(req.params.id);
        
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Check if user owns this video
        if (video.patientId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Process video with AI (simulated)
        const translation = await signLanguageAI.processVideo(video.videoUrl);
        
        video.signLanguageText = translation.text;
        video.translatedText = translation.text;
        video.status = 'completed';
        await video.save();

        // Update appointment if exists
        if (video.appointmentId) {
            await Appointment.findByIdAndUpdate(video.appointmentId, {
                signLanguageText: translation.text,
                videoUrl: video.videoUrl
            });
        }

        res.json({
            success: true,
            translation: translation.text,
            confidence: translation.confidence
        });
    } catch (error) {
        console.error('Sign language processing error:', error);
        res.status(500).json({ message: 'Server error during processing' });
    }
};

// @desc    Get video recording by ID
// @route   GET /api/video/:id
// @access  Private
exports.getVideoRecording = async (req, res) => {
    try {
        const video = await VideoRecording.findById(req.params.id)
            .populate('patientId', 'name email');

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Check authorization
        if (video.patientId._id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json({
            success: true,
            video
        });
    } catch (error) {
        console.error('Video fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Stream video
// @route   GET /api/video/stream/:id
// @access  Private
exports.streamVideo = async (req, res) => {
    try {
        const video = await VideoRecording.findById(req.params.id);
        
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const videoPath = video.videoUrl;
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (error) {
        console.error('Video stream error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete video
// @route   DELETE /api/video/:id
// @access  Private
exports.deleteVideo = async (req, res) => {
    try {
        const video = await VideoRecording.findById(req.params.id);
        
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Check if user owns this video
        if (video.patientId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Delete file from storage
        fs.unlinkSync(video.videoUrl);
        
        // Delete from database
        await video.remove();

        res.json({
            success: true,
            message: 'Video deleted successfully'
        });
    } catch (error) {
        console.error('Video deletion error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};