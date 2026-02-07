/**
 * File upload middleware for Copilot (images, video, audio).
 * Uses multer memory storage; 25MB limit (Gemini inline safe).
 * For files >20MB consider Gemini File API (T021).
 */
const multer = require('multer');

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_PREFIXES = ['image/', 'video/', 'audio/'];
const ALLOWED_EXACT = ['application/pdf'];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype) {
            return cb(null, true);
        }
        const ok = ALLOWED_PREFIXES.some(p => file.mimetype.startsWith(p)) || ALLOWED_EXACT.includes(file.mimetype);
        if (ok) {
            cb(null, true);
        } else {
            cb(new Error(`Tipo de arquivo não suportado: ${file.mimetype}. Use imagem, PDF, vídeo ou áudio.`), false);
        }
    }
});

/** Single file upload for POST /copilot/chat (field name: 'file') */
const copilotChatUpload = upload.single('file');

/** Error handler for multer (e.g. LIMIT_FILE_SIZE) - use in routes after upload */
const handleMulterError = (err, req, res, next) => {
    if (!err || typeof err.code !== 'string') return next(err);
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            error: 'Arquivo muito grande. Limite: 25MB. Para arquivos maiores, use vídeo/áudio mais curto.'
        });
    }
    if (err.message && err.message.includes('Tipo de arquivo')) {
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message || 'Erro no upload' });
};

module.exports = {
    copilotChatUpload,
    handleMulterError,
    MAX_FILE_SIZE
};
