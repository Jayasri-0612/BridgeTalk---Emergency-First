const Appointment = require('../models/Appointment');
const User = require('../models/User');
const VideoRecording = require('../models/VideoRecording');
const AudioRecording = require('../models/AudioRecording');
const { validationResult } = require('express-validator');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            fullName,
            age,
            phone,
            email,
            symptoms,
            doctor,
            appointmentDate,
            isEmergency,
            userType,
            videoUrl,
            audioUrl,
            transcribedText,
            signLanguageText
        } = req.body;

        // Calculate priority
        let priority = 2; // Default normal
        if (isEmergency) {
            priority = 1; // Emergency
        } else if (userType === 'deaf' || userType === 'blind') {
            priority = 3; // Special needs
        }

        const appointment = new Appointment({
            patientId: req.userId,
            fullName,
            age,
            phone,
            email,
            symptoms,
            doctor,
            appointmentDate,
            isEmergency,
            userType,
            videoUrl,
            audioUrl,
            transcribedText,
            signLanguageText,
            priority,
            status: 'pending'
        });

        await appointment.save();

        // Send notification based on priority
        await sendAppointmentNotification(appointment);

        res.status(201).json({
            success: true,
            appointment
        });
    } catch (error) {
        console.error('Appointment creation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all appointments for a user
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
    try {
        const { status, userType, startDate, endDate } = req.query;
        let query = { patientId: req.userId };

        // Apply filters
        if (status) query.status = status;
        if (userType) query.userType = userType;
        if (startDate || endDate) {
            query.appointmentDate = {};
            if (startDate) query.appointmentDate.$gte = new Date(startDate);
            if (endDate) query.appointmentDate.$lte = new Date(endDate);
        }

        const appointments = await Appointment.find(query)
            .sort({ isEmergency: -1, appointmentDate: 1 })
            .populate('patientId', 'name email');

        res.json({
            success: true,
            count: appointments.length,
            appointments
        });
    } catch (error) {
        console.error('Fetch appointments error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get appointment queue (sorted by priority)
// @route   GET /api/appointments/queue
// @access  Private
exports.getQueue = async (req, res) => {
    try {
        const appointments = await Appointment.find({ status: 'pending' })
            .sort({ priority: 1, createdAt: -1 })
            .populate('patientId', 'name email userType');

        // Calculate queue statistics
        const stats = {
            emergency: appointments.filter(a => a.isEmergency).length,
            normal: appointments.filter(a => !a.isEmergency && a.userType === 'normal').length,
            specialNeeds: appointments.filter(a => a.userType === 'deaf' || a.userType === 'blind').length,
            total: appointments.length
        };

        res.json({
            success: true,
            stats,
            queue: appointments
        });
    } catch (error) {
        console.error('Queue fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patientId', 'name email phone')
            .populate('videoRecording')
            .populate('audioRecording');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if user owns this appointment
        if (appointment.patientId._id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json({
            success: true,
            appointment
        });
    } catch (error) {
        console.error('Fetch appointment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if user owns this appointment
        if (appointment.patientId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Only allow updates if appointment is still pending
        if (appointment.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot update confirmed or completed appointments' });
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            appointment: updatedAppointment
        });
    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if user owns this appointment
        if (appointment.patientId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Only allow deletion if appointment is still pending
        if (appointment.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot delete confirmed or completed appointments' });
        }

        await appointment.remove();

        res.json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.status = status;
        await appointment.save();

        // Send status update notification
        await sendStatusNotification(appointment);

        res.json({
            success: true,
            appointment
        });
    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get appointment statistics
// @route   GET /api/appointments/stats/overview
// @access  Private
exports.getAppointmentStats = async (req, res) => {
    try {
        const stats = await Appointment.aggregate([
            {
                $group: {
                    _id: null,
                    totalAppointments: { $sum: 1 },
                    emergencyCases: {
                        $sum: { $cond: ['$isEmergency', 1, 0] }
                    },
                    pendingAppointments: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    completedAppointments: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    deafPatients: {
                        $sum: { $cond: [{ $eq: ['$userType', 'deaf'] }, 1, 0] }
                    },
                    blindPatients: {
                        $sum: { $cond: [{ $eq: ['$userType', 'blind'] }, 1, 0] }
                    }
                }
            }
        ]);

        // Get today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayAppointments = await Appointment.countDocuments({
            appointmentDate: { $gte: today }
        });

        res.json({
            success: true,
            stats: stats[0] || {
                totalAppointments: 0,
                emergencyCases: 0,
                pendingAppointments: 0,
                completedAppointments: 0,
                deafPatients: 0,
                blindPatients: 0
            },
            todayAppointments
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Helper function to send appointment notifications
async function sendAppointmentNotification(appointment) {
    // Implement email/SMS notifications here
    console.log('Notification sent for appointment:', appointment._id);
}

// Helper function to send status update notifications
async function sendStatusNotification(appointment) {
    // Implement status update notifications here
    console.log('Status update notification sent:', appointment._id, appointment.status);
}