const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    email: String,
    symptoms: { type: String, required: true },
    doctor: String,
    appointmentDate: { type: Date, required: true },
    isEmergency: { type: Boolean, default: false },
    userType: { 
        type: String, 
        enum: ['normal', 'deaf', 'blind'],
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'completed'],
        default: 'pending' 
    },
    priority: { type: Number, default: 2 },
    videoUrl: String,
    audioUrl: String,
    transcribedText: String,
    signLanguageText: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);