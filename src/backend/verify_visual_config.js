require('dotenv').config();
const visualAgent = require('./src/modules/visual-design');

async function main() {
    console.log('--- Verifying Visual Design Configuration (PYTHON PROXY) ---');

    // NOTE: visualAgent is now a Proxy to Localhost Python Service
    // We cannot check visualAgent.ai or models directly.

    // Update local proxy port if we changed it
    if (visualAgent.PYTHON_SERVICE_URL) {
        // visualAgent.PYTHON_SERVICE_URL = 'http://localhost:8005'; // Hack if not configurable
        // Best to ensure the agent code defaults to 8005 or reads env.
        // Let's rely on agent implementation for now, assuming 8001, but we need to match it.
    }

    // Test 1: Image Generation via Proxy
    try {
        console.log('\nTesting Image Generation (Proxy -> Python -> Imagen 3)...');
        const prompt = "A small minimalistic solar icon, vector style, flat color";
        // The Proxy returns { success: true, url: ... } or { error: ... }

        const result = await visualAgent.generateImage(prompt);

        if (result.error) throw new Error(result.error);
        if (!result.success && !result.url) throw new Error("Invalid response format");

        console.log('✅ Image Gen Success:', result.url);
    } catch (err) {
        console.error('❌ Image Gen Failed:', err.message);
    }

    try {
        console.log('\nTesting Video Generation (Proxy -> Python -> Veo 2)...');
        const prompt = "A solar panel rotating in sunlight, 3d render, 2 seconds";
        const result = await visualAgent.generateVideo(prompt);

        if (result.error) throw new Error(result.error);
        if (!result.success && !result.url) throw new Error("Invalid response format");

        console.log('✅ Video Gen Success:', result.url);
    } catch (err) {
        console.error('❌ Video Gen Failed:', err.message);
        if (err.message.includes("ECONNREFUSED")) {
            console.log("💡 HINT: Is the Python Visual Engine running? (visual_main.py)");
        }
    }
}

main();
