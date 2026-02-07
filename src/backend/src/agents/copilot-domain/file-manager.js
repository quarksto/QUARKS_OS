const { GoogleGenAI } = require("@google/genai");

/**
 * Service to manage file uploads to Gemini File API.
 * Used for large files (Video, Audio) that exceed inline Base64 limits or token efficiency.
 */
class FileManager {
    constructor() {
        this._client = null; // Lazy init so backend can start without GOOGLE_API_KEY
    }

    get client() {
        if (this._client) return this._client;
        if (!process.env.GOOGLE_API_KEY) {
            throw new Error('GOOGLE_API_KEY not set (required for File API). Configure in backend .env');
        }
        this._client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
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
            const tempFilePath = path.join(tempDir, `upload_${Date.now()}_${Math.random().toString(36).substring(7)}`);

            // Map common extensions
            const ext = mimeType.split('/')[1] || 'bin';
            const tempFileWithExt = `${tempFilePath}.${ext}`;

            // Write buffer to temp file
            fs.writeFileSync(tempFileWithExt, buffer);

            console.log(`[FileManager] Uploading ${displayName || 'file'} to Gemini...`);

            // Use client.files.upload
            // Expected signature: upload({ file: path, mimeType: ... })
            // It returns { file: { uri, mimeType, name, state... } }
            const uploadResponse = await this.client.files.upload({
                file: tempFileWithExt,
                config: { // Some SDK versions put metadata in config or options
                    mimeType: mimeType,
                    displayName: displayName || "Uploaded File"
                }
            });

            // Note: The structure of uploadResponse depends on the exact version. 
            // Usually uploadResponse.file contains metadata.
            // If uploadResponse has a 'file' property, use it. else assume it is the file object.
            const fileData = uploadResponse.file || uploadResponse;

            console.log(`[FileManager] Upload successful: ${fileData.uri}`);

            // Cleanup temp file
            fs.unlinkSync(tempFileWithExt);

            return {
                fileUri: fileData.uri,
                mimeType: fileData.mimeType,
                name: fileData.name
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
        return await this.client.files.get({ name });
    }
}

module.exports = new FileManager();
