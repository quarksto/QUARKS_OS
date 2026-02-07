import React, { useRef, useEffect } from 'react';
import useChat from '../hooks/useChat';
import { useAuth } from '../contexts/AuthContext';
import InputArea from '../components/chat/InputArea';
import { API_BASE } from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';

const ChatPage = () => {
    const { user } = useAuth();
    // Passando userId para o hook useChat (se ele aceitar)
    const { messages, sendMessage, loading } = useChat(user?.id);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <DashboardShell
            title="Copilot IA"
            subtitle="Assistente de Vendas Solar"
            headerIcon="smart_toy"
        >
            <div className="flex flex-col h-full min-h-0 bg-transparent">
                <div className="flex-1 min-h-0 overflow-y-auto p-6 max-w-4xl mx-auto w-full" ref={scrollRef}>
                    {messages.length === 0 && (
                        <div className="text-center text-slate-500 mt-20">
                            <p className="ds-body">Olá! Sou seu assistente de vendas solar.</p>
                            <p className="ds-meta mt-1">Peça uma proposta ou envie uma conta de luz.</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`
                                        max-w-[85%] p-5 rounded-2xl whitespace-pre-wrap shadow-sm text-sm leading-relaxed
                                        ${msg.role === 'user'
                                            ? 'bg-petroleum text-white rounded-br-none'
                                            : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                                        }`}
                                >
                                    {msg.file && (
                                        <div className="text-xs opacity-70 mb-2 flex items-center gap-1 pb-2 border-b border-white/20">
                                            <span className="material-symbols-outlined text-[10px]">attachment</span>
                                            {msg.file}
                                        </div>
                                    )}
                                    {msg.content.split(/(!?\[.*?\]\(.*?\))/g).map((part, i) => {
                                        const imgMatch = part.match(/!\[Image\]\((.*?)\)/);
                                        if (imgMatch) {
                                            return (
                                                <img
                                                    key={i}
                                                    src={`${API_BASE}${imgMatch[1]}`}
                                                    alt="Generated"
                                                    className="mt-3 rounded-lg max-w-full h-auto shadow-sm border border-slate-200"
                                                />
                                            );
                                        }
                                        const vidMatch = part.match(/\[VIDEO GENERATED\]\((.*?)\)/);
                                        if (vidMatch) {
                                            return (
                                                <video
                                                    key={i}
                                                    controls
                                                    className="mt-3 rounded-lg max-w-full h-auto shadow-sm border border-slate-200"
                                                >
                                                    <source src={`${API_BASE}${vidMatch[1]}`} type="video/mp4" />
                                                    Seu navegador não suporta vídeos.
                                                </video>
                                            );
                                        }
                                        return <span key={i}>{part}</span>;
                                    })}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium ml-1">Digitando...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-slate-200/40 bg-[#F8FAFC] p-4">
                    <div className="technical-card p-4 max-w-4xl mx-auto">
                        <InputArea onSend={sendMessage} disabled={loading} />
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
};

export default ChatPage;
