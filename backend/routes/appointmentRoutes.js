const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

// Validation rules
const appointmentValidation = [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('age').isInt({ min: 0, max: 150 }).withMessage('Valid age is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('symptoms').notEmpty().withMessage('Symptoms are required'),
    body('appointmentDate').isISO8601().withMessage('Valid date is required'),
    body('userType').isIn(['normal', 'deaf', 'blind']).withMessage('Invalid user type')
];

// Routes
router.post('/', auth, appointmentValidation, appointmentController.createAppointment);
router.get('/', auth, appointmentController.getAppointments);
router.get('/queue', auth, appointmentController.getQueue);
router.get('/:id', auth, appointmentController.getAppointmentById);
router.put('/:id', auth, appointmentController.updateAppointment);
router.delete('/:id', auth, appointmentController.deleteAppointment);
router.patch('/:id/status', auth, appointmentController.updateAppointmentStatus);
router.get('/stats/overview', auth, appointmentController.getAppointmentStats);

module.exports = router;