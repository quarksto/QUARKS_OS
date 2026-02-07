import { useState } from 'react';
import api from '../services/api';

const useChat = (userId) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);

    const sendMessage = async (text, file = null) => {
        // 1. Optimistic UI Update
        const userMsg = { role: 'user', content: text, file: file?.name };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('message', text);
            if (sessionId) formData.append('sessionId', sessionId);
            // Use real userId from auth context, or fallback (handle null case gracefully)
            if (userId) formData.append('userId', userId);

            if (file) formData.append('file', file);

            // 2. API Call (backend usa Prisma: AgentSession, AgentMessage)
            // Usando api instance para garantir headers de auth se necessário
            const response = await api.post('/copilot/chat', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // 3. Update State with Server Response
            const { sessionId: newSessionId, role, content } = response.data;
            if (!sessionId) setSessionId(newSessionId);

            setMessages(prev => [...prev, { role, content }]);

        } catch (error) {
            console.error('Chat failed:', error);
            const apiError = error.response?.data?.error;
            const status = error.response?.status;
            let msg = apiError || 'Erro ao enviar mensagem. Tente novamente.';
            if (status === 503 && (apiError || '').toLowerCase().includes('api')) {
                msg = 'Copilot indisponível: API do Gemini não configurada (GOOGLE_API_KEY no backend).';
            }
            if (status === 413) msg = 'Arquivo muito grande. Limite: 25MB.';
            setMessages(prev => [...prev, { role: 'system', content: msg }]);
        } finally {
            setLoading(false);
        }
    };

    return { messages, sendMessage, loading };
};

export default useChat;
