const mongoose = require('mongoose');

const audioRecordingSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    audioUrl: { type: String, required: true },
    publicId: String,
    duration: Number,
    transcribedText: { type: String, required: true },
    status: { type: String, default: 'completed' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AudioRecording', audioRecordingSchema);