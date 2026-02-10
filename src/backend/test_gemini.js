const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { GoogleGenAI } = require("@google/genai");

async function testGemini() {
    console.log("🔍 Checking GOOGLE_API_KEY...");
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        console.error("❌ GOOGLE_API_KEY is not set in .env file.");
        process.exit(1);
    }

    console.log("✅ API Key found (starting with: " + apiKey.substring(0, 5) + "...)");

    try {
        const ai = new GoogleGenAI({ apiKey });

        console.log("📋 Listing available models...");
        try {
            const modelsResult = await ai.models.list();
            console.log("Available Models:", modelsResult.models.map(m => m.name));
        } catch (listErr) {
            console.warn("⚠️ Could not list models:", listErr.message);
        }

        console.log("🚀 Sending test prompt to Gemini (trying gemini-3-flash-preview)...");
        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: 'user', parts: [{ text: "Respond only with 'OK' if you can read this." }] }]
        });

        console.log("📡 Raw Result received.");

        // In the new SDK result is the response
        const text = result.content?.parts?.[0]?.text;

        console.log("📡 Gemini Response Text:", text);

        if (text && text.trim().includes("OK")) {
            console.log("🎉 SUCCESS: Gemini API is connected and responding correctly!");
        } else {
            console.warn("⚠️ Gemini responded, but not as expected. Full Result:", JSON.stringify(result, null, 2));
        }
    } catch (error) {
        console.error("❌ Gemini API Test Failed:");
        console.error(error.message);
        if (error.stack) console.log(error.stack);
    }
}

testGemini();
