import React, { useRef, useEffect } from 'react';
import { useCopilot } from '../../context/CopilotContext';
import InputArea from '../chat/InputArea';
import { format } from 'date-fns';
import { MdClose, MdFullscreen, MdFullscreenExit, MdSmartToy, MdAttachFile, MdBolt, MdPlayArrow } from 'react-icons/md';

export const CopilotSidebar = () => {
    const {
        isOpen,
        viewMode,
        closeSidebar,
        toggleExpansion,
        messages,
        sendMessage,
        isThinking,
        activeContext,
        triggerAction,
        toggleSidebar
    } = useCopilot();

    // Global Keyboard Shortcut (Ctrl+J)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
                e.preventDefault();
                toggleSidebar();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    const scrollRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    // Derived Width Class
    const widthClass = viewMode === 'expanded' ? 'w-[80vw] max-w-[900px]' : 'w-[450px]';

    return (
        <aside
            className={`
                fixed top-0 right-0 h-screen bg-white border-l border-slate-100 
                flex flex-col transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-50
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                ${widthClass}
            `}
        >
            {/* Header */}
            <header className="flex flex-col px-6 pt-6 pb-2 shrink-0 z-10 border-b border-slate-50 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-solar flex items-center justify-center text-white">
                            <MdSmartToy size={18} />
                        </div>
                        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-tight">Solar Copilot</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleExpansion}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                            title={viewMode === 'expanded' ? 'Restaurar' : 'Expandir'}
                        >
                            {viewMode === 'expanded' ? (
                                <MdFullscreenExit size={20} />
                            ) : (
                                <MdFullscreen size={20} />
                            )}
                        </button>
                        <button
                            onClick={closeSidebar}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                            title="Fechar"
                        >
                            <MdClose size={20} />
                        </button>
                    </div>
                </div>

                {/* Active Context Indicator */}
                {activeContext && (
                    <div className="bg-slate-50 rounded-lg p-2.5 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-300">
                        <div className="flex items-center gap-2">
                            <div className="size-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                                {activeContext.type === 'lead' ? 'LD' : 'PR'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Atendimento</span>
                                <span className="text-[12px] font-semibold text-slate-700 truncate max-w-[200px] leading-tight">
                                    {activeContext.name || activeContext.id}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => { /* Opção de limpar contexto? */ }}
                            className="text-[10px] font-bold text-petroleum hover:underline uppercase tracking-tighter"
                        >
                            Limpar
                        </button>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-4 scrollbar-hide relative" ref={scrollRef}>
                {messages.length === 0 ? (
                    // Empty State (Comet Style)
                    <div className="h-full flex flex-col items-center justify-center -mt-10 opacity-0 animate-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <div className="mb-6 relative">
                            <div className="w-16 h-16 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-300 rotate-3">
                                <MdSmartToy size={32} />
                            </div>
                            <div className="absolute -inset-1 bg-slate-50 rounded-lg -z-10 blur-sm"></div>
                        </div>
                        <h2 className="ds-title-page text-center mb-2 text-slate-800">
                            Como posso ajudar?
                        </h2>
                        <p className="ds-body text-center max-w-[260px] text-slate-500">
                            Analiso seus leads, projetos e dados comerciais em tempo real.
                        </p>
                    </div>
                ) : (
                    // Chat Messages
                    <div className="space-y-8 py-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col gap-2 ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>

                                {/* Message Bubble / Text */}
                                <div className={`max-w-[90%] ${msg.type === 'user' ? 'bg-slate-50 px-4 py-3 rounded-lg rounded-br-sm text-slate-800 border border-slate-100' : 'text-slate-700 leading-relaxed'}`}>
                                    {/* User File Attachment */}
                                    {msg.file && (
                                        <div className="mb-2 p-2 bg-white rounded-md border border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-500">
                                            <MdAttachFile className="rotate-45" />
                                            {msg.file.name}
                                        </div>
                                    )}

                                    {/* Text Content */}
                                    <div className="text-[13px] whitespace-pre-wrap font-sans leading-relaxed flex items-center flex-wrap">
                                        {msg.text}
                                        {msg.type === 'ai' && isThinking && messages[messages.length - 1]?.id === msg.id && (
                                            <span className="inline-block w-1.5 h-4 bg-solar/50 ml-1 animate-pulse" />
                                        )}
                                    </div>

                                    {/* Action Card (if AI) */}
                                    {msg.action && (
                                        <div className="mt-3 bg-white border border-slate-100 rounded-lg p-3 max-w-sm">
                                            <div className="flex items-center gap-2 mb-2 text-slate-500">
                                                <MdBolt size={16} />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ação Sugerida</span>
                                            </div>
                                            <button
                                                className="w-full bg-petroleum text-white py-2 rounded-full font-bold text-[11px] hover:bg-petroleum-600 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                                                onClick={() => triggerAction(msg.action.type, msg.action.payload)}
                                            >
                                                <MdPlayArrow size={16} />
                                                Executar
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Metadata/Timestamp */}
                                <span className="ds-meta px-1">
                                    {msg.type === 'ai' ? 'Solar Copilot' : 'Você'}
                                </span>
                            </div>
                        ))}

                        {/* Thinking Indicator (Minimal) */}
                        {isThinking && (
                            <div className="flex items-center gap-2 text-slate-400 pl-1">
                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></span>
                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                <span className="w-2 h-2 bg-slate-300 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Input Area */}
            <div className="p-6 pb-8 bg-white z-20 border-t border-slate-50">
                <InputArea
                    onSend={sendMessage}
                    disabled={isThinking}
                    activeContext={activeContext}
                />
            </div>
        </aside>
    );
};
