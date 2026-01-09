import { GoogleGenAI } from "@google/genai";

class GeminiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        if (!this.apiKey) {
            console.warn("GEMINI_API_KEY is not set in environment variables.");
        }
        this.client = new GoogleGenAI({ apiKey: this.apiKey });
    }

    /**
     * Generate slide plan using Gemini
     * @param {Object} params 
     */
    async generateSlidePlan({ topic, slideCount = 5, tone = 'professional', language = 'vi', includeImages = false }) {
        try {
            const prompt = this.buildPrompt({ topic, slideCount, tone, language, includeImages });

            const result = await this.client.models.generateContent({
                model: "models/gemini-2.5-flash",
                contents: [{
                    role: "user",
                    parts: [{ text: prompt }]
                }]
            });

            let text = result.text;

            // Clean up JSON string if it contains markdown code blocks
            if (text.startsWith('```json')) {
                text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
            } else if (text.startsWith('```')) {
                text = text.replace(/^```\n/, '').replace(/\n```$/, '');
            }

            const slidePlan = JSON.parse(text);
            return slidePlan.slides || [];
        } catch (error) {
            console.error('Gemini generation error:', error);
            throw new Error(`Failed to generate slides with AI: ${error.message}`);
        }
    }

    buildPrompt({ topic, slideCount, tone, language, includeImages }) {
        const languageInstruction = language === 'vi'
            ? 'Trả lời bằng tiếng Việt nhưng cấu trúc JSON (keys) phải giữ nguyên tiếng Anh.'
            : 'Respond in English.';

        return `
${languageInstruction}

Create a presentation about: "${topic}"

Requirements:
- Number of slides: ${slideCount}
- Tone: ${tone}

Return ONLY valid JSON in this exact structure.
Do not include any other text.

Structure:
{
  "slides": [
    {
      "title": "Title of the slide",
      "content": "Main text content (30-50 words)",
      "bullets": ["Bullet point 1", "Bullet point 2", "Bullet point 3"]
    }
  ]
}

Rules:
1. First slide should be a title slide.
2. Last slide should be a conclusion.
3. Each slide must have a 'title' and either 'content' (paragraph) or 'bullets' (array of strings), or both.
4. Ensure valid JSON format.
`.trim();
    }
}

export default new GeminiService();
