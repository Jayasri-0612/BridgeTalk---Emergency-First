// Simulated sign language AI service
class SignLanguageAIService {
    async processVideo(videoUrl) {
        // Simulate AI processing
        return {
            text: "I am feeling dizzy and have chest pain. It started this morning.",
            confidence: 0.89,
            gestures: ["chest", "pain", "dizzy"]
        };
    }

    async processFrame(frame) {
        // For real-time processing
        return {
            gesture: "pain",
            confidence: 0.92
        };
    }
}

module.exports = new SignLanguageAIService();