const AudioRecording = require('../models/AudioRecording');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const speechToText = require('../services/speechToText');
const fs = require('fs');

// @desc    Upload audio for speech recognition
// @route   POST /api/audio/upload
// @access  Private
exports.uploadAudio = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No audio file uploaded' });
        }

        const audioData = {
            patientId: req.userId,
            audioUrl: req.file.path,
            publicId: req.file.filename,
            status: 'processing'
        };

        const audio = new AudioRecording(audioData);
        await audio.save();

        res.status(201).json({
            success: true,
            audioId: audio._id,
            audioUrl: audio.audioUrl,
            message: 'Audio uploaded successfully'
        });
    } catch (error) {
        console.error('Audio upload error:', error);
        res.status(500).json({ message: 'Server error during audio upload' });
    }
};

// @desc    Transcribe audio to text
// @route   POST /api/audio/transcribe/:id
// @access  Private
exports.transcribeAudio = async (req, res) => {
    try {
        const audio = await AudioRecording.findById(req.params.id);
        
        if (!audio) {
            return res.status(404).json({ message: 'Audio not found' });
        }

        // Check if user owns this audio
        if (audio.patientId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Process audio with speech-to-text
        const transcription = await speechToText.transcribe(audio.audioUrl);
        
        audio.transcribedText = transcription.text;
        audio.status = 'completed';
        await audio.save();

        // Update appointment if exists
        if (audio.appointmentId) {
            await Appointment.findByIdAndUpdate(audio.appointmentId, {
                transcribedText: transcription.text,
                audioUrl: audio.audioUrl
            });
        }

        res.json({
            success: true,
            text: transcription.text,
            confidence: transcription.confidence
        });
    } catch (error) {
        console.error('Audio transcription error:', error);
        res.status(500).json({ message: 'Server error during transcription' });
    }
};

// @desc    Get audio recording by ID
// @route   GET /api/audio/:id
// @access  Private
exports.getAudioRecording = async (req, res) => {
    try {
        const audio = await AudioRecording.findById(req.params.id)
            .populate('patientId', 'name email');

        if (!audio) {
            return res.status(404).json({ message: 'Audio not found' });
        }

        // Check authorization
        if (audio.patientId._id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json({
            success: true,
            audio
        });
    } catch (error) {
        console.error('Audio fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Stream audio
// @route   GET /api/audio/stream/:id
// @access  Private
exports.streamAudio = async (req, res) => {
    try {
        const audio = await AudioRecording.findById(req.params.id);
        
        if (!audio) {
            return res.status(404).json({ message: 'Audio not found' });
        }

        const audioPath = audio.audioUrl;
        const stat = fs.statSync(audioPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(audioPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'audio/mpeg',
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'audio/mpeg',
            };
            res.writeHead(200, head);
            fs.createReadStream(audioPath).pipe(res);
        }
    } catch (error) {
        console.error('Audio stream error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete audio
// @route   DELETE /api/audio/:id
// @access  Private
exports.deleteAudio = async (req, res) => {
    try {
        const audio = await AudioRecording.findById(req.params.id);
        
        if (!audio) {
            return res.status(404).json({ message: 'Audio not found' });
        }

        // Check if user owns this audio
        if (audio.patientId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Delete file from storage
        fs.unlinkSync(audio.audioUrl);
        
        // Delete from database
        await audio.remove();

        res.json({
            success: true,
            message: 'Audio deleted successfully'
        });
    } catch (error) {
        console.error('Audio deletion error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Real-time transcription (WebSocket)
// @route   WebSocket connection
exports.handleRealTimeTranscription = (socket) => {
    socket.on('start-transcription', async (data) => {
        try {
            const transcriptionStream = await speechToText.streamTranscribe();
            
            socket.on('audio-chunk', (chunk) => {
                transcriptionStream.write(chunk);
            });

            transcriptionStream.on('data', (transcription) => {
                socket.emit('transcription', transcription);
            });

            socket.on('stop-transcription', () => {
                transcriptionStream.end();
            });
        } catch (error) {
            console.error('Real-time transcription error:', error);
            socket.emit('error', 'Transcription failed');
        }
    });
};