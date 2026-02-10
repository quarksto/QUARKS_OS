import api from './api';

const COPILOT_API_URL = '/copilot/chat';

/**
 * Sends a message to the Copilot backend.
 * Supports text and file (image/video/audio).
 */
export const sendMessageToCopilot = async ({ message, file, sessionId, userId, context }) => {
    const formData = new FormData();

    if (message) formData.append('message', message);
    if (file) formData.append('file', file);
    if (sessionId) formData.append('sessionId', sessionId);
    if (userId) formData.append('userId', userId);
    if (context) formData.append('context', JSON.stringify(context));

    try {
        const response = await api.post(COPILOT_API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Copilot Service Error:', error);
        throw error;
    }
};

export default {
    sendMessageToCopilot
};
