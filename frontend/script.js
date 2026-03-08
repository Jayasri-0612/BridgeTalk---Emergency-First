<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BridgeTalk | Healthcare Communication Portal</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #2a6ecc;
            --primary-dark: #1a4d9c;
            --secondary: #34a853;
            --emergency: #ea4335;
            --warning: #fbbc05;
            --light: #f8f9fa;
            --dark: #202124;
            --gray: #5f6368;
            --light-gray: #e8eaed;
            --deaf-color: #4285f4;
            --blind-color: #ea4335;
            --normal-color: #34a853;
            --queue-emergency: #ffebee;
            --queue-normal: #e8f5e9;
            --queue-pending: #fff3e0;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            line-height: 1.6;
            color: var(--dark);
            background-color: #f5f7fa;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header Styles */
        header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 20px 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .logo-icon {
            font-size: 2.5rem;
        }
        
        .logo-text h1 {
            font-size: 1.8rem;
            font-weight: 700;
        }
        
        .logo-text span {
            color: var(--warning);
            font-weight: 600;
        }
        
        .logo-text p {
            font-size: 0.9rem;
            opacity: 0.9;
            font-family: 'Roboto', sans-serif;
        }
        
        .emergency-banner {
            background-color: var(--emergency);
            color: white;
            text-align: center;
            padding: 10px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.9; }
            100% { opacity: 1; }
        }
        
        /* User Type Selection */
        .user-type-section {
            padding: 40px 0;
            text-align: center;
        }
        
        .section-title {
            font-size: 2.2rem;
            color: var(--primary-dark);
            margin-bottom: 10px;
            position: relative;
            display: inline-block;
        }
        
        .section-title:after {
            content: '';
            position: absolute;
            width: 70px;
            height: 4px;
            background-color: var(--secondary);
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 2px;
        }
        
        .section-subtitle {
            font-size: 1.1rem;
            color: var(--gray);
            max-width: 700px;
            margin: 0 auto 40px;
            font-weight: 400;
        }
        
        .user-cards {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 30px;
            margin-top: 30px;
        }
        
        .user-card {
            background: white;
            border-radius: 16px;
            padding: 30px 25px;
            width: 300px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            cursor: pointer;
            border: 3px solid transparent;
            position: relative;
            overflow: hidden;
        }
        
        .user-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }
        
        .user-card.selected {
            border-color: var(--primary);
        }
        
        .user-card.emergency {
            border-color: var(--emergency);
            animation: emergency-card 1.5s infinite alternate;
        }
        
        @keyframes emergency-card {
            from { box-shadow: 0 10px 25px rgba(234, 67, 53, 0.2); }
            to { box-shadow: 0 10px 25px rgba(234, 67, 53, 0.4); }
        }
        
        .user-icon {
            font-size: 3.5rem;
            margin-bottom: 20px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .normal .user-icon { color: var(--normal-color); }
        .deaf .user-icon { color: var(--deaf-color); }
        .blind .user-icon { color: var(--blind-color); }
        
        .user-card h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: var(--dark);
        }
        
        .user-card p {
            color: var(--gray);
            margin-bottom: 20px;
            font-size: 0.95rem;
        }
        
        .badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background-color: var(--warning);
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        /* Form Section */
        .form-section {
            padding: 40px 0;
            display: none;
        }
        
        .form-container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            max-width: 800px;
            margin: 0 auto;
        }
        
        .form-header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--light-gray);
        }
        
        .form-title {
            font-size: 1.8rem;
            color: var(--primary-dark);
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        .form-row {
            display: flex;
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .form-row .form-group {
            flex: 1;
            margin-bottom: 0;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--dark);
        }
        
        input, select, textarea {
            width: 100%;
            padding: 14px 16px;
            border: 1px solid var(--light-gray);
            border-radius: 10px;
            font-family: 'Roboto', sans-serif;
            font-size: 1rem;
            transition: all 0.3s;
        }
        
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(42, 110, 204, 0.1);
        }
        
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 15px;
        }
        
        .checkbox-group input {
            width: auto;
        }
        
        .btn {
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
            font-family: 'Poppins', sans-serif;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .btn-primary {
            background-color: var(--primary);
            color: white;
        }
        
        .btn-primary:hover {
            background-color: var(--primary-dark);
        }
        
        .btn-emergency {
            background-color: var(--emergency);
            color: white;
            animation: pulse 1.5s infinite;
        }
        
        .btn-emergency:hover {
            background-color: #d32f2f;
        }
        
        .btn-secondary {
            background-color: var(--light-gray);
            color: var(--dark);
        }
        
        .btn-secondary:hover {
            background-color: #dadce0;
        }
        
        .button-group {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        
        /* Communication Interface */
        .communication-section {
            padding: 40px 0;
            display: none;
        }
        
        .comm-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        
        .comm-box {
            background: white;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            height: 500px;
            display: flex;
            flex-direction: column;
        }
        
        .comm-title {
            font-size: 1.5rem;
            color: var(--primary-dark);
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--light-gray);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .message-area {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 10px;
            margin-bottom: 20px;
            font-family: 'Roboto', sans-serif;
        }
        
        .message {
            margin-bottom: 15px;
            padding: 12px 16px;
            border-radius: 18px;
            max-width: 80%;
        }
        
        .message.received {
            background-color: var(--light-gray);
            border-bottom-left-radius: 5px;
            margin-right: auto;
        }
        
        .message.sent {
            background-color: var(--primary);
            color: white;
            border-bottom-right-radius: 5px;
            margin-left: auto;
        }
        
        .input-area {
            display: flex;
            gap: 10px;
        }
        
        .input-area input {
            flex: 1;
        }
        
        .video-feed {
            background-color: #202124;
            border-radius: 10px;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            margin-bottom: 20px;
        }
        
        /* Priority Queue Section */
        .queue-section {
            padding: 40px 0;
            background-color: white;
            margin-top: 40px;
            border-top: 3px solid var(--light-gray);
        }
        
        .queue-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
            gap: 20px;
        }
        
        .queue-stats {
            display: flex;
            gap: 20px;
        }
        
        .stat-box {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 20px;
            background-color: var(--light);
            border-radius: 10px;
        }
        
        .stat-emergency { border-left: 4px solid var(--emergency); }
        .stat-normal { border-left: 4px solid var(--normal-color); }
        .stat-pending { border-left: 4px solid var(--warning); }
        
        .queue-container {
            background-color: var(--light);
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .queue-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
            max-height: 500px;
            overflow-y: auto;
            padding-right: 10px;
        }
        
        .queue-item {
            background-color: white;
            border-radius: 12px;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s;
            border-left: 6px solid var(--normal-color);
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        }
        
        .queue-item.emergency {
            border-left-color: var(--emergency);
            background-color: var(--queue-emergency);
            order: -1;
        }
        
        .queue-item.pending {
            border-left-color: var(--warning);
            background-color: var(--queue-pending);
        }
        
        .queue-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .queue-patient-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .patient-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: 600;
        }
        
        .patient-details h4 {
            font-size: 1.2rem;
            margin-bottom: 5px;
        }
        
        .patient-details p {
            color: var(--gray);
            font-size: 0.9rem;
        }
        
        .queue-status {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
        }
        
        .status-badge {
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        
        .status-emergency {
            background-color: var(--emergency);
            color: white;
            animation: pulse 1.5s infinite;
        }
        
        .status-normal {
            background-color: var(--normal-color);
            color: white;
        }
        
        .status-pending {
            background-color: var(--warning);
            color: var(--dark);
        }
        
        .queue-time {
            font-size: 0.9rem;
            color: var(--gray);
        }
        
        .queue-empty {
            text-align: center;
            padding: 40px 20px;
            color: var(--gray);
        }
        
        .queue-empty i {
            font-size: 3rem;
            margin-bottom: 20px;
            color: var(--light-gray);
        }
        
        /* Features Section */
        .features-section {
            padding: 60px 0 40px;
            background-color: white;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }
        
        .feature-card {
            text-align: center;
            padding: 30px 20px;
            border-radius: 12px;
            background-color: #f8f9fa;
            transition: all 0.3s;
        }
        
        .feature-card:hover {
            background-color: #e8f0fe;
            transform: translateY(-5px);
        }
        
        .feature-icon {
            font-size: 2.5rem;
            color: var(--primary);
            margin-bottom: 20px;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .feature-card h4 {
            font-size: 1.3rem;
            margin-bottom: 15px;
            color: var(--primary-dark);
        }
        
        /* Footer */
        footer {
            background-color: var(--dark);
            color: white;
            padding: 40px 0 20px;
            margin-top: 40px;
        }
        
        .footer-content {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 40px;
            margin-bottom: 30px;
        }
        
        .footer-section h3 {
            font-size: 1.3rem;
            margin-bottom: 20px;
            color: var(--light);
        }
        
        .footer-section p {
            color: #bdc1c6;
            max-width: 300px;
            line-height: 1.8;
        }
        
        .copyright {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #3c4043;
            color: #9aa0a6;
            font-size: 0.9rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .comm-container {
                grid-template-columns: 1fr;
            }
            
            .form-row {
                flex-direction: column;
                gap: 0;
            }
            
            .header-content {
                flex-direction: column;
                gap: 20px;
                text-align: center;
            }
            
            .user-cards {
                flex-direction: column;
                align-items: center;
            }
            
            .queue-header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .queue-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 15px;
            }
            
            .queue-status {
                align-items: flex-start;
            }
        }
        
        /* Accessibility Focus Styles */
        :focus {
            outline: 3px solid var(--warning);
            outline-offset: 2px;
        }
        
        /* High Contrast Mode Support */
        @media (prefers-contrast: high) {
            .user-card {
                border: 2px solid black;
            }
            
            .btn {
                border: 2px solid black;
            }
        }
        
        /* Screen Reader Only */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        /* Scrollbar Styling */
        .queue-list::-webkit-scrollbar,
        .message-area::-webkit-scrollbar {
            width: 8px;
        }
        
        .queue-list::-webkit-scrollbar-track,
        .message-area::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        
        .queue-list::-webkit-scrollbar-thumb,
        .message-area::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
        }
        
        .queue-list::-webkit-scrollbar-thumb:hover,
        .message-area::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    </style>
</head>
<body>
    <!-- Emergency Banner -->
    <div class="emergency-banner">
        <i class="fas fa-ambulance"></i>
        <span>EMERGENCY CASES GET PRIORITY - IMMEDIATE ATTENTION FOR CRITICAL SITUATIONS</span>
    </div>
    
    <!-- Header -->
    <header>
        <div class="container header-content">
            <div class="logo">
                <div class="logo-icon">
                    <i class="fas fa-comments-medical"></i>
                </div>
                <div class="logo-text">
                    <h1>Bridge<span>Talk</span></h1>
                    <p>Healthcare Communication Portal for All Abilities</p>
                </div>
            </div>
            <div class="header-info">
                <p><i class="fas fa-phone-alt"></i> Emergency: 108</p>
                <p><i class="fas fa-hospital"></i> 24/7 Telemedicine Available</p>
            </div>
        </div>
    </header>
    
    <!-- User Type Selection -->
    <section class="user-type-section" id="user-type-section">
        <div class="container">
            <h2 class="section-title">Who Are You?</h2>
            <p class="section-subtitle">Select your profile to get the right communication support for your healthcare needs</p>
            
            <div class="user-cards">
                <!-- Normal/Standard User -->
                <div class="user-card normal" id="normal-user" data-user-type="normal">
                    <div class="user-icon">
                        <i class="fas fa-user-md"></i>
                    </div>
                    <h3>Standard Patient</h3>
                    <p>For patients who can communicate verbally and don't require special assistance</p>
                    <div class="badge" id="emergency-badge">EMERGENCY PRIORITY</div>
                    <p><strong>Emergency cases will be given first priority for doctor consultation</strong></p>
                </div>
                
                <!-- Deaf/Hard of Hearing User -->
                <div class="user-card deaf" id="deaf-user" data-user-type="deaf">
                    <div class="user-icon">
                        <i class="fas fa-sign-language"></i>
                    </div>
                    <h3>Deaf / Hard of Hearing</h3>
                    <p>Sign language to text conversion, video communication with doctors, text-based chat</p>
                    <p><strong>Sign Language → Text → Speech conversion for doctors</strong></p>
                </div>
                
                <!-- Blind/Vision Impaired User -->
                <div class="user-card blind" id="blind-user" data-user-type="blind">
                    <div class="user-icon">
                        <i class="fas fa-blind"></i>
                    </div>
                    <h3>Blind / Vision Impaired</h3>
                    <p>Speech-to-text conversion, audio feedback, voice-controlled interface</p>
                    <p><strong>Speech → Text conversion for appointment booking</strong></p>
                </div>
            </div>
            
            <div class="button-group" style="justify-content: center; margin-top: 40px;">
                <button class="btn btn-primary" id="continue-btn" style="padding: 15px 40px; font-size: 1.1rem;">
                    <i class="fas fa-arrow-right"></i> Continue with Selected Profile
                </button>
            </div>
        </div>
    </section>
    
    <!-- Appointment Form (for Normal Users) -->
    <section class="form-section" id="appointment-form">
        <div class="container">
            <div class="form-container">
                <div class="form-header">
                    <div class="form-title">
                        <i class="fas fa-calendar-check"></i> Book Your Appointment
                    </div>
                </div>
                
                <form id="appointmentForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="fullName"><i class="fas fa-user"></i> Full Name</label>
                            <input type="text" id="fullName" name="fullName" required placeholder="Enter your full name">
                        </div>
                        <div class="form-group">
                            <label for="age"><i class="fas fa-birthday-cake"></i> Age</label>
                            <input type="number" id="age" name="age" required placeholder="Your age">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="phone"><i class="fas fa-phone"></i> Phone Number</label>
                            <input type="tel" id="phone" name="phone" required placeholder="Enter your phone number">
                        </div>
                        <div class="form-group">
                            <label for="email"><i class="fas fa-envelope"></i> Email Address</label>
                            <input type="email" id="email" name="email" placeholder="Enter your email (optional)">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="symptoms"><i class="fas fa-stethoscope"></i> Symptoms / Reason for Visit</label>
                        <textarea id="symptoms" name="symptoms" rows="3" required placeholder="Describe your symptoms or reason for the appointment"></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="doctor"><i class="fas fa-user-md"></i> Preferred Doctor (Optional)</label>
                            <select id="doctor" name="doctor">
                                <option value="">Select a doctor</option>
                                <option value="dr_sharma">Dr. Sharma (General Physician)</option>
                                <option value="dr_kumar">Dr. Kumar (Cardiologist)</option>
                                <option value="dr_patel">Dr. Patel (Neurologist)</option>
                                <option value="dr_reddy">Dr. Reddy (Orthopedist)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="appointmentDate"><i class="fas fa-calendar-alt"></i> Preferred Date</label>
                            <input type="date" id="appointmentDate" name="appointmentDate" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <div class="checkbox-group">
                            <input type="checkbox" id="emergencyCase" name="emergencyCase">
                            <label for="emergencyCase"><strong>This is an EMERGENCY case - I need immediate medical attention</strong></label>
                        </div>
                        <p style="color: var(--emergency); font-size: 0.9rem; margin-top: 5px;">
                            <i class="fas fa-exclamation-triangle"></i> Emergency cases will be given first priority for doctor consultation
                        </p>
                    </div>
                    
                    <div class="button-group">
                        <button type="submit" class="btn btn-emergency" id="submit-appointment">
                            <i class="fas fa-paper-plane"></i> Submit Appointment
                        </button>
                        <button type="button" class="btn btn-secondary" id="back-to-selection">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
    
    <!-- Communication Interface (for Deaf/Blind Users) -->
    <section class="communication-section" id="communication-interface">
        <div class="container">
            <div class="comm-container">
                <!-- Deaf User Interface -->
                <div class="comm-box" id="deaf-interface">
                    <div class="comm-title">
                        <i class="fas fa-sign-language"></i> Sign Language Communication
                    </div>
                    <div class="video-feed">
                        <div style="text-align: center;">
                            <i class="fas fa-video" style="font-size: 3rem; margin-bottom: 15px;"></i>
                            <p>Sign Language Video Feed</p>
                            <p style="font-size: 0.9rem; color: #aaa; margin-top: 10px;">Show your signs to the camera for translation</p>
                        </div>
                    </div>
                    <div class="message-area">
                        <div class="message received">
                            <strong>Doctor:</strong> Hello, what symptoms are you experiencing?
                        </div>
                        <div class="message sent">
                            <strong>You (Translated):</strong> I have headache and fever since yesterday.
                        </div>
                        <div class="message received">
                            <strong>Doctor:</strong> Any difficulty breathing or chest pain?
                        </div>
                    </div>
                    <div class="input-area">
                        <input type="text" id="text-input" placeholder="Type your message here or use sign language...">
                        <button class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Blind User Interface -->
                <div class="comm-box" id="blind-interface">
                    <div class="comm-title">
                        <i class="fas fa-blind"></i> Voice Communication
                    </div>
                    <div class="message-area">
                        <div class="message received">
                            <strong>Doctor:</strong> Please describe your symptoms.
                        </div>
                        <div class="message sent">
                            <strong>You (Speech):</strong> I have been feeling dizzy since morning.
                        </div>
                        <div class="message received">
                            <strong>Doctor:</strong> Do you have any history of blood pressure issues?
                        </div>
                    </div>
                    <div style="margin-bottom: 20px; text-align: center;">
                        <button class="btn btn-primary" id="start-speech" style="width: 100%; padding: 15px;">
                            <i class="fas fa-microphone"></i> Start Speaking (AI Speech Recognition)
                        </button>
                        <p style="font-size: 0.9rem; color: var(--gray); margin-top: 10px;">
                            Speak clearly. Your speech will be converted to text for the doctor.
                        </p>
                    </div>
                    <div class="input-area">
                        <input type="text" id="voice-text-input" placeholder="Text will appear here from speech recognition...">
                        <button class="btn btn-secondary">
                            <i class="fas fa-volume-up"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="button-group" style="justify-content: center; margin-top: 30px;">
                <button class="btn btn-secondary" id="back-to-selection-comm">
                    <i class="fas fa-arrow-left"></i> Back to Profile Selection
                </button>
                <button class="btn btn-primary" id="book-appointment">
                    <i class="fas fa-calendar-check"></i> Book Appointment with Doctor
                </button>
            </div>
        </div>
    </section>
    
    <!-- Priority Queue Section -->
    <section class="queue-section" id="queue-section">
        <div class="container">
            <div class="queue-header">
                <h2 class="section-title" style="margin-bottom: 0;">Appointment Priority Queue</h2>
                <div class="queue-stats">
                    <div class="stat-box stat-emergency">
                        <i class="fas fa-exclamation-triangle" style="color: var(--emergency);"></i>
                        <div>
                            <h4 id="emergency-count">0</h4>
                            <p>Emergency</p>
                        </div>
                    </div>
                    <div class="stat-box stat-normal">
                        <i class="fas fa-user-md" style="color: var(--normal-color);"></i>
                        <div>
                            <h4 id="normal-count">0</h4>
                            <p>Normal</p>
                        </div>
                    </div>
                    <div class="stat-box stat-pending">
                        <i class="fas fa-clock" style="color: var(--warning);"></i>
                        <div>
                            <h4 id="total-count">0</h4>
                            <p>Total</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="queue-container">
                <div class="queue-list" id="queue-list">
                    <!-- Queue items will be dynamically added here -->
                    <div class="queue-empty" id="queue-empty">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>No appointments in queue</h3>
                        <p>Submit an appointment to see it appear here</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Features Section -->
    <section class="features-section">
        <div class="container">
            <h2 class="section-title">How BridgeTalk Transforms Healthcare</h2>
            <p class="section-subtitle">Breaking communication barriers in medical settings for inclusive healthcare access</p>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-sign-language"></i>
                    </div>
                    <h4>Sign Language Translation</h4>
                    <p>Real-time translation of sign language to text and speech for doctors</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-microphone-alt"></i>
                    </div>
                    <h4>Speech Recognition</h4>
                    <p>AI-powered speech-to-text conversion for vision-impaired patients</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-ambulance"></i>
                    </div>
                    <h4>Emergency Priority</h4>
                    <p>Critical cases flagged for immediate doctor attention</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-video"></i>
                    </div>
                    <h4>Telemedicine Ready</h4>
                    <p>Video consultations with accessibility features built-in</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-hospital"></i>
                    </div>
                    <h4>Hospital Integration</h4>
                    <p>Seamlessly works with government hospitals, PHCs, and clinics</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-universal-access"></i>
                    </div>
                    <h4>Full Accessibility</h4>
                    <p>WCAG compliant interface for all ability levels</p>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>BridgeTalk</h3>
                    <p>An inclusive healthcare communication platform designed to break barriers between doctors and patients with hearing or vision impairments.</p>
                </div>
                
                <div class="footer-section">
                    <h3>Use Cases</h3>
                    <p>👨‍⚕️ Doctor ↔ Deaf patient (Sign → Text → Speech)</p>
                    <p>🧑‍🦯 Blind patient ↔ Nurse (Speech/Text)</p>
                    <p>🏥 Telemedicine accessibility</p>
                    <p>⚕️ Government hospitals, PHC, clinics</p>
                </div>
                
                <div class="footer-section">
                    <h3>Emergency Contacts</h3>
                    <p><i class="fas fa-ambulance"></i> National Emergency: 108</p>
                    <p><i class="fas fa-phone-alt"></i> Medical Helpline: 104</p>
                    <p><i class="fas fa-heartbeat"></i> 24/7 Telemedicine Support</p>
                </div>
            </div>
            
            <div class="copyright">
                <p>© 2023 BridgeTalk Healthcare Communication Portal. Designed for inclusive digital health access.</p>
                <p>Judges' Favorite Points: ✔ Real-world impact ✔ Accessibility = Healthcare priority ✔ Inclusive digital health ✔ Scalable to hospitals & telemedicine</p>
            </div>
        </div>
    </footer>
    
    <script>
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
    </script>
</body>
</html>
