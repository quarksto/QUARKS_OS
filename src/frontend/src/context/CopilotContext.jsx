import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealtime } from '../providers/RealtimeProvider';
import { useMode } from '../providers/ModeProvider';

const CopilotContext = createContext();

export const CopilotProvider = ({ children }) => {
    const { socket, connected } = useRealtime();
    const navigate = useNavigate();
    const { setMode } = useMode();
    // ONE Source of Truth for State
    const [viewMode, setViewMode] = useState('closed'); // 'closed' | 'standard' | 'expanded'

    // Derived state for compatibility
    const isOpen = viewMode !== 'closed';

    const [activeContext, setActiveContext] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isThinking, setIsThinking] = useState(false);

    // Ref para rastrear a mensagem que está sendo streamada no momento
    const streamingMessageIdRef = useRef(null);

    // Listen for Streaming Chunks
    useEffect(() => {
        if (!socket || !connected) return;

        const sessionId = localStorage.getItem('copilot_session_id');
        if (sessionId) {
            socket.emit('subscribe:copilot', { sessionId });
        }

        const handleSession = ({ sessionId: newSessionId }) => {
            if (newSessionId) {
                localStorage.setItem('copilot_session_id', newSessionId);
                socket.emit('subscribe:copilot', { sessionId: newSessionId });
            }
        };

        const handleChunk = ({ sessionId: chunkSessionId, chunk, index }) => {
            setMessages(prev => {
                const lastMsg = prev[prev.length - 1];

                // Se o ID da última mensagem for o que estamos streamando, atualiza
                if (lastMsg && lastMsg.id === streamingMessageIdRef.current) {
                    return [
                        ...prev.slice(0, -1),
                        { ...lastMsg, text: lastMsg.text + chunk }
                    ];
                }

                // Fallback: se não encontrarmos (ex: primeira chunk), criamos se for index 0
                if (index === 0) {
                    const newAiMsg = { id: Date.now(), type: 'ai', text: chunk };
                    streamingMessageIdRef.current = newAiMsg.id;
                    return [...prev, newAiMsg];
                }

                return prev;
            });
            setIsThinking(false);
        };

        const handleError = ({ message }) => {
            console.error('Copilot Stream Error:', message);
            setIsThinking(false);
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'ai',
                text: `Erro: ${message || 'Ocorreu um problema ao processar sua mensagem.'}`
            }]);
        };

        socket.on('copilot:session', handleSession);
        socket.on('copilot:stream_chunk', handleChunk);
        socket.on('copilot:error', handleError);

        return () => {
            socket.off('copilot:session', handleSession);
            socket.off('copilot:stream_chunk', handleChunk);
            socket.off('copilot:error', handleError);
        };
    }, [socket, connected]);

    // Context Injection
    const setContext = (context) => {
        setActiveContext(context);
    };

    // Actions
    const openSidebar = () => {
        if (viewMode === 'closed') setViewMode('standard');
    };

    const closeSidebar = () => {
        setViewMode('closed');
    };

    const toggleSidebar = () => {
        setViewMode(prev => prev === 'closed' ? 'standard' : 'closed');
    };

    const toggleExpansion = () => {
        setViewMode(prev => prev === 'expanded' ? 'standard' : 'expanded');
    };

    const sendMessage = async (text, file, contextOverride = null) => {
        if (viewMode === 'closed') setViewMode('standard');

        const ctx = contextOverride != null ? contextOverride : activeContext;
        if (contextOverride != null) setActiveContext(contextOverride);

        const userMsg = { id: Date.now(), type: 'user', text };
        if (file) userMsg.file = { name: file.name, type: file.type };

        setMessages(prev => [...prev, userMsg]);
        setIsThinking(true);

        const sessionId = localStorage.getItem('copilot_session_id');

        try {
            // Se tivermos arquivo, continuamos usando POST (mais estável para blobs grandes)
            // Caso contrário, usamos WebSocket para disparar o stream
            if (file) {
                const { sendMessageToCopilot } = await import('../services/copilotService');
                const response = await sendMessageToCopilot({
                    message: text,
                    file: file,
                    sessionId,
                    userId: 'user-123',
                    context: ctx
                });

                if (response.sessionId) {
                    localStorage.setItem('copilot_session_id', response.sessionId);
                    if (socket) socket.emit('subscribe:copilot', { sessionId: response.sessionId });
                }

                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    type: 'ai',
                    text: response.content || response.text || "Sem resposta.",
                }]);
                setIsThinking(false);
            } else if (socket && connected) {
                // Criar placeholder para a mensagem da IA que virá via stream
                const placeholderId = Date.now() + 10;
                streamingMessageIdRef.current = placeholderId;

                setMessages(prev => [...prev, {
                    id: placeholderId,
                    type: 'ai',
                    text: ''
                }]);

                socket.emit('copilot:message', {
                    sessionId,
                    message: text,
                    context: ctx
                });

                // A atualização virá via 'copilot:stream_chunk'
            } else {
                throw new Error('Sem conexão com o assistente.');
            }

        } catch (error) {
            console.error("Copilot Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 20,
                type: 'ai',
                text: "Erro ao processar mensagem ou assistente indisponível."
            }]);
            setIsThinking(false);
        }
    };

    const triggerAction = async (actionType, payload = {}) => {
        if (viewMode === 'closed') setViewMode('standard');

        const normalized = String(actionType).toLowerCase();
        const leadId = payload.leadId ?? activeContext?.leadId ?? activeContext?.lead?.id ?? activeContext?.id;

        switch (normalized) {
            case 'generate_proposal': {
                if (leadId) {
                    navigate(`/proposals/new?leadId=${leadId}`);
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        type: 'ai',
                        text: 'Abrindo criação de proposta para este lead.'
                    }]);
                } else {
                    sendMessage('Gere uma proposta para o lead atual. Qual lead devo usar?');
                }
                break;
            }
            case 'schedule_visit': {
                if (leadId) {
                    navigate(`/leads/${leadId}`);
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        type: 'ai',
                        text: 'Abrindo detalhes do lead para agendar visita.'
                    }]);
                } else {
                    sendMessage('Quero agendar uma visita. Qual lead?');
                }
                break;
            }
            case 'switch_mode': {
                const mode = payload.mode || 'manage';
                if (['sales', 'manage', 'projects'].includes(mode)) {
                    setMode(mode);
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        type: 'ai',
                        text: `Modo alterado para ${mode}.`
                    }]);
                } else {
                    sendMessage(`Mude para o modo ${mode}.`);
                }
                break;
            }
            default:
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'ai',
                    text: `Iniciando ação: ${actionType}...`,
                    action: { type: actionType, payload, status: 'pending' }
                }]);
        }
    };

    return (
        <CopilotContext.Provider value={{
            isOpen,
            viewMode,
            openSidebar,
            closeSidebar,
            toggleSidebar,
            toggleExpansion,
            activeContext,
            setContext,
            messages,
            sendMessage,
            isThinking,
            triggerAction
        }}>
            {children}
        </CopilotContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCopilot = () => {
    const context = useContext(CopilotContext);
    if (!context) {
        throw new Error('useCopilot must be used within a CopilotProvider');
    }
    return context;
};

export default CopilotProvider;
