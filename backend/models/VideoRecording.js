const mongoose = require('mongoose');

const videoRecordingSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    videoUrl: { type: String, required: true },
    publicId: String,
    duration: Number,
    signLanguageText: String,
    translatedText: String,
    status: { type: String, default: 'processing' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VideoRecording', videoRecordingSchema);