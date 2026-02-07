const { GoogleGenAI } = require("@google/genai");
const dotenv = require('dotenv');
dotenv.config({ path: 'src/backend/.env' });

async function testStream() {
    if (!process.env.GOOGLE_API_KEY) {
        console.error("GOOGLE_API_KEY non set in src/backend/.env");
        return;
    }

    const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    const model = genAI.models.get("gemini-1.5-flash"); // Using a known stable model name for test

    console.log("Starting stream test...");
    try {
        const result = await model.generateContentStream({
            contents: [{ role: 'user', parts: [{ text: 'Conte uma piada curta sobre energia solar.' }] }]
        });

        let fullText = "";
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            process.stdout.write(chunkText);
            fullText += chunkText;
        }
        console.log("\n\nStream finished successfully.");
    } catch (err) {
        console.error("Stream test failed:", err);
    }
}

testStream();
