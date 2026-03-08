// Simulated speech-to-text service
class SpeechToTextService {
    async transcribe(audioUrl) {
        // Simulate API call
        return {
            text: "I have headache and fever since yesterday. I need to see a doctor.",
            confidence: 0.95
        };
    }

    async streamTranscribe(audioStream) {
        // For real-time transcription
        return "Patient is describing symptoms...";
    }
}

module.exports = new SpeechToTextService();