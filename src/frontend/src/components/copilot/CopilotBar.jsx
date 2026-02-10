import React from 'react';
import { useCopilot } from '../../context/CopilotContext';
import { Group, Box, Text, ActionIcon, Avatar, rem } from '@mantine/core';
// import { IconRobot, IconSparkles } from '@tabler/icons-react';

/**
 * Barra flutuante inferior que fornece acesso rápido ao Copilot.
 * Design premium com glassmorphism e micro-interações.
 */
export const CopilotBar = () => {
    const { isOpen, isThinking, messages, openSidebar, viewMode } = useCopilot();

    // Não mostrar se o Copilot já estiver aberto como sidebar
    if (isOpen) return null;

    const lastAiMessage = [...messages].reverse().find(m => m.type === 'ai');

    return (
        <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] group"
            style={{
                perspective: '1000px'
            }}
        >
            <div
                onClick={openSidebar}
                className={`
                    flex items-center gap-3 px-4 py-2.5 
                    bg-white/70 backdrop-blur-xl border border-white/50
                    shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full
                    cursor-pointer transition-all duration-500
                    hover:bg-white/90 hover:scale-105 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
                    active:scale-95
                `}
            >
                {/* AI Avatar Indicator */}
                <div className="relative">
                    <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        bg-petroleum
                        text-white shadow-sm ring-2 ring-white/20
                        ${isThinking ? 'animate-pulse' : 'group-hover:rotate-[360deg] duration-1000'}
                    `}>
                        <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                    </div>
                    {isThinking && (
                        <div className="absolute -top-1 -right-1 flex gap-0.5">
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className="w-1 h-1 bg-solar rounded-full animate-bounce"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col min-w-[140px] max-w-[300px]">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-petroleum-900 tracking-tight font-sans">SOLAR COPILOT</span>
                        {!isThinking && <span className="material-symbols-outlined text-[12px] text-solar opacity-60">auto_awesome</span>}
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 truncate lowercase font-sans">
                        {isThinking
                            ? 'Analisando dados...'
                            : (lastAiMessage?.text?.substring(0, 40) || 'Clique para perguntar qualquer coisa') + '...'}
                    </span>
                </div>

                {/* Key Shortcut Hint (Desktop Only) */}
                <div className="hidden sm:flex items-center ml-2 pl-3 border-l border-slate-200/50">
                    <div className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-[9px] font-bold text-slate-400 shadow-sm">
                        CTRL + J
                    </div>
                </div>
            </div>
        </div>
    );
};
