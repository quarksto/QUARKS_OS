import React, { useState, useEffect, useRef } from 'react';
import { useRealtime } from '../../providers/RealtimeProvider';
import api from '../../services/api';

export function QuickChatPanel({ leadId }) {
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendError, setSendError] = useState(null);
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const scrollRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const { socket, connected } = useRealtime();

    useEffect(() => {
        if (!leadId) return;

        setLoading(true);
        api.get(`/messages/lead/${leadId}`)
            .then(res => setMessages(res.data))
            .catch(err => console.error('Load messages error:', err))
            .finally(() => setLoading(false));

        api.patch(`/messages/read/${leadId}`).catch(() => { });

        if (socket && connected) {
            socket.emit('subscribe:lead', { leadId });

            const handleNewMessage = (msg) => {
                if (msg.leadId === leadId) {
                    setMessages(prev => {
                        if (prev.find(m => m.id === msg.id)) return prev;
                        return [...prev, msg];
                    });
                    api.patch(`/messages/read/${leadId}`).catch(() => { });
                }
            };

            const handleTyping = (data) => {
                if (data.leadId === leadId) {
                    setIsOtherTyping(data.isTyping);
                }
            };

            socket.on('message:new', handleNewMessage);
            socket.on('chat:typing', handleTyping);

            return () => {
                socket.emit('unsubscribe:lead', { leadId });
                socket.off('message:new', handleNewMessage);
                socket.off('chat:typing', handleTyping);
            };
        }
    }, [leadId, socket, connected]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, isOtherTyping]);

    const handleInputChange = (val) => {
        setChatInput(val);

        if (socket && connected && leadId) {
            socket.emit('chat:typing', { leadId, isTyping: true });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('chat:typing', { leadId, isTyping: false });
            }, 2000);
        }
    };

    const handleSend = async () => {
        if (!chatInput.trim() || !leadId || sending) return;

        const content = chatInput.trim();
        const leadIdStr = String(leadId);
        setChatInput('');
        setSendError(null);
        setSending(true);

        const tempId = 'temp-' + Date.now();
        const optimisticMsg = {
            id: tempId,
            content,
            role: 'USER',
            createdAt: new Date().toISOString(),
            isOptimistic: true
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            const response = await api.post('/messages', { leadId: leadIdStr, content });
            const created = response?.data;
            if (created && created.id) {
                setMessages(prev => prev.map(m => m.id === tempId ? { ...created, createdAt: created.createdAt || new Date().toISOString() } : m));
            } else {
                setMessages(prev => prev.filter(m => m.id !== tempId));
                setSendError('Resposta inválida do servidor.');
            }
        } catch (err) {
            console.error('[QuickChat] Send message error:', err);
            setMessages(prev => prev.filter(m => m.id !== tempId));
            const msg = err.response?.data?.error || err.message || 'Falha ao enviar. Tente novamente.';
            setSendError(typeof msg === 'string' ? msg : 'Falha ao enviar. Tente novamente.');
        } finally {
            setSending(false);
        }
    };

    if (!leadId) return null;

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6"
            >
                <div className="flex justify-center mb-4">
                    <span className="ds-meta text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">
                        Histórico de Atendimento
                    </span>
                </div>

                {messages.map((msg) => (
                    <MessageBubble key={msg.id} msg={msg} />
                ))}

                {isOtherTyping && (
                    <div className="flex gap-4 max-w-[85%]">
                        <div className="size-8 bg-white border border-slate-100 rounded-full flex items-center justify-center">
                            <div className="size-1.5 bg-solar rounded-full animate-pulse"></div>
                            <div className="size-1.5 bg-solar rounded-full animate-pulse delay-75 mx-0.5"></div>
                            <div className="size-1.5 bg-solar rounded-full animate-pulse delay-150"></div>
                        </div>
                    </div>
                )}

                {loading && messages.length === 0 && (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin size-6 border-2 border-solar border-t-transparent rounded-full"></div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex items-end gap-2 bg-slate-50 rounded-lg p-2 border border-slate-100 transition-all focus-within:border-petroleum/40">
                    <button className="p-2 rounded-full text-slate-400 hover:text-petroleum hover:bg-white/50 transition-all">
                        <span className="material-symbols-outlined ds-icon-w300 text-xl">add_circle</span>
                    </button>
                    <textarea
                        className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-[13px] text-slate-700 placeholder:text-slate-400 resize-none py-2.5 max-h-32"
                        placeholder="Digite sua mensagem..."
                        rows="1"
                        value={chatInput}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (!sending) handleSend();
                            }
                        }}
                    ></textarea>
                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={!chatInput.trim() || sending}
                        className={`p-2 rounded-full transition-all shadow-none h-10 w-10 flex items-center justify-center active:scale-95 ${chatInput.trim() && !sending ? 'bg-solar text-white hover:bg-amber-600' : 'bg-slate-100 text-slate-300'}`}
                    >
                        {sending ? (
                            <span className="animate-spin size-5 border-2 border-slate-300 border-t-slate-600 rounded-full" />
                        ) : (
                            <span className="material-symbols-outlined ds-icon-w300 text-xl">send</span>
                        )}
                    </button>
                </div>
                <div className="mt-2 px-1 flex items-center justify-between gap-2">
                    <span className="ds-meta text-slate-400 font-medium">Pressione Enter para enviar, Shift + Enter para nova linha</span>
                    {sendError && (
                        <span className="ds-meta text-red-600 font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">error</span>
                            {sendError}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function MessageBubble({ msg }) {
    const isUser = msg.role === 'USER' || msg.role === 'AGENT' || msg.role === 'ASSISTANT';
    const isLead = msg.role === 'LEAD';
    const isSystem = msg.role === 'SYSTEM';

    if (isSystem) {
        return (
            <div className="flex justify-center my-4">
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 italic bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-lg">
                    {msg.content}
                </span>
            </div>
        );
    }

    return (
        <div className={`flex gap-4 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
            {!isUser && (
                <div className="bg-slate-50 border border-slate-100 rounded-full size-8 shrink-0 mt-1 flex items-center justify-center ds-meta text-slate-400">
                    {isLead ? 'L' : 'S'}
                </div>
            )}
            <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : ''}`}>
                <div className="flex items-baseline gap-2">
                    {!isUser && <span className="ds-meta text-slate-600">{isLead ? 'Lead' : 'Sistema'}</span>}
                    <span className="ds-meta text-slate-400 font-medium">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isUser && <span className="ds-meta text-slate-600 uppercase">Você</span>}
                </div>
                <div className={`p-4 rounded-2xl shadow-none text-sm leading-relaxed ${isUser
                    ? 'bg-slate-100 text-slate-800 rounded-tr-sm'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                    }`}>
                    {msg.content}
                </div>
                {isUser && (
                    <div className="ds-meta text-slate-400 flex items-center gap-1 mt-1 font-medium">
                        {msg.isOptimistic ? 'Enviando...' : (
                            <>
                                Lida <span className="material-symbols-outlined ds-icon-w300 text-[12px] text-solar">done_all</span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
