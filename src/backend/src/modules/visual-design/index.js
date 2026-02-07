const fetch = require('node-fetch'); // Ensure node-fetch is available (or use built-in in Node 18+)

class VisualDesignProxy {
    constructor() {
        this.PYTHON_SERVICE_URL = 'http://localhost:8005';
    }

    async generateImage(prompt) {
        console.log(`[VisualProxy] Requesting Image from Python: "${prompt}"`);
        try {
            const response = await fetch(`${this.PYTHON_SERVICE_URL}/generate-image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, aspect_ratio: "16:9" })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Python Service Error: ${errText}`);
            }

            const data = await response.json();
            console.log(`[VisualProxy] Image Success: ${data.url}`);
            return data; // { success: true, url: '/generated/...' }

        } catch (error) {
            console.error('[VisualProxy] Image Gen Failed:', error.message);
            // Fallback to error message, frontend handles it
            return { error: error.message };
        }
    }

    async generateVideo(prompt) {
        console.log(`[VisualProxy] Requesting Video from Python: "${prompt}"`);
        try {
            const response = await fetch(`${this.PYTHON_SERVICE_URL}/generate-video`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, duration_seconds: 5 })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Python Service Error: ${errText}`);
            }

            const data = await response.json();
            console.log(`[VisualProxy] Video Success: ${data.url}`);
            return data;

        } catch (error) {
            console.error('[VisualProxy] Video Gen Failed:', error.message);
            return { error: error.message };
        }
    }
}

module.exports = new VisualDesignProxy();
