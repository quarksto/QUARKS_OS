const { GoogleGenAI } = require("@google/genai");
const dotenv = require('dotenv');
dotenv.config();

async function testStream() {
    if (!process.env.GOOGLE_API_KEY) {
        console.error("GOOGLE_API_KEY not set");
        return;
    }

    const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    console.log("Starting stream test with gemini-3-flash-preview...");
    try {
        const stream = await genAI.models.generateContentStream({
            model: "gemini-3-flash-preview",
            contents: [{ role: 'user', parts: [{ text: 'Conte uma piada curta sobre energia solar.' }] }]
        });

        let fullText = "";
        for await (const chunk of stream) {
            const text = chunk.text;
            if (text) {
                process.stdout.write(text);
                fullText += text;
            }
        }
        console.log("\n\nStream finished successfully.");
    } catch (err) {
        console.error("Stream test failed:", err);
    }
}

testStream();
