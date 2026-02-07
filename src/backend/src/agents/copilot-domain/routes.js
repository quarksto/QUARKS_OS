const express = require('express');
const router = express.Router();
const { copilotChatUpload, handleMulterError } = require('../../middleware/fileHandler');

module.exports = (maestro) => {

    // POST /copilot/chat
    // Body: message, userId?, sessionId?
    // File: 'file' (optional) — image, PDF, video, audio
    router.post('/chat', copilotChatUpload, handleMulterError, async (req, res) => {
        try {
            const { message, userId, sessionId } = req.body || {};
            const file = req.file;

            if (!maestro.agents['copilot']) {
                return res.status(503).json({ error: 'Copilot não inicializado. Verifique o backend.' });
            }

            const result = await maestro.agents['copilot'].execute('CHAT', {
                userId: userId || 'anonymous',
                sessionId,
                message: message || '',
                file
            });

            res.json(result);
        } catch (error) {
            if (error.message && error.message.includes('GOOGLE_API_KEY')) {
                return res.status(503).json({
                    error: 'API do Gemini não configurada. Defina GOOGLE_API_KEY no .env do backend.'
                });
            }
            console.error('[API] /copilot/chat failed:', error);
            res.status(500).json({ error: error.message || 'Erro ao processar mensagem.' });
        }
    });

    return router;
};
