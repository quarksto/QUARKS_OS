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
                fixed top-0 right-0 h-screen bg-white shadow-2xl border-l border-slate-100 
                flex flex-col transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-50
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                ${widthClass}
            `}
        >
            {/* Header */}
            <header className="flex items-center justify-between px-6 h-16 shrink-0 z-10">
                <button
                    onClick={closeSidebar}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                    title="Fechar"
                >
                    <MdClose size={20} />
                </button>

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
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-4 scrollbar-hide relative" ref={scrollRef}>
                {messages.length === 0 ? (
                    // Empty State (Comet Style)
                    <div className="h-full flex flex-col items-center justify-center -mt-10 opacity-0 animate-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <div className="mb-6 relative">
                            <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-300 shadow-sm rotate-3">
                                <MdSmartToy size={32} />
                            </div>
                            <div className="absolute -inset-1 bg-slate-50 rounded-3xl -z-10 blur-sm"></div>
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
                                <div className={`max-w-[90%] ${msg.type === 'user' ? 'bg-slate-50 px-4 py-3 rounded-2xl rounded-br-sm text-slate-800 border border-slate-100' : 'text-slate-700 leading-relaxed'}`}>
                                    {/* User File Attachment */}
                                    {msg.file && (
                                        <div className="mb-2 p-2 bg-white rounded-lg border border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-500 shadow-sm">
                                            <MdAttachFile className="rotate-45" />
                                            {msg.file.name}
                                        </div>
                                    )}

                                    {/* Text Content */}
                                    <div className="text-[15px] whitespace-pre-wrap font-sans leading-relaxed flex items-center flex-wrap">
                                        {msg.text}
                                        {msg.type === 'ai' && isThinking && messages[messages.length - 1]?.id === msg.id && (
                                            <span className="inline-block w-1.5 h-4 bg-slate-400 ml-1 animate-pulse" />
                                        )}
                                    </div>

                                    {/* Action Card (if AI) */}
                                    {msg.action && (
                                        <div className="mt-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm max-w-sm">
                                            <div className="flex items-center gap-2 mb-2 text-slate-500">
                                                <MdBolt size={16} />
                                                <span className="text-[10px] font-bold text-slate-500">Ação Sugerida</span>
                                            </div>
                                            <button
                                                className="w-full bg-petroleum text-white py-2 rounded-lg font-medium text-xs hover:bg-petroleum-600 transition-all flex items-center justify-center gap-2 shadow-sm"
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
            <div className="p-6 pb-8 bg-white/90 backdrop-blur-md z-20">
                <InputArea
                    onSend={sendMessage}
                    disabled={isThinking}
                    activeContext={activeContext}
                />
            </div>
        </aside>
    );
};
