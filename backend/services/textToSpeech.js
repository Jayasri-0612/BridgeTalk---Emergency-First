const textToSpeech = require('@google-cloud/text-to-speech');
const util = require('util');
const fs = require('fs');
const path = require('path');

// Initialize Google Cloud Text-to-Speech client
let client;
try {
    client = new textToSpeech.TextToSpeechClient();
} catch (error) {
    console.warn('Google Cloud Text-to-Speech client initialization failed. Using fallback mode.');
    client = null;
}

class TextToSpeechService {
    constructor() {
        this.voices = {
            'en-US': {
                'male': 'en-US-Neural2-J',
                'female': 'en-US-Neural2-F',
                'child': 'en-US-Neural2-G'
            },
            'hi-IN': {
                'male': 'hi-IN-Neural2-C',
                'female': 'hi-IN-Neural2-A'
            },
            'ta-IN': {
                'male': 'ta-IN-Neural2-C',
                'female': 'ta-IN-Neural2-A'
            },
            'te-IN': {
                'male': 'te-IN-Neural2-C',
                'female': 'te-IN-Neural2-A'
            }
        };
    }

    /**
     * Convert text to speech and save to file
     * @param {string} text - Text to convert to speech
     * @param {string} outputPath - Path to save audio file
     * @param {Object} options - Options for speech synthesis
     * @returns {Promise<string>} - Path to generated audio file
     */
    async synthesizeSpeech(text, outputPath, options = {}) {
        try {
            const {
                languageCode = 'en-US',
                voiceGender = 'female',
                speakingRate = 1.0,
                pitch = 0,
                audioEncoding = 'MP3'
            } = options;

            // If Google Cloud client is not available, use fallback
            if (!client) {
                return await this.fallbackSynthesizeSpeech(text, outputPath, options);
            }

            // Select voice based on language and gender
            const voiceName = this.getVoiceName(languageCode, voiceGender);

            const request = {
                input: { text: text },
                voice: {
                    languageCode: languageCode,
                    name: voiceName,
                    ssmlGender: voiceGender.toUpperCase()
                },
                audioConfig: {
                    audioEncoding: audioEncoding,
                    speakingRate: speakingRate,
                    pitch: pitch,
                    effectsProfileId: ['telephony-class-application']
                }
            };

            // Perform text-to-speech request
            const [response] = await client.synthesizeSpeech(request);

            // Ensure directory exists
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Write audio content to file
            const writeFile = util.promisify(fs.writeFile);
            await writeFile(outputPath, response.audioContent, 'binary');

            console.log(`Speech synthesized successfully: ${outputPath}`);
            
            return {
                success: true,
                filePath: outputPath,
                duration: this.estimateAudioDuration(text, speakingRate)
            };
        } catch (error) {
            console.error('Text-to-speech synthesis error:', error);
            
            // Fallback to simple TTS if Google Cloud fails
            return await this.fallbackSynthesizeSpeech(text, outputPath, options);
        }
    }

    /**
     * Get audio buffer for text (for streaming)
     * @param {string} text - Text to convert to speech
     * @param {Object} options - Options for speech synthesis
     * @returns {Promise<Buffer>} - Audio buffer
     */
    async getAudioBuffer(text, options = {}) {
        try {
            const {
                languageCode = 'en-US',
                voiceGender = 'female',
                speakingRate = 1.0,
                audioEncoding = 'MP3'
            } = options;

            if (!client) {
                throw new Error('Google Cloud client not available');
            }

            const voiceName = this.getVoiceName(languageCode, voiceGender);

            const request = {
                input: { text: text },
                voice: {
                    languageCode: languageCode,
                    name: voiceName,
                    ssmlGender: voiceGender.toUpperCase()
                },
                audioConfig: {
                    audioEncoding: audioEncoding,
                    speakingRate: speakingRate
                }
            };

            const [response] = await client.synthesizeSpeech(request);
            return response.audioContent;
        } catch (error) {
            console.error('Get audio buffer error:', error);
            throw error;
        }
    }

    /**
     * Convert text to speech with SSML (for more control)
     * @param {string} ssml - SSML markup text
     * @param {string} outputPath - Path to save audio file
     * @param {Object} options - Options for speech synthesis
     * @returns {Promise<string>} - Path to generated audio file
     */
    async synthesizeSSML(ssml, outputPath, options = {}) {
        try {
            const {
                languageCode = 'en-US',
                voiceGender = 'female',
                audioEncoding = 'MP3'
            } = options;

            if (!client) {
                throw new Error('Google Cloud client not available');
            }

            const voiceName = this.getVoiceName(languageCode, voiceGender);

            const request = {
                input: { ssml: ssml },
                voice: {
                    languageCode: languageCode,
                    name: voiceName,
                    ssmlGender: voiceGender.toUpperCase()
                },
                audioConfig: {
                    audioEncoding: audioEncoding
                }
            };

            const [response] = await client.synthesizeSpeech(request);

            // Ensure directory exists
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            const writeFile = util.promisify(fs.writeFile);
            await writeFile(outputPath, response.audioContent, 'binary');

            return {
                success: true,
                filePath: outputPath
            };
        } catch (error) {
            console.error('SSML synthesis error:', error);
            throw error;
        }
    }

    /**
     * Convert text to speech for multiple languages
     * @param {Array} segments - Array of text segments with language codes
     * @param {string} outputPath - Path to save combined audio
     * @returns {Promise<string>} - Path to generated audio file
     */
    async synthesizeMultilingual(segments, outputPath) {
        try {
            // This would require combining multiple audio files
            // For now, we'll just synthesize the first segment
            const firstSegment = segments[0];
            return await this.synthesizeSpeech(firstSegment.text, outputPath, {
                languageCode: firstSegment.language
            });
        } catch (error) {
            console.error('Multilingual synthesis error:', error);
            throw error;
        }
    }

    /**
     * Generate emergency announcement audio
     * @param {Object} emergencyInfo - Emergency information
     * @returns {Promise<string>} - Path to generated audio file
     */
    async generateEmergencyAnnouncement(emergencyInfo) {
        const {
            patientName,
            emergencyType,
            location,
            instructions
        } = emergencyInfo;

        const announcement = `Emergency alert. Patient ${patientName} requires immediate attention. ` +
            `Emergency type: ${emergencyType}. Location: ${location}. ${instructions || ''}`;

        const outputPath = path.join(__dirname, '../../uploads/audio', 
            `emergency-${Date.now()}.mp3`);

        return await this.synthesizeSpeech(announcement, outputPath, {
            voiceGender: 'female',
            speakingRate: 1.1,
            pitch: 2.0
        });
    }

    /**
     * Generate appointment reminder audio
     * @param {Object} appointment - Appointment details
     * @param {string} languageCode - Language code for reminder
     * @returns {Promise<string>} - Path to generated audio file
     */
    async generateAppointmentReminder(appointment, languageCode = 'en-US') {
        const reminder = `Hello ${appointment.fullName}. This is a reminder for your ` +
            `healthcare appointment on ${new Date(appointment.appointmentDate).toLocaleDateString()}. ` +
            `Please be at the hospital 15 minutes before your scheduled time.`;

        const outputPath = path.join(__dirname, '../../uploads/audio', 
            `reminder-${appointment._id}.mp3`);

        return await this.synthesizeSpeech(reminder, outputPath, {
            languageCode: languageCode,
            voiceGender: 'female',
            speakingRate: 0.9
        });
    }

    /**
     * Generate medication instructions audio
     * @param {Object} prescription - Prescription details
     * @param {string} languageCode - Language code for instructions
     * @returns {Promise<string>} - Path to generated audio file
     */
    async generateMedicationInstructions(prescription, languageCode = 'en-US') {
        const instructions = `Medication instructions for ${prescription.medicineName}. ` +
            `Take ${prescription.dosage} ${prescription.frequency}. ${prescription.specialInstructions || ''}`;

        const outputPath = path.join(__dirname, '../../uploads/audio', 
            `medication-${Date.now()}.mp3`);

        return await this.synthesizeSpeech(instructions, outputPath, {
            languageCode: languageCode,
            voiceGender: 'male',
            speakingRate: 0.85
        });
    }

    /**
     * Get available voices for a language
     * @param {string} languageCode - Language code
     * @returns {Array} - List of available voices
     */
    getVoicesForLanguage(languageCode = 'en-US') {
        return this.voices[languageCode] || this.voices['en-US'];
    }

    /**
     * Get voice name based on language and gender
     * @param {string} languageCode - Language code
     * @param {string} gender - Voice gender
     * @returns {string} - Voice name
     */
    getVoiceName(languageCode, gender) {
        const languageVoices = this.voices[languageCode] || this.voices['en-US'];
        return languageVoices[gender] || languageVoices['female'];
    }

    /**
     * Estimate audio duration based on text length and speaking rate
     * @param {string} text - Input text
     * @param {number} speakingRate - Speaking rate
     * @returns {number} - Estimated duration in seconds
     */
    estimateAudioDuration(text, speakingRate = 1.0) {
        // Average speaking rate: 150 words per minute
        const wordsPerMinute = 150;
        const wordCount = text.split(/\s+/).length;
        const durationMinutes = wordCount / (wordsPerMinute * speakingRate);
        return Math.ceil(durationMinutes * 60); // Convert to seconds
    }

    /**
     * Fallback text-to-speech using browser's SpeechSynthesis (for development)
     * @param {string} text - Text to convert
     * @param {string} outputPath - Output path
     * @param {Object} options - Options
     * @returns {Promise<Object>} - Result object
     */
    async fallbackSynthesizeSpeech(text, outputPath, options = {}) {
        console.log('Using fallback text-to-speech (simulated)');
        
        // In a real implementation, you might use a different TTS service
        // For now, we'll create a silent audio file as placeholder
        
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Create a simple text file indicating this is a simulation
        const infoPath = outputPath.replace('.mp3', '.txt');
        fs.writeFileSync(infoPath, `TTS Simulation\nText: ${text}\nOptions: ${JSON.stringify(options)}`);

        return {
            success: true,
            filePath: outputPath,
            simulated: true,
            infoFile: infoPath,
            duration: this.estimateAudioDuration(text)
        };
    }

    /**
     * Convert text to speech with emotional tone
     * @param {string} text - Text to convert
     * @param {string} emotion - Emotion (happy, sad, calm, excited)
     * @param {string} outputPath - Output path
     * @returns {Promise<string>} - Path to audio file
     */
    async synthesizeWithEmotion(text, emotion, outputPath) {
        const emotionSettings = {
            happy: { pitch: 2.0, speakingRate: 1.1 },
            sad: { pitch: -1.0, speakingRate: 0.8 },
            calm: { pitch: 0, speakingRate: 0.9 },
            excited: { pitch: 3.0, speakingRate: 1.3 },
            serious: { pitch: -0.5, speakingRate: 0.95 }
        };

        const settings = emotionSettings[emotion] || emotionSettings.calm;

        return await this.synthesizeSpeech(text, outputPath, {
            pitch: settings.pitch,
            speakingRate: settings.speakingRate
        });
    }

    /**
     * Batch convert multiple texts to speech
     * @param {Array} items - Array of {text, outputPath, options}
     * @returns {Promise<Array>} - Array of results
     */
    async batchSynthesize(items) {
        const results = [];
        for (const item of items) {
            try {
                const result = await this.synthesizeSpeech(
                    item.text,
                    item.outputPath,
                    item.options
                );
                results.push({
                    ...result,
                    original: item
                });
            } catch (error) {
                results.push({
                    error: error.message,
                    original: item
                });
            }
        }
        return results;
    }

    /**
     * Clean up old audio files
     * @param {number} ageInHours - Maximum age of files to keep
     */
    async cleanupOldFiles(ageInHours = 24) {
        const audioDir = path.join(__dirname, '../../uploads/audio');
        const files = fs.readdirSync(audioDir);
        const now = Date.now();
        const maxAge = ageInHours * 60 * 60 * 1000;

        let deletedCount = 0;
        for (const file of files) {
            const filePath = path.join(audioDir, file);
            const stats = fs.statSync(filePath);
            if (now - stats.mtimeMs > maxAge) {
                fs.unlinkSync(filePath);
                deletedCount++;
            }
        }

        console.log(`Cleaned up ${deletedCount} old audio files`);
        return deletedCount;
    }
}

module.exports = new TextToSpeechService();