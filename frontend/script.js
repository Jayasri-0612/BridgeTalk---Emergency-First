// DOM Elements
const userTypeSection = document.getElementById('user-type-section');
const appointmentForm = document.getElementById('appointment-form');
const communicationInterface = document.getElementById('communication-interface');
const continueBtn = document.getElementById('continue-btn');
const backToSelectionBtn = document.getElementById('back-to-selection');
const backToSelectionCommBtn = document.getElementById('back-to-selection-comm');
const userCards = document.querySelectorAll('.user-card');
const appointmentFormElement = document.getElementById('appointmentForm');
const emergencyCheckbox = document.getElementById('emergencyCase');
const deafInterface = document.getElementById('deaf-interface');
const blindInterface = document.getElementById('blind-interface');
const startSpeechBtn = document.getElementById('start-speech');
const bookAppointmentBtn = document.getElementById('book-appointment');
const queueList = document.getElementById('queue-list');
const queueEmpty = document.getElementById('queue-empty');
const emergencyCount = document.getElementById('emergency-count');
const normalCount = document.getElementById('normal-count');
const totalCount = document.getElementById('total-count');

let selectedUserType = '';
let appointmentQueue = JSON.parse(localStorage.getItem('appointmentQueue')) || [];

// Initialize queue display
updateQueueDisplay();

// User Card Selection
userCards.forEach(card => {
    card.addEventListener('click', function() {
        // Remove selected class from all cards
        userCards.forEach(c => c.classList.remove('selected'));
        
        // Add selected class to clicked card
        this.classList.add('selected');
        
        // Get user type from data attribute
        selectedUserType = this.getAttribute('data-user-type');
        
        // Update emergency badge visibility
        if (selectedUserType === 'normal') {
            document.getElementById('emergency-badge').style.display = 'block';
        } else {
            document.getElementById('emergency-badge').style.display = 'none';
        }
        
        // If emergency case is selected, add emergency class
        if (selectedUserType === 'normal' && emergencyCheckbox.checked) {
            this.classList.add('emergency');
        } else {
            this.classList.remove('emergency');
        }
    });
});

// Continue Button Click
continueBtn.addEventListener('click', function() {
    if (!selectedUserType) {
        alert('Please select a user type to continue');
        return;
    }
    
    // Hide user type selection
    userTypeSection.style.display = 'none';
    
    // Show appropriate section based on user type
    if (selectedUserType === 'normal') {
        appointmentForm.style.display = 'block';
        communicationInterface.style.display = 'none';
    } else {
        appointmentForm.style.display = 'none';
        communicationInterface.style.display = 'block';
        
        // Show appropriate communication interface
        if (selectedUserType === 'deaf') {
            deafInterface.style.display = 'flex';
            blindInterface.style.display = 'none';
        } else if (selectedUserType === 'blind') {
            deafInterface.style.display = 'none';
            blindInterface.style.display = 'flex';
        }
    }
});

// Back to Selection Buttons
backToSelectionBtn.addEventListener('click', function() {
    appointmentForm.style.display = 'none';
    userTypeSection.style.display = 'block';
});

backToSelectionCommBtn.addEventListener('click', function() {
    communicationInterface.style.display = 'none';
    userTypeSection.style.display = 'block';
});

// Form Submission
appointmentFormElement.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const fullName = formData.get('fullName');
    const age = formData.get('age');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const symptoms = formData.get('symptoms');
    const doctor = formData.get('doctor');
    const appointmentDate = formData.get('appointmentDate');
    const isEmergency = formData.get('emergencyCase') === 'on';
    
    // Create appointment object
    const appointment = {
        id: Date.now(),
        fullName,
        age,
        phone,
        email,
        symptoms,
        doctor,
        appointmentDate,
        isEmergency,
        userType: selectedUserType,
        timestamp: new Date().toISOString(),
        status: 'pending',
        priority: isEmergency ? 1 : 2
    };
    
    // Add to queue
    addToQueue(appointment);
    
    // Show success message
    let message = 'Appointment submitted successfully!';
    if (isEmergency) {
        message += '\n\n⏰ EMERGENCY CASE DETECTED\nYou are now #1 in the priority queue. A doctor will call you within 15 minutes.';
    } else {
        message += '\n\nYou have been added to the appointment queue. You will receive a confirmation call.';
    }
    
    alert(message);
    
    // Reset form and go back to selection
    appointmentFormElement.reset();
    appointmentForm.style.display = 'none';
    userTypeSection.style.display = 'block';
    
    // Reset card selection
    userCards.forEach(c => c.classList.remove('selected'));
    selectedUserType = '';
    
    // Scroll to queue section
    document.getElementById('queue-section').scrollIntoView({ behavior: 'smooth' });
});

// Emergency Checkbox Effect
emergencyCheckbox.addEventListener('change', function() {
    const normalCard = document.getElementById('normal-user');
    if (this.checked) {
        normalCard.classList.add('emergency');
    } else {
        normalCard.classList.remove('emergency');
    }
});

// Speech Recognition Simulation
startSpeechBtn.addEventListener('click', function() {
    const voiceTextInput = document.getElementById('voice-text-input');
    
    // Simulate speech recognition
    voiceTextInput.value = "I have been feeling dizzy and nauseous since this morning.";
    
    // Visual feedback
    this.innerHTML = '<i class="fas fa-microphone-slash"></i> Stop Speaking';
    this.classList.remove('btn-primary');
    this.classList.add('btn-emergency');
    
    // Reset after 3 seconds
    setTimeout(() => {
        this.innerHTML = '<i class="fas fa-microphone"></i> Start Speaking (AI Speech Recognition)';
        this.classList.remove('btn-emergency');
        this.classList.add('btn-primary');
    }, 3000);
});

// Book Appointment from Communication Interface
bookAppointmentBtn.addEventListener('click', function() {
    const userType = selectedUserType === 'deaf' ? 'deaf' : 'blind';
    const communicationMethod = selectedUserType === 'deaf' ? 'sign language video call' : 'voice call with speech recognition';
    
    // Create a special appointment for deaf/blind users
    const appointment = {
        id: Date.now(),
        fullName: `${userType === 'deaf' ? 'Deaf' : 'Blind'} Patient`,
        age: Math.floor(Math.random() * 50) + 20,
        phone: `Not provided`,
        email: '',
        symptoms: `Communication assistance required for ${userType} patient`,
        doctor: '',
        appointmentDate: new Date().toISOString().split('T')[0],
        isEmergency: false,
        userType: selectedUserType,
        timestamp: new Date().toISOString(),
        status: 'pending',
        priority: 3,
        specialNeeds: true
    };
    
    // Add to queue
    addToQueue(appointment);
    
    alert(`Appointment booking initiated for ${userType} patient.\n\nA doctor will connect with you shortly for consultation via ${communicationMethod}.`);
    
    // Scroll to queue section
    document.getElementById('queue-section').scrollIntoView({ behavior: 'smooth' });
});

// Queue Management Functions
function addToQueue(appointment) {
    // Add to beginning if emergency, else to end
    if (appointment.isEmergency) {
        appointmentQueue.unshift(appointment);
    } else {
        appointmentQueue.push(appointment);
    }
    
    // Save to localStorage
    localStorage.setItem('appointmentQueue', JSON.stringify(appointmentQueue));
    
    // Update display
    updateQueueDisplay();
}

function updateQueueDisplay() {
    // Clear the queue list
    queueList.innerHTML = '';
    
    // Update counts
    const emergencyCases = appointmentQueue.filter(a => a.isEmergency).length;
    const normalCases = appointmentQueue.filter(a => !a.isEmergency).length;
    
    emergencyCount.textContent = emergencyCases;
    normalCount.textContent = normalCases;
    totalCount.textContent = appointmentQueue.length;
    
    // If no appointments, show empty message
    if (appointmentQueue.length === 0) {
        queueEmpty.style.display = 'block';
        queueList.appendChild(queueEmpty);
        return;
    }
    
    // Hide empty message
    queueEmpty.style.display = 'none';
    
    // Sort by priority (emergency first, then normal, then special needs)
    const sortedQueue = [...appointmentQueue].sort((a, b) => a.priority - b.priority);
    
    // Add each appointment to the queue
    sortedQueue.forEach((appointment, index) => {
        const queueItem = createQueueItem(appointment, index + 1);
        queueList.appendChild(queueItem);
    });
}

function createQueueItem(appointment, position) {
    const queueItem = document.createElement('div');
    queueItem.className = `queue-item ${appointment.isEmergency ? 'emergency' : ''} ${appointment.specialNeeds ? 'pending' : ''}`;
    
    // Get initials for avatar
    const initials = appointment.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    
    // Format time
    const time = new Date(appointment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Get doctor name
    let doctorName = 'Any Available';
    if (appointment.doctor === 'dr_sharma') doctorName = 'Dr. Sharma';
    else if (appointment.doctor === 'dr_kumar') doctorName = 'Dr. Kumar';
    else if (appointment.doctor === 'dr_patel') doctorName = 'Dr. Patel';
    else if (appointment.doctor === 'dr_reddy') doctorName = 'Dr. Reddy';
    
    queueItem.innerHTML = `
        <div class="queue-patient-info">
            <div class="patient-avatar" style="background-color: ${appointment.isEmergency ? 'var(--emergency)' : appointment.userType === 'deaf' ? 'var(--deaf-color)' : appointment.userType === 'blind' ? 'var(--blind-color)' : 'var(--normal-color)'}">
                ${initials.substring(0, 2)}
            </div>
            <div class="patient-details">
                <h4>${appointment.fullName} (${appointment.age})</h4>
                <p><i class="fas fa-stethoscope"></i> ${appointment.symptoms.substring(0, 50)}${appointment.symptoms.length > 50 ? '...' : ''}</p>
                <p><i class="fas fa-user-md"></i> ${doctorName} • ${appointment.appointmentDate}</p>
            </div>
        </div>
        <div class="queue-status">
            <span class="status-badge ${appointment.isEmergency ? 'status-emergency' : appointment.specialNeeds ? 'status-pending' : 'status-normal'}">
                ${appointment.isEmergency ? '<i class="fas fa-exclamation-triangle"></i> EMERGENCY' : 
                  appointment.specialNeeds ? '<i class="fas fa-universal-access"></i> SPECIAL NEEDS' : 
                  '<i class="fas fa-clock"></i> NORMAL'}
            </span>
            <div class="queue-time">
                <i class="far fa-clock"></i> ${time}
                ${position === 1 && appointment.isEmergency ? ' • <strong>NEXT IN LINE</strong>' : ''}
            </div>
        </div>
    `;
    
    // Add click to remove functionality
    queueItem.addEventListener('dblclick', function() {
        if (confirm(`Remove ${appointment.fullName}'s appointment from the queue?`)) {
            removeFromQueue(appointment.id);
        }
    });
    
    return queueItem;
}

function removeFromQueue(id) {
    appointmentQueue = appointmentQueue.filter(a => a.id !== id);
    localStorage.setItem('appointmentQueue', JSON.stringify(appointmentQueue));
    updateQueueDisplay();
}

// Auto-select normal user on load (for demo purposes)
window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('normal-user').click();
    
    // Set minimum date to today for appointment
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').min = today;
    
    // Set a default future date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2);
    document.getElementById('appointmentDate').value = futureDate.toISOString().split('T')[0];
    
    // Add some sample appointments for demo
    if (appointmentQueue.length === 0) {
        const sampleAppointments = [
            {
                id: 1,
                fullName: 'Rahul Sharma',
                age: 45,
                phone: '9876543210',
                email: 'rahul@example.com',
                symptoms: 'Severe chest pain and shortness of breath',
                doctor: 'dr_kumar',
                appointmentDate: today,
                isEmergency: true,
                userType: 'normal',
                timestamp: new Date(Date.now() - 30*60000).toISOString(),
                status: 'pending',
                priority: 1
            },
            {
                id: 2,
                fullName: 'Priya Patel',
                age: 32,
                phone: '9876543211',
                email: 'priya@example.com',
                symptoms: 'High fever and body ache for 3 days',
                doctor: 'dr_sharma',
                appointmentDate: today,
                isEmergency: false,
                userType: 'normal',
                timestamp: new Date(Date.now() - 60*60000).toISOString(),
                status: 'pending',
                priority: 2
            },
            {
                id: 3,
                fullName: 'Deaf Patient (Sign Language)',
                age: 28,
                phone: 'Not provided',
                email: '',
                symptoms: 'Communication assistance required for deaf patient',
                doctor: '',
                appointmentDate: today,
                isEmergency: false,
                userType: 'deaf',
                timestamp: new Date(Date.now() - 90*60000).toISOString(),
                status: 'pending',
                priority: 3,
                specialNeeds: true
            }
        ];
        
        appointmentQueue = sampleAppointments;
        localStorage.setItem('appointmentQueue', JSON.stringify(appointmentQueue));
        updateQueueDisplay();
    }
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    // Tab key navigation between user cards
    if (e.key === 'Tab' && userTypeSection.style.display !== 'none') {
        setTimeout(() => {
            const focusedElement = document.activeElement;
            if (focusedElement.classList && focusedElement.classList.contains('user-card')) {
                userCards.forEach(c => c.classList.remove('selected'));
                focusedElement.classList.add('selected');
                selectedUserType = focusedElement.getAttribute('data-user-type');
            }
        }, 10);
    }
    
    // Enter key to continue
    if (e.key === 'Enter' && document.activeElement.id === 'continue-btn') {
        continueBtn.click();
    }
});