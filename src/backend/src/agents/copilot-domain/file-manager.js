const { GoogleAIFileManager } = require("@google/generative-ai/server");

/**
 * Service to manage file uploads to Gemini File API using the official SDK.
 * Used for large files (Video, Audio) that exceed inline Base64 limits.
 */
class FileManager {
    constructor() {
        this._client = null; // Lazy init
    }

    get client() {
        if (this._client) return this._client;
        if (!process.env.GOOGLE_API_KEY) {
            throw new Error('GOOGLE_API_KEY not set (required for File API). Configure in backend .env');
        }
        this._client = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);
        return this._client;
    }

    /**
     * Uploads a file buffer to Gemini.
     * @param {Buffer} buffer - The file buffer
     * @param {string} mimeType - The file mime type
     * @param {string} displayName - Optional display name
     * @returns {Promise<Object>} - { fileUri, mimeType, name }
     */
    async uploadFile(buffer, mimeType, displayName) {
        try {
            const fs = require('fs');
            const path = require('path');
            const os = require('os');

            const tempDir = os.tmpdir();
            const tempFileWithExt = path.join(tempDir, `upload_${Date.now()}_${Math.random().toString(36).substring(7)}.${mimeType.split('/')[1] || 'bin'}`);

            // Write buffer to temp file
            fs.writeFileSync(tempFileWithExt, buffer);

            console.log(`[FileManager] Uploading ${displayName || 'file'} to Gemini...`);

            const uploadResponse = await this.client.uploadFile(tempFileWithExt, {
                mimeType: mimeType,
                displayName: displayName || "Uploaded File"
            });

            console.log(`[FileManager] Upload successful: ${uploadResponse.file.uri}`);

            // Cleanup temp file
            fs.unlinkSync(tempFileWithExt);

            return {
                fileUri: uploadResponse.file.uri,
                mimeType: uploadResponse.file.mimeType,
                name: uploadResponse.file.name
            };

        } catch (error) {
            console.error('[FileManager] Upload failed:', error);
            throw error;
        }
    }

    /**
     * Gets file state.
     * @param {string} name - The file resource name (e.g. files/...)
     */
    async getFile(name) {
        return await this.client.getFile(name);
    }
}

module.exports = new FileManager();
